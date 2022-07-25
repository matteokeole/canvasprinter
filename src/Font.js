export const Font = {
	image: null,
	chars: null,
	letterSpacing: 1,
	lineHeight: 8,
	lineSpacing: 2,
	formattingPrefix: "§",
	async loadImage(path) {
		this.image = new Image();
		this.image.src = path;
		await this.image.decode();
	},
	async loadDefs(path) {
		this.chars = (await (await fetch(path)).json()).chars;
	},
};