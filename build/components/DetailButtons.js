"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _IconButton = _interopRequireDefault(require("./IconButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DetailButtons = (_, context) => () => {
  const {
    dispatch,
    Type: T
  } = context.store;
  const {
    getFolder,
    getMailId,
    navigate
  } = context.route;
  const folder = getFolder();
  const mailId = getMailId();

  const goBack = () => window.history.back();

  const deleteMail = () => {
    goBack();
    dispatch(d => {
      setTimeout(() => d({
        type: T.DELETE,
        payload: {
          id: mailId,
          folder
        }
      }), 200);
    });
  };

  return (// use transform
    [[_IconButton.default, {
      onclick: goBack,
      type: "arrow-left"
    }, []], folder === "trash" ? null : [_IconButton.default, {
      onclick: deleteMail,
      type: "trash"
    }, []]]
  );
};

var _default = DetailButtons;
exports.default = _default;