document.addEventListener("DOMContentLoaded",()=>{

    var coll = document.getElementsByClassName("TovGomb");
    var i;    


    
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.add("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
 
}
})