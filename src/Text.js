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
		this.computeText();

		// Auto-calculate the size
		if (!this.size.length) this.size = [
			this.w / scale,
			this.h / scale,
		];

		this.computeDefault();

		return this;
	};

	this.computeText = () => {
		let lines = this.text.split("\n").map(l => l.split("").map(char => ({char}))),
			width,
			x,
			y = 0;

		this.w = this.h = 0;

		for (const l of lines) {
			width = x = 0;

			for (const c of l) {
				const
					i = Font.chars[c.char] ? c.char : " ",
					w = Font.chars[i].size + Font.letterSpacing;

				Object.assign(c, {x, y});

				width += w;
				x += w * scale;
			}

			y += (Font.lineHeight + Font.lineSpacing) * scale;

			if (width > this.w) this.w = width;
			this.h += (Font.lineHeight + Font.lineSpacing);
		}

		this.w *= scale;
		this.h *= scale;
		this.lines = lines;
	};

	this.draw = () => {
		const ctx = this.layer.ctx;

		if (this.textBackground) {
			ctx.fillStyle = `#${this.textBackground.toString(16)}`;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}

		for (const l of this.lines) {
			for (const c of l) {
				const char = Font.chars[c.char];

				ctx.drawImage(
					Font.image,
					...char.uv,
					char.size,
					Font.lineHeight,
					this.x + c.x,
					this.y + c.y,
					char.size * scale,
					Font.lineHeight * scale,
				);
			}
		}
	};
};