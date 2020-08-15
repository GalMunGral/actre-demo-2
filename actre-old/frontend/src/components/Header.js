const Header = (state, context) => {
  state.counter = 0;

  const onclick = () => {
    for (let i = 0; i < 10000; i++) {
      state.counter++;
    }
  };

  return () =>
    // use transform
    header(
      (className = "title is-1 has-text-weight-semibold"),
      (style = { ...context.sharedStyles }),
      (onclick = onclick),
      [
        state.counter
          ? p(`Yes, I am ! (\u00d7${state.counter})`)
          : p(context.title),
      ]
    );
};

export default Header;
