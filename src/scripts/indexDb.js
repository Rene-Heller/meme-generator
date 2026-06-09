const request = indexedDB.open("meme-generator", 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  if (!db.objectStoreNames.contains("memes")) {
    db.createObjectStore("memes", {
      keyPath: "id",
    });
  }
};

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