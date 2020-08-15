import { DOMComponent, isComposite } from "./Component";
import { State, observe, setRenderingComponent } from "./Observer";
import { normalize } from "./Utilities";
import runner from "./Runner";

function instantiateComponent(element, context) {
  const [type, props, children] = element;
  let component;
  if (typeof type === "function") {
    const state = new State();
    context = Object.create(context, { __provider__: { value: type } });
    component = type(state, context);
    observe(component, state, context);
    component.__state__ = state;
  } else {
    component = DOMComponent(type, runner.getCursor().nextSibling);
  }
  component.__type__ = type;
  component.__key__ = props.key;
  component.__context__ = context;
  component.__cache__ = [];
  renderComponent(component, props, children, context);
  return component;
}

function renderComponent(component, props, children, context) {
  component.__memoized_props__ = props;
  component.__memoized_children__ = children;

  if (isComposite(component)) {
    component.__state__.notify("beforerender", {
      nextProps: props,
      nextChildren: children,
    });
    // Render
    setRenderingComponent(component);
    const rendered = component(props, children);
    setRenderingComponent(null);

    runner.pushCursor((cursor) => cursor);
    instantiateChildren(component, rendered, context);
    component.__$last__ = runner.getCursor();
    runner.popCursor();
    component.__$first__ = runner.getCursor().nextSibling;
    runner.setCursor(() => component.__$last__);
    component.__state__.notify("mounted");
  } else {
    // Render
    component(props);

    if (!Array.isArray(children)) {
      component.__$node__.textContent = String(children);
    } else {
      runner.pushCursor(() => component.__$first_child__);
      instantiateChildren(component, children, context);
      runner.popCursor();
    }
    runner.setCursor(() => component.__$node__);
  }
}

function instantiateChildren(component, elements, context) {
  elements
    .filter((e) => e)
    .map(normalize)
    .forEach((e) => {
      const comp = instantiateComponent(e, context);
      component.__cache__.push(comp);
    });
}

function hydrate(element, container, context) {
  console.debug("hydrate");
  element = normalize(element);
  runner.setCursor(() => container.firstChild);
  instantiateComponent(element, context);
}

export { hydrate };
