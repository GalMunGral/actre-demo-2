import { DOMComponent, isComposite } from "./Component";
import { State, observe, setRenderingComponent } from "./Observer";
import { normalize } from "./Utilities";
import { getCursor, setCursor, pushCursor, popCursor } from "./Runner";

function instantiateComponent(element, context, depth) {
  const [type, props, children] = element;
  let component;
  if (typeof type === "function") {
    const state = new State();
    context = Object.create(context, { component: { value: type } });
    component = type(state, context);
    observe(component, state, context);
    component.__state__ = state;
    component.__subscriptions__ = [];
    component.__requests__ = [];
  } else {
    component = DOMComponent(type, getCursor().nextSibling);
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

  if (isComposite(component)) {
    component.__state__.notify("beforerender", {
      nextProps: props,
      nextChildren: children,
    });
    // Render
    setRenderingComponent(component);
    const rendered = component(props, children);
    setRenderingComponent(null);

    pushCursor(getCursor());

    instantiateChildren(component, rendered, context, depth);

    component.__$last__ = getCursor();
    popCursor();
    component.__$first__ = getCursor().nextSibling;
    setCursor(component.__$last__);
    component.__state__.notify("mounted");
  } else {
    // Render
    component(props);

    if (!Array.isArray(children)) {
      component.__$node__.textContent = String(children);
      component.__cache__.isText = true;
    } else {
      pushCursor(component.__$first_child__);
      instantiateChildren(component, children, context, children);
      popCursor();
    }
    setCursor(component.__$node__);
  }
}

function instantiateChildren(component, elements, context, depth) {
  elements
    .filter((e) => e)
    .map(normalize)
    .forEach((e) => {
      const comp = instantiateComponent(e, context, depth + 1);
      component.__cache__.push(comp);
    });
}

function hydrate(element, container, context) {
  console.debug("hydrate");
  element = normalize(element);
  setCursor(container.firstChild);
  instantiateComponent(element, context), 0;
}

export { hydrate };
