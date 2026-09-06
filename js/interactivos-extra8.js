/* ==========================================================================
   Leyes de la Vida — Interactivos VIII: ampliación a 200 (química/biología)
   Autor: Jeshua Romero Guadarrama
   ========================================================================== */

(function () {
  "use strict";

  var U = window.UTILSIM;
  var nf = U.nf, graficoLineas = U.graficoLineas;
  var simCurva = U.simCurva, simAdivina = U.simAdivina, registrar = U.registrar, animar = U.animar;
  var azar = Math.random;

  /* ======================= QUÍMICA ======================= */

  registrar({
    id: "sim-dalton-p", icono: "🤿", titulo: "Cada gas paga su parte", ley: "dalton-presiones",
    resumen: "Mezcla gases en un tanque y suma sus presiones parciales.",
    render: simCurva({
      controles: [
        { id: "n2", etiqueta: "Nitrógeno", min: 0, max: 100, valor: 78, fmt: function (v) { return v + " kPa"; } },
        { id: "o2", etiqueta: "Oxígeno", min: 0, max: 100, valor: 21, fmt: function (v) { return v + " kPa"; } },
        { id: "co2", etiqueta: "CO₂", min: 0, max: 40, valor: 1, fmt: function (v) { return v + " kPa"; } }
      ],
      grafico: function (v) {
        var total = v.n2 + v.o2 + v.co2;
        var filas = [["N₂", v.n2, "var(--tec)"], ["O₂", v.o2, "var(--est)"], ["CO₂", v.co2, "var(--tinta-tenue)"]];
        var s = '<svg viewBox="0 0 560 150" style="width:100%;max-width:560px;margin:0 auto">';
        var x = 20;
        filas.forEach(function (f) {
          var w = (f[1] / 240) * 520;
          if (w > 0.5) {
            s += '<rect x="' + x + '" y="30" width="' + w + '" height="44" fill="' + f[2] + '"/>';
            if (w > 34) s += '<text x="' + (x + w / 2) + '" y="57" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">' + f[0] + "</text>";
            x += w;
          }
        });
        s += '<text x="20" y="20" font-size="12" fill="var(--tinta-suave)">Presión total del tanque:</text>';
        s += '<text x="280" y="115" text-anchor="middle" font-size="20" font-weight="800" fill="var(--tinta)">' + nf(total, 0) + " kPa = " + v.n2 + " + " + v.o2 + " + " + v.co2 + "</text>";
        return s + "</svg>";
      },
      nota: function (v) {
        return v.o2 < 12 ? "🚨 Presión parcial de O₂ insuficiente: da igual la presión total — el oxígeno difunde según SU parte. Así se muere en altitud." :
          v.co2 > 8 ? "⚠️ CO₂ parcial alto: somnolencia y narcosis. En el buceo, cada gas se vuelve tóxico según SU presión parcial, no la total." :
            "Cada gas actúa como si estuviera solo: la presión total es la simple suma de las partes (Dalton, 1801).";
      },
      pie: "En el Everest el aire sigue siendo 21% oxígeno, pero con un tercio de presión total: la presión parcial de O₂ no da para vivir. En el buceo, el problema es el contrario."
    })
  });

  (function () {
    function render(cont) {
      var corriendo = false, xH = 40, xO = 40;
      cont.innerHTML =
        '<div class="fila-controles" style="justify-content:center"><button class="boton-sim" id="gr2-go">🏁 ¡Carrera de gases por el poro!</button></div>' +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 150" style="width:100%">' +
        '<line x1="0" y1="55" x2="560" y2="55" stroke="var(--borde)"/><line x1="0" y1="115" x2="560" y2="115" stroke="var(--borde)"/>' +
        '<text x="8" y="40" font-size="11" fill="var(--tinta-suave)">H₂ (masa 2)</text>' +
        '<text x="8" y="100" font-size="11" fill="var(--tinta-suave)">O₂ (masa 32)</text>' +
        '<circle id="gr2-h" cx="40" cy="48" r="7" fill="var(--qui)"/>' +
        '<circle id="gr2-o" cx="40" cy="108" r="11" fill="var(--tec)"/>' +
        '<line x1="530" y1="20" x2="530" y2="130" stroke="var(--med)" stroke-dasharray="6 4" stroke-width="2"/>' +
        '<text id="gr2-txt" x="280" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)">Misma temperatura = misma energía. ¿Quién escapa antes?</text>' +
        "</svg></div>" +
        '<p class="nota-sim">Ley de Graham: velocidad ∝ 1/√masa. El hidrógeno (masa 2) corre √(32/2) = 4 veces más que el oxígeno (masa 32). Con esta diferencia de raíces cuadradas se separaron los isótopos de uranio y se desinflan los globos de helio.</p>';
      var h = cont.querySelector("#gr2-h"), o = cont.querySelector("#gr2-o"), txt = cont.querySelector("#gr2-txt");
      cont.querySelector("#gr2-go").addEventListener("click", function () {
        xH = 40; xO = 40; corriendo = true;
        txt.textContent = "¡Corriendo!";
      });
      animar(cont, function (dt) {
        if (!corriendo) return;
        xH += 160 * dt;
        xO += 40 * dt;
        h.setAttribute("cx", Math.min(530, xH));
        o.setAttribute("cx", Math.min(530, xO));
        if (xH >= 530) {
          txt.textContent = "H₂ llegó ×4 antes: velocidad ∝ 1/√masa. El O₂ va por el " + nf(((xO - 40) / 490) * 100, 0) + "%.";
          if (xO >= 530) { corriendo = false; txt.textContent = "Meta para ambos: el ligero escapó 4 veces antes (Graham)."; }
        }
      });
    }
    registrar({ id: "sim-graham", icono: "🏁", titulo: "La carrera de las moléculas", ley: "graham", resumen: "H₂ contra O₂ hacia el poro: gana la raíz cuadrada.", render: render });
  })();

  registrar({
    id: "sim-beer", icono: "🍵", titulo: "El té que se oscurece", ley: "beer-lambert",
    resumen: "Concentra la disolución o alarga el camino de la luz: mide lo que llega.",
    render: simCurva({
      controles: [
        { id: "c", etiqueta: "Concentración", min: 0, max: 100, valor: 30, fmt: function (v) { return v + "%"; } },
        { id: "l", etiqueta: "Grosor del vaso (camino óptico)", min: 1, max: 10, valor: 3, fmt: function (v) { return v + " cm"; } }
      ],
      grafico: function (v) {
        var transmitida = Math.pow(10, -(v.c / 100) * v.l * 0.35) * 100;
        var s = '<svg viewBox="0 0 560 170" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<path d="M 20 85 h 120 m -10 -7 l 10 7 l -10 7" stroke="#f2b21d" stroke-width="6" fill="none"/>';
        s += '<text x="70" y="60" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">luz: 100%</text>';
        var w = 30 + v.l * 22;
        var opacidad = Math.min(0.92, 0.08 + (v.c / 100) * 0.9);
        s += '<rect x="160" y="30" width="' + w + '" height="110" rx="8" fill="rgba(120,72,20,' + nf(opacidad, 2) + ')" stroke="var(--borde)"/>';
        var wl = Math.max(2, transmitida * 1.4);
        s += '<path d="M ' + (170 + w) + ' 85 h ' + wl + ' m -8 -6 l 8 6 l -8 6" stroke="#f2b21d" stroke-width="' + Math.max(1.5, transmitida / 18) + '" fill="none" opacity="' + Math.max(0.25, transmitida / 100) + '"/>';
        s += '<text x="' + (185 + w + wl) + '" y="90" font-size="13" font-weight="800" fill="var(--tinta)">' + nf(transmitida, 1) + "%</text>";
        return s + "</svg>";
      },
      nota: function (v) {
        var t = Math.pow(10, -(v.c / 100) * v.l * 0.35) * 100;
        return "Cada capa absorbe la misma FRACCIÓN: doblar concentración o camino multiplica la absorción (exponencial, no suma). Transmitida: <strong>" + nf(t, 1) + "%</strong>. Así mide el pulsioxímetro tu oxígeno y el laboratorio tu glucosa: color → concentración.";
      },
      pie: "Ley de Beer-Lambert: la base de medio laboratorio moderno. El té en taza alta se ve más oscuro que en plato: mismo té, más camino óptico."
    })
  });

  registrar({
    id: "sim-electrolisis", icono: "🥇", titulo: "Contar átomos con amperios", ley: "faraday-electrolisis",
    resumen: "Ajusta corriente y tiempo y pesa el metal depositado.",
    render: simCurva({
      controles: [
        { id: "i", etiqueta: "Corriente", min: 1, max: 20, valor: 5, fmt: function (v) { return v + " A"; } },
        { id: "t", etiqueta: "Tiempo", min: 1, max: 120, valor: 30, fmt: function (v) { return v + " min"; } }
      ],
      grafico: function (v) {
        var gramos = (v.i * v.t * 60 * 63.5) / (2 * 96485);
        var pts = [];
        for (var t = 0; t <= 120; t += 5) pts.push({ x: t, y: (v.i * t * 60 * 63.5) / (2 * 96485) });
        return {
          series: [{ nombre: "Cobre depositado (g) con " + v.i + " A", color: "var(--qui)", puntos: pts }],
          xMax: 120, yMax: 50, xEtiq: "Minutos", yEtiq: "Gramos de cobre",
          marcas: [{ x: v.t, y: gramos, texto: nf(gramos, 1) + " g" }]
        };
      },
      nota: function (v) {
        var gramos = (v.i * v.t * 60 * 63.5) / (2 * 96485);
        return v.i + " A × " + v.t + " min = <strong>" + nf(gramos, 2) + " g de cobre</strong> depositados, ni un átomo más: cada electrón entrega exactamente su parte. La electricidad es una báscula que cuenta átomos.";
      },
      pie: "Leyes de Faraday de la electrólisis: masa ∝ carga. Todo el aluminio, el cromado y el «bañado en oro» del mundo salen de esta proporcionalidad exacta."
    })
  });

  (function () {
    var ELEMENTOS = [
      ["Na", 1, "pierde 1 → Na⁺", "metal que explota en agua"],
      ["Mg", 2, "pierde 2 → Mg²⁺", "metal reactivo"],
      ["C", 4, "comparte 4 (enlaces covalentes)", "el arquitecto de la vida"],
      ["O", 6, "gana 2 → O²⁻", "ávido de electrones"],
      ["Cl", 7, "gana 1 → Cl⁻", "muy ávido: oxidante"],
      ["Ne", 8, "ni gana ni pierde", "gas noble: completo de fábrica"]
    ];
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles" id="oc-chips" style="justify-content:center"></div>' +
        '<div class="lienzo-sim" id="oc-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="oc-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Cada átomo busca completar 8 electrones externos: los que sobran se regalan, los que faltan se roban o comparten. De esa contabilidad simple nace la sal (Na⁺Cl⁻), el agua y toda la química cotidiana. Los gases nobles, ya completos, no necesitan a nadie.</p>';
      var chips = cont.querySelector("#oc-chips");
      ELEMENTOS.forEach(function (el, i) {
        var b = document.createElement("button");
        b.className = "chip" + (i === 0 ? " activo" : "");
        b.textContent = el[0];
        b.addEventListener("click", function () {
          chips.querySelectorAll(".chip").forEach(function (o) { o.classList.remove("activo"); });
          b.classList.add("activo");
          pintar(el);
        });
        chips.appendChild(b);
      });
      function pintar(el) {
        var n = el[1];
        var s = '<svg viewBox="0 0 300 220" style="max-width:280px;margin:0 auto">';
        s += '<circle cx="150" cy="100" r="30" fill="var(--qui)"/><text x="150" y="107" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">' + el[0] + "</text>";
        s += '<circle cx="150" cy="100" r="70" fill="none" stroke="var(--borde)" stroke-dasharray="4 4"/>';
        for (var i = 0; i < 8; i++) {
          var a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          var lleno = i < n;
          s += '<circle cx="' + (150 + 70 * Math.cos(a)) + '" cy="' + (100 + 70 * Math.sin(a)) + '" r="8" fill="' + (lleno ? "var(--tec)" : "var(--superficie)") + '" stroke="var(--tec)"' + (lleno ? "" : ' stroke-dasharray="3 2"') + "/>";
        }
        s += '<text x="150" y="205" text-anchor="middle" font-size="12" fill="var(--tinta-suave)">' + n + " de 8 electrones externos</text></svg>";
        cont.querySelector("#oc-lienzo").innerHTML = s;
        cont.querySelector("#oc-nota").innerHTML = "<strong>" + el[2] + "</strong> — " + el[3] + ".";
      }
      pintar(ELEMENTOS[0]);
    }
    registrar({ id: "sim-octeto", icono: "🎯", titulo: "La obsesión del ocho", ley: "octeto", resumen: "Elige un átomo y descubre cómo completa (o no) su octeto.", render: render });
  })();

  registrar({
    id: "sim-markovnikov", icono: "🧲", titulo: "El rico se hace más rico", ley: "markovnikov",
    resumen: "Predice a qué carbono va el hidrógeno en tres adiciones.",
    render: simAdivina({
      preguntas: [
        {
          texto: "Propeno (CH₂=CH–CH₃) + HBr. ¿Dónde acaba el Br?", opciones: [
            { t: "En el carbono CENTRAL (el «rico» en sustituyentes)", ok: true },
            { t: "En el carbono de la punta (CH₂)" }
          ], retro: "El H va al carbono que ya tiene más hidrógenos (la punta) y el Br al central: el carbocatión intermedio más sustituido es el más estable."
        },
        {
          texto: "Metilpropeno ((CH₃)₂C=CH₂) + H₂O (con ácido). ¿Dónde va el OH?", opciones: [
            { t: "Al carbono con los dos metilos (terciario)", ok: true },
            { t: "Al CH₂ terminal" }
          ], retro: "Markóvnikov de manual: el OH se instala en el carbono más sustituido — la reacción fluye por el cauce del catión más cómodo."
        },
        {
          texto: "Propeno + HBr... pero AHORA con peróxidos en el matraz. ¿Y el Br?", opciones: [
            { t: "¡Al carbono terminal! (anti-Markóvnikov)", ok: true },
            { t: "Al central, como siempre" }
          ], retro: "La letra pequeña: con peróxidos el mecanismo cambia (radicales) y la regla se INVIERTE. Las reglas químicas describen mecanismos, no dogmas."
        }
      ],
      final: function () { return "Regla de Markóvnikov: el hidrógeno va al carbono que ya tiene más hidrógenos... salvo que cambies el mecanismo. Predecir productos sobre el papel: eso inauguró esta regla en 1870."; }
    })
  });

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Sal en el agua exterior: <strong id="vh-val">0</strong> g/L</label>' +
        '<input type="range" id="vh-rango" min="0" max="100" value="0">' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 200" style="width:100%">' +
        '<rect x="80" y="30" width="400" height="140" rx="10" fill="none" stroke="var(--borde)" stroke-width="3"/>' +
        '<line x1="280" y1="30" x2="280" y2="170" stroke="var(--qui)" stroke-width="4" stroke-dasharray="7 5"/>' +
        '<rect id="vh-agua1" x="83" y="60" width="194" height="107" fill="color-mix(in srgb, var(--tec) 35%, transparent)"/>' +
        '<rect id="vh-agua2" x="283" y="60" width="194" height="107" fill="color-mix(in srgb, var(--tec) 55%, transparent)"/>' +
        '<text x="180" y="50" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">gominola 🍬 (azúcar dentro)</text>' +
        '<text x="380" y="50" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">agua exterior</text>' +
        '<text id="vh-txt" x="280" y="20" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="marcador" id="vh-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">La membrana (línea punteada) solo deja pasar agua. El agua fluye hacia donde hay MÁS soluto, con presión calculable como si el soluto fuera un gas (van \'t Hoff, primer Nobel de Química). Sube la sal exterior y drena la gominola.</p>';
      var rango = cont.querySelector("#vh-rango");
      var a1 = cont.querySelector("#vh-agua1"), a2 = cont.querySelector("#vh-agua2");
      function pintar() {
        var sal = +rango.value;
        cont.querySelector("#vh-val").textContent = sal;
        var dentro = 50;
        var flujo = (dentro - sal) * 0.8;
        var h1 = Math.max(24, Math.min(130, 85 + flujo));
        var h2 = Math.max(24, Math.min(130, 85 - flujo));
        a1.setAttribute("y", 167 - h1); a1.setAttribute("height", h1);
        a2.setAttribute("y", 167 - h2); a2.setAttribute("height", h2);
        cont.querySelector("#vh-txt").textContent = flujo > 6 ? "el agua entra → la gominola se HINCHA" : flujo < -6 ? "el agua sale → la gominola se ARRUGA" : "equilibrio osmótico";
        cont.querySelector("#vh-nota").innerHTML = sal < 30 ? "Agua dulce fuera: entra hacia el azúcar — la gominola amanece gigante. Igual se riegan las plantas." :
          sal < 70 ? "Concentraciones parejas: ni hincha ni arruga — como el suero intravenoso, diseñado para tus glóbulos rojos." :
            "Mucha sal fuera: la gominola (o la lechuga aliñada pronto) se deshidrata. La ósmosis inversa de las desaladoras empuja contra esta presión.";
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-vanthoff", icono: "🍬", titulo: "La gominola y la ósmosis", ley: "vant-hoff", resumen: "Hincha o arruga una gominola manejando la sal del agua.", render: render });
  })();

  registrar({
    id: "sim-ostwald", icono: "💧", titulo: "Diluir para romper", ley: "ostwald",
    resumen: "Diluye un ácido débil y mira crecer su porcentaje de disociación.",
    render: simCurva({
      controles: [{ id: "d", etiqueta: "Dilución", min: 0, max: 100, valor: 10, fmt: function (v) { return "×" + nf(Math.pow(10, v / 25), 0); } }],
      grafico: function (v) {
        function alfa(d) { return Math.min(96, 0.6 * Math.pow(Math.pow(10, d / 25), 0.5) * 4); }
        var pts = [];
        for (var d = 0; d <= 100; d += 2) pts.push({ x: d, y: alfa(d) });
        return {
          series: [{ nombre: "% de moléculas disociadas en iones", color: "var(--qui)", puntos: pts }],
          xMax: 100, yMax: 100, xEtiq: "Dilución (escala log)", yEtiq: "% disociado",
          marcas: [{ x: v.d, y: alfa(v.d), texto: nf(alfa(v.d), 0) + "%" }]
        };
      },
      nota: function (v) {
        return v.d < 20 ? "Vinagre concentrado: los iones se reencuentran enseguida — apenas un puñado disociado." :
          v.d < 70 ? "Al diluir, los iones quedan lejos unos de otros y la disociación gana terreno: Le Chatelier respondiendo a la dilución." :
            "Muy diluido: casi todas las moléculas rotas en iones. Menos ácido total, mayor FRACCIÓN activa — el contraintuitivo favorito de Ostwald.";
      },
      pie: "Ley de dilución de Ostwald (1888): en los electrolitos débiles, diluir aumenta el grado de disociación. La conductividad de las disoluciones débiles lo delata."
    })
  });

  /* ======================= BIOLOGÍA ======================= */

  registrar({
    id: "sim-gloger", icono: "🐦", titulo: "El plumaje del clima", ley: "gloger",
    resumen: "Muda un ave entre climas y mira oscurecerse (o aclararse) su plumaje.",
    render: simCurva({
      controles: [
        { id: "h", etiqueta: "Humedad del hábitat", min: 0, max: 100, valor: 50, fmt: function (v) { return v + "%"; } },
        { id: "t", etiqueta: "Temperatura", min: -20, max: 35, valor: 15, fmt: function (v) { return v + " °C"; } }
      ],
      grafico: function (v) {
        var pigmento = Math.max(5, Math.min(95, (v.h * 0.6 + (v.t + 20) * 0.7)));
        var tono = Math.round(200 - pigmento * 1.7);
        var color = "rgb(" + tono + "," + Math.round(tono * 0.82) + "," + Math.round(tono * 0.62) + ")";
        var fondo = v.h > 60 ? "#3f5d3f" : v.t < 0 ? "#dfe9f2" : "#e8dbb5";
        var s = '<svg viewBox="0 0 560 190" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<rect x="0" y="0" width="560" height="190" rx="10" fill="' + fondo + '"/>';
        s += '<ellipse cx="280" cy="110" rx="55" ry="38" fill="' + color + '" stroke="#333" stroke-width="1.5"/>';
        s += '<circle cx="330" cy="85" r="20" fill="' + color + '" stroke="#333" stroke-width="1.5"/>';
        s += '<path d="M 348 84 l 18 5 l -18 6 Z" fill="#d9a504"/>';
        s += '<circle cx="336" cy="80" r="3" fill="#111"/>';
        s += '<path d="M 250 105 q -25 -22 -8 -34" fill="none" stroke="#333" stroke-width="1.5"/>';
        s += '<text x="280" y="178" text-anchor="middle" font-size="11" fill="#222">pigmentación: ' + nf(pigmento, 0) + "%</text>";
        return s + "</svg>";
      },
      nota: function (v) {
        return v.h > 60 && v.t > 15 ? "Trópico húmedo: plumaje oscuro — la melanina protege del sol, endurece la pluma contra las bacterias de lo húmedo y camufla en la sombra." :
          v.t < 0 ? "Clima polar: claro (a veces blanco puro) — menos radiación que soportar y nieve donde esconderse." :
            "Clima intermedio, pigmento intermedio: la regla de Gloger pinta las especies con el mapa del clima.";
      },
      pie: "Tercera del trío climático (Bergmann y Allen dan tamaño y orejas; Gloger, el color). En humanos, el gradiente de piel con la latitud sigue una lógica pareja."
    })
  });

  registrar({
    id: "sim-foster", icono: "🏝️", titulo: "La isla que cambia tallas", ley: "foster",
    resumen: "Encierra un elefante y una rata en islas de distinto tamaño.",
    render: simCurva({
      controles: [{ id: "gen", etiqueta: "Generaciones en la isla", min: 0, max: 100, paso: 5, valor: 0, fmt: function (v) { return nf(v * 1000, 0); } }],
      grafico: function (v) {
        var f = v.gen / 100;
        var rElef = 46 - f * 28;
        var rRata = 7 + f * 16;
        var s = '<svg viewBox="0 0 560 200" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<ellipse cx="280" cy="165" rx="240" ry="26" fill="#e8d5a8"/><ellipse cx="280" cy="160" rx="240" ry="24" fill="#7cb56b"/>';
        s += '<text x="150" y="' + (150 - rElef) + '" text-anchor="middle" font-size="' + (rElef * 1.9) + '">🐘</text>';
        s += '<text x="150" y="182" text-anchor="middle" font-size="10" fill="#333">elefante: ' + nf(100 - f * 62, 0) + "% del tamaño</text>";
        s += '<text x="410" y="' + (152 - rRata) + '" text-anchor="middle" font-size="' + (rRata * 2.6) + '">🐀</text>';
        s += '<text x="410" y="182" text-anchor="middle" font-size="10" fill="#333">rata: ' + nf(100 + f * 240, 0) + "% del tamaño</text>";
        return s + "</svg>";
      },
      nota: function (v) {
        return v.gen === 0 ? "Acaban de llegar a la isla: tamaños continentales." :
          v.gen < 50 ? "Sin depredadores, la rata ya no se esconde: crece. Con poca comida, el elefante mengua generación a generación." :
            "Convergencia insular: elefantes enanos (como los de Sicilia, ¿origen del cíclope?) y roedores gigantes. La regla de Foster esculpió también al «hobbit» de Flores.";
      },
      pie: "Regla de las islas: los grandes se hacen enanos (escasez) y los pequeños gigantes (sin depredadores). El registro fósil insular es un catálogo de tallas imposibles."
    })
  });

  registrar({
    id: "sim-zahavi", icono: "🦚", titulo: "La cola carísima", ley: "zahavi",
    resumen: "Agranda la cola del pavo real y equilibra seducción contra supervivencia.",
    render: simCurva({
      controles: [{ id: "c", etiqueta: "Tamaño de la cola", min: 0, max: 100, valor: 40 }],
      grafico: function (v) {
        var sup = [], parejas = [], exito = [];
        for (var c = 0; c <= 100; c += 2) {
          var s0 = 95 - Math.pow(c / 10, 1.9);
          var p0 = 8 + c * 0.9;
          sup.push({ x: c, y: Math.max(4, s0) });
          parejas.push({ x: c, y: p0 });
          exito.push({ x: c, y: Math.max(2, s0 * p0 / 100) });
        }
        function fe(c) { return Math.max(2, (95 - Math.pow(c / 10, 1.9)) * (8 + c * 0.9) / 100); }
        return {
          series: [
            { nombre: "Supervivencia", color: "var(--est)", puntos: sup },
            { nombre: "Atractivo (parejas)", color: "var(--soc)", puntos: parejas },
            { nombre: "Éxito total (descendencia)", color: "var(--ges)", puntos: exito }
          ], xMax: 100, yMax: 100, xEtiq: "Tamaño de la cola", yEtiq: "Índice",
          marcas: [{ x: v.c, y: fe(v.c) }]
        };
      },
      nota: function (v) {
        return v.c < 25 ? "Cola discreta: sobrevives bien pero nadie te mira — señal barata, señal increíble." :
          v.c < 70 ? "La zona del pavo real: la cola estorba LO JUSTO para demostrar que puedes permitírtela. El coste garantiza la honestidad de la señal." :
            "Cola suicida: hasta la mejor genética muere corriendo con esto. El hándicap tiene un óptimo — más allá, el zorro cobra.";
      },
      pie: "Principio del hándicap: las señales costosas son creíbles porque los débiles no pueden fingirlas. La gacela que brinca ante el león y el banco de mármol firman la misma ley."
    })
  });

  (function () {
    function render(cont) {
      var estado = { mimeticos: 10, generacion: 0 };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="bt-gen">🐦 Pasar una generación</button>' +
        '<button class="boton-sim secundario" id="bt-x5">×5</button>' +
        '<button class="boton-sim secundario" id="bt-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="bt-lienzo"></div>' +
        '<p class="marcador" id="bt-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Avispas reales (con aguijón) y moscas disfrazadas de avispa. El disfraz protege... mientras los impostores sean minoría. Cuando abundan, los pájaros «pierden el respeto» al uniforme y el mimetismo se devalúa: una economía de la falsificación con inflación.</p>';
      function pintar() {
        var m = estado.mimeticos;
        var s = '<svg viewBox="0 0 560 150" style="width:100%;max-width:560px;margin:0 auto">';
        for (var i = 0; i < 40; i++) {
          var esMosca = (i / 40) * 100 < m;
          var x = 24 + (i % 10) * 57, y = 28 + Math.floor(i / 10) * 34;
          s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="18">' + (esMosca ? "🪰" : "🐝") + "</text>";
        }
        s += "</svg>";
        cont.querySelector("#bt-lienzo").innerHTML = s;
        var protec = Math.max(5, 95 - Math.pow(m / 10, 2.1) * 4);
        cont.querySelector("#bt-nota").innerHTML = "Generación " + estado.generacion + " · Imitadores: <strong>" + nf(m, 0) + "%</strong> · Protección del disfraz: <strong>" + nf(protec, 0) + "%</strong>" +
          (m > 55 ? " — los pájaros ya atacan a todo lo amarillo: la señal quebró por exceso de falsificadores." : "");
      }
      function generacion(n) {
        for (var i = 0; i < n; i++) {
          estado.generacion++;
          var protec = Math.max(5, 95 - Math.pow(estado.mimeticos / 10, 2.1) * 4);
          if (protec > 45) estado.mimeticos = Math.min(90, estado.mimeticos * 1.25);
          else estado.mimeticos = Math.max(4, estado.mimeticos * 0.8);
        }
        pintar();
      }
      cont.querySelector("#bt-gen").addEventListener("click", function () { generacion(1); });
      cont.querySelector("#bt-x5").addEventListener("click", function () { generacion(5); });
      cont.querySelector("#bt-reset").addEventListener("click", function () { estado = { mimeticos: 10, generacion: 0 }; pintar(); });
      pintar();
    }
    registrar({ id: "sim-batesiano", icono: "🪰", titulo: "El baile de máscaras", ley: "batesiano", resumen: "Deja crecer a los imitadores hasta que el disfraz deje de colar.", render: render });
  })();

  registrar({
    id: "sim-verhulst", icono: "🦠", titulo: "La S de la vida", ley: "verhulst",
    resumen: "Cría bacterias con recursos finitos y dibuja la curva logística.",
    render: simCurva({
      controles: [
        { id: "r", etiqueta: "Ritmo de reproducción", min: 2, max: 12, valor: 6, fmt: function (v) { return nf(v / 10, 1); } },
        { id: "k", etiqueta: "Capacidad del entorno (K)", min: 30, max: 100, valor: 80 }
      ],
      grafico: function (v) {
        var pts = [], n = 2;
        for (var t = 0; t <= 40; t++) {
          pts.push({ x: t, y: n });
          n = n + (v.r / 10) * n * (1 - n / v.k);
        }
        return {
          series: [
            { nombre: "Población", color: "var(--bio)", puntos: pts },
            { nombre: "Capacidad de carga K", color: "var(--med)", puntos: [{ x: 0, y: v.k }, { x: 40, y: v.k }] }
          ], xMax: 40, yMax: 108, xEtiq: "Tiempo (horas)", yEtiq: "Población (millones)"
        };
      },
      nota: function (v) {
        return "Despegue exponencial → freno al oler el techo → meseta en K: la S de Verhulst. La misma curva dibuja epidemias, ventas de móviles y bacterias del yogur — nada crece exponencial para siempre (que se lo digan a Stein y a Malthus).";
      },
      pie: "Ley logística (1838): el crecimiento se frena en proporción a lo que queda de sitio. La respuesta matemática al apocalipsis de Malthus."
    })
  });

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Velocidad del reloj ecológico: <strong id="lv-val">1×</strong></label>' +
        '<input type="range" id="lv-rango" min="0" max="30" value="10">' +
        "</div>" +
        '<div class="lienzo-sim" id="lv-lienzo"></div>' +
        '<p class="marcador" id="lv-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">El vals eterno: muchas liebres alimentan más linces, que reducen liebres, que hambrean linces, que liberan liebres... El depredador va siempre un compás por detrás. Los registros de pieles de la Bahía de Hudson dibujaron estos ciclos durante 90 años.</p>';
      var historia = [], liebres = 60, linces = 12, tAcum = 0;
      function paso(dt) {
        var dL = 0.9 * liebres - 0.045 * liebres * linces;
        var dZ = 0.008 * liebres * linces - 0.6 * linces;
        liebres = Math.max(2, liebres + dL * dt);
        linces = Math.max(1, linces + dZ * dt);
      }
      animar(cont, function (dt) {
        var vel = +cont.querySelector("#lv-rango").value / 10;
        cont.querySelector("#lv-val").textContent = nf(vel, 1) + "×";
        if (vel > 0) {
          tAcum += dt * vel;
          paso(dt * vel);
          historia.push({ x: tAcum, y: liebres, z: linces });
          if (historia.length > 400) historia.shift();
        }
        if (historia.length < 3) return;
        var x0 = historia[0].x;
        cont.querySelector("#lv-lienzo").innerHTML = graficoLineas({
          series: [
            { nombre: "🐇 Liebres", color: "var(--bio)", puntos: historia.map(function (h) { return { x: h.x - x0, y: h.y }; }) },
            { nombre: "🐆 Linces (×3 para verlos)", color: "var(--ges)", puntos: historia.map(function (h) { return { x: h.x - x0, y: h.z * 3 }; }) }
          ], xMax: Math.max(10, tAcum - x0), yMax: 130, xEtiq: "Tiempo", yEtiq: "Población"
        });
        cont.querySelector("#lv-nota").innerHTML = "🐇 " + nf(liebres, 0) + " · 🐆 " + nf(linces, 0) +
          (liebres > 80 ? " — festín a la vista: los linces criarán..." : linces * 3 > liebres ? " — demasiados dientes: las liebres caen y el hambre siguiente ya está servida." : "");
      });
    }
    registrar({ id: "sim-lotka", icono: "🐆", titulo: "El vals del lince y la liebre", ley: "lotka-volterra", resumen: "Mira oscilar en vivo el ciclo eterno depredador-presa.", render: render });
  })();

  (function () {
    var ETAPAS = [
      ["Semana 4", "Arcos faríngeos (parientes de las branquias), cola, corazón tubular: el plan compartido de TODOS los vertebrados.", "🫥"],
      ["Semana 7", "La cola se reabsorbe, los arcos se convierten en mandíbula, oído y laringe: el plan diverge hacia «humano».", "👶"],
      ["Adulto", "Quedan cicatrices del plan ancestral: el hipo, el coxis y un nervio laríngeo que da un rodeo absurdo heredado de los peces.", "🧍"]
    ];
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Desarrollo embrionario: <strong id="hk3-val">Semana 4</strong></label>' +
        '<input type="range" id="hk3-rango" min="0" max="2" value="0">' +
        "</div>" +
        '<div class="lienzo-sim" id="hk3-lienzo" style="text-align:center;padding:24px"></div>' +
        '<p class="nota-sim">⚠️ Ficha con moraleja: Haeckel EXAGERÓ (el embrión nunca es un pez adulto, y retocó sus dibujos). Lo real (von Baer): los embriones de vertebrados comparten un plan inicial del que cada linaje diverge — la evolución remodela programas heredados, no empieza de cero. Hasta las leyes célebres caducan; sus ruinas enseñan.</p>';
      var rango = cont.querySelector("#hk3-rango");
      function pintar() {
        var e = ETAPAS[+rango.value];
        cont.querySelector("#hk3-val").textContent = e[0];
        cont.querySelector("#hk3-lienzo").innerHTML =
          '<p style="font-size:3.2rem;margin:0">' + e[2] + "</p>" +
          '<p class="marcador" style="margin:8px 0 6px">' + e[0] + "</p>" +
          '<p style="color:var(--tinta-suave);max-width:520px;margin:0 auto">' + e[1] + "</p>";
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-haeckel", icono: "🐟", titulo: "Las cicatrices del plan", ley: "haeckel", resumen: "Recorre el embrión: qué dijo Haeckel, qué era verdad y qué no.", render: render });
  })();

  registrar({
    id: "sim-yoda", icono: "🌲", titulo: "El bosque que se poda solo", ley: "yoda",
    resumen: "Siembra denso y deja que la sombra haga la selección (pendiente −3/2).",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años del bosque", min: 0, max: 60, valor: 10 }],
      grafico: function (v) {
        var dens = 1000 * Math.pow(0.94, v.t);
        var peso = Math.pow(1000 / dens, 1.5) * 0.5;
        var arboles = Math.max(4, Math.round(dens / 40));
        var s = '<svg viewBox="0 0 560 180" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<rect x="0" y="150" width="560" height="30" fill="#6b4f2f"/>';
        var talla = Math.min(56, 10 + Math.pow(v.t, 0.9) * 2.2);
        for (var i = 0; i < arboles; i++) {
          var x = 20 + (i / Math.max(1, arboles - 1)) * 520;
          s += '<text x="' + x + '" y="152" text-anchor="middle" font-size="' + talla + '">🌲</text>';
        }
        s += '<text x="280" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)">' + nf(dens, 0) + " árboles/ha · peso medio ×" + nf(peso / 0.5, 1) + "</text>";
        return s + "</svg>";
      },
      nota: function (v) {
        var dens = 1000 * Math.pow(0.94, v.t);
        return v.t < 8 ? "Semillero denso: mil plantones compitiendo por la misma luz." :
          v.t < 35 ? "Crecer exige espacio: las copas se sombrean y las débiles mueren — densidad y tamaño quedan atados por la recta −3/2 de Yoda." :
            "Bosque maduro: ~" + nf(dens, 0) + " árboles grandes donde hubo mil plantones. El bosque adulto es el cementerio ordenado de sus plántulas — y sí, el botánico se llamaba Yoda.";
      },
      pie: "Ley del autoaclareo (−3/2): universal de los pinares a las lechugas. Los silvicultores la usan para decidir cuándo entresacar; en tu semillero, o entresacas tú o entresaca la sombra."
    })
  });

})();
