/* ==========================================================================
   Leyes de la Vida — Interactivos VI: ampliación a 200 (eco/tec/psi/soc/ges)
   Autor: Jeshua Romero Guadarrama
   ========================================================================== */

(function () {
  "use strict";

  var U = window.UTILSIM;
  var nf = U.nf, esc = U.esc, graficoLineas = U.graficoLineas, barajar = U.barajar;
  var simCurva = U.simCurva, simAdivina = U.simAdivina, registrar = U.registrar;
  var azar = Math.random;

  /* ======================= ECONOMÍA ======================= */

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="gb-sim">🎲 Simular 30 años de azar</button>' +
        '<button class="boton-sim secundario" id="gb-reset">Reiniciar (200 empresas iguales)</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="gb-lienzo"></div>' +
        '<p class="marcador" id="gb-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">200 empresas idénticas. Cada año, cada una crece o encoge un porcentaje ALEATORIO (sin ventajas sistemáticas). Simula 30 años: el puro azar multiplicativo fabrica gigantes y enanas. La desigualdad extrema no necesita conspiración.</p>';
      var empresas;
      function reiniciar() {
        empresas = [];
        for (var i = 0; i < 200; i++) empresas.push(10);
        pintar("Todas parten con tamaño 10. Nadie tiene ventaja.");
      }
      function pintar(msj) {
        var orden = empresas.slice().sort(function (a, b) { return b - a; });
        var max = orden[0];
        var W = 560, H = 190;
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        var bw = (W - 20) / 200;
        orden.forEach(function (v, i) {
          var h = Math.max(1, (v / max) * (H - 30));
          s += '<rect x="' + (10 + i * bw) + '" y="' + (H - 20 - h) + '" width="' + Math.max(bw - 0.4, 0.6) + '" height="' + h + '" fill="var(--eco)"/>';
        });
        s += '<text x="' + (W / 2) + '" y="' + (H - 4) + '" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">200 empresas ordenadas por tamaño</text></svg>';
        cont.querySelector("#gb-lienzo").innerHTML = s;
        var total = empresas.reduce(function (a, b) { return a + b; }, 0);
        var top10 = orden.slice(0, 20).reduce(function (a, b) { return a + b; }, 0);
        cont.querySelector("#gb-nota").innerHTML = msj || "El 10% mayor concentra el <strong>" + nf((top10 / total) * 100, 0) + "%</strong> del tamaño total — solo con azar proporcional.";
      }
      cont.querySelector("#gb-sim").addEventListener("click", function () {
        for (var a = 0; a < 30; a++) {
          empresas = empresas.map(function (v) { return v * (0.82 + azar() * 0.42); });
        }
        pintar();
      });
      cont.querySelector("#gb-reset").addEventListener("click", reiniciar);
      reiniciar();
    }
    registrar({ id: "sim-gibrat", icono: "🏢", titulo: "Gigantes por sorteo", ley: "gibrat", resumen: "200 empresas idénticas + azar proporcional = desigualdad brutal.", render: render });
  })();

  registrar({
    id: "sim-bennett", icono: "🍚", titulo: "Del arroz al filete", ley: "bennett",
    resumen: "Enriquece un país y mira cambiar su menú, no solo su gasto.",
    render: simCurva({
      controles: [{ id: "ing", etiqueta: "Ingreso per cápita", min: 500, max: 40000, paso: 500, valor: 3000, fmt: function (v) { return nf(v, 0) + " $"; } }],
      grafico: function (v) {
        function fec(x) { return 18 + 57 * Math.exp(-x / 7000); }
        var pts = [];
        for (var x = 500; x <= 40000; x += 500) pts.push({ x: x / 1000, y: fec(x) });
        return {
          series: [{ nombre: "% de calorías de féculas (arroz, maíz, pan)", color: "var(--eco)", puntos: pts }],
          xMax: 40, yMax: 80, xEtiq: "Ingreso per cápita (miles de $)", yEtiq: "% calorías de féculas",
          marcas: [{ x: v.ing / 1000, y: fec(v.ing), texto: nf(fec(v.ing), 0) + "%" }]
        };
      },
      nota: function (v) {
        var f = 18 + 57 * Math.exp(-v.ing / 7000);
        return f > 55 ? "Dieta de subsistencia: el plato es casi todo fécula barata que llena." :
          f > 30 ? "Transición nutricional: entran carne, lácteos y fruta; el arroz cede terreno." :
            "Dieta de país rico: las féculas son guarnición. Con esta curva se anticipa la demanda mundial de carne.";
      },
      pie: "La hermana fina de la ley de Engel: al enriquecerse no solo se gasta menos proporción en comer — cambia QUÉ se come."
    })
  });

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Objetivos de política: <strong id="tb-o">3</strong></label>' +
        '<input type="range" id="tb-ro" min="1" max="4" value="3">' +
        '<label>Instrumentos disponibles: <strong id="tb-i">2</strong></label>' +
        '<input type="range" id="tb-ri" min="1" max="4" value="2">' +
        "</div>" +
        '<div class="lienzo-sim" id="tb-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="tb-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Cada objetivo necesita su propia palanca. Con menos instrumentos que objetivos, alguno queda inevitablemente a la deriva: es la regla de Tinbergen, y el porqué del célebre «trilema» de la política monetaria.</p>';
      var OBJ = ["Inflación baja", "Pleno empleo", "Tipo de cambio fijo", "Déficit contenido"];
      var INS = ["Tipo de interés", "Gasto público", "Impuestos", "Reservas de divisas"];
      var ro = cont.querySelector("#tb-ro"), ri = cont.querySelector("#tb-ri");
      function pintar() {
        var o = +ro.value, i = +ri.value;
        cont.querySelector("#tb-o").textContent = o;
        cont.querySelector("#tb-i").textContent = i;
        var s = '<svg viewBox="0 0 560 ' + (40 + Math.max(o, i) * 46) + '" style="max-width:560px;margin:0 auto">';
        for (var k = 0; k < i; k++) {
          s += '<rect x="20" y="' + (20 + k * 46) + '" width="180" height="34" rx="8" fill="var(--tec)"/><text x="110" y="' + (42 + k * 46) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">' + INS[k] + "</text>";
        }
        for (var j = 0; j < o; j++) {
          var atendido = j < i;
          s += '<rect x="360" y="' + (20 + j * 46) + '" width="180" height="34" rx="8" fill="' + (atendido ? "var(--est)" : "var(--med)") + '"/><text x="450" y="' + (42 + j * 46) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">' + OBJ[j] + (atendido ? "" : " ⚠️") + "</text>";
          if (atendido) s += '<line x1="200" y1="' + (37 + j * 46) + '" x2="360" y2="' + (37 + j * 46) + '" stroke="var(--tinta-tenue)" stroke-width="2"/>';
        }
        s += "</svg>";
        cont.querySelector("#tb-lienzo").innerHTML = s;
        cont.querySelector("#tb-nota").innerHTML = i >= o ?
          "✔ Instrumentos suficientes: cada objetivo tiene su palanca." :
          "🚨 Faltan " + (o - i) + " instrumento(s): " + (o - i) + " objetivo(s) quedan a la deriva. Habrá que renunciar o encontrar palancas nuevas.";
      }
      ro.addEventListener("input", pintar);
      ri.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-tinbergen", icono: "🎛️", titulo: "Una palanca por objetivo", ley: "tinbergen", resumen: "Intenta controlar tres diales con dos palancas.", render: render });
  })();

  registrar({
    id: "sim-marchetti", icono: "🚇", titulo: "La hora de oro del viaje", ley: "marchetti",
    resumen: "Acelera el transporte y mira crecer la ciudad, no el tiempo libre.",
    render: simCurva({
      controles: [{ id: "v", etiqueta: "Velocidad media del transporte", min: 5, max: 120, paso: 5, valor: 30, fmt: function (v) { return v + " km/h"; } }],
      grafico: function (v) {
        var pts = [];
        for (var x = 5; x <= 120; x += 5) pts.push({ x: x, y: x * 0.5 });
        var r = v.v * 0.5;
        var s = '<div style="display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center">';
        var maxR = 60;
        var circulo = '<svg viewBox="0 0 200 200" style="max-width:180px"><circle cx="100" cy="100" r="' + Math.min(92, (r / maxR) * 92) + '" fill="color-mix(in srgb, var(--eco) 25%, transparent)" stroke="var(--eco)" stroke-width="2"/><text x="100" y="105" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)">' + nf(r, 0) + ' km</text><text x="100" y="192" text-anchor="middle" font-size="10" fill="var(--tinta-tenue)">radio de la ciudad</text></svg>';
        s += "<div>" + circulo + "</div><div>" + graficoLineas({
          ancho: 330, alto: 190,
          series: [{ nombre: "Radio urbano alcanzable (30 min)", color: "var(--eco)", puntos: pts }],
          xMax: 120, yMax: 62, xEtiq: "Velocidad (km/h)", yEtiq: "Radio (km)",
          marcas: [{ x: v.v, y: r }]
        }) + "</div></div>";
        return s;
      },
      nota: function (v) {
        return v.v <= 6 ? "A pie: la ciudad clásica de 2-3 km de radio — la Roma antigua, el casco viejo." :
          v.v <= 40 ? "Tranvía y metro: nace la ciudad de barrios. El tiempo de viaje sigue siendo ~1 h/día." :
            "Coche y cercanías: área metropolitana de " + nf(v.v * 0.5, 0) + " km... y la gente sigue viajando una hora diaria. La velocidad no compró tiempo: compró distancia.";
      },
      pie: "Presupuesto de Marchetti: ~1 hora al día viajando, de las aldeas neolíticas a las megaciudades. Toda mejora del transporte se convierte en ciudad, no en tiempo libre."
    })
  });

  /* ======================= TECNOLOGÍA ======================= */

  registrar({
    id: "sim-lehman", icono: "🏚️", titulo: "El software que envejece", ley: "lehman",
    resumen: "Deja vivir un programa años, con o sin limpieza, y mide su deriva.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años en producción", min: 0, max: 20, valor: 8 }],
      selector: { id: "modo", opciones: [["sin", "Sin refactorizar (solo parches)"], ["con", "Con limpieza continua"]] },
      grafico: function (v) {
        function compl(t, modo) { return modo === "sin" ? 10 + Math.pow(t, 1.7) * 2.2 : 10 + t * 3.2; }
        function util(t, modo) { return Math.max(5, 90 - compl(t, modo) * 0.55); }
        var c = [], u = [];
        for (var t = 0; t <= 20; t += 0.5) {
          c.push({ x: t, y: compl(t, v.modo) });
          u.push({ x: t, y: util(t, v.modo) });
        }
        return {
          series: [
            { nombre: "Complejidad acumulada", color: "var(--med)", puntos: c },
            { nombre: "Facilidad de cambiar algo", color: "var(--est)", puntos: u }
          ], xMax: 20, yMax: 210, xEtiq: "Años", yEtiq: "Índice",
          marcas: [{ x: v.t, y: compl(v.t, v.modo) }]
        };
      },
      nota: function (v) {
        return v.modo === "sin" ?
          (v.t < 6 ? "Los parches se acumulan sin dolor... todavía." : v.t < 14 ? "Cada cambio toca código que nadie entiende: la complejidad compone interés." : "🏚️ «No toques eso, que se cae»: el sistema envejeció según Lehman.") :
          "Con refactorización constante, la complejidad crece lineal y el sistema sigue siendo operable a los 20 años. La limpieza no es lujo: es mantenimiento estructural.";
      },
      pie: "Un programa en uso debe cambiar (el mundo lo arrastra), y al cambiar se complica salvo que se trabaje en contra: las dos primeras leyes de Lehman."
    })
  });

  (function () {
    var FUNCIONES = ["ecualizador", "letras de canciones", "modo karaoke", "editor de podcasts", "tienda de sonidos", "red social de playlists", "vídeos musicales", "juegos rítmicos", "monedero digital", "asistente de voz", "noticias musicales", "citas por gustos musicales", "LEER CORREO 📧"];
    function render(cont) {
      var n = 0;
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="zw-mas">➕ El comité aprueba «una funcioncita más»</button>' +
        '<button class="boton-sim secundario" id="zw-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="zw-lienzo"><p style="margin:0"><strong>🎵 Reproductor de música v1.0</strong> — hace UNA cosa y la hace bien.</p></div>' +
        '<p class="marcador" id="zw-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Cada función parece razonable por separado; la suma es una navaja suiza obesa. La ley de Zawinski predice el final del camino: todo programa se expande hasta poder leer correo.</p>';
      function pintar() {
        var lista = FUNCIONES.slice(0, n);
        cont.querySelector("#zw-lienzo").innerHTML =
          '<p style="margin:0 0 8px"><strong>🎵 Reproductor de música v' + (1 + n) + ".0</strong> (" + (1 + n) + " funciones, " + nf(40 + n * 85, 0) + " MB)</p>" +
          (lista.length ? lista.map(function (f) {
            return '<span style="display:inline-block;margin:3px;padding:5px 12px;border-radius:999px;font-size:0.85rem;background:' + (f.indexOf("CORREO") !== -1 ? "var(--med)" : "var(--superficie)") + ';border:1px solid var(--borde);' + (f.indexOf("CORREO") !== -1 ? "color:#fff;font-weight:700" : "") + '">' + f + "</span>";
          }).join("") : "");
        cont.querySelector("#zw-nota").innerHTML =
          n === 0 ? "" :
            n < 6 ? "Cada añadido «tiene sentido»..." :
              n < FUNCIONES.length ? "El reproductor ya pesa " + nf(40 + n * 85, 0) + " MB y tarda en abrir. Sigue aprobando." :
                "📧 <strong>Profecía cumplida:</strong> tu reproductor de música ya lee correo. Zawinski, 1995.";
        cont.querySelector("#zw-mas").disabled = n >= FUNCIONES.length;
      }
      cont.querySelector("#zw-mas").addEventListener("click", function () { n = Math.min(FUNCIONES.length, n + 1); pintar(); });
      cont.querySelector("#zw-reset").addEventListener("click", function () { n = 0; pintar(); });
      pintar();
    }
    registrar({ id: "sim-zawinski", icono: "📧", titulo: "La app que engorda", ley: "zawinski", resumen: "Aprueba «funcioncitas» hasta que el reproductor lea correo.", render: render });
  })();

  (function () {
    var HITOS = [[1995, "adornar botones de páginas web (su único trabajo)"], [2004, "aplicaciones de correo en el navegador (Gmail)"], [2009, "servidores enteros (Node.js)"], [2013, "aplicaciones de escritorio (Electron: Slack, Discord)"], [2015, "aplicaciones móviles (React Native)"], [2017, "Photoshop, AutoCAD y Excel en el navegador"], [2020, "editores de código profesionales (VS Code)"], [2023, "modelos de IA ejecutándose en tu pestaña"], [2026, "los 200 simuladores de esta misma página 😉"]];
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Año: <strong id="at-val">2007</strong></label>' +
        '<input type="range" id="at-rango" min="1995" max="2026" value="2007">' +
        "</div>" +
        '<div class="lienzo-sim" id="at-lienzo"></div>' +
        '<p class="nota-sim">En 1995 JavaScript era un «lenguaje de juguete». Recorre los años: todo lo que PUDO escribirse en JavaScript, ACABÓ escrito en JavaScript. La plataforma ubicua (el navegador) devora a las técnicamente superiores.</p>';
      var rango = cont.querySelector("#at-rango");
      function pintar() {
        var a = +rango.value;
        cont.querySelector("#at-val").textContent = a;
        var pasados = HITOS.filter(function (h) { return h[0] <= a; });
        cont.querySelector("#at-lienzo").innerHTML =
          "<p style='margin:0 0 6px'><strong>JavaScript ya ejecuta:</strong></p>" +
          pasados.map(function (h) {
            return "<p style='margin:3px 0;font-size:0.92rem'>" + h[0] + " — " + h[1] + "</p>";
          }).join("") +
          (pasados.length < HITOS.length ? "<p style='margin:8px 0 0;color:var(--tinta-tenue)'>…sigue avanzando el año.</p>" : "<p style='margin:8px 0 0' class='marcador'>Ley de Atwood: cumplida en su totalidad.</p>");
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-atwood", icono: "🟨", titulo: "El lenguaje que se comió el mundo", ley: "atwood", resumen: "Recorre 30 años de cosas reescritas en JavaScript.", render: render });
  })();

  registrar({
    id: "sim-reed", icono: "👨‍👩‍👧‍👦", titulo: "Parejas contra grupos", ley: "reed",
    resumen: "Compara cómo crece el valor: conexiones n², grupos 2ⁿ.",
    render: simCurva({
      controles: [{ id: "n", etiqueta: "Usuarios de la red", min: 2, max: 30, valor: 10 }],
      grafico: function (v) {
        var lineal = [], metcalfe = [], reed = [];
        for (var n = 2; n <= 30; n++) {
          lineal.push({ x: n, y: Math.log10(n) });
          metcalfe.push({ x: n, y: Math.log10((n * (n - 1)) / 2) });
          reed.push({ x: n, y: Math.log10(Math.pow(2, n) - n - 1) });
        }
        return {
          series: [
            { nombre: "Emisora (n, Sarnoff)", color: "var(--tinta-tenue)", puntos: lineal },
            { nombre: "Parejas (n², Metcalfe)", color: "var(--tec)", puntos: metcalfe },
            { nombre: "Grupos (2ⁿ, Reed)", color: "var(--soc)", puntos: reed }
          ], xMax: 30, yMax: 10, xEtiq: "Usuarios", yEtiq: "Valor (órdenes de magnitud, log₁₀)",
          marcas: [{ x: v.n, y: Math.log10(Math.pow(2, v.n) - v.n - 1) }]
        };
      },
      nota: function (v) {
        var g = Math.pow(2, v.n) - v.n - 1;
        return "Con " + v.n + " usuarios: " + nf((v.n * (v.n - 1)) / 2, 0) + " parejas posibles pero <strong>" + (g > 1e6 ? nf(g / 1e6, 1) + " millones" : nf(g, 0)) + " grupos posibles</strong>. Por eso las plataformas donde nacen comunidades (grupos, servidores, gremios) atrapan más que las de mensajes uno a uno.";
      },
      pie: "Cada subconjunto de usuarios es un club, un mercado o un movimiento en potencia: el valor de formar grupos se duplica con cada persona."
    })
  });

  registrar({
    id: "sim-kranzberg", icono: "⚖️", titulo: "Ni buena, ni mala, ni neutral", ley: "kranzberg",
    resumen: "Cuatro tecnologías sobre la mesa: aplica la primera ley de Kranzberg.",
    render: simAdivina({
      preguntas: [
        {
          texto: "El algoritmo de recomendaciones que decide qué vídeo ves a continuación.", opciones: [
            { t: "⚖️ No es neutral: optimiza lo que le pidieron optimizar, y eso reordena la atención del planeta", ok: true },
            { t: "😇 Es solo una herramienta: depende del usuario" },
            { t: "😈 Es malvado por naturaleza" }
          ], retro: "Ni ángel ni demonio ni «mera herramienta»: sus incentivos de diseño (retención, clics) moldean qué piensa y siente la gente. El juicio recae en el diseño y sus incentivos."
        },
        {
          texto: "El mismo dron: reparte medicinas en zonas aisladas y también vigila poblaciones.", opciones: [
            { t: "⚖️ El sistema (quién, cómo, para qué) decide su efecto: el aparato solo abre posibilidades", ok: true },
            { t: "😇 La tecnología que salva vidas es buena, punto" },
            { t: "🚫 Habría que prohibir los drones" }
          ], retro: "Kranzberg exige mirar el despliegue, no el aparato: mismas hélices, mundos opuestos según el sistema que las gobierna."
        },
        {
          texto: "El automóvil: libertad de movimiento... y ciudades rediseñadas para él, con humo y atascos.", opciones: [
            { t: "⚖️ Reordenó poderes y hábitos: urbanismo, petróleo, suburbios — nada neutral", ok: true },
            { t: "😇 Solo transporta gente: el resto es culpa de los conductores" },
            { t: "😈 Fue un error histórico sin beneficios" }
          ], retro: "El coche no «solo transporta»: rehizo la forma de las ciudades, la geopolítica del petróleo y hasta la cita romántica. Toda tecnología potente reordena el tablero."
        },
        {
          texto: "La imprenta: alfabetizó a Europa... y también industrializó la propaganda y las guerras religiosas.", opciones: [
            { t: "⚖️ Amplificó lo humano en todas direcciones: ni buena ni mala ni neutral", ok: true },
            { t: "😇 Solo trajo Ilustración y ciencia" },
            { t: "😈 Solo trajo panfletos y fanatismo" }
          ], retro: "Quinientos años después, el debate sobre las redes sociales es el mismo debate. Kranzberg da el marco: analiza sistema, incentivos y despliegue — no el cacharro."
        }
      ],
      final: function () { return "«La tecnología no es buena ni mala; y tampoco es neutral»: juzga el sistema que la despliega, no el aparato."; }
    })
  });

  registrar({
    id: "sim-dennard", icono: "🌡️", titulo: "El día que murió el gigahercio", ley: "dennard",
    resumen: "Recorre 30 años de chips y encuentra el muro térmico de 2005.",
    render: simCurva({
      controles: [{ id: "a", etiqueta: "Año", min: 1990, max: 2020, valor: 2000 }],
      grafico: function (v) {
        var frec = [], nucleos = [];
        for (var a = 1990; a <= 2020; a++) {
          var f = a <= 2005 ? 0.03 * Math.pow(2, (a - 1990) / 2.2) : 3.4 + Math.sin((a - 2005)) * 0.25;
          frec.push({ x: a - 1990, y: f });
          nucleos.push({ x: a - 1990, y: a <= 2005 ? 1 : Math.min(16, Math.pow(2, (a - 2005) / 3.2)) });
        }
        return {
          series: [
            { nombre: "Frecuencia (GHz)", color: "var(--fis)", puntos: frec },
            { nombre: "Núcleos por chip", color: "var(--tec)", puntos: nucleos }
          ], xMax: 30, yMax: 17, xEtiq: "Años desde 1990", yEtiq: "GHz / núcleos",
          marcas: [{ x: v.a - 1990, y: v.a <= 2005 ? 0.03 * Math.pow(2, (v.a - 1990) / 2.2) : 3.4, texto: String(v.a) }]
        };
      },
      nota: function (v) {
        return v.a < 2004 ? "Era dorada: encoger transistores daba velocidad gratis y sin calor extra (Dennard vivo). Se prometían 10 GHz «para pronto»." :
          v.a < 2007 ? "💥 ~2005: las corrientes de fuga rompen el escalado — subir más la frecuencia DERRITE el chip." :
            "Plan B: si no podemos ir más rápido, vamos más anchos. Núcleos múltiples para todos... y Amdahl esperando en la puerta.";
      },
      pie: "El socio secreto de Moore murió en 2005: por eso tu portátil tiene 8 núcleos a 3 GHz y no uno a 20 GHz, y por eso programar en paralelo se volvió obligatorio."
    })
  });

  /* ======================= PSICOLOGÍA ======================= */

  (function () {
    var COLORES = [["ROJO", "#dc2626"], ["AZUL", "#2563eb"], ["VERDE", "#059669"], ["AMARILLO", "#ca8a04"]];
    function render(cont) {
      var fase = 0, ronda = 0, t0 = 0, tiempos = [[], []], actual = null;
      cont.innerHTML =
        '<p class="pregunta-quiz" style="text-align:center" id="st2-consigna">Pulsa el botón del COLOR DE LA TINTA (ignora lo que dice la palabra).</p>' +
        '<p style="text-align:center;font-size:3rem;font-weight:800;min-height:70px;margin:8px 0" id="st2-palabra"></p>' +
        '<div class="zona-objetivos" id="st2-zona" style="min-height:80px"></div>' +
        '<div class="fila-controles" style="justify-content:center"><button class="boton-sim" id="st2-inicio">Empezar la prueba (16 palabras)</button></div>' +
        '<div class="lienzo-sim"><table class="tabla-sim"><thead><tr><th>Condición</th><th>Tiempo medio</th></tr></thead><tbody id="st2-tabla"></tbody></table></div>' +
        '<p class="nota-sim">Primera mitad: palabra y tinta coinciden (fácil). Segunda mitad: la palabra dice OTRO color y tu lectura automática sabotea la tarea. La diferencia de milisegundos es el efecto Stroop: no puedes apagar la lectura ni queriendo.</p>';
      var palabra = cont.querySelector("#st2-palabra"), zona = cont.querySelector("#st2-zona");
      function botones() {
        zona.innerHTML = "";
        COLORES.forEach(function (c) {
          var b = document.createElement("button");
          b.className = "boton-sim secundario";
          b.textContent = c[0].toLowerCase();
          b.style.borderColor = c[1];
          b.addEventListener("click", function () {
            if (!actual) return;
            if (c[1] === actual.tinta) {
              tiempos[fase].push(performance.now() - t0);
              siguiente();
            }
          });
          zona.appendChild(b);
        });
      }
      function siguiente() {
        ronda++;
        if (ronda > 8 && fase === 0) { fase = 1; }
        if (ronda > 16) { fin(); return; }
        var congruente = fase === 0;
        var w = COLORES[Math.floor(azar() * 4)];
        var tinta = congruente ? w : COLORES.filter(function (c) { return c !== w; })[Math.floor(azar() * 3)];
        actual = { tinta: tinta[1] };
        palabra.textContent = w[0];
        palabra.style.color = tinta[1];
        t0 = performance.now();
        tabla();
      }
      function media(arr) { return arr.length ? arr.reduce(function (a, b) { return a + b; }, 0) / arr.length : 0; }
      function tabla() {
        cont.querySelector("#st2-tabla").innerHTML =
          "<tr><td>Congruente (ROJO en rojo)</td><td><strong>" + (tiempos[0].length ? nf(media(tiempos[0]), 0) + " ms" : "—") + "</strong></td></tr>" +
          "<tr><td>Incongruente (ROJO en azul)</td><td><strong>" + (tiempos[1].length ? nf(media(tiempos[1]), 0) + " ms" : "—") + "</strong></td></tr>";
      }
      function fin() {
        actual = null;
        palabra.textContent = "";
        var dif = media(tiempos[1]) - media(tiempos[0]);
        zona.innerHTML = '<p class="marcador">Tu interferencia Stroop: <strong>' + (dif > 0 ? "+" : "") + nf(dif, 0) + " ms</strong> por palabra" + (dif > 60 ? " — la lectura automática te saboteó, como a todo el mundo." : ".") + "</p>";
        tabla();
      }
      cont.querySelector("#st2-inicio").addEventListener("click", function () {
        fase = 0; ronda = 0; tiempos = [[], []];
        botones();
        siguiente();
      });
      tabla();
    }
    registrar({ id: "sim-stroop", icono: "🌈", titulo: "La palabra saboteadora", ley: "stroop", resumen: "Di el color de la tinta mientras la palabra grita otro: cronometrado.", render: render });
  })();

  registrar({
    id: "sim-pigmalion", icono: "🌱", titulo: "La profecía del profesor", ley: "pigmalion",
    resumen: "Dos alumnos idénticos, distinta expectativa: sigue sus notas un curso.",
    render: simCurva({
      controles: [{ id: "e", etiqueta: "Expectativa del profesor sobre el alumno B", min: 0, max: 100, valor: 20, fmt: function (v) { return v < 33 ? "baja" : v < 66 ? "media" : "alta"; } }],
      grafico: function (v) {
        var a = [], b = [];
        var na = 50, nb = 50;
        for (var m = 0; m <= 9; m++) {
          a.push({ x: m, y: na });
          b.push({ x: m, y: nb });
          na += 1.6 + 0.9;
          nb += 1.6 + (v.e / 100 - 0.5) * 2.4 + 0.9 * (v.e / 100) * 1.4;
        }
        return {
          series: [
            { nombre: "Alumno A (expectativa alta, fija)", color: "var(--est)", puntos: a },
            { nombre: "Alumno B (misma capacidad)", color: "var(--psi)", puntos: b }
          ], xMax: 9, yMax: 100, xEtiq: "Meses del curso", yEtiq: "Rendimiento",
          marcas: []
        };
      },
      nota: function (v) {
        return v.e < 33 ? "Efecto Golem: menos preguntas, menos paciencia, errores menos perdonados... y B, con la MISMA capacidad, se descuelga." :
          v.e < 66 ? "Expectativa tibia: B recibe un trato estándar y rinde estándar." :
            "Efecto Pigmalión: atención extra, retos mayores y confianza fabrican, mes a mes, el talento que se esperaba encontrar.";
      },
      pie: "En el experimento de Rosenthal, los alumnos que «florecerían» se eligieron AL AZAR... y florecieron. Las expectativas se filtran en microconductas que fabrican el resultado."
    })
  });

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="chip activo" data-orden="mal">📺 Primero videojuegos, «luego» deberes</button>' +
        '<button class="chip" data-orden="bien">📚 Primero deberes, luego videojuegos</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="pk2-lienzo"></div>' +
        '<p class="marcador" id="pk2-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">La misma semana, el mismo niño, las mismas dos actividades: solo cambia el ORDEN. Con la actividad apetecible al final (como premio), la costosa se hace; al revés, «luego» no llega nunca. La regla de la abuela, verificada por Premack.</p>';
      function pintar(orden) {
        var dias = ["L", "M", "X", "J", "V"];
        var s = '<svg viewBox="0 0 560 150" style="width:100%;max-width:560px;margin:0 auto">';
        var hechos = 0;
        dias.forEach(function (d, i) {
          var hecho = orden === "bien" ? true : azar() < 0.25;
          if (hecho) hechos++;
          var x = 40 + i * 105;
          s += '<text x="' + (x + 35) + '" y="20" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)">' + d + "</text>";
          s += '<rect x="' + x + '" y="30" width="70" height="40" rx="8" fill="' + (hecho ? "var(--est)" : "var(--med)") + '"/><text x="' + (x + 35) + '" y="55" text-anchor="middle" font-size="11" fill="#fff">' + (hecho ? "deberes ✔" : "deberes ✘") + "</text>";
          s += '<rect x="' + x + '" y="80" width="70" height="40" rx="8" fill="var(--tec)"/><text x="' + (x + 35) + '" y="105" text-anchor="middle" font-size="11" fill="#fff">juegos 🎮</text>';
        });
        s += "</svg>";
        cont.querySelector("#pk2-lienzo").innerHTML = s;
        cont.querySelector("#pk2-nota").innerHTML = orden === "bien" ?
          "Deberes hechos <strong>5 de 5</strong> días: la actividad probable (jugar) reforzó a la improbable (estudiar)." :
          "Deberes hechos <strong>" + hechos + " de 5</strong> días: con el premio cobrado por adelantado, la tarea perdió su motor.";
      }
      cont.querySelectorAll(".chip[data-orden]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          cont.querySelectorAll(".chip[data-orden]").forEach(function (o) { o.classList.remove("activo"); });
          ch.classList.add("activo");
          pintar(ch.getAttribute("data-orden"));
        });
      });
      pintar("mal");
    }
    registrar({ id: "sim-premack", icono: "🍬", titulo: "La regla de la abuela", ley: "premack", resumen: "Cambia el orden de deberes y videojuegos y compara la semana.", render: render });
  })();

  registrar({
    id: "sim-vonrestorff", icono: "🐉", titulo: "El dragón entre los muebles", ley: "von-restorff",
    resumen: "Coloca un elemento que rompa la lista y mide qué se recuerda.",
    render: simCurva({
      controles: [{ id: "p", etiqueta: "Posición del elemento destacado", min: 1, max: 9, valor: 5 }],
      grafico: function (v) {
        var LISTA = ["mesa", "silla", "armario", "estante", "banco", "cómoda", "taburete", "perchero", "vitrina"];
        var s = '<div style="text-align:center;margin-bottom:10px">' + LISTA.map(function (w, i) {
          var destacado = i + 1 === v.p;
          return '<span style="display:inline-block;margin:3px;padding:6px 14px;border-radius:8px;font-weight:' + (destacado ? "800" : "500") + ';background:' + (destacado ? "var(--psi)" : "var(--superficie)") + ';color:' + (destacado ? "#fff" : "var(--tinta)") + ';border:1px solid var(--borde)">' + (destacado ? "🐉 DRAGÓN" : w) + "</span>";
        }).join("") + "</div>";
        var pts = [];
        for (var i = 1; i <= 9; i++) {
          var base = 30 + 35 * Math.exp(-(i - 1) / 2.5) + 30 * Math.exp(-(9 - i) / 1.8);
          pts.push({ x: i, y: i === v.p ? 92 : Math.min(80, base) });
        }
        return s + graficoLineas({
          series: [{ nombre: "% de recuerdo por posición", color: "var(--psi)", puntos: pts }],
          xMax: 9, yMax: 100, xEtiq: "Posición en la lista", yEtiq: "% recordado",
          marcas: [{ x: v.p, y: 92, texto: "🐉" }]
        });
      },
      nota: function (v) {
        return "El dragón se recuerda ~92% esté donde esté: lo distinto rompe el patrón y la memoria lo prioriza. Muévelo al centro (posición 5) y verás que hasta ahí, el pantano de la curva serial, lo salva su rareza.";
      },
      pie: "Von Restorff, 1933: en una lista homogénea, el elemento aislado destaca en el recuerdo. Es el fundamento del subrayado... y su trampa: si destacas todo, nada destaca."
    })
  });

  registrar({
    id: "sim-picofinal", icono: "🎢", titulo: "Diseña un recuerdo", ley: "pico-final",
    resumen: "Ajusta pico, final y duración de una experiencia: dos importan, una no.",
    render: simCurva({
      controles: [
        { id: "pico", etiqueta: "Mejor momento (pico)", min: 1, max: 10, valor: 7 },
        { id: "fin", etiqueta: "Calidad del final", min: 1, max: 10, valor: 4 },
        { id: "dur", etiqueta: "Duración (días)", min: 2, max: 21, valor: 7 }
      ],
      grafico: function (v) {
        var pts = [];
        var n = v.dur;
        for (var d = 0; d <= n; d++) {
          var base = 5 + Math.sin(d * 1.3) * 1.2;
          if (d === Math.floor(n * 0.4)) base = v.pico;
          if (d === n) base = v.fin;
          pts.push({ x: d, y: base });
        }
        return {
          series: [{ nombre: "Disfrute día a día de las vacaciones", color: "var(--psi)", puntos: pts }],
          xMax: 21, yMax: 11, xEtiq: "Día", yEtiq: "Disfrute (1-10)",
          marcas: [
            { x: Math.floor(v.dur * 0.4), y: v.pico, texto: "pico" },
            { x: v.dur, y: v.fin, texto: "final" }
          ]
        };
      },
      nota: function (v) {
        var recuerdo = (v.pico + v.fin) / 2;
        return "Recuerdo que quedará: <strong>" + nf(recuerdo, 1) + "/10</strong> = (pico " + v.pico + " + final " + v.fin + ") ÷ 2. Ahora mueve la DURACIÓN: el recuerdo ni se inmuta — el «yo que recuerda» no suma días, guarda dos fotogramas.";
      },
      pie: "Regla del pico y el final (Kahneman): se recuerda el momento más intenso y el cierre. Un gran final redime unas vacaciones mediocres; un mal final arruina unas buenas."
    })
  });

  registrar({
    id: "sim-exposicion", icono: "🎵", titulo: "La canción que odiabas", ley: "mera-exposicion",
    resumen: "Expón a alguien a la misma canción una y otra vez y mide su agrado.",
    render: simCurva({
      controles: [{ id: "n", etiqueta: "Veces escuchada", min: 0, max: 60, valor: 5 }],
      grafico: function (v) {
        function agrado(n) { return 25 + 55 * (1 - Math.exp(-n / 9)) - Math.max(0, n - 32) * 1.8; }
        var pts = [];
        for (var n = 0; n <= 60; n++) pts.push({ x: n, y: Math.max(5, agrado(n)) });
        return {
          series: [{ nombre: "Agrado por la canción", color: "var(--psi)", puntos: pts }],
          xMax: 60, yMax: 90, xEtiq: "Exposiciones", yEtiq: "Agrado",
          marcas: [{ x: v.n, y: Math.max(5, agrado(v.n)), texto: nf(Math.max(5, agrado(v.n)), 0) }]
        };
      },
      nota: function (v) {
        return v.n < 4 ? "«Bah, otra canción del montón»: lo nuevo se procesa con esfuerzo y desconfianza." :
          v.n < 25 ? "La familiaridad se siente bien: sin un solo argumento nuevo, la canción «mejora» sola. Puro Zajonc." :
            v.n < 40 ? "Cerca del pico: la tarareas sin querer. La publicidad de marca vive exactamente aquí." :
              "📉 Sobreexposición: la canción quemada de la radio. Hasta la familiaridad tiene dosis tóxica.";
      },
      pie: "Efecto de mera exposición: ver algo repetidamente basta para que guste más — caras, logotipos, canciones y hasta sílabas sin sentido. Con tope: el hastío existe."
    })
  });

  registrar({
    id: "sim-flynn", icono: "📈", titulo: "Los abuelos y el test", ley: "flynn",
    resumen: "Viaja por el siglo XX midiendo a cada generación con el mismo test.",
    render: simCurva({
      controles: [{ id: "a", etiqueta: "Año de la generación evaluada", min: 1930, max: 2020, valor: 1970 }],
      grafico: function (v) {
        var pts = [];
        for (var a = 1930; a <= 2020; a += 2) {
          var ci = 100 + (a - 1930) * 0.3 - Math.max(0, a - 2000) * 0.12;
          pts.push({ x: a - 1930, y: ci });
        }
        function f(a) { return 100 + (a - 1930) * 0.3 - Math.max(0, a - 2000) * 0.12; }
        return {
          series: [{ nombre: "CI medio con el baremo de 1930", color: "var(--psi)", puntos: pts }],
          xMax: 90, yMax: 135, yMin: 90, xEtiq: "Años desde 1930", yEtiq: "CI (baremo 1930)",
          marcas: [{ x: v.a - 1930, y: f(v.a), texto: nf(f(v.a), 0) }]
        };
      },
      nota: function (v) {
        return v.a < 1960 ? "Mejor nutrición y escuela para todos: los test empiezan a subir ~3 puntos por década." :
          v.a < 2000 ? "Un mundo cada vez más abstracto (símbolos, clasificaciones, pantallas) entrena justo lo que los test miden. Con este baremo antiguo, esta generación puntúa «superdotada»." :
            "En varios países ricos la subida se frena o revierte desde los 90: el debate sobre el porqué (pantallas, educación, techo alcanzado) sigue abierto.";
      },
      pie: "Efecto Flynn: los test de CI deben recalibrarse cada pocos años porque cada generación puntúa mejor que la anterior con el mismo examen. Nadie «era tonto»: el mundo mental cambió."
    })
  });

  /* ======================= SOCIOLOGÍA ======================= */

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Cambio en ti (dejas de fumar, sonríes más...): <strong id="tg-val">100</strong>%</label>' +
        '<input type="range" id="tg-rango" min="20" max="100" value="100">' +
        "</div>" +
        '<div class="lienzo-sim" id="tg-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="tg-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Tu cambio genera ondas: alcanza a tus amigos (1er grado), a los suyos (2º) y a los de estos (3º), debilitándose en cada salto hasta morir en el cuarto. Christakis y Fowler lo midieron con obesidad, tabaco y felicidad en 30 años de datos.</p>';
      var rango = cont.querySelector("#tg-rango");
      function pintar() {
        var base = +rango.value;
        cont.querySelector("#tg-val").textContent = base;
        var GRADOS = [
          [1, base, 0],
          [6, base * 0.33, 52],
          [12, base * 0.11, 96],
          [18, base * 0.04, 140],
          [24, 0, 180]
        ];
        var s = '<svg viewBox="0 0 460 400" style="max-width:430px;margin:0 auto">';
        GRADOS.slice().reverse().forEach(function (g) {
          if (g[2] === 0) return;
          s += '<circle cx="230" cy="200" r="' + g[2] + '" fill="color-mix(in srgb, var(--soc) ' + nf(Math.max(3, g[1] * 0.5), 0) + '%, transparent)" stroke="var(--borde)"/>';
        });
        var ETIQ = ["tú", "amigos", "amigos de amigos", "3er grado", "4º: nada"];
        GRADOS.forEach(function (g, i) {
          var y = 200 - g[2];
          s += '<text x="230" y="' + (y - 6 + (i === 0 ? 10 : 0)) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--tinta)">' + ETIQ[i] + ": " + nf(g[1], 0) + "%</text>";
        });
        s += "</svg>";
        cont.querySelector("#tg-lienzo").innerHTML = s;
        cont.querySelector("#tg-nota").innerHTML = "Tu conducta llega, atenuada, a personas que <strong>jamás te han visto</strong> — y se apaga en el cuarto salto. Cuidar tus hábitos es salud pública en miniatura.";
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-tresgrados", icono: "🌊", titulo: "Las ondas del estanque social", ley: "tres-grados", resumen: "Cambia un hábito y mira hasta dónde llega la onda (spoiler: 3 saltos).", render: render });
  })();

  registrar({
    id: "sim-tocqueville", icono: "🔥", titulo: "La brecha que enciende", ley: "tocqueville",
    resumen: "Mejora un país y mira crecer más rápido sus expectativas.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años de mejora sostenida", min: 0, max: 30, valor: 12 }],
      grafico: function (v) {
        var cond = [], exp = [];
        for (var t = 0; t <= 30; t++) {
          cond.push({ x: t, y: 20 + t * 1.6 });
          exp.push({ x: t, y: 20 + t * 2.6 });
        }
        return {
          series: [
            { nombre: "Condiciones reales", color: "var(--est)", puntos: cond },
            { nombre: "Expectativas", color: "var(--soc)", puntos: exp }
          ], xMax: 30, yMax: 105, xEtiq: "Años", yEtiq: "Nivel",
          marcas: [{ x: v.t, y: 20 + v.t * 2.6 }]
        };
      },
      nota: function (v) {
        var brecha = v.t * 1.0;
        return v.t < 5 ? "Miseria estable: paradójicamente, calma — sin expectativas no hay brecha." :
          brecha < 18 ? "La mejora despierta el apetito: las expectativas ya corren por delante (brecha: " + nf(brecha, 0) + ")." :
            "🔥 Brecha de " + nf(brecha, 0) + " puntos entre lo esperado y lo real: el combustible clásico de la revuelta. Tocqueville lo vio en la Francia PRÓSPERA de 1789.";
      },
      pie: "El descontento no nace de la miseria absoluta sino de la distancia entre lo que hay y lo que ya se cree merecer: las revueltas siguen a los auges truncados."
    })
  });

  /* ======================= GESTIÓN ======================= */

  registrar({
    id: "sim-lindy", icono: "📜", titulo: "Lo viejo entierra a lo nuevo", ley: "lindy",
    resumen: "Compara la esperanza de vida de un libro con la de un humano.",
    render: simCurva({
      controles: [{ id: "edad", etiqueta: "Edad actual", min: 1, max: 100, valor: 30, fmt: function (v) { return v + " años"; } }],
      grafico: function (v) {
        var libro = [], humano = [];
        for (var e = 1; e <= 100; e++) {
          libro.push({ x: e, y: e });
          humano.push({ x: e, y: Math.max(2, 82 - e) });
        }
        return {
          series: [
            { nombre: "Un libro / idea / tecnología (Lindy)", color: "var(--ges)", puntos: libro },
            { nombre: "Un ser humano (perecedero)", color: "var(--tinta-tenue)", puntos: humano }
          ], xMax: 100, yMax: 105, xEtiq: "Edad actual (años)", yEtiq: "Esperanza de vida restante",
          marcas: [{ x: v.edad, y: v.edad, texto: "+" + v.edad + " años" }]
        };
      },
      nota: function (v) {
        return "Un libro con " + v.edad + " años en imprenta puede esperar <strong>otros ~" + v.edad + "</strong>: cada año sobrevivido es evidencia de robustez. Para lo perecedero es al revés: el tiempo resta. Por eso el ajedrez enterrará a la aplicación de moda.";
      },
      pie: "Efecto Lindy: para lo no perecedero, la edad ES el pronóstico. ¿Quieres saber qué herramienta seguirá viva en 20 años? Mira cuál lleva 40."
    })
  });

  (function () {
    function render(cont) {
      var estado = { anio: 0, problema: 100, org: 10, redefinido: false };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="sh-anio">📅 Avanzar 2 años</button>' +
        '<button class="boton-sim secundario" id="sh-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="sh-lienzo"></div>' +
        '<p class="marcador" id="sh-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Una organización nace para resolver un problema. Avanza el tiempo: cuanto más se acerca al éxito, más peligra su presupuesto... y sin mala fe, el problema se «redefine» para seguir existiendo. Principio de Shirky en cámara lenta.</p>';
      function pintar(msj) {
        var filas = [
          ["🔥 Problema original", estado.problema, "var(--med)"],
          ["🏢 Tamaño de la organización", estado.org, "var(--tec)"]
        ];
        if (estado.redefinido) filas.push(["🌀 Problema «redefinido»", 60 + estado.anio, "var(--ges)"]);
        var s = '<svg viewBox="0 0 560 ' + (30 + filas.length * 44) + '" style="width:100%;max-width:560px;margin:0 auto">';
        filas.forEach(function (f, i) {
          var y = 10 + i * 44;
          s += '<text x="10" y="' + (y + 15) + '" font-size="12" fill="var(--tinta)">' + f[0] + "</text>";
          s += '<rect x="230" y="' + y + '" width="' + Math.max(3, Math.min(100, f[1]) * 3) + '" height="22" rx="6" fill="' + f[2] + '"/>';
          s += '<text x="' + (238 + Math.max(3, Math.min(100, f[1]) * 3)) + '" y="' + (y + 16) + '" font-size="12" font-weight="700" fill="var(--tinta)">' + nf(f[1], 0) + "</text>";
        });
        s += "</svg>";
        cont.querySelector("#sh-lienzo").innerHTML = s;
        cont.querySelector("#sh-nota").innerHTML = msj || "";
      }
      cont.querySelector("#sh-anio").addEventListener("click", function () {
        estado.anio += 2;
        estado.problema = Math.max(4, estado.problema - 22);
        estado.org = Math.min(100, estado.org + 16);
        var msj = "La organización crece mientras el problema mengua. Todo va bien... ¿no?";
        if (estado.problema <= 20 && !estado.redefinido) {
          estado.redefinido = true;
          msj = "🌀 <strong>Momento Shirky:</strong> con el problema casi resuelto (¡y el presupuesto en peligro!), la misión se «amplía»: nuevo problema, misma organización, más plantilla.";
        } else if (estado.redefinido) {
          msj = "La organización ya no persigue resolver: persigue perdurar. Nadie fue malvado; los incentivos hicieron el resto.";
        }
        pintar(msj);
      });
      cont.querySelector("#sh-reset").addEventListener("click", function () {
        estado = { anio: 0, problema: 100, org: 10, redefinido: false };
        pintar("");
      });
      pintar("");
    }
    registrar({ id: "sim-shirky", icono: "🌀", titulo: "La misión que no muere", ley: "shirky", resumen: "Resuelve el problema de una organización... si ella te deja.", render: render });
  })();

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles"><button class="boton-sim" id="pt-sim">🎲 Simular 10 carreras profesionales</button></div>' +
        '<div class="lienzo-sim"><table class="tabla-sim"><thead><tr><th>Perfil</th><th>Entiende la tecnología</th><th>Destino a los 15 años</th></tr></thead><tbody id="pt-tabla"><tr><td colspan="3" style="color:var(--tinta-tenue)">Pulsa simular.</td></tr></tbody></table></div>' +
        '<p class="marcador" id="pt-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Diez profesionales entran en una empresa tecnológica. Los que entienden la materia son «demasiado valiosos» donde están; los que dominan la política ascienden. Cuenta quién acaba dirigiendo: la ley de Putt rara vez falla.</p>';
      cont.querySelector("#pt-sim").addEventListener("click", function () {
        var filas = [], jefesSinSaber = 0, tecnicosDirigiendo = 0;
        for (var i = 0; i < 10; i++) {
          var entiende = azar() < 0.5;
          var dirige = entiende ? azar() < 0.2 : azar() < 0.7;
          if (dirige && !entiende) jefesSinSaber++;
          if (dirige && entiende) tecnicosDirigiendo++;
          filas.push("<tr><td>Persona " + (i + 1) + "</td><td>" + (entiende ? "🔧 Sí" : "🗣️ No (pero negocia bien)") + "</td><td><strong>" + (dirige ? "🪑 Dirección" : "⌨️ Sigue resolviendo problemas") + "</strong></td></tr>");
        }
        cont.querySelector("#pt-tabla").innerHTML = filas.join("");
        cont.querySelector("#pt-nota").innerHTML = "Dirigen sin entender: <strong>" + jefesSinSaber + "</strong> · Dirigen entendiendo: <strong>" + tecnicosDirigiendo + "</strong> — «unos entienden lo que no dirigen; otros dirigen lo que no entienden».";
      });
    }
    registrar({ id: "sim-putt", icono: "🪑", titulo: "El ascensor de Putt", ley: "putt", resumen: "Simula carreras: ¿quién acaba dirigiendo la tecnología?", render: render });
  })();

  (function () {
    var CASOS = [["Ópera de Sídney", 14.6], ["Canal de Panamá", 2.0], ["Aeropuerto de Berlín", 3.4], ["Presa de las Tres Gargantas", 1.6], ["Juegos Olímpicos (media)", 2.8], ["Tu reforma de la cocina", 1.9]];
    function render(cont) {
      var historia = [];
      cont.innerHTML =
        '<div class="fila-controles"><button class="boton-sim" id="ch-lanzar">🏗️ Lanzar un megaproyecto (presupuesto: 100 M€)</button></div>' +
        '<div class="lienzo-sim"><table class="tabla-sim"><thead><tr><th>#</th><th>Coste final</th><th>Desvío</th><th>Compañía ilustre</th></tr></thead><tbody id="ch-tabla"></tbody></table></div>' +
        '<p class="marcador" id="ch-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Cada proyecto sale con un sobrecoste muestreado de la distribución real de los megaproyectos (cola larga y pesada). Lanza varios: dentro de presupuesto quedará una minoría heroica. Nada se construye en plazo ni en presupuesto.</p>';
      cont.querySelector("#ch-lanzar").addEventListener("click", function () {
        var factor = Math.exp(0.28 + (azar() + azar() + azar() - 1.5) * 0.75);
        factor = Math.max(0.85, factor);
        var caso = CASOS[Math.floor(azar() * CASOS.length)];
        historia.push({ f: factor, caso: caso });
        cont.querySelector("#ch-tabla").innerHTML = historia.map(function (h, i) {
          var d = (h.f - 1) * 100;
          return "<tr><td>" + (i + 1) + "</td><td>" + nf(h.f * 100, 0) + " M€</td><td style='font-weight:700;color:" + (d > 5 ? "var(--error)" : "var(--ok)") + "'>" + (d > 0 ? "+" : "") + nf(d, 0) + "%</td><td style='color:var(--tinta-tenue)'>" + h.caso[0] + " (real: ×" + nf(h.caso[1], 1) + ")</td></tr>";
        }).join("");
        var enPresupuesto = historia.filter(function (h) { return h.f <= 1.05; }).length;
        cont.querySelector("#ch-nota").innerHTML = "Dentro de presupuesto: <strong>" + enPresupuesto + " de " + historia.length + "</strong>.";
      });
    }
    registrar({ id: "sim-cheops", icono: "🏗️", titulo: "El presupuesto de la pirámide", ley: "cheops", resumen: "Lanza megaproyectos y colecciona sobrecostes históricos.", render: render });
  })();

  registrar({
    id: "sim-hutber", icono: "📉", titulo: "Traductor de «mejoras»", ley: "hutber",
    resumen: "Cuatro comunicados corporativos: traduce qué van a quitarte.",
    render: simAdivina({
      preguntas: [
        { texto: "«Hemos MEJORADO nuestra estructura de tarifas para adaptarla a sus necesidades.»", opciones: [{ t: "📉 Va a pagar más por lo mismo", ok: true }, { t: "🎁 Van a cobrarle menos" }], retro: "Cuando bajan precios lo dicen con números gigantes. La «estructura mejorada» es el envoltorio del aumento." },
        { texto: "«Hemos MEJORADO la receta de su galleta favorita.»", opciones: [{ t: "📉 Menos galleta, mismo precio (reduflación) o ingredientes más baratos", ok: true }, { t: "🎁 Más chocolate por el mismo precio" }], retro: "El paquete pesa 15 g menos y la manteca ahora es aceite refinado: Hutber en el supermercado." },
        { texto: "«Para SERVIRLE MEJOR, su oficina bancaria pasa a atención exclusivamente digital.»", opciones: [{ t: "📉 Cerraron su sucursal y despidieron al personal", ok: true }, { t: "🎁 Le pusieron un gestor personal" }], retro: "«Para servirle mejor» es el preámbulo universal del recorte de servicio. Betteridge tiene un primo corporativo." },
        { texto: "«MEJORAMOS su experiencia de visionado con una oferta más seleccionada.»", opciones: [{ t: "📉 Quitaron la mitad del catálogo (y quizá suben la cuota)", ok: true }, { t: "🎁 Añadieron el doble de películas" }], retro: "«Más seleccionada» = más pequeña. Cuando añaden contenido, te enseñan la lista; cuando lo quitan, te hablan de tu «experiencia»." }
      ],
      final: function () { return "Ley de Hutber: «mejora» significa deterioro. Cuando una organización anuncie mejoras, busca inmediatamente qué ha desaparecido."; }
    })
  });

  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="chip activo" data-est="facil">🍰 Empezar por lo fácil</button>' +
        '<button class="chip" data-est="sapo">🐸 Tragarse el sapo primero</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="lb2-lienzo"></div>' +
        '<p class="marcador" id="lb2-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Cinco tareas, energía que se agota. Empezando por lo fácil, las recompensas rápidas devoran la energía y el informe decisivo muere a las 6 de la tarde. Sapo primero: lo importante se hace con la energía fresca. Laborit descrito, Laborit vencido.</p>';
      var TAREAS = [
        { n: "📊 Informe decisivo", coste: 45, valor: 100 },
        { n: "📧 Correos triviales", coste: 12, valor: 8 },
        { n: "🗂️ Ordenar carpetas", coste: 10, valor: 4 },
        { n: "💬 Charla de pasillo", coste: 8, valor: 3 },
        { n: "📋 Papeleo simple", coste: 15, valor: 10 }
      ];
      function pintar(estrategia) {
        var orden = estrategia === "sapo" ?
          TAREAS.slice().sort(function (a, b) { return b.coste - a.coste; }) :
          TAREAS.slice().sort(function (a, b) { return a.coste - b.coste; });
        var energia = 70, hechas = [], valor = 0;
        orden.forEach(function (t) {
          if (energia >= t.coste) { energia -= t.coste; hechas.push(t); valor += t.valor; }
        });
        cont.querySelector("#lb2-lienzo").innerHTML =
          "<p style='margin:0 0 6px'><strong>Jornada (70 puntos de energía):</strong></p>" +
          orden.map(function (t) {
            var hecha = hechas.indexOf(t) !== -1;
            return "<p style='margin:3px 0;font-size:0.92rem;" + (hecha ? "" : "opacity:0.45;text-decoration:line-through") + "'>" + t.n + " — coste " + t.coste + ", valor " + t.valor + (hecha ? " ✔" : " ✘ (sin energía)") + "</p>";
          }).join("");
        cont.querySelector("#lb2-nota").innerHTML = "Valor producido: <strong>" + valor + " / 125</strong>" +
          (estrategia === "sapo" ? " — lo importante cayó primero, con la mente fresca." : " — cobraste muchas recompensas pequeñas y esquivaste la grande: Laborit al mando.");
      }
      cont.querySelectorAll(".chip[data-est]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          cont.querySelectorAll(".chip[data-est]").forEach(function (o) { o.classList.remove("activo"); });
          ch.classList.add("activo");
          pintar(ch.getAttribute("data-est"));
        });
      });
      pintar("facil");
    }
    registrar({ id: "sim-laborit", icono: "🐸", titulo: "El sapo de la mañana", ley: "laborit", resumen: "Ordena la jornada de dos maneras y compara qué sobrevive.", render: render });
  })();

  registrar({
    id: "sim-carlson", icono: "🔕", titulo: "El precio del «¿tienes un minuto?»", ley: "carlson",
    resumen: "Interrumpe una tarea de una hora y mira crecer la factura.",
    render: simCurva({
      controles: [{ id: "n", etiqueta: "Interrupciones durante la tarea", min: 0, max: 12, valor: 4 }],
      grafico: function (v) {
        function total(n) { return 60 + n * (2 + 6); }
        var pts = [];
        for (var n = 0; n <= 12; n++) pts.push({ x: n, y: total(n) });
        return {
          series: [
            { nombre: "Duración real de la «tarea de 1 hora»", color: "var(--ges)", puntos: pts },
            { nombre: "La hora prometida", color: "var(--tinta-tenue)", puntos: [{ x: 0, y: 60 }, { x: 12, y: 60 }] }
          ], xMax: 12, yMax: 165, xEtiq: "Interrupciones", yEtiq: "Minutos",
          marcas: [{ x: v.n, y: total(v.n), texto: nf(total(v.n), 0) + " min" }]
        };
      },
      nota: function (v) {
        var extra = v.n * 8;
        return v.n === 0 ? "Una hora limpia: la tarea dura una hora. Ciencia ficción de oficina." :
          "Cada corte cuesta ~2 min de atención + ~6 min de recarga mental: tus " + v.n + " interrupciones añadieron <strong>" + extra + " minutos</strong>. Una hora fragmentada rinde la mitad que una limpia.";
      },
      pie: "Carlson midió que los directivos rara vez tienen 20 minutos seguidos. El trabajo profundo no se encuentra: se blinda."
    })
  });

  (function () {
    function render(cont) {
      var totalRapido = 0, totalBien = 0, n = 0;
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="mk-sim">⚙️ Ejecutar 10 proyectos con cada método</button>' +
        '<button class="boton-sim secundario" id="mk-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim"><table class="tabla-sim"><thead><tr><th>Método</th><th>Horas por proyecto</th><th>% con retrabajo</th><th>Horas totales</th></tr></thead><tbody id="mk-tabla"><tr><td colspan="4" style="color:var(--tinta-tenue)">Pulsa ejecutar.</td></tr></tbody></table></div>' +
        '<p class="marcador" id="mk-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">«Rápido»: 2 h, pero falla el 70% y cada fallo cuesta 6 h de repetición. «Bien»: 4 h, falla el 5%. Ejecuta tandas y compara las horas totales: nunca hay tiempo para hacerlo bien, siempre lo hay para hacerlo dos veces.</p>';
      cont.querySelector("#mk-sim").addEventListener("click", function () {
        var fallosR = 0, fallosB = 0, hR = 0, hB = 0;
        for (var i = 0; i < 10; i++) {
          hR += 2; if (azar() < 0.7) { hR += 6; fallosR++; }
          hB += 4; if (azar() < 0.05) { hB += 6; fallosB++; }
        }
        totalRapido += hR; totalBien += hB; n += 10;
        cont.querySelector("#mk-tabla").innerHTML =
          "<tr><td>⚡ Rápido y mal</td><td>2 h</td><td>" + fallosR * 10 + "%</td><td style='font-weight:800;color:var(--error)'>" + nf(totalRapido, 0) + " h</td></tr>" +
          "<tr><td>🛠️ Despacio y bien</td><td>4 h</td><td>" + fallosB * 10 + "%</td><td style='font-weight:800;color:var(--ok)'>" + nf(totalBien, 0) + " h</td></tr>";
        cont.querySelector("#mk-nota").innerHTML = "Tras " + n + " proyectos: hacerlo «rápido» lleva acumuladas <strong>" + nf(totalRapido - totalBien, 0) + " horas más</strong> que hacerlo bien. El retrabajo no sale en la agenda... hasta que sale.";
      });
      cont.querySelector("#mk-reset").addEventListener("click", function () {
        totalRapido = 0; totalBien = 0; n = 0;
        cont.querySelector("#mk-tabla").innerHTML = '<tr><td colspan="4" style="color:var(--tinta-tenue)">Pulsa ejecutar.</td></tr>';
        cont.querySelector("#mk-nota").textContent = "";
      });
    }
    registrar({ id: "sim-meskimen", icono: "🔁", titulo: "Hacerlo dos veces", ley: "meskimen", resumen: "Compara la contabilidad real de la chapuza contra el trabajo bien hecho.", render: render });
  })();

})();
