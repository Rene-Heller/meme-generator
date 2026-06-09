/**
 * @fileoverview IndexedDB operations for storing and retrieving meme data.
 */

const request = indexedDB.open("meme-generator", 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  if (!db.objectStoreNames.contains("memes")) {
    db.createObjectStore("memes", {
      keyPath: "id",
    });
  }
};

/**
 * Opens or creates the IndexedDB database for meme storage.
 * Creates the 'memes' object store if it doesn't exist.
 * @async
 * @returns {Promise<IDBDatabase>} The opened database instance
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("meme-generator", 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("memes")) {
        db.createObjectStore("memes", {
          keyPath: "id",
        });
      }
    };
  });
}

/**
 * Saves a meme object to IndexedDB.
 * @async
 * @param {Object} meme - The meme object to save
 * @param {string} meme.id - Unique identifier (UUID)
 * @param {boolean} meme.votingSelected - Whether the meme is selected for voting
 * @param {boolean} meme.uploaded - Whether the meme has been uploaded
 * @param {Blob} meme.imageBlob - The image blob data
 * @returns {Promise<void>}
 */
async function saveMeme(meme) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("memes", "readwrite");

    transaction.objectStore("memes").put(meme);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

await saveMeme({
  id: crypto.randomUUID(),
  votingSelected: false,
  uploaded: false,
  imageBlob: myBlob,
});






const cachedTemplates = await getTemplates();

if (cachedTemplates.length > 0) {
  console.log("Templates aus IndexedDB");

  imageArray.length = 0;

  cachedTemplates.forEach((template) => {
    imageArray.push({
      name: template.name,
      publicUrl: template.publicUrl,
      localUrl: URL.createObjectURL(template.blob),
    });
  });

  renderTemplates();
  return;
}