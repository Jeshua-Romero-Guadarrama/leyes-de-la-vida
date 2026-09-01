/* ==========================================================================
   Leyes de la Vida — Aplicación principal
   Autor: Jeshua Romero Guadarrama
   Navegación por hash, catálogo con buscador y filtros, modal de detalle,
   listado de interactivos y arranque del modo estudio.
   ========================================================================== */

(function () {
  "use strict";

  var LEYES = window.LEYES;
  var CATEGORIAS = window.CATEGORIAS;
  var INTERACTIVOS = window.INTERACTIVOS;

  var estado = { busqueda: "", categoria: "todas" };

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  function porId(id) {
    for (var i = 0; i < LEYES.length; i++) if (LEYES[i].id === id) return LEYES[i];
    return null;
  }

  function interactivoDe(ley) {
    for (var i = 0; i < INTERACTIVOS.length; i++) if (INTERACTIVOS[i].ley === ley.id) return INTERACTIVOS[i];
    return null;
  }

  function normalizar(t) {
    return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  /* ----------------------- Tema claro/oscuro ----------------------- */

  function iniciarTema() {
    var guardado = null;
    try { guardado = localStorage.getItem("tema"); } catch (e) { }
    var oscuro = guardado ? guardado === "oscuro" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    aplicarTema(oscuro);
    $("#boton-tema").addEventListener("click", function () {
      aplicarTema(document.documentElement.getAttribute("data-tema") !== "oscuro");
    });
  }

  function aplicarTema(oscuro) {
    document.documentElement.setAttribute("data-tema", oscuro ? "oscuro" : "claro");
    $("#boton-tema").textContent = oscuro ? "☀️" : "🌙";
    try { localStorage.setItem("tema", oscuro ? "oscuro" : "claro"); } catch (e) { }
  }

  /* ----------------------- Navegación ----------------------- */

  function ruta() {
    var h = location.hash.replace(/^#\/?/, "") || "inicio";
    return h.split("/");
  }

  function navegar() {
    var partes = ruta();
    var vista = partes[0];
    $$(".vista").forEach(function (v) { v.hidden = true; });
    $$(".nav-principal a").forEach(function (a) {
      a.classList.toggle("activo", a.getAttribute("data-vista") === vista);
    });
    if (vista === "catalogo") {
      if (partes[1] && CATEGORIAS[partes[1]]) estado.categoria = partes[1];
      $("#vista-catalogo").hidden = false;
      pintarCatalogo();
    } else if (vista === "interactivos") {
      $("#vista-interactivos").hidden = false;
      if (partes[1]) pintarInteractivo(partes[1]);
      else pintarListaInteractivos();
    } else if (vista === "estudio") {
      $("#vista-estudio").hidden = false;
      window.iniciarQuiz($("#zona-quiz"));
    } else if (vista === "ley" && partes[1]) {
      $("#vista-catalogo").hidden = false;
      pintarCatalogo();
      var ley = porId(partes[1]);
      if (ley) abrirModal(ley);
    } else {
      $("#vista-inicio").hidden = false;
      pintarInicio();
    }
    window.scrollTo(0, 0);
  }

  /* ----------------------- Portada ----------------------- */

  function pintarInicio() {
    $("#cifra-leyes").textContent = LEYES.length;
    $("#cifra-categorias").textContent = Object.keys(CATEGORIAS).length;
    $("#cifra-interactivos").textContent = INTERACTIVOS.length;

    var zona = $("#rejilla-categorias");
    zona.innerHTML = Object.keys(CATEGORIAS).map(function (clave) {
      var c = CATEGORIAS[clave];
      var n = LEYES.filter(function (l) { return l.cat === clave; }).length;
      return '<a class="tarjeta-categoria" style="--cat-color:' + c.color + '" href="#/catalogo/' + clave + '">' +
        "<h3>" + c.icono + " " + c.nombre + "</h3>" +
        "<p>" + c.desc + '</p><p class="contador">' + n + " leyes</p></a>";
    }).join("");

    var dia = LEYES[new Date().getDate() % LEYES.length];
    var cat = CATEGORIAS[dia.cat];
    $("#ley-del-dia").innerHTML =
      '<div class="tarjeta-ley" style="--cat-color:' + cat.color + '" data-ley="' + dia.id + '">' +
      '<div class="etiquetas"><span class="insignia">' + cat.nombre + "</span></div>" +
      "<h3>" + dia.nombre + "</h3>" +
      '<p class="enunciado">«' + dia.enunciado + "»</p>" +
      '<p class="autoria">' + dia.autor + " · " + dia.anio + "</p></div>";
    $("#ley-del-dia .tarjeta-ley").addEventListener("click", function () { abrirModal(dia); });
  }

  /* ----------------------- Catálogo ----------------------- */

  function pintarFiltros() {
    var zona = $("#filtros-categorias");
    var chips = ['<button class="chip' + (estado.categoria === "todas" ? " activo" : "") + '" data-cat="todas">Todas</button>'];
    Object.keys(CATEGORIAS).forEach(function (clave) {
      var c = CATEGORIAS[clave];
      chips.push('<button class="chip' + (estado.categoria === clave ? " activo" : "") + '" style="--chip-color:' + c.color + '" data-cat="' + clave + '">' + c.icono + " " + c.nombre + "</button>");
    });
    zona.innerHTML = chips.join("");
    $$(".chip", zona).forEach(function (ch) {
      ch.addEventListener("click", function () {
        estado.categoria = ch.getAttribute("data-cat");
        pintarCatalogo();
      });
    });
  }

  function filtrar() {
    var q = normalizar(estado.busqueda.trim());
    return LEYES.filter(function (l) {
      if (estado.categoria !== "todas" && l.cat !== estado.categoria) return false;
      if (!q) return true;
      var pajar = normalizar([l.nombre, l.autor, l.enunciado, l.explicacion, l.ejemplo, l.tags.join(" ")].join(" "));
      return q.split(/\s+/).every(function (palabra) { return pajar.indexOf(palabra) !== -1; });
    });
  }

  function pintarCatalogo() {
    pintarFiltros();
    var lista = filtrar();
    $("#resumen-resultados").textContent = lista.length + " de " + LEYES.length + " leyes";
    var zona = $("#rejilla-leyes");
    if (!lista.length) {
      zona.innerHTML = '<div class="sin-resultados"><p style="font-size:2rem">🔎</p><p>Sin resultados para esa búsqueda.</p></div>';
      return;
    }
    zona.innerHTML = lista.map(function (l) {
      var c = CATEGORIAS[l.cat];
      return '<article class="tarjeta-ley" style="--cat-color:' + c.color + '" data-ley="' + l.id + '" tabindex="0" role="button" aria-label="' + l.nombre + '">' +
        '<div class="etiquetas"><span class="insignia">' + c.nombre + "</span>" +
        (interactivoDe(l) ? '<span class="insignia insignia-interactivo">🕹️ interactivo</span>' : "") +
        "</div><h3>" + l.nombre + "</h3>" +
        '<p class="enunciado">«' + l.enunciado + "»</p>" +
        '<p class="autoria">' + l.autor + " · " + l.anio + "</p></article>";
    }).join("");
    $$(".tarjeta-ley", zona).forEach(function (t) {
      function abrir() { abrirModal(porId(t.getAttribute("data-ley"))); }
      t.addEventListener("click", abrir);
      t.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });
    });
  }

  /* ----------------------- Modal de detalle ----------------------- */

  function abrirModal(ley) {
    cerrarModal();
    var c = CATEGORIAS[ley.cat];
    var inter = interactivoDe(ley);
    var fondo = document.createElement("div");
    fondo.className = "modal-fondo";
    fondo.innerHTML =
      '<div class="modal" style="--cat-color:' + c.color + '" role="dialog" aria-modal="true" aria-label="' + ley.nombre + '">' +
      '<button class="modal-cerrar" aria-label="Cerrar">✕</button>' +
      '<div class="etiquetas" style="display:flex;gap:6px;margin-bottom:10px"><span class="insignia">' + c.icono + " " + c.nombre + "</span></div>" +
      "<h2>" + ley.nombre + "</h2>" +
      '<p class="meta">' + ley.autor + " · " + ley.anio + "</p>" +
      "<blockquote>«" + ley.enunciado + "»</blockquote>" +
      "<h4>Qué significa</h4><p>" + ley.explicacion + "</p>" +
      "<h4>En la vida real</h4><p>" + ley.ejemplo + "</p>" +
      (ley.rel && ley.rel.length ? '<h4>Leyes relacionadas</h4><div class="relacionadas">' +
        ley.rel.map(function (id) {
          var r = porId(id);
          return r ? '<button data-ley="' + r.id + '">' + r.nombre + "</button>" : "";
        }).join("") + "</div>" : "") +
      (inter ? '<div class="accion-interactivo"><a class="boton boton-primario" href="#/interactivos/' + inter.id + '">' + inter.icono + " Probar: " + inter.titulo + "</a></div>" : "") +
      "</div>";
    document.body.appendChild(fondo);
    $(".modal-cerrar", fondo).addEventListener("click", cerrarModal);
    fondo.addEventListener("click", function (e) { if (e.target === fondo) cerrarModal(); });
    $$(".relacionadas button", fondo).forEach(function (b) {
      b.addEventListener("click", function () { abrirModal(porId(b.getAttribute("data-ley"))); });
    });
    if (inter) $(".accion-interactivo a", fondo).addEventListener("click", cerrarModal);
    document.addEventListener("keydown", escCerrar);
  }

  function escCerrar(e) { if (e.key === "Escape") cerrarModal(); }

  function cerrarModal() {
    var m = $(".modal-fondo");
    if (m) m.remove();
    document.removeEventListener("keydown", escCerrar);
  }

  /* ----------------------- Interactivos ----------------------- */

  function pintarListaInteractivos() {
    var zona = $("#zona-interactivos");
    var html = "";
    Object.keys(CATEGORIAS).forEach(function (clave) {
      var c = CATEGORIAS[clave];
      var lista = INTERACTIVOS.filter(function (s) {
        var ley = porId(s.ley);
        return ley && ley.cat === clave;
      });
      if (!lista.length) return;
      html += '<h3 class="seccion-titulo" style="color:' + c.color + '">' + c.icono + " " + c.nombre + " (" + lista.length + ")</h3>";
      html += '<div class="rejilla-interactivos">' + lista.map(function (s) {
        var ley = porId(s.ley);
        return '<article class="tarjeta-interactivo" data-sim="' + s.id + '" tabindex="0" role="button">' +
          '<span class="icono">' + s.icono + "</span><h3>" + s.titulo + "</h3><p>" + s.resumen + "</p>" +
          '<span class="insignia" style="align-self:flex-start;background:' + c.color + '">' + ley.nombre + "</span></article>";
      }).join("") + "</div>";
    });
    zona.innerHTML = html;
    $$(".tarjeta-interactivo", zona).forEach(function (t) {
      function abrir() { location.hash = "#/interactivos/" + t.getAttribute("data-sim"); }
      t.addEventListener("click", abrir);
      t.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });
    });
  }

  function pintarInteractivo(id) {
    var sim = null;
    for (var i = 0; i < INTERACTIVOS.length; i++) if (INTERACTIVOS[i].id === id) sim = INTERACTIVOS[i];
    if (!sim) { pintarListaInteractivos(); return; }
    var ley = porId(sim.ley);
    var zona = $("#zona-interactivos");
    zona.innerHTML =
      '<div class="panel-interactivo">' +
      '<button class="volver">← Todos los interactivos</button>' +
      "<h2>" + sim.icono + " " + sim.titulo + "</h2>" +
      '<p class="descripcion">' + sim.resumen + ' Basado en la <a href="#/ley/' + ley.id + '">' + ley.nombre + "</a>.</p>" +
      '<div class="zona-sim" id="zona-sim"></div>' +
      "</div>";
    $(".volver", zona).addEventListener("click", function () { location.hash = "#/interactivos"; });
    sim.render($("#zona-sim", zona));
  }

  /* ----------------------- Arranque ----------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    iniciarTema();
    $("#entrada-busqueda").addEventListener("input", function (e) {
      estado.busqueda = e.target.value;
      pintarCatalogo();
    });
    window.addEventListener("hashchange", navegar);
    navegar();

    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("sw.js").catch(function () { });
    }
  });
})();
