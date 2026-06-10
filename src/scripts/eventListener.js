/**
 * @fileoverview Event listener setup functions for dialog, editor, and navigation interactions.
 */

import { addText, bindColorInput, exportMeme, openEdit } from "./fabric";
import { navigate } from "./navigation";
import { fabricCanvas, imageArray } from "./service";
import { renderGenerated, renderTemplates } from "./template";

/**
 * Sets up event listeners for the dialog close button.
 * Closes the dialog and removes event listeners on click.
 * @export
 */
export function setupEditDialogEvents() {
  const btn = document.getElementById("close-dialog-btn");
  const dialogContainer = document.getElementById('dialog-container')


  btn.addEventListener("click", () => {
    dialogContainer.classList.add("d-none");
  },
    { once: true }
  );
};

export function setupGeneratedDialogEvents() {
    const container = document.getElementById('dialog-container');
    const dialog = document.getElementById('generated-dialog');
    container.addEventListener('click', (ev) => {
      if (ev.target === container) {
        dialog.innerHTML = "";
        container.classList.add('d-none');
      }
    })
};

/**
 * Sets up event listeners for the meme editor toolbar buttons and color inputs.
 * Includes: add text, export meme, and color pickers for fill and stroke.
 * @export
 */
export function setupEditorEvents() {
  document
    .getElementById("addTextBtn")
    .addEventListener("click", () => {
      addText(fabricCanvas)
    }
    );

  document
    .getElementById("exportBtn")
    .addEventListener("click", () => {
      exportMeme(fabricCanvas, () => {
        document.getElementById("close-dialog-btn").click()
      })
    }
    );

  bindColorInput(fabricCanvas, "fillColor", "fill");
  bindColorInput(fabricCanvas, "strokeColor", "stroke");

};

/**
 * Sets up event listeners for meme template buttons.
 * Opens the editor when a template image is clicked.
 * @export
 */
export function setupOpenEditMemeEvents() {
  const buttons = document.querySelectorAll(".create-meme-btn");

  buttons.forEach((button, index) => {
    button.children[0].addEventListener("click", () => {
      openEdit(index);
      { once: true }
    });
  });
}


/**
 * Sets up event listeners for navigation menu items.
 * Handles navigation between different sections (edit/generated) with active state styling.
 * @export
 */
export function setupNavigationEvents() {
  const links = document.querySelectorAll('li')
  links.forEach((element) => {
    element.addEventListener('click', () => {
      const id = element.id
      if (id == "nav-edit") {
        navigate(id, 'active',()=> renderTemplates(imageArray,setupOpenEditMemeEvents)),
          { once: true }
      }
      else {
        navigate(id, 'active', ()=> renderGenerated()),
          { once: true }
      }
    })
  })
}