const ham_icon = document.querySelector("#ham-icon");
const x_icon = document.querySelector("#x-icon");
const lateralBar = document.querySelector("#lateralBar");
const BgBlack = document.querySelector("#BgBlack");
const containerTelas = document.querySelector("#container-telas");

function toggleLateral() {
  lateralBar.classList.toggle("-translate-x-full");
  BgBlack.classList.toggle("hidden");
}

ham_icon.addEventListener("click", toggleLateral);
x_icon.addEventListener("click", toggleLateral);

document.addEventListener("DOMContentLoaded", () => {
  getAllTelas();
});

async function getAllTelas() {
  const consulta = await fetch("/catalogo.json");
  const listadoTelas = await consulta.json();
  const { telas } = listadoTelas;
  telas.forEach((tela) => {
    const { name, id, photo, Type, price } = tela;
    const a = document.createElement("a");
    a.classList.add("w-3/4", "flex", "flex-col", "m-4");
    a.href = `/telas?id=${id}`;
    a.innerHTML = `<img class="h-40 w-40 sm:h-44 sm:w-44" src="${photo}" alt="" />
          <span class="text-xl">${name}</span>
          <span>$${price} / kg</span>`;
    containerTelas.appendChild(a);
  });
}
