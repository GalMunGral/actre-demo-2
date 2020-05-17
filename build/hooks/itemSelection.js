"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const useItemSelection = selection => {
  const {
    getSelected,
    setSelected
  } = selection;

  const toggleItem = (item, shouldSelect) => {
    const selected = getSelected();

    if (shouldSelect) {
      if (selected.includes(item.id)) return;
      setSelected([...selected, item.id]);
    } else {
      setSelected(selected.filter(e => e !== item.id));
    }
  };

  return {
    getSelected,
    setSelected,
    toggleItem
  };
};

var _default = useItemSelection;
exports.default = _default;