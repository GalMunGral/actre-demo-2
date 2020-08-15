export const Text = (_, context) => (_, children) =>
  // use transform
  p(
    (className = `is-italic has-text-weight-bold ${
      context.highlightColor ? "" : "has-text-primary"
    }`),
    (style = {
      color: context.highlightColor,
      ...context.sharedStyles,
    }),
    children
  );

export default Text;
