const containerMain = document.querySelector("#containerMain");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idTela = urlParams.get("id");
const idPag = urlParams.get("pag");
const atras = document.querySelector("#atras");
idPag == "home" ? (atras.href = "/") : (atras.href = "/catalogo");

document.addEventListener("DOMContentLoaded", getTela);

async function getTela() {
  const consulta = await axios.get("/api/telas/getTela", {
    params: {
      idTela,
    },
  });
  const { data } = consulta;
  let {
    name,
    photo,
    price,
    colores,
    composicion,
    rendimiento,
    usos_sugeridos,
    ancho,
  } = data;
  colores = JSON.parse(colores);

  console.log(colores);
  containerMain.innerHTML = `
  <img
        class="w-3/4 lg:w-[30rem] lg:place-self-start"
        src="../${photo}"
        alt=""
      />
      <div class="w-full mb-8 text-center">
        <h3 class="text-2xl m-4 lg:mx-4 lg:mb-0">${name}</h3>
        <span class="mb-4 lg:mx-4">$${price} / kg</span>
        <h4 class="text-2xl m-4">Características</h4>
        <div class="mb-8 flex flex-col items-center">
          <div class="border-[1px] m-4 border-slate-600 w-3/4 lg:w-full"></div>
          <div class="flex flex-col gap-4 p-4">
            <span class="text-lg">Composición</span>
            <span
              >${composicion}</span
            >
          </div>
          <div class="border-[1px] m-4 border-slate-600 w-3/4 lg:w-full"></div>
          <div class="flex flex-col lg:flex-row gap-4 p-4">
            <div class="flex flex-col">
            <span class="text-lg">Rendimiento</span>
            <span>${rendimiento} mts</span>
            </div>
            <div class="flex flex-col">
            <span class="text-lg">Ancho</span>
            <span>${ancho} mts</span>
            </div>
          </div>
          <div class="border-[1px] m-4 border-slate-600 w-3/4 lg:w-full"></div>

          <div class="flex flex-col gap-4 p-4">
            <span class="text-lg">Uso sugerido</span>
            <span
              >${usos_sugeridos}</span
            >
          </div>
          <div class="border-[1px] m-4 border-slate-600 w-3/4 lg:w-full"></div>
          <div class="p-4">
            <span class="text-lg">Colores</span>
            <div id="containerColores" class="flex flex-wrap gap-4 justify-center mt-4 max-w-96">
            </div>
          </div>
        </div>
      </div>
  `;

  const containerColores = document.querySelector("#containerColores");
  colores.forEach((obj) => {
    const span = document.createElement("span");
    span.style = `background-color: ${obj.color};`;
    span.classList.add(
      "w-8",
      "h-8",
      "rounded-full",
      "border-black",
      "border-[1px]"
    );
    containerColores.appendChild(span);
  });
}
