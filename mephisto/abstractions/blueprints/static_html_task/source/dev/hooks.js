import { useState, useCallback, useEffect } from "react";

/**
 * This hook is to be used with events that are supposed to update state when they are consumed.
 * @param {string} eventName
 * @param {any} defaultValue
 * @param {function} validatorFunction
 * @returns [any any]
 */
export function useMephistoGlobalConfig(
  eventName,
  defaultValue,
  validatorFunction
) {
  const [configState, setConfigState] = useState(defaultValue ?? false);

  const handleEvent = useCallback(
    (eventValue) => {
      if (validatorFunction) {
        if (validatorFunction(eventValue)) {
          setConfigState(eventValue);
        }
      } else setConfigState(eventValue);
    },
    [setConfigState]
  );

  useEffect(() => {
    window._MEPHISTO_CONFIG_.EVENT_EMITTER.on(eventName, handleEvent);
  }, [setConfigState]);

  return [configState, setConfigState];
}
