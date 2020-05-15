var cursor = null;
var stack = [];
var pendingOperations = [];

function getCursor() {
  return cursor;
}

function setCursor(thunk) {
  cursor = thunk(cursor);
}

function pushCursor(thunk) {
  stack.push(cursor);
  cursor = thunk(cursor);
}

function popCursor() {
  cursor = stack.pop();
}

function schedule(operation) {
  pendingOperations.push(operation);
}

function commit() {
  pendingOperations.forEach((op) => {
    op(cursor);
  });
  pendingOperations = [];
}

export default {
  getCursor,
  setCursor,
  pushCursor,
  popCursor,
  schedule,
  commit,
};
