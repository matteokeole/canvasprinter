import {Component} from "./Component.js";
import {Font, scale} from "./index.js";

export function Text({
	text = "",
	background,
	textShadow = false,
	textShadowOffset = [1, -1],
} = {}) {
	Component.call(this, ...arguments);

	Object.assign(this, {text, background, textShadow, textShadowOffset});

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
		let formatting, color, format;

		this.formatted = [];

		for (const c of this.raw) {
			if (formatting) {
				formatting = false;

				if (!isNaN(parseInt(c.char, 16))) {
					// Color code
					color = colors.find(color => c.char === color.code) ?? null;
				} else format = c.char;

				continue;
			}

			if (c.char === Font.formattingPrefix) {
				formatting = true;

				continue;
			}

			Object.assign(c, {color, format});

			this.formatted.push(c);
		}
	};

	this.draw = () => {
		let color = Font.defaultColor;
		let format;

		const TextBuffer = document.createElement("canvas");
		TextBuffer.width = this.w;
		TextBuffer.height = this.h;
		// document.body.before(TextBuffer);
		const ctx = this.layer.ctx;
		ctx.globalCompositeOperation = "destination-over";
		const tctx = TextBuffer.getContext("2d");
		tctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled;
		tctx.fillStyle = color.foreground;
		tctx.save();

		for (const c of this.chars) {
			if (!Font.char[c.char]) continue;

			let char = Font.char[c.char],
				size = [char.size, Font.lineHeight];

			if (c.color && color !== c.color) color = c.color;
			tctx.fillStyle = color?.foreground;

			if (c.format && format !== c.format) {
				format = c.format;

				if (format === "i") tctx.transform(1, 0, -0.25, 1, scale * (this.h / (size[1] * scale) - .25), 0);
				if (format === "r") tctx.restore();
			}

			tctx.drawImage(
				Font.image,
				...char.uv,
				...size,
				c.x,
				c.y,
				...(size.map(s => s * scale)),
			);

			tctx.globalCompositeOperation = "source-atop";

			tctx.fillRect(
				c.x,
				c.y,
				...(size.map(s => s * scale)),
			);

			tctx.globalCompositeOperation = "source-over";
		}

		ctx.drawImage(
			TextBuffer,
			this.x,
			this.y,
			this.w,
			this.h,
		);

		color = Font.defaultColor;
		format = null;
		tctx.globalCompositeOperation = "source-atop";
		tctx.save();

		// Drop-shadow
		if (this.textShadow) {
			const offset = this.textShadowOffset.map(o => o * scale);

			for (const c of this.chars) {
				if (!Font.char[c.char]) continue;

				let char = Font.char[c.char],
					size = [char.size, Font.lineHeight];

				if (c.color && color !== c.color) color = c.color;
				tctx.fillStyle = color?.background;

				if (c.format && format !== c.format) {
					format = c.format;

					if (format === "i") tctx.transform(1, 0, -0.25, 1, scale * (this.h / (size[1] * scale) - .25), 0);
					if (format === "r") tctx.restore();
				}

				tctx.fillRect(c.x, c.y, ...(size.map(s => s * scale)));
			}

			ctx.drawImage(
				TextBuffer,
				this.x + offset[0],
				this.y - offset[1],
				this.w,
				this.h,
			);
		}

		if (this.background) {
			ctx.fillStyle = `#${this.background.toString(16)}`;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}
	};
};