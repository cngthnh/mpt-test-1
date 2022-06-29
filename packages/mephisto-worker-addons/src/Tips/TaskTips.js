import React from "react";

function TaskTips({ tipsArr, stylePrefix, maxPopupHeight }) {
  const tipsComponents = tipsArr.map((tip, index) => {
    return (
      <li key={`tip-${index + 1}`} className={`${stylePrefix}tip`}>
        <h2 className={`${stylePrefix}tip-header2`}>{tip.header}</h2>
        <p className={`${stylePrefix}tip-text`}>{tip.text}</p>
      </li>
    );
  });

  return (
    <ul
      style={{ maxHeight: `calc(${maxPopupHeight}/2)` }}
      className={`${stylePrefix}tips-list`}
    >
      {tipsArr.length <= 0 ? (
        <li className={`${stylePrefix}tip`}>
          <h2 className={`${stylePrefix}tip-header2  ${stylePrefix}no-margin`}>
            There are no submitted tips!
          </h2>
        </li>
      ) : (
        tipsComponents
      )}
    </ul>
  );
}
export default TaskTips;
