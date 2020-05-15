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

  // Find next task that is not canceled
  while (pendingTasks.length > 0) {
    const next = pendingTasks.shift();
    if (next.canceled) {
      console.error("canceled");
      continue;
    }
    currentTask = next;
    console.error(
      currentTask,
      pendingTasks.map((s) => [s.name, s.canceled, s.reason])
    );
    return window.requestIdleCallback(doWork);
  }
}

export { requestRender };
