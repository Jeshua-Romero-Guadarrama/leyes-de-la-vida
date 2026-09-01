/* ==========================================================================
   Leyes de la Vida — Interactivos adicionales I
   Autor: Jeshua Romero Guadarrama
   Fábricas reutilizables (curvas con controles y juegos de adivinar) e
   interactivos de economía, tecnología y psicología.
   ========================================================================== */

(function () {
  "use strict";

  var U = window.UTILSIM;
  var nf = U.nf, esc = U.esc, graficoLineas = U.graficoLineas, barajar = U.barajar;
  var azar = Math.random;

  function registrar(sim) { window.INTERACTIVOS.push(sim); }

  /* ----------------------- Fábrica: curva con controles ----------------------- */

  function simCurva(cfg) {
    return function (cont) {
      var html = '<div class="fila-controles">';
      (cfg.controles || []).forEach(function (c) {
        html += "<label>" + c.etiqueta + ': <strong data-val="' + c.id + '"></strong></label>' +
          '<input type="range" data-ctrl="' + c.id + '" min="' + c.min + '" max="' + c.max + '" step="' + (c.paso || 1) + '" value="' + c.valor + '">';
      });
      (cfg.selector ? [cfg.selector] : []).forEach(function (s) {
        html += '<select data-sel="' + s.id + '">' + s.opciones.map(function (o) {
          return '<option value="' + o[0] + '">' + o[1] + "</option>";
        }).join("") + "</select>";
      });
      (cfg.botones || []).forEach(function (b) {
        html += '<button class="boton-sim' + (b.sec ? " secundario" : "") + '" data-boton="' + b.id + '">' + b.texto + "</button>";
      });
      html += '</div><div class="lienzo-sim" data-zona="grafico"></div><p class="marcador" data-zona="nota" style="text-align:center"></p>';
      if (cfg.pie) html += '<p class="nota-sim">' + cfg.pie + "</p>";
      cont.innerHTML = html;
      var estado = {};
      if (cfg.inicial) cfg.inicial(estado);
      function valores() {
        var v = {};
        (cfg.controles || []).forEach(function (c) { v[c.id] = +cont.querySelector('[data-ctrl="' + c.id + '"]').value; });
        if (cfg.selector) v[cfg.selector.id] = cont.querySelector('[data-sel="' + cfg.selector.id + '"]').value;
        return v;
      }
      function pintar() {
        var v = valores();
        (cfg.controles || []).forEach(function (c) {
          cont.querySelector('[data-val="' + c.id + '"]').textContent = c.fmt ? c.fmt(v[c.id]) : v[c.id];
        });
        var g = cfg.grafico(v, estado);
        cont.querySelector('[data-zona="grafico"]').innerHTML = typeof g === "string" ? g : graficoLineas(g);
        cont.querySelector('[data-zona="nota"]').innerHTML = cfg.nota ? cfg.nota(v, estado) : "";
      }
      (cfg.controles || []).forEach(function (c) {
        cont.querySelector('[data-ctrl="' + c.id + '"]').addEventListener("input", pintar);
      });
      if (cfg.selector) cont.querySelector('[data-sel="' + cfg.selector.id + '"]').addEventListener("change", pintar);
      (cfg.botones || []).forEach(function (b) {
        cont.querySelector('[data-boton="' + b.id + '"]').addEventListener("click", function () {
          b.accion(estado, valores());
          pintar();
        });
      });
      pintar();
    };
  }

  /* ----------------------- Fábrica: juego de adivinar ----------------------- */

  function simAdivina(cfg) {
    return function (cont) {
      var indice = 0, aciertos = 0, orden;
      function empezar() {
        orden = cfg.fijo ? cfg.preguntas.slice() : barajar(cfg.preguntas.slice());
        indice = 0; aciertos = 0;
        pregunta();
      }
      function pregunta() {
        var p = orden[indice];
        cont.innerHTML =
          '<p class="contexto-quiz">Ronda ' + (indice + 1) + " de " + orden.length + " · Aciertos: " + aciertos + "</p>" +
          '<p class="pregunta-quiz">' + p.texto + "</p>" +
          '<div class="opciones-quiz"></div><div data-zona="retro"></div>' +
          '<div class="pie-quiz"><span></span><button class="boton-sim" data-sig hidden>Siguiente →</button></div>';
        var zona = cont.querySelector(".opciones-quiz");
        p.opciones.forEach(function (op, k) {
          var b = document.createElement("button");
          b.className = "opcion-quiz";
          b.innerHTML = op.t;
          b.addEventListener("click", function () {
            if (op.ok) { aciertos++; b.classList.add("correcta"); }
            else {
              b.classList.add("incorrecta");
              p.opciones.forEach(function (o2, j) { if (o2.ok) zona.children[j].classList.add("correcta"); });
            }
            zona.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
            cont.querySelector('[data-zona="retro"]').innerHTML = p.retro ? '<div class="retro-quiz">' + p.retro + "</div>" : "";
            cont.querySelector("[data-sig]").hidden = false;
          });
          zona.appendChild(b);
        });
        cont.querySelector("[data-sig]").addEventListener("click", function () {
          indice++;
          if (indice < orden.length) pregunta(); else fin();
        });
      }
      function fin() {
        cont.innerHTML = '<div class="resultado-final"><span class="nota">' + aciertos + "/" + orden.length + "</span><p>" +
          cfg.final(aciertos, orden.length) + '</p><button class="boton-sim" data-otra>Jugar de nuevo</button></div>';
        cont.querySelector("[data-otra]").addEventListener("click", empezar);
      }
      empezar();
    };
  }

  U.simCurva = simCurva;
  U.simAdivina = simAdivina;
  U.registrar = registrar;

  /* ======================= ECONOMÍA ======================= */

  registrar({
    id: "sim-say", icono: "🔁", titulo: "La rueda de Say... y su freno", ley: "say",
    resumen: "Introduce atesoramiento en el flujo circular y mira si la oferta sigue creando su demanda.",
    render: simCurva({
      controles: [{ id: "a", etiqueta: "Ingresos que se atesoran", min: 0, max: 40, valor: 0, fmt: function (v) { return v + "%"; } }],
      grafico: function (v) {
        var demanda = [], oferta = [];
        for (var t = 0; t <= 12; t++) {
          oferta.push({ x: t, y: 100 });
          demanda.push({ x: t, y: 100 * Math.pow(1 - v.a / 100, t) });
        }
        return {
          series: [
            { nombre: "Producción (oferta)", color: "var(--eco)", puntos: oferta },
            { nombre: "Demanda efectiva", color: "var(--soc)", puntos: demanda }
          ], xMax: 12, yMax: 110, xEtiq: "Rondas de intercambio", yEtiq: "Índice"
        };
      },
      nota: function (v) {
        var fin = 100 * Math.pow(1 - v.a / 100, 12);
        return v.a === 0 ? "Sin atesoramiento, cada venta financia una compra: Say se cumple." :
          "Con un " + v.a + "% atesorado por ronda, tras 12 rondas la demanda cubre solo el <strong>" + nf(fin, 0) + "%</strong> de la producción: la crítica de Keynes.";
      },
      pie: "Producir genera los ingresos con los que se compra lo producido... salvo que parte del ingreso se guarde bajo el colchón. Ese es exactamente el debate Say–Keynes."
    })
  });

  registrar({
    id: "sim-engel", icono: "🍞", titulo: "El presupuesto que cambia", ley: "engel",
    resumen: "Sube el ingreso familiar y mira encoger el peso de la comida en el presupuesto.",
    render: simCurva({
      controles: [{ id: "ing", etiqueta: "Ingreso mensual", min: 500, max: 10000, paso: 100, valor: 1200, fmt: function (v) { return nf(v, 0) + " €"; } }],
      grafico: function (v) {
        var pts = [];
        for (var x = 500; x <= 10000; x += 100) pts.push({ x: x, y: 12 + 78 * Math.exp(-x / 2200) });
        var y = 12 + 78 * Math.exp(-v.ing / 2200);
        return {
          series: [{ nombre: "% del presupuesto en alimentos", color: "var(--eco)", puntos: pts }],
          xMax: 10000, yMax: 100, xEtiq: "Ingreso mensual (€)", yEtiq: "% en alimentos",
          marcas: [{ x: v.ing, y: y, texto: nf(y, 0) + "%" }]
        };
      },
      nota: function (v) {
        var pct = 12 + 78 * Math.exp(-v.ing / 2200);
        return "Este hogar dedica el <strong>" + nf(pct, 0) + "%</strong> a comer (" + nf(v.ing * pct / 100, 0) + " €): el gasto absoluto sube con el ingreso, la proporción baja.";
      },
      pie: "El estómago tiene límites; el dinero extra se va a vivienda, educación y ocio. Por eso el % de gasto en comida mide el nivel de vida de un país."
    })
  });

  registrar({
    id: "sim-okun", icono: "📉", titulo: "Crecer o parar", ley: "okun",
    resumen: "Ajusta el crecimiento del PIB y mira qué le pasa al desempleo.",
    render: simCurva({
      controles: [{ id: "g", etiqueta: "Crecimiento del PIB", min: -2, max: 6, paso: 0.5, valor: 3, fmt: function (v) { return nf(v, 1) + "%"; } }],
      grafico: function (v) {
        var pts = [];
        for (var g = -2; g <= 6; g += 0.25) pts.push({ x: g + 2, y: -0.5 * (g - 3) });
        return {
          series: [{ nombre: "Variación del desempleo (puntos)", color: "var(--eco)", puntos: pts }],
          xMax: 8, yMin: -2, yMax: 3, xEtiq: "Crecimiento del PIB (%, desplazado +2)", yEtiq: "Δ desempleo",
          marcas: [{ x: v.g + 2, y: -0.5 * (v.g - 3), texto: nf(-0.5 * (v.g - 3), 1) + " pts" }]
        };
      },
      nota: function (v) {
        var d = -0.5 * (v.g - 3);
        return d < -0.1 ? "Crecimiento por encima de la tendencia (~3%): el paro <strong>baja " + nf(-d, 1) + " puntos</strong>." :
          d > 0.1 ? "Crecimiento por debajo de la tendencia: el paro <strong>sube " + nf(d, 1) + " puntos</strong> aunque no haya recesión." :
            "Crecer al ritmo de la tendencia solo mantiene el paro donde está.";
      },
      pie: "Regularidad empírica de Okun: para bajar el desempleo no basta crecer, hay que crecer más que la productividad y la población activa juntas."
    })
  });

  registrar({
    id: "sim-rendimientos", icono: "👨‍🍳", titulo: "La cocina saturada", ley: "rendimientos-decrecientes",
    resumen: "Mete cocineros en una cocina fija y mira caer lo que aporta cada uno.",
    render: simCurva({
      controles: [{ id: "n", etiqueta: "Cocineros", min: 1, max: 12, valor: 3 }],
      grafico: function (v) {
        function total(n) { return 100 * (1 - Math.exp(-n / 3.2)); }
        var t = [], m = [];
        for (var n = 1; n <= 12; n++) {
          t.push({ x: n, y: total(n) });
          m.push({ x: n, y: total(n) - total(n - 1) });
        }
        return {
          series: [
            { nombre: "Platos totales por hora", color: "var(--eco)", puntos: t },
            { nombre: "Aporte del último cocinero", color: "var(--ges)", puntos: m }
          ], xMax: 12, yMax: 110, xEtiq: "Cocineros en la misma cocina", yEtiq: "Producción",
          marcas: [{ x: v.n, y: total(v.n) }]
        };
      },
      nota: function (v) {
        function total(n) { return 100 * (1 - Math.exp(-n / 3.2)); }
        var marg = total(v.n) - total(v.n - 1);
        return "El cocinero nº " + v.n + " aporta <strong>" + nf(marg, 1) + "</strong> platos/hora" + (marg < 4 ? ": la cocina (factor fijo) ya está saturada." : ".");
      },
      pie: "Con la cocina fija, cada cocinero extra rinde menos que el anterior: fogones ocupados, choques, esperas. La base de las curvas de costes."
    })
  });

  registrar({
    id: "sim-oferta-demanda", icono: "⚖️", titulo: "El precio que se busca solo", ley: "oferta-demanda",
    resumen: "Fija un precio y mira el mercado empujarlo hacia el equilibrio.",
    render: simCurva({
      controles: [{ id: "p", etiqueta: "Precio fijado", min: 5, max: 95, valor: 20, fmt: function (v) { return v + " €"; } }],
      grafico: function (v) {
        var d = [], o = [];
        for (var p = 0; p <= 100; p += 5) {
          d.push({ x: p, y: 100 - p });
          o.push({ x: p, y: p });
        }
        return {
          series: [
            { nombre: "Cantidad demandada", color: "var(--soc)", puntos: d },
            { nombre: "Cantidad ofrecida", color: "var(--eco)", puntos: o }
          ], xMax: 100, yMax: 105, xEtiq: "Precio (€)", yEtiq: "Cantidad",
          marcas: [{ x: v.p, y: 100 - v.p, color: "var(--soc)" }, { x: v.p, y: v.p, color: "var(--eco)" }, { x: 50, y: 50, color: "var(--acento)", texto: "equilibrio" }]
        };
      },
      nota: function (v) {
        var dif = (100 - v.p) - v.p;
        return dif > 2 ? "A " + v.p + " € hay <strong>escasez</strong> de " + dif + " unidades: los compradores pujan y el precio sube." :
          dif < -2 ? "A " + v.p + " € hay <strong>excedente</strong> de " + (-dif) + " unidades: los vendedores rebajan y el precio baja." :
            "🎯 Equilibrio: se vende exactamente lo que se quiere comprar.";
      },
      pie: "El mercado funciona como un termostato: cualquier precio lejos del cruce genera presiones que lo devuelven a él."
    })
  });

  registrar({
    id: "sim-wagner", icono: "🏛️", titulo: "El Estado que crece", ley: "wagner",
    resumen: "Desarrolla un país y mira crecer el peso de su gasto público.",
    render: simCurva({
      controles: [{ id: "pib", etiqueta: "PIB per cápita", min: 1000, max: 50000, paso: 1000, valor: 8000, fmt: function (v) { return nf(v, 0) + " €"; } }],
      grafico: function (v) {
        function g(x) { return 10 + 35 * (Math.log10(x / 1000) / Math.log10(50)); }
        var pts = [];
        for (var x = 1000; x <= 50000; x += 1000) pts.push({ x: x / 1000, y: g(x) });
        return {
          series: [{ nombre: "Gasto público (% del PIB)", color: "var(--eco)", puntos: pts }],
          xMax: 50, yMax: 55, xEtiq: "PIB per cápita (miles de €)", yEtiq: "% del PIB",
          marcas: [{ x: v.pib / 1000, y: g(v.pib), texto: nf(g(v.pib), 0) + "%" }]
        };
      },
      nota: function (v) {
        return v.pib < 5000 ? "País pobre: Estado pequeño, servicios mínimos." :
          v.pib < 25000 ? "Al desarrollarse, la demanda de educación, sanidad y pensiones dispara el gasto." :
            "País rico: el Estado absorbe cerca de la mitad del PIB, como en Europa occidental.";
      },
      pie: "En 1900 el gasto público europeo rondaba el 10% del PIB; hoy supera el 40%: la ley de Wagner en un siglo."
    })
  });

  registrar({
    id: "sim-baumol", icono: "🎻", titulo: "El cuarteto carísimo", ley: "baumol",
    resumen: "Deja pasar las décadas: los televisores se abaratan, los conciertos no.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años transcurridos", min: 0, max: 60, valor: 20 }],
      grafico: function (v) {
        var tv = [], con = [];
        for (var t = 0; t <= 60; t += 2) {
          tv.push({ x: t, y: 100 * Math.pow(0.955, t) });
          con.push({ x: t, y: 100 * Math.pow(1.025, t) });
        }
        return {
          series: [
            { nombre: "Televisor (productividad crece)", color: "var(--tec)", puntos: tv },
            { nombre: "Concierto / matrícula (no crece)", color: "var(--soc)", puntos: con }
          ], xMax: 60, yMax: 450, xEtiq: "Años", yEtiq: "Precio relativo (año 0 = 100)",
          marcas: [{ x: v.t, y: 100 * Math.pow(1.025, v.t) }]
        };
      },
      nota: function (v) {
        var razon = Math.pow(1.025, v.t) / Math.pow(0.955, v.t);
        return "Tras " + v.t + " años, el concierto cuesta <strong>" + nf(razon, 1) + " veces</strong> más que el televisor (en términos relativos). Nadie es ineficiente: tocar un cuarteto sigue exigiendo 4 músicos.";
      },
      pie: "Los salarios de los sectores estancados deben competir con los de los sectores productivos: por eso sanidad, educación y cultura se encarecen sin parar."
    })
  });

  registrar({
    id: "sim-hierro-salarios", icono: "⛓️", titulo: "El salario que rebota", ley: "hierro-salarios",
    resumen: "Concede subidas salariales y mira la teoría del siglo XIX devolverlas a la subsistencia.",
    render: simCurva({
      controles: [],
      botones: [
        { id: "subir", texto: "💰 Conceder subida salarial", accion: function (e) { e.subidas.push(e.anio); } },
        { id: "paso", texto: "Avanzar 5 años", sec: true, accion: function (e) { e.anio = Math.min(40, e.anio + 5); } },
        { id: "reset", texto: "Reiniciar", sec: true, accion: function (e) { e.subidas = []; e.anio = 0; } }
      ],
      inicial: function (e) { e.subidas = []; e.anio = 0; },
      grafico: function (v, e) {
        function w(t) {
          var s = 100;
          e.subidas.forEach(function (s0) { if (t >= s0) s += 35 * Math.exp(-(t - s0) / 4); });
          return s;
        }
        var pts = [], sub = [];
        for (var t = 0; t <= 40; t++) {
          pts.push({ x: t, y: w(t) });
          sub.push({ x: t, y: 100 });
        }
        return {
          series: [
            { nombre: "Salario real", color: "var(--eco)", puntos: pts },
            { nombre: "Nivel de subsistencia", color: "var(--med)", puntos: sub }
          ], xMax: 40, yMax: 160, xEtiq: "Años", yEtiq: "Salario (subsistencia = 100)",
          marcas: [{ x: e.anio, y: w(e.anio), texto: "hoy" }]
        };
      },
      nota: function (v, e) {
        return e.subidas.length ? "Según la teoría, cada subida atrae más población obrera, la competencia por el empleo crece y el salario vuelve a la línea roja. <em>La historia real la refutó: la productividad rompió la cadena.</em>" :
          "Concede una subida y observa el mecanismo que Lassalle creía inexorable.";
      },
      pie: "Clave para entender el pensamiento del siglo XIX y por qué Lassalle exigía acción política, no solo sindical. Los salarios reales modernos demostraron que la 'ley' no era de hierro."
    })
  });

  registrar({
    id: "sim-gossen", icono: "🥤", titulo: "El vaso que vale menos", ley: "gossen",
    resumen: "Bebe vasos de agua uno tras otro y mide cuánto disfrutas cada uno.",
    render: simCurva({
      controles: [],
      botones: [
        { id: "beber", texto: "🥤 Beber otro vaso", accion: function (e) { if (e.vasos < 8) e.vasos++; } },
        { id: "reset", texto: "Volver a tener sed", sec: true, accion: function (e) { e.vasos = 0; } }
      ],
      inicial: function (e) { e.vasos = 0; },
      grafico: function (v, e) {
        var UTIL = [10, 7, 5, 3, 1.5, 0.5, -0.5, -1.5];
        var W = 560, H = 220, m = { l: 40, r: 10, t: 16, b: 30 };
        var bw = (W - m.l - m.r) / 8;
        function Y(u) { return H - m.b - ((u + 2) / 12.5) * (H - m.t - m.b); }
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<line x1="' + m.l + '" y1="' + Y(0) + '" x2="' + (W - m.r) + '" y2="' + Y(0) + '" stroke="var(--tinta-tenue)" stroke-dasharray="4 3"/>';
        for (var i = 0; i < 8; i++) {
          var u = UTIL[i];
          var revelado = i < e.vasos;
          var y0 = Y(Math.max(u, 0)), h = Math.abs(Y(u) - Y(0));
          s += '<rect x="' + (m.l + i * bw + bw * 0.15) + '" y="' + (u >= 0 ? y0 : Y(0)) + '" width="' + bw * 0.7 + '" height="' + Math.max(h, 1) + '" rx="4" fill="' + (revelado ? (u >= 0 ? "var(--eco)" : "var(--med)") : "var(--borde)") + '"/>';
          s += '<text x="' + (m.l + i * bw + bw / 2) + '" y="' + (H - m.b + 14) + '" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">' + (i + 1) + "º</text>";
          if (revelado) s += '<text x="' + (m.l + i * bw + bw / 2) + '" y="' + ((u >= 0 ? y0 : Y(u)) - 5) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--tinta)">' + nf(u, 1) + "</text>";
        }
        s += '<text x="' + m.l + '" y="12" font-size="11" fill="var(--tinta-suave)">Satisfacción que aporta cada vaso</text></svg>';
        return s;
      },
      nota: function (v, e) {
        if (!e.vasos) return "Tienes muchísima sed. El primer vaso va a saber a gloria.";
        var UTIL = [10, 7, 5, 3, 1.5, 0.5, -0.5, -1.5];
        var total = UTIL.slice(0, e.vasos).reduce(function (a, b) { return a + b; }, 0);
        return e.vasos >= 7 ? "El vaso nº " + e.vasos + " ya <strong>resta</strong> (" + nf(UTIL[e.vasos - 1], 1) + "): utilidad marginal negativa. Total acumulado: " + nf(total, 1) + "." :
          "Vaso nº " + e.vasos + ": aporta " + nf(UTIL[e.vasos - 1], 1) + " (menos que el anterior). Total: " + nf(total, 1) + ".";
      },
      pie: "Cada unidad adicional satisface menos que la anterior. Esta idea resolvió la paradoja del valor: el agua es vital pero abundante; el diamante, inútil pero escaso."
    })
  });

  registrar({
    id: "sim-jevons", icono: "💡", titulo: "El ahorro que gasta más", ley: "jevons",
    resumen: "Haz el motor más eficiente y mira subir el consumo total de combustible.",
    render: simCurva({
      controles: [{ id: "e", etiqueta: "Eficiencia del motor", min: 100, max: 300, paso: 10, valor: 100, fmt: function (v) { return v + "%"; } }],
      grafico: function (v) {
        var porKm = [], km = [], total = [];
        for (var e = 100; e <= 300; e += 10) {
          var c = 100 / (e / 100);
          var k = 100 * Math.pow(e / 100, 1.45);
          porKm.push({ x: e, y: c });
          km.push({ x: e, y: k });
          total.push({ x: e, y: (c * k) / 100 });
        }
        function tot(e) { return (100 / (e / 100)) * 100 * Math.pow(e / 100, 1.45) / 100; }
        return {
          series: [
            { nombre: "Consumo por km", color: "var(--est)", puntos: porKm },
            { nombre: "Km recorridos", color: "var(--tec)", puntos: km },
            { nombre: "Consumo TOTAL", color: "var(--med)", puntos: total }
          ], xMax: 300, yMax: 500, xEtiq: "Eficiencia (%)", yEtiq: "Índice (inicio = 100)",
          marcas: [{ x: v.e, y: tot(v.e) }]
        };
      },
      nota: function (v) {
        var total = (100 / (v.e / 100)) * Math.pow(v.e / 100, 1.45);
        return v.e === 100 ? "Punto de partida: eficiencia y consumo de referencia." :
          "Con eficiencia del " + v.e + "%, conducir sale tan barato que se conduce mucho más: el consumo total es el <strong>" + nf(total, 0) + "%</strong> del original. El ahorro rebotó.";
      },
      pie: "Jevons lo vio con el carbón: máquinas de vapor más eficientes dispararon el consumo total de carbón. Hoy pasa con LED, motores y centros de datos."
    })
  });

  (function () {
    function renderHotelling(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Posición de tu carrito 🍦A: <strong id="ht-val">25</strong> m</label>' +
        '<input type="range" id="ht-rango" min="2" max="98" value="25">' +
        '<button class="boton-sim secundario" id="ht-centro">Ver el equilibrio</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="ht-lienzo"></div>' +
        '<p class="marcador" id="ht-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Una playa de 100 m con bañistas repartidos uniformemente. Tú colocas el carrito A; el rival B responde con su mejor jugada (pegarse a ti por el lado con más playa). Cada bañista compra al carrito más cercano. Busca la posición que maximice tus ventas... y descubre por qué ambos acaban en el centro.</p>';
      var rango = cont.querySelector("#ht-rango");
      function pintar() {
        var a = +rango.value;
        cont.querySelector("#ht-val").textContent = a;
        var b = a <= 50 ? Math.min(98, a + 3) : Math.max(2, a - 3);
        var corte = (a + b) / 2;
        var cuotaA = a < b ? corte : 100 - corte;
        var W = 560, H = 120;
        function X(m) { return 20 + (m / 100) * (W - 40); }
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<rect x="20" y="60" width="' + (W - 40) + '" height="16" rx="8" fill="#e8d5a8"/>';
        var xc = X(corte);
        if (a < b) {
          s += '<rect x="20" y="60" width="' + (xc - 20) + '" height="16" rx="8" fill="var(--eco)" opacity="0.5"/>';
          s += '<rect x="' + xc + '" y="60" width="' + (W - 20 - xc) + '" height="16" fill="var(--soc)" opacity="0.4"/>';
        } else {
          s += '<rect x="20" y="60" width="' + (xc - 20) + '" height="16" rx="8" fill="var(--soc)" opacity="0.4"/>';
          s += '<rect x="' + xc + '" y="60" width="' + (W - 20 - xc) + '" height="16" fill="var(--eco)" opacity="0.5"/>';
        }
        s += '<text x="' + X(a) + '" y="50" text-anchor="middle" font-size="22">🍦</text><text x="' + X(a) + '" y="100" text-anchor="middle" font-size="12" font-weight="700" fill="var(--eco)">A</text>';
        s += '<text x="' + X(b) + '" y="50" text-anchor="middle" font-size="22">🍧</text><text x="' + X(b) + '" y="100" text-anchor="middle" font-size="12" font-weight="700" fill="var(--soc)">B</text>';
        s += '<line x1="' + xc + '" y1="56" x2="' + xc + '" y2="80" stroke="var(--tinta)" stroke-dasharray="3 3"/>';
        s += "</svg>";
        cont.querySelector("#ht-lienzo").innerHTML = s;
        cont.querySelector("#ht-nota").innerHTML = "Tu cuota: <strong>" + nf(cuotaA, 0) + "%</strong> de los bañistas. " +
          (Math.abs(a - 50) < 3 ? "En el centro nadie puede robarte playa: es el equilibrio de Hotelling (y por eso los rivales acaban espalda con espalda)." : "El rival se te pega por el lado grande y se queda ese lado entero: acércate al centro.");
      }
      rango.addEventListener("input", pintar);
      cont.querySelector("#ht-centro").addEventListener("click", function () { rango.value = 50; pintar(); });
      pintar();
    }
    registrar({
      id: "sim-hotelling", icono: "🏖️", titulo: "Los heladeros de la playa", ley: "hotelling",
      resumen: "Coloca tu carrito de helados contra un rival que juega óptimo.", render: renderHotelling
    });
  })();

  /* ======================= TECNOLOGÍA ======================= */

  registrar({
    id: "sim-moore", icono: "🔬", titulo: "Duplicar cada dos años", ley: "moore",
    resumen: "Viaja de 1971 a 2025 y mira qué hace una exponencial con los transistores.",
    render: simCurva({
      controles: [{ id: "anio", etiqueta: "Año", min: 1971, max: 2025, valor: 1990 }],
      grafico: function (v) {
        function log10T(a) { return Math.log10(2300) + ((a - 1971) / 2) * Math.log10(2); }
        var pts = [];
        for (var a = 1971; a <= 2025; a++) pts.push({ x: a - 1971, y: log10T(a) });
        return {
          series: [{ nombre: "log₁₀(transistores por chip)", color: "var(--tec)", puntos: pts }],
          xMax: 54, yMax: 12, xEtiq: "Años desde 1971", yEtiq: "Orden de magnitud (10ⁿ)",
          marcas: [{ x: v.anio - 1971, y: log10T(v.anio), texto: String(v.anio) }]
        };
      },
      nota: function (v) {
        var t = 2300 * Math.pow(2, (v.anio - 1971) / 2);
        var texto = t > 1e9 ? nf(t / 1e9, 1) + " mil millones" : t > 1e6 ? nf(t / 1e6, 1) + " millones" : nf(t, 0);
        return "En " + v.anio + ", un chip puntero ronda los <strong>" + texto + "</strong> de transistores (el Intel 4004 de 1971 tenía 2300). En escala logarítmica, la exponencial es una recta.";
      },
      pie: "Más profecía autocumplida que ley física: marcó el ritmo de toda la industria durante medio siglo, hasta chocar con los límites atómicos."
    })
  });

  registrar({
    id: "sim-metcalfe", icono: "🕸️", titulo: "El valor de estar conectados", ley: "metcalfe",
    resumen: "Añade usuarios a una red y mira crecer las conexiones al cuadrado.",
    render: simCurva({
      controles: [{ id: "n", etiqueta: "Usuarios", min: 1, max: 40, valor: 6 }],
      grafico: function (v) {
        var pts = [];
        for (var n = 1; n <= 40; n++) pts.push({ x: n, y: (n * (n - 1)) / 2 });
        var R = 70, cx = 100, cy = 100, n2 = Math.min(v.n, 14);
        var s = '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center">';
        var red = '<svg viewBox="0 0 200 200" style="max-width:170px">';
        var pos = [];
        for (var i = 0; i < n2; i++) {
          var a = (i / n2) * Math.PI * 2 - Math.PI / 2;
          pos.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
        }
        for (var p = 0; p < n2; p++) for (var q = p + 1; q < n2; q++) {
          red += '<line x1="' + pos[p][0] + '" y1="' + pos[p][1] + '" x2="' + pos[q][0] + '" y2="' + pos[q][1] + '" stroke="var(--tec)" stroke-width="0.7" opacity="0.5"/>';
        }
        pos.forEach(function (xy) { red += '<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="6" fill="var(--acento)"/>'; });
        red += "</svg>" + (v.n > 14 ? '<p style="text-align:center;font-size:0.75rem;color:var(--tinta-tenue)">(se dibujan 14 de ' + v.n + ")</p>" : "");
        s += "<div>" + red + "</div><div>" + graficoLineas({
          ancho: 330, alto: 200,
          series: [{ nombre: "Conexiones posibles", color: "var(--tec)", puntos: pts }],
          xMax: 40, yMax: 800, xEtiq: "Usuarios", yEtiq: "Conexiones",
          marcas: [{ x: v.n, y: (v.n * (v.n - 1)) / 2 }]
        }) + "</div></div>";
        return s;
      },
      nota: function (v) {
        var c = (v.n * (v.n - 1)) / 2;
        return v.n + " usuarios → <strong>" + nf(c, 0) + "</strong> conexiones posibles. Duplicar usuarios ≈ cuadruplicar valor: el foso de toda plataforma.";
      },
      pie: "Un teléfono aislado no vale nada; mil millones crean un mercado. Por eso las redes nuevas luchan por arrancar aunque sean mejores."
    })
  });

  registrar({
    id: "sim-wright", icono: "🏭", titulo: "Fabricar enseña", ley: "wright",
    resumen: "Duplica la producción acumulada y mira caer el coste unitario un % fijo.",
    render: simCurva({
      controles: [{ id: "d", etiqueta: "Duplicaciones de la producción", min: 0, max: 10, valor: 3, fmt: function (v) { return v + " (unidades: " + nf(Math.pow(2, v) * 100, 0) + ")"; } }],
      grafico: function (v) {
        var pts = [];
        for (var d = 0; d <= 10; d++) pts.push({ x: d, y: 100 * Math.pow(0.8, d) });
        return {
          series: [{ nombre: "Coste unitario (inicio = 100)", color: "var(--tec)", puntos: pts }],
          xMax: 10, yMax: 105, xEtiq: "Duplicaciones de producción acumulada", yEtiq: "Coste unitario",
          marcas: [{ x: v.d, y: 100 * Math.pow(0.8, v.d), texto: nf(100 * Math.pow(0.8, v.d), 0) }]
        };
      },
      nota: function (v) {
        return "Con una curva de aprendizaje del 20%, tras " + v.d + " duplicaciones el coste es el <strong>" + nf(100 * Math.pow(0.8, v.d), 0) + "%</strong> del inicial. Así se abarataron aviones, paneles solares y baterías.";
      },
      pie: "La experiencia acumulada abarata de forma predecible: ~20% menos por cada duplicación. Predice el precio de las renovables mejor que ninguna otra regla."
    })
  });

  registrar({
    id: "sim-wirth", icono: "🐌", titulo: "Lo que Intel da...", ley: "wirth",
    resumen: "Deja pasar los años: el hardware vuela, el software engorda, tú esperas igual.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años transcurridos", min: 0, max: 25, valor: 10 }],
      grafico: function (v) {
        var hw = [], sw = [], ux = [];
        for (var t = 0; t <= 25; t++) {
          var h = Math.pow(2, t / 2), s = Math.pow(2, t / 1.85);
          hw.push({ x: t, y: Math.log10(h) });
          sw.push({ x: t, y: Math.log10(s) });
          ux.push({ x: t, y: Math.log10(Math.max(h / s, 0.05)) + 2 });
        }
        return {
          series: [
            { nombre: "Velocidad del hardware (log)", color: "var(--tec)", puntos: hw },
            { nombre: "Peso del software (log)", color: "var(--med)", puntos: sw },
            { nombre: "Velocidad percibida (+2)", color: "var(--est)", puntos: ux }
          ], xMax: 25, yMax: 9, xEtiq: "Años", yEtiq: "Órdenes de magnitud",
          marcas: [{ x: v.t, y: Math.log10(Math.max(Math.pow(2, v.t / 2) / Math.pow(2, v.t / 1.85), 0.05)) + 2 }]
        };
      },
      nota: function (v) {
        var razon = Math.pow(2, v.t / 2) / Math.pow(2, v.t / 1.85);
        return "Tras " + v.t + " años, el hardware es miles de veces más rápido... y tu procesador de textos abre " + (razon < 1 ? "<strong>más lento</strong>" : "igual") + " que antes (índice percibido: " + nf(razon, 2) + ").";
      },
      pie: "Cada mejora de hardware se absorbe en capas de abstracción y funciones accesorias: «lo que Intel te da, el software te lo quita». Es Jevons con ciclos de CPU."
    })
  });

  registrar({
    id: "sim-kryder", icono: "💾", titulo: "Guardar todo para siempre", ley: "kryder",
    resumen: "Recorre los años y mira multiplicarse los gigabytes por disco.",
    render: simCurva({
      controles: [{ id: "anio", etiqueta: "Año", min: 1990, max: 2025, valor: 2005 }],
      grafico: function (v) {
        function logGB(a) { return Math.log10(0.04) + ((a - 1990) / 1.9) * Math.log10(2); }
        var pts = [];
        for (var a = 1990; a <= 2025; a++) pts.push({ x: a - 1990, y: logGB(a) + 2 });
        return {
          series: [{ nombre: "log₁₀(GB por disco) + 2", color: "var(--tec)", puntos: pts }],
          xMax: 35, yMax: 8, xEtiq: "Años desde 1990", yEtiq: "Orden de magnitud",
          marcas: [{ x: v.anio - 1990, y: logGB(v.anio) + 2, texto: String(v.anio) }]
        };
      },
      nota: function (v) {
        var gb = 0.04 * Math.pow(2, (v.anio - 1990) / 1.9);
        var texto = gb >= 1000 ? nf(gb / 1000, 1) + " TB" : gb >= 1 ? nf(gb, 1) + " GB" : nf(gb * 1000, 0) + " MB";
        return "Disco doméstico típico en " + v.anio + ": <strong>~" + texto + "</strong>. Por eso pasamos de borrar fotos a no borrar nada, y de ahí a la nube.";
      },
      pie: "El equivalente de Moore para el almacenamiento: la densidad magnética se duplicó incluso más rápido que los transistores durante décadas."
    })
  });

  (function () {
    function renderConway(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Equipos en la empresa: <strong id="cw-val">3</strong></label>' +
        '<input type="range" id="cw-rango" min="1" max="5" value="3">' +
        "</div>" +
        '<div class="lienzo-sim" id="cw-lienzo"></div>' +
        '<p class="nota-sim">Arriba, el organigrama; abajo, la arquitectura del sistema que esa organización producirá. Cambia el número de equipos: el software se parte <em>exactamente</em> por donde se parte la empresa, porque las interfaces técnicas se negocian por los mismos canales que las humanas.</p>';
      var rango = cont.querySelector("#cw-rango");
      var COLORES = ["var(--tec)", "var(--soc)", "var(--est)", "var(--ges)", "var(--psi)"];
      function pintar() {
        var n = +rango.value;
        cont.querySelector("#cw-val").textContent = n;
        var W = 560, bw = (W - 40) / n;
        var s = '<svg viewBox="0 0 ' + W + ' 260" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<text x="20" y="16" font-size="11" fill="var(--tinta-tenue)">ORGANIGRAMA</text>';
        for (var i = 0; i < n; i++) {
          var x = 20 + i * bw;
          s += '<rect x="' + (x + 4) + '" y="24" width="' + (bw - 8) + '" height="46" rx="8" fill="' + COLORES[i] + '" opacity="0.85"/>';
          s += '<text x="' + (x + bw / 2) + '" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">Equipo ' + (i + 1) + "</text>";
          if (i > 0) s += '<line x1="' + x + '" y1="47" x2="' + (x + 4) + '" y2="47" stroke="var(--tinta-tenue)" stroke-width="2" stroke-dasharray="2 2"/>';
        }
        s += '<text x="20" y="118" font-size="11" fill="var(--tinta-tenue)">SISTEMA RESULTANTE</text>';
        for (var j = 0; j < n; j++) {
          var x2 = 20 + j * bw;
          s += '<rect x="' + (x2 + 4) + '" y="126" width="' + (bw - 8) + '" height="80" rx="8" fill="none" stroke="' + COLORES[j] + '" stroke-width="3"/>';
          s += '<text x="' + (x2 + bw / 2) + '" y="162" text-anchor="middle" font-size="12" font-weight="700" fill="' + COLORES[j] + '">Módulo ' + (j + 1) + "</text>";
          s += '<text x="' + (x2 + bw / 2) + '" y="182" text-anchor="middle" font-size="10" fill="var(--tinta-tenue)">estilo propio</text>';
          if (j > 0) {
            s += '<line x1="' + x2 + '" y1="166" x2="' + (x2 + 4) + '" y2="166" stroke="var(--med)" stroke-width="2"/>';
            s += '<text x="' + (x2 + 2) + '" y="222" text-anchor="middle" font-size="9" fill="var(--med)">interfaz frágil</text>';
          }
        }
        for (var k = 0; k < n; k++) {
          s += '<line x1="' + (20 + k * bw + bw / 2) + '" y1="70" x2="' + (20 + k * bw + bw / 2) + '" y2="126" stroke="var(--tinta-tenue)" stroke-dasharray="3 3"/>';
        }
        s += "</svg>";
        cont.querySelector("#cw-lienzo").innerHTML = s;
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-conway", icono: "🏗️", titulo: "El sistema copia al organigrama", ley: "conway",
      resumen: "Reorganiza los equipos y mira al software partirse por los mismos sitios.", render: renderConway
    });
  })();

  registrar({
    id: "sim-linus", icono: "👀", titulo: "Suficientes ojos", ley: "linus",
    resumen: "Añade revisores a un proyecto y mira desplomarse la vida de los errores.",
    render: simCurva({
      controles: [{ id: "n", etiqueta: "Revisores activos", min: 1, max: 500, valor: 10 }],
      grafico: function (v) {
        var pts = [];
        for (var n = 1; n <= 500; n += 5) pts.push({ x: n, y: 100 * Math.pow(0.994, n) });
        return {
          series: [{ nombre: "% de errores que sobreviven un mes", color: "var(--tec)", puntos: pts }],
          xMax: 500, yMax: 100, xEtiq: "Revisores que miran de verdad", yEtiq: "% de errores vivos",
          marcas: [{ x: v.n, y: 100 * Math.pow(0.994, v.n), texto: nf(100 * Math.pow(0.994, v.n), 0) + "%" }]
        };
      },
      nota: function (v) {
        var s = 100 * Math.pow(0.994, v.n);
        return v.n < 5 ? "Con un puñado de ojos, los errores viven meses: todo depende de un equipo." :
          s > 20 ? "Con " + v.n + " revisores sobrevive el " + nf(s, 0) + "% de los fallos: la revisión ayuda, pero aún quedan sombras." :
            "Con " + v.n + " revisores casi ningún fallo dura: «todos los errores son evidentes». Matiz: los ojos deben <em>mirar</em>, no solo existir.";
      },
      pie: "El argumento central del código abierto. El matiz importa: fallos graves han sobrevivido años en código abierto muy usado que nadie leía de verdad."
    })
  });

  registrar({
    id: "sim-postel", icono: "🤝", titulo: "Tolerancia y sus facturas", ley: "postel",
    resumen: "Ajusta cuán tolerante es tu programa con las entradas ajenas.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Tolerancia con entradas imperfectas", min: 0, max: 100, valor: 30, fmt: function (v) { return v + "%"; } }],
      grafico: function (v) {
        var inter = [], deuda = [];
        for (var t = 0; t <= 100; t += 5) {
          inter.push({ x: t, y: 25 + 70 * (1 - Math.exp(-t / 28)) });
          deuda.push({ x: t, y: Math.pow(t / 100, 2.2) * 90 });
        }
        return {
          series: [
            { nombre: "Interoperabilidad (la red funciona)", color: "var(--est)", puntos: inter },
            { nombre: "Errores tolerados que se perpetúan", color: "var(--med)", puntos: deuda }
          ], xMax: 100, yMax: 100, xEtiq: "Tolerancia (%)", yEtiq: "Índice",
          marcas: [{ x: v.t, y: 25 + 70 * (1 - Math.exp(-v.t / 28)) }]
        };
      },
      nota: function (v) {
        return v.t < 20 ? "Estricto: rechazas todo lo imperfecto. Correcto... y nadie puede hablar contigo." :
          v.t < 70 ? "«Conservador al enviar, liberal al aceptar»: la zona que hizo funcionar Internet." :
            "Tolerarlo todo perpetúa los errores ajenos y abre agujeros de seguridad: el debate moderno sobre Postel.";
      },
      pie: "Escrita en la especificación de TCP. Los navegadores toleran HTML roto: gracias a eso la web creció, y por eso mismo el HTML roto se volvió la norma."
    })
  });

  (function () {
    var FALLOS = [
      "el módulo de pagos no habla con el de usuarios",
      "nadie entiende el diagrama completo",
      "la integración final revela 214 incompatibilidades",
      "los requisitos cambiaron durante los 3 años de diseño",
      "el presupuesto se agotó antes de la primera prueba real",
      "funciona en la maqueta, no con datos reales"
    ];
    function renderGall(cont) {
      var estado = { modulos: 0, intentos: 0 };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="ga-bigbang">🏗️ Diseñar el sistema completo de golpe</button>' +
        '<button class="boton-sim" id="ga-iterar">🌱 Empezar simple y evolucionar</button>' +
        '<button class="boton-sim secundario" id="ga-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="ga-lienzo"><p style="margin:0;color:var(--tinta-tenue)">Elige tu estrategia de construcción.</p></div>' +
        '<p class="nota-sim">Ley de Gall: un sistema complejo diseñado desde cero nunca funciona; todo sistema complejo que funciona evolucionó de uno simple que funcionaba. Compara ambas estrategias.</p>';
      var lienzo = cont.querySelector("#ga-lienzo");
      cont.querySelector("#ga-bigbang").addEventListener("click", function () {
        estado.intentos++;
        var fallo = FALLOS[Math.floor(azar() * FALLOS.length)];
        lienzo.innerHTML = '<p class="marcador" style="color:var(--error)">💥 Intento ' + estado.intentos + ": el megasistema falla — " + fallo + '.</p><p style="color:var(--tinta-tenue)">Y no se puede parchear hasta que funcione: hay que volver a empezar.</p>';
      });
      cont.querySelector("#ga-iterar").addEventListener("click", function () {
        if (estado.modulos < 8) estado.modulos++;
        var bloques = "";
        for (var i = 0; i < estado.modulos; i++) bloques += '<span style="display:inline-block;width:44px;height:44px;border-radius:8px;background:var(--est);margin:3px;color:#fff;font-weight:700;text-align:center;line-height:44px">' + (i + 1) + "</span>";
        lienzo.innerHTML = '<p class="marcador" style="color:var(--ok)">✔ Versión ' + estado.modulos + ": funciona.</p><div>" + bloques + "</div>" +
          (estado.modulos >= 8 ? '<p style="color:var(--tinta-suave)">Ocho iteraciones después tienes un sistema complejo <strong>que funciona</strong>, porque cada paso funcionaba.</p>' : '<p style="color:var(--tinta-tenue)">Cada versión añade una pieza sobre algo que ya funciona.</p>');
      });
      cont.querySelector("#ga-reset").addEventListener("click", function () {
        estado.modulos = 0; estado.intentos = 0;
        lienzo.innerHTML = '<p style="margin:0;color:var(--tinta-tenue)">Elige tu estrategia de construcción.</p>';
      });
    }
    registrar({
      id: "sim-gall", icono: "🌱", titulo: "Big bang contra evolución", ley: "gall",
      resumen: "Intenta construir un sistema complejo de golpe... o hazlo crecer.", render: renderGall
    });
  })();

  (function () {
    var TECNOLOGIAS = [
      [1440, "la imprenta"], [1876, "el teléfono"], [1903, "el avión"], [1927, "la televisión"],
      [1947, "el transistor"], [1969, "llegar a la Luna"], [1973, "el teléfono móvil"], [1983, "Internet"],
      [1998, "el buscador web"], [2007, "el teléfono inteligente"], [2020, "las vacunas de ARNm"], [2022, "la IA conversacional"]
    ];
    function renderClarke(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Viaja al pasado: <strong id="cl-val">100</strong> años atrás</label>' +
        '<input type="range" id="cl-rango" min="10" max="500" step="10" value="100">' +
        "</div>" +
        '<div class="lienzo-sim" id="cl-lienzo"></div>' +
        '<p class="nota-sim">«Toda tecnología suficientemente avanzada es indistinguible de la magia.» Elige cuántos años retrocedes con el bolsillo lleno de 2026: lo que para ti es rutina, para ellos es hechicería.</p>';
      var rango = cont.querySelector("#cl-rango");
      function pintar() {
        var atras = +rango.value;
        cont.querySelector("#cl-val").textContent = atras;
        var anio = 2026 - atras;
        var magia = TECNOLOGIAS.filter(function (t) { return t[0] > anio; });
        var normal = TECNOLOGIAS.filter(function (t) { return t[0] <= anio; });
        cont.querySelector("#cl-lienzo").innerHTML =
          "<p><strong>Año de destino: " + anio + "</strong></p>" +
          '<p style="margin:6px 0 4px">🪄 <strong>Pura magia para ellos:</strong></p>' +
          '<p style="color:var(--tinta-suave)">' + (magia.length ? magia.map(function (t) { return t[1] + " (" + t[0] + ")"; }).join(" · ") : "nada: llegas con las manos vacías") + "</p>" +
          '<p style="margin:12px 0 4px">🔧 <strong>Ya lo conocen:</strong></p>' +
          '<p style="color:var(--tinta-suave)">' + (normal.length ? normal.map(function (t) { return t[1]; }).join(" · ") : "nada todavía") + "</p>";
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-clarke", icono: "🪄", titulo: "Magia con fecha de fabricación", ley: "clarke",
      resumen: "Viaja al pasado y mira qué tecnologías de hoy serían hechicería.", render: renderClarke
    });
  })();

  registrar({
    id: "sim-amara", icono: "🎢", titulo: "El ciclo de la sobreexpectación", ley: "amara",
    resumen: "Sigue una tecnología nueva: primero decepciona, luego lo cambia todo.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años desde la invención", min: 0, max: 30, valor: 4 }],
      grafico: function (v) {
        var exp = [], real = [];
        for (var t = 0; t <= 30; t += 0.5) {
          exp.push({ x: t, y: 15 + 80 * Math.exp(-Math.pow((t - 4) / 3, 2)) + 55 / (1 + Math.exp(-(t - 18) / 3.5)) });
          real.push({ x: t, y: 92 / (1 + Math.exp(-(t - 15) / 3.2)) });
        }
        function fx(t) { return 15 + 80 * Math.exp(-Math.pow((t - 4) / 3, 2)) + 55 / (1 + Math.exp(-(t - 18) / 3.5)); }
        return {
          series: [
            { nombre: "Expectativas públicas", color: "var(--soc)", puntos: exp },
            { nombre: "Impacto real", color: "var(--est)", puntos: real }
          ], xMax: 30, yMax: 110, xEtiq: "Años desde la invención", yEtiq: "Índice",
          marcas: [{ x: v.t, y: fx(v.t) }]
        };
      },
      nota: function (v) {
        return v.t < 7 ? "🚀 Pico de expectativas: portadas, burbuja, «lo cambiará todo mañana»." :
          v.t < 13 ? "🕳️ Valle de la desilusión: «era humo»... justo cuando el impacto real despega." :
            "🏗️ Meseta de productividad: ya nadie habla de ella porque está en todas partes.";
      },
      pie: "Sobreestimamos el corto plazo y subestimamos el largo: Internet en 1999 (burbuja y colapso) frente a Internet veinte años después."
    })
  });

  registrar({
    id: "sim-amdahl", icono: "🚧", titulo: "El techo de lo paralelo", ley: "amdahl",
    resumen: "Añade procesadores y choca contra la fracción que no se puede repartir.",
    render: simCurva({
      controles: [
        { id: "p", etiqueta: "Parte paralelizable", min: 50, max: 99, valor: 90, fmt: function (v) { return v + "%"; } },
        { id: "x", etiqueta: "Procesadores", min: 0, max: 10, valor: 4, fmt: function (v) { return nf(Math.pow(2, v), 0); } }
      ],
      grafico: function (v) {
        var p = v.p / 100;
        function speed(n) { return 1 / ((1 - p) + p / n); }
        var pts = [];
        for (var x = 0; x <= 10; x += 0.5) pts.push({ x: x, y: speed(Math.pow(2, x)) });
        var lim = 1 / (1 - p);
        return {
          series: [
            { nombre: "Aceleración conseguida", color: "var(--tec)", puntos: pts },
            { nombre: "Techo teórico", color: "var(--med)", puntos: [{ x: 0, y: lim }, { x: 10, y: lim }] }
          ], xMax: 10, yMax: Math.min(lim * 1.25, 110), xEtiq: "Procesadores (2ⁿ)", yEtiq: "Veces más rápido",
          marcas: [{ x: v.x, y: speed(Math.pow(2, v.x)), texto: "×" + nf(speed(Math.pow(2, v.x)), 1) }]
        };
      },
      nota: function (v) {
        var p = v.p / 100, n = Math.pow(2, v.x);
        return "Con el " + v.p + "% paralelizable y " + nf(n, 0) + " procesadores: <strong>×" + nf(1 / ((1 - p) + p / n), 1) + "</strong>. Techo con infinitos procesadores: ×" + nf(1 / (1 - p), 0) + ". El " + (100 - v.p) + "% secuencial manda.";
      },
      pie: "Generaliza a toda optimización: acelerar una parte solo ayuda en proporción a su peso. No optimices la función que ocupa el 2% del tiempo."
    })
  });

  /* ======================= PSICOLOGÍA ======================= */

  (function () {
    function renderThorndike(cont) {
      var estado = { fuerza: 10, premiando: true, pulsaciones: 0 };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="th-palanca">🐭 Presionar la palanca</button>' +
        '<button class="boton-sim secundario" id="th-modo">Dejar de premiar (extinción)</button>' +
        '<button class="boton-sim secundario" id="th-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim">' +
        '<p style="margin:0 0 8px">Fuerza del hábito:</p>' +
        '<div style="height:26px;border-radius:999px;background:var(--superficie);border:1px solid var(--borde);overflow:hidden"><div id="th-barra" style="height:100%;width:10%;background:var(--psi);transition:width 240ms"></div></div>' +
        '<p class="marcador" id="th-msj" style="margin-top:10px">La rata explora la caja. Pulsa la palanca.</p>' +
        "</div>" +
        '<p class="nota-sim">Caja de Skinner: si la palanca da comida (a veces), la conducta se refuerza; si deja de darla, se extingue poco a poco. Toda economía de «me gusta», propinas y notificaciones funciona con esta ley.</p>';
      var barra = cont.querySelector("#th-barra"), msj = cont.querySelector("#th-msj");
      function pintar(texto) {
        barra.style.width = Math.max(2, Math.min(100, estado.fuerza)) + "%";
        msj.innerHTML = texto;
      }
      cont.querySelector("#th-palanca").addEventListener("click", function () {
        estado.pulsaciones++;
        if (estado.premiando) {
          if (azar() < 0.6) {
            estado.fuerza = Math.min(100, estado.fuerza + 9);
            pintar("🍬 ¡Premio! La conducta se fortalece (ley del efecto).");
          } else {
            estado.fuerza = Math.min(100, estado.fuerza + 3);
            pintar("Nada esta vez... pero a veces cae premio: el refuerzo intermitente engancha aún más.");
          }
        } else {
          estado.fuerza = Math.max(2, estado.fuerza - 7);
          pintar(estado.fuerza <= 10 ? "La conducta casi ha desaparecido: extinción." : "Sin premio. La rata insiste cada vez menos.");
        }
      });
      cont.querySelector("#th-modo").addEventListener("click", function (e) {
        estado.premiando = !estado.premiando;
        e.target.textContent = estado.premiando ? "Dejar de premiar (extinción)" : "Volver a premiar";
        pintar(estado.premiando ? "El dispensador vuelve a funcionar." : "El dispensador está vacío: empieza la extinción.");
      });
      cont.querySelector("#th-reset").addEventListener("click", function () {
        estado.fuerza = 10; estado.premiando = true; estado.pulsaciones = 0;
        cont.querySelector("#th-modo").textContent = "Dejar de premiar (extinción)";
        pintar("La rata explora la caja. Pulsa la palanca.");
      });
      pintar("La rata explora la caja. Pulsa la palanca.");
    }
    registrar({
      id: "sim-thorndike", icono: "🐭", titulo: "La caja de Skinner", ley: "efecto-thorndike",
      resumen: "Premia (o deja de premiar) una conducta y mira cómo responde.", render: renderThorndike
    });
  })();

  registrar({
    id: "sim-practica", icono: "⌨️", titulo: "De novato a élite", ley: "practica",
    resumen: "Acumula horas de práctica y mira encogerse cada mejora.",
    render: simCurva({
      controles: [],
      botones: [
        { id: "h1", texto: "Practicar 1 hora", accion: function (e) { e.horas = Math.min(1000, e.horas + 1); } },
        { id: "h10", texto: "Practicar 10 horas", accion: function (e) { e.horas = Math.min(1000, e.horas + 10); } },
        { id: "h100", texto: "Practicar 100 horas", accion: function (e) { e.horas = Math.min(1000, e.horas + 100); } },
        { id: "reset", texto: "Reiniciar", sec: true, accion: function (e) { e.horas = 1; } }
      ],
      inicial: function (e) { e.horas = 1; },
      grafico: function (v, e) {
        function t(h) { return 60 * Math.pow(h, -0.32); }
        var pts = [];
        for (var h = 1; h <= 1000; h += h < 20 ? 1 : 10) pts.push({ x: Math.log10(h), y: t(h) });
        return {
          series: [{ nombre: "Segundos por tarea", color: "var(--psi)", puntos: pts }],
          xMax: 3, yMax: 65, xEtiq: "Horas de práctica (log₁₀)", yEtiq: "Segundos por tarea",
          marcas: [{ x: Math.log10(e.horas), y: t(e.horas), texto: nf(e.horas, 0) + " h" }]
        };
      },
      nota: function (v, e) {
        function t(h) { return 60 * Math.pow(h, -0.32); }
        return "Con " + nf(e.horas, 0) + " h de práctica tardas <strong>" + nf(t(e.horas), 1) + " s</strong> por tarea. " +
          (e.horas < 10 ? "Las primeras horas regalan mejoras enormes." : e.horas < 200 ? "Cada duplicación de práctica ya solo arranca ~20% de mejora." : "De experto a élite: años para ganar segundos. Ley potencial pura.");
      },
      pie: "Pasar de novato a competente es rápido; de experto a élite, lentísimo: cada duplicación de la práctica mejora un porcentaje fijo, cada vez más pequeño en absoluto."
    })
  });

  (function () {
    function renderMiller(cont) {
      var estado = { longitud: 4, fase: "inicio", cadena: "", temporizador: null };
      function html() {
        cont.innerHTML =
          '<div class="panel-estudio" style="max-width:560px;text-align:center;border:none;padding:10px">' +
          '<p class="pregunta-quiz" id="mi-texto"></p>' +
          '<div id="mi-zona"></div>' +
          "</div>" +
          '<p class="nota-sim">Memoriza la cifra que aparece durante un instante y tecléala. La serie crece hasta que falles: tu «amplitud de memoria» debería rondar el famoso 7±2 (unos 4±1 bloques con contenido real).</p>';
      }
      function inicio() {
        html();
        cont.querySelector("#mi-texto").textContent = "¿Cuántos dígitos caben en tu memoria de trabajo?";
        cont.querySelector("#mi-zona").innerHTML = '<button class="boton-sim" id="mi-empezar">Empezar la prueba</button>';
        cont.querySelector("#mi-empezar").addEventListener("click", function () { estado.longitud = 4; mostrar(); });
      }
      function mostrar() {
        estado.cadena = "";
        for (var i = 0; i < estado.longitud; i++) estado.cadena += Math.floor(azar() * 10);
        cont.querySelector("#mi-texto").innerHTML = '<span style="font-size:2rem;letter-spacing:0.2em;font-family:var(--fuente-mono)">' + estado.cadena + "</span>";
        cont.querySelector("#mi-zona").innerHTML = '<p style="color:var(--tinta-tenue)">Memoriza...</p>';
        estado.temporizador = setTimeout(preguntar, 900 + estado.longitud * 320);
      }
      function preguntar() {
        cont.querySelector("#mi-texto").textContent = "Escribe los " + estado.longitud + " dígitos:";
        cont.querySelector("#mi-zona").innerHTML =
          '<div class="fila-controles" style="justify-content:center"><input type="text" id="mi-entrada" inputmode="numeric" autocomplete="off" style="font-size:1.3rem;letter-spacing:0.15em;text-align:center;width:220px;font-family:var(--fuente-mono)"><button class="boton-sim" id="mi-ok">Comprobar</button></div>';
        var entrada = cont.querySelector("#mi-entrada");
        entrada.focus();
        function comprobar() {
          if (entrada.value.trim() === estado.cadena) {
            estado.longitud++;
            cont.querySelector("#mi-texto").innerHTML = '✔ <span style="color:var(--ok)">Correcto.</span> Ahora ' + estado.longitud + " dígitos.";
            cont.querySelector("#mi-zona").innerHTML = "";
            estado.temporizador = setTimeout(mostrar, 900);
          } else {
            var span = estado.longitud - 1;
            cont.querySelector("#mi-texto").innerHTML = "Tu amplitud: <strong style=\"font-size:2rem\">" + span + "</strong> dígitos";
            cont.querySelector("#mi-zona").innerHTML =
              "<p>" + (span >= 9 ? "Excepcional (¿agrupaste en bloques? eso es chunking)." : span >= 5 ? "Dentro del famoso 7±2 de Miller." : "Bajo esta vez: la atención también cuenta.") + "</p>" +
              '<p style="color:var(--tinta-tenue)">La cifra era ' + estado.cadena + '.</p><button class="boton-sim" id="mi-otra">Repetir prueba</button>';
            cont.querySelector("#mi-otra").addEventListener("click", function () { estado.longitud = 4; mostrar(); });
          }
        }
        cont.querySelector("#mi-ok").addEventListener("click", comprobar);
        entrada.addEventListener("keydown", function (e) { if (e.key === "Enter") comprobar(); });
      }
      inicio();
    }
    registrar({
      id: "sim-miller", icono: "🔢", titulo: "La prueba del 7±2", ley: "miller",
      resumen: "Mide tu amplitud de memoria con series de dígitos crecientes.", render: renderMiller
    });
  })();

  (function () {
    function renderGestalt(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="chip activo" data-demo="proximidad">Proximidad</button>' +
        '<button class="chip" data-demo="semejanza">Semejanza</button>' +
        '<button class="chip" data-demo="cierre">Cierre (Kanizsa)</button>' +
        '<label style="margin-left:auto">Intensidad: </label><input type="range" id="ge-rango" min="0" max="100" value="70">' +
        "</div>" +
        '<div class="lienzo-sim" id="ge-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="ge-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Tres leyes de la Gestalt en vivo. Mueve el control de intensidad y siente cómo tu percepción agrupa (o deja de agrupar) los mismos elementos: el todo no es la suma de las partes.</p>';
      var demo = "proximidad";
      var rango = cont.querySelector("#ge-rango");
      function pintar() {
        var v = +rango.value / 100;
        var s = "", nota = "";
        if (demo === "proximidad") {
          var gapCol = 16 + v * 34;
          s = '<svg viewBox="0 0 560 200" style="max-width:560px;margin:0 auto">';
          for (var f = 0; f < 5; f++) for (var c = 0; c < 8; c++) {
            var x = 60 + c * gapCol * 1.15 + Math.floor(c / 2) * 0;
            var x2 = 60 + (Math.floor(c / 2) * (gapCol * 2 + 14)) + (c % 2) * gapCol;
            s += '<circle cx="' + x2 + '" cy="' + (35 + f * 32) + '" r="9" fill="var(--psi)"/>';
          }
          s += "</svg>";
          nota = v > 0.35 ? "Los puntos cercanos forman <strong>columnas por parejas</strong>: la proximidad agrupa." : "Con separaciones parejas se ve una rejilla uniforme, sin grupos.";
        } else if (demo === "semejanza") {
          s = '<svg viewBox="0 0 560 200" style="max-width:560px;margin:0 auto">';
          for (var f2 = 0; f2 < 5; f2++) for (var c2 = 0; c2 < 12; c2++) {
            var par = f2 % 2 === 0;
            var color = par ? "var(--psi)" : "color-mix(in srgb, var(--psi) " + nf(100 - v * 85, 0) + "%, var(--soc))";
            s += '<circle cx="' + (50 + c2 * 42) + '" cy="' + (35 + f2 * 32) + '" r="10" fill="' + color + '"/>';
          }
          s += "</svg>";
          nota = v > 0.3 ? "Los colores parecidos van juntos: emergen <strong>filas</strong> aunque la geometría no cambió." : "Todos casi iguales: la rejilla vuelve a ser una sola masa.";
        } else {
          var apertura = v * 60;
          function pacman(cx, cy, hacia) {
            var a1 = hacia - 30 + apertura, a2 = hacia + 30 - apertura + 360;
            var r = 34;
            function pt(a) { return [(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1), (cy + r * Math.sin((a * Math.PI) / 180)).toFixed(1)]; }
            var p1 = pt(a1), p2 = pt(a2);
            return '<path d="M ' + cx + " " + cy + " L " + p1[0] + " " + p1[1] + " A 34 34 0 1 1 " + p2[0] + " " + p2[1] + ' Z" fill="var(--tinta)"/>';
          }
          var cxs = [200, 360, 280], cys = [60, 60, 168];
          s = '<svg viewBox="0 0 560 220" style="max-width:560px;margin:0 auto">';
          s += pacman(200, 62, 19);
          s += pacman(360, 62, 161);
          s += pacman(280, 168, 270);
          s += "</svg>";
          nota = v < 0.25 ? "¿Ves el <strong>triángulo blanco</strong> que no existe? Tu cerebro cierra la figura: contornos ilusorios de Kanizsa." : "Al girar las «bocas», el triángulo fantasma se desvanece: sin alineación no hay cierre.";
        }
        cont.querySelector("#ge-lienzo").innerHTML = s;
        cont.querySelector("#ge-nota").innerHTML = nota;
      }
      cont.querySelectorAll(".chip[data-demo]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          cont.querySelectorAll(".chip[data-demo]").forEach(function (o) { o.classList.remove("activo"); });
          ch.classList.add("activo");
          demo = ch.getAttribute("data-demo");
          rango.value = demo === "cierre" ? 0 : 70;
          pintar();
        });
      });
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-gestalt", icono: "🔺", titulo: "El triángulo que no existe", ley: "gestalt",
      resumen: "Proximidad, semejanza y cierre: tres ilusiones de agrupación en vivo.", render: renderGestalt
    });
  })();

  (function () {
    function renderHebb(cont) {
      var estado = { fuerza: 12 };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="he-juntas">⚡ Activar las dos juntas</button>' +
        '<button class="boton-sim secundario" id="he-sola">Activar solo la A</button>' +
        '<button class="boton-sim secundario" id="he-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="he-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="he-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">«Las neuronas que disparan juntas se conectan entre sí.» Coactiva A y B y mira engordar la sinapsis; actívalas por separado y mira debilitarse. Así esculpe la experiencia, físicamente, tu cerebro.</p>';
      function pintar(destello) {
        var w = Math.max(1, estado.fuerza / 6);
        var s = '<svg viewBox="0 0 460 140" style="max-width:460px;margin:0 auto">';
        s += '<line x1="120" y1="70" x2="340" y2="70" stroke="var(--psi)" stroke-width="' + w + '" stroke-linecap="round"' + (destello ? ' opacity="1"' : ' opacity="0.7"') + "/>";
        s += '<circle cx="90" cy="70" r="34" fill="' + (destello ? "var(--ges)" : "var(--superficie)") + '" stroke="var(--psi)" stroke-width="3"/><text x="90" y="76" text-anchor="middle" font-weight="700" font-size="18" fill="var(--tinta)">A</text>';
        s += '<circle cx="370" cy="70" r="34" fill="' + (destello === "ambas" ? "var(--ges)" : "var(--superficie)") + '" stroke="var(--psi)" stroke-width="3"/><text x="370" y="76" text-anchor="middle" font-weight="700" font-size="18" fill="var(--tinta)">B</text>';
        s += "</svg>";
        cont.querySelector("#he-lienzo").innerHTML = s;
        cont.querySelector("#he-nota").innerHTML = "Fuerza sináptica: <strong>" + nf(estado.fuerza, 0) + "</strong>" +
          (estado.fuerza > 70 ? " — conexión consolidada: activar A ya casi enciende B sola (un recuerdo)." : estado.fuerza < 8 ? " — conexión casi borrada." : "");
      }
      cont.querySelector("#he-juntas").addEventListener("click", function () {
        estado.fuerza = Math.min(100, estado.fuerza + 12);
        pintar("ambas");
      });
      cont.querySelector("#he-sola").addEventListener("click", function () {
        estado.fuerza = Math.max(2, estado.fuerza - 6);
        pintar(true);
      });
      cont.querySelector("#he-reset").addEventListener("click", function () { estado.fuerza = 12; pintar(); });
      pintar();
    }
    registrar({
      id: "sim-hebb", icono: "🧬", titulo: "Neuronas que se hacen amigas", ley: "hebb",
      resumen: "Coactiva dos neuronas y mira crecer (o encoger) su sinapsis.", render: renderHebb
    });
  })();

})();
