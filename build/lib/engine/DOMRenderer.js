"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.update = update;

var _Scheduler = require("./Scheduler");

var _Runner = require("./Runner");

var _Observer = require("./Observer");

var _Utilities = require("./Utilities");

var _Component = require("./Component");

function* instantiateComponent(element, context, depth) {
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
    component = (0, _Component.DOMComponent)(type);
    yield () => (0, _Component.mountComponent)(component);
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
  const isFirstRender = !component.__memoized_props__ && !component.__memoized_children__;

  if ((0, _Utilities.equals)(props, component.__memoized_props__) && (0, _Utilities.equals)(children, component.__memoized_children__) && !component.__dirty__) {
    return;
  }

  component.__memoized_props__ = props;
  component.__memoized_children__ = children;
  component.__dirty__ = false;

  if ((0, _Component.isComposite)(component)) {
    component.__state__.notify(isFirstRender ? "beforerender" : "beforeupdate", {
      nextProps: props,
      nextChildren: children
    });
  }

  if ((0, _Component.isComposite)(component)) {
    // Render
    (0, _Observer.setRenderingComponent)(component);
    const rendered = component(props, children);
    (0, _Observer.setRenderingComponent)(null);
    yield () => (0, _Runner.pushCursor)((0, _Runner.getCursor)());
    yield* reconcileChildren(component, rendered, context, depth);
    yield () => {
      component.__$last__ = (0, _Runner.getCursor)();
      (0, _Runner.popCursor)();
      component.__$first__ = (0, _Runner.getCursor)().nextSibling;

      component.__state__.notify(isFirstRender ? "mounted" : "updatecommited");
    };
  } else {
    yield () => component(props); // Render

    if (!Array.isArray(children)) {
      for (let child of component.__cache__) {
        if ((0, _Component.isComposite)(child)) {
          child.__state__.notify("beforeunmount");
        }

        destroyComponent(child);
      }

      component.__cache__ = [];
      component.__cache__.isText = true;
      yield () => {
        component.__$node__.textContent = String(children);
      };
    } else {
      yield () => (0, _Runner.pushCursor)(component.__$first_child__);
      yield* reconcileChildren(component, children, context, depth);
      yield () => (0, _Runner.popCursor)();
    }
  }
}

function* reconcileChildren(component, elements, context, depth) {
  if (component.__cache__.length === 0 && component.__cache__.isText) {
    if ((0, _Component.isComposite)(component)) throw "A composite component must not render to text!";
    yield () => {
      component.__$node__.innerHTML = "";

      component.__$node__.append(component.__$first_child__);
    };
  }

  elements = elements.filter(e => e).map(_Utilities.normalize);
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

    if ((j = childMap[props.key]) !== undefined && (comp = oldChildren[j]).__type__ === type) {
      delete childMap[props.key];

      if (j < lastIndex) {
        yield () => (0, _Component.moveComponent)(comp);
      } else {
        lastIndex = j;
      } // When re-rendering, the cursor is not necessarily the previous settled element.


      yield () => {
        (0, _Runner.setCursor)((0, _Component.isComposite)(comp) ? comp.__$first__.previousSibling : comp.__$node__.previousSibling);
      };
      yield* renderComponent(comp, props, children, comp.__context__, depth + 1);
    } else {
      comp = yield* instantiateComponent(element, context, depth + 1);
    }

    yield () => {
      (0, _Runner.setCursor)((0, _Component.isComposite)(comp) ? comp.__$last__ : comp.__$node__);
    };
    newChildren.push(comp);
  }

  for (let i of Object.values(childMap)) {
    const comp = oldChildren[i];
    destroyComponent(comp);
    yield () => (0, _Component.unmountComponent)(comp);
  }

  component.__cache__ = newChildren;
  component.__cache__.isText = false;
}

function destroyComponent(component) {
  if (component.__DESTROYED__) throw "hey";
  component.__DESTROYED__ = true;

  if ((0, _Component.isComposite)(component)) {
    component.__state__.notify("beforeunmount");

    component.__subscriptions__.forEach(subscription => {
      subscription.cancel();
    });

    component.__requests__.forEach(task => {
      task.canceled = true;
    });
  }

  const children = component.__cache__;
  children.forEach(child => {
    destroyComponent(child);
  });
}

function render(element, container, context) {
  element = (0, _Utilities.normalize)(element);
  container.innerHTML = "";
  container.append(new Comment());
  (0, _Scheduler.requestRender)(function* renderTask() {
    yield () => (0, _Runner.setCursor)(container.firstChild);
    yield* instantiateComponent(element, context, 0);
  }());
}

function update(component) {
  const renderTask = function* renderTask() {
    yield () => (0, _Runner.setCursor)(component.__$first__.previousSibling);
    yield* renderComponent(component, component.__memoized_props__, component.__memoized_children__, component.__context__, component.__depth__);
  }();

  renderTask.canceled = false;
  renderTask.sender = component;

  component.__requests__.push(renderTask);

  (0, _Scheduler.requestRender)(renderTask);
}