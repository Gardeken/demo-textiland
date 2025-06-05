const ham_icon = document.querySelector("#ham-icon");
const x_icon = document.querySelector("#x-icon");
const lateralBar = document.querySelector("#lateralBar");
const BgBlack = document.querySelector("#BgBlack");
const containerTelas = document.querySelector("#containerTelas");
let listadoTelas = [];

function toggleLateral() {
  lateralBar.classList.toggle("-translate-x-full");
  BgBlack.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarTelas();
});

async function mostrarTelas() {
  const telas = await getAllTelas();
  for (let i = 0; i < 7; i++) {
    const random = getRandom(0, telas.length - 1);
    const tela = telas[random];
    const a = document.createElement("a");
    a.classList.add("hover:scale-110", "duration-300");
    a.href = `/telas?id=${tela.id}&pag=home`;
    a.innerHTML = `<img class="h-48 w-48" src="../src/${tela.photo}" alt="" />
            <div class="flex flex-col mt-2 ml-2">
              <span class="text-lg font-semibold">${tela.name}</span>
            </div>`;
    a.classList.add("shadow-2xl", "w-48", "h-48");
    containerTelas.appendChild(a);
  }
}

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let random = Math.floor(Math.random() * (max - min + 1)) + min;
  let validar = listadoTelas.includes(random);
  while (validar) {
    random = Math.floor(Math.random() * (max - min + 1)) + min;
    validar = listadoTelas.includes(random);
  }
  listadoTelas.push(random);
  return random;
}

async function getAllTelas() {
  const consulta = await axios.get("/api/telas/getAll");
  return consulta.data;
}

ham_icon.addEventListener("click", toggleLateral);
x_icon.addEventListener("click", toggleLateral);
