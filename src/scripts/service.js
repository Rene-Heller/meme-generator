/**
 * @fileoverview Global state management for memes, canvas, and template images.
 */

/**
 * Array to store generated meme objects.
 * @type {Array<CustomMeme>}
 */
export const GENERATED_MEMES=[]

/**
 * Reference to the current Fabric.js canvas instance.
 * @type {Canvas|null}
 */
export let fabricCanvas;

/**
 * Array to store template image metadata.
 * Each object contains name, publicUrl, and localUrl properties.
 * @type {Array<Object>}
 */
export const imageArray = [];

/**
 * Sets the global Fabric canvas reference.
 * @export
 * @param {Canvas} canvas - The Fabric.js canvas instance
 */
export function setFabricCanvas(canvas) {
  fabricCanvas = canvas;
}