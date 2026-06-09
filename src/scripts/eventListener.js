import { addText, bindColorInput, exportMeme, openEdit } from "./fabric";
import { navigate } from "./navigation";
import { fabricCanvas, imageArray } from "./service";
import { renderGenerated, renderTemplates } from "./template";

export function setupDialogEvents() {
  const btn = document.getElementById("close-dialog-btn");
  const dialogContainer = document.getElementById('dialog-container')


  btn.addEventListener("click", () => {
    dialogContainer.classList.add("d-none");
  },
    { once: true }
  );
};

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


export function setupOpenMemeEvents() {
  const buttons = document.querySelectorAll(".create-meme-btn");

  buttons.forEach((button, index) => {
    console.log(index)
    button.children[0].addEventListener("click", () => {
      openEdit(index);
      { once: true }
    });
  });
}


export function setupNavigationEvents() {
  const links = document.querySelectorAll('li')
  links.forEach((element) => {
    element.addEventListener('click', () => {
      const id = element.id
      if (id == "nav-edit") {
        navigate(id, 'active',()=> renderTemplates(imageArray)),
          { once: true }
      }
      else {
        navigate(id, 'active', renderGenerated),
          { once: true }
      }
    })
  })
}