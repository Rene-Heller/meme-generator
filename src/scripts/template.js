/**
 * @fileoverview Template rendering functions for meme editor and template gallery.
 */

import { handleDialogEventSetup, setupGeneratedDialogEvents, setupOpenEditMemeEvents } from "./eventListener";
import { getAll, loadGeneratedMemesFromIndexDb, STORES } from "./indexDb";
import { GENERATED_MEMES, imageArray, LIKES, LOADED_GENERATED_FROM_INDEXED, setGeneratedLoadingState } from "./service";
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
  dialog.innerHTML = returnGeneratedMemeDialog(index)
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
  document.removeEventListener('click', handleDialogEventSetup)

}


export function refreshHeartCounter() {
  const counter = document.getElementById('heart-count')
  counter.innerText = LIKES
  if (LIKES === 2) {
    counter.style.color = "red"
  } else {
    counter.style.color = "white"
  }
}

export function returnGeneratedMemeDialog(index){
  return `
  <div id="generated-view">
    <img src="${URL.createObjectURL(GENERATED_MEMES[index].blob)}" alt="">
    <div
        class="generated-dialog__navigation ${index === 0 ? 'justify-end' : index === GENERATED_MEMES.length - 1 ? 'justify-start' : 'justify-between'}">
        <button onclick="changeMeme(${index - 1})" id="left-arrow"
            class="${index === 0 ? `d-none` : ''} generated-dialog__nav-btn generated-dialog__nav-btn--prev">
            <div></div>
        </button>
        <button id="like-${index}" onclick="handleLike(${index})" class="like-btn ${LIKES === 2 && !GENERATED_MEMES[index].liked ? 'cursor-forbidden' : ''}">
            <img id='like-icon' src="${GENERATED_MEMES[index].liked ? 'src/assets/img/red-heart.png' : 'src/assets/img/empty-heart.png'}" alt="">
        </button>
        <button onclick="changeMeme(${index + 1})" id="right-arrow"
            class="${index === GENERATED_MEMES.length - 1 ? `d-none` : ''} generated-dialog__nav-btn generated-dialog__nav-btn--next">
            <div></div>
        </button>
    </div>
</div>
  `
}