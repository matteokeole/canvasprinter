import {Font, Layer, Component} from "../src/index.js";

export let scale = 2;

await Font.loadImage("public/font/ascii.png");
await Font.loadDefs("public/font/font.json");

const
	layer = new Layer({
		background: 0x312646,
		smooth: false,
	}),
	component = new Component.Text({
		origin: ["center", "center"],
		offset: [0, 0],
		text: "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit...",
		// text: "§aLorem\nt§dipsum.\n\n§6Nice. Finally gold text.",
		textBackground: 0x3e3158,
		textShadow: true,
	});

layer
	.add(component)
	.redraw({forceCompute: true});

/* Todo
- Load multiple font images (base, accented, etc)
- Replace undefined characters
- Store prefixes and colors in font.json
- rescale() and event listener 50ms debounce
- Split text by color prefixes
- Horizontal text alignment into the component?
*/