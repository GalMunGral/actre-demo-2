import useStoreAsync from "../hooks/store";
import useSelection from "../hooks/selection";
import usePagination from "../hooks/pagination";
import useEditor from "../hooks/editor";
import useRoute from "../hooks/route";
import AppBar from "./AppBar";
import Mailbox from "./Mailbox";
import SideBar from "./SideBar";
import NewMessage from "./NewMessage";
import styled from "../lib/css";
import Detail from "./Detail";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template:
    "a a" 64px
    "b c" calc(100vh - 60px) / auto 1fr;
`;

const App = (state, context) => {
  context.store = useStoreAsync(context);
  context.editor = useEditor(context, context.store);
  context.route = useRoute(context);
  context.selection = useSelection(context);
  context.pagination = usePagination(context, 50, {
    store: context.store,
    route: context.route,
    selection: context.selection,
  });

  state.collapsed = false;

  return () => {
    const mailId = context.route.getMailId();
    const editing = context.editor.getEditing();

    return (
      // use transform
      Container([
        AppBar((toggle = () => (state.collapsed = !state.collapsed))),
        SideBar(
          (collapsed = state.collapsed),
          (setCollapse = (v) => state.setCollapse(v))
        ),
        mailId ? Detail((mailId = mailId)) : Mailbox(),
        editing ? NewMessage() : null,
      ])
    );
  };
};

export default App;
