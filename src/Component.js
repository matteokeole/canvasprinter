import {scale} from "./index.js";

export function Component({
	origin,
	offset,
	size = [],
} = {}) {
	Object.assign(this, {origin, offset, size});

	this.computeDefault = () => {
		let [ox, oy] = offset,
			[w, h] = this.size,
			[lw, lh] = [this.layer.width, this.layer.height],
			x = 0,
			y = 0;

		ox *= scale;
		oy *= scale;
		w *= scale;
		h *= scale;

		// Calculate position relative to the layer
		switch (origin[0]) {
			case "left":
				x = ox;
				break;
			case "right":
				x = lw - w - ox;
				break;
			case "center":
				x = (lw - w) / 2 + ox;
				break;
		}

		switch (origin[1]) {
			case "top":
				y = oy;
				break;
			case "bottom":
				y = lh - h - oy;
				break;
			case "center":
				y = (lh - h) / 2 + oy;
				break;
		}

		x = Math.floor(x);
		y = Math.floor(y);

		Object.assign(this, {x, y, ox, oy, w, h});
	};
};