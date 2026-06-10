/**
 * @fileoverview Supabase integration for loading meme templates from cloud storage.
 */

import { createClient } from '@supabase/supabase-js';
import { FAVORITE_MEMES, imageArray } from './service';
import { renderFavTemplates, renderTemplates } from './template';
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
                .from("meme-templates")
                .list();
            images = await getImageFiles(imageArray, files, "meme-templates");
            if (error) {
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
async function getImageFiles(list, files, key) {
    if (list.length > 0) return list
    const store = key === 'meme-templates' ? STORES.TEMPLATES : STORES.FAV
    files.map((file) => {
        const { data: { publicUrl } } = supabase.storage.from(key).getPublicUrl(file.name);
        if (!file.name.includes('.emptyFolderPlaceholder')) {

            list.push(
                {
                    ...file,
                    publicUrl,
                }
            )
        }
    });
    for (const element of list) {
        const response = await fetch(element.publicUrl);
        const blob = await response.blob();
        element.localUrl = URL.createObjectURL(blob);
        await saveToIndexDb(store, {
            name: element.name,
            publicUrl: element.publicUrl,
            id: element.id,
            blob,

        });
    }
    return list
};


export async function uploadTemplate(file) {
    const extension = file.name.split('.').pop();
    const fileName = `${file.author}+${file.id}.${extension}`;

    const { data, error } = await supabase.storage
        .from('custom_memes')
        .upload(fileName, file.blob, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.blob.type
        });

    if (error) {
        return;
    }

}


export async function loadFavs() {
    let images;
    let loadFromIndexDB = false;

    if (FAVORITE_MEMES.length === 0) {
        const cachedTemplates = await getAll(STORES.FAV);
        if (cachedTemplates.length > 0) {
            loadFromIndexDB = true
            images = createLocalUrl(cachedTemplates, FAVORITE_MEMES)
        } else {
            const { data: files, error } = await supabase.storage
                .from("custom_memes")
                .list();
            images = await getImageFiles(FAVORITE_MEMES, files, "custom_memes");
            if (error) {
                return;
            }
        }
    } else {
        images = FAVORITE_MEMES
    }

    renderFavTemplates(images, loadFromIndexDB);
}