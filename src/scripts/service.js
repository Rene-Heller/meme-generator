/**
 * @fileoverview Global state management for memes, canvas, and template images.
 */

import { uploadTemplate } from "./supabase";
import { refreshHeartCounter } from "./template";

/**
 * Array to store generated meme objects.
 * @type {Array<CustomMeme>}
 */
export const GENERATED_MEMES = []
export const FAVORITE_MEMES = []
export let LOADED_GENERATED_FROM_INDEXED = false
export let LIKES = 0

/**
 * Reference to the current Fabric.js canvas instance.
 * @type {Canvas|null}
 */
export let fabricCanvas;

/**
 * Array to store template image metadata.
 * Each object contains name, publicUrl, and localUrl properties.
 * @type {Array<Object>}
 */
export const imageArray = [];

export let activeEditMeme

/**
 * Sets the global Fabric canvas reference.
 * @export
 * @param {Canvas} canvas - The Fabric.js canvas instance
 */
export function setFabricCanvas(canvas) {
  fabricCanvas = canvas;
}


export function setActiveEditMeme(name) {
  activeEditMeme = name;
}

export function setGeneratedLoadingState() {
  LOADED_GENERATED_FROM_INDEXED = true;
}

export function setLikes(number) {
  LIKES = number
}

export function handleLikeValue(liked) {
  if (liked && LIKES >= 4) {
    return
  } else if (liked && LIKES < 4) {
    LIKES++
  } else if (!liked) {
    LIKES--
  }
  refreshHeartCounter()
}

function uploadFavorites() {
  const uploaded = localStorage.getItem('uploaded');
  if (uploaded) return console.error("Upload-Limit exceeded")
  const favorites = GENERATED_MEMES.filter((element) => element.liked === true)
  favorites.forEach((e) => {
    uploadTemplate(e)
  })
  setTimeout(() => {
    localStorage.setItem('uploaded', true);
    const img = document.getElementById("upload-img");
    img.setAttribute('src', 'src/assets/img/red-heart.png')
    document.getElementById('upload-btn-text').innerText = 'Uploaded'
  }, 3000)

}
