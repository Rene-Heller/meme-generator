export function getFileSrc(file, loadedFromIndexDB) {
    let src
    if (loadedFromIndexDB) {
        src = file.localUrl ? file.localUrl : URL.createObjectURL(file.blob)
    } else {
        src = file.localUrl ? file.localUrl : file.publicUrl
    }
    return src
}


export function createLocalUrl(templates,ArrayToFill) {
    const images = templates;
    if (Array.isArray(images)) {

        images.forEach(element => {
            element.localUrl = URL.createObjectURL(element.blob)
            ArrayToFill.push(element)
        })
    }
    return images
}
