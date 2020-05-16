import css from "../lib/css";
import Layout from "./Layout";
import DetailButtons from "./DetailButtons";

const main = css`
  margin: 0 50px;
`;

const header = css`
  font-weight: 600;
  font-size: 1.8rem;
  margin: 20px 0;
  text-transform: capitalize;
`;

const senderInfo = css`
  margin: 0;
  font-weight: bold;
  font-size: 0.9rem;
`;
const recipientInfo = css`
  margin: 0;
  color: gray;
  font-size: 0.8rem;
`;

const body = css`
  margin: 20px 0;
  text-align: justify;
`;

const Detail = (__, context) => () => {
  const { getFolder, getMailId } = context.route;
  const { getState } = context.store;
  const folder = getFolder();
  const mailId = getMailId();
  const allMails = getState();
  const mail = allMails[folder].find((item) => item.id === mailId);

  const {
    subject,
    senderName,
    senderEmail,
    recipientName,
    recipientEmail,
    content,
  } = mail;

  return (
    // use transform
    Layout([
      DetailButtons(),
      section((className = main()), [
        header((className = header()), subject),
        section(
          (className = senderInfo()),
          (innerHTML = `${senderName || "(no name)"}&nbsp;&lt;${
            senderEmail || "(no email)"
          }&gt;`)
        ),
        section(
          (className = recipientInfo()),
          (innerHTML = `To: ${recipientName || "(no name)"}&nbsp;&lt;${
            recipientEmail || "(no email)"
          }&gt;`)
        ),
        section((className = body()), content),
      ]),
    ])
  );
};

export default Detail;
