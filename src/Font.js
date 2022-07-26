export const Font = {
	image: null,
	char: null,
	color: null,
	letterSpacing: 1,
	lineHeight: 8,
	lineSpacing: 2,
	formattingPrefix: "\u00a7",
	lineBreak: /\r?\n|\r/,
	async loadImage(path) {
		this.image = new Image();
		this.image.src = path;
		await this.image.decode();
	},
	async loadDefs(path) {
		const {char, color} = await (await fetch(path)).json();

		Object.assign(this, {char, color});
	},
};