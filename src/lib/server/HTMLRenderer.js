import { normalize, isVoidElement, toKebabCase } from "../common/Utilities";

function renderHTMLToBuffer(element, buffer, context) {
  const [type, props, children] = element;
  buffer.push(`<${type}`);
  for (const [name, value] of Object.entries(props)) {
    if (/^on/.test(name)) {
      continue; // Skip event listeners
    } else if (name === "style") {
      const cssString = Object.entries(value)
        .map(([k, v]) => `${toKebabCase(k)}:${v};`)
        .join("");
      buffer.push(` style="${cssString}"`);
    } else if (name === "className") {
      buffer.push(` class="${props.className}"`);
    } else {
      buffer.push(` ${toKebabCase(name)}="${value}"`);
    }
  }
  if (isVoidElement(type)) {
    buffer.push("/>");
  } else {
    buffer.push(">");
    if (!Array.isArray(children)) {
      buffer.push(String(children));
    } else {
      buffer.push(" ");
      children
        .filter((e) => e)
        .map(normalize)
        .forEach((e) => renderToBuffer(e, buffer, context));
    }
    buffer.push(`</${type}>`);
  }
}

function renderToBuffer(element, buffer, context) {
  console.log(buffer);
  let [type, props, children] = element;
  if (typeof type === "function") {
    context = Object.create(context, { component: { value: type } });
    const state = { on: () => {} };
    const component = type(state, context);
    const childElements = component(props, children); // Render
    childElements
      .filter((e) => e)
      .map(normalize)
      .forEach((e) => renderToBuffer(e, buffer, context));
  } else {
    renderHTMLToBuffer(element, buffer, context);
  }
}

function renderToString(rootElement, context) {
  const buffer = [];
  renderToBuffer(normalize(rootElement), buffer, context);
  return buffer.join("");
}

export { renderToString };
