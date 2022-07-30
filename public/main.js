import {Font, Layer, Component} from "../src/index.js";

export let scale = 4;

await Font.loadImage("assets/font/ascii.png");
await Font.loadDefs("assets/font/font.json");

const
	layer = new Layer({
		background: 0x312646,
		smooth: false,
	}),
	component = new Component.Text({
		origin: ["center", "center"],
		offset: [0, 0],
		padding: [2, 2, 1, 2],
		background: 0x3e3158,
		text: "Minecraft 1.8.1 (1.8.1/vanilla)",
		text: "§c:00 §c:11 §c:22 §c:33\n§c:44 §c:55 §c:66 §c:77\n§c:88 §c:99 §c:aa §c:bb\n§c:cc §c:dd §c:ee §c:ff",
		text: "§c:9Example with §bbold§r§c:9 text",
		dropShadow: false,
	});

layer
	.add(component)
	.compute()
	.scale()
	.draw();