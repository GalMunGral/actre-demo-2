import React from "react";
import { useParams } from "@reach/router";
import useMails from "../hooks/mails";
import DetailButtons from "./DetailButtons";
import Layout from "./Layout";
import styled from "styled-components";

const Main = styled.section`
  margin: 0 50px;
`;

const Header = styled.h3`
  font-weight: 600;
  font-size: 1.8rem;
  margin: 20px 0;
  text-transform: capitalize;
`;

const SenderInfo = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 0.9rem;
`;
const RecipientInfo = styled.p`
  margin: 0;
  color: gray;
  font-size: 0.8rem;
`;

const Body = styled.section`
  margin: 20px 0;
  text-align: justify;
`;

const Detail = () => {
  const { folder, id } = useParams();
  const mails = useMails(folder);
  const mail = mails.find((item) => item.id === id);
  const {
    subject,
    senderName,
    senderEmail,
    recipientName,
    recipientEmail,
    content,
  } = mail;

  return (
    <Layout>
      <DetailButtons />
      <Main>
        <Header>{subject}</Header>
        <SenderInfo>
          {senderName || "(no name)"}
          &nbsp;&lt;{senderEmail || "(no email)"}&gt;
        </SenderInfo>
        <RecipientInfo>
          To: {recipientName || "(no name)"}
          &nbsp;&lt;{recipientEmail || "(no email)"}&gt;
        </RecipientInfo>
        <Body>{content}</Body>
      </Main>
    </Layout>
  );
};

export default Detail;
