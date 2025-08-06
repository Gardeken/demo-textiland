const ham_icon = document.querySelector("#ham-icon");
const x_icon = document.querySelector("#x-icon");
const lateralBar = document.querySelector("#lateralBar");
const BgBlack = document.querySelector("#BgBlack");
const containerTelas = document.querySelector("#container-telas");
const containerIdTelas = document.querySelector("#containerIdTelas");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const typeTela = urlParams.get("type");
const containerColorTelas = document.querySelector("#containerColorTelas");
const body = document.querySelector("body");
const containerContactanos = document.querySelector("#containerContactanos");
const containerContactanosLat = document.querySelector(
  "#containerContactanosLat"
);
const svgContactanos = document.querySelector("#svgContactanos");
const contactanosBtn = document.querySelector("#contactanosBtn");
const contactanosBtnLat = document.querySelector("#contactanosBtnLat");

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

function toggleLateral() {
  body.classList.toggle("overflow-hidden");
  lateralBar.classList.toggle("-translate-x-full");
  BgBlack.classList.toggle("hidden");
}

ham_icon.addEventListener("click", toggleLateral);
x_icon.addEventListener("click", toggleLateral);
BgBlack.addEventListener("click", toggleLateral);
contactanosBtn.addEventListener("click", toggleContact);

document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.querySelector("#spinner");
  spinner.innerHTML = `<span class="loader"></span>`;
  getAllTelas();
  getAllTypes();
});

async function getAllTelas() {
  const consulta = await axios.get("/api/telas/getAll");
  const { data } = consulta;
  filtrarPorTelas(data);
  filtrarPrecio(data);
  filtrarNombre(data);
  if (typeTela) {
    const newList = data.filter((tela) => tela.type === Number(typeTela));
    imprimirTelas(newList);
  } else {
    imprimirTelas(data);
  }
}

async function getAllTypes() {
  const containerIdTelas = document.querySelector("#containerIdTelas");
  try {
    const consulta = await axios.get("/api/types/getAll");
    const listadoTypes = consulta.data;
    listadoTypes.forEach((types) => {
      const span = document.createElement("span");
      span.classList.add(
        "p-4",
        "duration-300",
        "cursor-pointer",
        "hover:bg-primary-gray-500",
        "hover:text-white",
        "typesTela"
      );
      span.id = types.code;
      span.innerHTML = types.name;
      containerIdTelas.appendChild(span);
    });
  } catch (error) {
    alert("Hubo un error al cargar los tipos de telas");
  }
}

// Imprimir

function imprimirTelas(list) {
  const spinner = document.querySelector("#spinner");
  containerTelas.innerHTML = "";
  spinner.innerHTML = "";
  list.forEach((tela) => {
    const { name, id, photo, type, price } = tela;
    const a = document.createElement("a");
    a.classList.add(
      "w-auto",
      "flex",
      "flex-col",
      "shadow-xl",
      "duration-300",
      "hover:scale-110"
    );
    a.href = `/telas?id=${id}&pag=catalogo`;
    a.innerHTML = `<img class="!h-40 w-40 sm:h-44 sm:w-44" src="../${photo}" alt="" />
          <div class="flex flex-col pl-3 pt-1 mb-3">
          <span class="text-lg">${name}</span>
          <span>$${price} / kg</span>
          </div>
          `;
    containerTelas.appendChild(a);
  });
}

// Filtros

function filtrarPorTelas(list) {
  const containerIdTelas = document.querySelector("#containerIdTelas");
  containerIdTelas.addEventListener("click", (e) => {
    if (e.target.id == "0") {
      imprimirTelas(list);
    } else {
      const newList = list.filter((tela) => tela.type === e.target.id);
      imprimirTelas(newList);
    }
  });
}

function filtrarNombre(list) {
  const inputName = document.querySelector("#inputName");
  inputName.addEventListener("input", () => {
    if (inputName.value != "") {
      const inputNameValue = inputName.value;
      const newList = list.filter((tela) => {
        const { name } = tela;
        const validarName = name
          .toLowerCase()
          .includes(inputNameValue.toLowerCase());
        return validarName;
      });
      imprimirTelas(newList);
    } else {
      imprimirTelas(list);
    }
  });
}

function filtroPrecio(inputLower, inputHigher, list) {
  const newList = list.filter((tela) => {
    const meetsMinPrice =
      inputLower.value === "" ||
      parseFloat(tela.price) >= Number(inputLower.value);
    const meetsMaxPrice =
      inputHigher.value === "" ||
      parseFloat(tela.price) <= Number(inputHigher.value);
    return meetsMinPrice & meetsMaxPrice;
  });
  return newList;
}

function filtrarPrecio(list) {
  const lowPrice = document.querySelector("#lowPrice");
  const highPrice = document.querySelector("#highPrice");
  let newList = list;
  lowPrice.addEventListener("input", () => {
    if (lowPrice.value != "") {
      newList = filtroPrecio(lowPrice, highPrice, list);
      imprimirTelas(newList);
    } else {
      newList = filtroPrecio(lowPrice, highPrice, list);
      imprimirTelas(newList);
    }
  });

  highPrice.addEventListener("input", () => {
    if (highPrice.value != "") {
      newList = filtroPrecio(lowPrice, highPrice, list);
      imprimirTelas(newList);
    } else {
      newList = filtroPrecio(lowPrice, highPrice, list);
      imprimirTelas(newList);
    }
  });
}
