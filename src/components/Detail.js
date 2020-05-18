import styled from "../lib/common/Decorator";
import Layout from "./Layout";
import DetailButtons from "./DetailButtons";

const Main = styled.main`
  margin: 0 50px;
`;

const Header = styled.section`
  font-weight: 600;
  font-size: 1.8rem;
  margin: 20px 0;
  text-transform: capitalize;
`;

const SenderInfo = styled.div`
  margin: 0;
  font-weight: bold;
  font-size: 0.9rem;
`;
const RecipientInfo = styled.div`
  margin: 0;
  color: gray;
  font-size: 0.8rem;
`;

const Body = styled.section`
  margin: 20px 0;
  text-align: justify;
`;

const Detail = (state, context) => ({ mailId }) => {
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

  state.on("willunmount", () => {
    console.log("Detail page will be unmounted");
  });

  return (
    // use transform
    Layout([
      DetailButtons(),
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
