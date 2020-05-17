import Heap from "heap";
import runner from "./Runner";

var currentTask = null;
var pendingTasks = new Heap(function priority(a, b) {
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
      const { done } = currentTask.next();
      if (done) {
        window.requestAnimationFrame(commitUpdate);
        return;
      }
    }
    window.requestIdleCallback(doWork);
  } catch (e) {
    console.log(e.stack);
  }
}

function commitUpdate() {
  runner.commit();
  currentTask = null;

  // Find next task that is not canceled
  while (!pendingTasks.empty()) {
    const next = pendingTasks.pop();
    if (
      next &&
      !next.canceled &&
      next.sender.__$first__ &&
      next.sender.__$first__.isConnected // Make sure the component has not been unmounted
    ) {
      currentTask = next;
      window.requestIdleCallback(doWork);
      break;
    }
  }
}

export { requestRender };
