import Tab from "./Tab";
import Mails from "./Mails";
import Layout from "./Layout";
import MailboxButtons from "./MailboxButtons";
import css from "../lib/css";

const tabs = css`
  flex: 0 0 50px;
  display: flex;
  justify-content: start;
  border-bottom: 1px solid var(--light-gray);
`;

const Mailbox = (_, context) => {
  const { getFolder, getTab, setTab } = context.route;
  const { getPage } = context.pagination;

  return () => {
    const folder = getFolder();
    const currentTab = getTab();
    const page = getPage();

    return (
      // use transform
      Layout([
        MailboxButtons(),
        // folder === "inbox"
        //   ? div(
        //       (className = tabs()),
        //       ["primary", "social", "promotions"].map((tab) =>
        //         Tab(
        //           (key = tab),
        //           (name = tab),
        //           (onclick = () => setTab(tab)),
        //           (active = tab === currentTab)
        //         )
        //       )
        //     )
        //   : null,
        Mails((mails = page)),
      ])
    );
  };
};

export default Mailbox;
