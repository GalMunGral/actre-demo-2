"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCursor = getCursor;
exports.setCursor = setCursor;
exports.pushCursor = pushCursor;
exports.popCursor = popCursor;
exports.schedule = schedule;
exports.commit = commit;
var cursor = null;
var stack = [];
var pendingOperations = [];

function getCursor() {
  return cursor;
}

function setCursor(node) {
  cursor = node;
}

function pushCursor(node) {
  stack.push(cursor);
  cursor = node;
}

function popCursor() {
  cursor = stack.pop();
}

function schedule(operation) {
  pendingOperations.push(operation);
}

function commit() {
  pendingOperations.forEach(o => o());
  pendingOperations = [];
}