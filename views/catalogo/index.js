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
function toggleLateral() {
  body.classList.toggle("overflow-hidden");
  lateralBar.classList.toggle("-translate-x-full");
  BgBlack.classList.toggle("hidden");
}

ham_icon.addEventListener("click", toggleLateral);
x_icon.addEventListener("click", toggleLateral);
BgBlack.addEventListener("click", toggleLateral);

document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.querySelector("#spinner");
  spinner.innerHTML = `<span class="loader"></span>`;
  getAllTelas();
});

async function getAllTelas() {
  const consulta = await axios.get("/api/telas/getAll");
  const { data } = consulta;
  filtrarPorTelas(data);
  filtrarPrecio(data);
  filtrarNombre(data);
  filtrarPorColor(data);
  if (typeTela) {
    const newList = data.filter((tela) => tela.type === Number(typeTela));
    imprimirColores(newList);
    imprimirTelas(newList);
  } else {
    imprimirTelas(data);
    imprimirColores(data);
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
    a.innerHTML = `<img class="!h-40 w-40 sm:h-44 sm:w-44" src="../src/${photo}" alt="" />
          <div class="flex flex-col pl-3 pt-1 mb-3">
          <span class="text-lg">${name}</span>
          <span>$${price} / kg</span>
          </div>
          `;
    containerTelas.appendChild(a);
  });
}

function imprimirColores(list) {
  containerColorTelas.innerHTML = "";
  const listadoColoresTelas = [];
  list.forEach((tela) => {
    const { colores } = tela;
    const listColores = JSON.parse(colores);
    listColores.forEach((obj) => {
      const validar = listadoColoresTelas.includes(obj.color);
      if (!validar) {
        const div = document.createElement("div");
        const span = document.createElement("span");
        const spanName = document.createElement("span");
        div.classList.add("grid", "grid-cols-2", "gap-4", "w-full", "color");
        span.classList.add(
          "w-full",
          "h-8",
          "border-[1px]",
          "border-black",
          "cursor-pointer",
          "hover:scale-110",
          "duration-300"
        );
        span.style = `background-color: ${obj.color};`;
        div.id = obj.color;
        spanName.innerHTML = obj.colorName;
        div.appendChild(span);
        div.appendChild(spanName);
        containerColorTelas.appendChild(div);
        listadoColoresTelas.push(obj.color);
      }
    });
  });
}

// Filtros

function filtrarPorColor(list) {
  containerColorTelas.addEventListener("click", (e) => {
    if (e.target.closest(".color")) {
      const bloqueColor = e.target.closest(".color");
      const color = bloqueColor.id;
      const newList = list.filter((tela) => {
        const { colores } = tela;
        const listadoColoresTelas = JSON.parse(colores);
        const validarColor = listadoColoresTelas.some(
          (obj) => obj.color === color
        );
        return validarColor;
      });
      imprimirTelas(newList);
      imprimirColores(newList);
    }
  });
}

function filtrarPorTelas(list) {
  const span = containerIdTelas.querySelectorAll("span");
  span.forEach((div) => {
    if (div.id == "0") {
      div.addEventListener("click", () => {
        imprimirTelas(list);
        imprimirColores(list);
      });
    } else if (div.id) {
      div.addEventListener("click", () => {
        const newList = list.filter((tela) => tela.type === Number(div.id));
        imprimirTelas(newList);
        imprimirColores(newList);
      });
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
      imprimirColores(newList);
    } else {
      imprimirTelas(list);
      imprimirColores(list);
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
      imprimirColores(newList);
    } else {
      newList = filtroPrecio(lowPrice, highPrice, list);
      imprimirTelas(newList);
      imprimirColores(newList);
    }
  });

  highPrice.addEventListener("input", () => {
    if (highPrice.value != "") {
      newList = filtroPrecio(lowPrice, highPrice, list);
      imprimirTelas(newList);
      imprimirColores(newList);
    } else {
      newList = filtroPrecio(lowPrice, highPrice, list);
      imprimirTelas(newList);
      imprimirColores(newList);
    }
  });
}
