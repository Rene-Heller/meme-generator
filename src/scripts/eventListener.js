/**
 * @fileoverview Event listener setup functions for dialog, editor, and navigation interactions.
 */

import { addText, bindColorInput, exportMeme, openEdit } from "./fabric";
import { patchMeme, remove, STORES } from "./indexDb";
import { navigate } from "./navigation";
import { fabricCanvas, GENERATED_MEMES, imageArray, LIKES, handleLikeValue, FAVORITE_MEMES } from "./service";
import { openGeneratedDialog, renderGenerated, renderTemplates } from "./template";

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
    document.getElementById('meme-edit-dialog').innerHTML = ''
  },
    { once: true }
  );
};

export const handleDialogEventSetup = (event) => {
  const container = document.getElementById('dialog-container');
  const dialog = document.getElementById('generated-dialog');
  if (event.target === container) {
    dialog.innerHTML = "";
    container.classList.add('d-none');
  }
}

export function setupGeneratedDialogEvents(List, isFav = false) {
  const buttons = document.querySelectorAll(".create-meme-btn");
  const container = document.getElementById('dialog-container');

  buttons.forEach((button, index) => {
    button.children[0].addEventListener("click", () => {
      openGeneratedDialog(List, index, isFav)
    });
  });
  container.addEventListener('click', handleDialogEventSetup)
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
        document.getElementById('dialog-container').removeEventListener('click', handleDialogEventSetup)
        navigate(id, 'active', () => renderTemplates(imageArray, setupOpenEditMemeEvents))
      }
      else if (id == "nav-generated") {
        navigate(id, 'active', () => renderGenerated(GENERATED_MEMES))
      }
      else if (id == "nav-favorites") {
        navigate(id, 'active', () => renderGenerated(FAVORITE_MEMES))
      }
    })
  })

  function handleLike(index) {
    const img = document.getElementById('like-icon')
    if (GENERATED_MEMES[index].liked) {
      GENERATED_MEMES[index].liked = false;
      patchMeme(img, GENERATED_MEMES[index].liked, index)

    }
    else if (!GENERATED_MEMES[index].liked) {
      if (LIKES === 4) return
      GENERATED_MEMES[index].liked = true;
      patchMeme(img, GENERATED_MEMES[index].liked, index)
    }
  }

  window.handleLike = handleLike
}
