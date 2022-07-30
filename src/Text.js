import {Buffer} from "./Buffer.js";
import {Component} from "./Component.js";
import {Font, scale} from "./index.js";
import {format} from "./utils/format.js";
import {print} from "./utils/print.js";

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

		return this;
	};

	this.computeText = () => {
		const lines = this.text.split("\n").map(l => l.split("").map(char => ({char})));
		let maxWidth, maxHeight, width, x, y, bold = false;
		maxWidth = width = x = padding[3];
		maxHeight = y = padding[0];

		if (this.formatted.length) maxHeight = Font.lineHeight;

		this.chars = [];

		for (const c of this.formatted) {
			if (c.formatter) {
				if (c.formatter === "b") bold = true;
				if (c.formatter === "r") bold = false;

				this.chars.push(c);

				continue;
			}

			if (c.char === "\n") {
				x = padding[3];
				y += (Font.lineHeight + this.lineSpacing);

				if (width > maxWidth) maxWidth = width + padding[1];
				width = 0;

				continue;
			}

			let i = Font.char[c.char] ? c.char : undefined,
				w = Font.char[i].size + this.letterSpacing;

			i ?? (c.char = i);

			if (bold) w += 1;

			Object.assign(c, {x, y});

			width += w;
			x += w;

			this.chars.push(c);
		}

		if (width > maxWidth) maxWidth = width + padding[1];
		maxHeight += y + padding[2];

		this.size = [maxWidth, maxHeight];
		[this.w, this.h] = this.size;
	};

	this.scale = () => {
		let {offset, origin, w, h, chars, dropShadowOffset} = this;
		let [x, y] = offset;
		let [lw, lh] = [this.layer.width, this.layer.height];

		w *= scale;
		h *= scale;

		x *= scale;
		y *= scale;

		// Calculate position relative to the layer
		switch (origin[0]) {
			case "right":
				x = lw - w - x;
				break;
			case "center":
				x += (lw - w) / 2;
				break;
		}

		switch (origin[1]) {
			case "bottom":
				y = lh - h - y;
				break;
			case "center":
				y += (lh - h) / 2;
				break;
		}

		x = Math.floor(x);
		y = Math.floor(y);

		chars = structuredClone(chars);
		for (const c of chars) {
			c.x *= scale;
			c.y *= scale;
		}

		dropShadowOffset &&= dropShadowOffset.map(o => o * scale);

		this.scaled = {x, y, w, h, chars, dropShadowOffset};
	};

	this.draw = () => {
		let {scaled} = this,
			tctx, ctx, char, lfc,
			bold = false, colorize = false, underline = false,
			underlines = [], currentUnderline = null;

		// Configure the layer context
		ctx = this.layer.ctx;
		ctx.globalCompositeOperation = "destination-over";

		// Configure the text buffer
		Buffer.Text.width = scaled.w;
		Buffer.Text.height = scaled.h;

		tctx = Buffer.Text.ctx;
		tctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled;
		tctx.save();

		for (const c of scaled.chars) {
			char = Font.char[c.char];

			if (c.formatter) {
				switch (c.formatter) {
					case "b":
						// Bold
						bold = true;

						break;
					case "c":
						// Colorize
						colorize = true;
						tctx.fillStyle = c.color.foreground;

						break;
					case "i":
						// Italic
						tctx.setTransform(1, 0, -0.25, 1, 0, 0);

						break;
					case "r":
						// Reset formatting
						tctx.restore();
						bold &&= false;
						colorize &&= false;

						if (underline) {
							underline = false;

							underlines.push(currentUnderline);

							currentUnderline = null;
						}

						break;
					case "u":
						// Underline
						underline = true;

						break;
				}

				continue;
			}

			lfc = {...c, char};

			if (underline) {
				// Init
				if (!currentUnderline) currentUnderline = {
					x: c.x,
					y: c.y,
					l: 0,
				}

				if (currentUnderline) currentUnderline.l += char.size + this.letterSpacing;

				if (c.y !== currentUnderline.y) {
					underlines.push(currentUnderline);

					currentUnderline = {
						x: c.x,
						y: c.y,
						l: 0,
					};
				}
			}

			// Write text
			tctx.globalCompositeOperation = "source-over";
			print(tctx, [c.x, c.y], char, scale);
			bold && print(tctx, [c.x + scale, c.y], char, scale);

			// Colorize text
			if (colorize) {
				tctx.globalCompositeOperation = "source-atop";
				tctx.fillRect(
					c.x,
					c.y,
					char.size * scale + (bold ? scale : 0),
					Font.lineHeight * scale,
				);
			}
		}

		if (currentUnderline) {
			underlines.push(currentUnderline);

			currentUnderline = null;
		}

		for (const line of underlines) {
			tctx.globalCompositeOperation = "source-over";
			tctx.fillRect(
				line.x,
				line.y + (Font.lineHeight * scale) - scale,
				(line.l - this.letterSpacing) * scale,
				scale,
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
		bold = false;

		// Optional drop-shadow
		if (this.dropShadow) {
			const shadowOffset = scaled.dropShadowOffset;

			for (const c of scaled.chars) {
				char = Font.char[c.char];

				if (c.formatter) {
					switch (c.formatter) {
						case "b":
							// Bold
							bold = true;

							break;
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
							bold &&= false;

							break;
					}

					continue;
				}

				tctx.fillRect(
					c.x,
					c.y,
					char.size * scale + (bold ? scale : 0),
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