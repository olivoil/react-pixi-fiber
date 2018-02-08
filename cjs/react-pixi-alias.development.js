"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactPixiFiber = require("react-pixi-fiber");

var ReactPixiFiber = _interopRequireWildcard(_reactPixiFiber);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// react-pixi like API
// Note: ReactPIXI.factories and ReactPIXI.CustomPIXIComponent are not supported
var ReactPIXI = {
  // Render methods
  render: _reactDom2.default.render,
  unmountComponentAtNode: _reactDom2.default.unmountComponentAtNode,
  // Components
  BitmapText: ReactPixiFiber.BitmapText,
  DisplayObjectContainer: ReactPixiFiber.Container,
  Graphics: ReactPixiFiber.Graphics,
  ParticleContainer: ReactPixiFiber.ParticleContainer,
  Sprite: ReactPixiFiber.Sprite,
  Stage: ReactPixiFiber.Stage,
  Text: ReactPixiFiber.Text,
  TilingSprite: ReactPixiFiber.TilingSprite
};

exports.default = ReactPIXI;
