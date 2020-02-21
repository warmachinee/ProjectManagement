(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["User"],{

/***/ "./src/component/Account/User.tsx":
/*!****************************************!*\
  !*** ./src/component/Account/User.tsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-loadable */ \"./node_modules/react-loadable/lib/index.js\");\n/* harmony import */ var react_loadable__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_loadable__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ \"./node_modules/@material-ui/core/esm/styles/index.js\");\n\r\n\r\n\r\nconst ProjectTable = react_loadable__WEBPACK_IMPORTED_MODULE_1___default()({\r\n    loader: () => __webpack_require__.e(/*! import() | ProjectTable */ \"ProjectTable\").then(__webpack_require__.bind(null, /*! ../Table/Project/ProjectTable */ \"./src/component/Table/Project/ProjectTable.tsx\")),\r\n    loading: () => null\r\n});\r\nconst Charts = react_loadable__WEBPACK_IMPORTED_MODULE_1___default()({\r\n    loader: () => Promise.all(/*! import() | Charts */[__webpack_require__.e(\"vendors~Charts~Manager~RouteProject~RouteUnderling\"), __webpack_require__.e(\"Charts\")]).then(__webpack_require__.bind(null, /*! ../Chart/Charts */ \"./src/component/Chart/Charts.tsx\")),\r\n    loading: () => null\r\n});\r\nconst useStyles = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__[\"makeStyles\"])(theme => ({}));\r\nconst User = props => {\r\n    const classes = useStyles();\r\n    return (react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null,\r\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Charts, null),\r\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ProjectTable, null)));\r\n};\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (User);\r\n\n\n//# sourceURL=webpack:///./src/component/Account/User.tsx?");

/***/ })

}]);