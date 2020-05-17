"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _css = _interopRequireDefault(require("../lib/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Menu = _css.default.div`
  grid-area: b;
  transition: width 0.05s ease-out;
  background: white;
  overflow: hidden;
  width: ${({
  collapsed
}) => collapsed ? 72 : 250}px;
  display: flex;
  flex-direction: column;
  align-items: ${({
  collapsed
}) => collapsed ? "center" : "start"};
`;
const MenuIcon = _css.default.i`
  width: 1rem;
  font-size: 1rem;
`;
const ButtonIcon = _css.default.img`
  --size: 32px;
  width: var(--size);
  height: var(--size);
`;
const Button = _css.default.button`
  --size: 50px;
  width: ${({
  collapsed
}) => collapsed ? "var(--size)" : "150px"};
  height: var(--size);
  margin: 15px 10px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  outline: none;
  border: none;
  border-radius: calc(0.5 * var(--size));
  box-shadow: 0 1px 3px 1px var(--gray);
  transition: width 0.2s;
  font-family: inherit;
  cursor: pointer;
  transition: box-shadow 0.2s;
`.and`:hover {
  box-shadow: 0 5px 10px 0 var(--gray);
}`.and`:active {
  background: var(--light-gray);
}
`;
const ButtonText = _css.default.span`
  margin-left: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--dark-gray);
`;
const MenuItem = _css.default.div`
  --size: 35px;
  height: var(--size);
  line-height: 1rem;
  width: ${({
  collapsed
}) => collapsed ? "var(--size)" : "80%"};
  padding: 0 ${({
  collapsed
}) => collapsed ? "0" : "10px"};
  margin: 0 ${({
  collapsed
}) => collapsed ? "10px" : "0"};
  display: flex;
  align-items: center;
  justify-content: ${({
  collapsed
}) => collapsed ? "center" : "start"};
  border-top-right-radius: calc(0.5 * var(--size));
  border-bottom-right-radius: calc(0.5 * var(--size));
  border-top-left-radius: ${({
  collapsed
}) => collapsed ? "calc(0.5 * var(--size))" : "0"};
  border-bottom-left-radius: ${({
  collapsed
}) => collapsed ? "calc(0.5 * var(--size))" : "0"};
  background: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: ${({
  activated
}) => activated ? "700" : "600"};
  color: ${({
  activated
}) => activated ? "var(--theme)" : "gray"};
  background: ${({
  activated
}) => activated ? "var(--theme-light)" : "white"};
  cursor: pointer;
  transition: all 0.2s;\

`.and`:hover {
  background: ${({
  activated
}) => activated ? "var(--theme-light)" : "var(--light-gray)"};
}
`.and`:active {
  background: ${({
  activated
}) => activated ? "var(--theme-light)" : "var(--gray)"};
}
`.and` > i {
  margin: 0 ${({
  collapsed
}) => collapsed ? "0" : "20px"};
  color: inherit;
}
`.and` * {
  pointer-events: none;
}
`;
const iconMap = {
  inbox: "inbox",
  sent: "paper-plane",
  drafts: "scroll"
};

const SideBar = (state, context) => {
  const {
    getFolder,
    navigate
  } = context.route;
  const {
    dispatch,
    Type: T
  } = context.store;
  const {
    getSelected,
    setSelected
  } = context.selection;
  const {
    getEditing,
    createDraft,
    open
  } = context.editor;
  state.hovered = false;
  state.dropZoneActive = false;
  return ({
    collapsed
  }) => {
    const folder = getFolder();
    const selected = getSelected();
    const editing = getEditing();

    const deleteAll = () => {
      dispatch(d => {
        setTimeout(() => {
          d({
            type: T.DELETE_SELECTED,
            payload: {
              folder,
              selected
            }
          });
          setSelected([]);
        }, 200);
      });
    };

    return (// use transform
      [[Menu, {
        collapsed: collapsed && !state.hovered,
        onmouseenter: () => state.hovered = true,
        onmouseleave: () => state.hovered = false
      }, [[Button, {
        collapsed: collapsed && !state.hovered,
        onclick: () => {
          if (!editing) {
            createDraft();
            open();
          }
        }
      }, [[ButtonIcon, {
        src: "assets/create.png"
      }, []], !collapsed || state.hovered ? [ButtonText, {}, "Compose"] : null]], ...["inbox", "sent", "drafts"].map(folder => [MenuItem, {
        collapsed: collapsed && !state.hovered,
        activated: getFolder() === folder,
        onclick: () => navigate("/" + folder)
      }, [[MenuIcon, {
        className: `fas fa-${iconMap[folder]}`
      }, []], !collapsed || state.hovered ? ["span", {}, folder] : null]]), [MenuItem, {
        collapsed: collapsed && !state.hovered,
        activated: getFolder() === "trash",
        style: {
          background: state.dropZoneActive ? "var(--theme)" : "",
          color: state.dropZoneActive ? "white" : ""
        },
        onclick: () => navigate("/trash"),
        ondragenter: e => {
          e.preventDefault();
          e.stopPropagation();
          state.dropZoneActive = true;
        },
        ondragover: e => {
          e.preventDefault();
          e.stopPropagation();
        },
        ondragleave: () => {
          state.dropZoneActive = false;
        },
        ondrop: () => {
          deleteAll();
          state.dropZoneActive = false;
        }
      }, [[MenuIcon, {
        className: "fas fa-trash"
      }, []], !collapsed || state.hovered ? ["span", {}, "trash"] : null]]]]]
    );
  };
};

var _default = SideBar;
exports.default = _default;