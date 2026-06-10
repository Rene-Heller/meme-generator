/**
 * @fileoverview Template rendering functions for meme editor and template gallery.
 */

import { setupGeneratedDialogEvents, setupOpenEditMemeEvents } from "./eventListener";
import { getAll, STORES } from "./indexDb";
import { GENERATED_MEMES, imageArray, LOADED_GENERATED_FROM_INDEXED, setGeneratedLoadingState } from "./service";

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
  console.log("hallo", GENERATED_MEMES, GENERATED_MEMES.length)
  if (!LOADED_GENERATED_FROM_INDEXED) {
    const memes = await getAll(STORES.MEMES)
    console.log(memes)
    if (Array.isArray(memes)) {

      memes.forEach(element => {
        GENERATED_MEMES.push(element)
      })
    };
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
  const buttons = document.querySelectorAll(".create-meme-btn");

  buttons.forEach((button, index) => {
    button.children[0].addEventListener("click", () => {
      openGeneratedDialog(index)
    });
    console.log(`added to index ${index}`)
    // const img = document.createElement('img')
    // img.src = meme.file
    // templateSelect.append(img)
  });

  setupGeneratedDialogEvents()
};


function openGeneratedDialog(index) {
  const container = document.getElementById('dialog-container');
  container.classList.remove('d-none')
  const dialog = document.getElementById('generated-dialog');
  dialog.innerHTML = `
    <div>
    <img src="${URL.createObjectURL(GENERATED_MEMES[index].blob)}" alt="">
    </div>
  `
}

// window.openGeneratedDialog = openGeneratedDialog


/**
 * Renders the meme template gallery to the template select container.
 * Creates clickable buttons for each template with preview images.
 * @export
 * @param {Array<Object>} fileList - Array of template file objects from imageArray
 */
export function renderTemplates(fileList, loadedFromIndexDB = false) {
  const templateSelect = document.getElementById('templateSelect');
  templateSelect.innerHTML = '';
  function getFileSrc(file, loadedFromIndexDB) {
    let src
    if (loadedFromIndexDB) {
      src = file.localUrl ? file.localUrl : URL.createObjectURL(file.blob)
    } else {
      src = file.localUrl ? file.localUrl : file.publicUrl
    }
    return src
  }


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