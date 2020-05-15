import css from "../lib/css";
import createIcon from "../assets/create.png";
import useStoreAsync from "../hooks/store";

const menu = css`
  grid-area: b;
  transition: width 0.05s ease-out;
  background: white;
  overflow: hidden;
  width: ${(collapsed) => (collapsed ? 72 : 250)}px;
  display: flex;
  flex-direction: column;
  align-items: ${(collapsed) => (collapsed ? "center" : "start")};
`;

const fixedWidth = css`
  width: 2rem;
  font-size: 1rem;
`;
const icon = css`
  --size: 32px;
  width: var(--size);
  height: var(--size);
`;

const button = css`
  --size: 50px;
  width: ${(collapsed) => (collapsed ? "var(--size)" : "150px")};
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

const buttonText = css`
  margin-left: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--dark-gray);
`;

const menuItem = css`
  --size: 35px;
  height: var(--size);
  line-height: 1rem;
  width: ${({ collapsed }) => (collapsed ? "var(--size)" : "80%")};
  padding: 0 ${({ collapsed }) => (collapsed ? "0" : "10px")};
  margin: 0 ${({ collapsed }) => (collapsed ? "10px" : "0")};
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => (collapsed ? "center" : "start")};
  border-top-right-radius: calc(0.5 * var(--size));
  border-bottom-right-radius: calc(0.5 * var(--size));
  border-top-left-radius: ${({ collapsed }) =>
    collapsed ? "calc(0.5 * var(--size))" : "0"};
  border-bottom-left-radius: ${({ collapsed }) =>
    collapsed ? "calc(0.5 * var(--size))" : "0"};
  background: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: ${({ activated }) => (activated ? "700" : "600")};
  color: ${({ activated }) => (activated ? "var(--theme)" : "gray")};
  background: ${({ activated }) =>
    activated ? "var(--theme-light)" : "white"};
  cursor: pointer;
  transition: all 0.2s;
`.and`:hover {
  background: ${({ activated }) =>
    activated ? "var(--theme-light)" : "var(--light-gray)"};
}`.and`:active {
  background: ${({ activated }) =>
    activated ? "var(--theme-light)" : "var(--gray)"};
}`.and` > i {
  width: 20px;
  margin: 0 ${({ collapsed }) => (collapsed ? "0" : "20px")};
  color: inherit;
}`;

const iconMap = {
  inbox: "inbox",
  sent: "paper-plane",
  drafts: "scroll",
};

const SideBar = (state, context) => {
  const { getFolder, setFolder } = context.route;
  const { dispatch, Type: T } = context.store;
  const { getSelected, setSelected } = context.selection;
  const { createDraft, open } = context.editor;

  state.hovered = false;
  state.dropZoneActive = false;

  return ({ collapsed }) => {
    const folder = getFolder();
    const selected = getSelected();

    const deleteAll = () => {
      dispatch((d) => {
        setTimeout(() => {
          d({
            type: T.DELETE_SELECTED,
            payload: { folder, selected },
          });
          setSelected([]);
        }, 200);
      });
    };

    return (
      // use transform
      div(
        (className = menu(collapsed && !state.hovered)),
        (onmouseenter = () => (state.hovered = true)),
        (onmouseleave = () => (state.hovered = false)),
        [
          button(
            (className = button(collapsed && !state.hovered)),
            (onclick = () => {
              if (!editing) {
                createDraft();
                open();
              }
            }),
            [
              img((className = icon()), (src = createIcon)),
              !collapsed || state.hovered
                ? span((className = buttonText()), "Compose")
                : null,
            ]
          ),
          ...["inbox", "sent", "drafts"].map((folder) =>
            div(
              (className = menuItem({
                collapsed: collapsed && !state.hovered,
                activated: getFolder() === folder,
              })),
              (onclick = () => setFolder(folder)),
              [
                i((className = `fas fa-${iconMap[folder]} ${fixedWidth()}`)),
                !collapsed || state.hovered ? span(folder) : null,
              ]
            )
          ),
          div(
            (className = menuItem({
              collapsed: collapsed && !state.hovered,
              activated: getFolder() === "trash",
            })),
            (style = {
              background: state.dropZoneActive ? "var(--theme)" : "",
              color: state.dropZoneActive ? "white" : "",
            }),
            (onclick = () => setFolder("trash")),
            (ondragenter = (e) => {
              e.preventDefault();
              e.stopPropagation();
              state.dropZoneActive = true;
            }),
            (ondragover = (e) => {
              e.preventDefault();
              e.stopPropagation();
            }),
            (ongragleave = () => {
              state.dropZoneActive = false;
            }),
            (ondrop = () => {
              deleteAll();
              state.dropZoneActive = false;
            }),
            [
              i((className = `fas fa-trash ${fixedWidth()}`)),
              !collapsed || state.hovered ? span("trash") : null,
            ]
          ),
        ]
      )
    );
  };
};

export default SideBar;
