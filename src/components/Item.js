import _ from "lodash";
import Checkbox from "./Checkbox";
import IconButton from "./IconButton";
import css from "../lib/css";
import useItemSelection from "../hooks/itemSelection";

const row = css`
  --height: 40px;
  position: relative;
  height: var(--height);
  line-height: var(--height);
  padding: 0 10px;
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  background-color: ${(selected) => (selected ? "var(--highlight)" : "white")};
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`.and`:active {
  cursor: grabbing;
}`.and`:hover {
  background: ${(selected) => (selected ? "var(--highlight)" : "white")};
  filter: brightness(0.95);
`.and`:hover * {
  visibility: visible;
}`;

const sender = css`
  flex: 0 0 200px;
  font-weight: 600;
`;

const summary = css`
  flex: 1 1 auto;
  line-height: 1rem;
`;

const title = css`
  font-weight: 600;
  font-size: 1rem;
  text-transform: capitalize;
`;

const preheader = css`
  font-weight: 300;
  font-size: 1rem;
  color: gray;
`;

const actions = css`
  margin-right: 30px;
  flex: 0 0 auto;
  visibility: hidden;
  color: var(--gray);
`;

const format = (length) => (s) =>
  s.length <= length ? s : s.slice(0, length) + "...";

const Item = (state, context) => {
  const { dispatch, Type: T } = context.store;
  const { replaceDraft, setEditing } = context.editor;
  const { getFolder, setMailId } = context.route;
  const { getSelected, setSelected, toggleItem } = useItemSelection(
    context.selection
  );

  const OFFSET = 15;
  let setCoordinatesThrottled;
  let timer;

  return ({ item, setCoordinates, setDragging }) => {
    const { id, senderName, senderEmail, subject, content } = item;
    const folder = getFolder();
    const selected = getSelected();
    const isItemSelected = selected.includes(item.id);

    const deleteItem = () => {
      dispatch((d) => {
        setTimeout(() => {
          d({
            type: T.DELETE,
            payload: {
              folder,
              id,
            },
          });
        }, 200);
      });
    };

    setCoordinatesThrottled =
      setCoordinatesThrottled ||
      _.throttle((x, y) => {
        setCoordinates(x, y);
        setDragging(true);
      });

    const ondrag = (e) =>
      setCoordinatesThrottled(e.clientX - OFFSET, e.clientY - OFFSET);
    const ondragstart = (e) => e.dataTransfer.setDragImage(new Image(), 0, 0);
    const ondragend = () => setDragging(false);

    const onmousedown = () => {
      timer = setTimeout(() => {
        toggleItem(item, true);
        timer = null;
      }, 300);
    };

    const onmouseup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        if (folder === "drafts") {
          replaceDraft(item);
          setEditing(true);
        } else {
          setSelected([]);
          setMailId(item.id);
        }
      }
    };

    return (
      // use transform
      div(
        (className = row(isItemSelected)),
        (draggable = folder !== "trash"),
        (ondragstart = ondragstart),
        (ondrag = ondrag),
        (ondragend = ondragend),
        (onmousedown = onmousedown),
        (onmouseup = onmouseup),
        [
          folder !== "trash"
            ? Checkbox(
                (checked = isItemSelected),
                (onchange = () => toggleItem(item, !isItemSelected))
              )
            : null,
          div((className = sender()), senderName || senderEmail || "(no name)"),
          div((className = summary()), [
            span((className = title()), format(30)(subject) || "(empty)"),
            span(
              (className = preheader()),
              (innerHTML = `&nbsp;&mdash;&nbsp;${
                format(50)(content) || "(empty)"
              }`)
            ),
          ]),
          folder !== "trash"
            ? div((className = actions()), [
                IconButton(
                  (type = "trash"),
                  (onclick = deleteItem),
                  (onmousedown = (e) => e.stopPropagation()),
                  (onmouseup = (e) => e.stopPropagation())
                ),
              ])
            : null,
        ]
      )
    );
  };
};

export default Item;
