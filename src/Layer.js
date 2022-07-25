import {SCREEN} from "./index.js";

export function Layer({
	background,
	smooth = true,
} = {}) {
	Object.assign(this, {name, background});

	this.width = SCREEN.WIDTH;
	this.height = SCREEN.HEIGHT;

	this.canvas = document.createElement("canvas");
	this.canvas.width = SCREEN.MAX_WIDTH;
	this.canvas.height = SCREEN.MAX_HEIGHT;

	this.ctx = this.canvas.getContext("2d");
	this.ctx.imageSmoothingEnabled = smooth;

	this.components = new Set();
	this.resources = new Set();

	this.resize = (force_compute = false) => {
		this.width = SCREEN.WIDTH;
		this.height = SCREEN.HEIGHT;
	};

	this.add = (...components) => {
		for (const component of components) {
			component.layer = this;

			this.components.add(component);
		}

		return this;
	};

	this.remove = (...components) => {
		for (const component of components) {
			component.layer = this;

			this.components.delete(component);
		}

		return this;
	};

	this.loadTextures = async () => {
		for (const component of this.components) {
			if (component.texture) {
				const image = new Image();

				image.src = component.texture;
				await image.decode();

				this.resources[component.texture] = image;
			}
		}
	};

	this.redraw = async ({
		forceCompute = false,
		forceReload = false,
	} = {}) => {
		this.canvas.style.background = `#${this.background.toString(16)}`;

		if (forceReload) await this.loadTextures();

		if (forceCompute) for (const component of this.components) {
			component.compute().draw();
		} else for (const component of this.components) {
			component.draw();
		}
	};

	document.body.appendChild(this.canvas);

	return this;
};

const Visibilities = ["hidden", "visible"];