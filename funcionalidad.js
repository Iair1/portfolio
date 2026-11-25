const root = document.documentElement
const paginas = document.getElementsByClassName("pagina")
const titulos = document.getElementsByClassName("titulomediapagina")
const textos = document.getElementsByClassName("textoLineaDeTiempo")
for(let i=0; i<paginas.length; i++){
    console.log("hola")
    paginas[i].style.backgroundColor = getComputedStyle(root).getPropertyValue(`--fondo${paginas[i].getAttribute('data-m4')}`).trim();
}
for(let i=0; i<titulos.length; i++){
  if(!titulos[i].classList.contains("ignorar")){
    titulos[i].style.color = getComputedStyle(root).getPropertyValue(`--fondo${(i+2) % 4}`).trim();
  }
  if(!textos[i].classList.contains("ignorar")){
    textos[i].style.color = getComputedStyle(root).getPropertyValue(`--fondo${(i+2) % 4}`).trim();
  }
}


// ==========================================================
    // 3. PROGRESO DEL SCROLL: este es todo el JavaScript necesario.
    // Se mide únicamente #recorrido, no la altura de la página.
    // ==========================================================
    const seccion = document.getElementById("olimpiadas")
    const panel = document.querySelector("#panel");
    const porcentaje = document.querySelector("#porcentaje");

    function actualizarProgreso() {
      // top se mide respecto de la ventana y cambia con el scroll.
      const rect = seccion.getBoundingClientRect();
      const altoPanel = panel.getBoundingClientRect().height;
      const margen = parseFloat(getComputedStyle(panel).top) || 0;

      // El panel empieza a quedar quieto cuando rect.top = margen.
      // Deja de quedar quieto cuando los bordes inferiores coinciden.
      const recorrido = rect.height - altoPanel;
      const distancia = margen - rect.top;

      // clamp: evitamos valores negativos o mayores que uno.
      // Si la sección es demasiado corta, no hay recorrido sticky.
      const progreso = recorrido > 0
        ? Math.min(1, Math.max(0, distancia / recorrido))
        : 0;

      panel.style.setProperty("--progreso", progreso);

    console.log(getComputedStyle(root).getPropertyValue(`--fondo-actual`).trim())

      // 4 colores: cada 25% se pasa gradualmente al siguiente.
      // 0% crema → 25% durazno → 50% verde → 75% celeste → 100% vuelve a crema.
      const colores = [getComputedStyle(root).getPropertyValue(`--fondo0`).trim(), getComputedStyle(root).getPropertyValue(`--fondo1`).trim(), getComputedStyle(root).getPropertyValue(`--fondo2`).trim(), getComputedStyle(root).getPropertyValue(`--fondo3`).trim()];
      const tramo = Math.min(progreso * 10, 9.9999);
      const i = Math.floor(tramo);
      const t = tramo - i;
      const a = colores[i % 4], b = colores[(i + 1) % 4];
      const mezclar = (k) => Math.round(parseInt(a.substr(k, 2), 16) * (1 - t) + parseInt(b.substr(k, 2), 16) * t);
      document.documentElement.style.setProperty("--fondo-actual", `rgb(${mezclar(1)}, ${mezclar(3)}, ${mezclar(5)})`);
      const valor = Math.round(progreso * 100);
      panel.setAttribute("aria-valuenow", valor);



    }
    
    // Agrupamos cambios pendientes antes del próximo repintado.
    // No interceptamos rueda, touch ni teclas: el scroll es nativo.
    let actualizacionPendiente = false;
    function solicitarActualizacion() {
      if (actualizacionPendiente) return;
      actualizacionPendiente = true;
      requestAnimationFrame(() => {
        actualizarProgreso();
        actualizacionPendiente = false;
      });
    }

    window.addEventListener("scroll", solicitarActualizacion, { passive: true });
    window.addEventListener("resize", solicitarActualizacion);
    window.addEventListener("load", solicitarActualizacion);
    window.addEventListener("pageshow", solicitarActualizacion);

  // ==========================================================
// 4. CLIC EN LOS CÍRCULOS: ir a la n-ava página
// ==========================================================
const bolitas = document.querySelectorAll(".bolitapagina");

function irAPagina(indice) {               // indice: 0 a 11
  const rect = seccion.getBoundingClientRect();
  const altoPanel = panel.getBoundingClientRect().height;
  const margen = parseFloat(getComputedStyle(panel).top) || 0;
  const recorrido = rect.height - altoPanel;

  // Posición absoluta del main .olimpiadas dentro del documento
  const inicioSeccion = rect.top + window.scrollY;

  // Queremos que progreso = indice / (cantidad - 1)
  // progreso = (margen - rect.top) / recorrido  =>  despejamos rect.top
  const progresoDeseado = indice / (bolitas.length - 1);
  const destino = inicioSeccion - margen + progresoDeseado * recorrido;

  window.scrollTo({ top: destino, behavior: "smooth" });
}

bolitas.forEach((bolita, i) => {
  bolita.style.cursor = "pointer";
  bolita.addEventListener("click", () => irAPagina(i));
});




    // Si agregás imágenes o contenido dinámico, recalculamos también
    // cuando cambia el tamaño de la sección o del panel.
    if ("ResizeObserver" in window) {
      const observador = new ResizeObserver(solicitarActualizacion);
      observador.observe(seccion);
      observador.observe(panel);
    }
    solicitarActualizacion();