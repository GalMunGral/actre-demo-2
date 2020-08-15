import Header from "./Header";

const Card = (_, context) => ({ sticky }, children) =>
  // use transform
  div(
    (className = `box ${sticky ? "sticky" : ""}`),
    (style = { ...context.sharedStyles }),
    [Header(), ...children]
  );

export default Card;
