const dropArea = document.getElementById("drop-area")
const inputFile = document.getElementById("input-file")
const ImgView = document.getElementById("img-view")

inputFile.addEventListener("change",uploadImage)



function uploadImage()
{
   let imgLink = URL.createObjectURL( inputFile.files[0]);
   ImgView.style.backgroundImage = `url(${imgLink})`;
   ImgView.textContent = "";
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
