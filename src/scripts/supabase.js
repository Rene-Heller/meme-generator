/**
 * @fileoverview Supabase integration for loading meme templates from cloud storage.
 */

import { createClient } from '@supabase/supabase-js';
import { imageArray } from './service';
import { renderTemplates } from './template';
import { setupOpenEditMemeEvents } from './eventListener';
import { getAll, saveToIndexDb, STORES } from './indexDb';
import { createLocalUrl } from './utils';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabase client instance for cloud storage operations.
 * @type {SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Loads meme templates from Supabase storage.
 * Fetches from cache if available, otherwise downloads from cloud.
 * Renders templates and sets up event listeners.
 * @async
 * @export
 */
export async function loadTemplates() {
    let images;
    let loadFromIndexDB = false;

    if (imageArray.length === 0) {
        const cachedTemplates = await getAll(STORES.TEMPLATES);
        const generatedTemplates = await getAll(STORES.MEMES)

        if (cachedTemplates.length > 0) {
            loadFromIndexDB = true
            images = createLocalUrl(cachedTemplates, imageArray)
        } else {
            const { data: files, error } = await supabase.storage
                .from('meme-templates')
                .list();

            images = await getImageFiles(files);
            if (error) {
                console.error(error);
                return;
            }
        }
    } else {
        images = imageArray
    }

    renderTemplates(images, loadFromIndexDB);

}

/**
 * Retrieves image files from Supabase storage and creates local object URLs.
 * Fetches public URLs and downloads blobs for offline access.
 * @async
 * @param {Array<Object>} files - Array of file objects from Supabase storage
 * @returns {Promise<Array<Object>>} Array of image objects with metadata and local URLs
 */
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

        await saveToIndexDb(STORES.TEMPLATES, {
            name: element.name,
            publicUrl: element.publicUrl,
            blob,
        });
        element.localUrl = URL.createObjectURL(blob);
    }

    return imageArray
}
