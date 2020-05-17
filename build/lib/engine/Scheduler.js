"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestRender = requestRender;

var _heap = _interopRequireDefault(require("heap"));

var _Runner = require("./Runner");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentTask = null;
var pendingTasks = new _heap.default(function priority(a, b) {
  return a.sender.__depth__ - b.sender.__depth__;
});

function requestRender(renderTask) {
  if (currentTask) {
    pendingTasks.push(renderTask);
  } else {
    currentTask = renderTask;
    window.requestIdleCallback(doWork);
  }
}

function doWork(deadline) {
  try {
    while (deadline.timeRemaining()) {
      const {
        done,
        value: work
      } = currentTask.next();

      if (done) {
        return window.requestAnimationFrame(commitUpdate);
      } else {
        // value(); // Synchronous mode
        (0, _Runner.schedule)(work); // Asynchronous mode
      }
    }

    window.requestIdleCallback(doWork);
  } catch (e) {
    console.log(e.stack);
  }
}

function commitUpdate() {
  (0, _Runner.commit)();
  currentTask = null; // Find next task that is not canceled

  while (!pendingTasks.empty()) {
    const next = pendingTasks.pop();

    if (next && !next.canceled && next.sender.__$first__ && next.sender.__$first__.isConnected // Make sure the component has not been unmounted
    ) {
        currentTask = next;
        window.requestIdleCallback(doWork);
        break;
      }
  }
}