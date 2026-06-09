/**
 * @fileoverview Template rendering functions for meme editor and template gallery.
 */

import { GENERATED_MEMES, imageArray } from "./service";

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
            Export
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
export function renderGenerated() {
  const templateSelect = document.getElementById('templateSelect');
  templateSelect.innerHTML = ''
  GENERATED_MEMES.forEach((meme) => {
    const img = document.createElement('img')
    img.src = meme.file
    templateSelect.append(img)
  })  
};

/**
 * Renders the meme template gallery to the template select container.
 * Creates clickable buttons for each template with preview images.
 * @export
 * @param {Array<Object>} fileList - Array of template file objects from imageArray
 */
export function renderTemplates(fileList) {
  const templateSelect = document.getElementById('templateSelect');
  templateSelect.innerHTML = '';

  fileList.forEach((file) => {
    templateSelect.innerHTML += `
  <button id="meme-${imageArray.indexOf(file)}" class="create-meme-btn">
    <img class="template-meme" src="${imageArray[imageArray.indexOf(file)].publicUrl}" alt="">    
  </button>
     
  `
  });
}