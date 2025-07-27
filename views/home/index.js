const ham_icon = document.querySelector("#ham-icon");
const x_icon = document.querySelector("#x-icon");
const lateralBar = document.querySelector("#lateralBar");
const BgBlack = document.querySelector("#BgBlack");
const containerTelas = document.querySelector("#containerTelas");
const containerContactanos = document.querySelector("#containerContactanos");
const contactanosBtn = document.querySelector("#contactanosBtn");
const body = document.querySelector("body");

function toggleLateral() {
  lateralBar.classList.toggle("-translate-x-[101%]");
  BgBlack.classList.toggle("hidden");
}

function toggleContact() {
  containerContactanos.classList.toggle("hidden");
  containerContactanos.classList.toggle("flex");
  contactanosBtn.classList.toggle("bg-black");
  contactanosBtn.classList.toggle("text-white");
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
    const tela = telas[i];
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
  let listadoTelas = [];
  min = Math.ceil(min);
  max = Math.floor(max);
  let attempts = 0;
  const maxAttempts = (max - min + 1) * 2;
  let random = Math.floor(Math.random() * (max - min + 1)) + min;
  let validar = listadoTelas.includes(random);
  while (validar) {
    random = Math.floor(Math.random() * (max - min + 1)) + min;
    validar = listadoTelas.includes(random);
    random = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts++;
    if (attempts > maxAttempts) {
      console.warn(
        "Could not find a unique random number after many attempts. Check your logic or array size."
      );
      break;
    }
  }
  listadoTelas.push(random);
  return random;
}

async function getAllTelas() {
  const consulta = await axios.get("/api/telas/getAll");
  return consulta.data;
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarTelas();
  recargarVideos(1);
  recargarVideos(2);
});

ham_icon.addEventListener("click", toggleLateral);
x_icon.addEventListener("click", toggleLateral);
BgBlack.addEventListener("click", toggleLateral);
contactanosBtn.addEventListener("click", toggleContact);
