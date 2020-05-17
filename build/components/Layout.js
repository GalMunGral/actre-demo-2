"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _css = _interopRequireDefault(require("../lib/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Container = _css.default.div`
  grid-area: c;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Toolbar = _css.default.div`
  flex: 0 0 50px;
  border-bottom: 1px solid var(--light-gray);
  display: flex;
  justify-content: start;
  align-items: center;
  padding-left: 10px;
  padding-right: 30px;
`;
const Scrollable = _css.default.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding-bottom: 80px;
`.and`::-webkit-scrollbar-thumb {
  background: var(--gray);
}`.and`::-webkit-scrollbar {
  width: 10px;
}`;

const Layout = () => (_, [buttons, body]) => {
  return (// use transform
    [[Container, {}, [[Toolbar, {}, [buttons]], [Scrollable, {}, [body]]]]]
  );
};

var _default = Layout;
exports.default = _default;