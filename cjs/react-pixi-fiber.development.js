"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Viewport = exports.TilingSprite = exports.Text = exports.Sprite = exports.ParticleContainer = exports.Graphics = exports.Container = exports.BitmapText = exports.render = exports.Stage = exports.filterByKey = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactReconciler = require("react-reconciler");

var _reactReconciler2 = _interopRequireDefault(_reactReconciler);

var _emptyObject = require("fbjs/lib/emptyObject");

var _emptyObject2 = _interopRequireDefault(_emptyObject);

var _invariant = require("fbjs/lib/invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _performanceNow = require("performance-now");

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _pixi = require("pixi.js");

var PIXI = _interopRequireWildcard(_pixi);

var _pixiViewport = require("pixi-viewport");

var _pixiViewport2 = _interopRequireDefault(_pixiViewport);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RESERVED_PROPS = {
	children: true
};

var TYPES = {
	BITMAP_TEXT: "BitmapText",
	CONTAINER: "Container",
	GRAPHICS: "Graphics",
	PARTICLE_CONTAINER: "ParticleContainer",
	SPRITE: "Sprite",
	TEXT: "Text",
	TILING_SPRITE: "TilingSprite",
	VIEWPORT: "Viewport"
};

var UPDATE_SIGNAL = {};

/* Render Methods */

// TODO consider whitelisting props based on component type
var applyProps = function applyProps(instance, props, prevProps) {
	Object.assign(instance, filterByKey(props, filterProps));
};

function render(pixiElement, stage, callback) {
	var container = stage._reactRootContainer;
	if (!container) {
		container = ReactPixiFiber.createContainer(stage);
		stage._reactRootContainer = container;
	}

	ReactPixiFiber.updateContainer(pixiElement, container, undefined, callback);

	ReactPixiFiber.injectIntoDevTools({
		findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
		bundleType: 1,
		version: "0.2.0",
		rendererPackageName: "react-pixi-fiber"
	});
}

/* Helper Methods */

var filterByKey = exports.filterByKey = function filterByKey(inputObject, filter) {
	var exportObject = {};

	Object.keys(inputObject).filter(filter).forEach(function (key) {
		exportObject[key] = inputObject[key];
	});

	return exportObject;
};

function appendChild(parentInstance, child) {
	// TODO do we need to remove the child first if it's already added?
	parentInstance.removeChild(child);

	parentInstance.addChild(child);
}

var removeChild = function removeChild(parentInstance, child) {
	parentInstance.removeChild(child);

	child.destroy();
};

var insertBefore = function insertBefore(parentInstance, child, beforeChild) {
	(0, _invariant2.default)(child !== beforeChild, "ReactPixiFiber cannot insert node before itself");

	var childExists = parentInstance.children.indexOf(child) !== -1;
	var index = parentInstance.getChildIndex(beforeChild);

	if (childExists) {
		parentInstance.setChildIndex(child, index);
	} else {
		parentInstance.addChildAt(child, index);
	}
};

var filterProps = function filterProps(key) {
	return Object.keys(RESERVED_PROPS).indexOf(key) === -1;
};

var commitUpdate = function commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
	applyProps(instance, newProps, oldProps);
};

/* PIXI.js Renderer */

