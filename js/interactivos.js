/* ==========================================================================
   Leyes de la Vida — Interactivos: simuladores, juegos y diagramas
   Autor: Jeshua Romero Guadarrama
   Cada interactivo: { id, icono, titulo, ley, resumen, render(contenedor) }.
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------- Utilidades ----------------------- */

  function esc(texto) {
    return String(texto).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function nf(n, dec) {
    return Number(n).toLocaleString("es", { maximumFractionDigits: dec == null ? 1 : dec });
  }

  /* Gráfico de líneas SVG genérico. series: [{nombre, color, puntos:[{x,y}]}] */
  function graficoLineas(cfg) {
    var W = cfg.ancho || 560, H = cfg.alto || 250;
    var m = { l: 46, r: 14, t: 14, b: 38 };
    var xMax = cfg.xMax, yMax = cfg.yMax, yMin = cfg.yMin || 0;
    if (xMax == null || yMax == null) {
      xMax = 0; yMax = 0;
      cfg.series.forEach(function (s) {
        s.puntos.forEach(function (p) {
          if (p.x > xMax) xMax = p.x;
          if (p.y > yMax) yMax = p.y;
        });
      });
      yMax = yMax * 1.08 || 1;
    }
    function X(v) { return m.l + (v / xMax) * (W - m.l - m.r); }
    function Y(v) { return H - m.b - ((v - yMin) / (yMax - yMin)) * (H - m.t - m.b); }
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" style="width:100%;max-width:' + W + 'px;margin:0 auto">';
    // Rejilla y ejes
    for (var i = 0; i <= 4; i++) {
      var yv = yMin + (i / 4) * (yMax - yMin);
      s += '<line x1="' + m.l + '" y1="' + Y(yv) + '" x2="' + (W - m.r) + '" y2="' + Y(yv) + '" stroke="var(--borde)" stroke-width="1"/>';
      s += '<text x="' + (m.l - 6) + '" y="' + (Y(yv) + 4) + '" text-anchor="end" font-size="10" fill="var(--tinta-tenue)">' + nf(yv, 1) + "</text>";
    }
    for (var j = 0; j <= 4; j++) {
      var xv = (j / 4) * xMax;
      s += '<text x="' + X(xv) + '" y="' + (H - m.b + 16) + '" text-anchor="middle" font-size="10" fill="var(--tinta-tenue)">' + nf(xv, 0) + "</text>";
    }
    if (cfg.xEtiq) s += '<text x="' + (m.l + (W - m.l - m.r) / 2) + '" y="' + (H - 4) + '" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">' + esc(cfg.xEtiq) + "</text>";
    if (cfg.yEtiq) s += '<text x="12" y="' + (m.t + (H - m.t - m.b) / 2) + '" text-anchor="middle" font-size="11" fill="var(--tinta-suave)" transform="rotate(-90 12 ' + (m.t + (H - m.t - m.b) / 2) + ')">' + esc(cfg.yEtiq) + "</text>";
    // Series
    cfg.series.forEach(function (serie) {
      var d = serie.puntos.map(function (p, k) {
        return (k ? "L" : "M") + X(p.x).toFixed(1) + " " + Y(p.y).toFixed(1);
      }).join(" ");
      s += '<path d="' + d + '" fill="none" stroke="' + serie.color + '" stroke-width="2.5" stroke-linejoin="round"/>';
    });
    // Puntos destacados
    (cfg.marcas || []).forEach(function (p) {
      s += '<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="6" fill="' + (p.color || "var(--acento)") + '" stroke="var(--superficie)" stroke-width="2"/>';
      if (p.texto) s += '<text x="' + X(p.x) + '" y="' + (Y(p.y) - 12) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--tinta)">' + esc(p.texto) + "</text>";
    });
    // Leyenda
    var lx = m.l + 8;
    cfg.series.forEach(function (serie) {
      if (!serie.nombre) return;
      s += '<rect x="' + lx + '" y="' + (m.t + 2) + '" width="12" height="4" rx="2" fill="' + serie.color + '"/>';
      s += '<text x="' + (lx + 16) + '" y="' + (m.t + 8) + '" font-size="11" fill="var(--tinta-suave)">' + esc(serie.nombre) + "</text>";
      lx += 16 + serie.nombre.length * 6 + 18;
    });
    return s + "</svg>";
  }

  /* Gráfico de barras con serie doble (observado vs esperado). */
  function graficoBarrasDoble(cfg) {
    var W = cfg.ancho || 560, H = 240;
    var m = { l: 40, r: 10, t: 16, b: 30 };
    var n = cfg.categorias.length;
    var yMax = Math.max.apply(null, cfg.a.valores.concat(cfg.b.valores)) * 1.15 || 1;
    var bw = (W - m.l - m.r) / n;
    function Y(v) { return H - m.b - (v / yMax) * (H - m.t - m.b); }
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" style="width:100%;max-width:' + W + 'px;margin:0 auto">';
    for (var i = 0; i <= 4; i++) {
      var yv = (i / 4) * yMax;
      s += '<line x1="' + m.l + '" y1="' + Y(yv) + '" x2="' + (W - m.r) + '" y2="' + Y(yv) + '" stroke="var(--borde)"/>';
      s += '<text x="' + (m.l - 5) + '" y="' + (Y(yv) + 4) + '" text-anchor="end" font-size="10" fill="var(--tinta-tenue)">' + nf(yv, 0) + "%</text>";
    }
    cfg.categorias.forEach(function (cat, k) {
      var x0 = m.l + k * bw;
      s += '<rect x="' + (x0 + bw * 0.12) + '" y="' + Y(cfg.a.valores[k]) + '" width="' + bw * 0.34 + '" height="' + (H - m.b - Y(cfg.a.valores[k])) + '" rx="2" fill="' + cfg.a.color + '"/>';
      s += '<rect x="' + (x0 + bw * 0.52) + '" y="' + Y(cfg.b.valores[k]) + '" width="' + bw * 0.34 + '" height="' + (H - m.b - Y(cfg.b.valores[k])) + '" rx="2" fill="' + cfg.b.color + '" opacity="0.55"/>';
      s += '<text x="' + (x0 + bw / 2) + '" y="' + (H - m.b + 14) + '" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">' + esc(cat) + "</text>";
    });
    s += '<rect x="' + m.l + '" y="2" width="12" height="8" rx="2" fill="' + cfg.a.color + '"/><text x="' + (m.l + 16) + '" y="10" font-size="11" fill="var(--tinta-suave)">' + esc(cfg.a.nombre) + "</text>";
    s += '<rect x="' + (m.l + 150) + '" y="2" width="12" height="8" rx="2" fill="' + cfg.b.color + '" opacity="0.55"/><text x="' + (m.l + 166) + '" y="10" font-size="11" fill="var(--tinta-suave)">' + esc(cfg.b.nombre) + "</text>";
    return s + "</svg>";
  }

  var azar = Math.random;

  function barajar(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(azar() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  /* ==========================================================
     1. Ley de Parkinson — el trabajo se expande
     ========================================================== */
  function simParkinson(cont) {
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<label>Plazo concedido: <strong id="pk-dias">14</strong> días</label>' +
      '<input type="range" id="pk-rango" min="4" max="30" value="14">' +
      "</div>" +
      '<div class="lienzo-sim" id="pk-lienzo"></div>' +
      '<p class="nota-sim">La tarea (preparar un informe) requiere unos <strong>4 días</strong> de trabajo efectivo. Mueve el plazo y observa cómo el trabajo «se expande»: el esfuerzo real apenas cambia, pero la espera, el perfeccionismo y las vueltas innecesarias llenan todo el tiempo disponible.</p>';
    var rango = cont.querySelector("#pk-rango");
    function pintar() {
      var plazo = +rango.value;
      cont.querySelector("#pk-dias").textContent = plazo;
      var extra = plazo - 4;
      var espera = extra * 0.55, perfec = extra * 0.30, vueltas = extra * 0.15;
      var partes = [
        { nombre: "Aplazamiento", dias: espera, color: "var(--tinta-tenue)" },
        { nombre: "Perfeccionismo estéril", dias: perfec, color: "var(--ges)" },
        { nombre: "Reuniones y vueltas", dias: vueltas, color: "var(--soc)" },
        { nombre: "Trabajo real", dias: 4, color: "var(--est)" }
      ];
      var W = 560, H = 120, x = 0;
      var s = '<svg viewBox="0 0 ' + W + " " + (H + 40) + '" style="width:100%;max-width:560px;margin:0 auto">';
      partes.forEach(function (p) {
        var w = (p.dias / plazo) * W;
        if (w < 0.5) return;
        s += '<rect x="' + x + '" y="20" width="' + Math.max(w - 2, 1) + '" height="54" rx="6" fill="' + p.color + '"/>';
        if (w > 60) s += '<text x="' + (x + w / 2) + '" y="50" text-anchor="middle" font-size="11" font-weight="700" fill="var(--superficie)">' + nf(p.dias, 1) + " d</text>";
        x += w;
      });
      var ly = 96;
      x = 0;
      partes.forEach(function (p) {
        s += '<rect x="' + x + '" y="' + ly + '" width="10" height="10" rx="2" fill="' + p.color + '"/><text x="' + (x + 14) + '" y="' + (ly + 9) + '" font-size="11" fill="var(--tinta-suave)">' + p.nombre + "</text>";
        x += 14 + p.nombre.length * 6.2 + 16;
      });
      s += '<text x="0" y="14" font-size="12" font-weight="700" fill="var(--tinta)">Plazo: ' + plazo + " días · Trabajo efectivo: 4 días (" + nf((4 / plazo) * 100, 0) + "% del tiempo)</text>";
      s += "</svg>";
      cont.querySelector("#pk-lienzo").innerHTML = s;
    }
    rango.addEventListener("input", pintar);
    pintar();
  }

  /* ==========================================================
     2. Ley de Sturgeon — la criba del 90%
     ========================================================== */
  function simSturgeon(cont) {
    cont.innerHTML =
      '<p class="marcador">Reveladas: <span id="st-total">0</span> · Joyas 💎: <span id="st-joyas" class="ok">0</span> · Basura 🗑️: <span id="st-basura" class="mal">0</span> · Proporción de basura: <span id="st-prop">—</span></p>' +
      '<div class="rejilla-criba" id="st-rejilla"></div>' +
      '<div class="fila-controles" style="margin-top:12px">' +
      '<button class="boton-sim secundario" id="st-todo">Revelar todo</button>' +
      '<button class="boton-sim secundario" id="st-reiniciar">Nueva colección</button>' +
      "</div>" +
      '<p class="nota-sim">Cada casilla es una obra: una película, un artículo, una startup. Destapa unas cuantas al azar. Sturgeon predice que ~90% será basura... pero el campo se juzga por sus joyas, no por su promedio.</p>';
    var rejilla = cont.querySelector("#st-rejilla");
    var estado;
    function reiniciar() {
      estado = { joyas: 0, basura: 0 };
      var celdas = [];
      for (var i = 0; i < 100; i++) celdas.push(i < 10);
      barajar(celdas);
      rejilla.innerHTML = "";
      celdas.forEach(function (esJoya) {
        var b = document.createElement("button");
        b.className = "celda-criba";
        b.textContent = "❔";
        b.addEventListener("click", function () {
          if (b.classList.contains("revelada")) return;
          b.classList.add("revelada");
          if (esJoya) { b.classList.add("joya"); b.textContent = "💎"; estado.joyas++; }
          else { b.textContent = "🗑️"; estado.basura++; }
          actualizar();
        });
        rejilla.appendChild(b);
      });
      actualizar();
    }
    function actualizar() {
      var total = estado.joyas + estado.basura;
      cont.querySelector("#st-total").textContent = total;
      cont.querySelector("#st-joyas").textContent = estado.joyas;
      cont.querySelector("#st-basura").textContent = estado.basura;
      cont.querySelector("#st-prop").textContent = total ? nf((estado.basura / total) * 100, 0) + "%" : "—";
    }
    cont.querySelector("#st-todo").addEventListener("click", function () {
      rejilla.querySelectorAll(".celda-criba:not(.revelada)").forEach(function (b) { b.click(); });
    });
    cont.querySelector("#st-reiniciar").addEventListener("click", reiniciar);
    reiniciar();
  }

  /* ==========================================================
     3. Ley de Goodhart — cuando la métrica se vuelve objetivo
     ========================================================== */
  function simGoodhart(cont) {
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<label>Presión sobre la métrica: <strong id="gh-valor">0</strong>%</label>' +
      '<input type="range" id="gh-rango" min="0" max="100" value="0">' +
      "</div>" +
      '<div class="lienzo-sim" id="gh-lienzo"></div>' +
      '<p class="nota-sim">Un centro de atención mide «llamadas atendidas por hora». Sin presión, la métrica refleja el servicio real. A medida que los sueldos dependen de ella, los operadores la inflan (cuelgan antes, trocean llamadas) y la métrica se despega de la realidad que debía medir: sube el número, se hunde el servicio.</p>';
    var rango = cont.querySelector("#gh-rango");
    function pintar() {
      var p = +rango.value / 100;
      cont.querySelector("#gh-valor").textContent = rango.value;
      var metrica = [], real = [];
      for (var t = 0; t <= 24; t++) {
        var mejoraNatural = 50 + t * 0.9;
        metrica.push({ x: t, y: Math.min(100, mejoraNatural + t * p * 2.4) });
        real.push({ x: t, y: Math.max(8, mejoraNatural - t * p * 2.6) });
      }
      cont.querySelector("#gh-lienzo").innerHTML = graficoLineas({
        series: [
          { nombre: "Métrica (llamadas/hora)", color: "var(--tec)", puntos: metrica },
          { nombre: "Servicio real (problemas resueltos)", color: "var(--est)", puntos: real }
        ],
        xMax: 24, yMax: 105, xEtiq: "Meses desde que la métrica se volvió objetivo", yEtiq: "Índice (0–100)"
      }) + '<p class="nota-sim" style="margin-top:8px">Brecha final entre lo medido y lo real: <strong>' +
        nf(metrica[24].y - real[24].y, 0) + " puntos</strong>." + (p > 0.5 ? " La medida ha dejado de ser una buena medida." : "") + "</p>";
    }
    rango.addEventListener("input", pintar);
    pintar();
  }

  /* ==========================================================
     4. Ley de Gresham — monedas buenas y malas
     ========================================================== */
  function simGresham(cont) {
    var estado;
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<button class="boton-sim" id="gr-dia">Avanzar un día de mercado</button>' +
      '<button class="boton-sim secundario" id="gr-auto">Simular 10 días</button>' +
      '<button class="boton-sim secundario" id="gr-reiniciar">Reiniciar</button>' +
      "</div>" +
      '<div class="lienzo-sim">' +
      '<p style="margin:0 0 6px"><strong>🏪 En circulación</strong> (con lo que la gente paga): <span id="gr-circ-n"></span></p>' +
      '<div class="fila-monedas" id="gr-circ"></div>' +
      '<p style="margin:14px 0 6px"><strong>🔒 Atesoradas</strong> (guardadas bajo el colchón): <span id="gr-ates-n"></span></p>' +
      '<div class="fila-monedas" id="gr-ates"></div>' +
      "</div>" +
      '<p class="nota-sim">Circulan monedas de <strong>plata buena</strong> (B) y monedas <strong>devaluadas</strong> (M) con el mismo valor legal. Cada día, la gente paga con las malas y guarda las buenas que recibe. Observa quién acaba dominando la calle.</p>';
    function reiniciar() {
      estado = { circBuenas: 18, circMalas: 18, atesoradas: 0 };
      pintar();
    }
    function dia() {
      // Cada día, parte de las monedas buenas que cambian de manos se atesora.
      var movidas = Math.min(estado.circBuenas, Math.max(1, Math.round(estado.circBuenas * 0.28)));
      estado.circBuenas -= movidas;
      estado.atesoradas += movidas;
      pintar();
    }
    function fila(idsel, buenas, malas) {
      var f = cont.querySelector(idsel), html = "";
      for (var i = 0; i < buenas; i++) html += '<span class="moneda moneda-buena" title="Moneda buena">B</span>';
      for (var j = 0; j < malas; j++) html += '<span class="moneda moneda-mala" title="Moneda devaluada">M</span>';
      f.innerHTML = html || '<em style="color:var(--tinta-tenue)">vacío</em>';
    }
    function pintar() {
      fila("#gr-circ", estado.circBuenas, estado.circMalas);
      fila("#gr-ates", estado.atesoradas, 0);
      var total = estado.circBuenas + estado.circMalas;
      cont.querySelector("#gr-circ-n").textContent = nf((estado.circMalas / total) * 100, 0) + "% moneda mala";
      cont.querySelector("#gr-ates-n").textContent = estado.atesoradas + " monedas buenas";
      cont.querySelector("#gr-dia").disabled = estado.circBuenas === 0;
      if (estado.circBuenas === 0) {
        cont.querySelector("#gr-circ-n").textContent += " — el dinero malo expulsó al bueno";
      }
    }
    cont.querySelector("#gr-dia").addEventListener("click", dia);
    cont.querySelector("#gr-auto").addEventListener("click", function () {
      for (var i = 0; i < 10 && estado.circBuenas > 0; i++) dia();
    });
    cont.querySelector("#gr-reiniciar").addEventListener("click", reiniciar);
    reiniciar();
  }

  /* ==========================================================
     5. Ley de Hick — juego de reacción con opciones
     ========================================================== */
  function simHick(cont) {
    var COLORES = [
      ["Rojo", "#dc2626"], ["Azul", "#2563eb"], ["Verde", "#059669"], ["Amarillo", "#d9a504"],
      ["Morado", "#7c3aed"], ["Naranja", "#ea580c"], ["Rosa", "#db2777"], ["Turquesa", "#0e7490"]
    ];
    var registro = { 2: [], 4: [], 8: [] };
    var actual = null;
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<label>Opciones en pantalla:</label>' +
      '<button class="chip activo" data-n="2">2</button>' +
      '<button class="chip" data-n="4">4</button>' +
      '<button class="chip" data-n="8">8</button>' +
      '<button class="boton-sim" id="hk-jugar">Nueva ronda</button>' +
      "</div>" +
      '<p class="pregunta-quiz" id="hk-consigna" style="text-align:center">Pulsa «Nueva ronda» y haz clic en el color indicado lo más rápido posible.</p>' +
      '<div class="zona-objetivos" id="hk-zona"></div>' +
      '<div class="lienzo-sim"><table class="tabla-sim"><thead><tr><th>Opciones</th><th>Rondas</th><th>Tiempo medio</th></tr></thead><tbody id="hk-tabla"></tbody></table></div>' +
      '<p class="nota-sim">Juega varias rondas con 2, 4 y 8 opciones. Tu tiempo no se duplica al duplicar las opciones: crece con el <strong>logaritmo</strong> del número de alternativas, tal y como predice Hick.</p>';
    var n = 2, t0 = 0;
    cont.querySelectorAll(".chip[data-n]").forEach(function (ch) {
      ch.addEventListener("click", function () {
        cont.querySelectorAll(".chip[data-n]").forEach(function (o) { o.classList.remove("activo"); });
        ch.classList.add("activo");
        n = +ch.dataset.n;
      });
    });
    function ronda() {
      var opciones = barajar(COLORES.slice()).slice(0, n);
      actual = opciones[Math.floor(azar() * n)];
      cont.querySelector("#hk-consigna").innerHTML = "Pulsa: <strong style=\"color:" + actual[1] + '">' + actual[0] + "</strong>";
      var zona = cont.querySelector("#hk-zona");
      zona.innerHTML = "";
      barajar(opciones.slice()).forEach(function (op) {
        var b = document.createElement("button");
        b.className = "boton-color";
        b.style.background = op[1];
        b.title = op[0];
        b.addEventListener("click", function () {
          if (!actual) return;
          if (op[0] === actual[0]) {
            registro[n].push(performance.now() - t0);
            actual = null;
            zona.innerHTML = '<p class="marcador ok" style="color:var(--ok)">✔ ' + nf(registro[n][registro[n].length - 1], 0) + " ms</p>";
            tabla();
          } else {
            b.style.opacity = 0.3;
          }
        });
        zona.appendChild(b);
      });
      t0 = performance.now();
    }
    function tabla() {
      cont.querySelector("#hk-tabla").innerHTML = [2, 4, 8].map(function (k) {
        var v = registro[k];
        var media = v.length ? nf(v.reduce(function (a, b) { return a + b; }, 0) / v.length, 0) + " ms" : "—";
        return "<tr><td>" + k + "</td><td>" + v.length + "</td><td><strong>" + media + "</strong></td></tr>";
      }).join("");
    }
    cont.querySelector("#hk-jugar").addEventListener("click", ronda);
    tabla();
  }

  /* ==========================================================
     6. Ley de Fitts — dianas
     ========================================================== */
  function simFitts(cont) {
    cont.innerHTML =
      '<div class="fila-controles"><button class="boton-sim" id="ft-inicio">Empezar (10 dianas)</button><span class="marcador" id="ft-marca"></span></div>' +
      '<div class="campo-fitts" id="ft-campo"></div>' +
      '<div class="lienzo-sim"><table class="tabla-sim"><thead><tr><th>#</th><th>Distancia</th><th>Tamaño</th><th>Dificultad (ID)</th><th>Tiempo</th></tr></thead><tbody id="ft-tabla"></tbody></table></div>' +
      '<p class="nota-sim">Haz clic en cada diana. La <strong>dificultad</strong> ID = log₂(2D/W) combina distancia (D) y anchura (W): comprueba en la tabla cómo tu tiempo sube con la dificultad, no con la distancia a secas. Es la ley que decide el tamaño de cada botón que usas.</p>';
    var campo = cont.querySelector("#ft-campo");
    var datos = [], t0 = 0, ultima = null, restantes = 0;
    function diana() {
      campo.innerHTML = "";
      var r = 12 + azar() * 30;
      var x = r + 10 + azar() * (campo.clientWidth - 2 * r - 20);
      var y = r + 10 + azar() * (campo.clientHeight - 2 * r - 20);
      var b = document.createElement("button");
      b.className = "diana";
      b.style.width = b.style.height = r * 2 + "px";
      b.style.left = x + "px";
      b.style.top = y + "px";
      b.addEventListener("click", function (ev) {
        var t = performance.now() - t0;
        if (ultima) {
          var d = Math.hypot(x - ultima.x, y - ultima.y);
          var id = Math.log2((2 * d) / (r * 2));
          datos.push({ d: d, w: r * 2, id: id, t: t });
          tabla();
        }
        ultima = { x: x, y: y };
        restantes--;
        if (restantes > 0) { t0 = performance.now(); diana(); }
        else {
          campo.innerHTML = '<p class="marcador" style="padding:20px;text-align:center">¡Completado! Revisa la tabla: a más ID, más tiempo.</p>';
          cont.querySelector("#ft-marca").textContent = "";
        }
        ev.stopPropagation();
      });
      campo.appendChild(b);
    }
    function tabla() {
      cont.querySelector("#ft-tabla").innerHTML = datos.map(function (f, i) {
        return "<tr><td>" + (i + 1) + "</td><td>" + nf(f.d, 0) + " px</td><td>" + nf(f.w, 0) + " px</td><td>" + nf(f.id, 2) + "</td><td><strong>" + nf(f.t, 0) + " ms</strong></td></tr>";
      }).join("");
    }
    cont.querySelector("#ft-inicio").addEventListener("click", function () {
      datos = []; ultima = null; restantes = 10;
      tabla();
      cont.querySelector("#ft-marca").textContent = "¡Dale!";
      t0 = performance.now();
      diana();
    });
  }

  /* ==========================================================
     7. Efecto Dunning-Kruger — la curva de la confianza
     ========================================================== */
  function simDunning(cont) {
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<label>Experiencia acumulada: <strong id="dk-val">5</strong>%</label>' +
      '<input type="range" id="dk-rango" min="0" max="100" value="5">' +
      "</div>" +
      '<div class="lienzo-sim" id="dk-lienzo"></div>' +
      '<p class="marcador" id="dk-etapa" style="text-align:center"></p>' +
      '<p class="nota-sim">Desliza la experiencia y recorre la curva popular del efecto: el «monte de la estupidez» (mucha confianza, poco saber), el «valle de la desesperación» (descubres cuánto ignoras) y la lenta «pendiente de la ilustración». La versión académica es más sutil, pero la experiencia de aprender se parece mucho a esto.</p>';
    function curva(x) {
      // x en [0,100] → confianza en [0,100]
      var monte = 88 * Math.exp(-Math.pow((x - 7) / 7.5, 2));
      var meseta = 78 / (1 + Math.exp(-(x - 62) / 12));
      return Math.max(4, monte + meseta);
    }
    var rango = cont.querySelector("#dk-rango");
    function pintar() {
      var x = +rango.value;
      cont.querySelector("#dk-val").textContent = x;
      var pts = [];
      for (var i = 0; i <= 100; i++) pts.push({ x: i, y: curva(i) });
      cont.querySelector("#dk-lienzo").innerHTML = graficoLineas({
        series: [{ nombre: "Confianza en uno mismo", color: "var(--psi)", puntos: pts }],
        xMax: 100, yMax: 100, xEtiq: "Competencia real (experiencia)", yEtiq: "Confianza",
        marcas: [{ x: x, y: curva(x), color: "var(--acento)", texto: "tú" }]
      });
      var etapa = x < 16 ? "⛰️ Monte de la estupidez: «esto está tirado»" :
        x < 40 ? "🕳️ Valle de la desesperación: «no sé nada»" :
          x < 75 ? "🧗 Pendiente de la ilustración: «voy entendiendo»" :
            "🏔️ Meseta de la solidez: confianza ganada a pulso";
      cont.querySelector("#dk-etapa").textContent = etapa;
    }
    rango.addEventListener("input", pintar);
    pintar();
  }

  /* ==========================================================
     8. Ley de Yerkes-Dodson — la U invertida del estrés
     ========================================================== */
  function simYerkes(cont) {
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<label>Activación / estrés: <strong id="yd-val">30</strong>%</label>' +
      '<input type="range" id="yd-rango" min="0" max="100" value="30">' +
      '<select id="yd-tarea"><option value="compleja">Tarea compleja (examen, cirugía)</option><option value="simple">Tarea simple (fuerza, resistencia)</option></select>' +
      "</div>" +
      '<div class="lienzo-sim" id="yd-lienzo"></div>' +
      '<p class="marcador" id="yd-nota" style="text-align:center"></p>' +
      '<p class="nota-sim">La curva es una U invertida: sin activación no hay energía; con demasiada, la ansiedad bloquea. El óptimo de una tarea compleja está mucho más a la izquierda que el de una simple: por eso conviene llegar «encendido» al gimnasio y sereno al examen.</p>';
    var rango = cont.querySelector("#yd-rango"), sel = cont.querySelector("#yd-tarea");
    function rendimiento(x, tarea) {
      var opt = tarea === "simple" ? 68 : 42;
      var ancho = tarea === "simple" ? 34 : 24;
      return 95 * Math.exp(-Math.pow((x - opt) / ancho, 2));
    }
    function pintar() {
      var x = +rango.value, tarea = sel.value;
      cont.querySelector("#yd-val").textContent = x;
      var pts = [];
      for (var i = 0; i <= 100; i++) pts.push({ x: i, y: rendimiento(i, tarea) });
      var y = rendimiento(x, tarea);
      cont.querySelector("#yd-lienzo").innerHTML = graficoLineas({
        series: [{ nombre: "Rendimiento", color: "var(--psi)", puntos: pts }],
        xMax: 100, yMax: 100, xEtiq: "Nivel de activación (arousal)", yEtiq: "Rendimiento",
        marcas: [{ x: x, y: y, color: "var(--acento)", texto: nf(y, 0) + "%" }]
      });
      cont.querySelector("#yd-nota").textContent =
        y > 80 ? "🎯 Zona óptima: tensión justa para rendir." :
          x < 30 ? "😴 Poca activación: falta chispa." : "😵 Demasiado estrés: la ansiedad resta.";
    }
    rango.addEventListener("input", pintar);
    sel.addEventListener("change", pintar);
    pintar();
  }

  /* ==========================================================
     9. Ley de Benford — el detector de fraudes
     ========================================================== */
  function simBenford(cont) {
    var POBLACIONES = [1439323776, 1380004385, 331002651, 273523615, 220892340, 212559417, 206139589, 164689383, 145934462, 128932753, 126476461, 109581078, 102334404, 97338579, 89561403, 84339067, 83783942, 83992949, 69799978, 67886011, 65273511, 60461826, 59734218, 54409800, 51269185, 46754778, 45195774, 43849260, 41487805, 38928346, 37846611, 36910560, 33469203, 32971854, 32365999, 31072940, 29825964, 29136808, 28435940, 26545863, 25778816, 24206644, 23816775, 21413249, 20903273, 19237691, 19116201, 18776707, 17915568, 17134872, 16743927, 16425864, 15893222, 15413001, 14862924, 13132795, 12952218, 11890784, 11673021, 11402528, 11326616, 10847910, 10708981, 10423054, 10099265, 9890402, 9660351, 9449323, 9006398, 8947024, 8737371, 8655535, 8278724, 7976983, 7132538, 6825445, 6624554, 6486205, 5850342, 5518087];
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<label>Conjunto de datos:</label>' +
      '<select id="bf-datos">' +
      '<option value="pob">Poblaciones de 80 países</option>' +
      '<option value="fib">Sucesión de Fibonacci (80 términos)</option>' +
      '<option value="pot">Potencias de 2 (1 a 2⁶⁰)</option>' +
      '<option value="uni">Números inventados al azar (uniformes)</option>' +
      "</select></div>" +
      '<div class="lienzo-sim" id="bf-lienzo"></div>' +
      '<p class="nota-sim" id="bf-nota"></p>';
    var sel = cont.querySelector("#bf-datos");
    function primerDigito(n) {
      var s = String(Math.abs(n));
      for (var i = 0; i < s.length; i++) if (s[i] >= "1" && s[i] <= "9") return +s[i];
      return null;
    }
    function conjunto(clave) {
      if (clave === "pob") return POBLACIONES;
      if (clave === "fib") { var f = [1, 1]; while (f.length < 80) f.push(f[f.length - 1] + f[f.length - 2]); return f; }
      if (clave === "pot") { var p = [], v = 1; for (var i = 0; i < 60; i++) { v *= 2; p.push(v); } return p; }
      var u = []; for (var j = 0; j < 200; j++) u.push(1 + Math.floor(azar() * 999)); return u;
    }
    function pintar() {
      var datos = conjunto(sel.value);
      var cuenta = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      datos.forEach(function (n) { var d = primerDigito(n); if (d) cuenta[d - 1]++; });
      var obs = cuenta.map(function (c) { return (c / datos.length) * 100; });
      var ben = [];
      for (var d = 1; d <= 9; d++) ben.push(Math.log10(1 + 1 / d) * 100);
      cont.querySelector("#bf-lienzo").innerHTML = graficoBarrasDoble({
        categorias: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        a: { nombre: "Observado", color: "var(--est)", valores: obs },
        b: { nombre: "Benford (esperado)", color: "var(--tinta-tenue)", valores: ben }
      });
      cont.querySelector("#bf-nota").innerHTML = sel.value === "uni" ?
        "Los números <strong>inventados al azar</strong> reparten el primer dígito casi por igual (~11% cada uno) y <strong>no</strong> siguen a Benford: así delatan los auditores una contabilidad fabricada." :
        "Los datos reales que crecen multiplicativamente empiezan por <strong>1</strong> cerca del 30% de las veces. La barra observada abraza la curva de Benford.";
    }
    sel.addEventListener("change", pintar);
    pintar();
  }

  /* ==========================================================
     10. Ley de Zipf — analiza tu propio texto
     ========================================================== */
  function simZipf(cont) {
    var TEXTO = "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda. El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza que así ensillaba el rocín como tomaba la podadera. Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza. Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben, aunque por conjeturas verosímiles se deja entender que se llamaba Quijana. Pero esto importa poco a nuestro cuento: basta que en la narración dél no se salga un punto de la verdad.";
    cont.innerHTML =
      '<textarea class="entrada-texto" id="zf-texto"></textarea>' +
      '<div class="fila-controles"><button class="boton-sim" id="zf-analizar">Analizar frecuencias</button></div>' +
      '<div class="lienzo-sim" id="zf-lienzo"></div>' +
      '<p class="nota-sim">Pega cualquier texto (cuanto más largo, mejor). La palabra más frecuente aparecerá cerca del doble que la segunda y el triple que la tercera: la curva observada sigue de cerca la referencia 1/rango de Zipf.</p>';
    cont.querySelector("#zf-texto").value = TEXTO;
    function analizar() {
      var texto = cont.querySelector("#zf-texto").value.toLowerCase();
      var palabras = texto.match(/[a-záéíóúüñ]+/g) || [];
      var mapa = {};
      palabras.forEach(function (p) { mapa[p] = (mapa[p] || 0) + 1; });
      var lista = Object.keys(mapa).map(function (p) { return { p: p, n: mapa[p] }; })
        .sort(function (a, b) { return b.n - a.n; }).slice(0, 12);
      if (!lista.length) return;
      var f1 = lista[0].n;
      var obs = lista.map(function (e, i) { return { x: i + 1, y: e.n }; });
      var ref = lista.map(function (e, i) { return { x: i + 1, y: f1 / (i + 1) }; });
      cont.querySelector("#zf-lienzo").innerHTML =
        graficoLineas({
          series: [
            { nombre: "Frecuencia observada", color: "var(--est)", puntos: obs },
            { nombre: "Referencia Zipf (f₁/rango)", color: "var(--tinta-tenue)", puntos: ref }
          ],
          xMax: 12, xEtiq: "Rango de la palabra", yEtiq: "Apariciones"
        }) +
        '<table class="tabla-sim" style="margin-top:10px"><thead><tr><th>Rango</th><th>Palabra</th><th>Apariciones</th><th>Zipf predice</th></tr></thead><tbody>' +
        lista.map(function (e, i) {
          return "<tr><td>" + (i + 1) + "</td><td><strong>" + esc(e.p) + "</strong></td><td>" + e.n + "</td><td>" + nf(f1 / (i + 1), 1) + "</td></tr>";
        }).join("") + "</tbody></table>";
    }
    cont.querySelector("#zf-analizar").addEventListener("click", analizar);
    analizar();
  }

  /* ==========================================================
     11. Principio de Pareto — el 80/20 en acción
     ========================================================== */
  function simPareto(cont) {
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<button class="boton-sim secundario" id="pa-nuevo">Generar nuevos clientes</button>' +
      '<label>Mejores clientes considerados: <strong id="pa-val">20</strong>%</label>' +
      '<input type="range" id="pa-rango" min="5" max="100" step="5" value="20">' +
      "</div>" +
      '<div class="lienzo-sim" id="pa-lienzo"></div>' +
      '<p class="marcador" id="pa-nota" style="text-align:center"></p>' +
      '<p class="nota-sim">Cada barra es un cliente ordenado por facturación (distribución de Pareto simulada). Mueve el control: el mejor ~20% de los clientes concentra en torno al ~80% de las ventas.</p>';
    var ventas = [];
    function generar() {
      ventas = [];
      for (var i = 0; i < 50; i++) ventas.push(Math.pow(1 / (1 - azar() * 0.985), 0.9));
      ventas.sort(function (a, b) { return b - a; });
      pintar();
    }
    function pintar() {
      var pct = +cont.querySelector("#pa-rango").value;
      cont.querySelector("#pa-val").textContent = pct;
      var total = ventas.reduce(function (a, b) { return a + b; }, 0);
      var k = Math.round((pct / 100) * ventas.length);
      var parte = ventas.slice(0, k).reduce(function (a, b) { return a + b; }, 0);
      var W = 560, H = 220, m = { l: 40, r: 10, t: 10, b: 26 };
      var max = ventas[0];
      var bw = (W - m.l - m.r) / ventas.length;
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
      var acum = 0;
      var linea = "";
      ventas.forEach(function (v, i) {
        var h = (v / max) * (H - m.t - m.b);
        s += '<rect x="' + (m.l + i * bw) + '" y="' + (H - m.b - h) + '" width="' + (bw - 1) + '" height="' + h + '" fill="' + (i < k ? "var(--eco)" : "var(--borde)") + '"/>';
        acum += v;
        var cy = H - m.b - (acum / total) * (H - m.t - m.b);
        linea += (i ? "L" : "M") + (m.l + i * bw + bw / 2).toFixed(1) + " " + cy.toFixed(1);
      });
      s += '<path d="' + linea + '" fill="none" stroke="var(--acento)" stroke-width="2.5"/>';
      s += '<text x="' + (W - m.r) + '" y="' + (m.t + 10) + '" text-anchor="end" font-size="11" fill="var(--acento)">— % acumulado de ventas</text>';
      s += '<text x="' + (m.l + (W - m.l - m.r) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">Clientes ordenados por facturación</text>';
      s += "</svg>";
      cont.querySelector("#pa-lienzo").innerHTML = s;
      cont.querySelector("#pa-nota").innerHTML = "El mejor <strong>" + pct + "%</strong> de clientes genera el <strong>" + nf((parte / total) * 100, 0) + "%</strong> de las ventas.";
    }
    cont.querySelector("#pa-rango").addEventListener("input", pintar);
    cont.querySelector("#pa-nuevo").addEventListener("click", generar);
    generar();
  }

  /* ==========================================================
     12. Ley de los grandes números — lanza monedas
     ========================================================== */
  function simGrandes(cont) {
    var historia = [], caras = 0;
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<button class="boton-sim" data-n="1">Lanzar 1</button>' +
      '<button class="boton-sim" data-n="100">Lanzar 100</button>' +
      '<button class="boton-sim" data-n="5000">Lanzar 5000</button>' +
      '<button class="boton-sim secundario" id="gn-reiniciar">Reiniciar</button>' +
      "</div>" +
      '<p class="marcador" id="gn-marca" style="text-align:center">Aún no has lanzado la moneda.</p>' +
      '<div class="lienzo-sim" id="gn-lienzo"></div>' +
      '<p class="nota-sim">Con pocos lanzamientos la proporción de caras baila lejos del 50%; con miles, la línea se pega a la teórica. El azar es salvaje en corto y dócil en largo: de esto viven casinos y aseguradoras.</p>';
    function lanzar(n) {
      for (var i = 0; i < n; i++) {
        if (azar() < 0.5) caras++;
        var total = historia.length + 1;
        if (total <= 200 || total % Math.ceil(total / 200) === 0 || i === n - 1) {
          historia.push({ x: total, y: (caras / total) * 100 });
        } else {
          historia.push(null);
        }
      }
      historia = historia.filter(Boolean);
      pintar();
    }
    function pintar() {
      var total = historia.length ? historia[historia.length - 1].x : 0;
      cont.querySelector("#gn-marca").innerHTML = total ?
        "Lanzamientos: <strong>" + nf(total, 0) + "</strong> · Caras: <strong>" + nf((caras / total) * 100, 2) + "%</strong> (teórico: 50%)" :
        "Aún no has lanzado la moneda.";
      if (!total) { cont.querySelector("#gn-lienzo").innerHTML = ""; return; }
      cont.querySelector("#gn-lienzo").innerHTML = graficoLineas({
        series: [
          { nombre: "% de caras acumulado", color: "var(--est)", puntos: historia },
          { nombre: "50% teórico", color: "var(--tinta-tenue)", puntos: [{ x: 1, y: 50 }, { x: total, y: 50 }] }
        ],
        xMax: total, yMax: 100, xEtiq: "Número de lanzamientos", yEtiq: "% de caras"
      });
    }
    cont.querySelectorAll("[data-n]").forEach(function (b) {
      b.addEventListener("click", function () { lanzar(+b.dataset.n); });
    });
    cont.querySelector("#gn-reiniciar").addEventListener("click", function () {
      historia = []; caras = 0; pintar();
    });
  }

  /* ==========================================================
     13. Curva del olvido — el poder del repaso
     ========================================================== */
  function simOlvido(cont) {
    var repasos = [];
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<label>Añadir repaso en el día: <strong id="ol-val">3</strong></label>' +
      '<input type="range" id="ol-rango" min="1" max="29" value="3">' +
      '<button class="boton-sim" id="ol-anadir">📚 Repasar</button>' +
      '<button class="boton-sim secundario" id="ol-reiniciar">Reiniciar</button>' +
      "</div>" +
      '<div class="lienzo-sim" id="ol-lienzo"></div>' +
      '<p class="nota-sim">Estudias un tema el día 0. Sin repasos, la retención se desploma en días (curva de Ebbinghaus). Añade repasos espaciados: cada uno restaura la memoria y <strong>aplana</strong> la caída siguiente. Es el fundamento de la repetición espaciada.</p>';
    var rango = cont.querySelector("#ol-rango");
    rango.addEventListener("input", function () { cont.querySelector("#ol-val").textContent = rango.value; });
    function retencion() {
      var pts = [], s = 1.6;
      var eventos = [0].concat(repasos.slice().sort(function (a, b) { return a - b; }));
      for (var t = 0; t <= 30; t += 0.25) {
        var ultimo = 0, fuerza = 1.6, n = 0;
        eventos.forEach(function (e) { if (e <= t) { ultimo = e; n++; } });
        fuerza = 1.6 * Math.pow(2.2, n - 1);
        pts.push({ x: t, y: 100 * Math.exp(-(t - ultimo) / fuerza) });
      }
      return pts;
    }
    function pintar() {
      var sin = [];
      for (var t = 0; t <= 30; t += 0.25) sin.push({ x: t, y: 100 * Math.exp(-t / 1.6) });
      var marcas = repasos.map(function (d) { return { x: d, y: 100, color: "var(--acento)", texto: "repaso" }; });
      cont.querySelector("#ol-lienzo").innerHTML = graficoLineas({
        series: [
          { nombre: "Con tus repasos", color: "var(--est)", puntos: retencion() },
          { nombre: "Sin repasar", color: "var(--tinta-tenue)", puntos: sin }
        ],
        xMax: 30, yMax: 105, xEtiq: "Días desde el estudio inicial", yEtiq: "Retención (%)",
        marcas: marcas
      });
    }
    cont.querySelector("#ol-anadir").addEventListener("click", function () {
      var d = +rango.value;
      if (repasos.indexOf(d) === -1) repasos.push(d);
      pintar();
    });
    cont.querySelector("#ol-reiniciar").addEventListener("click", function () { repasos = []; pintar(); });
    pintar();
  }

  /* ==========================================================
     14. Ley de Brooks — más gente, más lento
     ========================================================== */
  function simBrooks(cont) {
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<label>Tamaño del equipo: <strong id="br-val">4</strong> personas</label>' +
      '<input type="range" id="br-rango" min="2" max="20" value="4">' +
      "</div>" +
      '<div class="lienzo-sim" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center" id="br-lienzo"></div>' +
      '<p class="marcador" id="br-nota" style="text-align:center"></p>' +
      '<p class="nota-sim">Cada persona nueva añade manos... y canales de comunicación: n(n−1)/2. La producción neta (manos menos coordinación) crece cada vez menos y llega a caer. Por eso añadir gente a un proyecto retrasado lo retrasa más: los canales llegan antes que la ayuda.</p>';
    var rango = cont.querySelector("#br-rango");
    function pintar() {
      var n = +rango.value;
      cont.querySelector("#br-val").textContent = n;
      var canales = (n * (n - 1)) / 2;
      // Red de comunicación
      var R = 78, cx = 100, cy = 100;
      var s = '<svg viewBox="0 0 200 200" style="max-width:220px;margin:0 auto">';
      var pos = [];
      for (var i = 0; i < n; i++) {
        var a = (i / n) * Math.PI * 2 - Math.PI / 2;
        pos.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
      }
      for (var p = 0; p < n; p++) for (var q = p + 1; q < n; q++) {
        s += '<line x1="' + pos[p][0] + '" y1="' + pos[p][1] + '" x2="' + pos[q][0] + '" y2="' + pos[q][1] + '" stroke="var(--tec)" stroke-width="0.8" opacity="0.5"/>';
      }
      pos.forEach(function (xy) {
        s += '<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="7" fill="var(--acento)"/>';
      });
      s += "</svg>";
      // Curva de producción neta
      var pts = [];
      for (var k = 2; k <= 20; k++) pts.push({ x: k, y: prod(k) });
      function prod(k) { return Math.max(0.5, k * (1 - 0.045 * (k - 1))); }
      var curva = graficoLineas({
        ancho: 300, alto: 200,
        series: [{ nombre: "Producción neta", color: "var(--est)", puntos: pts }],
        xMax: 20, yMax: 8, xEtiq: "Personas", yEtiq: "Trabajo útil",
        marcas: [{ x: n, y: prod(n), color: "var(--acento)" }]
      });
      cont.querySelector("#br-lienzo").innerHTML = "<div>" + s + '<p style="text-align:center;margin:6px 0 0;font-size:0.85rem;color:var(--tinta-suave)">' + canales + " canales de comunicación</p></div><div>" + curva + "</div>";
      cont.querySelector("#br-nota").innerHTML = n >= 15 ?
        "⚠️ La coordinación devora la ganancia: cada persona extra ya casi no suma." :
        n >= 9 ? "La producción sigue subiendo, pero cada persona nueva rinde menos que la anterior." :
          "Equipo pequeño: la comunicación aún es barata.";
    }
    rango.addEventListener("input", pintar);
    pintar();
  }

  /* ==========================================================
     15. Ley de Laplace — tensión de pared (aneurisma)
     ========================================================== */
  function simLaplace(cont) {
    cont.innerHTML =
      '<div class="fila-controles">' +
      '<label>Radio del vaso: <strong id="lp-r">2,0</strong> cm</label>' +
      '<input type="range" id="lp-rango-r" min="10" max="55" value="20">' +
      '<label>Presión: <strong id="lp-p">100</strong> mmHg</label>' +
      '<input type="range" id="lp-rango-p" min="60" max="200" value="100">' +
      "</div>" +
      '<div class="lienzo-sim" id="lp-lienzo" style="text-align:center"></div>' +
      '<p class="marcador" id="lp-nota" style="text-align:center"></p>' +
      '<p class="nota-sim">T = P × r: a igual presión, cuanto mayor es el radio, mayor es la tensión que soporta la pared. Por eso un aneurisma es un círculo vicioso —dilatarse aumenta la tensión, que dilata más— y por eso se opera al superar cierto diámetro.</p>';
    var rr = cont.querySelector("#lp-rango-r"), rp = cont.querySelector("#lp-rango-p");
    function pintar() {
      var r = +rr.value / 10, p = +rp.value;
      cont.querySelector("#lp-r").textContent = nf(r, 1);
      cont.querySelector("#lp-p").textContent = p;
      var T = p * r;
      var maxT = 200 * 5.5;
      var frac = T / maxT;
      var color = frac < 0.35 ? "var(--est)" : frac < 0.62 ? "var(--ges)" : "var(--med)";
      var R = 24 + r * 14;
      var grosor = Math.max(3, 14 - frac * 11);
      var s = '<svg viewBox="0 0 260 220" style="max-width:300px;margin:0 auto">';
      s += '<circle cx="130" cy="105" r="' + R + '" fill="color-mix(in srgb, var(--med) 16%, transparent)" stroke="' + color + '" stroke-width="' + grosor + '"/>';
      s += '<line x1="130" y1="105" x2="' + (130 + R) + '" y2="105" stroke="var(--tinta-tenue)" stroke-dasharray="4 3"/>';
      s += '<text x="' + (130 + R / 2) + '" y="98" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">r</text>';
      s += '<text x="130" y="110" text-anchor="middle" font-size="13" font-weight="700" fill="var(--tinta)">P</text>';
      s += "</svg>";
      cont.querySelector("#lp-lienzo").innerHTML = s;
      cont.querySelector("#lp-nota").innerHTML =
        "Tensión de pared T = P·r = <strong style=\"color:" + color + '">' + nf(T, 0) + "</strong> (unidades relativas). " +
        (frac < 0.35 ? "Pared tranquila." : frac < 0.62 ? "Tensión elevada: la pared se adelgaza." : "🚨 Riesgo de rotura: círculo vicioso del aneurisma.");
    }
    rr.addEventListener("input", pintar);
    rp.addEventListener("input", pintar);
    pintar();
  }

  /* ==========================================================
     16. Ley de Weber-Fechner — ¿cuál es mayor?
     ========================================================== */
  function simWeber(cont) {
    var stats = { chico: { ok: 0, n: 0 }, grande: { ok: 0, n: 0 } };
    var actual = null;
    cont.innerHTML =
      '<p class="pregunta-quiz" style="text-align:center">¿Qué círculo es más grande? (la diferencia siempre es la misma: +10 px de diámetro)</p>' +
      '<div class="zona-objetivos" id="wb-zona" style="min-height:210px"></div>' +
      '<div class="lienzo-sim"><table class="tabla-sim"><thead><tr><th>Condición</th><th>Intentos</th><th>Aciertos</th></tr></thead><tbody id="wb-tabla"></tbody></table></div>' +
      '<p class="nota-sim">La diferencia absoluta es idéntica en ambas condiciones, pero sobre círculos pequeños se ve fácil y sobre grandes casi imposible: percibimos <strong>proporciones</strong>, no diferencias absolutas. Esa es la ley de Weber-Fechner.</p>';
    function ronda() {
      var esChico = azar() < 0.5;
      var base = esChico ? 46 : 168;
      var mayorIzq = azar() < 0.5;
      actual = { cond: esChico ? "chico" : "grande", mayorIzq: mayorIzq };
      var zona = cont.querySelector("#wb-zona");
      zona.innerHTML = "";
      [mayorIzq, !mayorIzq].forEach(function (esMayor) {
        var d = base + (esMayor ? 10 : 0);
        var b = document.createElement("button");
        b.style.cssText = "width:" + d + "px;height:" + d + "px;border-radius:50%;border:none;background:var(--psi);align-self:center;";
        b.addEventListener("click", function () {
          var st = stats[actual.cond];
          st.n++;
          if (esMayor) st.ok++;
          tabla();
          ronda();
        });
        zona.appendChild(b);
      });
    }
    function tabla() {
      cont.querySelector("#wb-tabla").innerHTML =
        [["Círculos pequeños (46 px)", stats.chico], ["Círculos grandes (168 px)", stats.grande]].map(function (par) {
          var s = par[1];
          return "<tr><td>" + par[0] + "</td><td>" + s.n + "</td><td><strong>" + (s.n ? nf((s.ok / s.n) * 100, 0) + "%" : "—") + "</strong></td></tr>";
        }).join("");
    }
    tabla();
    ronda();
  }

  /* ==========================================================
     17. Regresión a la media — talento y suerte
     ========================================================== */
  function simRegresion(cont) {
    cont.innerHTML =
      '<div class="fila-controles"><button class="boton-sim" id="rg-jugar">Simular temporada</button></div>' +
      '<div class="lienzo-sim" id="rg-lienzo"></div>' +
      '<p class="nota-sim">Cada punto es un deportista: su resultado = talento (fijo) + suerte (azar). Se marcan los <strong>5 mejores del año 1</strong> y se muestra qué hacen el año 2: casi todos «empeoran»... porque su pico llevaba suerte extrema que no se repite. No es maldición de portada: es regresión a la media.</p>';
    function jugar() {
      var atletas = [];
      for (var i = 0; i < 40; i++) {
        var talento = 50 + (azar() + azar() + azar() - 1.5) * 20;
        atletas.push({
          t: talento,
          a1: talento + (azar() + azar() - 1) * 22,
          a2: talento + (azar() + azar() - 1) * 22
        });
      }
      var top = atletas.slice().sort(function (a, b) { return b.a1 - a.a1; }).slice(0, 5);
      var W = 560, H = 250, m = { l: 46, r: 14, t: 14, b: 38 };
      function X(v) { return m.l + (v / 100) * (W - m.l - m.r); }
      function Y(v) { return H - m.b - (v / 100) * (H - m.t - m.b); }
      var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
      s += '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(100) + '" y2="' + Y(100) + '" stroke="var(--tinta-tenue)" stroke-dasharray="5 4"/>';
      s += '<text x="' + X(88) + '" y="' + (Y(88) - 8) + '" font-size="10" fill="var(--tinta-tenue)">repetir marca</text>';
      atletas.forEach(function (a) {
        s += '<circle cx="' + X(a.a1) + '" cy="' + Y(a.a2) + '" r="4" fill="var(--tinta-tenue)" opacity="0.55"/>';
      });
      var caen = 0;
      top.forEach(function (a) {
        if (a.a2 < a.a1) caen++;
        s += '<circle cx="' + X(a.a1) + '" cy="' + Y(a.a2) + '" r="6" fill="var(--acento)" stroke="var(--superficie)" stroke-width="2"/>';
      });
      s += '<text x="' + (m.l + (W - m.l - m.r) / 2) + '" y="' + (H - 4) + '" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">Resultado año 1</text>';
      s += '<text x="12" y="' + (m.t + (H - m.t - m.b) / 2) + '" font-size="11" fill="var(--tinta-suave)" text-anchor="middle" transform="rotate(-90 12 ' + (m.t + (H - m.t - m.b) / 2) + ')">Resultado año 2</text>';
      s += "</svg>";
      s += '<p class="marcador" style="text-align:center;margin-top:8px">De los 5 mejores del año 1 (en color), <strong>' + caen + " de 5</strong> rindieron peor el año 2.</p>";
      cont.querySelector("#rg-lienzo").innerHTML = s;
    }
    cont.querySelector("#rg-jugar").addEventListener("click", jugar);
    jugar();
  }

  /* ----------------------- Utilidades compartidas ----------------------- */

  window.UTILSIM = {
    esc: esc,
    nf: nf,
    graficoLineas: graficoLineas,
    graficoBarrasDoble: graficoBarrasDoble,
    barajar: barajar
  };

  /* ----------------------- Registro ----------------------- */

  window.INTERACTIVOS = [
    { id: "sim-parkinson", icono: "⏳", titulo: "El trabajo que se expande", ley: "parkinson", resumen: "Mueve el plazo de una tarea y mira en qué se va el tiempo extra.", render: simParkinson },
    { id: "sim-sturgeon", icono: "💎", titulo: "La criba del 90%", ley: "sturgeon", resumen: "Destapa 100 obras y comprueba cuánta basura esconde cualquier campo.", render: simSturgeon },
    { id: "sim-goodhart", icono: "🎯", titulo: "La métrica corrompida", ley: "goodhart", resumen: "Aprieta con un indicador y observa cómo se despega de la realidad.", render: simGoodhart },
    { id: "sim-gresham", icono: "🪙", titulo: "Dinero malo, dinero bueno", ley: "gresham", resumen: "Simula un mercado y ve cómo la moneda devaluada expulsa a la buena.", render: simGresham },
    { id: "sim-hick", icono: "🚦", titulo: "Decidir entre opciones", ley: "hick", resumen: "Juego de reacción: mide tu tiempo con 2, 4 y 8 alternativas.", render: simHick },
    { id: "sim-fitts", icono: "🎯", titulo: "Cazar dianas", ley: "fitts", resumen: "Haz clic en dianas de distinto tamaño y distancia; tu tiempo obedece una fórmula.", render: simFitts },
    { id: "sim-dunning", icono: "⛰️", titulo: "El monte de la estupidez", ley: "dunning-kruger", resumen: "Recorre la curva de la confianza desde novato hasta experto.", render: simDunning },
    { id: "sim-yerkes", icono: "😰", titulo: "La U invertida del estrés", ley: "yerkes-dodson", resumen: "Ajusta la activación y encuentra tu zona óptima según la tarea.", render: simYerkes },
    { id: "sim-benford", icono: "🕵️", titulo: "El detector de fraudes", ley: "benford", resumen: "Compara primeros dígitos de datos reales e inventados con la curva de Benford.", render: simBenford },
    { id: "sim-zipf", icono: "📚", titulo: "Analiza tu texto", ley: "zipf", resumen: "Pega cualquier texto y comprueba que sus palabras obedecen a Zipf.", render: simZipf },
    { id: "sim-pareto", icono: "📊", titulo: "El 80/20 en acción", ley: "pareto", resumen: "Genera clientes al azar y mide cuánto concentran los mejores.", render: simPareto },
    { id: "sim-grandes", icono: "🪙", titulo: "La moneda infinita", ley: "grandes-numeros", resumen: "Lanza 1, 100 o 5000 monedas y ve al azar rendirse ante el promedio.", render: simGrandes },
    { id: "sim-olvido", icono: "🧠", titulo: "La curva del olvido", ley: "ebbinghaus", resumen: "Añade repasos espaciados y aplana la caída de la memoria.", render: simOlvido },
    { id: "sim-brooks", icono: "👥", titulo: "Más gente, más lento", ley: "brooks", resumen: "Agranda el equipo y mira crecer los canales de comunicación.", render: simBrooks },
    { id: "sim-laplace", icono: "🫀", titulo: "El aneurisma explicado", ley: "laplace-medicina", resumen: "Juega con radio y presión: la tensión de pared T = P·r.", render: simLaplace },
    { id: "sim-weber", icono: "👁️", titulo: "¿Cuál es mayor?", ley: "weber-fechner", resumen: "Mismo cambio absoluto, distinta percepción: compruébalo tú.", render: simWeber },
    { id: "sim-regresion", icono: "🏅", titulo: "La maldición de la portada", ley: "regresion-media", resumen: "Simula dos temporadas y ve a los campeones «empeorar» por pura estadística.", render: simRegresion }
  ];
})();
