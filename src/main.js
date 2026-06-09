/**
 * @fileoverview Main entry point for the Meme Generator application.
 * Initializes the application by loading templates and setting up navigation events.
 */

import './style.css';
import { loadTemplates } from './scripts/supabase.js';
import { setupNavigationEvents } from './scripts/eventListener.js';

document.querySelector('#app').innerHTML = `
<div id="card">
</div>
<div id="templateSelect"></div>

`;

/**
 * Closes the meme editor dialog by adding the 'd-none' class to hide it.
 */
function closeDialog() {
  const dialogContainer = document.getElementById('dialog-container')
  dialogContainer.classList.add("d-none");
};

/**
 * Initializes the meme generator application.
 * Loads meme templates from Supabase and sets up navigation event listeners.
 * @async
 */
async function init(){
  await loadTemplates();
  setupNavigationEvents();
};

init()
