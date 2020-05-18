import styled from "../lib/common/Decorator";

const DragImageBox = styled.div`
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

const DragImageIcon = styled.i`
  margin-right: 15px;
`;

const DragImage = (_, context) => () => {
  const [dragging, x, y] = context.getDragState();
  const selected = context.selection.getSelected();
  const text = `Move ${selected.length} ${
    selected.length > 1 ? "items" : "item"
  }`;

  return (
    // use transform
    DragImageBox(
      (style = {
        visibility: dragging ? "visible" : "hidden",
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }),
      [DragImageIcon((className = "fas fa-mail-bulk")), span(text)]
    )
  );
};

export default DragImage;
