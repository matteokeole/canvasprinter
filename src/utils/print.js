import {Font} from "../index.js";

export function print(ctx, pos, char, scale) {
	ctx.drawImage(
		Font.ascii,
		...char.uv,
		char.size,
		Font.lineHeight,
		...pos,
		char.size * scale,
		Font.lineHeight * scale,
	);
};