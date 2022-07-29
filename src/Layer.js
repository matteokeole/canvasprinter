import {SCREEN} from "./index.js";

export function Layer({
	name = "",
	background,
	smooth = true,
} = {}) {
	Object.assign(this, {name, background});

	this.width = SCREEN.WIDTH;
	this.height = SCREEN.HEIGHT;

	this.canvas = document.createElement("canvas");
	this.canvas.classList.add("layer");
	name && this.canvas.classList.add(name);
	this.canvas.width = SCREEN.MAX_WIDTH;
	this.canvas.height = SCREEN.MAX_HEIGHT;

	this.ctx = this.canvas.getContext("2d");
	this.ctx.imageSmoothingEnabled = smooth;

	this.components = new Set();
	this.resources = new Set();

	this.draws = 0;

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

	this.compute = () => {
		for (const component of this.components) {
			component.compute();
		}

		return this;
	};

	this.scale = () => {
		for (const component of this.components) {
			component.scale();
		}

		return this;
	};

	this.draw = async ({forceReload = false} = {}) => {
		this.canvas.style.background = `#${this.background.toString(16)}`;

		if (forceReload) await this.loadTextures();

		for (const component of this.components) {
			component.draw();
		}

		this.draws++;

		return this;
	};

	this.erase = () => {
		this.ctx.clearRect(0, 0, this.width, this.height);

		return this;
	};

	this.redraw = async ({forceReload = false} = {}) => this.erase().draw({forceReload});

	document.body.appendChild(this.canvas);

	return this;
};

const Visibilities = ["hidden", "visible"];