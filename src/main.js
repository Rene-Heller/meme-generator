import './style.css';
// import javascriptLogo from './assets/javascript.svg';
// import viteLogo from './assets/vite.svg';
// import heroImg from './assets/hero.png';
import { supabase } from './supabase.js';
import { returnMemeEditor } from './template.js';
import { Canvas, FabricImage, Textbox } from "fabric";
import { createImage, createCanvas, addText, exportMeme, bindColorInput } from './fabric.js'


const imageArray = [
  "src/assets/BadLuckBrian.png",
  "src/assets/UnsettledTom.png",
  "src/assets/spongebobrainbow.png",
  "src/assets/SpongebobBurningPaper.png",
  "src/assets/Whowantstobeamillionaire.png",
  "src/assets/GooseChase.png"
];

document.querySelector('#app').innerHTML = `
<div id="card">
</div>
<div id="templateSelect"></div>
<div id="dialog-container">
  
  <dialog id="meme-edit-dialog">
  
  </dialog>
</div>
`;


let generatedUrl;
let fabricCanvas;
const templateSelect = document.getElementById('templateSelect');

async function openEdit(i) {

  const dialog = document.getElementById("meme-edit-dialog");
  dialog.innerHTML = returnMemeEditor();
  setupDialogEvents();
  dialog.showModal();

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
      exportMeme(fabricCanvas)
    }
  );

  bindColorInput("fillColor", "fill");
  bindColorInput("strokeColor", "stroke");

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
  return imageArray
}

async function loadTemplates() {
  // const { data: files, error } = await supabase.storage
  //   .from('meme-templates')
  //   .list();

  const images = imageArray;
  // const images = await getImageFiles(files);


  // if (error) {
  //   console.error(error);
  //   return;
  // }

  images.forEach((file) => {
    //   const option = document.createElement('img');
    //   option.loading = "lazy";
    //   option.src = file.publicUrl;
    //   console.log(file.filename, 'filename');
    //   option.textContent = file.name;
    // ${file.filename}
    templateSelect.innerHTML += `
    <button id="meme-${imageArray.indexOf(file)}" class="create-meme-btn">
      <img class="template-meme" src="${imageArray[imageArray.indexOf(file)]}" alt="">    
    </button>
       
    `
  });
}

function setupOpenMemeEvents() {
  const buttons = document.querySelectorAll(".create-meme-btn");

  buttons.forEach((button, index) => {
    button.children[0].addEventListener("click", () => {
      openEdit(index);
    });
  });
}


loadTemplates();
setupOpenMemeEvents()
