const ham_icon = document.querySelector("#ham-icon");
const x_icon = document.querySelector("#x-icon");
const lateralBar = document.querySelector("#lateralBar");
const BgBlack = document.querySelector("#BgBlack");
const containerTelas = document.querySelector("#container-telas");
const containerIdTelas = document.querySelector("#containerIdTelas");

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
  const consulta = await axios.get("/api/telas/getAll");
  const { data } = consulta;
  filtrarPorTelas(data);
  imprimirTelas(data);
}

function imprimirTelas(list) {
  containerTelas.innerHTML = "";
  list.forEach((tela) => {
    const { name, id, photo, Type, price } = tela;
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
    a.innerHTML = `<img class="!h-40 w-40 sm:h-44 sm:w-44" src="${photo}" alt="" />
          <div class="flex flex-col pl-3 pt-1 mb-3">
          <span class="text-lg">${name}</span>
          <span>$${price} / kg</span>
          </div>
          `;
    containerTelas.appendChild(a);
  });
}

function filtrarPorTelas(list) {
  const span = containerIdTelas.querySelectorAll("span");
  span.forEach((div) => {
    if (div.id == "0") {
      div.addEventListener("click", () => {
        imprimirTelas(list);
      });
    } else if (div.id) {
      div.addEventListener("click", () => {
        const newList = list.filter((tela) => tela.Type === `${div.id}`);
        imprimirTelas(newList);
      });
    }
  });
}
