"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Item = _interopRequireDefault(require("./Item"));

var _DragImage = _interopRequireDefault(require("./DragImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const x = Symbol("x");
const y = Symbol("y");
const dragging = Symbol("dragging");

const Mails = (_, context) => {
  context[dragging] = false;
  context[x] = 0;
  context[y] = 0;

  context.getDragState = () => [context[dragging], context[x], context[y]];

  return ({
    mails
  }) => {
    const selected = context.selection.getSelected();
    return (// use transform
      [...mails.map((mail, i) => [_Item.default, {
        key: i,
        item: mail,
        selected: selected.includes(mail.id),
        setCoordinates: (newX, newY) => {
          context[x] = newX;
          context[y] = newY;
        },
        setDragging: v => {
          context[dragging] = v;
        }
      }, []]), [_DragImage.default, {}, []]]
    );
  };
};

var _default = Mails;
exports.default = _default;