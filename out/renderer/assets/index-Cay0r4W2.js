function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$2 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$2() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$2;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$2, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$2;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React$2 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v$1(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v$1(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v$1(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v$1(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v$1(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v$1(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v$1(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v$1(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v$1(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v$1(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v$1(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v$1(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v$1(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v$1(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v$1("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v$1(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X$1 = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X$1, e = Xj;
      X$1 = null;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X$1.removeChild(c.stateNode));
      break;
    case 18:
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X$1, c.stateNode));
      break;
    case 4:
      d = X$1;
      e = Xj;
      X$1 = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X$1 = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X$1) throw Error(p(160));
      Zj(f2, g, e);
      X$1 = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && array.indexOf(className) === index;
}).join(" ");
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRight = createLucideIcon("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ban = createLucideIcon("Ban", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.9 4.9 14.2 14.2", key: "1m5liu" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookOpen = createLucideIcon("BookOpen", [
  ["path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", key: "vv98re" }],
  ["path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z", key: "1cyq3y" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Briefcase = createLucideIcon("Briefcase", [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CheckCheck = createLucideIcon("CheckCheck", [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronUp = createLucideIcon("ChevronUp", [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleAlert = createLucideIcon("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleCheck = createLucideIcon("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleX = createLucideIcon("CircleX", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardList = createLucideIcon("ClipboardList", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardPaste = createLucideIcon("ClipboardPaste", [
  [
    "path",
    { d: "M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z", key: "1pp7kr" }
  ],
  [
    "path",
    {
      d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10",
      key: "2ik1ml"
    }
  ],
  ["path", { d: "m17 10 4 4-4 4", key: "vp2hj1" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock = createLucideIcon("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Copy = createLucideIcon("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Database = createLucideIcon("Database", [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Download = createLucideIcon("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Earth = createLucideIcon("Earth", [
  ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
  [
    "path",
    {
      d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
      key: "1tzkfa"
    }
  ],
  ["path", { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05", key: "14pb5j" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ExternalLink = createLucideIcon("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileText = createLucideIcon("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderOpen = createLucideIcon("FolderOpen", [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutDashboard = createLucideIcon("LayoutDashboard", [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LoaderCircle = createLucideIcon("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plug = createLucideIcon("Plug", [
  ["path", { d: "M12 22v-5", key: "1ega77" }],
  ["path", { d: "M9 8V2", key: "14iosj" }],
  ["path", { d: "M15 8V2", key: "18g5xt" }],
  ["path", { d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z", key: "osxo6l" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plus = createLucideIcon("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PowerOff = createLucideIcon("PowerOff", [
  ["path", { d: "M18.36 6.64A9 9 0 0 1 20.77 15", key: "dxknvb" }],
  ["path", { d: "M6.16 6.16a9 9 0 1 0 12.68 12.68", key: "1x7qb5" }],
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Power = createLucideIcon("Power", [
  ["path", { d: "M12 2v10", key: "mnfbl" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RefreshCw = createLucideIcon("RefreshCw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Save = createLucideIcon("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Send = createLucideIcon("Send", [
  ["path", { d: "m22 2-7 20-4-9-9-4Z", key: "1q3vgg" }],
  ["path", { d: "M22 2 11 13", key: "nzbqef" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Settings2 = createLucideIcon("Settings2", [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Settings = createLucideIcon("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldAlert = createLucideIcon("ShieldAlert", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldCheck = createLucideIcon("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Target = createLucideIcon("Target", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TrendingUp = createLucideIcon("TrendingUp", [
  ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
  ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Upload = createLucideIcon("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserCheck = createLucideIcon("UserCheck", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["polyline", { points: "16 11 18 13 22 9", key: "1pwet4" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const User = createLucideIcon("User", [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
const __vite_import_meta_env__$1 = {};
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => {
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners.clear();
  };
  const api = { setState, getState, getInitialState, subscribe, destroy };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
var withSelector = { exports: {} };
var withSelector_production = {};
var shim$2 = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React$1 = reactExports;
function is$1(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs$1 = "function" === typeof Object.is ? Object.is : is$1, useState = React$1.useState, useEffect$1 = React$1.useEffect, useLayoutEffect = React$1.useLayoutEffect, useDebugValue$2 = React$1.useDebugValue;
function useSyncExternalStore$2(subscribe, getSnapshot) {
  var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
  useLayoutEffect(
    function() {
      inst.value = value;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
    },
    [subscribe, value, getSnapshot]
  );
  useEffect$1(
    function() {
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      });
    },
    [subscribe]
  );
  useDebugValue$2(value);
  return value;
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs$1(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot) {
  return getSnapshot();
}
var shim$1 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React$1.useSyncExternalStore ? React$1.useSyncExternalStore : shim$1;
{
  shim$2.exports = useSyncExternalStoreShim_production;
}
var shimExports = shim$2.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = reactExports, shim = shimExports;
function is(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue$1 = React.useDebugValue;
withSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function() {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (void 0 !== isEqual && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot))
              return memoizedSelection = currentSelection;
          }
          return memoizedSelection = nextSnapshot;
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector(nextSnapshot);
        if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
          return memoizedSnapshot = nextSnapshot, currentSelection;
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection = nextSelection;
      }
      var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
      return [
        function() {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot ? void 0 : function() {
          return memoizedSelector(maybeGetServerSnapshot());
        }
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function() {
      inst.hasValue = true;
      inst.value = value;
    },
    [value]
  );
  useDebugValue$1(value);
  return value;
};
{
  withSelector.exports = withSelector_production;
}
var withSelectorExports = withSelector.exports;
const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(withSelectorExports);
const __vite_import_meta_env__ = {};
const { useDebugValue } = React$2;
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
let didWarnAboutEqualityFn = false;
const identity = (arg) => arg;
function useStore$1(api, selector = identity, equalityFn) {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && equalityFn && !didWarnAboutEqualityFn) {
    console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
    );
    didWarnAboutEqualityFn = true;
  }
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && typeof createState !== "function") {
    console.warn(
      "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
    );
  }
  const api = typeof createState === "function" ? createStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore$1(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
function hasTerm(text, term) {
  const t2 = term.trim().toLowerCase();
  if (t2.length < 2) return false;
  const escaped = t2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(text);
}
const DEFAULT_TARGET_SENIORITY$2 = ["Junior", "Semi Senior", "SSR"];
const SENIORITY_PATTERNS = {
  trainee: [/(^|[^a-z0-9])(trainee|pasante|internship|intern)([^a-z0-9]|$)/i],
  junior: [/(^|[^a-z0-9])(junior|jr\.?)([^a-z0-9]|$)/i],
  "semi senior": [
    /(^|[^a-z0-9])(semi[\s-]?senior|semi[\s-]?sr\.?|semisenior|ssr)([^a-z0-9]|$)/i
  ],
  ssr: [/(^|[^a-z0-9])(ssr|semi[\s-]?senior|semi[\s-]?sr\.?|semisenior)([^a-z0-9]|$)/i],
  mid: [/(^|[^a-z0-9])(mid[\s-]?level|mid|intermediate|semi[\s-]?senior|ssr)([^a-z0-9]|$)/i],
  lead: [/(^|[^a-z0-9])(lead|tech lead|team lead)([^a-z0-9]|$)/i],
  staff: [/(^|[^a-z0-9])staff([^a-z0-9]|$)/i],
  principal: [/(^|[^a-z0-9])principal([^a-z0-9]|$)/i]
};
const SENIORITY_MAX_YEARS = {
  trainee: 1,
  junior: 2,
  "semi senior": 4,
  ssr: 4,
  mid: 4,
  senior: 99,
  lead: 99,
  staff: 99,
  principal: 99
};
function normalizeSeniority(value) {
  return value.trim().toLowerCase().replace(/\./g, "").replace(/_/g, " ").replace(/\s+/g, " ");
}
function getTargetSeniorities(profile) {
  const values = (profile.targetSeniority?.length ? profile.targetSeniority : DEFAULT_TARGET_SENIORITY$2).map(normalizeSeniority);
  return [...new Set(values)];
}
function matchesSeniority(text, seniority) {
  if (seniority === "senior") return matchesStandaloneSenior(text);
  const patterns = SENIORITY_PATTERNS[seniority];
  return patterns ? patterns.some((pattern) => pattern.test(text)) : hasTerm(text, seniority);
}
function matchesStandaloneSenior(text) {
  const seniorMatches = [...text.matchAll(/(^|[^a-z0-9])(senior|sr\.?)([^a-z0-9]|$)/gi)];
  return seniorMatches.some((match) => {
    const start = match.index ?? 0;
    const prefix = text.slice(Math.max(0, start - 10), start + match[1].length).toLowerCase();
    return !/(semi[\s-]?|mid[\s-]?)$/.test(prefix);
  });
}
function requiredYearsRange(text) {
  if (/(sin experiencia|no se requiere experiencia|without experience|no experience)/i.test(text)) {
    return { min: 0, max: 0 };
  }
  const matches = [...text.matchAll(/(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?\s*\+?\s*(?:años|anos|years|yrs)/gi)];
  if (matches.length === 0) return null;
  const ranges = matches.map((match) => ({
    min: Number(match[1]),
    max: Number(match[2] ?? match[1])
  }));
  return {
    min: Math.min(...ranges.map((range) => range.min)),
    max: Math.max(...ranges.map((range) => range.max))
  };
}
function parseMoney$1(value) {
  const compact = value.replace(/\s+/g, "");
  const normalized = compact.includes(",") && !compact.includes(".") ? compact.replace(",", ".") : compact.replace(/[.,]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function parseSalaryRange(value) {
  const text = value ?? "";
  const currencyMatch = text.match(/(USD|ARS|EUR|US\$|U\$S|\$)/i);
  const rawCurrency = currencyMatch?.[1];
  const currency = rawCurrency ? rawCurrency === "$" ? "ARS" : rawCurrency.replace(/^US\$|^U\$S$/i, "USD").toUpperCase() : void 0;
  const numbers = [...text.matchAll(/\d[\d.,]*/g)].map((match) => parseMoney$1(match[0])).filter((number) => typeof number === "number");
  return { currency, min: numbers[0], max: numbers[1] ?? numbers[0] };
}
function hasHighSenioritySignal(text) {
  for (const level of ["lead", "staff", "principal", "senior"]) {
    if (matchesSeniority(text, level)) return level;
  }
  return null;
}
function isAvoidMatch(text, term) {
  const normalized = normalizeSeniority(term);
  if (normalized === "senior") return matchesSeniority(text, "senior");
  return hasTerm(text, term);
}
function scoreSeniority(text, profile) {
  const targets = getTargetSeniorities(profile);
  const positives = [];
  const negatives = [];
  const matchedTarget = targets.find((level) => matchesSeniority(text, level));
  if (matchedTarget) positives.push(`seniority: ${matchedTarget}`);
  const highSignal = hasHighSenioritySignal(text);
  const seniorityMaxYears = Math.max(...targets.map((level) => SENIORITY_MAX_YEARS[level] ?? 4));
  const maxAcceptedYears = typeof profile.experienceYearsMax === "number" ? profile.experienceYearsMax : seniorityMaxYears;
  const years = requiredYearsRange(text);
  if (highSignal && !targets.includes(highSignal)) {
    negatives.push(`seniority alto: ${highSignal}`);
  }
  if (years !== null && years.max > maxAcceptedYears) {
    negatives.push(`experiencia requerida: ${years.max}+ años`);
  }
  if (years !== null && typeof profile.experienceYearsMin === "number" && years.max < profile.experienceYearsMin) {
    negatives.push(`experiencia por debajo del rango: ${years.max} años`);
  }
  return {
    points: (matchedTarget ? 10 : 0) - (negatives.length ? 22 : 0),
    positives,
    negatives
  };
}
function scoreOffer(offer, profile) {
  if (!profile) return { score: 50, positives: [], negatives: [] };
  const text = [offer.title, offer.description, ...offer.requirements ?? []].join(" ").toLowerCase();
  let score = 42;
  const positives = [];
  const negatives = [];
  let mainPts = 0;
  for (const tech of profile.mainStack ?? []) if (hasTerm(text, tech)) {
    mainPts += 8;
    positives.push(tech);
  }
  score += Math.min(mainPts, 30);
  if ((profile.preferredModality ?? []).some((m2) => hasTerm(text, m2))) {
    score += 6;
    positives.push("modalidad");
  }
  if ((profile.preferredLocation ?? []).some((l2) => hasTerm(text, l2))) {
    score += 6;
    positives.push("ubicación");
  }
  const seniority = scoreSeniority(text, profile);
  score += seniority.points;
  positives.push(...seniority.positives);
  negatives.push(...seniority.negatives);
  const offeredSalary = parseSalaryRange(offer.salary);
  const sameCurrency = !offeredSalary.currency || !profile.salaryCurrency || offeredSalary.currency === profile.salaryCurrency.toUpperCase();
  if (typeof profile.salaryMin === "number" && typeof offeredSalary.max === "number" && sameCurrency) {
    if (offeredSalary.max < profile.salaryMin) {
      score -= 18;
      negatives.push("salario debajo de pretensión");
    } else {
      score += 6;
      positives.push("salario compatible");
    }
  }
  for (const bad of profile.avoid ?? []) if (isAvoidMatch(text, bad)) {
    score -= 18;
    negatives.push(bad);
  }
  return { score: Math.max(0, Math.min(100, Math.round(score))), positives, negatives };
}
const RECOMMENDED_SCORE = 65;
function classifyByScore(score) {
  if (score >= RECOMMENDED_SCORE) return "recomendada";
  return "detectada";
}
function normalizeUrl(url) {
  try {
    const u2 = new URL(url);
    const host = u2.hostname.toLowerCase().replace(/^www\./, "");
    const path = u2.pathname.toLowerCase().replace(/\/$/, "");
    const indeedId = u2.searchParams.get("jk");
    if (host.includes("indeed.") && indeedId) return `${host}/viewjob?jk=${indeedId.toLowerCase()}`;
    const linkedInId = u2.searchParams.get("currentJobId") ?? u2.searchParams.get("jobId");
    if (host.includes("linkedin.") && linkedInId) return `${host}/jobs/view/${linkedInId.toLowerCase()}`;
    const linkedInPathId = path.match(/\/jobs\/view\/(\d+)/)?.[1];
    if (host.includes("linkedin.") && linkedInPathId) return `${host}/jobs/view/${linkedInPathId}`;
    u2.search = "";
    u2.hash = "";
    return `${host}${u2.pathname.toLowerCase().replace(/\/$/, "")}`;
  } catch {
    return url.toLowerCase().trim();
  }
}
function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/g, "").replace(/\s+/g, " ").trim();
}
function titleSimilarity(a, b) {
  const na = normalizeTitle(a);
  const nb2 = normalizeTitle(b);
  if (na === nb2) return 1;
  const wordsA = new Set(na.split(" ").filter((w2) => w2.length > 3));
  const wordsB = new Set(nb2.split(" ").filter((w2) => w2.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let shared = 0;
  for (const w2 of wordsA) if (wordsB.has(w2)) shared++;
  return shared / Math.max(wordsA.size, wordsB.size);
}
function detectDuplicates(incoming, existing) {
  const all = [...existing];
  const unique = [];
  const duplicates = [];
  const pairs = [];
  for (const offer of incoming) {
    const urlNorm = normalizeUrl(offer.link);
    const companyNorm = offer.company.toLowerCase().trim();
    let duplicateOf;
    for (const existing2 of all) {
      if (normalizeUrl(existing2.link) === urlNorm) {
        duplicateOf = existing2.id;
        break;
      }
    }
    if (!duplicateOf) {
      for (const ex of all) {
        if (ex.company.toLowerCase().trim() === companyNorm && titleSimilarity(ex.title, offer.title) >= 0.75) {
          duplicateOf = ex.id;
          break;
        }
      }
    }
    if (duplicateOf) {
      duplicates.push({ ...offer, status: "duplicada", duplicateOf });
      pairs.push({ original: duplicateOf, duplicate: offer.id });
    } else {
      unique.push(offer);
      all.push(offer);
    }
  }
  return { unique, duplicates, pairs };
}
const DEFAULT_AVOID_FILTERS = [
  "MLM",
  "Ventas a comisión pura sin sueldo base",
  "Inversión inicial",
  "Reviews negativos visibles",
  "Zona muy alejada no remota",
  "Inglés superior a B1",
  "Senior 5+ años",
  "Lead",
  "Staff",
  "Principal",
  "G&L GROUP"
];
const DEFAULT_STACK = [];
const DEFAULT_SOFT_SKILLS = ["Trabajo en equipo", "Comunicación con clientes y equipos técnicos", "Adaptabilidad"];
const DEFAULT_TARGET_SENIORITY$1 = ["Junior", "Semi Senior", "SSR"];
function parseTargetRoles(value) {
  return (value ?? "").split(/[,;\n/]+/).map((part) => part.trim()).filter(Boolean);
}
function parseDecimal(value) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : void 0;
}
function parseMoney(value) {
  const compact = value.replace(/\s+/g, "");
  const normalized = compact.includes(",") && !compact.includes(".") ? compact.replace(",", ".") : compact.replace(/[.,]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function parseExperienceYears(value) {
  const text = value ?? "";
  const match = text.match(/(\d{1,2}(?:[,.]\d+)?)\s*(?:\+|[-\u2013]\s*(\d{1,2}(?:[,.]\d+)?))?/);
  if (!match) return {};
  return {
    min: parseDecimal(match[1]),
    max: match[2] ? parseDecimal(match[2]) : void 0
  };
}
function parseSalaryExpectation(value) {
  const text = value ?? "";
  const currencyMatch = text.match(/(USD|ARS|EUR|US\$|U\$S|\$)/i);
  const rawCurrency = currencyMatch?.[1] ?? "USD";
  const currency = rawCurrency === "$" ? "ARS" : rawCurrency.replace(/^US\$|^U\$S$/i, "USD").toUpperCase();
  const numbers = [...text.matchAll(/\d[\d.,]*/g)].map((match) => parseMoney(match[0])).filter((number) => typeof number === "number");
  return { currency, min: numbers[0], max: numbers[1] };
}
function formatExperienceYearsRange(profile) {
  const min = profile.experienceYearsMin;
  const max = profile.experienceYearsMax;
  if (typeof min === "number" && typeof max === "number") return min === max ? `${min} años` : `${min}-${max} años`;
  if (typeof min === "number") return `${min}+ años`;
  if (typeof max === "number") return `hasta ${max} años`;
  return profile.experience?.trim() || "No definido";
}
function formatSalaryRange(profile) {
  const parsed = parseSalaryExpectation(profile.salaryExpectation);
  const currency = profile.salaryCurrency || parsed.currency || "USD";
  const min = profile.salaryMin;
  const max = profile.salaryMax;
  if (typeof min === "number" && typeof max === "number") return min === max ? `${currency} ${min}` : `${currency} ${min}-${max}`;
  if (typeof min === "number") return `${currency} ${min} como mínimo`;
  if (typeof max === "number") return `hasta ${currency} ${max}`;
  return profile.salaryExpectation?.trim() || "No definido";
}
const DEFAULT_PROFILE = {
  targetRole: "",
  targetRoles: [],
  personalInfo: {
    dni: "",
    email: "",
    phone: "",
    address: ""
  },
  mainStack: [...DEFAULT_STACK],
  secondaryStack: [],
  targetSeniority: [...DEFAULT_TARGET_SENIORITY$1],
  experienceYearsMin: void 0,
  experienceYearsMax: void 0,
  experience: "",
  softSkills: [...DEFAULT_SOFT_SKILLS],
  salaryCurrency: "USD",
  salaryMin: void 0,
  salaryMax: void 0,
  salaryExpectation: "",
  availability: ["Full-time"],
  preferredModality: [],
  preferredLocation: [],
  avoid: [...DEFAULT_AVOID_FILTERS],
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
const MOCK_PROFILE = {
  targetRole: "Frontend Developer SSR",
  targetRoles: ["Frontend Developer", "React Developer", "Angular Developer"],
  personalInfo: {
    dni: "",
    email: "",
    phone: "",
    address: ""
  },
  mainStack: ["React", "TypeScript", "Angular", "APIs REST", "Jest / React Testing Library"],
  secondaryStack: [],
  targetSeniority: [...DEFAULT_TARGET_SENIORITY$1],
  experienceYearsMin: 2,
  experienceYearsMax: 4,
  experience: "2+ años de experiencia en desarrollo frontend",
  softSkills: [...DEFAULT_SOFT_SKILLS],
  salaryCurrency: "USD",
  salaryMin: 2e3,
  salaryMax: 2800,
  salaryExpectation: "USD 2000 como mínimo",
  availability: ["Full-time"],
  preferredModality: ["Remoto", "Híbrido"],
  preferredLocation: ["CABA", "AMBA"],
  avoid: [
    "Soporte puro / Help Desk",
    "Backend dominante",
    "Presencial fuera de CABA/AMBA",
    "Senior 5+ años obligatorio",
    "Inglés avanzado excluyente",
    ...DEFAULT_AVOID_FILTERS
  ],
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
const DEFAULT_SETTINGS = {
  workFolder: "",
  portals: ["LinkedIn", "Bumeran", "Zonajobs", "GetOnBoard", "Computrabajo"]
};
const MOCK_OFFERS = [
  {
    id: "offer-1",
    title: "Frontend Developer SSR - React + TypeScript",
    company: "Mercado Libre",
    portal: "LinkedIn",
    link: "https://www.linkedin.com/jobs/view/frontend-ssr-1",
    description: `Buscamos un Frontend Developer Semi-Senior para sumarse a nuestro equipo de productos.
Stack: React, TypeScript, componentes reutilizables.
Modalidad: 100% remoto desde CABA/AMBA.
Salario: USD 2000-2800.
Experiencia requerida: 2-3 años.
Participación activa en ceremonias Scrum. Testing con Jest.
Beneficios: OSDE 410, bonos, home office allowance.`,
    requirements: ["React", "TypeScript", "2+ años de experiencia", "Jest/Testing", "Scrum"],
    modality: "Remoto",
    location: "CABA",
    salary: "USD 2000-2800",
    status: "recomendada",
    score: 88,
    scoreBreakdown: {
      positives: ["React", "TypeScript", "Frontend", "Remoto", "CABA/AMBA", "Testing", "Scrum", "Salario indicado", "Beneficios", "SSR / Semi-Senior"],
      negatives: []
    },
    detectedAt: new Date(Date.now() - 2 * 864e5).toISOString()
  },
  {
    id: "offer-2",
    title: "Angular Developer SSR",
    company: "Accenture",
    portal: "GetOnBoard",
    link: "https://getonboard.com/jobs/angular-ssr-2",
    description: `Posición de Angular Developer Semi Senior para proyecto bancario enterprise.
Stack principal: Angular 17+, TypeScript, RxJS.
Secundario: APIs REST, testing unitario, diseño de componentes.
Modalidad: Híbrido (3 días oficina, 2 remoto) - CABA.
Rango salarial: ARS + bonos. 2-4 años de experiencia en Angular.
Metodología Scrum. Beneficios prepaga y capacitaciones.`,
    requirements: ["Angular", "TypeScript", "RxJS", "2-4 años", "APIs REST"],
    modality: "Híbrido",
    location: "CABA",
    status: "recomendada",
    score: 79,
    scoreBreakdown: {
      positives: ["TypeScript", "Angular", "Frontend", "Híbrido", "CABA/AMBA", "APIs REST", "Testing", "Scrum", "Componentes/Design System", "SSR / Semi-Senior"],
      negatives: []
    },
    detectedAt: new Date(Date.now() - 1 * 864e5).toISOString()
  },
  {
    id: "offer-3",
    title: "React Developer - Startup Fintech",
    company: "Ualá",
    portal: "Bumeran",
    link: "https://bumeran.com.ar/empleos/react-3",
    description: `Startup fintech en crecimiento busca React Developer.
Trabajarás en el desarrollo de la app web con React y Redux.
Modalidad remota, equipo distribuido.
Experiencia: 1-3 años. Stack: React, TypeScript, Redux.
No se requiere inglés avanzado.`,
    requirements: ["React", "Redux", "TypeScript"],
    modality: "Remoto",
    location: "Buenos Aires",
    status: "aprobada",
    score: 72,
    scoreBreakdown: {
      positives: ["React", "TypeScript", "Frontend", "Remoto", "CABA/AMBA"],
      negatives: []
    },
    detectedAt: new Date(Date.now() - 3 * 864e5).toISOString()
  },
  {
    id: "offer-4",
    title: "Técnico de Soporte IT - Help Desk",
    company: "Telecom Argentina",
    portal: "Computrabajo",
    link: "https://computrabajo.com.ar/soporte-4",
    description: `Buscamos Técnico de Soporte para atención de tickets y mesa de ayuda.
Presencial en oficinas de Palermo. Help desk nivel 1 y 2.
No se requiere experiencia en desarrollo de software.`,
    requirements: ["Soporte técnico", "Windows", "Office"],
    modality: "Presencial",
    location: "Palermo, CABA",
    status: "rechazada",
    score: 8,
    scoreBreakdown: {
      positives: ["CABA/AMBA"],
      negatives: ["Soporte / Help Desk", "Presencial (sin híbrido)", "Descripción muy pobre"]
    },
    detectedAt: new Date(Date.now() - 2 * 864e5).toISOString()
  },
  {
    id: "offer-5",
    title: "Senior Frontend Developer - 7 años exp.",
    company: "GlobalTech",
    portal: "LinkedIn",
    link: "https://linkedin.com/jobs/senior-5",
    description: `Posición Senior para liderazgo técnico en equipo de frontend.
React, TypeScript, arquitectura frontend. 7+ años de experiencia obligatoria.
Inglés avanzado excluyente. Presencial en CABA 5 días.`,
    requirements: ["React", "TypeScript", "7+ años", "Inglés avanzado excluyente"],
    modality: "Presencial",
    location: "CABA",
    status: "rechazada",
    score: 22,
    scoreBreakdown: {
      positives: ["React", "TypeScript", "Frontend", "CABA/AMBA"],
      negatives: ["Seniority muy alto (5+ años)", "Presencial (sin híbrido)", "Inglés avanzado excluyente"]
    },
    detectedAt: new Date(Date.now() - 4 * 864e5).toISOString()
  },
  {
    id: "offer-6",
    title: "Frontend Developer React - DUPLICADA",
    company: "Mercado Libre",
    portal: "Zonajobs",
    link: "https://zonajobs.com.ar/meli-frontend-dup",
    description: `Buscamos Frontend Developer React para equipo de productos. Modalidad remota.
TypeScript, componentes, 2-3 años de experiencia.`,
    requirements: ["React", "TypeScript"],
    modality: "Remoto",
    location: "CABA",
    status: "duplicada",
    score: 75,
    duplicateOf: "offer-1",
    detectedAt: new Date(Date.now() - 1 * 864e5).toISOString()
  },
  {
    id: "offer-7",
    title: "React Frontend Developer SSR",
    company: "Naranja X",
    portal: "GetOnBoard",
    link: "https://getonboard.com/jobs/naranjax-7",
    description: `Naranja X busca un Frontend Developer para trabajar en nuestra plataforma fintech.
React, TypeScript, design system propio. Modalidad remota desde Argentina.
2-4 años de experiencia. Salario USD competitivo + beneficios.
Testing con React Testing Library. APIs REST. Scrum/Kanban.`,
    requirements: ["React", "TypeScript", "Testing", "APIs REST"],
    modality: "Remoto",
    location: "Argentina",
    status: "postulada",
    score: 85,
    scoreBreakdown: {
      positives: ["React", "TypeScript", "Frontend", "Remoto", "APIs REST", "Testing", "Scrum/Agile", "Componentes/Design System", "Salario indicado", "Beneficios"],
      negatives: []
    },
    detectedAt: new Date(Date.now() - 5 * 864e5).toISOString(),
    appliedAt: new Date(Date.now() - 3 * 864e5).toISOString(),
    result: "Postulación enviada correctamente. En espera de respuesta.",
    nextAction: "Hacer seguimiento en 5 días"
  },
  {
    id: "offer-8",
    title: "Frontend Developer - Vue.js",
    company: "Despegar",
    portal: "LinkedIn",
    link: "https://linkedin.com/jobs/despegar-8",
    description: `Despegar busca Frontend Developer con Vue.js y TypeScript.
Trabajo remoto desde CABA. APIs REST, testing, componentes.
2-3 años de experiencia. Stack: Vue 3, Nuxt, TypeScript.`,
    requirements: ["Vue.js", "TypeScript", "Nuxt"],
    modality: "Remoto",
    location: "CABA",
    status: "detectada",
    score: 58,
    scoreBreakdown: {
      positives: ["TypeScript", "Frontend", "Remoto", "CABA/AMBA", "Vue/Next", "APIs REST"],
      negatives: []
    },
    detectedAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
async function persist(key, data) {
  try {
    if (key === "profile") await window.api.saveProfile(data);
    else if (key === "offers") await window.api.saveOffers(data);
    else if (key === "settings") await window.api.saveSettings(data);
  } catch (err) {
    console.error(`Error persisting ${key}:`, err);
  }
}
const useStore = create((set, get) => ({
  profile: DEFAULT_PROFILE,
  offers: [],
  settings: DEFAULT_SETTINGS,
  activeView: "dashboard",
  loading: false,
  notification: null,
  helpRequests: [],
  setProfile: async (profile) => {
    set({ profile });
    await persist("profile", profile);
  },
  setOffers: async (offers) => {
    set({ offers });
    await persist("offers", offers);
  },
  setSettings: async (settings) => {
    set({ settings });
    await persist("settings", settings);
  },
  updateOffer: async (id2, updates) => {
    const offers = get().offers.map((o) => o.id === id2 ? { ...o, ...updates } : o);
    set({ offers });
    await persist("offers", offers);
  },
  approveOffer: async (id2) => {
    await get().updateOffer(id2, { status: "aprobada" });
  },
  rejectOffer: async (id2) => {
    await get().updateOffer(id2, { status: "rechazada" });
  },
  markOfferApplied: async (id2) => {
    const offer = get().offers.find((o) => o.id === id2);
    if (!offer || offer.status === "postulada" || offer.status === "duplicada") return;
    await get().updateOffer(id2, {
      status: "postulada",
      appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
      result: "Marcada manualmente como postulada desde JobPilot",
      nextAction: void 0
    });
    get().showNotification("success", `Postulación registrada: ${offer.title}`);
  },
  bulkApproveRecommended: async () => {
    const { settings } = get();
    const offers = get().offers.map(
      (o) => o.status === "recomendada" ? { ...o, status: "aprobada" } : o
    );
    set({ offers });
    await persist("offers", offers);
    const count = offers.filter((o) => o.status === "aprobada").length;
    get().showNotification("success", `${count} ofertas aprobadas`);
  },
  importOffers: (raw) => {
    const { profile, offers: existing } = get();
    const parsed = raw.filter((r2) => typeof r2 === "object" && r2 !== null).map((r2, idx) => {
      const id2 = r2.id || `imported-${Date.now()}-${idx}`;
      const offer = {
        id: id2,
        title: String(r2.title ?? "Sin título"),
        company: String(r2.company ?? "Empresa desconocida"),
        portal: String(r2.portal ?? "Desconocido"),
        link: String(r2.link ?? ""),
        description: String(r2.description ?? ""),
        requirements: Array.isArray(r2.requirements) ? r2.requirements : [],
        modality: r2.modality ? String(r2.modality) : void 0,
        location: r2.location ? String(r2.location) : void 0,
        salary: r2.salary ? String(r2.salary) : void 0,
        status: "detectada",
        score: 0,
        detectedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const { score, positives, negatives } = scoreOffer(offer, profile);
      offer.score = score;
      offer.scoreBreakdown = { positives, negatives };
      offer.status = classifyByScore(score);
      return offer;
    });
    const { unique, duplicates } = detectDuplicates(parsed, existing);
    const allOffers = [...existing, ...unique, ...duplicates];
    set({ offers: allOffers });
    persist("offers", allOffers);
    get().showNotification(
      "success",
      `${unique.length} oferta(s) importada(s), ${duplicates.length} duplicada(s) detectada(s)`
    );
  },
  setActiveView: (activeView) => set({ activeView }),
  setLoading: (loading) => set({ loading }),
  showNotification: (type, message) => {
    const id2 = Date.now().toString();
    set({ notification: { id: id2, type, message } });
    setTimeout(() => {
      if (get().notification?.id === id2) set({ notification: null });
    }, 4e3);
  },
  clearNotification: () => set({ notification: null }),
  getDashboardMetrics: () => {
    const { offers } = get();
    const counts = offers.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1;
        return acc;
      },
      {}
    );
    const portalCounts = offers.filter((o) => o.status === "postulada").reduce((acc, o) => {
      acc[o.portal] = (acc[o.portal] ?? 0) + 1;
      return acc;
    }, {});
    const bestPortal = Object.entries(portalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const scored = offers.filter((o) => o.score > 0);
    const avgScore = scored.length ? Math.round(scored.reduce((s, o) => s + o.score, 0) / scored.length) : 0;
    return {
      total: offers.length,
      recomendadas: counts["recomendada"] ?? 0,
      aprobadas: counts["aprobada"] ?? 0,
      postuladas: counts["postulada"] ?? 0,
      pendientes: (counts["pendiente_manual"] ?? 0) + (counts["pendiente_test"] ?? 0),
      errores: counts["error"] ?? 0,
      duplicadas: counts["duplicada"] ?? 0,
      rechazadas: counts["rechazada"] ?? 0,
      avgScore,
      bestPortal
    };
  },
  getApprovedOffers: () => get().offers.filter((o) => o.status === "aprobada"),
  loadFromStorage: async () => {
    try {
      const [profile, offers, settings, helpRequests] = await Promise.all([
        window.api.getProfile(),
        window.api.getOffers(),
        window.api.getSettings(),
        window.api.getHelpRequests()
      ]);
      const defaultFolder = await window.api.getDefaultWorkFolder();
      const experienceRange = parseExperienceYears(profile?.experience);
      const salaryRange = parseSalaryExpectation(profile?.salaryExpectation);
      const loadedProfile = {
        ...DEFAULT_PROFILE,
        ...profile ?? {},
        targetRoles: profile?.targetRoles?.length ? profile.targetRoles : parseTargetRoles(profile?.targetRole),
        targetSeniority: profile?.targetSeniority ?? DEFAULT_PROFILE.targetSeniority,
        experienceYearsMin: profile?.experienceYearsMin ?? experienceRange.min,
        experienceYearsMax: profile?.experienceYearsMax ?? experienceRange.max,
        salaryCurrency: profile?.salaryCurrency ?? salaryRange.currency ?? DEFAULT_PROFILE.salaryCurrency,
        salaryMin: profile?.salaryMin ?? salaryRange.min ?? DEFAULT_PROFILE.salaryMin,
        salaryMax: profile?.salaryMax ?? salaryRange.max,
        personalInfo: {
          ...DEFAULT_PROFILE.personalInfo,
          ...profile?.personalInfo ?? {}
        }
      };
      set({
        profile: loadedProfile,
        offers: offers ?? [],
        settings: { ...settings ?? DEFAULT_SETTINGS, workFolder: settings?.workFolder || defaultFolder },
        helpRequests: helpRequests ?? []
      });
    } catch (err) {
      console.error("Error loading from storage:", err);
    }
  },
  // Recarga ofertas desde disco SIN re-persistir (las escribió el MCP server)
  reloadOffers: async () => {
    try {
      const offers = await window.api.getOffers();
      set({ offers: offers ?? [] });
    } catch (err) {
      console.error("Error reloading offers:", err);
    }
  },
  reloadHelpRequests: async () => {
    try {
      const list = await window.api.getHelpRequests();
      set({ helpRequests: list ?? [] });
    } catch (err) {
      console.error("Error reloading help requests:", err);
    }
  },
  resolveHelpRequest: async (id2) => {
    await window.api.resolveHelpRequest(id2);
    set((s) => ({ helpRequests: s.helpRequests.map((h) => h.id === id2 ? { ...h, resolved: true } : h) }));
  }
}));
function v(name) {
  return `rgb(var(--c-${name}))`;
}
const col = {
  base: v("base"),
  surface: v("surface"),
  raised: v("raised"),
  dim: v("dim"),
  muted: v("muted"),
  border: v("border"),
  fgMuted: v("fg-muted"),
  fgDim: v("fg-dim"),
  fg: v("fg"),
  cream: v("cream"),
  red: v("red"),
  amber: v("amber"),
  green: v("green"),
  terracotta: v("terracotta"),
  amberDeep: v("amber-deep"),
  violet: v("violet")
};
function alpha(color, a) {
  return color.replace(/\)\s*$/, ` / ${a})`);
}
const statusCol = {
  detectada: { text: col.fgDim, bg: alpha(col.fgDim, 0.08), border: alpha(col.fgDim, 0.22) },
  recomendada: { text: col.cream, bg: alpha(col.cream, 0.1), border: alpha(col.cream, 0.28) },
  aprobada: { text: col.green, bg: alpha(col.green, 0.1), border: alpha(col.green, 0.3) },
  rechazada: { text: col.fgMuted, bg: alpha(col.fgMuted, 0.06), border: alpha(col.fgMuted, 0.18) },
  postulada: { text: col.violet, bg: alpha(col.violet, 0.1), border: alpha(col.violet, 0.28) },
  pendiente_manual: { text: col.amber, bg: alpha(col.amberDeep, 0.1), border: alpha(col.amberDeep, 0.3) },
  pendiente_test: { text: col.terracotta, bg: alpha(col.terracotta, 0.08), border: alpha(col.terracotta, 0.26) },
  error: { text: col.red, bg: alpha(col.red, 0.1), border: alpha(col.red, 0.3) },
  duplicada: { text: col.muted, bg: alpha(col.muted, 0.06), border: alpha(col.muted, 0.18) }
};
const scoreCol = {
  high: col.green,
  mid: col.cream,
  low: col.red
};
function scoreColor(score) {
  if (score >= 70) return scoreCol.high;
  if (score >= 45) return scoreCol.mid;
  return scoreCol.low;
}
const NAV = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "profile", label: "Perfil", icon: User },
  { view: "offers", label: "Ofertas", icon: Briefcase },
  { view: "tracker", label: "Tracker", icon: ClipboardList },
  { view: "bridge", label: "Conexión Cowork", icon: Plug },
  { view: "instructions", label: "Instrucciones", icon: BookOpen },
  { view: "settings", label: "Settings", icon: Settings }
];
function Sidebar() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);
  const metrics = useStore((s) => s.getDashboardMetrics());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      className: "flex flex-col flex-shrink-0",
      style: {
        width: 220,
        background: col.surface,
        borderRight: `1px solid ${alpha(col.border, 0.22)}`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2.5 px-4 py-3",
            style: { borderBottom: `1px solid ${alpha(col.border, 0.2)}` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  width: "28",
                  height: "28",
                  viewBox: "0 0 28 28",
                  fill: "none",
                  stroke: col.cream,
                  strokeWidth: "1.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "motif-sway flex-shrink-0",
                  "aria-hidden": true,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "14", r: "11" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "14", r: "2.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "14", y1: "3", x2: "14", y2: "8" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "14", y1: "20", x2: "14", y2: "25" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "14", x2: "8", y2: "14" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "20", y1: "14", x2: "25", y2: "14" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "14,6 15.2,9 14,8.5 12.8,9", fill: col.cream, stroke: "none" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold tracking-wide", style: { color: col.cream, fontSize: "0.8125rem" }, children: "JobPilot" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xs", style: { color: col.fgMuted }, children: "búsqueda laboral" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5", children: NAV.map(({ view, label, icon: Icon2 }) => {
          const active = activeView === view;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveView(view),
              className: "nav-item",
              style: active ? { background: alpha(col.cream, 0.09), color: col.cream, boxShadow: `inset 3px 0 0 ${alpha(col.cream, 0.75)}` } : void 0,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 14, strokeWidth: active ? 2.2 : 1.75 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-left", children: label }),
                view === "offers" && metrics.recomendadas > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "badge text-2xs",
                    style: {
                      background: alpha(col.cream, 0.15),
                      color: col.cream,
                      borderColor: alpha(col.cream, 0.3),
                      padding: "0 5px",
                      minWidth: 18,
                      justifyContent: "center"
                    },
                    children: metrics.recomendadas > 9 ? "9+" : metrics.recomendadas
                  }
                )
              ]
            },
            view
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-3 py-3 flex flex-col gap-1",
            style: { borderTop: `1px solid ${alpha(col.border, 0.18)}` },
            children: [
              { label: "Postuladas", value: metrics.postuladas, color: col.violet },
              { label: "Pendientes", value: metrics.pendientes, color: col.amber },
              { label: "Score prom.", value: metrics.avgScore > 0 ? metrics.avgScore : "—", color: col.cream }
            ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-1 rounded-full flex-shrink-0", style: { background: color, opacity: 0.7 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xs flex-1", style: { color: col.fgMuted }, children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xs font-semibold tabular-nums", style: { color }, children: value })
            ] }, label))
          }
        )
      ]
    }
  );
}
const LABELS = {
  detectada: "detectada",
  recomendada: "recomendada",
  aprobada: "aprobada",
  rechazada: "rechazada",
  postulada: "postulada",
  pendiente_manual: "pend. manual",
  pendiente_test: "pend. test",
  error: "error",
  duplicada: "duplicada"
};
function StatusBadge({ status }) {
  const c = statusCol[status] ?? statusCol.detectada;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "badge",
      style: { color: c.text, background: c.bg, borderColor: c.border },
      children: LABELS[status]
    }
  );
}
function ScoreBar({ score, showLabel = true, size = "md" }) {
  const h = size === "sm" ? 3 : 4;
  const c = scoreColor(score);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 rounded-full overflow-hidden",
        style: { height: h, background: alpha(col.border, 0.25), minWidth: size === "sm" ? 56 : 80 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full transition-all",
            style: { width: `${score}%`, background: c, opacity: 0.85 }
          }
        )
      }
    ),
    showLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xs font-bold w-6 text-right tabular-nums", style: { color: c }, children: score })
  ] });
}
function pct$1(value, total) {
  return total > 0 ? Math.round(value / total * 100) : 0;
}
function formatDate(value) {
  if (!value) return "Sin datos";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "Sin datos";
  return new Date(value).toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}
function sortByDateDesc(a, b) {
  return new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime();
}
function MetricCard({ label, value, icon: Icon2, accent, sub }) {
  const c = accent ?? col.fgDim;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex items-start justify-between gap-2 reveal-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold mt-0.5 tabular-nums", style: { color: c }, children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xs mt-0.5 truncate", style: { color: col.fgMuted }, children: sub })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md",
        style: { background: alpha(c, 0.1) },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 15, style: { color: c }, strokeWidth: 1.75 })
      }
    )
  ] });
}
function SmallStat({ label, value, accent = col.fg, sub }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-md border px-3 py-2 min-w-0",
      style: { borderColor: alpha(col.border, 0.18), background: alpha(col.raised, 0.22) },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", style: { marginBottom: 2 }, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold tabular-nums truncate", style: { color: accent }, children: value }),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xs truncate mt-0.5", style: { color: col.fgMuted }, children: sub })
      ]
    }
  );
}
function SectionTitle({ children, icon: Icon2 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
    Icon2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 12, style: { color: col.fgMuted } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0 }, children })
  ] });
}
function PipelineBar({ metrics }) {
  const stages = [
    { label: "Total", count: metrics.total, color: col.fgDim },
    { label: "Recomendadas", count: metrics.recomendadas, color: col.cream },
    { label: "Aprobadas", count: metrics.aprobadas, color: col.green },
    { label: "Postuladas", count: metrics.postuladas, color: col.violet }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pipeline-bar reveal-up", children: stages.map((stage, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pipeline-stage", children: [
    i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ArrowRight,
      {
        size: 11,
        className: "absolute",
        style: { left: -7, top: "50%", transform: "translateY(-50%)", color: col.dim, zIndex: 1 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pipeline-num", style: { color: stage.color }, children: stage.count }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", style: { marginBottom: 0 }, children: stage.label })
  ] }, stage.label)) });
}
function WorkQueue({ approved, pendingManual, pendingTest, errors }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Target, children: "Cola operativa" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Listas para postular", value: approved, accent: col.green }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Pendiente manual", value: pendingManual, accent: col.amber }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Pendiente test", value: pendingTest, accent: col.terracotta }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Con error", value: errors, accent: col.red })
    ] })
  ] });
}
function QualityPanel({ total, high, mid, low, avgScore }) {
  const parts = [
    { label: "Alta", count: high, color: col.green },
    { label: "Media", count: mid, color: col.cream },
    { label: "Baja", count: low, color: col.red }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: TrendingUp, children: "Calidad del pipeline" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Score promedio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold tabular-nums", style: { color: avgScore > 0 ? scoreColor(avgScore) : col.fgMuted }, children: avgScore > 0 ? avgScore : "-" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Ofertas con score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold tabular-nums", style: { color: col.fg }, children: total })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-hidden rounded-full", style: { height: 6, background: alpha(col.border, 0.22) }, children: parts.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${pct$1(p2.count, total)}%`, background: p2.color } }, p2.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: parts.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: p2.label, value: p2.count, accent: p2.color, sub: `${pct$1(p2.count, total)}%` }, p2.label)) })
  ] });
}
function StatusDistribution({ counts, total }) {
  const rows = [
    { status: "detectada", label: "Detectadas" },
    { status: "recomendada", label: "Recomendadas" },
    { status: "aprobada", label: "Aprobadas" },
    { status: "postulada", label: "Postuladas" },
    { status: "rechazada", label: "Rechazadas" },
    { status: "duplicada", label: "Duplicadas" },
    { status: "pendiente_manual", label: "Pend. manual" },
    { status: "pendiente_test", label: "Pend. test" },
    { status: "error", label: "Errores" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Database, children: "Distribucion por estado" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: rows.map(({ status, label }) => {
      const count = counts[status] ?? 0;
      const c = statusCol[status] ?? statusCol.detectada;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[92px_1fr_38px] items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xs truncate", style: { color: c.text }, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full overflow-hidden", style: { height: 5, background: alpha(col.border, 0.18) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${pct$1(count, total)}%`, height: "100%", background: c.text, opacity: 0.85 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xs font-bold text-right tabular-nums", style: { color: col.fg }, children: count })
      ] }, status);
    }) })
  ] });
}
function PortalPanel({ offers }) {
  const rows = Object.entries(
    offers.reduce((acc, offer) => {
      const key = offer.portal || "Sin portal";
      const item = acc[key] ?? { total: 0, applied: 0, avg: 0, scoreSum: 0 };
      item.total += 1;
      item.scoreSum += offer.score || 0;
      if (offer.status === "postulada") item.applied += 1;
      item.avg = Math.round(item.scoreSum / item.total);
      acc[key] = item;
      return acc;
    }, {})
  ).sort((a, b) => b[1].total - a[1].total).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Earth, children: "Portales" }),
    rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: "Sin ofertas cargadas." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2.5", children: rows.map(([portal, data]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between gap-3 rounded-md px-2.5 py-2",
        style: { background: alpha(col.raised, 0.34), border: `1px solid ${alpha(col.border, 0.14)}` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs truncate font-semibold", style: { color: col.fg }, children: portal }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xs mt-0.5", style: { color: col.fgMuted }, children: data.applied > 0 ? `${data.applied} postuladas` : "Sin postulaciones" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricPill, { label: "total", value: data.total, color: col.fgMuted }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricPill, { label: "post.", value: data.applied, color: col.violet }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricPill, { label: "score", value: data.avg, color: scoreColor(data.avg), strong: true })
          ] })
        ]
      },
      portal
    )) })
  ] });
}
function MetricPill({ label, value, color, strong = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-9 min-w-[46px] rounded-md px-2 flex flex-col items-center justify-center",
      style: { background: alpha(color, strong ? 0.12 : 0.07), border: `1px solid ${alpha(color, strong ? 0.28 : 0.16)}` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs leading-none tabular-nums font-bold", style: { color }, children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] leading-none mt-1 uppercase", style: { color: alpha(color, 0.82), letterSpacing: 0 }, children: label })
      ]
    }
  );
}
function OfferList({ title, offers, empty, icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon, children: title }),
    offers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: empty }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 mt-3", children: offers.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto_auto] items-center gap-2.5 py-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs truncate font-medium", style: { color: col.fg }, children: o.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xs truncate", style: { color: col.fgMuted }, children: [
          o.company,
          " - ",
          o.portal,
          " - ",
          formatDate(o.appliedAt ?? o.detectedAt)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { score: o.score, size: "sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: o.status })
    ] }, o.id)) })
  ] });
}
function Dashboard() {
  const metrics = useStore((s) => s.getDashboardMetrics());
  const offers = useStore((s) => s.offers);
  const profile = useStore((s) => s.profile);
  const settings = useStore((s) => s.settings);
  const helpRequests = useStore((s) => s.helpRequests);
  const setActiveView = useStore((s) => s.setActiveView);
  const counts = offers.reduce((acc, offer) => {
    acc[offer.status] = (acc[offer.status] ?? 0) + 1;
    return acc;
  }, {});
  const pendingManual = counts.pendiente_manual ?? 0;
  const pendingTest = counts.pendiente_test ?? 0;
  const scored = offers.filter((o) => o.score > 0);
  const highScore = scored.filter((o) => o.score >= 70).length;
  const midScore = scored.filter((o) => o.score >= 45 && o.score < 70).length;
  const lowScore = scored.filter((o) => o.score > 0 && o.score < 45).length;
  const appliedPortal = Object.entries(
    offers.filter((o) => o.status === "postulada").reduce((acc, o) => ({ ...acc, [o.portal]: (acc[o.portal] ?? 0) + 1 }), {})
  ).sort((a, b) => b[1] - a[1])[0];
  const latestOffer = [...offers].sort((a, b) => sortByDateDesc(a.detectedAt, b.detectedAt))[0];
  const latestApplied = [...offers].filter((o) => o.appliedAt).sort((a, b) => sortByDateDesc(a.appliedAt, b.appliedAt))[0];
  const pendingHelp = helpRequests.filter((h) => !h.resolved).length;
  const recent = [...offers].sort((a, b) => sortByDateDesc(a.detectedAt, b.detectedAt)).slice(0, 6);
  const bestMatches = [...offers].filter((o) => !["rechazada", "duplicada", "error"].includes(o.status)).sort((a, b) => b.score - a.score).slice(0, 5);
  const personalInfoCount = Object.values(profile.personalInfo ?? {}).filter(Boolean).length;
  const profileItems = [
    { label: "CV", ok: !!profile.cvPath },
    { label: "Texto CV", ok: !!profile.cvText },
    { label: "Stack", ok: profile.mainStack.length > 0 },
    { label: "Portales", ok: settings.portals.length > 0 },
    { label: "Filtros", ok: profile.avoid.length > 0 },
    { label: "Datos personales", ok: personalInfoCount > 0 }
  ];
  const readyItems = profileItems.filter((item) => item.ok).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", style: { marginBottom: "0.2rem" }, children: "Resumen" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "page-title", style: { color: col.fg }, children: "Dashboard" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        metrics.aprobadas > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary reveal-up", onClick: () => setActiveView("bridge"), children: [
          "Postular ",
          metrics.aprobadas,
          " aprobadas"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary reveal-up", onClick: () => setActiveView("offers"), children: "Revisar ofertas" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineBar, { metrics }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 xl:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          label: "Pendientes",
          value: metrics.pendientes,
          icon: Clock,
          accent: col.amber,
          sub: `${pendingManual} manual / ${pendingTest} test`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Errores", value: metrics.errores, icon: CircleAlert, accent: col.red }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          label: "Score promedio",
          value: metrics.avgScore > 0 ? `${Math.round(metrics.avgScore)}` : "-",
          icon: TrendingUp,
          accent: metrics.avgScore > 0 ? scoreColor(metrics.avgScore) : col.fgMuted,
          sub: `${highScore} altas / ${midScore} medias / ${lowScore} bajas`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          label: "Portal con mas postuladas",
          value: appliedPortal ? appliedPortal[0] : "-",
          icon: Earth,
          accent: appliedPortal ? col.violet : col.fgMuted,
          sub: appliedPortal ? `${appliedPortal[1]} postulaciones` : "Sin postulaciones"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr_0.9fr] gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: Briefcase, children: "Lectura rapida" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Tasa postulacion", value: `${pct$1(metrics.postuladas, metrics.total)}%`, accent: col.violet }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Aprobadas vivas", value: metrics.aprobadas, accent: col.green }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Rechazadas", value: metrics.rechazadas, accent: col.fgMuted }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Duplicadas", value: metrics.duplicadas, accent: col.muted })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Ultima detectada", value: formatDate(latestOffer?.detectedAt), sub: latestOffer?.company ?? "Sin ofertas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Ultima postulada", value: formatDate(latestApplied?.appliedAt), sub: latestApplied?.company ?? "Sin postulaciones" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Ayudas abiertas", value: pendingHelp, accent: pendingHelp ? col.amber : col.green })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        WorkQueue,
        {
          approved: metrics.aprobadas,
          pendingManual,
          pendingTest,
          errors: metrics.errores
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: UserCheck, children: "Perfil operativo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Completitud", value: `${readyItems}/${profileItems.length}`, accent: readyItems === profileItems.length ? col.green : col.amber }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Portales", value: settings.portals.length, accent: col.cream }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Stack", value: profile.mainStack.length, accent: col.cream }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SmallStat, { label: "Filtros", value: profile.avoid.length, accent: col.red })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: profileItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "badge",
            style: {
              color: item.ok ? col.green : col.fgMuted,
              borderColor: item.ok ? alpha(col.green, 0.28) : alpha(col.border, 0.22),
              background: item.ok ? alpha(col.green, 0.08) : alpha(col.border, 0.06)
            },
            children: [
              item.ok ? "ok" : "falta",
              " ",
              item.label
            ]
          },
          item.label
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        QualityPanel,
        {
          total: scored.length,
          high: highScore,
          mid: midScore,
          low: lowScore,
          avgScore: metrics.avgScore
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDistribution, { counts, total: metrics.total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PortalPanel, { offers })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        OfferList,
        {
          title: "Mejores matches activos",
          icon: ShieldCheck,
          offers: bestMatches,
          empty: "No hay matches activos todavia."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        OfferList,
        {
          title: "Ultimas detectadas",
          icon: FileText,
          offers: recent,
          empty: "No hay ofertas aun. Usa Cowork Bridge para buscar."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary", onClick: () => setActiveView("offers"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
        " Revisar y aprobar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-secondary", onClick: () => setActiveView("bridge"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 13 }),
        " Ir a Cowork"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-secondary", onClick: () => setActiveView("tracker"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 13 }),
        " Ver tracker"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-secondary", onClick: () => setActiveView("profile"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 13 }),
        " Ajustar filtros"
      ] })
    ] })
  ] });
}
function CvDropZone({ value, hasText, onChange }) {
  const [dragging, setDragging] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const inputRef = reactExports.useRef(null);
  const applyFile = reactExports.useCallback(async (file) => {
    if (!file.name.endsWith(".pdf")) return;
    const filePath = file.path;
    setLoading(true);
    setError(null);
    const res = await window.api.readPdfFromPath(filePath || file.name);
    setLoading(false);
    const path = filePath || file.name;
    if (!res.success) setError(res.error ?? "No se pudo extraer texto del PDF");
    onChange(path, res.success ? res.text : void 0);
  }, [onChange]);
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await applyFile(file);
  };
  const filename = value ? value.split(/[/\\]/).pop() : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onDragOver: (e) => {
          e.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: handleDrop,
        onClick: () => inputRef.current?.click(),
        className: "rounded-lg border-2 border-dashed flex items-center gap-3 px-4 py-4 cursor-pointer transition-all",
        style: {
          borderColor: dragging ? col.cream : alpha(col.border, 0.35),
          background: dragging ? alpha(col.cream, 0.04) : alpha(col.surface, 0.5)
        },
        children: [
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin flex-shrink-0", style: { color: col.fgMuted } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16, className: "flex-shrink-0", style: { color: filename ? col.green : col.fgMuted } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            filename ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium truncate", style: { color: col.fg }, children: filename }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: col.fgMuted }, children: "Arrastrá tu CV acá o hacé click para seleccionarlo" }),
            value && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs truncate mt-0.5", style: { color: col.dim }, children: value }),
            value && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs mt-0.5", style: { color: hasText ? col.green : col.amber }, children: hasText ? "✓ Texto extraído (Cowork lo usa para la carta)" : `⚠ ${error ?? "Sin texto extraído — volvé a cargarlo"}` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 13, className: "flex-shrink-0", style: { color: col.fgMuted } })
        ]
      }
    ),
    value && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "btn-mini",
        style: { alignSelf: "flex-start" },
        onClick: (e) => {
          e.stopPropagation();
          onChange(void 0, void 0);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 }),
          " Quitar CV"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: ".pdf",
        className: "hidden",
        onChange: async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          await applyFile(file);
          e.target.value = "";
        }
      }
    )
  ] });
}
const TAG_STYLES = {
  primary: { color: col.cream, borderColor: alpha(col.cream, 0.3), background: alpha(col.cream, 0.08) },
  secondary: { color: col.fgDim, borderColor: alpha(col.fgDim, 0.22), background: alpha(col.fgDim, 0.06) },
  preference: { color: col.amber, borderColor: alpha(col.amber, 0.3), background: alpha(col.amber, 0.07) },
  exclude: { color: col.red, borderColor: alpha(col.red, 0.28), background: alpha(col.red, 0.06) }
};
function TagInput({
  label,
  values,
  onChange,
  variant = "primary",
  placeholder
}) {
  const [input, setInput] = reactExports.useState("");
  const tagStyle = TAG_STYLES[variant];
  const add = () => {
    const parts = input.split(/[,;\n/]+/).map((p2) => p2.trim()).filter(Boolean);
    if (parts.length === 0) {
      setInput("");
      return;
    }
    const next = [...values];
    for (const p2 of parts) if (!next.includes(p2)) next.push(p2);
    if (next.length !== values.length) onChange(next);
    setInput("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 min-w-0", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-wrap gap-1.5 overflow-hidden",
        style: { minHeight: "1.75rem" },
        children: [
          values.map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tag", style: tagStyle, children: [
            v2,
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => onChange(values.filter((x2) => x2 !== v2)),
                className: "opacity-50 hover:opacity-100 transition-opacity",
                style: { color: "currentColor", lineHeight: 0 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 9 })
              }
            )
          ] }, v2)),
          values.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xs self-center", style: { color: col.dim, fontStyle: "italic" }, children: "Sin entradas" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), add()),
          onBlur: add,
          placeholder: placeholder ?? "Escribí y Enter (o separá con comas)"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: add,
          className: "btn-secondary flex-shrink-0",
          style: { minWidth: 32, padding: "0 0.5rem" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 })
        }
      )
    ] })
  ] });
}
function FieldHint({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs mt-1 leading-relaxed", style: { color: col.fgMuted }, children });
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function pct(value, min, max) {
  if (max === min) return 0;
  return (value - min) / (max - min) * 100;
}
function snapToStep(value, min, step) {
  const snapped = Math.round((value - min) / step) * step + min;
  return Number(snapped.toFixed(4));
}
function salaryScale(currency, salaryMin, salaryMax) {
  const normalized = (currency ?? "USD").trim().toUpperCase();
  const baseMax = normalized === "ARS" ? 5e6 : 1e4;
  const step = normalized === "ARS" ? 5e4 : 100;
  const highest = Math.max(salaryMin ?? 0, salaryMax ?? 0, baseMax);
  return { max: Math.ceil(highest / step) * step, step };
}
function formatYears(value) {
  return Number.isInteger(value) ? `${value} años` : `${value.toFixed(1)} años`;
}
function formatMoney(currency, value) {
  return `${currency || "USD"} ${value.toLocaleString("es-AR")}`;
}
function RangeBar({
  label,
  minBound,
  maxBound,
  step,
  minValue,
  maxValue,
  openMinLabel,
  openMaxLabel,
  formatValue,
  clearMinAtBound = false,
  clearMaxAtBound = true,
  onMinChange,
  onMaxChange
}) {
  const shellRef = reactExports.useRef(null);
  const [dragging, setDragging] = reactExports.useState(null);
  const rawMin = typeof minValue === "number" ? minValue : minBound;
  const rawMax = typeof maxValue === "number" ? maxValue : maxBound;
  const currentMin = clamp(Math.min(rawMin, rawMax), minBound, maxBound);
  const currentMax = clamp(Math.max(rawMin, rawMax), minBound, maxBound);
  const start = pct(currentMin, minBound, maxBound);
  const end = pct(currentMax, minBound, maxBound);
  const style = {
    "--range-start": `${start}%`,
    "--range-end": `${end}%`
  };
  const valueFromClientX = (clientX) => {
    const rect = shellRef.current?.getBoundingClientRect();
    if (!rect) return minBound;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return clamp(snapToStep(minBound + ratio * (maxBound - minBound), minBound, step), minBound, maxBound);
  };
  const updateMin = (value) => {
    const next = clamp(Math.min(value, currentMax), minBound, maxBound);
    onMinChange(clearMinAtBound && next === minBound ? void 0 : next);
  };
  const updateMax = (value) => {
    const next = clamp(Math.max(value, currentMin), minBound, maxBound);
    onMaxChange(clearMaxAtBound && next === maxBound ? void 0 : next);
  };
  const updateHandle = (handle, value) => {
    if (handle === "min") updateMin(value);
    else updateMax(value);
  };
  const handleShellPointerDown = (clientX) => {
    const next = valueFromClientX(clientX);
    const handle = Math.abs(next - currentMin) <= Math.abs(next - currentMax) ? "min" : "max";
    updateHandle(handle, next);
  };
  const handleKeyDown = (handle, key) => {
    const current = handle === "min" ? currentMin : currentMax;
    if (key === "ArrowLeft" || key === "ArrowDown") updateHandle(handle, current - step);
    if (key === "ArrowRight" || key === "ArrowUp") updateHandle(handle, current + step);
    if (key === "Home") updateHandle(handle, minBound);
    if (key === "End") updateHandle(handle, maxBound);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "range-field", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", style: { marginBottom: 0 }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "range-values", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: typeof minValue === "number" ? formatValue(currentMin) : openMinLabel ?? formatValue(currentMin) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "range-separator", children: "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: typeof maxValue === "number" ? formatValue(currentMax) : openMaxLabel ?? formatValue(currentMax) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: shellRef,
        className: "range-shell",
        style,
        onPointerDown: (e) => {
          if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("range-handle")) {
            handleShellPointerDown(e.clientX);
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "range-track" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: `range-handle ${dragging === "min" ? "dragging" : ""}`,
              style: { left: `${start}%` },
              "aria-label": `${label} minimo`,
              onKeyDown: (e) => handleKeyDown("min", e.key),
              onPointerDown: (e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging("min");
              },
              onPointerMove: (e) => {
                if (dragging === "min") updateMin(valueFromClientX(e.clientX));
              },
              onPointerUp: () => setDragging(null),
              onPointerCancel: () => setDragging(null)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: `range-handle ${dragging === "max" ? "dragging" : ""}`,
              style: { left: `${end}%` },
              "aria-label": `${label} maximo`,
              onKeyDown: (e) => handleKeyDown("max", e.key),
              onPointerDown: (e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging("max");
              },
              onPointerMove: (e) => {
                if (dragging === "max") updateMax(valueFromClientX(e.clientX));
              },
              onPointerUp: () => setDragging(null),
              onPointerCancel: () => setDragging(null)
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "range-scale", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatValue(minBound) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatValue(maxBound) })
    ] })
  ] });
}
function Profile() {
  const profile = useStore((s) => s.profile);
  const settings = useStore((s) => s.settings);
  const setProfile = useStore((s) => s.setProfile);
  const setSettings = useStore((s) => s.setSettings);
  const showNotification = useStore((s) => s.showNotification);
  const [form, setForm] = reactExports.useState({ ...profile });
  const [portals, setPortals] = reactExports.useState(settings.portals ?? []);
  reactExports.useEffect(() => {
    setForm({ ...profile });
  }, [profile]);
  reactExports.useEffect(() => {
    setPortals(settings.portals ?? []);
  }, [settings.portals]);
  const set = (key, value) => setForm((f2) => ({ ...f2, [key]: value }));
  const setTargetRoles = (roles) => setForm((f2) => ({ ...f2, targetRoles: roles, targetRole: roles.join(", ") }));
  const currentSalaryScale = salaryScale(form.salaryCurrency, form.salaryMin, form.salaryMax);
  const setPersonalInfo = (key, value) => setForm((f2) => ({
    ...f2,
    personalInfo: {
      ...f2.personalInfo ?? { dni: "", email: "", phone: "", address: "" },
      [key]: value
    }
  }));
  const save = async () => {
    let next = {
      ...form,
      targetRole: (form.targetRoles ?? []).join(", "),
      experience: formatExperienceYearsRange(form),
      salaryExpectation: formatSalaryRange(form)
    };
    if (next.cvPath && !next.cvText) {
      const res = await window.api.readPdfFromPath(next.cvPath);
      if (res.success && res.text) {
        next = { ...next, cvText: res.text };
        setForm(next);
      } else {
        showNotification("error", res.error ?? "No se pudo extraer texto del CV");
      }
    }
    await setProfile({ ...next, secondaryStack: [], updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    await setSettings({ ...settings, portals });
    showNotification("success", "Perfil guardado");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", style: { marginBottom: "0.2rem" }, children: "Configuración" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "page-title", style: { color: col.fg }, children: "Perfil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs mt-0.5", style: { color: col.fgMuted }, children: "Define qué busca Cowork, qué guarda para revisar y qué descarta." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary flex-shrink-0", onClick: save, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 13 }),
        " Guardar cambios"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0 }, children: "Identidad" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TagInput,
            {
              label: "Roles objetivo",
              values: form.targetRoles ?? [],
              onChange: setTargetRoles,
              variant: "primary",
              placeholder: "Frontend Developer, React Developer, Angular Developer..."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldHint, { children: "Títulos de puesto que Cowork usa como búsquedas base. El stack y el seniority generan variantes encima de estos roles." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TagInput,
            {
              label: "Seniority buscado",
              values: form.targetSeniority ?? [],
              onChange: (v2) => set("targetSeniority", v2),
              variant: "preference",
              placeholder: "Junior, Semi Senior, SSR..."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldHint, { children: "Se combina con el rol para probar variantes como SSR, Semi Senior, Mid-level o Junior." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RangeBar,
              {
                label: "Años de experiencia",
                minBound: 0,
                maxBound: 12,
                step: 0.5,
                minValue: form.experienceYearsMin,
                maxValue: form.experienceYearsMax,
                openMinLabel: "Sin mínimo",
                openMaxLabel: "Sin máximo",
                formatValue: formatYears,
                clearMinAtBound: true,
                onMinChange: (value) => set("experienceYearsMin", value),
                onMaxChange: (value) => set("experienceYearsMax", value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldHint, { children: "Cowork lo usa como criterio explícito al evaluar ofertas que piden años obligatorios." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TagInput,
            {
              label: "Soft skills",
              values: form.softSkills ?? [],
              onChange: (v2) => set("softSkills", v2),
              variant: "secondary",
              placeholder: "Trabajo en equipo, comunicación, adaptabilidad…"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                RangeBar,
                {
                  label: "Pretensión salarial",
                  minBound: 0,
                  maxBound: currentSalaryScale.max,
                  step: currentSalaryScale.step,
                  minValue: form.salaryMin,
                  maxValue: form.salaryMax,
                  openMinLabel: "Sin mínimo",
                  openMaxLabel: "Sin máximo",
                  formatValue: (value) => formatMoney(form.salaryCurrency ?? "USD", value),
                  clearMinAtBound: true,
                  onMinChange: (value) => set("salaryMin", value),
                  onMaxChange: (value) => set("salaryMax", value)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 84 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Moneda" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "input",
                    value: form.salaryCurrency ?? "USD",
                    onChange: (e) => set("salaryCurrency", e.target.value.toUpperCase()),
                    placeholder: "USD"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldHint, { children: "Si dejás el máximo vacío, se interpreta como mínimo aceptado." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TagInput,
            {
              label: "Disponibilidad",
              values: form.availability ?? [],
              onChange: (v2) => set("availability", v2),
              variant: "preference",
              placeholder: "Full-time, Part-time…"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "card flex flex-col gap-4",
            style: { boxShadow: `inset 3px 0 0 ${alpha(col.amber, 0.45)}` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 12, style: { color: alpha(col.amber, 0.75) }, strokeWidth: 2 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0, color: alpha(col.amber, 0.8) }, children: "Datos personales" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted, marginTop: "-0.75rem" }, children: "Estos datos son sensibles. No es recomendable compartir DNI, telefono o direccion salvo que el portal lo pida de forma justificada." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "DNI" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "input",
                      value: form.personalInfo?.dni ?? "",
                      onChange: (e) => setPersonalInfo("dni", e.target.value),
                      placeholder: "Ej: 12.345.678"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "input",
                      value: form.personalInfo?.email ?? "",
                      onChange: (e) => setPersonalInfo("email", e.target.value),
                      placeholder: "tu@email.com"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Telefono" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "input",
                      value: form.personalInfo?.phone ?? "",
                      onChange: (e) => setPersonalInfo("phone", e.target.value),
                      placeholder: "+54 9 11..."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Direccion" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "input",
                      value: form.personalInfo?.address ?? "",
                      onChange: (e) => setPersonalInfo("address", e.target.value),
                      placeholder: "Ciudad o direccion completa"
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-4 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0 }, children: "Habilidades" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TagInput,
            {
              label: "Stack",
              values: form.mainStack,
              onChange: (v2) => set("mainStack", v2),
              variant: "primary",
              placeholder: "React, TypeScript, Angular, APIs REST…"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "card flex flex-col gap-4 min-w-0",
            style: { boxShadow: `inset 3px 0 0 ${alpha(col.amber, 0.55)}` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0, color: alpha(col.amber, 0.75) }, children: "Preferencias" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TagInput,
                {
                  label: "Modalidad",
                  values: form.preferredModality,
                  onChange: (v2) => set("preferredModality", v2),
                  variant: "preference",
                  placeholder: "Remoto, Híbrido, Presencial…"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "divider" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TagInput,
                {
                  label: "Ubicación",
                  values: form.preferredLocation,
                  onChange: (v2) => set("preferredLocation", v2),
                  variant: "preference",
                  placeholder: "CABA, AMBA, LATAM…"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "divider" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TagInput,
                {
                  label: "Portales de búsqueda",
                  values: portals,
                  onChange: setPortals,
                  variant: "preference",
                  placeholder: "LinkedIn, GetOnBoard, Indeed…"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "card flex flex-col gap-4 min-w-0",
            style: { boxShadow: `inset 3px 0 0 ${alpha(col.red, 0.5)}` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 12, style: { color: alpha(col.red, 0.7) }, strokeWidth: 2 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0, color: alpha(col.red, 0.72) }, children: "Filtros de exclusión" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted, marginTop: "-0.75rem" }, children: "Ofertas con estas palabras son penalizadas en el scoring." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TagInput,
                {
                  label: "",
                  values: form.avoid,
                  onChange: (v2) => set("avoid", v2),
                  variant: "exclude",
                  placeholder: "Soporte técnico, inglés excluyente…"
                }
              )
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 12, style: { color: col.fgMuted } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0 }, children: "Currículum" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: "Subí tu CV en PDF para que Cowork lo use como referencia al postular." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CvDropZone,
        {
          value: form.cvPath,
          hasText: !!form.cvText,
          onChange: (path, text) => setForm((f2) => ({ ...f2, cvPath: path, cvText: text }))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xs", style: { color: col.dim }, children: [
      "Última actualización: ",
      new Date(profile.updatedAt).toLocaleString("es-AR")
    ] })
  ] });
}
const STATUS_FILTERS = [
  { label: "Todas", value: "all" },
  { label: "Recomendadas", value: "recomendada" },
  { label: "Aprobadas", value: "aprobada" },
  { label: "Detectadas", value: "detectada" },
  { label: "Rechazadas", value: "rechazada" },
  { label: "Postuladas", value: "postulada" },
  { label: "Pendientes", value: "pendiente_manual" },
  { label: "Errores", value: "error" },
  { label: "Duplicadas", value: "duplicada" }
];
const STRIP_CLASS = {
  high: "row-strip-high",
  mid: "row-strip-mid",
  low: "row-strip-low"
};
function scoreClass(score) {
  if (score >= 65) return STRIP_CLASS.high;
  if (score >= 35) return STRIP_CLASS.mid;
  return STRIP_CLASS.low;
}
function OfferCard({ offer }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const approveOffer = useStore((s) => s.approveOffer);
  const rejectOffer = useStore((s) => s.rejectOffer);
  const markOfferApplied = useStore((s) => s.markOfferApplied);
  const updateOffer = useStore((s) => s.updateOffer);
  const canApprove = ["recomendada", "detectada"].includes(offer.status);
  const canReject = ["recomendada", "detectada", "aprobada", "pendiente_manual"].includes(offer.status);
  const canMarkApplied = !["postulada", "duplicada"].includes(offer.status);
  const canRestore = offer.status === "rechazada";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `card overflow-hidden ${scoreClass(offer.score)}`,
      style: { padding: 0 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 px-4 py-3 cursor-pointer",
            style: { transition: "background 0.12s" },
            onMouseEnter: (e) => e.currentTarget.style.background = alpha(col.raised, 0.7),
            onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
            onClick: () => setExpanded((v2) => !v2),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", style: { color: col.fg }, children: offer.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: offer.status })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xs mt-0.5", style: { color: col.fgMuted }, children: [
                  offer.company,
                  " · ",
                  offer.portal,
                  " · ",
                  new Date(offer.detectedAt).toLocaleDateString("es-AR"),
                  offer.modality && ` · ${offer.modality}`,
                  offer.location && ` · ${offer.location}`
                ] }),
                offer.salary && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xs mt-0.5 font-medium", style: { color: col.green }, children: offer.salary })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
                offer.link && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: offer.link,
                    target: "_blank",
                    rel: "noreferrer",
                    onClick: (e) => e.stopPropagation(),
                    className: "flex items-center gap-1 text-2xs",
                    style: { color: col.cream },
                    title: "Abrir oferta en el navegador",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { score: offer.score, size: "sm" }),
                expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 13, style: { color: col.fgMuted } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13, style: { color: col.fgMuted } })
              ] })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 pb-4 pt-3 flex flex-col gap-3 animate-fade-in",
            style: { borderTop: `1px solid ${alpha(col.border, 0.2)}` },
            children: [
              offer.scoreBreakdown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", style: { color: col.green }, children: "Positivos" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: offer.scoreBreakdown.positives.length > 0 ? offer.scoreBreakdown.positives.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tag", style: { color: col.green, borderColor: alpha(col.green, 0.3) }, children: p2 }, p2)) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col.fgMuted }, className: "text-2xs", children: "—" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", style: { color: col.red }, children: "Negativos" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: offer.scoreBreakdown.negatives.length > 0 ? offer.scoreBreakdown.negatives.map((n2) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tag", style: { color: col.red, borderColor: alpha(col.red, 0.3) }, children: n2 }, n2)) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col.fgMuted }, className: "text-2xs", children: "—" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Descripción" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap", style: { color: col.fgDim }, children: offer.description })
              ] }),
              offer.requirements && offer.requirements.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Requisitos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: offer.requirements.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tag", children: r2 }, r2)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Link de la oferta" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "input",
                      value: offer.link ?? "",
                      onChange: (e) => updateOffer(offer.id, { link: e.target.value }),
                      placeholder: "https://..."
                    }
                  ),
                  offer.link && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: offer.link,
                      target: "_blank",
                      rel: "noreferrer",
                      onClick: (e) => e.stopPropagation(),
                      className: "btn-secondary flex-shrink-0",
                      style: { minHeight: "auto", padding: "0 0.75rem" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 }),
                        " Abrir"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Notas" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    className: "input",
                    rows: 2,
                    value: offer.notes ?? "",
                    onChange: (e) => updateOffer(offer.id, { notes: e.target.value }),
                    placeholder: "Agrega notas sobre esta oferta..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap pt-1", children: [
                canApprove && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "btn-primary",
                    style: { minHeight: 28, padding: "0 0.75rem", fontSize: "var(--text-2xs)" },
                    onClick: () => approveOffer(offer.id),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }),
                      " Aprobar"
                    ]
                  }
                ),
                canReject && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "btn-danger",
                    style: { minHeight: 28, padding: "0 0.75rem", fontSize: "var(--text-2xs)" },
                    onClick: () => rejectOffer(offer.id),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
                      " Rechazar"
                    ]
                  }
                ),
                offer.status === "aprobada" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "btn-secondary",
                    style: { minHeight: 28, padding: "0 0.75rem", fontSize: "var(--text-2xs)" },
                    onClick: () => updateOffer(offer.id, { status: "recomendada" }),
                    children: "Desaprobar"
                  }
                ),
                canRestore && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "btn-secondary",
                    style: { minHeight: 28, padding: "0 0.75rem", fontSize: "var(--text-2xs)" },
                    onClick: () => updateOffer(offer.id, { status: "detectada" }),
                    children: "Restaurar a revisión"
                  }
                ),
                canMarkApplied && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "btn-secondary",
                    style: { minHeight: 28, padding: "0 0.75rem", fontSize: "var(--text-2xs)", color: col.violet, borderColor: alpha(col.violet, 0.4) },
                    onClick: () => markOfferApplied(offer.id),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 12 }),
                      " Marcar como postulada"
                    ]
                  }
                ),
                offer.status === "postulada" && offer.appliedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xs ml-auto", style: { color: col.violet }, children: [
                  "Postulada el ",
                  new Date(offer.appliedAt).toLocaleDateString("es-AR")
                ] }),
                offer.duplicateOf && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xs flex items-center gap-1 ml-auto", style: { color: col.fgMuted }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 11 }),
                  " Duplicada de ",
                  offer.duplicateOf
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function Offers() {
  const offers = useStore((s) => s.offers);
  const bulkApproveRecommended = useStore((s) => s.bulkApproveRecommended);
  const metrics = useStore((s) => s.getDashboardMetrics());
  const setActiveView = useStore((s) => s.setActiveView);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [sortBy, setSortBy] = reactExports.useState("score");
  const [showFilters, setShowFilters] = reactExports.useState(true);
  const filtered = offers.filter((o) => statusFilter === "all" || o.status === statusFilter).sort(
    (a, b) => sortBy === "score" ? b.score - a.score : new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-5 py-3 flex-shrink-0",
        style: { borderBottom: `1px solid ${alpha(col.border, 0.2)}` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", style: { marginBottom: "0.2rem" }, children: "Búsqueda activa" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "page-title", style: { color: col.fg }, children: "Ofertas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xs mt-0.5", style: { color: col.fgMuted }, children: [
              offers.length,
              " total · ",
              metrics.recomendadas,
              " recomendadas · ",
              metrics.aprobadas,
              " aprobadas"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            metrics.recomendadas > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary", onClick: bulkApproveRecommended, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }),
              "Aprobar recomendadas (",
              metrics.recomendadas,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", onClick: () => setActiveView("bridge"), children: "Importar" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-wrap flex-1", children: STATUS_FILTERS.map(({ label, value }) => {
        const active = statusFilter === value;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setStatusFilter(value),
            className: "btn-mini",
            style: active ? { background: alpha(col.cream, 0.12), color: col.cream, borderColor: alpha(col.cream, 0.3) } : void 0,
            children: label
          },
          value
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-shrink-0 ml-2", children: ["score", "date"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSortBy(s),
          className: "btn-mini",
          style: sortBy === s ? { color: col.cream, borderColor: alpha(col.cream, 0.3) } : void 0,
          children: s === "score" ? "Score" : "Fecha"
        },
        s
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: offers.length === 0 ? "No hay ofertas todavía. Usá Cowork Bridge para importar." : "No hay ofertas con ese filtro." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: filtered.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(OfferCard, { offer: o }, o.id)) }) })
  ] });
}
const TRACKED_STATUSES = ["aprobada", "postulada", "pendiente_manual", "pendiente_test", "error"];
function Tracker() {
  const offers = useStore((s) => s.offers);
  const updateOffer = useStore((s) => s.updateOffer);
  const [editId, setEditId] = reactExports.useState(null);
  const [editNotes, setEditNotes] = reactExports.useState("");
  const tracked = offers.filter((o) => TRACKED_STATUSES.includes(o.status) || o.appliedAt).sort((a, b) => {
    const ta2 = a.appliedAt ?? a.detectedAt;
    const tb2 = b.appliedAt ?? b.detectedAt;
    return new Date(tb2).getTime() - new Date(ta2).getTime();
  });
  const startEdit = (id2, notes) => {
    setEditId(id2);
    setEditNotes(notes);
  };
  const saveEdit = (id2) => {
    updateOffer(id2, { notes: editNotes });
    setEditId(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-between px-5 py-3 flex-shrink-0",
        style: { borderBottom: `1px solid ${alpha(col.border, 0.2)}` },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", style: { marginBottom: "0.2rem" }, children: "Seguimiento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "page-title", style: { color: col.fg }, children: "Tracker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xs mt-0.5", style: { color: col.fgMuted }, children: [
            tracked.length,
            " postulaciones en seguimiento"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-4", children: tracked.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: "No hay postulaciones en seguimiento todavía. Aprobá ofertas y postulate con Cowork Bridge." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-lg overflow-hidden",
        style: { border: `1px solid ${alpha(col.border, 0.2)}` },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "data-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["Oferta", "Empresa", "Portal", "Sc.", "Estado", "Fecha", "Resultado", "Notas"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: h }, h)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: tracked.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium max-w-[180px] truncate", style: { color: col.fg }, title: o.title, children: o.title }),
              o.link && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: o.link,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "opacity-30 hover:opacity-70 transition-opacity",
                  style: { color: col.fg },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 10 })
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap", children: o.company }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap", children: o.portal }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold tabular-nums text-2xs", style: { color: scoreColor(o.score) }, children: o.score }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: o.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap", children: o.appliedAt ? new Date(o.appliedAt).toLocaleDateString("es-AR") : new Date(o.detectedAt).toLocaleDateString("es-AR") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-[140px]", children: o.result ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", title: o.result, style: { color: col.fgDim }, children: o.result }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col.dim }, children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: editId === o.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "input",
                  style: { width: 112, minHeight: 24, padding: "2px 6px" },
                  value: editNotes,
                  onChange: (e) => setEditNotes(e.target.value),
                  autoFocus: true,
                  onKeyDown: (e) => e.key === "Enter" && saveEdit(o.id)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => saveEdit(o.id), className: "btn-mini", style: { color: col.green }, children: "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditId(null), className: "btn-mini", children: "✕" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => startEdit(o.id, o.notes ?? ""),
                className: "text-2xs max-w-[120px] truncate block transition-colors",
                style: { color: o.notes ? col.fgMuted : col.dim, background: "none", border: "none", cursor: "pointer" },
                title: o.notes || "Click para editar",
                children: o.notes || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontStyle: "italic" }, children: "Agregar nota" })
              }
            ) })
          ] }, o.id)) })
        ] }) })
      }
    ) })
  ] });
}
function ServerPanel() {
  const [mcpState, setMcpState] = reactExports.useState("stopped");
  const [tunState, setTunState] = reactExports.useState("stopped");
  const [url, setUrl] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const [mcpLogs, setMcpLogs] = reactExports.useState([]);
  const [tunLogs, setTunLogs] = reactExports.useState([]);
  const [showLog, setShowLog] = reactExports.useState(null);
  const pollFastUntil = reactExports.useRef(0);
  const mcpStartTimeout = reactExports.useRef(null);
  const tunStartTimeout = reactExports.useRef(null);
  const pushLog = (setter, line) => setter((prev) => [...prev.slice(-3), line]);
  reactExports.useEffect(() => {
    const mcpCb = (line) => pushLog(setMcpLogs, line);
    const tunCb = (line) => pushLog(setTunLogs, line);
    window.api.onMcpLog(mcpCb);
    window.api.onTunnelLog(tunCb);
    return () => {
      window.api.offMcpLog(mcpCb);
      window.api.offTunnelLog(tunCb);
    };
  }, []);
  reactExports.useEffect(() => {
    let active = true;
    const poll = async () => {
      if (!active) return;
      try {
        const s = await window.api.serverStatus();
        if (!active) return;
        setMcpState((prev) => {
          if (s.mcpRunning) {
            if (mcpStartTimeout.current) {
              clearTimeout(mcpStartTimeout.current);
              mcpStartTimeout.current = null;
            }
            return "running";
          }
          if (prev === "stopping") return "stopped";
          if (prev === "starting") return "starting";
          return "stopped";
        });
        setTunState((prev) => {
          if (s.tunnelRunning) {
            if (tunStartTimeout.current) {
              clearTimeout(tunStartTimeout.current);
              tunStartTimeout.current = null;
            }
            return "running";
          }
          if (prev === "stopping") return "stopped";
          if (prev === "starting") return "starting";
          return "stopped";
        });
        setUrl(s.tunnelUrl);
      } catch {
      }
    };
    poll();
    const tick = () => {
      const fast = Date.now() < pollFastUntil.current;
      return setTimeout(async () => {
        await poll();
        id2 = setTimeout(tick, fast ? 600 : 2e3);
      }, 0);
    };
    let id2 = setTimeout(tick, 600);
    return () => {
      active = false;
      clearTimeout(id2);
    };
  }, []);
  const startFastPoll = () => {
    pollFastUntil.current = Date.now() + 2e4;
  };
  const toggleMcp = async () => {
    if (mcpState === "running") {
      setMcpState("stopping");
      await window.api.serverMcpStop();
      setMcpState("stopped");
      setMcpLogs([]);
    } else if (mcpState === "stopped") {
      setMcpState("starting");
      setMcpLogs([]);
      startFastPoll();
      await window.api.serverMcpStart();
      mcpStartTimeout.current = setTimeout(() => setMcpState((s) => s === "starting" ? "stopped" : s), 2e4);
    }
  };
  const toggleTunnel = async () => {
    if (tunState === "running") {
      setTunState("stopping");
      await window.api.serverTunnelStop();
      setTunState("stopped");
      setTunLogs([]);
      setUrl(null);
    } else if (tunState === "stopped") {
      setTunState("starting");
      setTunLogs([]);
      startFastPoll();
      await window.api.serverTunnelStart();
      tunStartTimeout.current = setTimeout(() => setTunState((s) => s === "starting" ? "stopped" : s), 3e4);
    }
  };
  const copyUrl = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(`${url}/mcp`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const stateColor = (s) => s === "running" ? col.green : s === "starting" || s === "stopping" ? col.amber : alpha(col.fgMuted, 0.4);
  const stateLabel = (s, running) => s === "running" ? running : s === "starting" ? "Iniciando…" : s === "stopping" ? "Deteniendo…" : "Detenido";
  function Dot({ state }) {
    const c = stateColor(state);
    const pulse = state === "starting" || state === "stopping";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `inline-block rounded-full flex-shrink-0${pulse ? " animate-pulse" : ""}`,
        style: { width: 7, height: 7, background: c, boxShadow: state === "running" ? `0 0 5px ${c}` : "none" }
      }
    );
  }
  function ToggleBtn({ state, onToggle }) {
    const busy = state === "starting" || state === "stopping";
    const isOn = state === "running";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: onToggle,
        disabled: busy,
        className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs border transition-all flex-shrink-0",
        style: {
          background: isOn ? alpha(col.red, 0.08) : alpha(col.green, 0.08),
          borderColor: isOn ? alpha(col.red, 0.3) : alpha(col.green, 0.3),
          color: isOn ? col.red : col.green,
          opacity: busy ? 0.6 : 1,
          cursor: busy ? "not-allowed" : "pointer"
        },
        children: [
          busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 11, className: "animate-spin" }) : isOn ? /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { size: 11 }),
          isOn ? "Detener" : busy ? "…" : "Iniciar"
        ]
      }
    );
  }
  function LogArea({ lines, label }) {
    if (lines.length === 0) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-md p-2.5 flex flex-col gap-0.5",
        style: { background: alpha(col.base, 0.7), border: `1px solid ${alpha(col.border, 0.15)}` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs font-semibold mb-1", style: { color: col.fgMuted }, children: label }),
          lines.map((l2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs font-mono leading-snug truncate", style: { color: col.fgDim }, children: l2 }, i))
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg p-4 flex flex-col gap-3",
      style: { background: alpha(col.surface, 0.8), border: `1px solid ${alpha(col.border, 0.25)}` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold", style: { color: col.cream }, children: "Servidor MCP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, { state: mcpState }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xs flex-1", style: { color: col.fg }, children: "MCP HTTP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-2xs cursor-pointer select-none",
                style: { color: stateColor(mcpState) },
                onClick: () => setShowLog((v2) => v2 === "mcp" ? null : "mcp"),
                title: "Ver log",
                children: [
                  stateLabel(mcpState, "Corriendo :3005"),
                  mcpLogs.length > 0 && " ▾"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleBtn, { state: mcpState, onToggle: toggleMcp })
          ] }),
          showLog === "mcp" && /* @__PURE__ */ jsxRuntimeExports.jsx(LogArea, { lines: mcpLogs, label: "Últimas líneas MCP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, { state: tunState }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xs flex-1", style: { color: col.fg }, children: "Cloudflare Tunnel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-2xs truncate max-w-[180px] cursor-pointer select-none",
                style: { color: stateColor(tunState) },
                onClick: () => setShowLog((v2) => v2 === "tunnel" ? null : "tunnel"),
                title: "Ver log",
                children: [
                  tunState === "running" ? url ? url.replace("https://", "") : "conectando…" : stateLabel(tunState, ""),
                  tunLogs.length > 0 && " ▾"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleBtn, { state: tunState, onToggle: toggleTunnel })
          ] }),
          showLog === "tunnel" && /* @__PURE__ */ jsxRuntimeExports.jsx(LogArea, { lines: tunLogs, label: "Últimas líneas Tunnel" })
        ] }),
        url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 rounded-md px-3 py-2",
            style: { background: alpha(col.raised, 0.6), border: `1px solid ${alpha(col.border, 0.2)}` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xs flex-1 truncate font-mono", style: { color: col.fgDim }, children: [
                url,
                "/mcp"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: copyUrl,
                  className: "flex items-center gap-1 text-2xs px-2 py-0.5 rounded border transition-all flex-shrink-0",
                  style: {
                    background: copied ? alpha(col.green, 0.1) : "transparent",
                    borderColor: copied ? alpha(col.green, 0.3) : alpha(col.border, 0.3),
                    color: copied ? col.green : col.fgMuted
                  },
                  children: [
                    copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 10 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 10 }),
                    copied ? "Copiada" : "Copiar URL"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function PdfImporter({ onImport }) {
  const [dragging, setDragging] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [preview, setPreview] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const inputRef = reactExports.useRef(null);
  const processResult = reactExports.useCallback((res) => {
    if (res.success && res.text) {
      setPreview({ text: res.text, filename: res.filename ?? "archivo.pdf" });
      setError(null);
    } else {
      setError(res.error ?? "Error desconocido");
    }
  }, []);
  const handleDrop = reactExports.useCallback(async (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith(".pdf")) {
      setError("Solo se aceptan archivos PDF");
      return;
    }
    setLoading(true);
    setError(null);
    const filePath = file.path;
    const res = filePath ? await window.api.readPdfFromPath(filePath) : { success: false, error: "No se pudo obtener la ruta del archivo" };
    setLoading(false);
    processResult(res);
  }, [processResult]);
  const handlePickFile = async () => {
    setLoading(true);
    setError(null);
    const res = await window.api.selectPdf();
    setLoading(false);
    processResult(res);
  };
  const handleAdd = () => {
    if (!preview) return;
    onImport(preview.text, preview.filename);
    setPreview(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Importar oferta desde PDF" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onDragOver: (e) => {
          e.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: handleDrop,
        onClick: () => !preview && !loading && inputRef.current?.click(),
        className: "rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
        style: {
          minHeight: 90,
          borderColor: dragging ? col.cream : alpha(col.border, 0.35),
          background: dragging ? alpha(col.cream, 0.04) : alpha(col.surface, 0.5),
          padding: "1rem"
        },
        children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, className: "animate-spin", style: { color: col.fgMuted } }) : preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 w-full", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13, style: { color: col.green } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold truncate", style: { color: col.fg }, children: preview.filename }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xs ml-auto", style: { color: col.fgMuted }, children: [
              preview.text.length.toLocaleString(),
              " chars"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-2xs leading-relaxed rounded px-2 py-1.5 max-h-20 overflow-y-auto",
              style: { color: col.fgMuted, background: alpha(col.raised, 0.6) },
              children: [
                preview.text.slice(0, 300).trim(),
                "…"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary", style: { fontSize: "var(--text-2xs)", minHeight: 26, padding: "0 0.6rem" }, onClick: handleAdd, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 11 }),
              " Agregar como oferta"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { fontSize: "var(--text-2xs)", minHeight: 26, padding: "0 0.6rem" }, onClick: () => setPreview(null), children: "Cancelar" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 20, style: { color: col.fgMuted } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs text-center", style: { color: col.fgMuted }, children: "Arrastrá un PDF acá o hacé click para abrirlo" })
        ] })
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.red }, children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "btn-secondary",
        style: { alignSelf: "flex-start", fontSize: "var(--text-2xs)", minHeight: 26 },
        onClick: handlePickFile,
        disabled: loading,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 12 }),
          " Abrir PDF…"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: inputRef, type: "file", accept: ".pdf", className: "hidden", onChange: async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoading(true);
      const filePath = file.path;
      const res = filePath ? await window.api.readPdfFromPath(filePath) : { success: false, error: "No se pudo obtener la ruta" };
      setLoading(false);
      processResult(res);
      e.target.value = "";
    } })
  ] });
}
function PasteImporter({ onImport }) {
  const [open, setOpen] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [company, setCompany] = reactExports.useState("");
  const [link, setLink] = reactExports.useState("");
  const [text, setText] = reactExports.useState("");
  const canAdd = text.trim().length > 20;
  const handleAdd = () => {
    onImport(
      title.trim() || "Oferta pegada manualmente",
      company.trim() || "—",
      link.trim(),
      text.trim()
    );
    setTitle("");
    setCompany("");
    setLink("");
    setText("");
    setOpen(false);
  };
  if (!open) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "btn-secondary",
        style: { alignSelf: "flex-start", fontSize: "var(--text-2xs)", minHeight: 28 },
        onClick: () => setOpen(true),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
          " Pegar oferta manualmente"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-3 rounded-lg p-4",
      style: { background: alpha(col.surface, 0.7), border: `1px solid ${alpha(col.border, 0.28)}` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", style: { color: col.fg }, children: "Pegar oferta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), style: { color: col.fgMuted }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label", children: [
              "Título ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col.fgMuted }, children: "(opcional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", placeholder: "Frontend Developer", value: title, onChange: (e) => setTitle(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label", children: [
              "Empresa ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col.fgMuted }, children: "(opcional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", placeholder: "Empresa S.A.", value: company, onChange: (e) => setCompany(e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label", children: [
            "Link ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col.fgMuted }, children: "(opcional)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", placeholder: "https://...", value: link, onChange: (e) => setLink(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "label", children: [
            "Descripción de la oferta ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col.red }, children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: "input",
              rows: 6,
              placeholder: "Pegá acá el texto completo de la oferta — descripción, requisitos, modalidad, etc.",
              value: text,
              onChange: (e) => setText(e.target.value),
              style: { resize: "vertical", minHeight: 100 }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn-primary",
              disabled: !canAdd,
              onClick: handleAdd,
              style: { fontSize: "var(--text-2xs)", minHeight: 28, padding: "0 0.75rem" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 11 }),
                " Agregar oferta"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn-secondary",
              onClick: () => setOpen(false),
              style: { fontSize: "var(--text-2xs)", minHeight: 28, padding: "0 0.75rem" },
              children: "Cancelar"
            }
          )
        ] })
      ]
    }
  );
}
function StatCard({ label, value, color, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      disabled: !onClick,
      className: "flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-all",
      style: {
        background: alpha(col.surface, 0.7),
        border: `1px solid ${alpha(color, 0.25)}`,
        cursor: onClick ? "pointer" : "default"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", style: { color, fontSize: "1.1rem", lineHeight: 1 }, children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xs", style: { color: col.fgMuted }, children: label })
      ]
    }
  );
}
function CoworkBridge() {
  const offers = useStore((s) => s.offers);
  const importOffers = useStore((s) => s.importOffers);
  const showNotification = useStore((s) => s.showNotification);
  const setActiveView = useStore((s) => s.setActiveView);
  const detectadas = offers.filter((o) => o.status === "detectada").length;
  const recommended = offers.filter((o) => o.status === "recomendada");
  const approved = offers.filter((o) => o.status === "aprobada").length;
  const postuladas = offers.filter((o) => o.status === "postulada").length;
  const handlePdfImport = (text, filename) => {
    const titleLine = text.split("\n").map((l2) => l2.trim()).find((l2) => l2.length > 5 && l2.length < 120);
    importOffers([{
      title: titleLine ?? filename.replace(".pdf", ""),
      company: "—",
      portal: "PDF",
      link: "",
      description: text.slice(0, 8e3)
    }]);
    showNotification("success", `"${filename}" agregada como oferta`);
  };
  const handlePasteImport = (title, company, link, text) => {
    importOffers([{ title, company, portal: "Manual", link, description: text }]);
    showNotification("success", `"${title}" agregada como oferta`);
  };
  const handleBulkApprove = () => {
    const n2 = recommended.length;
    useStore.getState().bulkApproveRecommended();
    showNotification("success", `${n2} oferta(s) aprobada(s)`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold", style: { color: col.cream, fontSize: "0.9375rem" }, children: "Conexión Cowork" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs mt-0.5", style: { color: col.fgMuted }, children: "Levantá los servidores para que Cowork pueda leer y escribir en JobPilot vía MCP." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ServerPanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Ofertas en el tracker" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Detectadas", value: detectadas, color: col.fgDim, onClick: () => setActiveView("offers") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Recomendadas", value: recommended.length, color: col.green, onClick: () => setActiveView("offers") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Aprobadas", value: approved, color: col.cream, onClick: () => setActiveView("offers") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Postuladas", value: postuladas, color: col.violet, onClick: () => setActiveView("tracker") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn-primary",
            disabled: recommended.length === 0,
            onClick: handleBulkApprove,
            style: { opacity: recommended.length === 0 ? 0.4 : 1 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 13 }),
              " Aprobar ",
              recommended.length,
              " recomendadas"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-secondary", onClick: () => setActiveView("offers"), children: [
          "Revisar ofertas ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 13 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg px-4 py-3",
        style: { background: alpha(col.surface, 0.6), border: `1px solid ${alpha(col.border, 0.15)}` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Cómo se usa con Cowork" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex flex-col gap-1", children: [
            "Iniciá los servidores (arriba) y pegá la URL en el conector de Cowork.",
            "En Cowork, pegá el mensaje de búsqueda (lo tenés en Instrucciones).",
            "Cowork busca y guarda las ofertas acá automáticamente — aparecen como detectadas/recomendadas.",
            'Revisá en Ofertas y aprobá las que te interesan (o usá "Aprobar recomendadas").',
            "Pegá el mensaje de postulación en Cowork → postula solo a las aprobadas."
          ].map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5 text-2xs", style: { color: col.fgMuted }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", style: { color: col.cream }, children: [
              i + 1,
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: step })
          ] }, i)) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Cargar una oferta a mano" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: "Si encontraste una oferta por tu cuenta, importala acá y entra al mismo scoring." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PdfImporter, { onImport: handlePdfImport }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PasteImporter, { onImport: handlePasteImport })
    ] })
  ] });
}
const SYSTEM_PROMPT = `Sos un agente de búsqueda y postulación de empleo conectado a JobPilot via MCP.

Antes de ejecutar cualquier tarea siempre llamá a:
1. get_profile — para leer el perfil actualizado del usuario
2. get_instructions con el mode correspondiente — para obtener criterios, portales y plan de pasos

Nunca postules sin aprobación explícita del usuario en JobPilot.`;
const DEFAULT_SEARCH_MSG = `Buscá ofertas de trabajo compatibles con mi perfil.

Llamá a get_profile y luego get_instructions mode="busqueda" antes de empezar.`;
const DEFAULT_APP_MSG = `Postulate a todas las ofertas que aprobé en JobPilot.

Llamá a get_profile y luego get_instructions mode="postulacion" antes de empezar.`;
function listOrFallback(values, fallback) {
  return values?.length ? values.join(", ") : fallback;
}
const DEFAULT_AVOID = [
  "MLM",
  "Ventas a comisión pura sin sueldo base",
  "Inversión inicial",
  "Reviews negativos visibles",
  "Zona muy alejada no remota",
  "Inglés superior a B1",
  "Senior 5+ años",
  "Lead",
  "Staff",
  "Principal",
  "G&L GROUP"
];
const DEFAULT_TARGET_SENIORITY = ["Junior", "Semi Senior", "SSR"];
function buildDefaultSearchInstructions(portals, profile) {
  const portal = portals.length ? portals.join(", ") : "No definido";
  const targetRole = listOrFallback(profile.targetRoles, profile.targetRole || "No definido");
  const targetSeniority = listOrFallback(profile.targetSeniority, DEFAULT_TARGET_SENIORITY.join(", "));
  const skills = listOrFallback(profile.mainStack, "No definido");
  const softSkills = listOrFallback(profile.softSkills, "Trabajo en equipo, comunicación con clientes y equipos técnicos, adaptabilidad");
  const experienceYears = formatExperienceYearsRange(profile);
  const salaryExpectation = formatSalaryRange(profile);
  const modality = listOrFallback(profile.preferredModality, "híbrida (solo si es en Buenos Aires) / remota");
  const availability = listOrFallback(profile.availability, "full-time");
  const location = listOrFallback(profile.preferredLocation, "Buenos Aires, Argentina");
  const avoid = (profile.avoid ?? []).length ? profile.avoid : DEFAULT_AVOID;
  const avoidLines = avoid.map((item) => `- ${item}`).join("\n");
  return `## ROL Y OBJETIVO

Sos un agente de búsqueda de empleo. Tu tarea es ingresar a ${portal}, buscar
ofertas laborales compatibles con mi perfil, priorizarlas según criterios
específicos y enviar postulaciones en mi nombre. Actuá con precisión,
sin saltearte pasos, y reportá cada acción realizada.

## MI PERFIL

- **Roles objetivo**: ${targetRole}
- **Seniority buscado**: ${targetSeniority}
- **Años de experiencia buscados**: ${experienceYears}
- **Competencias clave**: ${skills}
- **Soft skills**: ${softSkills}
- **Pretensión salarial**: ${salaryExpectation}
- **Modalidad preferida**: ${modality}
- **Disponibilidad**: ${availability}
- **Zona de residencia**: ${location}

## CRITERIOS DE FILTRO

Priorizá ofertas que cumplan al menos 3 de:
- Empresa con buena reputación (4+ estrellas)
- Salario igual o mayor a mi pretensión (o "no publicado" si el rol matchea)
- Modalidad que coincida
- Ubicación dentro de mi zona o remoto
- Beneficios mencionados

DESCARTÁ ofertas que:
${avoidLines}

## PLAN DE TAREAS

Ejecutá en orden:

1. **Verificar acceso y sesión**: confirmá que la extensión Claude in Chrome
   está activa. Verificá login en ${portal}.

2. **Buscar ofertas**: ingresá búsquedas en paralelo (hasta 4 simultáneas)
   usando keywords del rol. Ejemplo si soy "Asesor Comercial":
   "Asesor Comercial", "Ejecutivo de Ventas", "Vendedor B2B", "Account Manager".
   Abrí varias búsquedas, pero navegá los resultados con ritmo humano: no abras muchas ofertas o páginas en ráfaga.

   Cobertura obligatoria:
   - Si Roles objetivo o portales figuran como "No definido", no inicies la búsqueda. Pedí al usuario que complete Perfil/Portales en JobPilot y esperá.
   - Armá la estrategia de búsqueda desde el perfil completo: roles objetivo, stack, seniority, años de experiencia, modalidad y ubicación.
   - A partir de esas palabras clave, generá variantes adicionales en español e inglés: sinónimos, títulos equivalentes, combinaciones con tecnologías del stack y términos de seniority. No te limites a las keywords literales cargadas.
   - Usá el seniority buscado para generar variantes de búsqueda. Por ejemplo, si el perfil indica SSR o Semi Senior, probá variantes como "SSR", "Semi Senior", "Semi-Senior", "Semisenior", "Mid-level" y "Mid".
   - Separá mentalmente keywords base (rol + stack principal del perfil) de keywords exploratorias (títulos equivalentes o tecnologías cercanas). Las exploratorias sirven para descubrir ofertas, pero no reemplazan los criterios de filtro.
   - Priorizá profundidad sobre velocidad. Antes de concluir una búsqueda normal, revisá como mínimo 80-120 tarjetas/resultados por portal y abrí/lee 40-60 avisos que parezcan mínimamente cercanos al perfil. Si hay menos resultados disponibles, indicá exactamente dónde se agotaron.
   - Para cada keyword principal, revisá al menos 3 páginas completas de resultados. No uses "saturación" para cortar antes de página 3 salvo bloqueo técnico real, captcha, login, rate limit o ausencia total de resultados.
   - Recién podés declarar saturación cuando hayas revisado al menos 5 queries distintas y 100 tarjetas/resultados totales, y más del 70% de los resultados nuevos sean repetidos o claramente fuera de perfil por título/empresa ya vistos.
   - No alcanza con abrir 20-30 avisos en total. Si encontrás pocas compatibles, seguí buscando más lento y más profundo: más páginas, más variantes, otros portales configurados o filtros menos restrictivos del portal que no contradigan el perfil. Nunca relajes criterios, preferencias ni exclusiones cargadas en el perfil.
   - No rellenes el top con ofertas que no matchean solo para llegar a 10. Si después de ampliar hay menos de 10 compatibles, presentá las que haya y explicá la cobertura realizada.
   - Avanzá lento para evitar rate limit: esperá entre 8 y 15 segundos entre abrir resultados, cambiar de página, aplicar filtros o entrar a una oferta. Si el portal se pone lento, aumentá la espera. Es preferible tardar más y revisar mucho que hacer una búsqueda superficial.
   - No abras más de 2 ofertas del mismo portal al mismo tiempo. Si hay señales de bloqueo, pasá inmediatamente a navegación secuencial.
   - Usá todas las modalidades aceptadas por el perfil. Si el perfil dice Remoto e Híbrido, NO filtres solo remoto.
   - No uses filtros más restrictivos que el perfil (por ejemplo solo remoto, solo mid-senior, solo fecha reciente) salvo que expliques por qué y hagas también una búsqueda amplia.
   - En LinkedIn, revisá tanto búsquedas por keywords como la feed personalizada /jobs/search-results/ cuando esté disponible.
   - Buscá variantes en inglés y español derivadas de los roles objetivo del perfil. Ejemplo si el rol fuera Frontend: Frontend Developer, React Developer, Angular Developer, TypeScript Developer, Desarrollador Frontend, Frontend SSR. Si el perfil indica otros roles, adaptá las variantes a esos roles.
   - Al presentar resultados, indicá qué keywords, filtros y secciones revisaste, cuántas tarjetas/resultados escaneaste, cuántos avisos abriste/leíste completos, cuántas páginas recorriste por query y cuántos quedaron pendientes por error de carga.
   - Si el portal aplica rate-limit, bloqueo o captcha, no afirmes que revisaste "todo lo relevante". Informá exactamente páginas/resultados revisados, qué quedó sin revisar y llamá a request_human_help con motivo y URL. No intentes resolver captchas por tu cuenta.

3. **Evaluar ofertas**: por cada resultado, abrí la oferta, leé descripción,
   evaluá según mis criterios. Asigná score 1-10.
   - Guardá en JobPilot solo ofertas compatibles o dudosas que valga la pena que el usuario revise.
   - No guardes en JobPilot ofertas que violen un descarte duro o que claramente no interesan. Esas ofertas van solo en el resumen como "descartadas", con motivo breve.
   - Si una oferta no carga o no podés leer la descripción completa, no la descartes por falta de información. Reintentá al menos 2 veces con espera; si sigue fallando, registrala en el resumen como pendiente por error de carga con URL, portal y reintentos.
   - Si una oferta pide inglés Strong, Advanced, Fluent, B2, C1 o C2, tratala como superior a B1 y descartala salvo que el perfil indique explícitamente que acepta ese nivel.
   - Si la empresa tiene rating visible menor a 4 o reviews claramente negativos, descartala en vez de ponerla en el top.

4. **STOP en paso 4 — presentar top 10** en tabla con columnas:
   Puesto | Empresa | Lugar | Salario | Modalidad | Score | Razón del match
   Mostrame y esperá mi confirmación.
   Antes de la tabla, incluí un resumen de cobertura: portales revisados, queries usadas, páginas/resultados revisados, cantidad de ofertas guardadas, descartadas no guardadas y pendientes por bloqueo.

5. **Esperar instrucción**:
   - "confirmar todos" → postular en orden
   - "omitir X" → postular solo las confirmadas
   - "editar X" → te indico cambios

## REGLAS DURAS

- NUNCA postular sin confirmación humana en paso 4
- En modo búsqueda, no prometas postular ni tomes "confirmar todos" como aprobación de postulación. La confirmación solo sirve para guardar o revisar ofertas; postular ocurre después, en modo postulación y con aprobación en JobPilot.
- NUNCA cartas genéricas, siempre personalizadas
- Si falla 2 veces, salteala y registrala como error
- Si pide test técnico antes de postular, marcala como "pendiente test"
- NUNCA reveles info personal a terceros fuera del portal
- Ante CAPTCHA, verificación humana, rate limit persistente, login o 2FA, llamá a request_human_help con motivo y URL, pausá y esperá al usuario.
- NO postules a G&L GROUP`;
}
const DEFAULT_APP_INSTRUCTIONS = `## PLAN DE TAREAS

Ejecutá en orden:

6. **Postular**: por cada oferta confirmada o aprobada en JobPilot:
   - Adjuntá mi CV PDF desde cvPath
   - Carta personalizada: esperá a que yo te la envíe o te pase el mensaje de por qué quiero entrar a esta empresa, por qué este rol, y un logro específico relevante
   - Enviá postulación
   - Confirmá éxito

7. **Reportá**: resumen final con total postuladas, confirmadas, errores,
   y top 3 mejor match para seguimiento LinkedIn manual.

## REGLAS DURAS

- NUNCA postular sin confirmación humana en paso 4 o aprobación explícita en JobPilot
- NUNCA uses cartas genéricas, siempre personalizadas por empresa y rol
- Si falla 2 veces, salteala y registrala como error
- Si pide test técnico antes de postular, marcala como "pendiente test"
- NUNCA reveles info personal a terceros fuera del portal
- NO postules a G&L GROUP`;
function CopyBtn({ text, label = "Copiar" }) {
  const [copied, setCopied] = reactExports.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: copy,
      className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs border transition-all flex-shrink-0",
      style: {
        background: copied ? alpha(col.green, 0.12) : alpha(col.cream, 0.1),
        borderColor: copied ? alpha(col.green, 0.4) : alpha(col.cream, 0.3),
        color: copied ? col.green : col.cream
      },
      children: [
        copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 }),
        copied ? "Copiado" : label
      ]
    }
  );
}
function PasteStep({ step, title, where, text }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-2 rounded-lg p-3.5",
      style: { background: alpha(col.surface, 0.85), border: `1px solid ${alpha(col.cream, 0.18)}` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "flex items-center justify-center rounded-full font-bold flex-shrink-0",
              style: { width: 22, height: 22, background: alpha(col.cream, 0.14), color: col.cream, fontSize: 11 },
              children: step
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold", style: { color: col.cream }, children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xs", style: { color: col.fgMuted }, children: [
              "Pegar en: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col.amber }, children: where })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CopyBtn, { text }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setOpen((v2) => !v2),
              className: "flex items-center gap-1 text-2xs px-2 py-1 rounded border transition-all flex-shrink-0",
              style: { borderColor: alpha(col.border, 0.3), color: col.fgMuted },
              children: [
                open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 11 }),
                open ? "Ocultar" : "Ver"
              ]
            }
          )
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            className: "rounded-md p-3 text-2xs leading-relaxed",
            style: {
              background: alpha(col.raised, 0.5),
              border: `1px solid ${alpha(col.border, 0.15)}`,
              color: col.fgDim,
              fontFamily: "inherit",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            },
            children: text
          }
        )
      ]
    }
  );
}
function BehaviorBlock({ title, sublabel, value }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-2 rounded-lg p-3.5",
      style: { background: alpha(col.surface, 0.5), border: `1px solid ${alpha(col.border, 0.2)}` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { size: 14, className: "flex-shrink-0", style: { color: col.fgMuted } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold", style: { color: col.fg }, children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-2xs px-1.5 py-0.5 rounded",
                  style: { background: alpha(col.green, 0.12), color: col.green, border: `1px solid ${alpha(col.green, 0.25)}` },
                  children: "Automático"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: sublabel })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setOpen((v2) => !v2),
              className: "flex items-center gap-1 text-2xs px-2 py-1 rounded border transition-all flex-shrink-0",
              style: { borderColor: alpha(col.border, 0.3), color: col.fgMuted },
              children: [
                open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 11 }),
                open ? "Ocultar" : "Ver"
              ]
            }
          )
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            className: "rounded-md p-3 text-2xs leading-relaxed",
            style: {
              background: alpha(col.raised, 0.5),
              border: `1px solid ${alpha(col.border, 0.2)}`,
              color: col.fgDim,
              fontFamily: "inherit",
              minHeight: 160,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            },
            children: value
          }
        )
      ]
    }
  );
}
function Instructions() {
  const profile = useStore((s) => s.profile);
  const settings = useStore((s) => s.settings);
  const searchInstr = buildDefaultSearchInstructions(settings.portals ?? [], profile);
  const appInstr = DEFAULT_APP_INSTRUCTIONS;
  const searchMsg = DEFAULT_SEARCH_MSG;
  const appMsg = DEFAULT_APP_MSG;
  const portals = settings.portals?.join(", ") || "LinkedIn, Bumeran, GetOnBoard";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5 overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold", style: { color: col.cream, fontSize: "0.9375rem" }, children: "Instrucciones Cowork" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs mt-0.5", style: { color: col.fgMuted }, children: "Solo copiás 3 textos. El resto Cowork lo lee solo desde JobPilot." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardPaste, { size: 15, style: { color: col.cream } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold uppercase tracking-wide", style: { color: col.cream }, children: "Lo que pegás en Cowork" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PasteStep,
        {
          step: "1",
          title: "System prompt — una sola vez",
          where: "Cowork → ⚙️ Instrucciones del proyecto",
          text: SYSTEM_PROMPT
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PasteStep,
        {
          step: "2",
          title: "Para buscar ofertas",
          where: "Chat de Cowork",
          text: searchMsg
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PasteStep,
        {
          step: "3",
          title: "Para postular (después de aprobar en JobPilot)",
          where: "Chat de Cowork",
          text: appMsg
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { size: 15, style: { color: col.fgMuted } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold uppercase tracking-wide", style: { color: col.fgMuted }, children: "Comportamiento del agente" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg px-3.5 py-2.5 text-2xs",
          style: { background: alpha(col.raised, 0.4), border: `1px solid ${alpha(col.border, 0.15)}`, color: col.fgMuted },
          children: [
            "No hace falta copiar esto. Cuando Cowork llama a ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { style: { color: col.violet }, children: "get_instructions" }),
            " recibe estos textos automáticamente. Para cambiarlos, editá Perfil y Portales de búsqueda. El portal (",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: col.cream }, children: portals }),
            ") y el perfil se insertan solos."
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BehaviorBlock,
        {
          title: "Instrucciones de búsqueda",
          sublabel: "Criterios, portales y plan que Cowork sigue al buscar",
          value: searchInstr
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BehaviorBlock,
        {
          title: "Instrucciones de postulación",
          sublabel: "Plan que Cowork sigue al postular a las ofertas aprobadas",
          value: appInstr
        }
      )
    ] })
  ] });
}
function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const setOffers = useStore((s) => s.setOffers);
  const setProfile = useStore((s) => s.setProfile);
  const showNotification = useStore((s) => s.showNotification);
  const [form, setForm] = reactExports.useState({ ...settings });
  const set = (key, value) => setForm((f2) => ({ ...f2, [key]: value }));
  const save = async () => {
    await setSettings({ ...form, portals: settings.portals });
    showNotification("success", "Configuración guardada");
  };
  const browseFolder = async () => {
    const folder = await window.api.selectFolder();
    if (folder) set("workFolder", folder);
  };
  const loadMockData = async () => {
    await setProfile({ ...MOCK_PROFILE, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    await setOffers(MOCK_OFFERS);
    showNotification("success", "Datos de prueba cargados — 8 ofertas");
  };
  const clearAllData = async () => {
    if (!confirm("¿Seguro que querés borrar todas las ofertas? El perfil se mantiene.")) return;
    await setOffers([]);
    showNotification("info", "Datos borrados");
  };
  const exportData = async () => {
    const res = await window.api.exportData();
    if (res.ok) showNotification("success", "Backup exportado");
  };
  const importData = async () => {
    if (!confirm("Importar reemplaza tus datos actuales con los del archivo. ¿Continuar?")) return;
    const res = await window.api.importData();
    if (res.ok) {
      await useStore.getState().loadFromStorage();
      showNotification("success", "Datos importados");
    } else if (res.error) showNotification("error", res.error);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-5 max-w-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold", style: { color: col.cream, fontSize: "0.9375rem" }, children: "Configuración" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs mt-0.5", style: { color: col.fgMuted }, children: "JobPilot v0.1.0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary", onClick: save, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 13 }),
        " Guardar"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Cowork Bridge" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: "Carpeta de trabajo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs mb-2", style: { color: col.fgMuted }, children: "Donde JobPilot genera los archivos para Cowork. Por defecto: ~/Documents/JobPilot/cowork" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input",
              value: form.workFolder,
              onChange: (e) => set("workFolder", e.target.value),
              placeholder: "Ruta a la carpeta de trabajo..."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { padding: "0 0.625rem", flexShrink: 0 }, onClick: browseFolder, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 14 }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Datos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-secondary", onClick: loadMockData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12 }),
          " Cargar datos de prueba"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-danger", onClick: clearAllData, children: "Borrar ofertas" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: "Los datos se guardan en: ~/Documents/JobPilot/data/" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Backup portátil" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-secondary", onClick: exportData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 12 }),
          " Exportar todo a un JSON"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-secondary", onClick: importData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 12 }),
          " Importar desde JSON"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: "Exportá perfil, ofertas, settings y prompts en un archivo. Importalo en otra PC para tener todo." })
    ] })
  ] });
}
const PAGES = {
  dashboard: Dashboard,
  profile: Profile,
  offers: Offers,
  tracker: Tracker,
  bridge: CoworkBridge,
  instructions: Instructions,
  settings: SettingsPage
};
const TOAST_STYLE = {
  success: { text: col.green, border: alpha(col.green, 0.35), bg: alpha(col.green, 0.08) },
  error: { text: col.red, border: alpha(col.red, 0.35), bg: alpha(col.red, 0.08) },
  info: { text: col.cream, border: alpha(col.cream, 0.25), bg: alpha(col.cream, 0.05) }
};
const TOAST_ICON = { success: CircleCheck, error: CircleX, info: Info };
function HelpBanner() {
  const helpRequests = useStore((s) => s.helpRequests);
  const resolveHelpRequest = useStore((s) => s.resolveHelpRequest);
  const pending = helpRequests.filter((h) => !h.resolved);
  if (pending.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", children: pending.map((h) => {
    const isCover = h.type === "cover_letter";
    const accent = isCover ? col.violet : col.amber;
    const Icon2 = isCover ? FileText : ShieldAlert;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-5 py-2.5 animate-fade-in",
        style: { background: alpha(accent, 0.14), borderBottom: `1px solid ${alpha(accent, 0.4)}` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 16, className: "flex-shrink-0", style: { color: accent } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold", style: { color: accent }, children: isCover ? `Carta de presentación para ${h.company ?? "una empresa"}` : `Cowork necesita tu ayuda${h.portal ? ` · ${h.portal}` : ""}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs truncate", style: { color: col.fg }, children: isCover ? `${h.role ?? "Puesto"} — escribila (pedímela a Claude) y cuando esté, avisale a Cowork que continúe.` : `${h.reason} — resolvelo en el navegador y avisale a Cowork que continúe.` })
          ] }),
          h.url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: h.url,
              target: "_blank",
              rel: "noreferrer",
              className: "flex items-center gap-1 text-2xs px-2.5 py-1 rounded-md border flex-shrink-0",
              style: { borderColor: alpha(accent, 0.4), color: accent },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11 }),
                " Ver oferta"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => resolveHelpRequest(h.id),
              className: "flex items-center gap-1 text-2xs px-2.5 py-1 rounded-md border flex-shrink-0",
              style: { borderColor: alpha(col.green, 0.4), color: col.green, background: alpha(col.green, 0.08) },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }),
                " ",
                isCover ? "Lista" : "Resuelto"
              ]
            }
          )
        ]
      },
      h.id
    );
  }) });
}
function Layout() {
  const activeView = useStore((s) => s.activeView);
  const notification = useStore((s) => s.notification);
  const clearNotification = useStore((s) => s.clearNotification);
  const Page = PAGES[activeView];
  reactExports.useEffect(() => {
    document.title = `JobPilot — ${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`;
  }, [activeView]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-screen overflow-hidden",
      style: { background: col.base, color: col.fg, fontFamily: "inherit" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HelpBanner, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto min-w-0 main-content", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Page, {}) })
        ] }),
        notification && (() => {
          const style = TOAST_STYLE[notification.type];
          const Icon2 = TOAST_ICON[notification.type];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "fixed bottom-5 right-5 z-50 flex items-start gap-3 px-4 py-3 max-w-sm rounded-lg border animate-fade-in",
              style: { background: style.bg, borderColor: style.border, color: style.text },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 15, className: "mt-px flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-xs leading-relaxed", style: { color: col.fg }, children: notification.message }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearNotification, className: "opacity-40 hover:opacity-70 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }) })
              ]
            }
          );
        })()
      ]
    }
  );
}
function LoadingScreen() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-screen flex items-center justify-center",
      style: { background: col.base },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: "32",
            height: "32",
            viewBox: "0 0 28 28",
            fill: "none",
            stroke: col.cream,
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "animate-scan",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "14", r: "11" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "14", r: "2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "14", y1: "3", x2: "14", y2: "8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "14", y1: "20", x2: "14", y2: "25" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "14", x2: "8", y2: "14" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "20", y1: "14", x2: "25", y2: "14" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xs", style: { color: col.fgMuted }, children: "Cargando JobPilot..." })
      ] })
    }
  );
}
function App() {
  const [ready, setReady] = reactExports.useState(false);
  const loadFromStorage = useStore((s) => s.loadFromStorage);
  const reloadOffers = useStore((s) => s.reloadOffers);
  const reloadHelpRequests = useStore((s) => s.reloadHelpRequests);
  reactExports.useEffect(() => {
    loadFromStorage().then(() => setReady(true));
  }, []);
  reactExports.useEffect(() => {
    window.api.onDataChanged((file) => {
      if (file === "offers.json") reloadOffers();
      if (file === "help_requests.json") reloadHelpRequests();
    });
    return () => window.api.offDataChanged();
  }, []);
  if (!ready) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingScreen, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {});
}
const store = {
  profile: DEFAULT_PROFILE,
  offers: [],
  settings: DEFAULT_SETTINGS,
  prompts: { searchInstructions: null, applicationInstructions: null, searchMessage: null, applicationMessage: null },
  help: []
};
const mockApi = {
  getProfile: async () => store.profile,
  saveProfile: async (p2) => {
    store.profile = p2;
  },
  getOffers: async () => store.offers,
  saveOffers: async (o) => {
    store.offers = o;
  },
  getSettings: async () => store.settings,
  saveSettings: async (s) => {
    store.settings = s;
  },
  selectFolder: async () => null,
  getDefaultWorkFolder: async () => "~/Documents/JobPilot/cowork",
  selectPdf: async () => ({ success: false, error: "Solo disponible en la app de escritorio" }),
  readPdfFromPath: async () => ({ success: false, error: "Solo disponible en la app de escritorio" }),
  onDataChanged: () => {
  },
  offDataChanged: () => {
  },
  getPrompts: async () => store.prompts,
  savePrompts: async (p2) => {
    store.prompts = p2;
  },
  getHelpRequests: async () => store.help,
  resolveHelpRequest: async (id2) => {
    store.help = store.help.map((h) => h.id === id2 ? { ...h, resolved: true } : h);
    return { ok: true };
  },
  serverStatus: async () => ({ mcpRunning: false, tunnelRunning: false, tunnelUrl: null }),
  serverMcpStart: async () => ({ ok: false }),
  serverMcpStop: async () => ({ ok: false }),
  serverTunnelStart: async () => ({ ok: false }),
  serverTunnelStop: async () => ({ ok: false }),
  onMcpLog: () => {
  },
  offMcpLog: () => {
  },
  onTunnelLog: () => {
  },
  offTunnelLog: () => {
  }
};
function installMockApiIfNeeded() {
  if (typeof window !== "undefined" && !window.api) {
    window.api = mockApi;
  }
}
installMockApiIfNeeded();
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React$2.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
