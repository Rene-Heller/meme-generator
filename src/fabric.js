import { Canvas, FabricImage, IText } from "fabric";

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
  
  // Set focus to canvas for keyboard input
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

  const img = document.createElement("img");

  img.src = png;

  document.body.appendChild(img);
  if(callback){
    callback()
  }
//   const a = document.createElement("a");

  // a.href = png;
  // a.download = "meme.png";

//   a.click();
};


export function bindColorInput(fabricCanvas, elementId, property) {
  document.getElementById(elementId).addEventListener("input", (element) => {
    const active = fabricCanvas.getActiveObject();

    if (!active) return;

    active.set(property, element.target.value);

    fabricCanvas.renderAll();
  });
}