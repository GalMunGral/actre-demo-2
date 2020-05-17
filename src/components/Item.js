import _ from "lodash";
import Checkbox from "./Checkbox";
import IconButton from "./IconButton";
import styled from "../lib/css";
import useItemSelection from "../hooks/itemSelection";

const Row = styled.div`
  --height: 40px;
  position: relative;
  height: var(--height);
  line-height: var(--height);
  padding: 0 10px;
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  background-color: ${({ selected }) =>
    selected ? "var(--highlight)" : "white"};
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`.and`:active {
  cursor: grabbing;
}`.and`:hover {
  background: ${({ selected }) => (selected ? "var(--highlight)" : "white")};
  filter: brightness(0.95);
`.and`:hover * {
  visibility: visible;
}`;

const Sender = styled.div`
  flex: 0 0 200px;
  font-weight: 600;
`;

const Summary = styled.div`
  flex: 1 1 auto;
  line-height: 1rem;
`;

const Title = styled.span`
  font-weight: 600;
  font-size: 1rem;
  text-transform: capitalize;
`;

const Preheader = styled.span`
  font-weight: 300;
  font-size: 1rem;
  color: gray;
`;

const Actions = styled.div`
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
  const { setSelected, toggleItem } = useItemSelection(context.selection);

  const OFFSET = 15;
  let setCoordinatesThrottled;
  let timer;

  return ({ selected, item, setCoordinates, setDragging }) => {
    const { id, senderName, senderEmail, subject, content } = item;
    const folder = getFolder();

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
      }, 32);

    const ondrag = (e) =>
      setCoordinatesThrottled(e.clientX - OFFSET, e.clientY - OFFSET);
    const ondragstart = (e) => {
      e.dataTransfer.setDragImage(new Image(), 0, 0);
      setTimeout(() => {
        setDragging(true);
      }, 100);
    };
    const ondragend = () => {
      setDragging(false);
      setSelected([]);
    };

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
      Row(
        (selected = selected),
        (draggable = folder !== "trash"),
        (ondragstart = ondragstart),
        (ondrag = ondrag),
        (ondragend = ondragend),
        (onmousedown = onmousedown),
        (onmouseup = onmouseup),
        [
          folder !== "trash"
            ? Checkbox(
                (checked = selected),
                (onchange = () => toggleItem(item, !selected))
              )
            : null,
          Sender(senderName || senderEmail || "(no name)"),
          Summary([
            Title(format(30)(subject) || "(empty)"),
            Preheader(
              (innerHTML = `&nbsp;&mdash;&nbsp;${
                format(50)(content) || "(empty)"
              }`)
            ),
          ]),
          folder !== "trash"
            ? Actions([
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
