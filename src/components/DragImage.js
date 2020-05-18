import { Box, Icon } from "./DragImageComponents";

const DragImage = (_, context) => () => {
  const [dragging, x, y] = context.getDragState();
  const selected = context.selection.getSelected();
  const text = `Move ${selected.length} ${
    selected.length > 1 ? "items" : "item"
  }`;

  return (
    // use transform
    Box(
      (style = {
        visibility: dragging ? "visible" : "hidden",
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }),
      [Icon((className = "fas fa-mail-bulk")), span(text)]
    )
  );
};

export default DragImage;
