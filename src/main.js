import './style.css';
import { supabase } from './scripts/supabase.js';
import { renderGenerated, returnMemeEditor } from './scripts/template.js';
import { Canvas, FabricImage } from "fabric";
import { createImage, createCanvas, addText, exportMeme, bindColorInput } from './scripts/fabric.js'
import { navigate } from './scripts/navigation.js';

let generatedUrl;
let fabricCanvas;

const imageArray = [];

document.querySelector('#app').innerHTML = `
<div id="card">
</div>
<div id="templateSelect"></div>

`;


const templateSelect = document.getElementById('templateSelect');

async function openEdit(i) {

  const dialogContainer = document.getElementById('dialog-container')
  const dialog = document.getElementById("meme-edit-dialog");
  dialog.innerHTML = returnMemeEditor();
  setupDialogEvents();
  dialogContainer.classList.remove("d-none");


  const { img, imgWidth, imgHeight } = await createImage(i, imageArray);
  const canvasElement = document.getElementById("meme-editor");
  canvasElement.width = imgWidth;
  canvasElement.height = imgHeight;

  fabricCanvas = createCanvas(img, imgWidth, imgHeight);
  fabricCanvas.renderAll()

  setupEditorEvents();
};


function setupDialogEvents() {
  const btn = document.getElementById("close-dialog-btn");
  const dialogContainer = document.getElementById('dialog-container')


  btn.addEventListener("click", () => {
    dialogContainer.classList.add("d-none");
  },
    { once: true }
  );
};


function setupEditorEvents() {
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

function setupNavigationEvents() {
  const links = document.querySelectorAll('li')
  console.log(links)
  links.forEach((element) => {
    element.addEventListener('click', () => {
      const id = element.id
      if (id == "nav-edit") {
        navigate(id, 'active', loadTemplates),
          { once: true }
      }
      else {
        navigate(id, 'active', renderGenerated),
          { once: true }
      }
    })
  })
}

function closeDialog() {
  const dialogContainer = document.getElementById('dialog-container')
  dialogContainer.classList.add("d-none");
}

async function getImageFiles(files) {
  if (imageArray.length > 0) return imageArray

  files.map((file) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from('meme-templates').getPublicUrl(file.name);

    imageArray.push(
      {
        ...file,
        publicUrl,
      }
    )
  });

  for (const element of imageArray) {
    const response = await fetch(element.publicUrl);
    const blob = await response.blob();

    element.localUrl = URL.createObjectURL(blob);
  }

  console.log(imageArray)

  return imageArray
}

async function loadTemplates() {
  let images;
  if (imageArray.length === 0) {
    const { data: files, error } = await supabase.storage
      .from('meme-templates')
      .list();

    images = await getImageFiles(files);
    if (error) {
      console.error(error);
      return;
    }
  } else {
    images = imageArray
  }


  templateSelect.innerHTML = '';

  images.forEach((file) => {
    templateSelect.innerHTML += `
    <button id="meme-${imageArray.indexOf(file)}" class="create-meme-btn">
      <img class="template-meme" src="${imageArray[imageArray.indexOf(file)].publicUrl}" alt="">    
    </button>
       
    `
  });
  setupOpenMemeEvents();

}

function setupOpenMemeEvents() {
  const buttons = document.querySelectorAll(".create-meme-btn");

  buttons.forEach((button, index) => {
    console.log(index)
    button.children[0].addEventListener("click", () => {
      openEdit(index);
      { once: true }
    });
  });
}


loadTemplates();
setupNavigationEvents();

