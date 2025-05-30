const containerTelas = document.querySelector("#containerTelas");
const spinner = document.querySelector("#spinner");
const inputName = document.querySelector("#inputName");
const closeModal = document.querySelector("#closeModal");
const modal = document.querySelector("#modal");
const innerModal = document.querySelector("#innerModal");
const bgBlack = document.querySelector("#bgBlack");
const body = document.querySelector("body");
const main = document.querySelector("main");
let listadoColoresGlobal;
let listadoColoresNewTelaGlobal = [];

document.addEventListener("DOMContentLoaded", async () => {
  const listadoTelas = await getAll();
  imprimirTelas(listadoTelas);
  filtrarNombre(listadoTelas);
  closeModalEvent();
  eventoClickContainer();
  main.addEventListener("click", (e) => {
    if (e.target.closest(".addTela")) {
      createTelaModal();
    }
  });
});

async function getAll() {
  const consulta = await axios.get("/api/telas/getAll");
  const { data } = consulta;
  return data;
}

// Eventos Main

function eventoClickContainer() {
  containerTelas.addEventListener("click", (e) => {
    if (e.target.closest(".viewTela")) {
      const idTela = e.target.closest(".viewTela").getAttribute("idtela");
      viewTelaModal(idTela);
    }
    if (e.target.closest(".editTela")) {
      const idTela = e.target.closest(".editTela").getAttribute("idtela");
      editTelaModal(idTela);
    }
    if (e.target.closest(".deleteTela")) {
      const idTela = e.target.closest(".deleteTela").getAttribute("idtela");
      const pathTela = e.target.closest(".deleteTela").getAttribute("pathtela");
      deleteTelaModal(idTela, pathTela);
    }
  });
}

// Eventos Modal

async function createTelaModal() {
  // crear tela
  openModalEvent();
  imprimirTelaCrear();
  body.classList.add("overflow-hidden");
  innerModal.addEventListener("click", (e) => {
    //delete color
    if (e.target.closest(".deleteColor")) {
      const colorSelect = e.target
        .closest(".deleteColor")
        .getAttribute("id-color");
      listadoColoresNewTelaGlobal = listadoColoresNewTelaGlobal.filter(
        (color) => color != colorSelect
      );
      imprimirColor(listadoColoresNewTelaGlobal);
    }
    //create color
    else if (e.target.closest(".addColor")) {
      const containerInput = document.querySelector("#containerInput");
      containerInput.classList.add("p-4");
      containerInput.innerHTML = `
      <input id="inputNewColor" placeholder="Coloque el color así '#FFFFFF'" class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white" type="text">
      <button id="aceptarBtnNC" class="p-2 w-20 text-white bg-slate-600 rounded">Aceptar</button>
      `;
      const aceptarBtnNC = document.querySelector("#aceptarBtnNC");
      aceptarBtnNC.addEventListener("click", (e) => {
        e.preventDefault();
        const inputNewColor = document.querySelector("#inputNewColor").value;
        if (listadoColoresNewTelaGlobal.includes(inputNewColor)) {
          return alert("Este color ya existe");
        }
        listadoColoresNewTelaGlobal.push(inputNewColor);
        imprimirColor(listadoColoresNewTelaGlobal);
      });
    }
  });
  const cancelBtn = document.querySelector("#cancelBtn");
  const aceptarBtnCT = document.querySelector("#aceptarBtnCT");
  const inputPhoto = document.querySelector("#inputPhoto");
  inputPhoto.addEventListener("change", () => {
    const tamaño = transformarBytes(inputPhoto.files[0].size);
    const extension = validarExtension(inputPhoto.files[0].name, inputPhoto);
    if (extension) {
      return alert("Solo se pueden enviar archivos webp (.webp)");
    }
    if (tamaño > 10) {
      inputPhoto.value = "";
      return alert("No puede mandar un archivo tan pesado");
    }
    const namePhoto = document.querySelector("#namePhoto");
    namePhoto.innerHTML = inputPhoto.files[0].name;
  });
  aceptarBtnCT.addEventListener("click", async (e) => {
    e.preventDefault();
    const saveTelaData = document.querySelector("#saveTelaData");
    const listaInput = saveTelaData.querySelectorAll("input");
    let validarInput = false;
    listaInput.forEach((input) => {
      if (!input) {
        validarInput = true;
      }
    });
    if (validarInput) {
      return alert("No puede dejar algún campo vacío");
    }
    if (listadoColoresNewTelaGlobal.length < 1) {
      return alert("Debe agregar un color");
    }
    const inputName = saveTelaData.querySelector("#inputName").value;
    const data = new FormData(saveTelaData);
    try {
      const validarTela = await axios.get("/api/telas/getTelaName", {
        params: {
          inputName,
        },
      });
      alert("La tela ya existe");
    } catch (error) {
      try {
        const crear = axios.post("/api/telas/crearTela", data, {
          params: { listaColores: JSON.stringify(listadoColoresNewTelaGlobal) },
        });
        innerModal.innerHTML = "";
        bgBlack.classList.add("hidden");
        modal.classList.add("hidden");
        body.classList.remove("overflow-hidden");
        alert("La tela se ha creado con éxito");
        const listadoTelas = await getAll();
        imprimirTelas(listadoTelas);
        filtrarNombre(listadoTelas);
      } catch (error) {
        alert("Hubo un error al crear la tela");
      }
    }
  });
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    innerModal.innerHTML = "";
    bgBlack.classList.add("hidden");
    modal.classList.add("hidden");
    body.classList.remove("overflow-hidden");
  });
}

