import './style.css';
import { supabase } from './scripts/supabase.js';
import { returnMemeEditor } from './scripts/template.js';
import { Canvas, FabricImage } from "fabric";
import { createImage, createCanvas, addText, exportMeme, bindColorInput } from './scripts/fabric.js'

let generatedUrl;
let fabricCanvas;

const imageArray = [];

document.querySelector('#app').innerHTML = `
<div id="card">
</div>
<div id="templateSelect"></div>
<div id="dialog-container">
  
  <div class="d-none" id="meme-edit-dialog">
  
  </div>
</div>
`;


const templateSelect = document.getElementById('templateSelect');

async function openEdit(i) {
  
  const dialog = document.getElementById("meme-edit-dialog");
  dialog.innerHTML = returnMemeEditor();
  setupDialogEvents();
  dialog.classList.remove("d-none");

  
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
  const dialog = document.getElementById("meme-edit-dialog");

  btn.addEventListener("click", () => {
    dialog.close()
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
      exportMeme(fabricCanvas,()=>{
        document.getElementById("close-dialog-btn").click()
      })
    }
  );

  bindColorInput(fabricCanvas, "fillColor", "fill");
  bindColorInput(fabricCanvas, "strokeColor", "stroke");

};

function closeDialog() {
  const dialog = document.getElementById("meme-edit-dialog");
  dialog.close()
}

async function getImageFiles(files) {

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
  const { data: files, error } = await supabase.storage
    .from('meme-templates')
    .list();

  // const images = imageArray;
  const images = await getImageFiles(files);


  if (error) {
    console.error(error);
    return;
  }

  images.forEach((file) => {
    //   const option = document.createElement('img');
    //   option.loading = "lazy";
    //   option.src = file.publicUrl;
    //   console.log(file.filename, 'filename');
    //   option.textContent = file.name;
    // ${file.filename}
    templateSelect.innerHTML += `
    <button id="meme-${imageArray.indexOf(file)}" class="create-meme-btn">
      <img class="template-meme" src="${imageArray[imageArray.indexOf(file)].publicUrl}" alt="">    
    </button>
       
    `
  });
  setupOpenMemeEvents()
}

function setupOpenMemeEvents() {
  const buttons = document.querySelectorAll(".create-meme-btn");

  buttons.forEach((button, index) => {
    console.log(index)
    button.children[0].addEventListener("click", () => {
      openEdit(index);
    });
  });
}


loadTemplates();

