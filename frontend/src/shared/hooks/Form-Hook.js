import { useCallback, useReducer } from "react";

const reducerFn = (state, action) => {
  switch (action.type) {
    case "INPUT-CHANGE":
      let formIsValid = true;
      for (let inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };
    case "LOAD-DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

export const useFormHook = (initialInputs, initialFormValidty) => {
  const [formState, dispatch] = useReducer(reducerFn, {
    inputs: initialInputs,
    isValid: initialFormValidty,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT-CHANGE",
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  const loadData = useCallback((loadedInputs, formLoadedValidity) => {
    dispatch({
      type: "LOAD-DATA",
      inputs: loadedInputs,
      formIsValid: formLoadedValidity,
    });
  }, []);

  return [formState, inputHandler, loadData];
};
