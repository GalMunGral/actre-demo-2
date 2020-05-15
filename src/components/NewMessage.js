import React, { useContext, useState } from "react";
import styled from "styled-components";
import { EditorContext } from "../contexts";
import IconButton from "./IconButton";
import Space from "./Space";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUndo, faRedo } from "@fortawesome/free-solid-svg-icons";

const Window = styled.div`
  border: none;
  position: fixed;
  bottom: 0;
  right: 100px;
  background: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px 5px var(--gray);
  z-index: 998;
  transition: width 0.2s;
`;

const Header = styled.header`
  height: auto;
  padding: 12px 15px;
  line-height: 1rem;
  font-size: 1rem;
  background: var(--dark-gray);
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const CloseButton = styled.button`
  --size: 1rem;
  float: right;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  outline: none;
  width: var(--size);
  height: var(--size);
  line-height: var(--size);
  font-size: var(--size);
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--light-gray);
    transform: scale(1.2);
  }
`;

const Body = styled.section`
  height: ${({ minimized }) => (minimized ? 0 : "60vh")};
  width: ${({ minimized }) => (minimized ? "300px" : "40vw")};
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
`;

const Input = ({ className, label, value, setValue, placeholder }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className={className}>
      {(focused || value) && <label>{label}</label>}
      <input
        value={value}
        placeholder={!focused && !value ? placeholder : ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

const StyledInput = styled(Input)`
  line-height: 1rem;
  font-size: 1rem;
  margin: 0 20px;
  padding: 0;
  border-bottom: 1px solid var(--light-gray);

  & > label {
    color: gray;
    margin-right: 5px;
  }

  & > input {
    line-height: 1rem;
    font-size: 1rem;
    padding: 8px 0;
    border: none;
    outline: none;
    background: white;
    font-family: inherit;
  }
`;

const TextArea = styled.textarea`
  --horizontal-margin: 20px;
  flex: 1 1 auto;
  margin: 0 var(--horizontal-margin);
  padding-top: 10px;
  width: calc(100% - 2 * var(--horizontal-margin));
  resize: none;
  border: none;
  outline: none;
  font-size: 1rem;
  font-family: inherit;
`;

const ButtonGroup = styled.section`
  margin: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SendButton = styled.button`
  line-height: 1rem;
  font-size: 1rem;
  padding: 10px 22px;
  background: var(--blue);
  border-radius: 3px;
  color: white;
  font-weight: 600;
  margin-right: 10px;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    filter: brightness(1.2);
    box-shadow: 0 0 3px 0 var(--blue);
  }
`;

const NewMessage = () => {
  const {
    recipientEmail,
    setRecipientEmail,
    subject,
    setSubject,
    content,
    updateHistory,
    undo,
    redo,
    saveDraft,
    send,
    close,
  } = useContext(EditorContext);

  const [minimized, setMinimized] = useState(false);
  const toggle = () => setMinimized(!minimized);

  return (
    <Window minimized={minimized}>
      <Header onClick={toggle}>
        <span>New Message</span>
        <CloseButton
          onClick={() => {
            saveDraft();
            close();
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
      </Header>
      <Body minimized={minimized}>
        <StyledInput
          label="To:"
          placeholder="Recipient"
          value={recipientEmail}
          setValue={setRecipientEmail}
        />
        <StyledInput
          label="Subject:"
          placeholder="Subject"
          value={subject}
          setValue={setSubject}
        />
        <TextArea value={content} onChange={updateHistory} />
        <ButtonGroup>
          <SendButton
            onClick={() => {
              send();
              close();
            }}
          >
            Send
          </SendButton>
          <IconButton onClick={undo} icon={faUndo} />
          <IconButton onClick={redo} icon={faRedo} />
          <Space />
        </ButtonGroup>
      </Body>
    </Window>
  );
};

export default NewMessage;
