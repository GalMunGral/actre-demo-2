"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderToString = renderToString;

var _Utilities = require("./Utilities");

function renderHTMLToBuffer(element, buffer, context) {
  const [type, props, children] = element;
  buffer.push(`<${type}`);

  for (const [name, value] of Object.entries(props)) {
    if (/^on/.test(name)) {
      continue; // Skip event listeners
    } else if (name === "style") {
      const cssString = Object.entries(value).map(([k, v]) => `${(0, _Utilities.toKebabCase)(k)}:${v};`).join("");
      buffer.push(` style="${cssString}"`);
    } else if (name === "className") {
      buffer.push(` class="${props.className}"`);
    } else {
      buffer.push(` ${(0, _Utilities.toKebabCase)(name)}="${value}"`);
    }
  }

  if ((0, _Utilities.isVoidElement)(type)) {
    buffer.push("/>");
  } else {
    buffer.push(">");

    if (!Array.isArray(children)) {
      buffer.push(String(children));
    } else {
      buffer.push(" ");
      children.filter(e => e).map(_Utilities.normalize).forEach(e => renderToBuffer(e, buffer, context));
    }

    buffer.push(`</${type}>`);
  }
}

function renderToBuffer(element, buffer, context) {
  let [type, props, children] = element;

  if (typeof type === "function") {
    context = Object.create(context, {
      component: {
        value: type
      }
    });
    const state = {
      on: () => {}
    };
    const component = type(state, context);
    const childElements = component(props, children); // Render

    childElements.filter(e => e).map(_Utilities.normalize).forEach(e => renderToBuffer(e, buffer, context));
  } else {
    renderHTMLToBuffer(element, buffer, context);
  }
}

function renderToString(rootElement, context) {
  const buffer = [];
  renderToBuffer((0, _Utilities.normalize)(rootElement), buffer, context);
  return buffer.join("");
}