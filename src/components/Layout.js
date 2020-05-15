import css from "../lib/css";

const container = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const toolbar = css`
  flex: 0 0 50px;
  border-bottom: 1px solid var(--light-gray);
  display: flex;
  justify-content: start;
  align-items: center;
  padding-left: 10px;
  padding-right: 30px;
`;

const scrollable = css`
  flex: 1 1 auto;
  overflow-y: auto;
  padding-bottom: 80px;
`.and`::-webkit-scrollbar-thumb {
  background: var(--gray);
}`.and`::-webkit-scrollbar {
  width: 10px;
}`;

const Layout = () => (_, [buttons, body]) => {
  return (
    // use transform
    div((className = container()), [
      div((className = toolbar()), [buttons]),
      div((className = scrollable()), [body]),
    ])
  );
};

export default Layout;
