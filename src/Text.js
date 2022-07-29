import {Buffer} from "./Buffer.js";
import {Component} from "./Component.js";
import {Font, scale} from "./index.js";
import {format} from "./utils/format.js";

export function Text({
	padding = [0, 0, 0, 0], // t/r/b/l
	text = "",
	letterSpacing = Font.letterSpacing,
	lineSpacing = Font.lineSpacing,
	dropShadow = false,
	dropShadowOffset = [1, -1],
} = {}) {
	Component.call(this, ...arguments);

	Object.assign(this, {padding, text, dropShadow, dropShadowOffset, letterSpacing, lineSpacing});

	this.compute = () => {
		format.call(this);
		this.computeText();
		this.__compute();

		return this;
	};

	this.computeText = () => {
		const lines = this.text.split("\n").map(l => l.split("").map(char => ({char})));
		let maxWidth, maxHeight, width, x, y;
		maxWidth = width = x = padding[3];
		maxHeight = y = padding[0];

		if (this.formatted.length) maxHeight = Font.lineHeight;

		this.chars = [];

		for (const c of this.formatted) {
			if (c.formatter) {
				this.chars.push(c);

				continue;
			}

			if (c.char === "\n") {
				x = padding[3];
				y += (Font.lineHeight + this.lineSpacing);

				if (width > maxWidth) maxWidth = width + padding[1];
				width = 0;
			} else {
				let i = Font.char[c.char] ? c.char : " ",
					w = Font.char[i].size + this.letterSpacing;

				Object.assign(c, {x, y});

				width += w;
				x += w;

				this.chars.push(c);
			}
		}

		if (width > maxWidth) maxWidth = width + padding[1];
		maxHeight += y + padding[2];

		// if (!this.size.length) {
			this.size = [maxWidth, maxHeight];
			this.w = maxWidth;
			this.h = maxHeight;
		// }
	};

	this.scale = () => {
		let {x, y, w, h, chars, dropShadowOffset} = this;

		x *= scale;
		y *= scale;

		w *= scale;
		h *= scale;

		chars = structuredClone(chars);
		for (const c of chars) {
			c.x *= scale;
			c.y *= scale;
		}

		dropShadowOffset = dropShadowOffset.map(o => o * scale);

		this.scaled = {x, y, w, h, chars, dropShadowOffset};
	};

	this.draw = () => {
		let {scaled} = this, tctx, ctx, char;

		// Configure the layer context
		ctx = this.layer.ctx;
		ctx.globalCompositeOperation = "destination-over";

		// Configure the text buffer
		Buffer.Text.width = scaled.w;
		Buffer.Text.height = scaled.h;

		tctx = Buffer.Text.ctx;
		tctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled;
		tctx.fillStyle = Font.defaultColor.foreground;
		tctx.save();

		for (const c of scaled.chars) {
			char = Font.char[c.char];

			if (c.formatter) {
				switch (c.formatter) {
					case "c":
						// Colorize
						tctx.fillStyle = c.color.foreground;

						break;
					case "i":
						// Italic
						tctx.setTransform(1, 0, -0.25, 1, 0, 0);

						break;
					case "r":
						// Reset formatting
						tctx.restore();

						break;
				}

				continue;
			}

			tctx.globalCompositeOperation = "source-over";
			tctx.drawImage(
				Font.ascii,
				...char.uv,
				char.size,
				Font.lineHeight,
				c.x,
				c.y,
				char.size * scale,
				Font.lineHeight * scale,
			);

			tctx.globalCompositeOperation = "source-atop";
			tctx.fillRect(
				c.x,
				c.y,
				char.size * scale,
				Font.lineHeight * scale,
			);
		}

		ctx.drawImage(
			Buffer.Text,
			scaled.x,
			scaled.y,
			scaled.w,
			scaled.h,
		);

		tctx.fillStyle = Font.defaultColor.background;
		tctx.resetTransform();
		tctx.save();

		// Optional drop-shadow
		if (this.dropShadow) {
			const shadowOffset = scaled.dropShadowOffset;

			for (const c of scaled.chars) {
				char = Font.char[c.char];

				if (c.formatter) {
					switch (c.formatter) {
						case "c":
							// Colorize
							tctx.fillStyle = c.color.background;

							break;
						case "i":
							// Italic
							tctx.setTransform(1, 0, -0.25, 1, 0, 0);

							break;
						case "r":
							// Reset formatting
							tctx.restore();

							break;
					}

					continue;
				}

				tctx.fillRect(
					c.x,
					c.y,
					char.size * scale,
					Font.lineHeight * scale,
				);
			}

			ctx.drawImage(
				Buffer.Text,
				scaled.x + shadowOffset[0],
				scaled.y - shadowOffset[1],
				scaled.w,
				scaled.h,
			);
		}

		this.__draw(ctx);
	};
};