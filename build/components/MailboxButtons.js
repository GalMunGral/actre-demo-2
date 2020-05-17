"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Checkbox = _interopRequireDefault(require("./Checkbox"));

var _IconButton = _interopRequireDefault(require("./IconButton"));

var _Space = _interopRequireDefault(require("./Space"));

var _css = _interopRequireDefault(require("../lib/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Progress = _css.default.div`
  flex: 0 0 200px;
  text-align: end;
`;
const Text = _css.default.span`
  font-size: 0.9rem;
  color: gray;
  margin: 0 20px;
`;

const MailboxButtons = (_, context) => () => {
  const {
    getPageStart,
    getPageEnd,
    getTotal,
    nextPage,
    prevPage,
    allSelected,
    toggleAll
  } = context.pagination;
  const {
    getFolder
  } = context.route;
  const start = getPageStart();
  const end = getPageEnd();
  const total = getTotal();
  const folder = getFolder();
  return (// use transform
    [folder !== "trash" ? [_Checkbox.default, {
      checked: allSelected(),
      onchange: toggleAll
    }, []] : null, [_Space.default, {}, []], [Progress, {}, [[Text, {
      innerHTML: `${start}&ndash;${Math.min(end, total)} of ${total}`
    }, []]]], [_IconButton.default, {
      onclick: prevPage,
      type: "angle-left"
    }, []], [_IconButton.default, {
      onclick: nextPage,
      type: "angle-right"
    }, []]]
  );
};

var _default = MailboxButtons;
exports.default = _default;