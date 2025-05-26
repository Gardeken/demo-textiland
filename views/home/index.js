const ham_icon = document.querySelector("#ham-icon");
const x_icon = document.querySelector("#x-icon");
const lateralBar = document.querySelector("#lateralBar");
const BgBlack = document.querySelector("#BgBlack");
const containerTelas = document.querySelector("#containerTelas");

function toggleLateral() {
  lateralBar.classList.toggle("-translate-x-full");
  BgBlack.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarTelas();
});

async function mostrarTelas() {
  const telas = await getAllTelas();
  for (let i = 0; i < 6; i++) {
    const tela = telas[i];
    const a = document.createElement("a");
    a.href = `/telas?id=${tela.id}&pag=home`;
    a.innerHTML = `<img class="h-48 w-48" src="${tela.photo}" alt="" />
            <div class="flex flex-col mt-2 ml-2">
              <span class="text-lg font-semibold">${tela.name}</span>
              <span>$${tela.price} / kg</span>
            </div>`;
    a.classList.add("shadow-2xl", "w-48", "h-48");
    containerTelas.appendChild(a);
  }
}

async function getAllTelas() {
  const consulta = await fetch("/catalogo.json");
  const listadoTelas = await consulta.json();
  const { telas } = listadoTelas;
  return telas;
}

ham_icon.addEventListener("click", toggleLateral);
x_icon.addEventListener("click", toggleLateral);
