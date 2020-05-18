import Tab from "./Tab";
import MailList from "./MailList";
import Layout from "./Layout";
import MailboxToolbar from "./MailboxToolbar";
import { Container } from "./MailboxComponents";

const tabs = ["primary", "social", "promotions"];

const Mailbox = (_, context) => {
  const { getFolder, getTab, setTab } = context.route;
  const { getPage, resetPage } = context.pagination;

  return () => {
    const folder = getFolder();
    const currentTab = getTab();
    const page = getPage();

    return (
      // use transform
      Layout([
        MailboxToolbar(),
        section([
          folder === "inbox"
            ? Container(
                tabs.map((tab) =>
                  Tab(
                    (key = tab),
                    (name = tab),
                    (onclick = () => {
                      setTab(tab);
                      resetPage();
                    }),
                    (active = tab === currentTab)
                  )
                )
              )
            : null,
          MailList((mails = page)),
        ]),
      ])
    );
  };
};

export default Mailbox;
