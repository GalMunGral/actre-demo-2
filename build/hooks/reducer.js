"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const useReducer = (state, reducer, initialState) => {
  const key = Symbol("[reducer]");
  state[key] = initialState;
  return {
    getState: () => state[key],
    dispatch: action => {
      state[key] = reducer(state[key], action);
    }
  };
};

var _default = useReducer;
exports.default = _default;