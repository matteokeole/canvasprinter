/**
 * Constructs a new Color object.
 * 
 * @constructor
 * @param	{number}	value	Color value (hexadecimal)
 * @returns	{Color}
 */
export function Color(value) {
	this.value = value;
	this.hex = `#${this.value.toString(16)}`;

	return this;
};