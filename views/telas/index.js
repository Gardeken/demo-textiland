const containerMain = document.querySelector("#containerMain");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idTela = urlParams.get("id");
const idPag = urlParams.get("pag");
const atras = document.querySelector("#atras");
idPag == "home" ? (atras.href = "/") : (atras.href = "/catalogo");

document.addEventListener("DOMContentLoaded", getTela);

async function getTela() {
  const consulta = await fetch("/catalogo.json");
  const listadoTelas = await consulta.json();
  let textoUsos = "";
  const { telas } = listadoTelas;
  const tela = telas.find((tela) => tela.id === Number(idTela));
  const {
    name,
    photo,
    price,
    colores,
    composicion,
    rendimiento_metros,
    usos_sugeridos,
  } = tela;

  usos_sugeridos.forEach((usos) => {
    textoUsos = usos + " " + textoUsos;
  });

  containerMain.innerHTML = `
  
  <img
        class="w-3/4 lg:w-[30rem] lg:place-self-start"
        src="${photo}"
        alt=""
      />
      <div class="w-full mb-8">
        <h3 class="text-2xl m-4 lg:mx-4 lg:mb-0">${name}</h3>
        <span class="mb-4 lg:mx-4">$${price} / kg</span>
        <h4 class="text-2xl m-4">Características</h4>
        <div class="mb-8 flex flex-col">
          <div
            class="flex flex-col text-center gap-2 border-b-2 border-b-slate-600 p-4 pb-8"
          >
            <span class="text-lg">Composición</span>
            <span>${composicion}</span>
          </div>
          <div
            class="flex flex-col text-center gap-2 border-b-2 border-b-slate-600 p-4 pb-8"
          >
            <span class="text-lg">Rendimiento</span>
            <span>${rendimiento_metros} mts</span>
          </div>
          <div
            class="flex flex-col text-center gap-2 border-b-2 border-b-slate-600 p-4 pb-8"
          >
            <span class="text-lg">Uso sugerido</span>
            <span>${textoUsos}</span>
          </div>
          <div
            class="flex flex-col text-center gap-2 border-b-2 border-b-slate-600 p-4 pb-8"
          >
            <span class="text-lg">Colores</span>
            <div id="containerColores" class="flex gap-4 justify-center mt-4">
            </div>
          </div>
        </div>
      </div>
  `;

  const containerColores = document.querySelector("#containerColores");
  colores.forEach((color) => {
    const span = document.createElement("span");
    span.classList.add(
      "w-8",
      "h-8",
      "rounded-full",
      `bg-[${color}]`,
      "border-black",
      "border-[1px]"
    );
    containerColores.appendChild(span);
  });
}
