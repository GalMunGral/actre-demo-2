import runner from "./Runner";

var currentTask = null;
var pendingTasks = [];

function requestRender(renderTask) {
  if (currentTask) {
    pendingTasks.push(renderTask);
  } else {
    currentTask = renderTask;
    window.requestIdleCallback(doWork);
  }
}

function doWork(deadline) {
  while (deadline.timeRemaining() > 5) {
    const { done } = currentTask.next();
    if (done) {
      window.requestAnimationFrame(commitUpdate);
      return;
    }
  }
  window.requestIdleCallback(doWork);
}

function commitUpdate() {
  runner.commit();
  currentTask = null;
  if (pendingTasks.length > 0) {
    currentTask = pendingTasks.shift();
    window.requestIdleCallback(doWork);
  }
}

export { requestRender };
