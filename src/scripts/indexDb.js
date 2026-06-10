/**
 * @fileoverview IndexedDB helper for Meme Generator
 */

import { GENERATED_MEMES } from "./service";

const DB_NAME = "meme-generator";
const DB_VERSION = 2;

const STORES = {
  MEMES: "memes",
  TEMPLATES: "templates",
};

/**
 * Opens the database and creates stores if necessary.
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORES.MEMES)) {
        db.createObjectStore(STORES.MEMES, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains(STORES.TEMPLATES)) {
        db.createObjectStore(STORES.TEMPLATES, {
          keyPath: "name",
        });
      }
    };
  });
}

/**
 * Saves any object to a store.
 */
export async function saveToIndexDb(storeName, data) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");

    transaction.objectStore(storeName).put(data);

    transaction.oncomplete = () => resolve(data);
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Gets a single object by key.
 */
export async function get(storeName, key) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");

    const request = transaction.objectStore(storeName).get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Gets all objects from a store.
 */
export async function getAll(storeName) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");

    const request = transaction.objectStore(storeName).getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Deletes an object by key.
 */
export async function remove(storeName, key) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");

    transaction.objectStore(storeName).delete(key);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Clears an entire store.
 */
export async function clear(storeName) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");

    transaction.objectStore(storeName).clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export async function loadGeneratedMemesFromIndexDb(){
  const memes = await getAll(STORES.MEMES)
    if (Array.isArray(memes)) {

      memes.forEach(element => {
        GENERATED_MEMES.push(element)
      })
    };
}

export { STORES };