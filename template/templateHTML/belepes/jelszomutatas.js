document.addEventListener("DOMContentLoaded", function () {
  let checkButton = document.getElementsByName("jelszomutatas");
  const jelszoInput = document.getElementsByName("jelszo_input");

  checkButton[0].addEventListener("change", function () {
    checkButton[0].checked
      ? jelszoInput[0].setAttribute("type", "text")
      : jelszoInput[0].setAttribute("type", "password");
  });
});
