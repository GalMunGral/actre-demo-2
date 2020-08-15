const FormField = (_, context) => ({ label }, control) =>
  // use transform
  div((className = "field"), (style = { ...context.sharedStyles }), [
    label
      ? label(
          (className = "label"),
          (style = { ...context.sharedStyles }),
          label
        )
      : null,
    div(
      (className = "control"),
      (style = { ...context.sharedStyles }),
      control
    ),
  ]);

export default FormField;
