"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const selected = Symbol("selected");

const useSelection = state => {
  state[selected] = state[selected] || [];

  const getSelected = () => state[selected];

  const setSelected = v => state[selected] = v;

  return {
    getSelected,
    setSelected
  };
};

var _default = useSelection;
exports.default = _default;