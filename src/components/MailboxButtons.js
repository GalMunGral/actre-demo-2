import Checkbox from "./Checkbox";
import IconButton from "./IconButton";
import Space from "./Space";
import styled from "../lib/css";

const Progress = styled.div`
  flex: 0 0 200px;
  text-align: end;
`;

const Text = styled.span`
  font-size: 0.9rem;
  color: gray;
  margin: 0 20px;
`;

const MailboxButtons = (_, context) => () => {
  const {
    getPageStart,
    getPageEnd,
    getTotal,
    nextPage,
    prevPage,
    allSelected,
    toggleAll,
  } = context.pagination;
  const { getFolder } = context.route;

  const start = getPageStart();
  const end = getPageEnd();
  const total = getTotal();
  const folder = getFolder();

  return (
    // use transform
    [
      folder !== "trash"
        ? Checkbox((checked = allSelected()), (onchange = toggleAll))
        : null,
      Space(),
      Progress([
        Text(
          (innerHTML = `${start}&ndash;${Math.min(end, total)} of ${total}`)
        ),
      ]),
      IconButton((onclick = prevPage), (type = "angle-left")),
      IconButton((onclick = nextPage), (type = "angle-right")),
    ]
  );
};

export default MailboxButtons;
