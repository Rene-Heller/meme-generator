/**
 * @fileoverview Fabric.js canvas manipulation and meme editing functionality.
 */

import { Canvas, FabricImage, IText } from "fabric";
import {CustomMeme} from "./type"
import { activeEditMeme, fabricCanvas, GENERATED_MEMES, imageArray, setActiveEditMeme, setFabricCanvas } from "./service";
import { returnMemeEditor } from "./template";
import { setupEditDialogEvents, setupEditorEvents } from "./eventListener";
import { saveToIndexDb, STORES } from "./indexDb";

/**
 * Opens the meme editor dialog for the template at the given index.
 * Creates a canvas with the template image and sets up editor controls.
 * @async
 * @export
 * @param {number} i - Index of the template image in imageArray
 */
export async function openEdit(i) {
  setActiveEditMeme(imageArray[i].name)
  const dialogContainer = document.getElementById('dialog-container')
  const dialog = document.getElementById("meme-edit-dialog");
  dialog.innerHTML = returnMemeEditor();
  setupEditDialogEvents();
  dialogContainer.classList.remove("d-none");


  const { img, imgWidth, imgHeight } = await createImage(i, imageArray);
  const canvasElement = document.getElementById("meme-editor");
  canvasElement.width = imgWidth;
  canvasElement.height = imgHeight;

  const canvas = createCanvas(img, imgWidth, imgHeight);
  setFabricCanvas(canvas)
  fabricCanvas.renderAll()

  setupEditorEvents();
};

/**
 * Creates a Fabric.js image object from a URL with centered positioning.
 * @async
 * @export
 * @param {number} i - Index of the image in imgArray
 * @param {Array} imgArray - Array of image objects with localUrl property
 * @returns {Promise<{img: FabricImage, imgWidth: number, imgHeight: number}>} Image object and dimensions
 */
export async function createImage(i,imgArray) {
  const img = await FabricImage.fromURL(imgArray[i].localUrl);
  const imgWidth = img.width;
  const imgHeight = img.height;

  img.set({
    left: imgWidth / 2,
    top: imgHeight / 2,
    originX: 'center',
    originY: 'center',
    scaleX: 1,
    scaleY: 1,
    selectable: false,
    evented: false
  });
  return { img, imgWidth, imgHeight }
};

/**
 * Creates a new Fabric.js canvas with the specified dimensions.
 * Adds the image to the canvas and sends it to the back.
 * @export
 * @param {FabricImage} img - The Fabric image object to add to canvas
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 * @returns {Canvas} The configured Fabric.js canvas instance
 */
export function createCanvas(img, width, height) {
  const canvasElement = document.getElementById("meme-editor");
  canvasElement.width = width;
  canvasElement.height = height;
  
  const fabricCanvas = new Canvas(canvasElement, {
    preserveObjectStacking: true,
    enableRetinaScaling: false
  });

  fabricCanvas.add(img);
  fabricCanvas.sendObjectToBack(img);
  
  return fabricCanvas;
};

/**
 * Adds a new text object to the Fabric canvas with default meme styling.
 * Creates Impact font text with white fill and black stroke.
 * @export
 * @param {Canvas} fabricCanvas - The Fabric.js canvas instance
 */
export function addText(fabricCanvas) {

  const text = new IText("MEME TEXT", {

    left: 100,
    top: 100,
    fontSize: 48,
    fontFamily: "Impact",
    fill: "#ffffff",
    stroke: "#000000",
    strokeWidth: 3,
    textAlign: "center"

  });

  fabricCanvas.add(text);
  fabricCanvas.setActiveObject(text);
  fabricCanvas.renderAll();
  
  const canvasElement = document.getElementById("meme-editor");
  if (canvasElement) {
    canvasElement.focus();
  }
};

/**
 * Exports the meme canvas as a PNG image and saves it to GENERATED_MEMES.
 * @export
 * @param {Canvas} fabricCanvas - The Fabric.js canvas to export
 * @param {Function} [callback] - Optional callback function to execute after export
 */
export async function exportMeme(fabricCanvas,callback) {

  const pngDataUrl  = fabricCanvas.toDataURL({
    format: "png",
    quality: 1
  });
  const blob = await (await fetch(pngDataUrl)).blob();
  const teamName = import.meta.env.VITE_TEAM_NAME
  const newMeme = new CustomMeme(blob,activeEditMeme,teamName )
  GENERATED_MEMES.push(newMeme)
  saveToIndexDb(STORES.MEMES, newMeme)
  
  if(callback){
    callback()
  }
  document.getElementById('meme-edit-dialog').innerHTML=''
  
};

/**
 * Binds a color input element to update the active canvas object's color property.
 * Updates either fill or stroke color based on the property parameter.
 * @export
 * @param {Canvas} fabricCanvas - The Fabric.js canvas instance
 * @param {string} elementId - The HTML element ID of the color input
 * @param {string} property - The property to update ('fill' or 'stroke')
 */
export function bindColorInput(fabricCanvas, elementId, property) {
  document.getElementById(elementId).addEventListener("input", (element) => {
    const active = fabricCanvas.getActiveObject();

    if (!active) return;

    active.set(property, element.target.value);

    fabricCanvas.renderAll();
  });
}