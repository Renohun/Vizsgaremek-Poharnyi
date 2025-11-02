const dropArea = document.getElementById("drop-area")
const inputFile = document.getElementById("input-file")
const ImgView = document.getElementById("img-view")

inputFile.addEventListener("change",uploadImage)



function uploadImage()
{
   let imgLink = URL.createObjectURL( inputFile.files[0]);
 
   ImgView.style.backgroundImage = `url(${imgLink})`;
    const kep = document.getElementById("iconkep")
    const szoveg = document.getElementById("szoveg")
    kep.setAttribute("hidden",'true')
    szoveg.setAttribute("hidden",'true')
   ImgView.style.border = "none"
}

dropArea.addEventListener("dragover",function(e)
{
    e.preventDefault();
})
dropArea.addEventListener("drop",function(e) 
{
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    uploadImage()
  
})
