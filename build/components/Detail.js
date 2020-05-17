"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _css = _interopRequireDefault(require("../lib/css"));

var _Layout = _interopRequireDefault(require("./Layout"));

var _DetailButtons = _interopRequireDefault(require("./DetailButtons"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Main = _css.default.main`
  margin: 0 50px;
`;
const Header = _css.default.section`
  font-weight: 600;
  font-size: 1.8rem;
  margin: 20px 0;
  text-transform: capitalize;
`;
const SenderInfo = _css.default.div`
  margin: 0;
  font-weight: bold;
  font-size: 0.9rem;
`;
const RecipientInfo = _css.default.div`
  margin: 0;
  color: gray;
  font-size: 0.8rem;
`;
const Body = _css.default.section`
  margin: 20px 0;
  text-align: justify;
`;

const Detail = (state, context) => ({
  mailId
}) => {
  const {
    getFolder,
    redirect
  } = context.route;
  const {
    getState
  } = context.store;
  const folder = getFolder();
  const allMails = getState();
  const mail = allMails[folder].find(item => item.id === mailId);

  if (!mail) {
    redirect("/" + folder);
    return (
      /* use transform */
      [["p", {}, "Redirecting..."]]
    );
  }

  const {
    subject,
    senderName,
    senderEmail,
    recipientName,
    recipientEmail,
    content
  } = mail;
  state.on("willunmount", () => {
    console.log("Detail page will be unmounted");
  });
  return (// use transform
    [[_Layout.default, {}, [[_DetailButtons.default, {}, []], [Main, {}, [[Header, {}, subject], [SenderInfo, {
      innerHTML: `${senderName || "(no name)"}&nbsp;&lt;${senderEmail || "(no email)"}&gt;`
    }, []], [RecipientInfo, {
      innerHTML: `To: ${recipientName || "(no name)"}&nbsp;&lt;${recipientEmail || "(no email)"}&gt;`
    }, []], [Body, {}, content]]]]]]
  );
};

var _default = Detail;
exports.default = _default;