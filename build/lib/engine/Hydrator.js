"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hydrate = hydrate;

var _Component = require("./Component");

var _Observer = require("./Observer");

var _Utilities = require("./Utilities");

var _Runner = require("./Runner");

function instantiateComponent(element, context, depth) {
  const [type, props, children] = element;
  let component;

  if (typeof type === "function") {
    const state = new _Observer.State();
    context = Object.create(context, {
      component: {
        value: type
      }
    });
    component = type(state, context);
    (0, _Observer.observe)(component, state, context);
    component.__state__ = state;
    component.__subscriptions__ = [];
    component.__requests__ = [];
  } else {
    component = (0, _Component.DOMComponent)(type, (0, _Runner.getCursor)().nextSibling);
  }

  component.__type__ = type;
  component.__key__ = props.key;
  component.__context__ = context;
  component.__cache__ = [];
  component.__depth__ = depth;
  renderComponent(component, props, children, context, depth);
  return component;
}

function renderComponent(component, props, children, context, depth) {
  component.__memoized_props__ = props;
  component.__memoized_children__ = children;

  if ((0, _Component.isComposite)(component)) {
    component.__state__.notify("beforerender", {
      nextProps: props,
      nextChildren: children
    }); // Render


    (0, _Observer.setRenderingComponent)(component);
    const rendered = component(props, children);
    (0, _Observer.setRenderingComponent)(null);
    (0, _Runner.pushCursor)((0, _Runner.getCursor)());
    instantiateChildren(component, rendered, context, depth);
    component.__$last__ = (0, _Runner.getCursor)();
    (0, _Runner.popCursor)();
    component.__$first__ = (0, _Runner.getCursor)().nextSibling;
    (0, _Runner.setCursor)(component.__$last__);

    component.__state__.notify("mounted");
  } else {
    // Render
    component(props);

    if (!Array.isArray(children)) {
      component.__$node__.textContent = String(children);
      component.__cache__.isText = true;
    } else {
      (0, _Runner.pushCursor)(component.__$first_child__);
      instantiateChildren(component, children, context, children);
      (0, _Runner.popCursor)();
    }

    (0, _Runner.setCursor)(component.__$node__);
  }
}

function instantiateChildren(component, elements, context, depth) {
  elements.filter(e => e).map(_Utilities.normalize).forEach(e => {
    const comp = instantiateComponent(e, context, depth + 1);

    component.__cache__.push(comp);
  });
}

function hydrate(element, container, context) {
  console.debug("hydrate");
  element = (0, _Utilities.normalize)(element);
  (0, _Runner.setCursor)(container.firstChild);
  instantiateComponent(element, context), 0;
}