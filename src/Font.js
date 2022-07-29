export const Font = {
	letterSpacing: 1,
	lineHeight: 8,
	lineSpacing: 2,
	formattingPrefix: "\u00a7",
	colorPrefix: ":",
	lineBreak: /\r?\n|\r/,
	async loadImage(path) {
		this.ascii = new Image();
		this.ascii.src = path;
		await this.ascii.decode();
	},
	async loadDefs(path) {
		const {char, color} = await (await fetch(path)).json();

		Object.assign(this, {char, color});

		this.defaultColor = this.color.white;
	},
};