import { Canvas, FabricImage, IText } from "fabric";
import {CustomMeme} from "./type"
import { fabricCanvas, GENERATED_MEMES, imageArray, setFabricCanvas } from "./service";
import { returnMemeEditor } from "./template";
import { setupDialogEvents, setupEditorEvents } from "./eventListener";


export async function openEdit(i) {

  const dialogContainer = document.getElementById('dialog-container')
  const dialog = document.getElementById("meme-edit-dialog");
  dialog.innerHTML = returnMemeEditor();
  setupDialogEvents();
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


export function exportMeme(fabricCanvas,callback) {

  const png = fabricCanvas.toDataURL({
    format: "png",
    quality: 1
  });

  const newMeme = new CustomMeme(png, import.meta.env.VITE_TEAM_NAME)
  GENERATED_MEMES.push(newMeme)
  console.log(GENERATED_MEMES)

  if(callback){
    callback()
  }

};


export function bindColorInput(fabricCanvas, elementId, property) {
  document.getElementById(elementId).addEventListener("input", (element) => {
    const active = fabricCanvas.getActiveObject();

    if (!active) return;

    active.set(property, element.target.value);

    fabricCanvas.renderAll();
  });
}