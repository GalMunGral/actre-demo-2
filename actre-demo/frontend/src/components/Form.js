const Form = (_, context) => {
  return ({ onsubmit, onreset }, children) =>
    // use transform
    form(
      (style = { ...context.sharedStyles }),
      (onsubmit = (e) => {
        e.preventDefault();
        onsubmit(e);
      }),
      (onreset = (e) => {
        e.preventDefault();
        onreset(e);
      }),
      children
    );
};

export default Form;
