"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _css = _interopRequireDefault(require("../lib/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Button = _css.default.button`
  --size: 40px;
  border: none;
  outline: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  width: var(--size);
  height: var(--size);
  border-radius: calc(0.5 * var(--size));
  cursor: pointer;
`.and`:hover {
  background: var(--light-gray);
}`.and`:hover i {
  filter: brightness(0.8);
}`.and`:active {
  background: var(--gray);
}`;
const Icon = _css.default.i`
  color: gray;
`;

const IconButton = () => ({
  type,
  onclick
}) => // use transform
[[Button, {
  onclick: onclick,
  onmousedown: e => e.stopPropagation(),
  onmouseup: e => e.stopPropagation()
}, [[Icon, {
  className: `fas fa-${type}`
}, []]]]];

var _default = IconButton;
exports.default = _default;