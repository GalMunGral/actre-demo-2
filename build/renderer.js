/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/lib/server/HTMLRenderer.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/html-tags/html-tags-void.json":
/*!****************************************************!*\
  !*** ./node_modules/html-tags/html-tags-void.json ***!
  \****************************************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, default */
/***/ (function(module) {

eval("module.exports = JSON.parse(\"[\\\"area\\\",\\\"base\\\",\\\"br\\\",\\\"col\\\",\\\"embed\\\",\\\"hr\\\",\\\"img\\\",\\\"input\\\",\\\"link\\\",\\\"menuitem\\\",\\\"meta\\\",\\\"param\\\",\\\"source\\\",\\\"track\\\",\\\"wbr\\\"]\");\n\n//# sourceURL=webpack:///./node_modules/html-tags/html-tags-void.json?");

/***/ }),

/***/ "./node_modules/html-tags/void.js":
/*!****************************************!*\
  !*** ./node_modules/html-tags/void.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nmodule.exports = __webpack_require__(/*! ./html-tags-void.json */ \"./node_modules/html-tags/html-tags-void.json\");\n\n\n//# sourceURL=webpack:///./node_modules/html-tags/void.js?");

/***/ }),

/***/ "./src/lib/common/Utilities.js":
/*!*************************************!*\
  !*** ./src/lib/common/Utilities.js ***!
  \*************************************/
/*! exports provided: isVoidElement, toKebabCase, normalize, equals, isGeneratorFunction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isVoidElement\", function() { return isVoidElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"toKebabCase\", function() { return toKebabCase; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"normalize\", function() { return normalize; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"equals\", function() { return equals; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isGeneratorFunction\", function() { return isGeneratorFunction; });\n/* harmony import */ var html_tags_void__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! html-tags/void */ \"./node_modules/html-tags/void.js\");\n/* harmony import */ var html_tags_void__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(html_tags_void__WEBPACK_IMPORTED_MODULE_0__);\n\nconst voidElements = new Set(html_tags_void__WEBPACK_IMPORTED_MODULE_0___default.a);\n\nfunction isVoidElement(tag) {\n  return voidElements.has(tag);\n}\n\nfunction toKebabCase(s) {\n  return s.replace(/[A-Z]/g, c => \"-\" + c.toLowerCase());\n}\n\nfunction normalize(element, index = 0) {\n  const type = element[0];\n  let props = {};\n  let children = [];\n\n  for (let item of element.slice(1)) {\n    if (typeof item === \"object\" && !Array.isArray(item)) {\n      props = item;\n    } else {\n      children = item;\n    }\n  }\n\n  if (props.key === undefined || props.key === null) {\n    if (props.id !== undefined && props.id !== null) {\n      props.key = props.id;\n    } else {\n      props.key = index;\n    }\n  }\n\n  return [type, props, children];\n}\n\nfunction equals(a, b) {\n  if (a == null && b == null) return true;\n  if (a == null || b == null) return false;\n  if (typeof a != typeof b) return false;\n  if (/number|string|boolean|symbol|function/.test(typeof a)) return a == b;\n\n  if (Array.isArray(a) && Array.isArray(b)) {\n    if (a.length != b.length) return false;\n\n    for (let i = 0; i < a.length; i++) {\n      if (!equals(a[i], b[i])) return false;\n    }\n\n    return true;\n  }\n\n  if (Array.isArray(a) || Array.isArray(b)) return false;\n  if (Object.keys(a).length != Object.keys(b).length) return false;\n\n  for (let key of Object.keys(a)) {\n    if (!b.hasOwnProperty(key)) return false;\n    if (!equals(a[key], b[key])) return false;\n  }\n\n  return true;\n}\n\nfunction isGeneratorFunction(obj) {\n  const constructor = obj.constructor;\n  return constructor && constructor.name === \"GeneratorFunction\";\n}\n\n\n\n//# sourceURL=webpack:///./src/lib/common/Utilities.js?");

/***/ }),

/***/ "./src/lib/server/HTMLRenderer.js":
/*!****************************************!*\
  !*** ./src/lib/server/HTMLRenderer.js ***!
  \****************************************/
/*! exports provided: renderToString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"renderToString\", function() { return renderToString; });\n/* harmony import */ var _common_Utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/Utilities */ \"./src/lib/common/Utilities.js\");\n\n\nfunction renderHTMLToBuffer(element, buffer, context) {\n  const [type, props, children] = element;\n  buffer.push(`<${type}`);\n\n  for (const [name, value] of Object.entries(props)) {\n    if (/^on/.test(name)) {\n      continue; // Skip event listeners\n    } else if (name === \"style\") {\n      const cssString = Object.entries(value).map(([k, v]) => `${Object(_common_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"toKebabCase\"])(k)}:${v};`).join(\"\");\n      buffer.push(` style=\"${cssString}\"`);\n    } else if (name === \"className\") {\n      buffer.push(` class=\"${props.className}\"`);\n    } else {\n      buffer.push(` ${Object(_common_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"toKebabCase\"])(name)}=\"${value}\"`);\n    }\n  }\n\n  if (Object(_common_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"isVoidElement\"])(type)) {\n    buffer.push(\"/>\");\n  } else {\n    buffer.push(\">\");\n\n    if (!Array.isArray(children)) {\n      buffer.push(String(children));\n    } else {\n      buffer.push(\" \");\n      children.filter(e => e).map(_common_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"normalize\"]).forEach(e => renderToBuffer(e, buffer, context));\n    }\n\n    buffer.push(`</${type}>`);\n  }\n}\n\nfunction renderToBuffer(element, buffer, context) {\n  console.log(buffer);\n  let [type, props, children] = element;\n\n  if (typeof type === \"function\") {\n    context = Object.create(context, {\n      component: {\n        value: type\n      }\n    });\n    const state = {\n      on: () => {}\n    };\n    const component = type(state, context);\n    const childElements = component(props, children); // Render\n\n    childElements.filter(e => e).map(_common_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"normalize\"]).forEach(e => renderToBuffer(e, buffer, context));\n  } else {\n    renderHTMLToBuffer(element, buffer, context);\n  }\n}\n\nfunction renderToString(rootElement, context) {\n  const buffer = [];\n  renderToBuffer(Object(_common_Utilities__WEBPACK_IMPORTED_MODULE_0__[\"normalize\"])(rootElement), buffer, context);\n  return buffer.join(\"\");\n}\n\n\n\n//# sourceURL=webpack:///./src/lib/server/HTMLRenderer.js?");

/***/ })

/******/ });