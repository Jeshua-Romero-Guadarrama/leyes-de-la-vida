/* ==========================================================================
   Leyes de la Vida — Interactivos VII: ampliación a 200 (est/med/fis)
   Autor: Jeshua Romero Guadarrama
   ========================================================================== */

(function () {
  "use strict";

  var U = window.UTILSIM;
  var nf = U.nf, graficoLineas = U.graficoLineas;
  var simCurva = U.simCurva, simAdivina = U.simAdivina, registrar = U.registrar, animar = U.animar;
  var azar = Math.random;

  /* ======================= ESTADÍSTICA ======================= */

  registrar({
    id: "sim-bayes", icono: "🧪", titulo: "El positivo que no lo era", ley: "bayes",
    resumen: "Un test «fiable», una enfermedad rara: calcula qué significa tu positivo.",
    render: simCurva({
      controles: [
        { id: "prev", etiqueta: "Personas enfermas por cada 10 000", min: 1, max: 500, valor: 10 },
        { id: "sens", etiqueta: "Acierto del test", min: 80, max: 99, valor: 95, fmt: function (v) { return v + "%"; } }
      ],
      grafico: function (v) {
        var enfermos = v.prev, sanos = 10000 - enfermos;
        var vp = enfermos * (v.sens / 100);
        var fp = sanos * ((100 - v.sens) / 100);
        var ppv = (vp / (vp + fp)) * 100;
        var filas = [
          ["✔ Positivos verdaderos (enfermos)", vp, "var(--est)"],
          ["✘ Falsos positivos (sanos)", fp, "var(--med)"]
        ];
        var maxV = Math.max(vp, fp);
        var s = '<svg viewBox="0 0 560 130" style="width:100%;max-width:560px;margin:0 auto">';
        filas.forEach(function (f, i) {
          var y = 14 + i * 46;
          s += '<text x="10" y="' + (y + 15) + '" font-size="12" fill="var(--tinta)">' + f[0] + "</text>";
          s += '<rect x="260" y="' + y + '" width="' + Math.max(3, (f[1] / maxV) * 270) + '" height="22" rx="6" fill="' + f[2] + '"/>';
          s += '<text x="' + (266 + Math.max(3, (f[1] / maxV) * 270)) + '" y="' + (y + 16) + '" font-size="12" font-weight="700" fill="var(--tinta)">' + nf(f[1], 0) + "</text>";
        });
        s += '<text x="280" y="120" text-anchor="middle" font-size="14" font-weight="800" fill="var(--tinta)">Si das positivo, P(enfermo) = ' + nf(ppv, 0) + "%</text>";
        return s + "</svg>";
      },
      nota: function (v) {
        var enfermos = v.prev, sanos = 10000 - enfermos;
        var ppv = (enfermos * v.sens / 100) / (enfermos * v.sens / 100 + sanos * (100 - v.sens) / 100) * 100;
        return ppv < 30 ? "🚨 La enfermedad es tan rara que los errores del test sobre la multitud de sanos AHOGAN a los aciertos: tu positivo casi seguro es falso. Falacia de la tasa base, la que suspenden hasta los médicos." :
          ppv < 70 ? "Zona gris: el positivo obliga a repetir o confirmar con otra prueba, no a asustarse." :
            "Con enfermedad frecuente, el positivo sí pesa: la probabilidad previa manda tanto como el test.";
      },
      pie: "Teorema de Bayes: ninguna prueba se interpreta en el vacío — combina siempre la fiabilidad del test con lo raro que era lo que buscabas."
    })
  });

  (function () {
    function render(cont) {
      var premio, elegida, abierta, fase, marcador = { cambia: [0, 0], queda: [0, 0] };
      cont.innerHTML =
        '<p class="pregunta-quiz" style="text-align:center" id="mh-msj">Elige una puerta: detrás de una hay un coche 🚗; en las otras, cabras 🐐.</p>' +
        '<div class="zona-objetivos" id="mh-zona"></div>' +
        '<div class="fila-controles" style="justify-content:center" id="mh-acciones"></div>' +
        '<div class="lienzo-sim"><table class="tabla-sim"><thead><tr><th>Estrategia</th><th>Partidas</th><th>Coches ganados</th></tr></thead><tbody id="mh-tabla"></tbody></table></div>' +
        '<p class="nota-sim">Juega varias veces con cada estrategia: cambiar gana ~2 de cada 3; quedarse, ~1 de cada 3. El presentador SABE dónde está el coche, y al abrir una puerta te regala información. Diez mil matemáticos se equivocaron; tu marcador no.</p>';
      var zona = cont.querySelector("#mh-zona"), msj = cont.querySelector("#mh-msj"), acciones = cont.querySelector("#mh-acciones");
      function nueva() {
        premio = Math.floor(azar() * 3);
        elegida = null; abierta = null; fase = "elegir";
        acciones.innerHTML = "";
        msj.textContent = "Elige una puerta: detrás de una hay un coche 🚗; en las otras, cabras 🐐.";
        pintar();
      }
      function pintar(final) {
        zona.innerHTML = "";
        for (var i = 0; i < 3; i++) {
          (function (i) {
            var b = document.createElement("button");
            b.className = "boton-sim secundario";
            b.style.cssText = "width:96px;height:120px;font-size:2rem;border-width:3px;" + (i === elegida ? "border-color:var(--acento);" : "");
            b.textContent = final ? (i === premio ? "🚗" : "🐐") : (i === abierta ? "🐐" : "🚪");
            b.disabled = fase !== "elegir" || i === abierta;
            b.addEventListener("click", function () {
              if (fase !== "elegir") return;
              elegida = i;
              fase = "decidir";
              var opciones = [0, 1, 2].filter(function (p) { return p !== elegida && p !== premio; });
              abierta = opciones[Math.floor(azar() * opciones.length)];
              msj.textContent = "El presentador abre la puerta " + (abierta + 1) + ": ¡una cabra! ¿Cambias o te quedas?";
              acciones.innerHTML = "";
              [["🔄 Cambiar de puerta", true], ["✋ Quedarme", false]].forEach(function (op) {
                var ab = document.createElement("button");
                ab.className = "boton-sim";
                ab.textContent = op[0];
                ab.addEventListener("click", function () { resolver(op[1]); });
                acciones.appendChild(ab);
              });
              pintar();
            });
            zona.appendChild(b);
          })(i);
        }
      }
      function resolver(cambia) {
        if (cambia) elegida = [0, 1, 2].filter(function (p) { return p !== elegida && p !== abierta; })[0];
        var gana = elegida === premio;
        var clave = cambia ? "cambia" : "queda";
        marcador[clave][0]++;
        if (gana) marcador[clave][1]++;
        fase = "fin";
        msj.textContent = (gana ? "🚗 ¡Coche! " : "🐐 Cabra. ") + (cambia ? "(cambiaste)" : "(te quedaste)");
        acciones.innerHTML = "";
        var otra = document.createElement("button");
        otra.className = "boton-sim";
        otra.textContent = "Otra partida →";
        otra.addEventListener("click", nueva);
        acciones.appendChild(otra);
        pintar(true);
        tabla();
      }
      function tabla() {
        cont.querySelector("#mh-tabla").innerHTML =
          "<tr><td>🔄 Cambiando</td><td>" + marcador.cambia[0] + "</td><td><strong>" + marcador.cambia[1] + (marcador.cambia[0] ? " (" + nf(marcador.cambia[1] / marcador.cambia[0] * 100, 0) + "%)" : "") + "</strong></td></tr>" +
          "<tr><td>✋ Quedándose</td><td>" + marcador.queda[0] + "</td><td><strong>" + marcador.queda[1] + (marcador.queda[0] ? " (" + nf(marcador.queda[1] / marcador.queda[0] * 100, 0) + "%)" : "") + "</strong></td></tr>";
      }
      tabla();
      nueva();
    }
    registrar({ id: "sim-montyhall", icono: "🚪", titulo: "Las tres puertas", ley: "monty-hall", resumen: "Juega al concurso: cambia o quédate, y deja que el marcador te convenza.", render: render });
  })();

  (function () {
    function render(cont) {
      var cuentas = {};
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" data-n="1">🎲 Tirar 10 dados (×1)</button>' +
        '<button class="boton-sim" data-n="100">×100</button>' +
        '<button class="boton-sim" data-n="2000">×2000</button>' +
        '<button class="boton-sim secundario" id="cl-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="cl-lienzo"><p style="margin:0;color:var(--tinta-tenue)">Suma de 10 dados: cada dado es plano (1/6 por cara), la suma no lo será.</p></div>' +
        '<p class="marcador" id="cl-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Un dado es una distribución plana. Suma diez y tira miles de veces: la campana de Gauss emerge sola, como SIEMPRE que se suman muchos azares independientes. Por eso la normal está en estaturas, errores y encuestas.</p>';
      var total = 0;
      function tirar(veces) {
        for (var v = 0; v < veces; v++) {
          var suma = 0;
          for (var d = 0; d < 10; d++) suma += 1 + Math.floor(azar() * 6);
          cuentas[suma] = (cuentas[suma] || 0) + 1;
          total++;
        }
        pintar();
      }
      function pintar() {
        var W = 560, H = 210;
        var max = 1;
        for (var k = 10; k <= 60; k++) if ((cuentas[k] || 0) > max) max = cuentas[k];
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        var bw = (W - 40) / 51;
        for (var suma = 10; suma <= 60; suma++) {
          var c = cuentas[suma] || 0;
          var h = (c / max) * (H - 46);
          s += '<rect x="' + (20 + (suma - 10) * bw) + '" y="' + (H - 26 - h) + '" width="' + (bw - 1) + '" height="' + Math.max(h, c ? 1 : 0) + '" fill="var(--est)"/>';
        }
        [10, 25, 35, 45, 60].forEach(function (v) {
          s += '<text x="' + (20 + (v - 10) * bw + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="var(--tinta-tenue)">' + v + "</text>";
        });
        s += "</svg>";
        cont.querySelector("#cl-lienzo").innerHTML = s;
        cont.querySelector("#cl-nota").innerHTML = "Tiradas: <strong>" + nf(total, 0) + "</strong>" + (total > 500 ? " — ahí está: la campana, nacida de dados planos." : "");
      }
      cont.querySelectorAll("[data-n]").forEach(function (b) {
        b.addEventListener("click", function () { tirar(+b.getAttribute("data-n")); });
      });
      cont.querySelector("#cl-reset").addEventListener("click", function () { cuentas = {}; total = 0; pintar(); });
    }
    registrar({ id: "sim-central", icono: "🔔", titulo: "La campana inevitable", ley: "central-limite", resumen: "Suma dados planos miles de veces y mira nacer a Gauss.", render: render });
  })();

  registrar({
    id: "sim-tressigma", icono: "📏", titulo: "¿Cómo de raro eres?", ley: "tres-sigma",
    resumen: "Muévete por la campana y mide cuánta gente queda a tu altura.",
    render: simCurva({
      controles: [{ id: "z", etiqueta: "Desviaciones de la media (sigmas)", min: -40, max: 40, paso: 1, valor: 10, fmt: function (v) { return nf(v / 10, 1) + " σ"; } }],
      grafico: function (v) {
        var pts = [];
        for (var z = -40; z <= 40; z++) pts.push({ x: z / 10 + 4, y: Math.exp(-Math.pow(z / 10, 2) / 2) * 100 });
        return {
          series: [{ nombre: "Distribución normal", color: "var(--est)", puntos: pts }],
          xMax: 8, yMax: 105, xEtiq: "Sigmas (desplazado +4)", yEtiq: "Densidad",
          marcas: [{ x: v.z / 10 + 4, y: Math.exp(-Math.pow(v.z / 10, 2) / 2) * 100, texto: nf(v.z / 10, 1) + "σ" }]
        };
      },
      nota: function (v) {
        var z = Math.abs(v.z / 10);
        function fueraDe(z2) {
          var t = 1 / (1 + 0.2316419 * z2);
          var d = 0.3989423 * Math.exp(-z2 * z2 / 2);
          var p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
          return 2 * p;
        }
        var raro = fueraDe(z);
        var unoDe = raro > 0 ? 1 / raro : Infinity;
        return "A " + nf(z, 1) + " sigmas de la media, eres más extremo que el <strong>" + nf((1 - raro) * 100, 1) + "%</strong> de la población: 1 persona de cada " + (unoDe > 1e6 ? nf(unoDe / 1e6, 1) + " millones" : nf(unoDe, 0)) + ". Regla 68-95-99,7: dentro de 1σ, 2σ y 3σ respectivamente.";
      },
      pie: "La vara de medir la rareza... solo si la distribución es normal: en bolsa y catástrofes mandan las colas gordas, y esta regla arruina a quien la aplica a ciegas."
    })
  });

  (function () {
    function render(cont) {
      var candidatos, vistos, fase, mejorVisto, marcador = [0, 0];
      cont.innerHTML =
        '<p class="pregunta-quiz" style="text-align:center">10 candidatos, uno a uno, sin vuelta atrás. Estrategia del 37%: rechaza los 4 primeros solo para calibrar y elige al primero que los supere.</p>' +
        '<div class="fila-controles" style="justify-content:center">' +
        '<button class="boton-sim" id="p37-jugar">🎬 Jugar una selección con la estrategia</button>' +
        '<button class="boton-sim secundario" id="p37-mil">Simular 1000 selecciones</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="p37-lienzo"></div>' +
        '<p class="marcador" id="p37-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">La estrategia 1/e ≈ 37% consigue al MEJOR candidato ~37% de las veces, más que cualquier otra regla sin vuelta atrás. Elegir al azar solo acierta el 10%. Vale para pisos, empleados y, dicen, para el amor.</p>';
      function jugar(visual) {
        candidatos = [];
        for (var i = 0; i < 10; i++) candidatos.push(Math.round(azar() * 100));
        var corte = 4;
        var listaVista = candidatos.slice(0, corte);
        var listonExtra = Math.max.apply(null, listaVista);
        var elegido = null, pos = -1;
        for (var j = corte; j < 10; j++) {
          if (candidatos[j] > listonExtra) { elegido = candidatos[j]; pos = j; break; }
        }
        if (elegido === null) { elegido = candidatos[9]; pos = 9; }
        var mejor = Math.max.apply(null, candidatos);
        var acierto = elegido === mejor;
        marcador[0]++;
        if (acierto) marcador[1]++;
        if (visual) {
          cont.querySelector("#p37-lienzo").innerHTML = candidatos.map(function (c, i) {
            var etiq = i < corte ? "calibrar" : i === pos ? "¡ELEGIDO!" : i < pos ? "descartado" : "no visto";
            var color = i < corte ? "var(--tinta-tenue)" : i === pos ? (acierto ? "var(--est)" : "var(--ges)") : "var(--borde)";
            return '<span style="display:inline-block;margin:4px;padding:8px 10px;border-radius:8px;background:' + color + ';color:#fff;font-size:0.82rem;text-align:center">' + c + (c === mejor ? " ⭐" : "") + "<br><span style='font-size:0.68rem'>" + etiq + "</span></span>";
          }).join("");
        }
        return acierto;
      }
      cont.querySelector("#p37-jugar").addEventListener("click", function () {
        var acierto = jugar(true);
        cont.querySelector("#p37-nota").innerHTML = (acierto ? "🎯 ¡Elegiste al mejor (⭐)!" : "Esta vez no era el mejor — la estrategia acierta ~37%, no siempre.") +
          " Aciertos acumulados: <strong>" + marcador[1] + "/" + marcador[0] + "</strong>";
      });
      cont.querySelector("#p37-mil").addEventListener("click", function () {
        for (var i = 0; i < 1000; i++) jugar(false);
        cont.querySelector("#p37-nota").innerHTML = "Aciertos acumulados: <strong>" + marcador[1] + "/" + marcador[0] + " (" + nf(marcador[1] / marcador[0] * 100, 1) + "%)</strong> — la teoría predice ~37%; elegir al azar daría 10%.";
      });
    }
    registrar({ id: "sim-parada37", icono: "💍", titulo: "Cuándo dejar de buscar", ley: "parada-37", resumen: "Aplica la regla del 37% a una tanda de candidatos y cuenta aciertos.", render: render });
  })();

  (function () {
    function render(cont) {
      var partidas = 0, ganancias = 0, record = 0;
      cont.innerHTML =
        '<div class="fila-controles" style="justify-content:center">' +
        '<button class="boton-sim" id="sp-jugar">🪙 Jugar una partida (cuesta 20 monedas)</button>' +
        '<button class="boton-sim secundario" id="sp-cien">Jugar 100 partidas</button>' +
        '<button class="boton-sim secundario" id="sp-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="sp-lienzo" style="text-align:center"><p style="margin:0;color:var(--tinta-tenue)">Lanza la moneda: el bote empieza en 2 y se duplica con cada cruz. Cara = cobras el bote.</p></div>' +
        '<p class="marcador" id="sp-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">La esperanza matemática de este juego es INFINITA (½×2 + ¼×4 + ⅛×8 + ... = 1+1+1+...). Y sin embargo, juega cien partidas: pagar 20 por partida te arruina casi seguro. Bernoulli resolvió la paradoja: el dinero vale menos cuanto más tienes.</p>';
      function partida() {
        var bote = 2, tiradas = "";
        while (azar() < 0.5 && bote < 1e9) { bote *= 2; tiradas += "✖"; }
        tiradas += "🙂";
        partidas++;
        ganancias += bote - 20;
        if (bote > record) record = bote;
        return { bote: bote, tiradas: tiradas };
      }
      function nota() {
        cont.querySelector("#sp-nota").innerHTML = "Partidas: <strong>" + nf(partidas, 0) + "</strong> · Balance (pagando 20/partida): <strong style='color:" + (ganancias >= 0 ? "var(--ok)" : "var(--error)") + "'>" + (ganancias > 0 ? "+" : "") + nf(ganancias, 0) + "</strong> · Mejor bote: " + nf(record, 0) +
          (partidas >= 100 ? "<br>La esperanza «infinita» vive en botes astronómicos e improbabilísimos que casi nunca llegan." : "");
      }
      cont.querySelector("#sp-jugar").addEventListener("click", function () {
        var r = partida();
        cont.querySelector("#sp-lienzo").innerHTML = '<p style="font-size:1.6rem;margin:0">' + r.tiradas + '</p><p class="marcador" style="margin:6px 0 0">Bote cobrado: ' + nf(r.bote, 0) + " monedas (pagaste 20)</p>";
        nota();
      });
      cont.querySelector("#sp-cien").addEventListener("click", function () {
        for (var i = 0; i < 100; i++) partida();
        cont.querySelector("#sp-lienzo").innerHTML = '<p style="margin:0;color:var(--tinta-suave)">100 partidas jugadas de golpe.</p>';
        nota();
      });
      cont.querySelector("#sp-reset").addEventListener("click", function () {
        partidas = 0; ganancias = 0; record = 0;
        cont.querySelector("#sp-lienzo").innerHTML = '<p style="margin:0;color:var(--tinta-tenue)">Lanza la moneda: el bote empieza en 2 y se duplica con cada cruz.</p>';
        cont.querySelector("#sp-nota").textContent = "";
      });
    }
    registrar({ id: "sim-petersburgo", icono: "♾️", titulo: "El juego del valor infinito", ley: "san-petersburgo", resumen: "Un juego que «vale» infinito... por el que no pagarías 20 monedas.", render: render });
  })();

  registrar({
    id: "sim-laplace-sucesion", icono: "🌅", titulo: "¿Saldrá mañana el sol?", ley: "sucesion-laplace",
    resumen: "Acumula amaneceres y mira cómo la confianza crece... sin llegar jamás al 100%.",
    render: simCurva({
      controles: [{ id: "n", etiqueta: "Éxitos consecutivos observados", min: 0, max: 1000, paso: 10, valor: 100, fmt: function (v) { return nf(v, 0); } }],
      grafico: function (v) {
        var pts = [];
        for (var n = 0; n <= 1000; n += 10) pts.push({ x: n, y: ((n + 1) / (n + 2)) * 100 });
        return {
          series: [
            { nombre: "P(éxito mañana) según Laplace", color: "var(--est)", puntos: pts },
            { nombre: "Certeza absoluta (inalcanzable)", color: "var(--med)", puntos: [{ x: 0, y: 100 }, { x: 1000, y: 100 }] }
          ], xMax: 1000, yMax: 105, yMin: 40, xEtiq: "Observaciones sin fallo", yEtiq: "Probabilidad (%)",
          marcas: [{ x: v.n, y: ((v.n + 1) / (v.n + 2)) * 100, texto: nf(((v.n + 1) / (v.n + 2)) * 100, 1) + "%" }]
        };
      },
      nota: function (v) {
        return v.n === 0 ? "Sin datos: 50% — la ignorancia perfecta." :
          v.n < 50 ? "Con " + v.n + " éxitos: " + nf(((v.n + 1) / (v.n + 2)) * 100, 1) + "%. El pavo de Russell llevaba esta cuenta... hasta Navidad." :
            "Tras " + nf(v.n, 0) + " observaciones: " + nf(((v.n + 1) / (v.n + 2)) * 100, 2) + "%. Nota la asíntota: ninguna racha compra el 100%. La humildad tiene fórmula.";
      },
      pie: "Regla de sucesión de Laplace: (n+1)/(n+2). Un fármaco sin fallos en 10 pacientes no es «100% seguro»: es ~92%."
    })
  });

  (function () {
    function render(cont) {
      var historia = [], rachaNegra = 0;
      cont.innerHTML =
        '<div class="fila-controles" style="justify-content:center">' +
        '<button class="boton-sim" id="fj-girar">🎡 Girar la ruleta</button>' +
        '<button class="boton-sim secundario" id="fj-veinte">Girar ×20</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="fj-lienzo" style="text-align:center;min-height:60px"></div>' +
        '<p class="marcador" id="fj-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Gira y observa las rachas. Cuando lleves varias negras seguidas, pregúntate: «¿toca roja?». No: cada giro es 50/50 (ignoramos el cero para simplificar), la ruleta no tiene memoria. En Montecarlo, 1913, el negro salió 26 veces seguidas y la falacia arruinó a la sala entera.</p>';
      function girar(n) {
        for (var i = 0; i < n; i++) {
          var negro = azar() < 0.5;
          historia.push(negro);
          if (negro) rachaNegra++; else rachaNegra = 0;
        }
        var ult = historia.slice(-24);
        cont.querySelector("#fj-lienzo").innerHTML = ult.map(function (negro) {
          return '<span style="display:inline-block;width:26px;height:26px;border-radius:50%;margin:3px;background:' + (negro ? "#1f2430" : "#c0392b") + ';border:2px solid var(--borde)"></span>';
        }).join("");
        var negras = historia.filter(Boolean).length;
        cont.querySelector("#fj-nota").innerHTML = "Giros: " + historia.length + " · Negras: " + nf(negras / historia.length * 100, 1) + "%" +
          (rachaNegra >= 4 ? " · <strong>" + rachaNegra + " negras seguidas</strong> — ¿«toca» roja? No: sigue siendo 50%. La moneda no debe nada a nadie." : "");
      }
      cont.querySelector("#fj-girar").addEventListener("click", function () { girar(1); });
      cont.querySelector("#fj-veinte").addEventListener("click", function () { girar(20); });
    }
    registrar({ id: "sim-falacia", icono: "🎡", titulo: "La ruleta sin memoria", ley: "falacia-jugador", resumen: "Persigue rachas en la ruleta y comprueba que a nadie le «toca» nada.", render: render });
  })();

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles" style="justify-content:center"><button class="boton-sim" id="am-sim">🌐 Generar una red social nueva</button></div>' +
        '<div class="lienzo-sim" id="am-lienzo"></div>' +
        '<p class="marcador" id="am-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Generamos una red realista (pocos superconectores, muchos normales) y le preguntamos a cada persona: «¿tienen tus amigos más amigos que tú?». La mayoría dirá que sí — no por fracaso, sino porque los superconectores aparecen en las listas de casi todos.</p>';
      function simular() {
        var n = 60;
        var grados = [];
        for (var i = 0; i < n; i++) grados.push(1 + Math.floor(Math.pow(azar(), 2.6) * 24));
        var totalAmigos = grados.reduce(function (a, b) { return a + b; }, 0);
        var mediaPersonas = totalAmigos / n;
        // Media de amigos de los amigos: ponderada por grado.
        var sumaCuadrados = grados.reduce(function (a, b) { return a + b * b; }, 0);
        var mediaAmigos = sumaCuadrados / totalAmigos;
        var peor = grados.filter(function (g) { return g < mediaAmigos; }).length;
        var W = 560, H = 170;
        var orden = grados.slice().sort(function (a, b) { return b - a; });
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        var bw = (W - 30) / n;
        orden.forEach(function (g, i) {
          s += '<rect x="' + (15 + i * bw) + '" y="' + (H - 30 - g * 4.8) + '" width="' + (bw - 1) + '" height="' + g * 4.8 + '" fill="' + (g >= mediaAmigos ? "var(--soc)" : "var(--borde)") + '"/>';
        });
        s += '<line x1="15" y1="' + (H - 30 - mediaAmigos * 4.8) + '" x2="' + (W - 15) + '" y2="' + (H - 30 - mediaAmigos * 4.8) + '" stroke="var(--tinta)" stroke-dasharray="5 4"/>';
        s += '<text x="' + (W - 15) + '" y="' + (H - 34 - mediaAmigos * 4.8) + '" text-anchor="end" font-size="10" fill="var(--tinta)">media de amigos DE TUS AMIGOS: ' + nf(mediaAmigos, 1) + "</text>";
        s += '<text x="' + (W / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="var(--tinta-tenue)">60 personas ordenadas por número de amigos</text>';
        s += "</svg>";
        cont.querySelector("#am-lienzo").innerHTML = s;
        cont.querySelector("#am-nota").innerHTML = "Media de amigos por persona: <strong>" + nf(mediaPersonas, 1) + "</strong> · Media de amigos de tus amigos: <strong>" + nf(mediaAmigos, 1) + "</strong><br><strong>" + peor + " de 60</strong> personas (" + nf(peor / 60 * 100, 0) + "%) tienen menos amigos que el promedio de sus amigos.";
      }
      cont.querySelector("#am-sim").addEventListener("click", simular);
      simular();
    }
    registrar({ id: "sim-amistad", icono: "🫂", titulo: "Tus amigos son más populares", ley: "amistad", resumen: "Genera redes y comprueba la paradoja: casi todos pierden la comparación.", render: render });
  })();

  registrar({
    id: "sim-stein", icono: "🛑", titulo: "Los árboles y el cielo", ley: "stein",
    resumen: "Extrapola una tendencia imposible y elige tu aterrizaje.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años de «esto sube para siempre»", min: 1, max: 25, valor: 8 }],
      selector: { id: "final", opciones: [["blando", "Ajuste gradual (por las buenas)"], ["duro", "Nadie frena (por las malas)"]] },
      grafico: function (v) {
        var burbuja = [], sostenible = [];
        for (var t = 0; t <= 25; t += 0.5) {
          sostenible.push({ x: t, y: 20 + t * 2 });
          var pico = Math.min(v.t, 25);
          var y;
          if (t <= pico) y = 20 * Math.pow(1.18, t);
          else if (v.final === "blando") y = 20 * Math.pow(1.18, pico) * Math.pow(0.96, (t - pico) * 2);
          else y = Math.max(12, 20 * Math.pow(1.18, pico) * Math.pow(0.6, (t - pico) * 1.6));
          burbuja.push({ x: t, y: Math.min(500, y) });
        }
        return {
          series: [
            { nombre: "La tendencia «imparable»", color: "var(--soc)", puntos: burbuja },
            { nombre: "Crecimiento sostenible", color: "var(--est)", puntos: sostenible }
          ], xMax: 25, yMax: 320, xEtiq: "Años", yEtiq: "Índice",
          marcas: [{ x: v.t, y: Math.min(500, 20 * Math.pow(1.18, v.t)), texto: "tope" }]
        };
      },
      nota: function (v) {
        return v.final === "blando" ? "Con ajuste gradual, la tendencia se desinfla ordenadamente hacia lo sostenible: el aterrizaje suave existe... si alguien frena a tiempo." :
          "💥 Sin freno voluntario, frena la realidad: cuanto más tarde el tope (muévelo), más brutal la caída. «Si algo no puede continuar para siempre, se detendrá» — la pregunta es cómo.";
      },
      pie: "Ley de Stein: toda tendencia insostenible lleva dentro su final. No hace falta hacer nada para que pare; conviene elegir el aterrizaje."
    })
  });

  /* ======================= MEDICINA ======================= */

  (function () {
    var ZONAS = [["Cabeza", 9], ["Brazo derecho", 9], ["Brazo izquierdo", 9], ["Tronco anterior", 18], ["Tronco posterior", 18], ["Pierna derecha", 18], ["Pierna izquierda", 18], ["Periné", 1]];
    function render(cont) {
      var marcadas = {};
      cont.innerHTML =
        '<p class="pregunta-quiz" style="text-align:center">Marca las zonas quemadas del paciente:</p>' +
        '<div class="fila-controles" style="justify-content:center" id="w9-zonas"></div>' +
        '<div class="lienzo-sim" id="w9-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="w9-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">La regla de los nueves de Wallace: cada zona vale un múltiplo de 9%. En segundos tienes la superficie quemada, de la que dependen los litros de suero (fórmula de Parkland), el traslado a unidad de quemados y el pronóstico.</p>';
      var zona = cont.querySelector("#w9-zonas");
      ZONAS.forEach(function (z) {
        var b = document.createElement("button");
        b.className = "chip";
        b.textContent = z[0] + " (" + z[1] + "%)";
        b.addEventListener("click", function () {
          marcadas[z[0]] = !marcadas[z[0]];
          b.classList.toggle("activo");
          pintar();
        });
        zona.appendChild(b);
      });
      function pintar() {
        var total = ZONAS.filter(function (z) { return marcadas[z[0]]; }).reduce(function (a, z) { return a + z[1]; }, 0);
        var parkland = total * 4 * 70;
        cont.querySelector("#w9-lienzo").innerHTML =
          '<p style="font-size:2.6rem;font-weight:800;margin:6px 0;color:' + (total >= 20 ? "var(--error)" : "var(--tinta)") + '">' + total + "% de superficie corporal</p>";
        cont.querySelector("#w9-nota").innerHTML = total === 0 ? "Sin zonas marcadas." :
          total < 10 ? "Quemadura menor: manejo ambulatorio si no afecta zonas críticas." :
            total < 20 ? "Quemadura moderada: valoración hospitalaria y fluidos calculados." :
              "🚨 GRAN QUEMADO (≥20%): unidad especializada. Parkland orienta: ~" + nf(parkland / 1000, 1) + " litros de suero en 24 h (adulto de 70 kg).";
      }
      pintar();
    }
    registrar({ id: "sim-wallace", icono: "🔥", titulo: "La regla de los nueves", ley: "wallace-9", resumen: "Marca zonas quemadas y calcula superficie y fluidos en segundos.", render: render });
  })();

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles" style="justify-content:center">' +
        '<button class="chip" data-f="estasis">🛌 Estasis (inmovilidad, vuelo largo)</button>' +
        '<button class="chip" data-f="pared">🔪 Lesión de la pared (cirugía, catéter)</button>' +
        '<button class="chip" data-f="sangre">🧬 Hipercoagulabilidad (cáncer, anticonceptivos)</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="vc-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="vc-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Activa los lados del triángulo de Virchow: cada factor suma riesgo de trombosis y los tres juntos lo multiplican. Siglo y medio después, sigue siendo EL marco de todo coágulo — y la razón de las medias de compresión y el paseíllo en los vuelos largos.</p>';
      var activos = {};
      function pintar() {
        var n = Object.keys(activos).filter(function (k) { return activos[k]; }).length;
        var riesgo = [1, 4, 12, 40][n];
        var s = '<svg viewBox="0 0 360 300" style="max-width:330px;margin:0 auto">';
        var puntos = [[180, 40], [60, 250], [300, 250]];
        var NOM = ["estasis", "pared", "sangre"];
        var ETIQ = ["🛌 Estasis", "🔪 Pared", "🧬 Sangre"];
        for (var i = 0; i < 3; i++) {
          var j = (i + 1) % 3;
          s += '<line x1="' + puntos[i][0] + '" y1="' + puntos[i][1] + '" x2="' + puntos[j][0] + '" y2="' + puntos[j][1] + '" stroke="var(--borde)" stroke-width="3"/>';
        }
        for (var k = 0; k < 3; k++) {
          var on = activos[NOM[k]];
          s += '<circle cx="' + puntos[k][0] + '" cy="' + puntos[k][1] + '" r="34" fill="' + (on ? "var(--med)" : "var(--superficie)") + '" stroke="var(--med)" stroke-width="3"/>';
          s += '<text x="' + puntos[k][0] + '" y="' + (puntos[k][1] + 5) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + (on ? "#fff" : "var(--tinta)") + '">' + ETIQ[k] + "</text>";
        }
        s += '<text x="180" y="185" text-anchor="middle" font-size="14" font-weight="800" fill="var(--tinta)">riesgo ×' + riesgo + "</text>";
        s += "</svg>";
        cont.querySelector("#vc-lienzo").innerHTML = s;
        cont.querySelector("#vc-nota").innerHTML =
          n === 0 ? "Triángulo en reposo: riesgo basal." :
            n === 1 ? "Un lado activo: riesgo moderado — vigilancia y movilización." :
              n === 2 ? "Dos lados: riesgo alto — profilaxis con heparina en el hospital." :
                "🚨 Tríada completa: tormenta perfecta para el trombo. Profilaxis obligada.";
      }
      cont.querySelectorAll(".chip[data-f]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          var f = ch.getAttribute("data-f");
          activos[f] = !activos[f];
          ch.classList.toggle("activo");
          pintar();
        });
      });
      pintar();
    }
    registrar({ id: "sim-virchow", icono: "🔺", titulo: "El triángulo del trombo", ley: "virchow", resumen: "Activa los tres lados de la tríada y mide el riesgo de coágulo.", render: render });
  })();

  (function () {
    var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    var DIAS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Primer día de la última regla — mes: <strong id="ng-m">marzo</strong></label>' +
        '<input type="range" id="ng-rm" min="0" max="11" value="2">' +
        '<label>día: <strong id="ng-d">10</strong></label>' +
        '<input type="range" id="ng-rd" min="1" max="31" value="10">' +
        "</div>" +
        '<div class="lienzo-sim" id="ng-lienzo" style="text-align:center"></div>' +
        '<p class="nota-sim">Regla de Naegele (1812): último período + 7 días + 9 meses = fecha probable de parto (~40 semanas). Es el centro de una campana, no una cita: solo ~4% nace el día exacto. La app del embarazo hace exactamente esta cuenta.</p>';
      var rm = cont.querySelector("#ng-rm"), rd = cont.querySelector("#ng-rd");
      function pintar() {
        var m = +rm.value, d = Math.min(+rd.value, DIAS[m]);
        cont.querySelector("#ng-m").textContent = MESES[m];
        cont.querySelector("#ng-d").textContent = d;
        var dia = d + 7, mes = m;
        while (dia > DIAS[mes]) { dia -= DIAS[mes]; mes = (mes + 1) % 12; }
        mes = (mes + 9) % 12;
        cont.querySelector("#ng-lienzo").innerHTML =
          '<p style="margin:6px 0;color:var(--tinta-suave)">' + d + " de " + MESES[m] + " &nbsp;→&nbsp; +7 días &nbsp;→&nbsp; +9 meses</p>" +
          '<p style="font-size:1.9rem;font-weight:800;margin:0;color:var(--med)">👶 ' + dia + " de " + MESES[mes] + "</p>" +
          '<p style="margin:8px 0 0;color:var(--tinta-tenue);font-size:0.85rem">±2 semanas cubre el 90% de los nacimientos</p>';
      }
      rm.addEventListener("input", pintar);
      rd.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-naegele", icono: "👶", titulo: "La cuenta de la cigüeña", ley: "naegele", resumen: "Calcula la fecha probable de parto con la regla de 1812.", render: render });
  })();

  /* ======================= FÍSICA ======================= */

  registrar({
    id: "sim-coulomb", icono: "🧲", titulo: "Cargas que se buscan (o se odian)", ley: "coulomb",
    resumen: "Acerca dos cargas, cambia sus signos y mide la fuerza.",
    render: simCurva({
      controles: [{ id: "d", etiqueta: "Distancia entre cargas", min: 1, max: 10, paso: 0.5, valor: 3, fmt: function (v) { return nf(v, 1); } }],
      selector: { id: "signos", opciones: [["opuestos", "Cargas opuestas (+ y −)"], ["iguales", "Cargas iguales (+ y +)"]] },
      grafico: function (v) {
        var pts = [];
        for (var d = 1; d <= 10; d += 0.25) pts.push({ x: d, y: 100 / (d * d) });
        var f = 100 / (v.d * v.d);
        var s = '<svg viewBox="0 0 560 90" style="width:100%;max-width:560px;margin:0 auto 6px">';
        var sep = 60 + v.d * 40;
        var x1 = 280 - sep / 2, x2 = 280 + sep / 2;
        var op = v.signos === "opuestos";
        s += '<circle cx="' + x1 + '" cy="45" r="20" fill="var(--tec)"/><text x="' + x1 + '" y="52" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">+</text>';
        s += '<circle cx="' + x2 + '" cy="45" r="20" fill="' + (op ? "var(--med)" : "var(--tec)") + '"/><text x="' + x2 + '" y="52" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">' + (op ? "−" : "+") + "</text>";
        var flecha = Math.min(46, 6 + f * 0.45);
        if (op) {
          s += '<path d="M ' + (x1 + 26) + ' 45 h ' + flecha + ' m -8 -6 l 8 6 l -8 6" stroke="var(--tinta)" stroke-width="3" fill="none"/>';
          s += '<path d="M ' + (x2 - 26) + ' 45 h -' + flecha + ' m 8 -6 l -8 6 l 8 6" stroke="var(--tinta)" stroke-width="3" fill="none"/>';
        } else {
          s += '<path d="M ' + (x1 - 26) + ' 45 h -' + flecha + ' m 8 -6 l -8 6 l 8 6" stroke="var(--tinta)" stroke-width="3" fill="none"/>';
          s += '<path d="M ' + (x2 + 26) + ' 45 h ' + flecha + ' m -8 -6 l 8 6 l -8 6" stroke="var(--tinta)" stroke-width="3" fill="none"/>';
        }
        s += "</svg>";
        return s + graficoLineas({
          alto: 190,
          series: [{ nombre: "Fuerza (1/d²)", color: "var(--fis)", puntos: pts }],
          xMax: 10, yMax: 105, xEtiq: "Distancia", yEtiq: "Fuerza",
          marcas: [{ x: v.d, y: f, texto: nf(f, 1) }]
        });
      },
      nota: function (v) {
        return (v.signos === "opuestos" ? "Opuestas: se ATRAEN" : "Iguales: se REPELEN") + " con fuerza " + nf(100 / (v.d * v.d), 1) + " — mismo 1/d² que la gravedad, pero con dos signos. Esta repulsión es la razón de que no atravieses la mesa.";
      },
      pie: "La gemela eléctrica de Newton: sostiene átomos, moléculas y toda la química. El globo frotado que atrapa papelitos la ejecuta en tu salón."
    })
  });

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Velocidad del imán: <strong id="fd-val">2</strong></label>' +
        '<input type="range" id="fd-rango" min="0" max="10" value="2">' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 190" style="width:100%">' +
        '<g id="fd-iman"><rect x="-38" y="-16" width="38" height="32" rx="5" fill="var(--med)"/><rect x="0" y="-16" width="38" height="32" rx="5" fill="var(--tec)"/><text x="-19" y="6" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">N</text><text x="19" y="6" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">S</text></g>' +
        '<g stroke="var(--fis)" stroke-width="5" fill="none"><path d="M 400 60 a 30 40 0 1 0 2 0"/><path d="M 400 60 a 30 40 0 1 1 -2 0"/></g>' +
        '<text x="400" y="160" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">bobina</text>' +
        '<circle id="fd-luz" cx="490" cy="100" r="15" fill="#ffd23e" opacity="0.15"/>' +
        '<text x="490" y="140" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">bombilla</text>' +
        '<text id="fd-txt" x="280" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">El imán oscila junto a la bobina: solo el CAMBIO del campo magnético induce corriente. Con el imán quieto, nada; cuanto más rápido se mueve, más brilla la bombilla. Toda la electricidad de tu enchufe nace exactamente así.</p>';
      var iman = cont.querySelector("#fd-iman"), luz = cont.querySelector("#fd-luz"), txt = cont.querySelector("#fd-txt");
      var rango = cont.querySelector("#fd-rango");
      var fase = 0;
      rango.addEventListener("input", function () { cont.querySelector("#fd-val").textContent = rango.value; });
      animar(cont, function (dt) {
        var v = +rango.value;
        fase += v * 1.6 * dt;
        var x = 150 + Math.sin(fase) * 130;
        iman.setAttribute("transform", "translate(" + x + ",100)");
        var derivada = Math.abs(Math.cos(fase)) * v;
        luz.setAttribute("opacity", Math.min(1, 0.12 + derivada / 7));
        luz.setAttribute("r", 13 + Math.min(9, derivada));
        txt.textContent = v === 0 ? "Imán quieto: campo constante → corriente CERO. Faraday exige cambio." :
          "Corriente inducida ∝ velocidad del cambio (" + nf(derivada, 1) + ")";
      });
    }
    registrar({ id: "sim-faraday", icono: "🔋", titulo: "El imán que fabrica luz", ley: "faraday-induccion", resumen: "Mueve un imán junto a una bobina: del vaivén sale tu electricidad.", render: render });
  })();

  registrar({
    id: "sim-hubble", icono: "🌌", titulo: "El bizcocho que se hincha", ley: "hubble",
    resumen: "Hincha el universo y mira alejarse cada galaxia según su distancia.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Expansión del universo", min: 0, max: 100, valor: 20, fmt: function (v) { return "+" + v + "%"; } }],
      grafico: function (v) {
        var f = 1 + v.t / 100;
        var GALAXIAS = [[60, 40], [140, 100], [90, 160], [200, 60], [250, 140], [30, 110]];
        var cx = 140, cy = 100;
        var s = '<svg viewBox="0 0 560 210" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<text x="150" y="18" font-size="11" fill="var(--tinta-tenue)">🏠 tu galaxia (círculo)</text>';
        s += '<circle cx="' + cx + '" cy="' + (cy + 10) + '" r="8" fill="var(--acento)"/>';
        GALAXIAS.forEach(function (g) {
          var nx = cx + (g[0] - cx) * f, ny = cy + 10 + (g[1] - cy) * f;
          nx = Math.min(545, Math.max(15, nx));
          ny = Math.min(195, Math.max(15, ny));
          var d0 = Math.hypot(g[0] - cx, g[1] - cy);
          var vel = d0 * (f - 1);
          var rojo = Math.min(255, 120 + vel * 1.4);
          s += '<text x="' + nx + '" y="' + ny + '" text-anchor="middle" font-size="15" fill="rgb(' + nf(rojo, 0) + ',80,120)">✦</text>';
          if (v.t > 4) s += '<line x1="' + (cx + (g[0] - cx) * 1.02) + '" y1="' + (cy + 10 + (g[1] - cy) * 1.02) + '" x2="' + nx + '" y2="' + ny + '" stroke="var(--borde)" stroke-dasharray="2 3"/>';
        });
        s += "</svg>";
        return s;
      },
      nota: function (v) {
        return v.t === 0 ? "El bizcocho antes del horno: memoriza las posiciones." :
          "Las galaxias LEJANAS se alejaron mucho más que las cercanas — v = H·d: no huyen de ti, es el espacio estirándose. Y cualquier otra galaxia vería exactamente lo mismo: todas parecen el centro, ninguna lo es.";
      },
      pie: "Ley de Hubble-Lemaître: velocidad proporcional a distancia. Rebobina la expansión y llegas a un inicio: esta ley es la partida de nacimiento del Big Bang."
    })
  });

})();
