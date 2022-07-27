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
		origin: ["center", "center"],
		offset: [0, 0],
		background: 0x3e3158,
		text: "Example with §i§eitalic§r §fformating",
		text: "Example with color formatting\n\n§dJ'aime §7les §etacos §8de §cma §5maman.\n\n\n\n\n\n\n\n§3(Et ma maman c'est ma maman.)",
		text: "§00 §11 §22 §33\n§44 §55 §66 §77\n§88 §99 §aa §bb\n§cc §dd §ee §ff",
		text: "Example with default formatting",
		text: "§a²Super Sword §f(#0276)\n§7 Sharpness V\n Fire Aspect II\n§cThis is a great sword!\n\n§9+13.25 Attack Damage\n§8minecraft:diamond_sword\nNBT: 2 tag(s)",
		textShadow: true,
	});

layer
	.add(component)
	.redraw({forceCompute: true});

/* Todo
- Load multiple font images (base, accented, etc)
- Replace undefined characters
- Store prefixes in font.json
- rescale() and event listener 50ms debounce
- Horizontal text alignment into the component?
*/