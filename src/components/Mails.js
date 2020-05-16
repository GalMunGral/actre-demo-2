import Item from "./Item";
import css from "../lib/css";

const dragImage = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: white;
  font-weight: bold;
  background: var(--blue);
  border-radius: 5px;
  box-shadow: 0 1px 15px 0 gray;
  pointer-events: none;
`;

const icon = css`
  margin-right: 15px;
`;

const Mails = (state, context) => {
  const { getSelected } = context.selection;
  state.dragging = false;
  state.x = 0;
  state.y = 0;

  return ({ mails }) => {
    const selected = getSelected();
    return (
      // use transform
      [
        ...mails.map((mail) =>
          Item(
            (key = mail.id),
            (item = mail),
            (setCoordinates = (x, y) => {
              state.x = x;
              state.y = y;
            }),
            (setDragging = (v) => (state.dragging = v))
          )
        ),
        div(
          (className = dragImage()),
          (style = {
            visibility: state.dragging ? "visible" : "hidden",
            transform: `translate3d(${state.x}px, ${state.y}px, 0)`,
          }),
          [
            i((className = `fas fa-mail-bulk ${icon()}`)),
            span(
              `Move ${selected.length} ${
                selected.length > 1 ? "items" : "item"
              }`
            ),
          ]
        ),
      ]
    );
  };
};

export default Mails;
