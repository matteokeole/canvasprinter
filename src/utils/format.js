import {Font} from "../index.js";

export function format() {
	const colors = Object.values(Font.color);
	let f, p, parsingFormatter, parsingColorPrefix, parsingColor;

	this.formatted = [];

	for (const c of this.raw) {
		// Search for formatting prefixes
		if (c.char === Font.formattingPrefix) {
			parsingFormatter = true;

			continue;
		}

		// Found a formatting prefix, identify formatter type
		if (parsingFormatter) {
			parsingFormatter = false;

			f = {formatter: c.char};

			if (c.char === "c" || c.char === "h") {
				parsingColorPrefix = true;

				continue;
			}

			this.formatted.push(f);

			continue;
		}

		// Found colorization/highlight formatter, search for color code prefix
		if (parsingColorPrefix) {
			parsingColorPrefix = false;

			if (c.char === Font.colorPrefix) {
				parsingColor = true;

				// Save the prefix in case the color is NaN
				p = c;

				continue;
			}
		}

		// Found color code, parse it and register the formatter if the color is valid
		if (parsingColor) {
			parsingColor = false;

			const color = parseInt(c.char, 16);

			if (isNaN(color)) this.formatted.push(p, c);
			else {
				f.color = colors.find(color => c.char === color.code);

				this.formatted.push(f);
			}

			p = null;

			continue;
		}

		this.formatted.push(c);
	}
};