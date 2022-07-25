import {Font, Layer, Component} from "../src/index.js";

export let scale = 5;

(async () => {
	const
		layer = new Layer({
			background: 0x312646,
			smooth: false,
		}),
		component = new Component.Text({
			origin: ["center", "center"],
			offset: [0, 0],
			text: "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit...",
			textBackground: 0x3e3158,
			textShadow: false,
		});

	// Load font utils
	await Font.loadImage("public/font/ascii.png");
	await Font.loadDefs("public/font/font.json");

	layer
		.add(component)
		.redraw({forceCompute: true});
})();