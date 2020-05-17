"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _Checkbox = _interopRequireDefault(require("./Checkbox"));

var _IconButton = _interopRequireDefault(require("./IconButton"));

var _css = _interopRequireDefault(require("../lib/css"));

var _itemSelection = _interopRequireDefault(require("../hooks/itemSelection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Row = _css.default.div`
  --height: 40px;
  position: relative;
  height: var(--height);
  line-height: var(--height);
  padding: 0 10px;
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  background-color: ${({
  selected
}) => selected ? "var(--highlight)" : "white"};
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`.and`:active {
  cursor: grabbing;
}`.and`:hover {
  background: ${({
  selected
}) => selected ? "var(--highlight)" : "white"};
  filter: brightness(0.95);
`.and`:hover * {
  visibility: visible;
}`;
const Sender = _css.default.div`
  flex: 0 0 200px;
  font-weight: 600;
`;
const Summary = _css.default.div`
  flex: 1 1 auto;
  line-height: 1rem;
`;
const Title = _css.default.span`
  font-weight: 600;
  font-size: 1rem;
  text-transform: capitalize;
`;
const Preheader = _css.default.span`
  font-weight: 300;
  font-size: 1rem;
  color: gray;
`;
const Actions = _css.default.div`
  margin-right: 30px;
  flex: 0 0 auto;
  visibility: hidden;
  color: var(--gray);
`;

const format = length => s => s.length <= length ? s : s.slice(0, length) + "...";

const Item = (state, context) => {
  const {
    dispatch,
    Type: T
  } = context.store;
  const {
    replaceDraft,
    setEditing
  } = context.editor;
  const {
    getFolder,
    setMailId
  } = context.route;
  const {
    setSelected,
    toggleItem
  } = (0, _itemSelection.default)(context.selection);
  const OFFSET = 15;
  let setCoordinatesThrottled;
  let timer;
  return ({
    selected,
    item,
    setCoordinates,
    setDragging
  }) => {
    const {
      id,
      senderName,
      senderEmail,
      subject,
      content
    } = item;
    const folder = getFolder();

    const deleteItem = () => {
      dispatch(d => {
        setTimeout(() => {
          d({
            type: T.DELETE,
            payload: {
              folder,
              id
            }
          });
        }, 200);
      });
    };

    setCoordinatesThrottled = setCoordinatesThrottled || _lodash.default.throttle((x, y) => {
      setCoordinates(x, y);
    }, 32);

    const ondrag = e => setCoordinatesThrottled(e.clientX - OFFSET, e.clientY - OFFSET);

    const ondragstart = e => {
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

    return (// use transform
      [[Row, {
        selected: selected,
        draggable: folder !== "trash",
        ondragstart: ondragstart,
        ondrag: ondrag,
        ondragend: ondragend,
        onmousedown: onmousedown,
        onmouseup: onmouseup
      }, [folder !== "trash" ? [_Checkbox.default, {
        checked: selected,
        onchange: () => toggleItem(item, !selected)
      }, []] : null, [Sender, {}, senderName || senderEmail || "(no name)"], [Summary, {}, [[Title, {}, format(30)(subject) || "(empty)"], [Preheader, {
        innerHTML: `&nbsp;&mdash;&nbsp;${format(50)(content) || "(empty)"}`
      }, []]]], folder !== "trash" ? [Actions, {}, [[_IconButton.default, {
        type: "trash",
        onclick: deleteItem,
        onmousedown: e => e.stopPropagation(),
        onmouseup: e => e.stopPropagation()
      }, []]]] : null]]]
    );
  };
};

var _default = Item;
exports.default = _default;