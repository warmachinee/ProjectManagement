(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["RouteProject"],{

/***/ "./src/component/Chart/ChartTooltip.tsx":
/*!**********************************************!*\
  !*** ./src/component/Chart/ChartTooltip.tsx ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core */ \"./node_modules/@material-ui/core/esm/index.js\");\n/* harmony import */ var _AppContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../AppContext */ \"./src/AppContext.tsx\");\n\r\n\r\n\r\nconst ChartTooltip = ({ data }) => {\r\n    const theme = Object(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__[\"useTheme\"])();\r\n    const { label, value } = data;\r\n    const { _thousandSeperater } = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useContext\"])(_AppContext__WEBPACK_IMPORTED_MODULE_2__[\"AppContext\"]);\r\n    return (react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", { style: { display: \"flex\" } },\r\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__[\"Typography\"], { variant: \"body1\", style: {\r\n                color: theme.palette.grey[900],\r\n                fontWeight: 400,\r\n                marginRight: 8\r\n            } }, label),\r\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__[\"Typography\"], { variant: \"body1\", style: { color: theme.palette.grey[900], fontWeight: 700 } },\r\n            _thousandSeperater(value),\r\n            \" \\u0E3F\")));\r\n};\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (ChartTooltip);\r\n\n\n//# sourceURL=webpack:///./src/component/Chart/ChartTooltip.tsx?");

/***/ })

}]);