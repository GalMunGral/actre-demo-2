import { requestRender } from "./Scheduler";
import runner from "./Runner";
import { State, observe, setRenderingComponent } from "./Observer";
import { normalize, equals } from "./Utilities";
import {
  isComposite,
  DOMComponent,
  mountComponent,
  unmountComponent,
  moveComponent,
} from "./Component";

function* instantiateComponent(element, context, depth) {
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
    component = DOMComponent(type);
    runner.schedule(mountComponent(component));
  }
  component.__type__ = type;
  component.__key__ = props.key;
  component.__context__ = context;
  component.__cache__ = [];
  component.__depth__ = depth;

  yield* renderComponent(component, props, children, context, depth);

  return component;
}

function* renderComponent(component, props, children, context, depth) {
  // console.group(component.__type__.name || component.__type__, depth);
  const isFirstRender =
    !component.__memoized_props__ && !component.__memoized_children__;

  if (
    equals(props, component.__memoized_props__) &&
    equals(children, component.__memoized_children__) &&
    !component.__dirty__
  ) {
    // !!! Can't set cursor in this function because this might exit early !!!
    // console.groupEnd();
    return;
  }

  component.__memoized_props__ = props;
  component.__memoized_children__ = children;
  component.__dirty__ = false;

  if (isComposite(component)) {
    component.__state__.notify(
      isFirstRender ? "beforerender" : "beforeupdate",
      {
        nextProps: props,
        nextChildren: children,
      }
    );
  }

  if (isComposite(component)) {
    // Render
    setRenderingComponent(component);
    const rendered = component(props, children);
    setRenderingComponent(null);
    yield; // Exit before moving on to child components

    runner.schedule(() => runner.pushCursor((cursor) => cursor));

    yield* reconcileChildren(component, rendered, context, depth);

    runner.schedule((cursor) => (component.__$last__ = cursor));
    runner.schedule(() => runner.popCursor());

    runner.schedule((cursor) => (component.__$first__ = cursor.nextSibling));
    // runner.schedule(() => runner.setCursor(() => component.__$last__));
    runner.schedule(() =>
      component.__state__.notify(isFirstRender ? "mounted" : "updatecommited")
    );
  } else {
    runner.schedule(() => component(props)); // Render
    yield; // Exit before moving on to child components
    if (!Array.isArray(children)) {
      // unmount children first!
      for (let child of component.__cache__) {
        if (isComposite(child)) {
          runner.schedule(() => child.__state__.notify("beforeunmount"));
        }
        destroyComponent(child);
        runner.schedule(unmountComponent(child));
      }
      runner.schedule(() => {
        component.__$node__.textContent = String(children);
        component.__cache__ = [];
        component.__cache__.isText = true;
      });
    } else {
      runner.schedule(() =>
        runner.pushCursor(() => component.__$first_child__)
      );

      yield* reconcileChildren(component, children, context, depth);

      runner.schedule(() => runner.popCursor());
    }
    // runner.schedule(() => runner.setCursor(() => component.__$node__));
  }
  // console.groupEnd();
}

function* reconcileChildren(component, elements, context, depth) {
  if (component.__cache__.length === 0 && component.__cache__.isText) {
    if (isComposite(component))
      throw "A composite component must not render to text!";
    // was a textual component, need to clear the innerText first!
    component.__$node__.innerHTML = "";
    component.__$node__.append(component.__$first_child__);
  }

  elements = elements.filter((e) => e).map(normalize);
  const newChildren = [];
  const oldChildren = component.__cache__;

  const childMap = {};
  for (let [i, child] of oldChildren.entries()) {
    childMap[child.__key__] = i;
  }

  let lastIndex = -1;
  for (let element of elements) {
    const [type, props, children] = element;
    let comp;
    let j;
    if (
      (j = childMap[props.key]) !== undefined &&
      (comp = oldChildren[j]).__type__ === type
    ) {
      delete childMap[props.key];
      if (j < lastIndex) {
        runner.schedule(moveComponent(comp));
      } else {
        lastIndex = j;
      }
      // When re-rendering, the cursor is not necessarily the previous settled element.
      if (isComposite(comp)) {
        runner.schedule(() =>
          runner.setCursor(() => comp.__$first__.previousSibling)
        );
      } else {
        runner.schedule(() =>
          runner.setCursor(() => comp.__$node__.previousSibling)
        );
      }
      yield* renderComponent(
        comp,
        props,
        children,
        comp.__context__,
        depth + 1
      );
    } else {
      comp = yield* instantiateComponent(element, context, depth + 1);
    }
    // !!! Bug fix: let parent advance cursor !!!
    if (isComposite(comp)) {
      runner.schedule(() => runner.setCursor(() => comp.__$last__));
    } else {
      runner.schedule(() => runner.setCursor(() => comp.__$node__));
    }
    newChildren.push(comp);
  }
  for (let i of Object.values(childMap)) {
    const comp = oldChildren[i];
    destroyComponent(comp);
    runner.schedule(unmountComponent(comp));
  }
  component.__cache__ = newChildren;
  component.__cache__.isText = false;
}

function destroyComponent(component) {
  if (component.__DESTROYED__) throw "hey";
  component.__DESTROYED__ = true;

  if (isComposite(component)) {
    component.__state__.notify("beforeunmount");
    component.__subscriptions__.forEach((subscription) => {
      subscription.cancel();
    });
    component.__requests__.forEach((task) => {
      task.canceled = true;
    });
  }
  const children = component.__cache__;
  children.forEach((child) => {
    destroyComponent(child);
  });
}

function render(element, container, context) {
  element = normalize(element);
  container.innerHTML = "";
  container.append(new Comment());
  requestRender(
    (function* () {
      runner.schedule(() => runner.setCursor(() => container.firstChild));

      yield* instantiateComponent(element, context, 0);
    })()
  );
}

function update(component) {
  const renderTask = (function* () {
    runner.schedule(() => {
      if (!isComposite(component))
        throw "Only composite components can be updated";
      runner.setCursor(() => component.__$first__.previousSibling);
    });

    yield* renderComponent(
      component,
      component.__memoized_props__,
      component.__memoized_children__,
      component.__context__,
      component.__depth__
    );
  })();

  renderTask.canceled = false;
  renderTask.sender = component;
  component.__requests__.push(renderTask);

  requestRender(renderTask);
}

export { render, update };
