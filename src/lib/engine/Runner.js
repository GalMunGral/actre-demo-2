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
  console.log("start");
  pendingOperations.forEach((op) => {
    // console.log(op);
    op(cursor);
    console.log(cursor, stack);
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
