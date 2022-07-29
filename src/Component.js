import {scale} from "./index.js";

export function Component({
	origin,
	offset,
	size = [],
	background,
} = {}) {
	Object.assign(this, {origin, offset, size});

	if (background) this.background = `#${background.toString(16)}`

	this.__compute = () => {
		let [ox, oy] = offset,
			[w, h] = this.size,
			[lw, lh] = [this.layer.width, this.layer.height],
			x = ox,
			y = oy;

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

		Object.assign(this, {x, y, ox, oy, w, h});
	};

	this.__draw = ctx => {
		const sc = this.scaled;

		if (this.background) {
			ctx.globalCompositeOperation = "destination-over";
			ctx.fillStyle = this.background;
			ctx.fillRect(sc.x, sc.y, sc.w, sc.h);
		}
	};
};