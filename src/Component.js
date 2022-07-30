import {Color} from "./index.js";

/**
 * Constructs a new interface component.
 * 
 * @constructor
 * @param	{array}		origin			Origin sides
 * @param	{array}		offset			Origin margin
 * @param	{array}		[size=[]]		Size (omitted for Text components)
 * @param	{string}	[background]	Background color (hexadecimal)
 * @returns	{Component}
 */
export function Component({origin, offset, size = [], background}) {
	Object.assign(this, {origin, offset, size, background});

	this.background &&= new Color(this.background);

	this.__draw = ctx => {
		const c = this.scaled;

		if (this.background) {
			ctx.globalCompositeOperation = "destination-over";
			ctx.fillStyle = this.background.hex;
			ctx.fillRect(c.x, c.y, c.w, c.h);
		}
	};

	return this;
};