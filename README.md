```app.html
<button onclick="uploadFavorites()" id="upload-btn">
    <img src="src/assets/img/upload.png" alt="">
    <p>Upload</p>
</div>
</button>
```

---

```service.js
function uploadFavorites(){
  const uploaded = localStorage.getItem('uploaded');
  if(uploaded) return console.error("Upload-Limit exceeded")
  const favorites = GENERATED_MEMES.filter((element)=>element.liked===true)
  favorites.forEach((e)=>{
    uploadTemplate(e)
  })
  localStorage.setItem('uploaded',true)
  
}

window.uploadFavorites = uploadFavorites
```

---

- nav einblenden
