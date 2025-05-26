const ham_icon = document.querySelector("#ham-icon");
const x_icon = document.querySelector("#x-icon");
const lateralBar = document.querySelector("#lateralBar");
const BgBlack = document.querySelector("#BgBlack");

function toggleLateral() {
  lateralBar.classList.toggle("-translate-x-full");
  BgBlack.classList.toggle("hidden");
}

ham_icon.addEventListener("click", toggleLateral);
x_icon.addEventListener("click", toggleLateral);
