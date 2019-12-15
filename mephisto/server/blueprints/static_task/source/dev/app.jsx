/*
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Bowser from 'bowser';
import {Button} from 'react-bootstrap';

/* global
  getWorkerName, getAssignmentId, getWorkerRegistrationInfo,
  getAgentRegistration, handleSubmitToProvider
*/

/* ================= Utility functions ================= */

// Determine if the browser is a mobile phone
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function clickDone(provider_worker_id, assignment_id, task_data) {
  // At the moment this function simply calls the submit method,
  // will later also have to talk to the server and maybe do validation
  // TODO validate entry
  // TODO talk to the server
  handleSubmitToProvider(provider_worker_id, assignment_id, task_data);
}

function postData(url = '', data = {}) {
  // Default options are marked with *
  return fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
}

function postProviderRequest(endpoint, data, callback_function) {
  var url = new URL(window.location.origin + endpoint);
  postData(url, {provider_data: data})
    .then(res => res.json())
    .then(function(data) {
      if (callback_function) {
        callback_function(data);
      }
    });
}

function requestAgent(mephisto_worker_id, callback_function) {
  postProviderRequest('/request_agent', getAgentRegistration(mephisto_worker_id), callback_function);
}

function registerWorker(callback_function) {
  postProviderRequest('/register_worker', getWorkerRegistrationInfo(), callback_function);
}

// Sends a request to get the initial task data
function getInitTaskData(mephisto_worker_id, assignment_id, callback_function) {
  var url = new URL(window.location.origin + '/initial_task_data')
  var params = {'mephisto_worker_id': mephisto_worker_id, 'assignment_id': assignment_id};
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  fetch(url)
    .then(res => res.json())
    .then(function(data) {
    if (callback_function) {
      callback_function(data);
    }
  });
}

/* ================= Application Components ================= */

class MainApp extends React.Component {
  constructor(props) {
    super(props);

    let provider_worker_id = getWorkerName();
    let assignment_id = getAssignmentId();
    let render_html = "<h1>Display Preview Here</h1>";
    if (provider_worker_id !== null && assignment_id !== null) {
      render_html =  "<h1>Loading...</h1>";
    }

    this.state = {
      base_html: null,
      render_html: render_html,
      provider_worker_id: provider_worker_id,
      mephisto_worker_id: null,
      agent_id: null,
      assignment_id: assignment_id,
      task_data: null,
    };

    this.raw_html_elem = null;
  }

  handleIncomingTaskData(data) {
    let base_html = data['html'];
    let fin_html = base_html;
    delete data['html'];
    let task_data = data;

    for (let [key, value] of Object.entries(task_data)) {
      let find_string = "${" + key + "}";
      fin_html = fin_html.replace(find_string, value);
    }

    this.setState({
      base_html: base_html,
      render_html: fin_html,
      task_data: task_data,
    });
  }

  afterAgentRegistration(agent_data_packet) {
    console.log(agent_data_packet);
    let agent_id = agent_data_packet.data.agent_id;
    this.setState({agent_id: agent_id});
    if (agent_id !== null) {
      getInitTaskData(this.state.mephisto_worker_id, this.state.assignment_id, data => this.handleIncomingTaskData(data));
    } else {
      // TODO handle agent not being able to be
      // assigned work
      console.log('agent_id returned was null')
    }
  }

  afterWorkerRegistration(worker_data_packet) {
    let mephisto_worker_id = worker_data_packet.data.worker_id;
    this.setState({mephisto_worker_id: mephisto_worker_id});
    if (mephisto_worker_id !== null) {
      requestAgent(mephisto_worker_id, data => this.afterAgentRegistration(data))
    } else {
      // TODO handle banned/blocked worker ids
      console.log('worker_id returned was null')
    }
  }

  componentDidMount() {
    let provider_worker_id = this.state.provider_worker_id;
    let assignment_id = this.state.assignment_id;
    if (assignment_id != null && provider_worker_id != null) {
      registerWorker(data => this.afterWorkerRegistration(data));
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(data, this.state.provider_worker_id);
  }

  render() {
    let dangerous_html = <div
      ref={elem => {this.raw_html_elem = elem}}
      dangerouslySetInnerHTML={{__html: this.state.render_html}}
    />;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {dangerous_html}
          <Button>
            <span
              style={{ marginRight: 5 }}
              className="glyphicon glyphicon-ok"
            />
            Submit
          </Button>
        </form>
      </div>
    );
  }

  handleUpdatingRemainingScripts(curr_counter, scripts_left) {
    if (scripts_left.length == 0) {
      return;
    }
    let curr_script_name = "POST_LOADED_SCRIPT_" + curr_counter;
    let script_to_load = scripts_left.shift()
    if (script_to_load.text == '') {
      var head= document.getElementsByTagName('head')[0];
      var script= document.createElement('script');
      script.onload = () => {
        this.handleUpdatingRemainingScripts(curr_counter+1, scripts_left)
      };
      script.async = 1;
      script.src = script_to_load.src;
      head.appendChild(script);
    } else {
      const script_text = script_to_load.text;
      // This magic lets us evaluate a script from the global context
      (1, eval)(script_text);
      this.handleUpdatingRemainingScripts(curr_counter+1, scripts_left);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // When the inner html has changed, we need to execute scripts!
    if (this.state.render_html != prevState.render_html) {
      let children = this.raw_html_elem.children;
      let scripts_to_load = [];
      for (let child of children) {
        let post_load_script_count = 0
        if (child.tagName == "SCRIPT") {
          scripts_to_load.push(child);
        }
      }
      if (scripts_to_load.length > 0) {
        this.handleUpdatingRemainingScripts(0, scripts_to_load);
      }
    }
  }
}

ReactDOM.render(<MainApp />, document.getElementById('app'));
