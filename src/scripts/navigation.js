export function navigate(elementId,styleClass,renderFunciton){
    const link = document.getElementById(elementId);
    const allLinks = document.querySelectorAll('.active');
    allLinks.forEach(e=>{
        e.classList.remove('active')
    })
    link.classList.add('active');
    return renderFunciton();
}