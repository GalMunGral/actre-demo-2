"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Tab = _interopRequireDefault(require("./Tab"));

var _Mails = _interopRequireDefault(require("./Mails"));

var _Layout = _interopRequireDefault(require("./Layout"));

var _MailboxButtons = _interopRequireDefault(require("./MailboxButtons"));

var _css = _interopRequireDefault(require("../lib/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Container = _css.default.div`
  flex: 0 0 50px;
  display: flex;
  justify-content: start;
  border-bottom: 1px solid var(--light-gray);
`;

const Mailbox = (_, context) => {
  const {
    getFolder,
    getTab,
    setTab
  } = context.route;
  const {
    getPage,
    resetPage
  } = context.pagination;
  return () => {
    const folder = getFolder();
    const currentTab = getTab();
    const page = getPage();
    return (// use transform
      [[_Layout.default, {}, [[_MailboxButtons.default, {}, []], ["section", {}, [folder === "inbox" ? [Container, {}, ["primary", "social", "promotions"].map(tab => [_Tab.default, {
        key: tab,
        name: tab,
        onclick: () => {
          setTab(tab);
          resetPage();
        },
        active: tab === currentTab
      }, []])] : null, [_Mails.default, {
        mails: page
      }, []]]]]]]
    );
  };
};

var _default = Mailbox;
exports.default = _default;