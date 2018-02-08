import React, { Component } from "react";
import { Stage, Viewport } from "react-pixi-fiber";
import DraggableBunny from "./DraggableBunny";

class ViewportExample extends Component {
	stage = null;
	viewport = null;

	// getChildContext() {
	// 	return {
	// 		app: this.context.app,
	// 	};
	// }

	componentDidMount() {
		this.viewport.drag().pinch().wheel().decelerate();
	}

	render() {
		window.example = this;

		return (
			<Stage width={800} height={600} backgroundColor={0x1099bb} ref={(stage) => { this.stage = stage; }}>
				<Viewport worldWidth={1600} worldHeight={1200} screenWidth={800} screenHeight={600} ref={(viewport) => { this.viewport = viewport; }}>
					<DraggableBunny name="1" x={200} y={200} />
					<DraggableBunny name="2" x={400} y={400} />
				</Viewport>
			</Stage>
		);
	}
}

// ViewportExample.childContextTypes = {
// 	app: PropTypes.object,
// 	toWorld: PropTypes.function
// }

export default ViewportExample;
