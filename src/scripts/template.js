/**
 * @fileoverview Template rendering functions for meme editor and template gallery.
 */

import { setupGeneratedDialogEvents, setupOpenEditMemeEvents } from "./eventListener";
import { getAll, loadGeneratedMemesFromIndexDb, STORES } from "./indexDb";
import { GENERATED_MEMES, imageArray, LOADED_GENERATED_FROM_INDEXED, setGeneratedLoadingState } from "./service";
import { getFileSrc } from "./utils";

/**
 * Returns the HTML markup for the meme editor toolbar.
 * Includes text add button, color pickers, export button, and close button.
 * @export
 * @returns {string} HTML string for the editor interface
 */
export function returnMemeEditor() {
  return `
        <div class="editor-toolbar">
    
          <button id="addTextBtn">
            Text hinzufügen
          </button>
    
          <input type="color" id="fillColor" value="#ffffff">
    
          <input type="color" id="strokeColor" value="#000000">
    
          <button id="exportBtn">
            Generate
          </button>
    
          <button id="close-dialog-btn" >
            X
          </button>
    
        </div>
    
        <canvas id="meme-editor" tabindex="1"></canvas>
      `
};

/**
 * Renders the gallery of generated memes to the template select container.
 * Displays all memes from GENERATED_MEMES array as images.
 * @export
 */
export async function renderGenerated() {
  const templateSelect = document.getElementById('templateSelect');
  templateSelect.innerHTML = '';
  if (!LOADED_GENERATED_FROM_INDEXED) {
    await loadGeneratedMemesFromIndexDb()
    setGeneratedLoadingState();
  }
  GENERATED_MEMES.forEach((meme, index) => {
    const imgSrc = URL.createObjectURL(meme.blob)
    templateSelect.innerHTML += `
    <button id="meme-${index}" class="create-meme-btn">
      <img class="template-meme" src="${imgSrc}" alt="">
    </button>
    `
  });
  
  setupGeneratedDialogEvents()
};


export function openGeneratedDialog(index) {
  const container = document.getElementById('dialog-container');
  container.classList.remove('d-none')
  const dialog = document.getElementById('generated-dialog');
  dialog.innerHTML = `
    <div>
    <img src="${URL.createObjectURL(GENERATED_MEMES[index].blob)}" alt="">
    </div>
  `
}


/**
 * Renders the meme template gallery to the template select container.
 * Creates clickable buttons for each template with preview images.
 * @export
 * @param {Array<Object>} fileList - Array of template file objects from imageArray
 */
export function renderTemplates(fileList, loadedFromIndexDB = false) {
  const templateSelect = document.getElementById('templateSelect');
  templateSelect.innerHTML = '';
  


  fileList.forEach((file) => {
    const srcUrl = getFileSrc(file, loadedFromIndexDB)
    templateSelect.innerHTML += `
  <button id="meme-${imageArray.indexOf(file)}" class="create-meme-btn">
    <img class="template-meme" src="${srcUrl}" alt="">    
  </button>
     
  `
  });
  setupOpenEditMemeEvents();

}