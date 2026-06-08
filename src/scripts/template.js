import { GENERATED_MEMES } from "./service";

export function returnMemeEditor(){
    return`
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
}


export function renderGenerated(){
const templateSelect = document.getElementById('templateSelect');
templateSelect.innerHTML=''
GENERATED_MEMES.forEach((meme)=>{
  const img = document.createElement('img')
  img.src = meme.file
  templateSelect.append(img)
})


}