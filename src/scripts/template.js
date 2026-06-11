/**
 * @fileoverview Template rendering functions for meme editor and template gallery.
 */

import { handleDialogEventSetup, setupGeneratedDialogEvents, setupOpenEditMemeEvents } from "./eventListener";
import { getAll, loadGeneratedMemesFromIndexDb, STORES } from "./indexDb";
import { FAVORITE_MEMES, GENERATED_MEMES, imageArray, LIKES, LOADED_GENERATED_FROM_INDEXED, setGeneratedLoadingState } from "./service";
import { loadFavs, loadTemplates } from "./supabase";
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
export async function renderGenerated(List) {
  if (List === FAVORITE_MEMES) return loadFavs()
  const templateSelect = document.getElementById('templateSelect');
  templateSelect.innerHTML = '';
  if (Array.isArray(List)) {
    List.forEach((meme, index) => {
      const imgSrc = URL.createObjectURL(meme.blob)
      templateSelect.innerHTML += `
    <button id="meme-${index}" class="create-meme-btn">
      <img class="template-meme" src="${imgSrc}" alt="">
    </button>
    `
    });
  }

  setupGeneratedDialogEvents(List)
};

export function openGeneratedDialog(List, index, isFav) {
  const container = document.getElementById('dialog-container');
  container.classList.remove('d-none')
  const dialog = document.getElementById('generated-dialog');
  dialog.innerHTML = isFav ? returnFavMemeDialog(List, index) : returnGeneratedMemeDialog(List, index)
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


export function renderFavTemplates(fileList, loadedFromIndexDB = false) {
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

  setupGeneratedDialogEvents(fileList, true)
}


export function refreshHeartCounter() {
  const counter = document.getElementById('heart-count')
  counter.innerText = LIKES
  if (LIKES === 4) {
    counter.style.color = "red"
  } else {
    counter.style.color = "white"
  }
}

export function returnGeneratedMemeDialog(List, index) {
  return `
  <div id="generated-view">
    <img src="${URL.createObjectURL(List[index].blob)}" alt="">
    <div
        class="generated-dialog__navigation ${index === 0 ? 'justify-end' : index === List.length - 1 ? 'justify-start' : 'justify-between'}">
        <button onclick="changeMeme(${index - 1})" id="left-arrow"
            class="${index === 0 ? `d-none` : ''} generated-dialog__nav-btn generated-dialog__nav-btn--prev">
            <div></div>
        </button>
        <button id="like-${index}" onclick="handleLike(${index})" class="like-btn ${LIKES === 4 && !List[index].liked ? 'cursor-forbidden' : ''} ${List === FAVORITE_MEMES ? 'd-none' : ''}">
            <img id='like-icon' src="${List[index].liked ? 'src/assets/img/red-heart.png' : 'src/assets/img/empty-heart.png'}" alt="">
        </button>
        <button onclick="changeMeme(${index + 1})" id="right-arrow"
            class="${index === List.length - 1 ? `d-none` : ''} generated-dialog__nav-btn generated-dialog__nav-btn--next">
            <div></div>
        </button>
    </div>
</div>
  `
};


export function returnFavMemeDialog(List, index) {
  const team = List[index].name.split("+")[0]
  return `
  <div id="generated-view">
    <div class="team-name">${team}</div>
    <img src="${URL.createObjectURL(List[index].blob)}" alt="">
    <div
        class="generated-dialog__navigation ${index === 0 ? 'justify-end' : index === List.length - 1 ? 'justify-start' : 'justify-between'}">
        <button onclick="changeMeme(${index - 1},true)" id="left-arrow"
            class="${index === 0 ? `d-none` : ''} generated-dialog__nav-btn generated-dialog__nav-btn--prev">
            <div></div>
        </button>
        <button onclick="changeMeme(${index + 1},true)" id="right-arrow"
            class="${index === List.length - 1 ? `d-none` : ''} generated-dialog__nav-btn generated-dialog__nav-btn--next">
            <div></div>
        </button>
    </div>
</div>
  `
}
