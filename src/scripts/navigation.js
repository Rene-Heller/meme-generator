/**
 * @fileoverview Navigation functionality for switching between application views.
 */

import { FAVORITE_MEMES, GENERATED_MEMES } from "./service";
import { returnFavMemeDialog, returnGeneratedMemeDialog } from "./template";

/**
 * Navigates to a new view by updating active state and rendering content.
 * Removes active class from all links and applies it to the target link.
 * @export
 * @param {string} elementId - The HTML element ID to activate
 * @param {string} styleClass - The CSS class to apply for active state
 * @param {Function} renderFunciton - Callback function to render the new view
 * @returns {*} The result of the render function
 */
export function navigate(elementId, styleClass, renderFunciton) {
    const link = document.getElementById(elementId);
    const allLinks = document.querySelectorAll('.active');
    allLinks.forEach(e => {
        e.classList.remove('active')
    })
    link.classList.add('active');
    return renderFunciton();
}

function changeMeme(index, isFav = false) {

    const dialog = document.getElementById('generated-dialog');
    if (isFav) dialog.innerHTML = returnFavMemeDialog(FAVORITE_MEMES, index)
    else dialog.innerHTML = returnGeneratedMemeDialog(GENERATED_MEMES, index)
}

window.changeMeme = changeMeme