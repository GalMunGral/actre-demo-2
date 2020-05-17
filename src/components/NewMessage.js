import styled from "../lib/css";
import IconButton from "./IconButton";
import Space from "./Space";

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
`.and`:hover {
  color: var(--light-gray);
  transform: scale(1.2);
}`;

const Body = styled.section`
  height: ${({ minimized }) => (minimized ? 0 : "60vh")};
  width: ${({ minimized }) => (minimized ? "300px" : "40vw")};
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
`;

const InputBox = styled.div`
  line-height: 1rem;
  font-size: 1rem;
  margin: 0 20px;
  padding: 0;
  border-bottom: 1px solid var(--light-gray);
`.and` > label {
  color: gray;
  margin-right: 5px;
}`.and` > input {
  line-height: 1rem;
  font-size: 1rem;
  padding: 8px 0;
  border: none;
  outline: none;
  background: white;
  font-family: inherit;
}`;

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

const ButtonGroup = styled.div`
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
`.and`:hover {
  filter: brightness(1.2);
  box-shadow: 0 0 3px 0 var(--blue);
}`;

const Input = (state) => {
  state.focused = false;

  return ({ label, value, setValue, placeholder }) => {
    return (
      // use transform
      InputBox([
        state.focused || value ? label(label) : null,
        input(
          (key = "input"), // If key is not specified, input will get recreated every time because its index changes 1 -> 0 -> 1
          (value = value),
          (placeholder = !state.focused && !value ? placeholder : ""),
          (onfocus = () => (state.focused = true)),
          (onblur = () => (state.focused = false)),
          (onchange = (e) => setValue(e.target.value))
        ),
      ])
    );
  };
};

const NewMessage = (state, context) => {
  state.minimized = false;

  const {
    getRecipientEmail,
    setRecipientEmail,
    getSubject,
    setSubject,
    getContent,
    updateHistory,
    undo,
    redo,
    saveDraft,
    send,
    close,
  } = context.editor;

  return () => {
    return (
      // use transform
      Window([
        Header((onclick = () => (state.minimized = !state.minimized)), [
          span("New Message"),
          CloseButton(
            (onclick = () => {
              saveDraft();
              close();
            }),
            [i((className = "fas fa-times"))]
          ),
        ]),
        Body((minimized = state.minimized), [
          Input(
            (label = "To:"),
            (placeholder = "Recipient"),
            (value = getRecipientEmail()),
            (setValue = setRecipientEmail)
          ),
          Input(
            (label = "Subject:"),
            (placeholder = "Subject"),
            (value = getSubject()),
            (setValue = setSubject)
          ),
          TextArea((value = getContent()), (oninput = updateHistory)),
          ButtonGroup([
            SendButton(
              (onclick = (e) => {
                send();
                close();
              }),
              "Send"
            ),
            IconButton((onclick = undo), (type = "undo")),
            IconButton((onclick = redo), (type = "redo")),
            Space(),
          ]),
        ]),
      ])
    );
  };
};

export default NewMessage;
