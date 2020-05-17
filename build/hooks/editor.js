"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _uuid = require("uuid");

var _editorHistory = _interopRequireDefault(require("./editorHistory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const id = Symbol("id");
const recipientEmail = Symbol("recipientEmail");
const subject = Symbol("subject");
const editing = Symbol("editing");

const useEditor = (state, store) => {
  const {
    dispatch,
    Type: T
  } = store;
  const {
    undo,
    redo,
    getContent,
    resetHistory,
    updateHistory
  } = (0, _editorHistory.default)(state);
  state[id] = state[id] || null;
  state[recipientEmail] = state[id] || "";
  state[subject] = state[id] || "";
  state[editing] = state[id] || false;

  const open = () => state[editing] = true;

  const close = () => state[editing] = false;

  const createMessage = () => ({
    id: state[id],
    recipientEmail: state[recipientEmail],
    senderEmail: "test@example.com",
    senderName: "Me",
    subject: state[subject],
    content: getContent()
  });

  const saveDraft = () => {
    dispatch(d => {
      setTimeout(() => {
        d({
          type: T.SAVE_DRAFT,
          payload: createMessage()
        });
      }, 200);
    });
  };

  const send = () => {
    dispatch(d => {
      setTimeout(() => {
        d({
          type: T.SEND,
          payload: createMessage()
        });
      }, 200);
    });
  };

  const createDraft = () => {
    state[id] = (0, _uuid.v4)();
    state[recipientEmail] = "";
    state[subject] = "";
    resetHistory("");
  };

  const replaceDraft = draft => {
    saveDraft();
    state[id] = draft.id;
    state[recipientEmail] = draft.recipientEmail;
    state[subject] = draft.subject;
    resetHistory(draft.content);
  };

  return {
    getId: () => state[id],
    getRecipientEmail: () => state[recipientEmail],
    setRecipientEmail: v => state[recipientEmail] = v,
    getSubject: () => state[subject],
    setSubject: v => state[subject] = v,
    getEditing: () => state[editing],
    setEditing: v => state[editing] = v,
    undo,
    redo,
    getContent,
    updateHistory,
    saveDraft,
    createDraft,
    replaceDraft,
    send,
    open,
    close
  };
};

var _default = useEditor;
exports.default = _default;