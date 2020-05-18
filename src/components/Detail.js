import Layout from "./Layout";
import DetailToolbar from "./DetailToolbar";
import {
  Main,
  Header,
  SenderInfo,
  RecipientInfo,
  Body,
} from "./DetailComponents";

const Detail = (__, context) => ({ mailId }) => {
  const { getFolder, redirect } = context.route;
  const { getState } = context.store;
  const folder = getFolder();
  const allMails = getState();
  const mail = allMails[folder].find((item) => item.id === mailId);

  if (!mail) {
    redirect("/" + folder);
    return /* use transform */ p("Redirecting...");
  }

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
      DetailToolbar(),
      Main([
        Header(subject),
        SenderInfo(
          (innerHTML = `${senderName || "(no name)"}&nbsp;&lt;${
            senderEmail || "(no email)"
          }&gt;`)
        ),
        RecipientInfo(
          (innerHTML = `To: ${recipientName || "(no name)"}&nbsp;&lt;${
            recipientEmail || "(no email)"
          }&gt;`)
        ),
        Body(content),
      ]),
    ])
  );
};

export default Detail;