var ReactPixiFiber = (0, _reactReconciler2.default)({
	appendInitialChild: appendChild,

	createInstance: function createInstance(type, props, internalInstanceHandle) {
		var instance = void 0;

		switch (type) {
			case TYPES.BITMAP_TEXT:
				instance = new PIXI.BitmapText(props.text, props.style);
				break;
			case TYPES.CONTAINER:
				instance = new PIXI.Container();
				break;
			case TYPES.GRAPHICS:
				instance = new PIXI.Graphics();
				break;
			case TYPES.PARTICLE_CONTAINER:
				instance = new PIXI.particles.ParticleContainer(props.maxSize, props.properties, props.batchSize, props.autoResize);
				break;
			case TYPES.SPRITE:
				instance = new PIXI.Sprite(props.texture);
				break;
			case TYPES.TEXT:
				instance = new PIXI.Text(props.text, props.style, props.canvas);
				break;
			case TYPES.TILING_SPRITE:
				instance = new PIXI.extras.TilingSprite(props.texture, props.width, props.height);
				break;
			case TYPES.VIEWPORT:
				instance = new _pixiViewport2.default({
					screenWidth: props.screenWidth,
					screenHeight: props.screenHeight,
					worldWidth: props.worldWidth,
					worldHeight: props.worldHeight
				});
				break;
			default:
				break;
		}

		(0, _invariant2.default)(instance, 'ReactPixiFiber does not support the type: "%s"', type);

		applyProps(instance, props);

		return instance;
	},

	createTextInstance: function createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
		(0, _invariant2.default)(false, "ReactPixiFiber does not support text instances. Use Text component instead.");
	},


	finalizeInitialChildren: function finalizeInitialChildren(pixiElement, type, props, rootContainerInstance) {
		return false;
	},

	getChildHostContext: function getChildHostContext(parentHostContext, type) {
		return _emptyObject2.default;
	},
	getRootHostContext: function getRootHostContext(rootContainerInstance) {
		return _emptyObject2.default;
	},
	getPublicInstance: function getPublicInstance(inst) {
		return inst;
	},


	now: _performanceNow2.default,

	prepareForCommit: function prepareForCommit() {
		// Noop
	},


	prepareUpdate: function prepareUpdate(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
		return UPDATE_SIGNAL;
	},

	resetAfterCommit: function resetAfterCommit() {
		// Noop
	},
	resetTextContent: function resetTextContent(pixiElement) {
		// Noop
	},


	shouldDeprioritizeSubtree: function shouldDeprioritizeSubtree(type, props) {
		var isAlphaVisible = typeof props.alpha === "undefined" || props.alpha > 0;
		var isRenderable = typeof props.renderable === "undefined" || props.renderable === true;
		var isVisible = typeof props.visible === "undefined" || props.visible === true;

		return !(isAlphaVisible && isRenderable && isVisible);
	},

	shouldSetTextContent: function shouldSetTextContent(type, props) {
		return false;
	},

	useSyncScheduling: true,

	mutation: {
		appendChild: appendChild,
		appendChildToContainer: appendChild,

		insertBefore: insertBefore,
		insertInContainerBefore: insertBefore,

		removeChild: removeChild,
		removeChildFromContainer: removeChild,

		commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
			// Noop
		},

		commitMount: function commitMount(instance, type, newProps) {
			// Noop
		},

		commitUpdate: commitUpdate
	}
});

/* React Components */

var Stage = function (_React$Component) {
	_inherits(Stage, _React$Component);

	function Stage() {
		_classCallCheck(this, Stage);

		return _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).apply(this, arguments));
	}

	_createClass(Stage, [{
		key: "getChildContext",
		value: function getChildContext() {
			return {
				app: this._app
			};
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			var _props = this.props,
			    backgroundColor = _props.backgroundColor,
			    children = _props.children,
			    height = _props.height,
			    width = _props.width;


			this._app = new PIXI.Application(width, height, {
				backgroundColor: backgroundColor,
				view: this._canvas
			});

			this._mountNode = ReactPixiFiber.createContainer(this._app.stage);
			ReactPixiFiber.updateContainer(children, this._mountNode, this);

			ReactPixiFiber.injectIntoDevTools({
				findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
				bundleType: 1,
				version: "0.2.0",
				rendererPackageName: "react-pixi-fiber"
			});
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate(prevProps, prevState) {
			var _props2 = this.props,
			    children = _props2.children,
			    height = _props2.height,
			    width = _props2.width;

			// TODO resize stage

			if (height !== prevProps.height || width !== prevProps.width) {}

			ReactPixiFiber.updateContainer(children, this._mountNode, this);
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			ReactPixiFiber.updateContainer(null, this._mountNode, this);
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement("canvas", { ref: function ref(_ref) {
					return _this2._canvas = _ref;
				} });
		}
	}]);

	return Stage;
}(_react2.default.Component);

Stage.propTypes = {
	backgroundColor: _propTypes2.default.number,
	children: _propTypes2.default.node,
	height: _propTypes2.default.number,
	width: _propTypes2.default.number
};

Stage.childContextTypes = {
	app: _propTypes2.default.object
};

/* API */

exports.Stage = Stage;
exports.render = render;
var BitmapText = exports.BitmapText = TYPES.BITMAP_TEXT;
var Container = exports.Container = TYPES.CONTAINER;
var Graphics = exports.Graphics = TYPES.GRAPHICS;
var ParticleContainer = exports.ParticleContainer = TYPES.PARTICLE_CONTAINER;
var Sprite = exports.Sprite = TYPES.SPRITE;
var Text = exports.Text = TYPES.TEXT;
var TilingSprite = exports.TilingSprite = TYPES.TILING_SPRITE;
var Viewport = exports.Viewport = TYPES.VIEWPORT;
