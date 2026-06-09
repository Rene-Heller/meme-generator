import './style.css';
import { loadTemplates } from './scripts/supabase.js';
import { setupNavigationEvents } from './scripts/eventListener.js';

document.querySelector('#app').innerHTML = `
<div id="card">
</div>
<div id="templateSelect"></div>

`;

function closeDialog() {
  const dialogContainer = document.getElementById('dialog-container')
  dialogContainer.classList.add("d-none");
};

async function init(){
  await loadTemplates();
  setupNavigationEvents();
};

init()
