import FormField from "./FormField";

const Button = () => {
  return (
    { onclick, disabled, submit, reset, isLink, isDanger, isLight, isSmall },
    text
  ) => {
    let classes = ["button"];
    if (isLink) classes.push("is-link");
    if (isDanger) classes.push("is-danger");
    if (isLight) classes.push("is-light");
    if (isSmall) classes.push("is-small");

    return (
      // use transform
      FormField([
        button(
          (type = submit ? "submit" : reset ? "reset" : "button"),
          (className = classes.join(" ")),
          (onclick = onclick),
          (disabled = disabled),
          (textContent = text)
        ),
      ])
    );
  };
};

export default Button;
