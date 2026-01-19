let data=[];
const tbody = document.getElementById("tbody");
const search = document.getElementById("search");
const filtroArea = document.getElementById("filtroArea");
const filtroComprar = document.getElementById("filtroComprar");
const modalSerie = document.getElementById("modalSerie");


let ultimaVista = [];

function render(rows){
    ultimaVista = rows;
    tbody.innerHTML = rows.map((item, idx) => `<tr class="fila" data-index="${idx}">
    <td>${item.id ?? ""}</td>
    <td>${item.area ?? ""}</td>
    <td>${item.descripcion ?? ""}</td>
    <td>${item.cantidad ?? ""}</td>
    <td>${item.faltaComprar ?? ""}</td>
    <td>${item.notas ?? ""}</td>
    <td>
    ${item.foto ? `<img class="foto" src="${item.foto}" alt="foto">` : "-"}
    </td>
    </tr>`).join("");
}

function aplicarFiltros(){
    const q = search.value.trim().toLowerCase();
    const area = filtroArea.value;
    const comprar = filtroComprar.value;

    const filtrado = data.filter (item => {
        const texto = `${item.descripcion ?? ""} ${item.notas ?? ""}`.toLowerCase();
        const okQ = !q || texto.includes(q);
        const okArea = !area || item.area === area;
        const okComprar = !comprar || item.faltaComprar === comprar;
        return okQ && okArea && okComprar;
    });

    render(filtrado);
}
function cargarAreasUnicas(){
    const areas = [...new Set(data.map(x => x.area).filter(Boolean))].sort();
    filtroArea.innerHTML = `<option value="">Todas las áreas</option>` + areas.map(a => `<option value="${a}">${a}</option>`).join("");
}

async function init(){
    const res = await fetch("equipo.json");
    data = await res.json();

    cargarAreasUnicas();
    render(data);

    search.addEventListener("input", aplicarFiltros);
    filtroArea.addEventListener("change", aplicarFiltros);
    filtroComprar.addEventListener("change", aplicarFiltros);
}

init();

//modal
// ===== Modal =====
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");

const modalImg = document.getElementById("modalImg");
const modalTitulo = document.getElementById("modalTitulo");
const modalArea = document.getElementById("modalArea");
const modalCantidad = document.getElementById("modalCantidad");
const modalEstado = document.getElementById("modalEstado");
const modalComprar = document.getElementById("modalComprar");
const modalObs = document.getElementById("modalObs");
const modalNotas = document.getElementById("modalNotas");

function abrirModal(item){
  modal.classList.remove("hidden");

  // soporta Observaciones (Mayúscula) o observaciones (minúscula)
  const obs = item.Observaciones ?? item.observaciones ?? "—";

  modalTitulo.textContent = item.descripcion ?? "Detalle";
  modalArea.textContent = item.area ?? "—";
  modalCantidad.textContent = item.cantidad ?? "—";
  modalEstado.textContent = item.estado ?? "—";
  modalComprar.textContent = item.faltaComprar ?? "—";
  modalObs.textContent = obs;
  modalNotas.textContent = item.notas ?? "—";
  modalSerie.textContent = item.numeroSerie ?? "—";


  if(item.foto){
    modalImg.src = item.foto;
    modalImg.style.display = "block";
  } else {
    modalImg.removeAttribute("src");
    modalImg.style.display = "none";
  }
}

function cerrarModal(){
  modal.classList.add("hidden");
}

modalClose.addEventListener("click", cerrarModal);
modal.addEventListener("click", (e) => { if(e.target === modal) cerrarModal(); });
document.addEventListener("keydown", (e) => { if(e.key === "Escape") cerrarModal(); });

// Click en filas (delegación)
tbody.addEventListener("click", (e) => {
    if(e.target.tagName === "IMG") return; // Ignorar clicks en imágenes
  const tr = e.target.closest("tr");
  if(!tr) return;

  const idx = Number(tr.dataset.index);
  if(Number.isNaN(idx)) return;

  abrirModal(ultimaVista[idx]);
});
