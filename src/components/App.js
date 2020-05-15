import useStoreAsync from "../hooks/store";
import useSelection from "../hooks/selection";
import usePagination from "../hooks/pagination";
import useItemSelection from "../hooks/itemSelection";
import useEditor from "../hooks/editor";
import AppBar from "./AppBar";
import Mailbox from "./Mailbox";
import SideBar from "./SideBar";
import css from "../lib/css";
import useRoute from "../hooks/route";

// import styled from "./styled";
// import AppBar from "./AppBar";
// import SideBar from "./SideBar";
// import Mailbox from "./Mailbox";
// import Detail from "./Detail";
// import NewMessage from "./NewMessage";

const container = css`
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

// const StyledMailbox = styled(Mailbox)`
//   grid-area: c;
// `;

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
    document.title = context.route.getFolder();

    return (
      // use transform
      div((className = container()), [
        AppBar((toggle = () => (state.collapsed = !state.collapsed))),
        SideBar(
          (collapsed = state.collapsed),
          (setCollapse = (v) => state.setCollapse(v))
        ),
        context.currentId ? div() : Mailbox(),
      ])

      //   {editing && <NewMessage />}
    );
  };
};

// const RoutedApp = () => (
//   <Router>
//     <App path=":folder/:id" />
//     <Redirect from="/" to="/inbox/all" noThrow />
//   </Router>
// );

export default App;
