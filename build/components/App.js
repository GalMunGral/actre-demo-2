"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _store = _interopRequireDefault(require("../hooks/store"));

var _selection = _interopRequireDefault(require("../hooks/selection"));

var _pagination = _interopRequireDefault(require("../hooks/pagination"));

var _editor = _interopRequireDefault(require("../hooks/editor"));

var _route = _interopRequireDefault(require("../hooks/route"));

var _AppBar = _interopRequireDefault(require("./AppBar"));

var _Mailbox = _interopRequireDefault(require("./Mailbox"));

var _SideBar = _interopRequireDefault(require("./SideBar"));

var _NewMessage = _interopRequireDefault(require("./NewMessage"));

var _css = _interopRequireDefault(require("../lib/css"));

var _Detail = _interopRequireDefault(require("./Detail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Container = _css.default.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template:
    "a a" 64px
    "b c" calc(100vh - 60px) / auto 1fr;
`;

const App = (state, context) => {
  context.store = (0, _store.default)(context);
  context.editor = (0, _editor.default)(context, context.store);
  context.route = (0, _route.default)(context);
  context.selection = (0, _selection.default)(context);
  context.pagination = (0, _pagination.default)(context, 50, {
    store: context.store,
    route: context.route,
    selection: context.selection
  });
  state.collapsed = false;
  return () => {
    const mailId = context.route.getMailId();
    const editing = context.editor.getEditing();
    return (// use transform
      [[Container, {}, [[_AppBar.default, {
        toggle: () => state.collapsed = !state.collapsed
      }, []], [_SideBar.default, {
        collapsed: state.collapsed,
        setCollapse: v => state.setCollapse(v)
      }, []], mailId ? [_Detail.default, {
        mailId: mailId
      }, []] : [_Mailbox.default, {}, []], editing ? [_NewMessage.default, {}, []] : null]]]
    );
  };
};

var _default = App;
exports.default = _default;