export function getFileSrc(file, loadedFromIndexDB) {
    let src
    if (loadedFromIndexDB) {
        src = file.localUrl ? file.localUrl : URL.createObjectURL(file.blob)
    } else {
        src = file.localUrl ? file.localUrl : file.publicUrl
    }
    return src
}
