const ham_icon = document.querySelector("#ham-icon");
const x_icon = document.querySelector("#x-icon");
const lateralBar = document.querySelector("#lateralBar");
const BgBlack = document.querySelector("#BgBlack");
const containerTelas = document.querySelector("#containerTelas");
const containerContactanos = document.querySelector("#containerContactanos");
const containerContactanosLat = document.querySelector(
  "#containerContactanosLat"
);
const svgContactanos = document.querySelector("#svgContactanos");
const contactanosBtn = document.querySelector("#contactanosBtn");
const contactanosBtnLat = document.querySelector("#contactanosBtnLat");
const body = document.querySelector("body");
let listadoTelas = [];

function toggleLateral() {
  lateralBar.classList.toggle("-translate-x-[101%]");
  BgBlack.classList.toggle("hidden");
}

function toggleContact() {
  containerContactanos.classList.toggle("hidden");
  containerContactanos.classList.toggle("flex");
  contactanosBtn.classList.toggle("bg-secondary-gray");
  contactanosBtn.classList.toggle("text-white");
}

function toggleContactLat() {
  containerContactanosLat.classList.toggle("block");
  containerContactanosLat.classList.toggle("hidden");
  svgContactanos.classList.toggle("rotate-180");
  contactanosBtnLat.classList.toggle("bg-secondary-gray");
  contactanosBtnLat.classList.toggle("text-white");
}

function recargarVideos(numVideo) {
  const videoShow = document.getElementById(`videoShow${numVideo}`);
  const videoSource = document.getElementById(`videoSource${numVideo}`);
  const baseUrl = videoSource.src.split("?")[0];
  const newUrl = baseUrl + "?v=" + Date.now();
  videoSource.src = newUrl;
  videoShow.load();
}

async function mostrarTelas() {
  const telas = await getAllTelas();
  for (let i = 0; i < 7; i++) {
    const random = getRandom(0, telas.length - 1);
    const tela = telas[random];
    const a = document.createElement("a");
    a.classList.add("hover:scale-110", "duration-300");
    a.href = `/telas?id=${tela.id}&pag=home`;
    a.innerHTML = `<img class="h-48 w-48" src="../${tela.photo}" alt="" />
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

  let intentos = 0;
  const maxIntentos = (max - min + 1) * 2;

  let numeroAleatorio;
  let yaExiste;

  do {
    numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;

    yaExiste = listadoTelas.includes(numeroAleatorio);

    intentos++;

    if (intentos > maxIntentos) {
      console.warn(
        "No se pudo encontrar un número aleatorio único. Revisa el tamaño de tu array o el rango."
      );
      return null;
    }
  } while (yaExiste);

  listadoTelas.push(numeroAleatorio);
  return numeroAleatorio;
}

async function getAllTelas() {
  const consulta = await axios.get("/api/telas/getAll");
  return consulta.data;
}

document.addEventListener("DOMContentLoaded", async () => {
  mostrarTelas();
  recargarVideos(1);
  recargarVideos(2);
  recargarVideos(3);
});

ham_icon.addEventListener("click", toggleLateral);
x_icon.addEventListener("click", toggleLateral);
BgBlack.addEventListener("click", toggleLateral);
contactanosBtn.addEventListener("click", toggleContact);
contactanosBtnLat.addEventListener("click", toggleContactLat);
