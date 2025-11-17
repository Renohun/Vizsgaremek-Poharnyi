//Az input mező különböző elemei
const dropArea = document.getElementById("drop-area")
const inputFile = document.getElementById("input-file")
const ImgView = document.getElementById("img-view")
let imgLink;//a feltöltött kép linkjének létrehozott változó
//listener, ami az inputban található fájl változása esetén meghívja az uploadImage functiont.
inputFile.addEventListener("change",uploadImage)


//function ami beállítja az input mező hátterének a feltöltött képet
function uploadImage()
{
imgLink = URL.createObjectURL( inputFile.files[0]);//az objectet elérési útvonallá  alakítjuk
    ImgView.style.backgroundImage = `url(${imgLink})`;//beállítjuk a képet háttérnek, majd formázzuk
    ImgView.textContent = "";
    ImgView.style.border = "none"
    console.log(imgLink)
}

//drag and drop funció
dropArea.addEventListener("dragover",function(e)
{
   e.preventDefault();//kikapcsolja az eredeti videlkedését a célpontnak(jelen esetben a DropArea)
})
dropArea.addEventListener("drop",function(e)
{
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;//beállítja az input-nak azt a fájlt amit a dropArea-ra ejtettünk
    uploadImage()
  
})
//?improvemet: fájltípus ellenőrzés(nem tud mindent megjeleniteni)|| Csak bizonyos fáljtípusokat fogad el, a többinél hibát ad vissza ("fájltípus nem támogatott")