"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _css = _interopRequireDefault(require("../lib/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const colorMap = {
  primary: "#f44336",
  social: "#2962ff",
  promotions: "#2e7d32"
};
const iconMap = {
  primary: "inbox",
  social: "user-friends",
  promotions: "tag"
};
const Icon = _css.default.i`
  margin: 0 20px;
`;
const Box = _css.default.div`
  --height: 55px;
  display: inline-block;
  position: relative;
  height: var(--height);
  line-height: var(--height);
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: start;
  text-transform: capitalize;
  width: 250px;
  color: ${({
  active,
  name
}) => active ? colorMap[name] : "gray"};
  cursor: pointer;
  transition: background 0.02s ease-in-out;
`.and`::after {
  content: "";
  position: absolute;
  left: 5%;
  bottom: 0;
  border-radius: 3px 3px 0 0;
  width: 90%;
  height: 3px;
  background: ${({
  active,
  name
}) => active ? colorMap[name] : "transparent"};
}`.and`:hover {
  background: var(--light-gray);
}`;

const Tab = () => ({
  name,
  key,
  onclick,
  active
}) => {
  return (// use transform
    [[Box, {
      active: active,
      name: name,
      key: key,
      onclick: onclick
    }, [[Icon, {
      className: `fas fa-${iconMap[name]}`
    }, []], ["p", {}, name]]]]
  );
};

var _default = Tab;
exports.default = _default;