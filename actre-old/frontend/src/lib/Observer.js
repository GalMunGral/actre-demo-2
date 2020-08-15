import { update } from "./DOMRenderer";

var renderingComponent;
function setRenderingComponent(comp) {
  renderingComponent = comp;
}

window.getRenderingComponent = () => renderingComponent;

class State extends EventTarget {
  on(eventType, listener) {
    return this.addEventListener(eventType, (e) => {
      listener(e.detail);
    });
  }
  notify(eventType, detail) {
    return this.dispatchEvent(new CustomEvent(eventType, { detail }));
  }
}

function observe(component, state, context) {
  observeState: {
    let stateChangeCounter = 0;
    for (let [key, value] of Object.entries(state)) {
      const fieldName = `__${key}__`;
      state[fieldName] = value;
      Object.defineProperty(state, key, {
        get() {
          return state[fieldName];
        },
        set(newValue) {
          state[fieldName] = newValue;
          stateChangeCounter++;
          /* Batch updates */
          if (stateChangeCounter === 1) {
            window.queueMicrotask(() => {
              stateChangeCounter = 0;
              component.__dirty__ = true;
              update(component);
            });
          }
        },
      });
    }
  }

  observeContext: {
    for (let [key, value] of Object.entries(context)) {
      const fieldName = `__${key}__`;
      context[fieldName] = value;

      const observers = new Set();
      let stateChangeCounter = 0;

      Object.defineProperty(context, key, {
        get() {
          if (renderingComponent) {
            observers.add(renderingComponent);
          }
          return context[fieldName];
        },
        set(newValue) {
          context[fieldName] = newValue;
          stateChangeCounter++;
          /* Batch updates */
          if (stateChangeCounter === 1) {
            window.queueMicrotask(() => {
              stateChangeCounter = 0;
              for (let observer of observers) {
                observer.__dirty__ = true;
                update(observer);
              }
            });
          }
        },
      });
    }
  }

  state.notify("init");
}

export { State, observe, setRenderingComponent };
