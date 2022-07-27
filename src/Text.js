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

				color = colors.find(color => c.char === color.code) ?? null;

				continue;
			}

			if (c.char === Font.formattingPrefix) {
				formatting = true;

				continue;
			}

			c.color = color;

			this.formatted.push(c);
		}

		console.log(this.formatted)
	};

	this.draw = () => {
		const TextBuffer = document.createElement("canvas");
		TextBuffer.width = this.w;
		TextBuffer.height = this.h;
		TextBuffer.style.background = "#000s";
		const ctx = this.layer.ctx;
		const tctx = TextBuffer.getContext("2d");
		tctx.imageSmoothingEnabled = false;
		let color = Font.defaultColor;

		// Shadow
		if (this.textShadow) {
			for (const c of this.chars) {
				if (!Font.char[c.char]) continue;

				let char = Font.char[c.char],
					size = [char.size, Font.lineHeight];

				if (c.color && color !== c.color) color = c.color;
				tctx.fillStyle = color?.background;

				tctx.drawImage(
					Font.image,
					...char.uv,
					...size,
					c.x + scale,
					c.y + scale,
					...(size.map(s => s * scale)),
				);

				tctx.globalCompositeOperation = "source-atop";

				tctx.fillRect(
					c.x + scale,
					c.y + scale,
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

			tctx.clearRect(0, 0, this.w, this.h);

			color = Font.defaultColor;
		}

		// Text
		for (const c of this.chars) {
			if (!Font.char[c.char]) continue;

			let char = Font.char[c.char],
				size = [char.size, Font.lineHeight];

			if (c.color && color !== c.color) color = c.color;
			tctx.fillStyle = color?.foreground;

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
	};
};