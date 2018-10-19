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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {

chrome.runtime.onMessage.addListener(
    function (data) {
        let { action, channel, invoiceTypes } = data
        switch (action) {
            case 'highlight':
                let list = []
                let doFilter = () => {
                    list = Array.from(document.querySelectorAll('.seat-row'))

                    list.forEach(price => {
                        price.style.borderTop = '';
                        price.style.borderBottom = '';
                        price.style.backgroundColor = '';
                    })

                    if (channel) {
                        list = list.filter(item => (item.getAttribute('channel') || '').indexOf(channel) >= 0)
                    }

                    if (invoiceTypes && invoiceTypes.length) {
                        list = list.filter(item => invoiceTypes.every(invoicetype => (item.getAttribute('invoicetype') || '').indexOf(invoicetype) >= 0))
                    }
                }

                let notify = (found) => {
                    chrome.runtime.sendMessage({
                        action: 'result',
                        found
                    })
                }

                let judge = () => {
                    if (list.length) {
                        var targetTop = list[0].parentElement.parentElement.offsetTop
                        list.forEach(price => {
                            price.style.borderTop = 'solid 1px red';
                            price.style.borderBottom = 'solid 1px red';
                            price.style.backgroundColor = '#ffe1d4';
                        })

                        window.scrollTo(0, targetTop)
                        notify(true)
                    } else {
                        let y = window.scrollY
                        window.scrollTo(0, y + 1000)
                        setTimeout(() => {
                            let y2 = window.scrollY
                            if (y2 > y) {
                                doFilter()
                                judge()
                            } else {
                                notify(false)
                            }
                        }, 100)
                    }
                }

                doFilter()
                judge()

                break
            default:
                break
        }
    }
)

/***/ })

/******/ });