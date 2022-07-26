import {Component} from "./Component.js";
import {Font, scale} from "./index.js";

export function Text({
	text = "",
	textBackground,
	textShadow = false,
} = {}) {
	Component.call(this, ...arguments);

	Object.assign(this, {text, textBackground, textShadow});

	this.compute = () => {
		this.raw = this.text.split("").map(char => ({char}));

		this.format();
		this.computeSize();
		this.computeDefault();

		return this;
	};

	this.computeSize = () => {
		const lines = this.text.split("\n").map(l => l.split("").map(char => ({char})));
		let maxWidth, maxHeight, width, x, y;
		x = y = width = maxWidth = maxHeight = 0;

		if (this.formatted.length) maxHeight = Font.lineHeight + Font.lineSpacing;

		this.chars = [];

		for (const c of this.formatted) {
			if (c.char === "\n") {
				x = 0;
				y += (Font.lineHeight + Font.lineSpacing) * scale;

				console.log(width, maxWidth)

				if (width > maxWidth) maxWidth = width;
				maxHeight += Font.lineHeight + Font.lineSpacing;

				width = 0;
			} else {
				let i = Font.char[c.char] ? c.char : " ",
					w = Font.char[i].size + Font.letterSpacing;

				Object.assign(c, {x, y});

				width += w;
				x += w * scale;

				this.chars.push(c);
			}
		}

		if (width > maxWidth) maxWidth = width;
		if (!this.size.length) {
			this.size = [maxWidth, maxHeight];
			this.w = maxWidth * scale;
			this.h = maxHeight * scale;
		}
	};

	this.format = () => {
		const colors = Object.values(Font.color);
		let formatting, color;

		this.formatted = [];

		for (const c of this.raw) {
			if (formatting) {
				formatting = false;

				color = colors.find(color => c.char === color.code)?.foreground ?? null;

				continue;
			}

			if (c.char === Font.formattingPrefix) {
				formatting = true;

				continue;
			}

			c.color = color;

			this.formatted.push(c);
		}
	};

	this.draw = () => {
		const ctx = this.layer.ctx;
		let color;

		if (this.textBackground) {
			ctx.fillStyle = `#${this.textBackground.toString(16)}`;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}

		for (const c of this.chars) {
			if (!Font.char[c.char]) continue;

			let char = Font.char[c.char],
				size = [char.size + Font.letterSpacing, Font.lineHeight];

			if (color !== c.color) {
				color = c.color;
				ctx.fillStyle = color;
			}

			ctx.save();
			ctx.filter = `drop-shadow(${scale}px ${scale}px 0 ${color}`;
			ctx.drawImage(
				Font.image,
				...char.uv,
				...size,
				this.x + c.x,
				this.y + c.y,
				...(size.map(s => s * scale)),
			);
			ctx.restore();
		}
	};
};