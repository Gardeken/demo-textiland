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

function toggleTypes(Btn, containerId) {
  containerId.classList.toggle("hidden");
  containerId.classList.toggle("flex");
  Btn.classList.toggle("bg-secondary-gray");
  Btn.classList.toggle("text-white");
}

function toggleContactLat() {
  containerContactanosLat.classList.toggle("block");
  containerContactanosLat.classList.toggle("hidden");
  svgContactanos.classList.toggle("rotate-180");
  contactanosBtnLat.classList.toggle("bg-secondary-gray");
  contactanosBtnLat.classList.toggle("text-white");
}

async function eventoNavType() {
  const navBar = document.querySelector("#navBar");
  navBar.addEventListener("click", async (e) => {
    if (e.target.closest(".tipoTela")) {
      const id = e.target.closest(".tipoTela").id;
      const name = e.target.closest(".tipoTela").getAttribute("name");
      const container = e.target.closest(".tipoTela");
      if (container.classList.contains("containerTelas")) {
        const Btn = container.querySelector("span");
        const containerId = container.querySelector("div");
        toggleTypes(container, containerId);
      } else {
        const div = document.createElement("div");
        div.classList.add(
          "absolute",
          "flex",
          "flex-col",
          "bg-primary-gray-500",
          "gap-4",
          "p-4",
          "w-60",
          "top-16"
        );
        container.appendChild(div);
        container.classList.add("bg-secondary-gray");
        container.classList.add("text-white");
        container.classList.add("containerTelas");
        const consulta = await axios.get("/api/telas/getTelaType", {
          params: {
            Type: id,
          },
        });
        const listadoTelas = consulta.data;
        listadoTelas.forEach((tela) => {
          const a = document.createElement("a");
          a.innerHTML = tela.name;
          a.href = `/telas/?id=${tela.id}&pag=home`;
          div.appendChild(a);
        });
      }
    }
  });
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

async function mostrarTipos() {
  try {
    const consulta = await axios.get("/api/types/getAll");
    const listadoTipos = consulta.data;
    const containerTypesT = document.querySelector("#containerTypesT");
    listadoTipos.forEach(async (tipos) => {
      const span = document.createElement("span");
      span.classList.add(
        "relative",
        "lg:flex",
        "lg:items-center",
        "hidden",
        "hover:bg-secondary-gray",
        "duration-300",
        "px-10",
        "cursor-pointer",
        "tipoTela"
      );
      span.id = tipos.code;
      span.setAttribute("name", tipos.name);
      span.innerHTML = `
      <span>${tipos.name}</span>      
      `;
      containerTypesT.appendChild(span);
    });
  } catch (error) {
    alert("Hubo un error al cargar los tipos de telas");
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

document.addEventListener("DOMContentLoaded", async () => {
  mostrarTelas();
  await mostrarTipos();
  await eventoNavType();
  recargarVideos(1);
  recargarVideos(2);
  recargarVideos(3);
});

ham_icon.addEventListener("click", toggleLateral);
x_icon.addEventListener("click", toggleLateral);
BgBlack.addEventListener("click", toggleLateral);
contactanosBtn.addEventListener("click", toggleContact);
contactanosBtnLat.addEventListener("click", toggleContactLat);
