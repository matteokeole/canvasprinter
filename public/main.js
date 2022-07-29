import {Font, Layer, Component} from "../src/index.js";

export let scale = 4;

await Font.loadImage("public/font/ascii.png");
await Font.loadDefs("public/font/font.json");

const
	layer = new Layer({
		background: 0x312646,
		smooth: false,
	}),
	component = new Component.Text({
		origin: ["left", "top"],
		offset: [0, 0],
		background: 0x3e3158,
		text: "Minecraft 1.8.1 (1.8.1/vanilla)",
		text: "Example with §i§c:eitalic §rformating",
		text: "§c:00 §c:11 §c:22 §c:33\n§c:44 §c:55 §c:66 §c:77\n§c:88 §c:99 §c:aa §c:bb\n§c:cc §c:dd §c:ee §c:ff",
		text: "Example with default formatting",
		dropShadow: true,
	});

layer
	.add(component)
	.compute()
	.scale()
	.draw();

/*
- Load multiple font images (base, accented, etc)
- Replace undefined characters
- rescale() and event listener 50ms debounce
- Horizontal text alignment into the component?
*/