async function viewTelaModal(idTela) {
  // ver tela
  openModalEvent();
  innerModal.innerHTML = "";
  const consulta = await axios.get("/api/telas/getTela", {
    params: { idTela },
  });
  body.classList.add("overflow-hidden");
  const { data } = consulta;
  const listadoColores = JSON.parse(data.colores);
  const div = document.createElement("div");
  div.classList.add("lg:flex");
  div.innerHTML = `
  <div class="grid place-items-center">
          <img class="w-3/4" src="${data.photo}" alt="" />
        </div>
        <div class="text-center m-4 grid">
          <h3 class="text-2xl">${data.name}</h3>
          <div
            class="w-4/5 h-[.125rem] rounded-2xl bg-slate-600 m-4 place-self-center"
          ></div>
          <h4>Composición</h4>
          <span>${data.composicion}</span>
          <div
            class="w-4/5 h-[.125rem] rounded-2xl bg-slate-600 m-4 place-self-center"
          ></div>
          <h4>Rendimiento</h4>
          <span>${data.rendimiento} mts</span>
          <div
            class="w-4/5 h-[.125rem] rounded-2xl bg-slate-600 m-4 place-self-center"
          ></div>
          <h4>Uso sugerido</h4>
          <span>${data.usos_sugeridos}</span>
          <div
            class="w-4/5 h-[.125rem] rounded-2xl bg-slate-600 m-4 place-self-center"
          ></div>
          <h4>Colores</h4>
          <div id="containerColores" class="grid grid-cols-5 gap-4 justify-center mt-4">

          </div>
        </div>
  `;
  innerModal.appendChild(div);
  const containerColores = document.querySelector("#containerColores");
  listadoColores.forEach((color) => {
    const span = document.createElement("span");
    span.style = `background-color: ${color};`;
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

async function editTelaModal(idTela) {
  //editar tela
  openModalEvent();
  const consulta = await axios.get("/api/telas/getTela", {
    params: { idTela },
  });
  body.classList.add("overflow-hidden");
  const { data } = consulta;
  imprimirTelaEdit(data);
  listadoColoresGlobal = JSON.parse(data.colores);
  innerModal.addEventListener("click", (e) => {
    //delete color
    if (e.target.closest(".deleteColor")) {
      const colorSelect = e.target
        .closest(".deleteColor")
        .getAttribute("id-color");
      listadoColoresGlobal = listadoColoresGlobal.filter(
        (color) => color != colorSelect
      );
      imprimirColor(listadoColoresGlobal);
    }
    //create color
    else if (e.target.closest(".addColor")) {
      const containerInput = document.querySelector("#containerInput");
      containerInput.classList.add("p-4");
      containerInput.innerHTML = `
      <input id="inputNewColor" placeholder="Coloque el color así '#FFFFFF'" class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white" type="text">
      <button id="aceptarBtnNC" class="p-2 w-20 text-white bg-slate-600 rounded">Aceptar</button>
      `;
      const aceptarBtnNC = document.querySelector("#aceptarBtnNC");
      aceptarBtnNC.addEventListener("click", () => {
        const inputNewColor = document.querySelector("#inputNewColor").value;
        if (listadoColoresGlobal.includes(inputNewColor)) {
          return alert("Este color ya existe");
        }
        listadoColoresGlobal.push(inputNewColor);
        imprimirColor(listadoColoresGlobal);
      });
    }
  });
  const aceptarBtnAT = document.querySelector("#aceptarBtnAT");
  const cancelBtn = document.querySelector("#cancelBtn");
  aceptarBtnAT.addEventListener("click", async () => {
    const nameInput = document.querySelector("#nameInput").value;
    const composicionInput = document.querySelector("#composicionInput").value;
    const priceInput = document.querySelector("#priceInput").value;
    const usosInput = document.querySelector("#usosInput").value;
    const newData = {};
    newData.name = nameInput;
    newData.composicion = composicionInput;
    newData.price = priceInput;
    newData.usos_sugeridos = usosInput;
    newData.colores = JSON.stringify(listadoColoresGlobal);
    newData.id = data.id;
    try {
      const actualizar = await axios.put("/api/telas/actualizarTela", newData);
      innerModal.innerHTML = "";
      bgBlack.classList.add("hidden");
      modal.classList.add("hidden");
      body.classList.remove("overflow-hidden");
      alert("La tela se ha actualizado con éxito");
      closeModalEvent();
    } catch (error) {
      alert("No se pudo actualizar la tela");
    }
  });
  cancelBtn.addEventListener("click", () => {
    innerModal.innerHTML = "";
    bgBlack.classList.add("hidden");
    modal.classList.add("hidden");
    body.classList.remove("overflow-hidden");
  });
}

async function deleteTelaModal(idTela, pathTela) {
  //Eliminar tela
  const confirmar = confirm("Está seguro de eliminar la tela?");
  if (confirmar) {
    try {
      const eliminarTela = await axios.delete("/api/telas/eliminarTela", {
        params: {
          idTela,
          pathTela,
        },
      });
      const listadoTelas = await getAll();
      imprimirTelas(listadoTelas);
      filtrarNombre(listadoTelas);
      alert("Se ha eliminado la tela");
    } catch (error) {
      alert("Hubo un error al eliminar la tela");
    }
  }
}

function closeModalEvent() {
  closeModal.addEventListener("click", () => {
    innerModal.innerHTML = "";
    bgBlack.classList.add("hidden");
    modal.classList.add("hidden");
    body.classList.remove("overflow-hidden");
  });
}

function openModalEvent() {
  bgBlack.classList.remove("hidden");
  modal.classList.remove("hidden");
}

// Filtros

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

// Imprimir

function imprimirTelas(listTelas) {
  containerTelas.innerHTML = "";
  spinner.classList.remove("loader");
  listTelas.forEach((tela) => {
    const div = document.createElement("div");
    div.classList.add(
      "flex",
      "justify-between",
      "m-4",
      "text-center",
      "border-2",
      "rounded",
      "p-2",
      "border-black"
    );
    const { name, id, photo } = tela;
    div.innerHTML = `<span>${name}</span>
          <div class="text-white flex gap-2">
            <div class="p-1 bg-slate-700 rounded cursor-pointer viewTela" idtela="${id}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 viewTela"
                idtela="${id}"
              >
                <path
                  idTela="${id}"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div class="p-1 bg-slate-700 rounded cursor-pointer editTela" idtela="${id}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 editTela"
                idtela="${id}"
              >
                <path
                idtela="${id}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </div>
            <div class="p-1 bg-slate-700 rounded cursor-pointer deleteTela" idtela="${id}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 deleteTela"
                pathtela="${photo}"
                idtela="${id}"
              >
                <path
                idtela="${id}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          </div>
`;
    containerTelas.appendChild(div);
  });
}

function imprimirTelaEdit(data) {
  innerModal.innerHTML = "";
  const listadoColores = JSON.parse(data.colores);
  const div = document.createElement("div");
  div.classList.add("flex", "flex-col", "gap-4");
  div.innerHTML = `<div class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4">
    <label for="">Cambiar nombre</label>
    <input
      class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
      id="nameInput"
      value="${data.name}"
      type="text"
    />
  </div>
  <div class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4">
    <label for="">Cambiar composición</label>
    <input
      class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
      id="composicionInput"
      value="${data.composicion}"
      type="text"
    />
  </div>
  <div class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4">
    <label for="">Cambiar rendimiento</label>
    <input
      class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
      id="priceInput"
      value="${data.price}"
      type="number"
    />
  </div>
  <div class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4">
    <label for="">Cambiar usos sugeridos</label>
    <input
      class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
      id="usosInput"
      value="${data.usos_sugeridos}"
      type="text"
    />
  </div>
  <div class="flex flex-col items-center md:items-start gap-4">
    <label class="lg:mx-4" for="">Colores</label>
    <div
      class="cursor-pointer p-2 bg-slate-600 text-white self-start mx-4 rounded addColor" 
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </div>
    <div class="w-full flex flex-col items-center gap-4 lg:gap-0 md:grid md:grid-cols-2 md:place-items-center" id="containerInput">
      
    </div>
    <div class="w-full flex flex-col gap-4 mb-4" id="containerColores"></div>
    <div class="w-full flex justify-center gap-4">
  <button id="aceptarBtnAT" class="p-2 mb-2 text-white bg-slate-600 rounded">Aceptar</button>
  <button id="cancelBtn" class="p-2 mb-2 text-white bg-red-600 rounded">Cancelar</button>
</div>
  </div>`;
  innerModal.appendChild(div);
  imprimirColor(listadoColores);
}

function imprimirColor(listColor) {
  const containerColores = document.querySelector("#containerColores");
  containerColores.innerHTML = "";
  listColor.forEach((color) => {
    const divColor = document.createElement("div");
    divColor.classList.add("w-full", "px-4", "flex", "justify-between");
    divColor.innerHTML = `
    <span style="background-color: ${color}" class="w-1/2 border-black border-[1px]"></span>
    <div id-color="${color}" class="p-2 bg-slate-600 rounded cursor-pointer deleteColor">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 text-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </div>`;
    containerColores.appendChild(divColor);
  });
}

function imprimirTelaCrear() {
  innerModal.innerHTML = "";
  const form = document.createElement("form");
  form.id = "saveTelaData";
  form.classList.add("flex", "flex-col", "gap-4");
  form.innerHTML = `
  <div
  class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4"
>
  <label for="">Nombre</label>
  <input
    class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
    id="inputName"
    name="name"
    type="text"
  />
</div>
<div
  class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4"
>
  <label for="">Tipo de tela</label>
  <input
    class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
    id="inputType"
    name="type"
    type="number"
  />
</div>
<div
  class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4"
>
  <label for="">Precio</label>
  <input
    class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
    id="inputPrice"
    name="price"
    type="number"
  />
</div>
<div
  class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4"
>
  <label for="">Usos sugeridos</label>
  <input
    class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
    id="inputUsos"
    name="usos"
    type="text"
  />
</div>
<div
  class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4"
>
  <label for="">Composición</label>
  <input
    class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
    id="inputComposicion"
    name="composicion"
    type="text"
  />
</div>
<div
  class="flex flex-col md:grid md:grid-cols-2 md:mx-4 items-center md:items-start gap-4"
>
  <label for="">Rendimiento</label>
  <input
    class="w-60 md:w-full bg-slate-700 outline-none p-2 rounded text-white"
    id="inputRendimiento"
    name="rendimiento"
    type="number"
  />
</div>
<div
  class="flex flex-col md:mx-4 items-center md:flex-row md:justify-between gap-2"
>
  <label for="inputPhoto">Foto de la tela</label>
  <span id="namePhoto"></span>
  <input class="hidden" type="file" name="inputPhoto" id="inputPhoto" />
  <div class="flex">
    <label
      for="inputPhoto"
      class="cursor-pointer p-2 bg-slate-600 text-white mx-4 rounded"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
        />
      </svg>
    </label>
    <div
      class="cursor-pointer p-2 bg-red-600 text-white mx-4 rounded"
      id="clearInputFile"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </div>
  </div>
</div>
<div class="flex flex-col items-center lg:items-start gap-4">
  <label class="lg:mx-4" for="">Colores</label>
  <div
    class="cursor-pointer p-2 bg-slate-600 text-white self-start mx-4 rounded addColor"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  </div>
  <div
    class="w-full flex flex-col items-center gap-4 lg:gap-0 lg:grid lg:grid-cols-2 lg:place-items-center"
    id="containerInput"
  ></div>
  <div class="w-full flex flex-col gap-4 mb-4" id="containerColores"></div>
</div>
<div class="w-full flex justify-center gap-4">
  <button id="aceptarBtnCT" class="p-2 mb-2 text-white bg-slate-600 rounded">
    Aceptar
  </button>
  <button id="cancelBtn" class="p-2 mb-2 text-white bg-red-600 rounded">
    Cancelar
  </button>
</div>
  `;
  innerModal.appendChild(form);
}

// funciones para input file

function validarExtension(nombre, input) {
  const extension = nombre.split(".");
  if (extension[1] === "webp") {
    return false;
  } else {
    input.value = "";
    return true;
  }
}

function transformarBytes(size) {
  const kilobyte = size / 1000;
  const megabyte = kilobyte / 1000;
  return megabyte;
}
