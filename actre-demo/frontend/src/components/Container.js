import NavBar from "./NavBar";

const Container = () => ({ wide, medium }, children) =>
  // use transform
  div([
    NavBar(),
    main((id = "main"), (className = "columns is-centered"), [
      div(
        (className = `column ${
          wide ? "is-two-thirds" : medium ? "is-half" : "is-one-third"
        }`),
        children
      ),
    ]),
  ]);

export default Container;
