/* ==========================================================================
   Leyes de la Vida — Interactivos V: Química y Biología (con animaciones)
   Autor: Jeshua Romero Guadarrama
   ========================================================================== */

(function () {
  "use strict";

  var U = window.UTILSIM;
  var nf = U.nf, graficoLineas = U.graficoLineas;
  var simCurva = U.simCurva, registrar = U.registrar, animar = U.animar;
  var azar = Math.random;

  /* ======================= QUÍMICA ======================= */

  /* ---------- Lavoisier: conservación de la masa ---------- */
  (function () {
    function render(cont) {
      var quemado = false;
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="lv-quemar">🔥 Quemar la lana de hierro (frasco cerrado)</button>' +
        '<button class="boton-sim secundario" id="lv-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="lv-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="lv-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">El experimento de Lavoisier: dentro de un frasco sellado sobre una balanza, la combustión no cambia NI UN GRAMO la masa total — los átomos solo se recombinan (el hierro «gana» el peso del oxígeno que ya estaba en el frasco). La materia no se crea ni se destruye.</p>';
      function pintar() {
        var s = '<svg viewBox="0 0 560 210" style="max-width:560px;margin:0 auto">';
        s += '<line x1="130" y1="40" x2="430" y2="40" stroke="var(--tinta-suave)" stroke-width="5"/><line x1="280" y1="20" x2="280" y2="40" stroke="var(--tinta-suave)" stroke-width="5"/>';
        s += '<line x1="150" y1="40" x2="150" y2="70" stroke="var(--tinta-tenue)"/><line x1="410" y1="40" x2="410" y2="70" stroke="var(--tinta-tenue)"/>';
        s += '<ellipse cx="150" cy="105" rx="58" ry="38" fill="color-mix(in srgb, var(--qui) 15%, transparent)" stroke="var(--qui)" stroke-width="2"/>';
        s += quemado ?
          '<text x="150" y="100" text-anchor="middle" font-size="20">⬛</text><text x="150" y="122" text-anchor="middle" font-size="9" fill="var(--tinta-suave)">óxido de hierro + aire sin O₂</text>' :
          '<text x="150" y="100" text-anchor="middle" font-size="20">🧶</text><text x="150" y="122" text-anchor="middle" font-size="9" fill="var(--tinta-suave)">hierro + aire con O₂</text>';
        s += '<rect x="360" y="80" width="100" height="52" rx="8" fill="var(--superficie)" stroke="var(--borde)"/><text x="410" y="112" text-anchor="middle" font-size="15" font-weight="800" fill="var(--tinta)">500,00 g</text>';
        s += '<text x="280" y="185" text-anchor="middle" font-size="12" fill="var(--tinta-suave)">frasco sellado ⚖️ pesa patrón</text>';
        s += "</svg>";
        cont.querySelector("#lv-lienzo").innerHTML = s;
        cont.querySelector("#lv-nota").innerHTML = quemado ?
          "La balanza sigue clavada en <strong>500,00 g</strong>: el hierro pesa más (se llevó el oxígeno), el aire pesa menos, el total ni se inmuta. ⚖️" :
          "Balanza equilibrada. Quema el contenido y vigila la aguja.";
      }
      cont.querySelector("#lv-quemar").addEventListener("click", function () { quemado = true; pintar(); });
      cont.querySelector("#lv-reset").addEventListener("click", function () { quemado = false; pintar(); });
      pintar();
    }
    registrar({ id: "sim-lavoisier", icono: "⚖️", titulo: "La balanza incorruptible", ley: "lavoisier", resumen: "Quema hierro en un frasco sellado y vigila la balanza.", render: render });
  })();

  /* ---------- Proust: proporciones definidas ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Hidrógeno: <strong id="pr-h">4</strong> g</label>' +
        '<input type="range" id="pr-rh" min="0" max="20" value="4">' +
        '<label>Oxígeno: <strong id="pr-o">16</strong> g</label>' +
        '<input type="range" id="pr-ro" min="0" max="80" value="16">' +
        "</div>" +
        '<div class="lienzo-sim" id="pr-lienzo"></div>' +
        '<p class="marcador" id="pr-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">El agua exige SIEMPRE 1 g de hidrógeno por cada 8 g de oxígeno: la receta es innegociable. Todo lo que no cuadre con la proporción se queda sin reaccionar. Esa terquedad fue la gran pista de que la materia viene en átomos.</p>';
      var rh = cont.querySelector("#pr-rh"), ro = cont.querySelector("#pr-ro");
      function pintar() {
        var h = +rh.value, o = +ro.value;
        cont.querySelector("#pr-h").textContent = h;
        cont.querySelector("#pr-o").textContent = o;
        var hUsado = Math.min(h, o / 8);
        var oUsado = hUsado * 8;
        var agua = hUsado + oUsado;
        var filas = [
          ["💧 Agua formada", agua, "var(--tec)"],
          ["🎈 H sobrante", h - hUsado, "var(--qui)"],
          ["🫧 O sobrante", o - oUsado, "var(--fis)"]
        ];
        var s = '<svg viewBox="0 0 560 140" style="width:100%;max-width:560px;margin:0 auto">';
        filas.forEach(function (f, i) {
          var y = 10 + i * 42;
          s += '<text x="10" y="' + (y + 15) + '" font-size="12" fill="var(--tinta)">' + f[0] + "</text>";
          s += '<rect x="170" y="' + y + '" width="' + Math.max(2, f[1] * 3.6) + '" height="22" rx="6" fill="' + f[2] + '"/>';
          s += '<text x="' + (176 + f[1] * 3.6) + '" y="' + (y + 16) + '" font-size="12" font-weight="700" fill="var(--tinta)">' + nf(f[1], 1) + " g</text>";
        });
        s += "</svg>";
        cont.querySelector("#pr-lienzo").innerHTML = s;
        cont.querySelector("#pr-nota").innerHTML = agua === 0 ? "Sin pareja no hay reacción." :
          h - hUsado > 0.1 ? "Sobra hidrógeno: no hay oxígeno con quien casarlo (receta 1:8)." :
            o - oUsado > 0.1 ? "Sobra oxígeno: la proporción 1:8 no admite excepciones." :
              "🎯 Proporción exacta 1:8 — todo reaccionó, nada sobró.";
      }
      rh.addEventListener("input", pintar);
      ro.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-proust", icono: "💧", titulo: "La receta innegociable", ley: "proust", resumen: "Mezcla hidrógeno y oxígeno: el agua solo acepta la proporción 1:8.", render: render });
  })();

  /* ---------- Dalton: proporciones múltiples ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="chip activo" data-g="co">Monóxido (CO)</button>' +
        '<button class="chip" data-g="co2">Dióxido (CO₂)</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="da-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="da-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Mismos ingredientes (carbono y oxígeno), dos compuestos: por cada 12 g de carbono, uno lleva 16 g de oxígeno y el otro EXACTAMENTE 32 — razón 1:2, números enteros. Solo los átomos indivisibles explican esa aritmética limpia: así resucitó Dalton el atomismo.</p>';
      function pintar(gas) {
        var esCO2 = gas === "co2";
        var s = '<svg viewBox="0 0 560 170" style="max-width:560px;margin:0 auto">';
        s += '<circle cx="230" cy="70" r="30" fill="#3f3f46"/><text x="230" y="76" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">C</text>';
        s += '<circle cx="310" cy="70" r="26" fill="var(--med)"/><text x="310" y="76" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">O</text>';
        if (esCO2) s += '<circle cx="150" cy="70" r="26" fill="var(--med)"/><text x="150" y="76" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">O</text>';
        s += '<text x="280" y="135" text-anchor="middle" font-size="14" font-weight="700" fill="var(--tinta)">12 g de C + ' + (esCO2 ? "32" : "16") + " g de O</text>";
        s += '<text x="280" y="158" text-anchor="middle" font-size="12" fill="var(--tinta-suave)">' + (esCO2 ? "el gas de las burbujas y del efecto invernadero" : "el gas tóxico y silencioso del brasero") + "</text>";
        s += "</svg>";
        cont.querySelector("#da-lienzo").innerHTML = s;
        cont.querySelector("#da-nota").innerHTML = "Razón de oxígeno entre ambos compuestos: <strong>16 : 32 = 1 : 2 exacto</strong> — cucharadas enteras de átomos, jamás fracciones.";
      }
      cont.querySelectorAll(".chip[data-g]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          cont.querySelectorAll(".chip[data-g]").forEach(function (o) { o.classList.remove("activo"); });
          ch.classList.add("activo");
          pintar(ch.getAttribute("data-g"));
        });
      });
      pintar("co");
    }
    registrar({ id: "sim-dalton", icono: "⚛️", titulo: "Cucharadas enteras de átomos", ley: "dalton-multiples", resumen: "CO y CO₂: mismos ingredientes, razón 1:2 exacta. Pista atómica.", render: render });
  })();

  /* ---------- Gay-Lussac: volúmenes de combinación ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Oxígeno disponible: <strong id="gv-val">1</strong> L</label>' +
        '<input type="range" id="gv-rango" min="1" max="5" value="1">' +
        "</div>" +
        '<div class="lienzo-sim" id="gv-lienzo"></div>' +
        '<p class="nota-sim">2H₂ + O₂ → 2H₂O: los gases reaccionan en volúmenes de razón entera (2:1:2), porque medir litros de gas es contar moléculas (Avogadro). Cambia el oxígeno y mira escalar el resto de la receta.</p>';
      var rango = cont.querySelector("#gv-rango");
      function pintar() {
        var o = +rango.value;
        cont.querySelector("#gv-val").textContent = o;
        var filas = [["Hidrógeno consumido", o * 2, "var(--qui)"], ["Oxígeno consumido", o, "var(--fis)"], ["Vapor de agua producido", o * 2, "var(--tec)"]];
        var s = '<svg viewBox="0 0 560 150" style="width:100%;max-width:560px;margin:0 auto">';
        filas.forEach(function (f, i) {
          var y = 12 + i * 44;
          s += '<text x="10" y="' + (y + 15) + '" font-size="12" fill="var(--tinta)">' + f[0] + "</text>";
          s += '<rect x="210" y="' + y + '" width="' + f[1] * 30 + '" height="22" rx="6" fill="' + f[2] + '"/>';
          s += '<text x="' + (216 + f[1] * 30) + '" y="' + (y + 16) + '" font-size="12" font-weight="700" fill="var(--tinta)">' + f[1] + " L</text>";
        });
        s += "</svg>";
        cont.querySelector("#gv-lienzo").innerHTML = s;
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-gaylussac", icono: "🧪", titulo: "La receta en litros", ley: "gay-lussac-vol", resumen: "Los gases reaccionan 2:1:2, siempre en números redondos.", render: render });
  })();

  /* ---------- Avogadro ---------- */
  (function () {
    var GASES = { h2: ["Hidrógeno (H₂)", 2, "🎈 sube disparado"], he: ["Helio (He)", 4, "🎈 sube"], aire: ["Aire (media)", 29, "😐 flota indiferente"], co2: ["CO₂", 44, "⬇️ cae al suelo"] };
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="chip activo" data-gas="h2">H₂</button>' +
        '<button class="chip" data-gas="he">Helio</button>' +
        '<button class="chip" data-gas="aire">Aire</button>' +
        '<button class="chip" data-gas="co2">CO₂</button>' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 230" style="width:100%">' +
        '<line x1="0" y1="210" x2="560" y2="210" stroke="var(--borde)" stroke-width="3"/>' +
        '<g id="av-globo"><ellipse cx="0" cy="0" rx="42" ry="50" fill="color-mix(in srgb, var(--qui) 45%, var(--superficie))" stroke="var(--qui)" stroke-width="2"/><line x1="0" y1="50" x2="0" y2="86" stroke="var(--tinta-tenue)"/><g id="av-mols"></g></g>' +
        '<text id="av-txt" x="280" y="26" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">El MISMO globo, las MISMAS moléculas en número (Avogadro): solo cambia el peso de cada una. Con moléculas más ligeras que las del aire desalojado, el globo flota; más pesadas, cae. Contar moléculas midiendo litros: esa fue la genialidad ignorada 50 años.</p>';
      var globo = cont.querySelector("#av-globo"), mols = cont.querySelector("#av-mols"), txt = cont.querySelector("#av-txt");
      var gas = "h2", y = 110;
      var puntos = [];
      for (var i = 0; i < 12; i++) puntos.push([(azar() - 0.5) * 56, (azar() - 0.5) * 70]);
      function pintarMols() {
        var m = GASES[gas][1];
        var r = 2.5 + Math.sqrt(m) * 0.7;
        mols.innerHTML = puntos.map(function (p) {
          return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '" fill="var(--tec)" opacity="0.7"/>';
        }).join("");
      }
      cont.querySelectorAll(".chip[data-gas]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          cont.querySelectorAll(".chip[data-gas]").forEach(function (o) { o.classList.remove("activo"); });
          ch.classList.add("activo");
          gas = ch.getAttribute("data-gas");
          pintarMols();
        });
      });
      pintarMols();
      animar(cont, function (dt, t) {
        var m = GASES[gas][1];
        var objetivo = m < 29 ? 70 - (29 - m) * 0.6 : 158 + Math.min(20, (m - 29));
        y += (objetivo - y) * 1.6 * dt;
        globo.setAttribute("transform", "translate(" + (280 + Math.sin(t) * 6) + "," + y + ")");
        txt.textContent = GASES[gas][0] + " — 12 moléculas, masa " + m + " · " + GASES[gas][2];
      });
    }
    registrar({ id: "sim-avogadro", icono: "🎈", titulo: "Doce moléculas, cuatro destinos", ley: "avogadro", resumen: "Llena el mismo globo con gases distintos: mismo número, distinto peso.", render: render });
  })();

  /* ---------- Le Chatelier ---------- */
  (function () {
    function render(cont) {
      var estado = { nh3: 40, n2: 30, h2: 30, msj: "Equilibrio inicial de la síntesis de amoníaco." };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="lc-n2">➕ Añadir N₂</button>' +
        '<button class="boton-sim" id="lc-presion">🗜️ Subir la presión</button>' +
        '<button class="boton-sim" id="lc-calor">🔥 Calentar</button>' +
        '<button class="boton-sim secundario" id="lc-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="lc-lienzo"></div>' +
        '<p class="marcador" id="lc-msj" style="text-align:center"></p>' +
        '<p class="nota-sim">N₂ + 3H₂ ⇌ 2NH₃ (exotérmica, menos gas a la derecha). Perturba el equilibrio y mira al sistema contraatacar: más reactivo → fabrica producto; más presión → se va al lado compacto; más calor → huye hacia los reactivos. Así se diseñó el proceso que fertiliza al mundo.</p>';
      function pintar() {
        var filas = [["N₂ + H₂ (reactivos)", estado.n2 + estado.h2, "var(--fis)"], ["NH₃ (producto)", estado.nh3, "var(--qui)"]];
        var s = '<svg viewBox="0 0 560 110" style="width:100%;max-width:560px;margin:0 auto">';
        filas.forEach(function (f, i) {
          var y = 12 + i * 46;
          s += '<text x="10" y="' + (y + 15) + '" font-size="12" fill="var(--tinta)">' + f[0] + "</text>";
          s += '<rect x="180" y="' + y + '" width="' + f[1] * 3.4 + '" height="24" rx="7" fill="' + f[2] + '"/>';
          s += '<text x="' + (188 + f[1] * 3.4) + '" y="' + (y + 17) + '" font-size="12" font-weight="700" fill="var(--tinta)">' + nf(f[1], 0) + "</text>";
        });
        s += "</svg>";
        cont.querySelector("#lc-lienzo").innerHTML = s;
        cont.querySelector("#lc-msj").innerHTML = estado.msj;
      }
      cont.querySelector("#lc-n2").addEventListener("click", function () {
        estado.n2 += 14;
        var usa = 8;
        estado.n2 -= usa; estado.h2 = Math.max(6, estado.h2 - usa * 0.6); estado.nh3 += usa * 1.4;
        estado.msj = "↦ El sistema «gasta» el N₂ extra fabricando más NH₃: contrarresta la adición.";
        pintar();
      });
      cont.querySelector("#lc-presion").addEventListener("click", function () {
        var usa = 7;
        estado.n2 = Math.max(6, estado.n2 - usa * 0.5); estado.h2 = Math.max(6, estado.h2 - usa); estado.nh3 += usa * 1.1;
        estado.msj = "↦ Apretado, el equilibrio se muda al lado con MENOS moléculas de gas: más NH₃.";
        pintar();
      });
      cont.querySelector("#lc-calor").addEventListener("click", function () {
        var usa = 8;
        estado.nh3 = Math.max(6, estado.nh3 - usa); estado.n2 += usa * 0.5; estado.h2 += usa * 0.7;
        estado.msj = "↦ La reacción directa libera calor: al calentar, el sistema retrocede para «absorber» el exceso.";
        pintar();
      });
      cont.querySelector("#lc-reset").addEventListener("click", function () {
        estado.nh3 = 40; estado.n2 = 30; estado.h2 = 30;
        estado.msj = "Equilibrio inicial de la síntesis de amoníaco.";
        pintar();
      });
      pintar();
    }
    registrar({ id: "sim-lechatelier", icono: "🗜️", titulo: "El equilibrio contraataca", ley: "lechatelier", resumen: "Perturba una reacción en equilibrio y mira cómo se defiende.", render: render });
  })();

  /* ---------- Hess ---------- */
  registrar({
    id: "sim-hess", icono: "🏔️", titulo: "Dos senderos, un desnivel", ley: "hess",
    resumen: "Sube la montaña energética por dos rutas: el desnivel no cambia.",
    render: simCurva({
      controles: [{ id: "p", etiqueta: "Calor liberado en el primer paso (C → CO)", min: 50, max: 340, paso: 10, valor: 110, fmt: function (v) { return v + " kJ"; } }],
      grafico: function (v) {
        var TOTAL = 394;
        var paso2 = TOTAL - v.p;
        var s = '<svg viewBox="0 0 560 210" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<line x1="40" y1="40" x2="250" y2="40" stroke="var(--tinta)" stroke-width="3"/><text x="45" y="30" font-size="11" fill="var(--tinta)">C + O₂ (inicio)</text>';
        s += '<line x1="40" y1="180" x2="530" y2="180" stroke="var(--tinta)" stroke-width="3"/><text x="45" y="200" font-size="11" fill="var(--tinta)">CO₂ (final)</text>';
        s += '<path d="M 120 40 C 120 120 120 180 120 180" fill="none" stroke="var(--qui)" stroke-width="3"/><text x="70" y="115" font-size="11" font-weight="700" fill="var(--qui)">directa: 394 kJ</text>';
        var yMedio = 40 + (v.p / TOTAL) * 140;
        s += '<line x1="300" y1="' + yMedio + '" x2="440" y2="' + yMedio + '" stroke="var(--fis)" stroke-width="2.5"/><text x="446" y="' + (yMedio + 4) + '" font-size="10" fill="var(--fis)">CO intermedio</text>';
        s += '<path d="M 340 40 L 340 ' + yMedio + '" stroke="var(--fis)" stroke-width="3" fill="none"/><text x="348" y="' + (40 + (yMedio - 40) / 2) + '" font-size="11" fill="var(--fis)">paso 1: ' + v.p + " kJ</text>";
        s += '<path d="M 400 ' + yMedio + ' L 400 180" stroke="var(--fis)" stroke-width="3" fill="none"/><text x="408" y="' + (yMedio + (180 - yMedio) / 2) + '" font-size="11" fill="var(--fis)">paso 2: ' + paso2 + " kJ</text>";
        s += "</svg>";
        return s;
      },
      nota: function (v) {
        return "Ruta directa: 394 kJ. Ruta en dos pasos: " + v.p + " + " + (394 - v.p) + " = <strong>394 kJ</strong>. Muevas donde muevas la parada intermedia, el desnivel total es sagrado: solo cuentan inicio y final.";
      },
      pie: "La energía química es como la altitud: el camino no importa. Con esta ley se calculan calores de reacciones imposibles de medir directamente."
    })
  });

  /* ---------- Acción de masas ---------- */
  registrar({
    id: "sim-masas", icono: "💥", titulo: "Cuestión de encuentros", ley: "accion-masas",
    resumen: "Concentra los reactivos y cuenta los choques por segundo.",
    render: simCurva({
      controles: [{ id: "c", etiqueta: "Concentración de reactivos", min: 10, max: 100, valor: 30, fmt: function (v) { return v + "%"; } }],
      grafico: function (v) {
        var pts = [];
        for (var c = 10; c <= 100; c += 5) pts.push({ x: c, y: Math.pow(c / 100, 2) * 100 });
        return {
          series: [{ nombre: "Velocidad de reacción (choques eficaces)", color: "var(--qui)", puntos: pts }],
          xMax: 100, yMax: 105, xEtiq: "Concentración (%)", yEtiq: "Velocidad",
          marcas: [{ x: v.c, y: Math.pow(v.c / 100, 2) * 100, texto: nf(Math.pow(v.c / 100, 2) * 100, 0) }]
        };
      },
      nota: function (v) {
        return v.c < 35 ? "Moléculas dispersas: pocos encuentros, reacción perezosa (por eso una brasa arde tranquila)." :
          v.c < 75 ? "Más moléculas por litro → más choques por segundo → más velocidad. Remover el azúcar es esto." :
            "💥 Concentración alta: choques por doquier. El polvo de harina en suspensión no arde: explota.";
      },
      pie: "Guldberg y Waage convirtieron la cocina química en ecuaciones: de aquí nace la constante de equilibrio que gobierna hasta el pH de tu sangre."
    })
  });

  /* ---------- Raoult ---------- */
  registrar({
    id: "sim-raoult", icono: "🧂", titulo: "El agua con inquilinos", ley: "raoult",
    resumen: "Añade sal al agua y mueve sus puntos de ebullición y congelación.",
    render: simCurva({
      controles: [{ id: "s", etiqueta: "Soluto disuelto", min: 0, max: 100, valor: 0, fmt: function (v) { return v === 0 ? "agua pura" : v + " g/L"; } }],
      grafico: function (v) {
        var teb = 100 + v.s * 0.017;
        var tcong = 0 - v.s * 0.062;
        var s = '<svg viewBox="0 0 560 150" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<text x="10" y="30" font-size="12" fill="var(--tinta)">♨️ Punto de ebullición</text>';
        s += '<rect x="200" y="14" width="' + ((teb - 99) * 90) + '" height="22" rx="6" fill="var(--med)"/>';
        s += '<text x="' + (208 + (teb - 99) * 90) + '" y="30" font-size="13" font-weight="800" fill="var(--tinta)">' + nf(teb, 1) + " °C</text>";
        s += '<text x="10" y="80" font-size="12" fill="var(--tinta)">🧊 Punto de congelación</text>';
        s += '<rect x="200" y="64" width="' + (Math.abs(tcong) * 32 + 4) + '" height="22" rx="6" fill="var(--tec)"/>';
        s += '<text x="' + (210 + Math.abs(tcong) * 32) + '" y="80" font-size="13" font-weight="800" fill="var(--tinta)">' + nf(tcong, 1) + " °C</text>";
        s += '<text x="10" y="128" font-size="12" fill="var(--tinta)">💨 Presión de vapor</text>';
        s += '<rect x="200" y="112" width="' + (200 - v.s * 1.2) + '" height="22" rx="6" fill="var(--qui)"/>';
        s += '<text x="' + (208 + 200 - v.s * 1.2) + '" y="128" font-size="13" font-weight="800" fill="var(--tinta)">' + nf(100 - v.s * 0.6, 0) + "%</text>";
        return s + "</svg>";
      },
      nota: function (v) {
        return v.s === 0 ? "Agua pura: hierve a 100 °C y congela a 0 °C." :
          v.s < 50 ? "Las partículas de soluto estorban la evaporación: menos vapor, hervir cuesta más y congelar también." :
            "❄️ Con esta concentración, el «agua» aguanta varios grados bajo cero sin congelar: exactamente lo que hace la sal en la carretera y el anticongelante en tu radiador.";
      },
      pie: "Propiedades coligativas: dependen de CUÁNTAS partículas hay disueltas, no de cuáles. La sal en la carretera helada es la ley de Raoult trabajando en invierno."
    })
  });

  /* ---------- Henry: burbujas del refresco ---------- */
  (function () {
    function render(cont) {
      var abierta = false;
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="he2-abrir">🍾 Abrir la botella</button>' +
        '<button class="boton-sim secundario" id="he2-cerrar">Cerrar y agitar (reponer gas)</button>' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 240" style="width:100%">' +
        '<path d="M 240 60 L 240 40 L 260 40 L 260 20 L 300 20 L 300 40 L 320 40 L 320 60 L 330 90 L 330 220 L 230 220 L 230 90 Z" fill="color-mix(in srgb, var(--qui) 30%, transparent)" stroke="var(--qui)" stroke-width="2"/>' +
        '<rect id="he2-tapon" x="256" y="10" width="48" height="14" rx="4" fill="var(--ges)"/>' +
        '<g id="he2-burbujas"></g>' +
        '<text id="he2-txt" x="120" y="60" font-size="12" font-weight="700" fill="var(--tinta)"></text>' +
        '<text id="he2-gas" x="120" y="84" font-size="12" fill="var(--tinta-suave)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">Cerrada, la presión mantiene el CO₂ disuelto (ley de Henry): ni una burbuja. Al abrir, la presión cae y el gas escapa en cascada. La misma ley que obliga a los buceadores a subir despacio: su sangre es la botella.</p>';
      var g = cont.querySelector("#he2-burbujas"), tapon = cont.querySelector("#he2-tapon"), txt = cont.querySelector("#he2-txt"), gasTxt = cont.querySelector("#he2-gas");
      var burbujas = [], disuelto = 100;
      cont.querySelector("#he2-abrir").addEventListener("click", function () { abierta = true; });
      cont.querySelector("#he2-cerrar").addEventListener("click", function () { abierta = false; disuelto = 100; burbujas = []; });
      animar(cont, function (dt) {
        tapon.setAttribute("y", abierta ? -30 : 10);
        if (abierta && disuelto > 3) {
          disuelto = Math.max(0, disuelto - 9 * dt);
          if (azar() < 0.6) burbujas.push({ x: 240 + azar() * 80, y: 215, r: 1.5 + azar() * 3.5, v: 30 + azar() * 50 });
        }
        burbujas.forEach(function (b) { b.y -= b.v * dt; b.x += Math.sin(b.y / 8) * 0.5; });
        burbujas = burbujas.filter(function (b) { return b.y > 95; });
        g.innerHTML = burbujas.map(function (b) {
          return '<circle cx="' + b.x + '" cy="' + b.y + '" r="' + b.r + '" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.85"/>';
        }).join("");
        txt.textContent = abierta ? (disuelto > 3 ? "PSSSHHH — presión liberada" : "Refresco «muerto»: sin gas") : "Botella cerrada: presión alta";
        gasTxt.textContent = "CO₂ disuelto: " + nf(disuelto, 0) + "%";
      });
    }
    registrar({ id: "sim-henry", icono: "🥤", titulo: "El pssshhh de la ley de Henry", ley: "henry", resumen: "Abre el refresco y libera el gas que la presión tenía disuelto.", render: render });
  })();

  /* ---------- Ley periódica ---------- */
  (function () {
    var ELEMENTOS = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"];
    var RADIOS = [53, 31, 167, 112, 87, 67, 56, 48, 42, 38, 190, 145, 118, 111, 98, 88, 79, 71, 243, 194, 184, 176, 171, 166, 161, 156, 152, 149, 145, 142, 136, 125, 114, 103, 94, 88];
    registrar({
      id: "sim-periodica", icono: "🎹", titulo: "La música de los átomos", ley: "periodica",
      resumen: "Recorre 36 elementos y escucha repetirse el patrón del tamaño atómico.",
      render: simCurva({
        controles: [{ id: "z", etiqueta: "Número atómico", min: 1, max: 36, valor: 11, fmt: function (v) { return v + " (" + ELEMENTOS[v - 1] + ")"; } }],
        grafico: function (v) {
          var pts = RADIOS.map(function (r, i) { return { x: i + 1, y: r }; });
          return {
            series: [{ nombre: "Radio atómico (pm)", color: "var(--qui)", puntos: pts }],
            xMax: 36, yMax: 260, xEtiq: "Número atómico (Z)", yEtiq: "Radio (pm)",
            marcas: [{ x: v.z, y: RADIOS[v.z - 1], texto: ELEMENTOS[v.z - 1] }]
          };
        },
        nota: function (v) {
          var el = ELEMENTOS[v.z - 1];
          var alcalino = [3, 11, 19].indexOf(v.z) !== -1;
          var noble = [2, 10, 18, 36].indexOf(v.z) !== -1;
          return alcalino ? "⚡ " + el + ": pico de la sierra — metal grande y reactivo que explota en agua, como todos los de su columna." :
            noble ? "😴 " + el + ": valle — gas noble, pequeño y hermético, que no reacciona con nadie." :
              el + ": el tamaño encoge a lo largo de cada fila y salta al empezar la siguiente — el mismo dibujo, periodo tras periodo.";
        },
        pie: "Ese zigzag repetido es la ley periódica hecha imagen: Mendeléyev vio el ritmo, dejó huecos y predijo elementos que nadie había visto. Todos aparecieron."
      })
    });
  })();

  /* ---------- Arrhenius ---------- */
  registrar({
    id: "sim-arrhenius", icono: "🥛", titulo: "La leche y la nevera", ley: "arrhenius",
    resumen: "Cambia la temperatura y cronometra cuánto dura la leche.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Temperatura", min: -18, max: 40, valor: 20, fmt: function (v) { return v + " °C"; } }],
      grafico: function (v) {
        function vel(t) { return Math.pow(2, (t - 20) / 10) * 100; }
        var pts = [];
        for (var t = -18; t <= 40; t += 2) pts.push({ x: t + 18, y: vel(t) });
        return {
          series: [{ nombre: "Velocidad de descomposición (a 20 °C = 100)", color: "var(--qui)", puntos: pts }],
          xMax: 58, yMax: 420, xEtiq: "Temperatura (°C, desplazada +18)", yEtiq: "Velocidad relativa",
          marcas: [{ x: v.t + 18, y: vel(v.t), texto: nf(vel(v.t), 0) }]
        };
      },
      nota: function (v) {
        var horas = 24 / Math.pow(2, (v.t - 20) / 10);
        var texto = horas > 48 ? nf(horas / 24, 0) + " días" : nf(horas, 0) + " horas";
        return "A " + v.t + " °C, la leche que a 20 °C duraba un día dura <strong>~" + texto + "</strong>: cada 10 °C duplican (o parten a la mitad) la velocidad de la química.";
      },
      pie: "Para reaccionar hay que saltar una barrera de energía, y el calor multiplica exponencialmente a las moléculas que lo logran. La nevera no «conserva»: frena a Arrhenius."
    })
  });

  /* ======================= BIOLOGÍA ======================= */

  /* ---------- Darwin: las polillas del abedul ---------- */
  (function () {
    function render(cont) {
      var estado = { oscuras: 10, generacion: 0 };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Hollín en los troncos: <strong id="dw-val">10</strong>%</label>' +
        '<input type="range" id="dw-rango" min="0" max="100" value="10">' +
        '<button class="boton-sim" id="dw-gen">🐦 Pasar una generación</button>' +
        '<button class="boton-sim secundario" id="dw-x10">×10 generaciones</button>' +
        '<button class="boton-sim secundario" id="dw-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="dw-lienzo"></div>' +
        '<p class="marcador" id="dw-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Los pájaros cazan a las polillas que destacan sobre el tronco. Ennegrece los troncos con hollín industrial y pasa generaciones: las oscuras (antes rareza) dominan. Limpia el aire y la marea vuelve. Variación + herencia + filtro = evolución observable.</p>';
      var rango = cont.querySelector("#dw-rango");
      function generacion() {
        var hollin = +rango.value / 100;
        var p = estado.oscuras / 100;
        var fitOscura = 0.55 + hollin * 0.5;
        var fitClara = 1.05 - hollin * 0.5;
        var media = p * fitOscura + (1 - p) * fitClara;
        p = (p * fitOscura) / media;
        estado.oscuras = Math.max(0.5, Math.min(99.5, p * 100));
        estado.generacion++;
      }
      function pintar() {
        var hollin = +rango.value / 100;
        cont.querySelector("#dw-val").textContent = rango.value;
        var tronco = "color-mix(in srgb, #2b2b2b " + Math.round(hollin * 100) + "%, #d8cfb8)";
        var s = '<svg viewBox="0 0 560 170" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<rect x="0" y="0" width="560" height="170" rx="10" fill="' + tronco + '"/>';
        var n = 40;
        for (var i = 0; i < n; i++) {
          var oscura = (i / n) * 100 < estado.oscuras;
          var x = 24 + (i % 10) * 57, y = 24 + Math.floor(i / 10) * 38;
          s += '<ellipse cx="' + x + '" cy="' + y + '" rx="11" ry="7" fill="' + (oscura ? "#20201e" : "#e8e2d2") + '" stroke="' + (oscura ? "#000" : "#b5ad98") + '"/>';
        }
        s += "</svg>";
        cont.querySelector("#dw-lienzo").innerHTML = s;
        cont.querySelector("#dw-nota").innerHTML = "Generación " + estado.generacion + " · Polillas oscuras: <strong>" + nf(estado.oscuras, 0) + "%</strong>" +
          (estado.oscuras > 85 ? " — el melanismo industrial: lo que pasó en Manchester." : estado.oscuras < 15 && estado.generacion > 5 ? " — aire limpio, tronco claro: la selección revirtió la moda." : "");
      }
      cont.querySelector("#dw-gen").addEventListener("click", function () { generacion(); pintar(); });
      cont.querySelector("#dw-x10").addEventListener("click", function () { for (var i = 0; i < 10; i++) generacion(); pintar(); });
      cont.querySelector("#dw-reset").addEventListener("click", function () { estado.oscuras = 10; estado.generacion = 0; pintar(); });
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-darwin", icono: "🦋", titulo: "Las polillas del abedul", ley: "darwin", resumen: "Ennegrece los troncos y mira a la selección natural cambiar de bando.", render: render });
  })();

  /* ---------- Hardy-Weinberg ---------- */
  registrar({
    id: "sim-hardy", icono: "🧮", titulo: "p² + 2pq + q²", ley: "hardy-weinberg",
    resumen: "Mueve la frecuencia de un alelo y reparte los genotipos de la población.",
    render: simCurva({
      controles: [{ id: "p", etiqueta: "Frecuencia del alelo A", min: 1, max: 99, valor: 50, fmt: function (v) { return nf(v / 100, 2); } }],
      grafico: function (v) {
        var p = v.p / 100, q = 1 - p;
        var filas = [["AA", p * p, "var(--bio)"], ["Aa (portadores)", 2 * p * q, "var(--ges)"], ["aa", q * q, "var(--soc)"]];
        var s = '<svg viewBox="0 0 560 150" style="width:100%;max-width:560px;margin:0 auto">';
        filas.forEach(function (f, i) {
          var y = 12 + i * 44;
          s += '<text x="10" y="' + (y + 15) + '" font-size="12" fill="var(--tinta)">' + f[0] + "</text>";
          s += '<rect x="150" y="' + y + '" width="' + Math.max(2, f[1] * 360) + '" height="22" rx="6" fill="' + f[2] + '"/>';
          s += '<text x="' + (158 + f[1] * 360) + '" y="' + (y + 16) + '" font-size="12" font-weight="700" fill="var(--tinta)">' + nf(f[1] * 100, 1) + "%</text>";
        });
        return s + "</svg>";
      },
      nota: function (v) {
        var p = v.p / 100, q = 1 - p;
        return "Con el alelo a al " + nf(q, 2) + ": afectados aa = <strong>" + nf(q * q * 100, 2) + "%</strong>, pero portadores sanos Aa = <strong>" + nf(2 * p * q * 100, 1) + "%</strong>. " +
          (q < 0.15 ? "Un alelo raro vive casi entero escondido en portadores: por eso las enfermedades recesivas no desaparecen." : "Y sin selección ni azar, estas proporciones se repetirán idénticas generación tras generación.");
      },
      pie: "El «reposo» de la genética: si una población se desvía de estas proporciones, algo la está empujando (selección, endogamia, migración). El desvío es el detector."
    })
  });

  /* ---------- Liebig: el barril ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Nitrógeno: <strong id="lb-n">80</strong></label><input type="range" id="lb-rn" min="10" max="100" value="80">' +
        '<label>Fósforo: <strong id="lb-p">35</strong></label><input type="range" id="lb-rp" min="10" max="100" value="35">' +
        '<label>Agua: <strong id="lb-a">90</strong></label><input type="range" id="lb-ra" min="10" max="100" value="90">' +
        "</div>" +
        '<div class="lienzo-sim" id="lb-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="lb-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">El barril de Liebig: el agua (la cosecha) solo llega hasta la duela más corta. Sube los recursos abundantes cuanto quieras: mientras no toques el más escaso, nada cambia. Abonar sin diagnóstico es tirar el dinero.</p>';
      var rn = cont.querySelector("#lb-rn"), rp = cont.querySelector("#lb-rp"), ra = cont.querySelector("#lb-ra");
      function pintar() {
        var duelas = [["N", +rn.value], ["P", +rp.value], ["H₂O", +ra.value], ["K", 70], ["Luz", 85], ["CO₂", 75]];
        cont.querySelector("#lb-n").textContent = rn.value;
        cont.querySelector("#lb-p").textContent = rp.value;
        cont.querySelector("#lb-a").textContent = ra.value;
        var minimo = Math.min.apply(null, duelas.map(function (d) { return d[1]; }));
        var s = '<svg viewBox="0 0 560 220" style="max-width:560px;margin:0 auto">';
        var x0 = 130, ancho = 50;
        s += '<rect x="' + x0 + '" y="' + (196 - minimo * 1.6) + '" width="' + ancho * 6 + '" height="' + minimo * 1.6 + '" fill="color-mix(in srgb, var(--tec) 45%, transparent)"/>';
        duelas.forEach(function (d, i) {
          var h = d[1] * 1.6;
          var esMin = d[1] === minimo;
          s += '<rect x="' + (x0 + i * ancho) + '" y="' + (196 - h) + '" width="' + (ancho - 4) + '" height="' + h + '" rx="4" fill="' + (esMin ? "var(--med)" : "#8a5a2b") + '" opacity="0.9"/>';
          s += '<text x="' + (x0 + i * ancho + ancho / 2 - 2) + '" y="212" text-anchor="middle" font-size="10" fill="var(--tinta-suave)">' + d[0] + "</text>";
        });
        s += '<text x="80" y="' + (200 - minimo * 1.6) + '" text-anchor="end" font-size="12" font-weight="700" fill="var(--tec)">cosecha: ' + minimo + "</text>";
        s += "</svg>";
        cont.querySelector("#lb-lienzo").innerHTML = s;
        var corto = duelas.filter(function (d) { return d[1] === minimo; })[0];
        cont.querySelector("#lb-nota").innerHTML = "La duela más corta es <strong>" + corto[0] + " (" + minimo + ")</strong>: el crecimiento se detiene exactamente ahí, sobre lo demás.";
      }
      [rn, rp, ra].forEach(function (r) { r.addEventListener("input", pintar); });
      pintar();
    }
    registrar({ id: "sim-liebig", icono: "🛢️", titulo: "El barril de la cosecha", ley: "liebig", resumen: "Sube y baja nutrientes: solo importa la duela más corta.", render: render });
  })();

  /* ---------- Shelford ---------- */
  registrar({
    id: "sim-shelford", icono: "🪸", titulo: "Ni mucho ni poco", ley: "shelford",
    resumen: "Mueve la temperatura del arrecife y vigila la salud del coral.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Temperatura del agua", min: 14, max: 38, paso: 0.5, valor: 26, fmt: function (v) { return nf(v, 1) + " °C"; } }],
      grafico: function (v) {
        function salud(t) { return 100 * Math.exp(-Math.pow((t - 26) / 4.2, 2)); }
        var pts = [];
        for (var t = 14; t <= 38; t += 0.5) pts.push({ x: t, y: salud(t) });
        return {
          series: [{ nombre: "Bienestar del coral", color: "var(--bio)", puntos: pts }],
          xMax: 38, yMax: 105, xEtiq: "Temperatura (°C)", yEtiq: "Bienestar",
          marcas: [{ x: v.t, y: salud(v.t), texto: nf(salud(v.t), 0) + "%" }]
        };
      },
      nota: function (v) {
        var s = 100 * Math.exp(-Math.pow((v.t - 26) / 4.2, 2));
        return s > 80 ? "🪸 Zona óptima: el coral prospera." :
          s > 40 ? "😰 Zona de estrés fisiológico: sobrevive, no crece. Nótalo: pasa lo mismo por frío que por calor." :
            "☠️ Límite letal: blanqueamiento. Tan mortal es el exceso como el defecto — eso añade Shelford a Liebig.";
      },
      pie: "Cada especie vive dentro de una campana de tolerancia por cada factor. El mapa de la vida en la Tierra es la suma de esas campanas."
    })
  });

  /* ---------- Kleiber ---------- */
  registrar({
    id: "sim-kleiber", icono: "🐘", titulo: "Del ratón a la ballena", ley: "kleiber",
    resumen: "Escala un animal y mira su metabolismo obedecer al exponente 3/4.",
    render: simCurva({
      controles: [{ id: "x", etiqueta: "Masa del animal", min: -2, max: 4, paso: 0.1, valor: 0, fmt: function (v) { var kg = Math.pow(10, v); return kg < 1 ? nf(kg * 1000, 0) + " g" : nf(kg, 0) + " kg"; } }],
      grafico: function (v) {
        var pts = [];
        for (var x = -2; x <= 4; x += 0.2) pts.push({ x: x + 2, y: 0.75 * x + 1.85 });
        return {
          series: [{ nombre: "log₁₀(kcal/día) — recta de pendiente 3/4", color: "var(--bio)", puntos: pts }],
          xMax: 6, yMax: 5, xEtiq: "log₁₀(masa en kg) + 2", yEtiq: "log₁₀(kcal/día)",
          marcas: [{ x: v.x + 2, y: 0.75 * v.x + 1.85 }]
        };
      },
      nota: function (v) {
        var kg = Math.pow(10, v.x);
        var kcal = 70 * Math.pow(kg, 0.75);
        var porKg = kcal / kg;
        var animal = kg < 0.05 ? "🐁 musaraña/ratón" : kg < 5 ? "🐈 gato" : kg < 120 ? "🧍 humano/perro grande" : kg < 1200 ? "🐎 caballo" : "🐘 elefante";
        return animal + " (~" + (kg < 1 ? nf(kg * 1000, 0) + " g" : nf(kg, 0) + " kg") + "): ~<strong>" + nf(kcal, 0) + " kcal/día</strong>, es decir " + nf(porKg, 1) + " kcal por kilo — " + (kg < 0.1 ? "una hoguera por gramo: vida acelerada y corta." : kg > 500 ? "brasas lentas: vida a cámara lenta." : "el término medio.");
      },
      pie: "Cinco órdenes de magnitud, una sola recta en escala log-log: metabolismo ∝ masa^¾. Los grandes gastan menos por gramo — y casi todos los mamíferos mueren tras un número parecido de latidos."
    })
  });

  /* ---------- Bergmann ---------- */
  registrar({
    id: "sim-bergmann", icono: "🐻‍❄️", titulo: "El frío fabrica gigantes", ley: "bergmann",
    resumen: "Enfría el hábitat y mira crecer el cuerpo (y encoger su radiador).",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Temperatura del hábitat", min: -30, max: 35, valor: 10, fmt: function (v) { return v + " °C"; } }],
      grafico: function (v) {
        var r = 34 - (v.t + 30) * 0.32;
        var sv = 3 / (r / 20);
        var s = '<svg viewBox="0 0 560 190" style="width:100%;max-width:560px;margin:0 auto">';
        var cielo = v.t < 0 ? "#cfe5f2" : v.t < 20 ? "#dcebd2" : "#f2e3c2";
        s += '<rect x="0" y="0" width="560" height="190" rx="10" fill="' + cielo + '"/>';
        s += '<circle cx="200" cy="100" r="' + r + '" fill="#7a5c40" stroke="#5b432c" stroke-width="3"/>';
        s += '<circle cx="' + (200 - r * 0.45) + '" cy="' + (100 - r * 0.35) + '" r="' + (r * 0.15) + '" fill="#3a2c1c"/>';
        s += '<text x="200" y="' + (110 + r + 16) + '" text-anchor="middle" font-size="11" fill="#333">oso de este clima</text>';
        s += '<text x="410" y="70" font-size="12" fill="#333">radio corporal: ' + nf(r, 0) + "</text>";
        s += '<text x="410" y="94" font-size="12" fill="#333">superficie/volumen: ' + nf(sv, 2) + "</text>";
        s += '<text x="410" y="118" font-size="12" font-weight="700" fill="#333">' + (v.t < -5 ? "estufa bien aislada 🔥" : v.t > 22 ? "radiador eficiente 💨" : "término medio") + "</text>";
        return s + "</svg>";
      },
      nota: function (v) {
        return v.t < -5 ? "Clima polar: el volumen (produce calor) crece más rápido que la superficie (lo pierde) — cuerpo grande = abrigo geométrico. Oso polar." :
          v.t > 22 ? "Clima tropical: cuerpo pequeño con mucha superficie relativa para disipar. Oso malayo." :
            "Clima templado: talla intermedia. La geometría del calor esculpe las siluetas.";
      },
      pie: "Regla de Bergmann: dentro de un mismo grupo, las poblaciones frías son más corpulentas. Pura física de superficies y volúmenes aplicada a la carne."
    })
  });

  /* ---------- Allen ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Clima del zorro: <strong id="al-val">templado</strong></label>' +
        '<input type="range" id="al-rango" min="0" max="100" value="50">' +
        "</div>" +
        '<div class="lienzo-sim" id="al-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="al-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">El mismo zorro, tres climas: las orejas son radiadores. En el Ártico, mínimas (no regalar calor); en el desierto, enormes (disiparlo). La regla de Allen esculpe orejas, patas, colas y hocicos con física térmica.</p>';
      var rango = cont.querySelector("#al-rango");
      function pintar() {
        var c = +rango.value / 100;
        cont.querySelector("#al-val").textContent = c < 0.33 ? "ártico ❄️" : c < 0.66 ? "templado" : "desierto 🏜️";
        var oreja = 10 + c * 34;
        var hocico = 16 + c * 18;
        var fondo = c < 0.33 ? "#e8f1f8" : c < 0.66 ? "#e7efdd" : "#f5e6c4";
        var pelaje = c < 0.33 ? "#e8e8e8" : c < 0.66 ? "#c56a2b" : "#d9a05b";
        var s = '<svg viewBox="0 0 560 210" style="max-width:560px;margin:0 auto">';
        s += '<rect x="0" y="0" width="560" height="210" rx="10" fill="' + fondo + '"/>';
        s += '<path d="M ' + (280 - oreja * 0.9) + ' 92 L ' + (280 - oreja * 1.4) + ' ' + (92 - oreja * 1.7) + ' L ' + (280 - oreja * 0.1) + ' 78 Z" fill="' + pelaje + '" stroke="#7a4a1d"/>';
        s += '<path d="M ' + (280 + oreja * 0.9) + ' 92 L ' + (280 + oreja * 1.4) + ' ' + (92 - oreja * 1.7) + ' L ' + (280 + oreja * 0.1) + ' 78 Z" fill="' + pelaje + '" stroke="#7a4a1d"/>';
        s += '<ellipse cx="280" cy="120" rx="52" ry="44" fill="' + pelaje + '" stroke="#7a4a1d" stroke-width="2"/>';
        s += '<ellipse cx="280" cy="' + (138) + '" rx="' + hocico + '" ry="' + (hocico * 0.55) + '" fill="#f6f0e6" stroke="#7a4a1d"/>';
        s += '<circle cx="280" cy="' + (134 + hocico * 0.32) + '" r="4" fill="#333"/>';
        s += '<circle cx="262" cy="112" r="5" fill="#222"/><circle cx="298" cy="112" r="5" fill="#222"/>';
        s += "</svg>";
        cont.querySelector("#al-lienzo").innerHTML = s;
        cont.querySelector("#al-nota").innerHTML = c < 0.33 ? "🦊 Zorro ártico: bola compacta, orejas mínimas — cada centímetro de apéndice es calor perdido." :
          c < 0.66 ? "🦊 Zorro rojo: proporciones intermedias para un clima intermedio." :
            "🦊 Fenec: casi todo orejas — radiadores gigantes para el horno del Sahara.";
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-allen", icono: "🦊", titulo: "Las orejas del zorro", ley: "allen", resumen: "Muda un zorro del Ártico al Sahara y mira crecer sus radiadores.", render: render });
  })();

  /* ---------- Cope ---------- */
  (function () {
    function render(cont) {
      var estado = { talla: 8, ma: 0, historia: [{ x: 0, y: 8 }] };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="cp-avanzar">⏩ Avanzar 5 millones de años</button>' +
        '<button class="boton-sim secundario" id="cp-reset">Reiniciar el linaje</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="cp-lienzo"></div>' +
        '<p class="marcador" id="cp-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Ser grande gana peleas y ahuyenta depredadores: el linaje escala talla era tras era... hasta que un cambio brusco (meteorito, clima) poda a los gigantes, que comen mucho y crían despacio. Los pequeños heredan la Tierra y la carrera reinicia.</p>';
      function pintar() {
        cont.querySelector("#cp-lienzo").innerHTML = graficoLineas({
          series: [{ nombre: "Talla media del linaje", color: "var(--bio)", puntos: estado.historia }],
          xMax: Math.max(40, estado.ma), yMax: 105, xEtiq: "Millones de años", yEtiq: "Talla"
        });
      }
      cont.querySelector("#cp-avanzar").addEventListener("click", function () {
        estado.ma += 5;
        if (estado.talla > 55 && azar() < 0.4) {
          estado.talla = 6 + azar() * 6;
          estado.historia.push({ x: estado.ma, y: estado.talla });
          cont.querySelector("#cp-nota").innerHTML = "☄️ <strong>¡Extinción!</strong> Los gigantes caen primero (mucha hambre, pocas crías). Un linaje menudo hereda el mundo... y vuelve a crecer.";
        } else {
          estado.talla = Math.min(100, estado.talla * (1.25 + azar() * 0.2));
          estado.historia.push({ x: estado.ma, y: estado.talla });
          cont.querySelector("#cp-nota").innerHTML = "La talla media sube: los grandes ganan los combates de este eón (talla " + nf(estado.talla, 0) + ").";
        }
        pintar();
      });
      cont.querySelector("#cp-reset").addEventListener("click", function () {
        estado.talla = 8; estado.ma = 0; estado.historia = [{ x: 0, y: 8 }];
        cont.querySelector("#cp-nota").textContent = "";
        pintar();
      });
      pintar();
    }
    registrar({ id: "sim-cope", icono: "🦕", titulo: "La escalada de los gigantes", ley: "cope", resumen: "Haz crecer un linaje durante eones... y espera al meteorito.", render: render });
  })();

  /* ---------- Dollo ---------- */
  (function () {
    function render(cont) {
      var etapa = 0;
      var ETAPAS = [
        ["🐟", "Pez ancestral", "Aletas, branquias, cola vertical. Pulsa para salir a tierra."],
        ["🦎", "Tetrápodo terrestre", "Ganó patas y pulmones; perdió branquias y aletas. Pulsa para volver al mar."],
        ["🐬", "Delfín", "¿Volvió a ser pez? NO: respira aire, mueve la cola en horizontal (herencia de galopar) y sus «aletas» son manos con dedos dentro. La vuelta atrás exacta es imposible: inventó una solución nueva con las piezas que tenía."]
      ];
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="dl-avanzar">🧬 Evolucionar</button>' +
        '<button class="boton-sim secundario" id="dl-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="dl-lienzo" style="text-align:center;padding:26px"></div>' +
        '<p class="nota-sim">Ley de Dollo: la evolución no tiene tecla de deshacer. Los genes de un órgano abandonado se degradan; si la vieja función vuelve a hacer falta, se improvisa otra cosa. Cada regreso al mar deja cicatrices delatoras (las ballenas guardan caderas de recuerdo).</p>';
      function pintar() {
        var e = ETAPAS[etapa];
        cont.querySelector("#dl-lienzo").innerHTML =
          '<p style="font-size:3.4rem;margin:0">' + ETAPAS.slice(0, etapa + 1).map(function (x) { return x[0]; }).join(" → ") + "</p>" +
          '<p class="marcador" style="margin:10px 0 6px">' + e[1] + "</p>" +
          '<p style="color:var(--tinta-suave);max-width:520px;margin:0 auto">' + e[2] + "</p>";
        cont.querySelector("#dl-avanzar").disabled = etapa >= 2;
      }
      cont.querySelector("#dl-avanzar").addEventListener("click", function () { etapa = Math.min(2, etapa + 1); pintar(); });
      cont.querySelector("#dl-reset").addEventListener("click", function () { etapa = 0; pintar(); });
      pintar();
    }
    registrar({ id: "sim-dollo", icono: "🐬", titulo: "Sin tecla de deshacer", ley: "dollo", resumen: "Devuelve un mamífero al mar y comprueba que no vuelve a ser pez.", render: render });
  })();

  /* ---------- Lindeman: pirámide del 10% ---------- */
  registrar({
    id: "sim-lindeman", icono: "🔺", titulo: "La pirámide que se evapora", ley: "lindeman",
    resumen: "Pon energía en la base y mira cuánta llega al superdepredador.",
    render: simCurva({
      controles: [{ id: "e", etiqueta: "Energía de las plantas", min: 1000, max: 100000, paso: 1000, valor: 10000, fmt: function (v) { return nf(v, 0) + " kcal"; } }],
      grafico: function (v) {
        var NIVELES = [["🌿 Plantas", 1], ["🐛 Herbívoros", 0.1], ["🐦 Carnívoros", 0.01], ["🦅 Superdepredador", 0.001]];
        var s = '<svg viewBox="0 0 560 190" style="width:100%;max-width:560px;margin:0 auto">';
        NIVELES.forEach(function (n, i) {
          var kcal = v.e * n[1];
          var w = Math.max(8, 460 * Math.pow(0.55, i));
          var y = 150 - i * 44;
          s += '<rect x="' + (280 - w / 2) + '" y="' + y + '" width="' + w + '" height="34" rx="8" fill="color-mix(in srgb, var(--bio) ' + (85 - i * 18) + '%, var(--superficie))"/>';
          s += '<text x="280" y="' + (y + 22) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)">' + n[0] + " · " + nf(kcal, 0) + " kcal</text>";
        });
        return s + "</svg>";
      },
      nota: function (v) {
        return "De " + nf(v.e, 0) + " kcal vegetales, al águila le llegan <strong>" + nf(v.e * 0.001, 1) + "</strong>: cada eslabón quema ~90% en vivir. Por eso los depredadores son escasos, las cadenas cortas... y un kilo de carne cuesta ~10 de pienso.";
      },
      pie: "La ley del 10% de Lindeman: la ecología es una pirámide porque la termodinámica cobra peaje en cada bocado. (Los tóxicos suben la pirámide al revés: se concentran.)"
    })
  });

  /* ---------- Reina Roja ---------- */
  registrar({
    id: "sim-reinaroja", icono: "🏃", titulo: "Correr para quedarse", ley: "reina-roja",
    resumen: "Haz evolucionar a guepardo y gacela durante milenios y mide la caza.",
    render: simCurva({
      controles: [],
      botones: [
        { id: "evo", texto: "🧬 Evolucionar 100 000 años", accion: function (e) { e.gen += 1; e.guepardo += 4 + azar() * 2; e.gacela += 4 + azar() * 2; } },
        { id: "reset", texto: "Reiniciar", sec: true, accion: function (e) { e.gen = 0; e.guepardo = 60; e.gacela = 58; } }
      ],
      inicial: function (e) { e.gen = 0; e.guepardo = 60; e.gacela = 58; },
      grafico: function (v, e) {
        var g1 = [], g2 = [], caza = [];
        var gu = 60, ga = 58;
        for (var i = 0; i <= Math.max(10, e.gen); i++) {
          g1.push({ x: i, y: i <= e.gen ? 60 + (e.guepardo - 60) * (i / Math.max(1, e.gen)) : null });
        }
        g1 = [];
        var pasoGu = e.gen ? (e.guepardo - 60) / e.gen : 0;
        var pasoGa = e.gen ? (e.gacela - 58) / e.gen : 0;
        for (var k = 0; k <= e.gen; k++) {
          g1.push({ x: k, y: 60 + pasoGu * k });
          g2.push({ x: k, y: 58 + pasoGa * k });
          caza.push({ x: k, y: 30 });
        }
        if (e.gen === 0) { g1 = [{ x: 0, y: 60 }]; g2 = [{ x: 0, y: 58 }]; caza = [{ x: 0, y: 30 }]; }
        return {
          series: [
            { nombre: "Velocidad del guepardo", color: "var(--ges)", puntos: g1 },
            { nombre: "Velocidad de la gacela", color: "var(--bio)", puntos: g2 },
            { nombre: "% de cazas con éxito (¡constante!)", color: "var(--tinta-tenue)", puntos: caza }
          ], xMax: Math.max(10, e.gen), yMax: Math.max(105, e.guepardo + 10), xEtiq: "Eras (×100 000 años)", yEtiq: "Velocidad (km/h) / % éxito"
        };
      },
      nota: function (v, e) {
        return e.gen === 0 ? "Punto de partida: guepardo 60 km/h, gacela 58, éxito de caza ~30%." :
          "Tras " + e.gen + " eras: guepardo " + nf(e.guepardo, 0) + " km/h, gacela " + nf(e.gacela, 0) + " km/h... y el éxito de caza SIGUE en ~30%. Millones de años corriendo para quedarse en el mismo sitio.";
      },
      pie: "«Aquí hace falta correr a toda velocidad para permanecer en el mismo sitio» (la Reina Roja a Alicia). Los antibióticos y las bacterias juegan hoy esta carrera con nosotros dentro."
    })
  });

  /* ---------- Gause: exclusión competitiva ---------- */
  registrar({
    id: "sim-gause", icono: "🥊", titulo: "Un nicho, un inquilino", ley: "gause",
    resumen: "Junta dos especies con el mismo nicho... o repárteselo.",
    render: simCurva({
      controles: [{ id: "s", etiqueta: "Solapamiento de nichos", min: 30, max: 100, valor: 100, fmt: function (v) { return v + "%"; } }],
      grafico: function (v) {
        var a = v.s / 100;
        var n1 = 10, n2 = 9, K = 100;
        var s1 = [], s2 = [];
        for (var t = 0; t <= 60; t++) {
          s1.push({ x: t, y: n1 });
          s2.push({ x: t, y: n2 });
          var d1 = 0.22 * n1 * (1 - (n1 + a * n2) / K);
          var d2 = 0.2 * n2 * (1 - (n2 + a * n1) / K);
          n1 = Math.max(0.5, n1 + d1);
          n2 = Math.max(0.5, n2 + d2);
        }
        return {
          series: [
            { nombre: "Especie A (algo más eficiente)", color: "var(--bio)", puntos: s1 },
            { nombre: "Especie B", color: "var(--soc)", puntos: s2 }
          ], xMax: 60, yMax: 110, xEtiq: "Tiempo (generaciones)", yEtiq: "Población"
        };
      },
      nota: function (v) {
        return v.s >= 95 ? "☠️ Nicho idéntico: la especie A, apenas más eficiente, condena a la B a la extinción — el tubo de ensayo de Gause." :
          v.s >= 70 ? "Competencia dura: B malvive arrinconada. Cada punto menos de solapamiento es oxígeno." :
            "🤝 Nichos repartidos (horarios, pisos del árbol, presas distintas): ambas coexisten. La biodiversidad es un archivo de soluciones a este teorema.";
      },
      pie: "Dos especies no pueden ocupar exactamente el mismo nicho: la ardilla gris y la roja en Gran Bretaña lo demostraron a lo grande."
    })
  });

})();
