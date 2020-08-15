const NavBar = (_, context) => () =>
  // use transform
  nav(
    (className = "navbar is-fixed-top is-light"),
    (role = "navigation"),
    (ariaLabel = "main navigation"),
    [
      div((className = "navbar-brand"), [
        div((className = "navbar-item"), [img((src = context.logoUrl))]),
      ]),
      div((className = "navbar-menu"), [
        div((className = "navbar-start"), [
          a((className = "navbar-item"), "Start a New Trip"),
          a((className = "navbar-item"), "View Trip History"),
          a((className = "navbar-item"), "Manage Cards"),
        ]),
      ]),
      div((className = "navbar-end"), [
        div((className = "navbar-item"), [
          button(
            (className = "button"),
            (style = { ...context.sharedStyles }),
            (onclick = () => {
              context.title = `I'm a Button!`;
              context.postMessage("Are you retarded?");
            }),
            "Log Out"
          ),
        ]),
      ]),
    ]
  );

export default NavBar;
