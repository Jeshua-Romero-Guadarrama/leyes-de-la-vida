/* ==========================================================================
   Leyes de la Vida — Interactivos adicionales III (ampliación a 100 leyes)
   Autor: Jeshua Romero Guadarrama
   ========================================================================== */

(function () {
  "use strict";

  var U = window.UTILSIM;
  var nf = U.nf, esc = U.esc, graficoLineas = U.graficoLineas;
  var simCurva = U.simCurva, simAdivina = U.simAdivina, registrar = U.registrar;
  var azar = Math.random;

  /* ---------- Ventaja comparativa (Ricardo) ---------- */
  (function () {
    function renderRicardo(cont) {
      var comercio = false;
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="ri-toggle">🚢 Abrir el comercio</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="ri-lienzo"></div>' +
        '<p class="marcador" id="ri-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Portugal es mejor produciendo AMBAS cosas (vino: 5 u/h frente a 2; paño: 4 frente a 3). Aun así, al especializarse cada país en su menor coste relativo e intercambiar, el mundo produce más con las mismas horas. El resultado menos intuitivo de la economía.</p>';
      function pintar() {
        var datos;
        if (!comercio) {
          datos = { vino: 250 + 100, pano: 200 + 150, titulo: "Autarquía: cada país reparte sus 100 h mitad y mitad" };
        } else {
          datos = { vino: 350 + 0, pano: 120 + 300, titulo: "Comercio: Portugal se vuelca al vino, Inglaterra al paño" };
        }
        var s = '<p style="margin:0 0 10px;font-weight:600">' + datos.titulo + "</p>" +
          '<svg viewBox="0 0 560 130" style="width:100%;max-width:560px">';
        [["🍷 Vino mundial", datos.vino, 500, "var(--soc)"], ["🧵 Paño mundial", datos.pano, 500, "var(--tec)"]].forEach(function (fila, i) {
          var y = 20 + i * 55;
          s += '<text x="10" y="' + (y + 16) + '" font-size="13" fill="var(--tinta)">' + fila[0] + "</text>";
          s += '<rect x="140" y="' + y + '" width="' + (fila[1] / fila[2]) * 380 + '" height="24" rx="7" fill="' + fila[3] + '"/>';
          s += '<text x="' + (148 + (fila[1] / fila[2]) * 380) + '" y="' + (y + 17) + '" font-size="13" font-weight="700" fill="var(--tinta)">' + fila[1] + " u</text>";
        });
        s += "</svg>";
        cont.querySelector("#ri-lienzo").innerHTML = s;
        cont.querySelector("#ri-nota").innerHTML = comercio ?
          "Mismas horas de trabajo: igual vino y <strong>+70 unidades de paño</strong>. Nadie perdió: el comercio no es suma cero." :
          "Punto de partida: 350 unidades de vino y 350 de paño en el mundo.";
        cont.querySelector("#ri-toggle").textContent = comercio ? "🏝️ Volver a la autarquía" : "🚢 Abrir el comercio";
      }
      cont.querySelector("#ri-toggle").addEventListener("click", function () { comercio = !comercio; pintar(); });
      pintar();
    }
    registrar({
      id: "sim-ricardo", icono: "🚢", titulo: "El país que era mejor en todo", ley: "ricardo",
      resumen: "Abre el comercio entre dos países y mira aparecer riqueza de la nada.", render: renderRicardo
    });
  })();

  /* ---------- Ventana rota (Bastiat) ---------- */
  (function () {
    function renderBastiat(cont) {
      var estado = { visible: 0, real: 0, sucesos: [] };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="ba-romper">🪨 Romper el escaparate</button>' +
        '<button class="boton-sim secundario" id="ba-zapatos">👞 Dejar que el panadero compre los zapatos</button>' +
        '<button class="boton-sim secundario" id="ba-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
        '<div><p style="margin:0 0 4px">👁️ <strong>Actividad visible</strong> («PIB del barrio»)</p><p class="marcador" id="ba-visible" style="font-size:1.5rem">0 €</p></div>' +
        '<div><p style="margin:0 0 4px">💰 <strong>Riqueza real</strong> (lo que el barrio posee)</p><p class="marcador" id="ba-real" style="font-size:1.5rem">0 €</p></div>' +
        "</div>" +
        '<div id="ba-log" style="font-size:0.88rem;color:var(--tinta-suave);margin-top:10px"></div>' +
        "</div>" +
        '<p class="nota-sim">Cada acción mueve 100 €. Romper el cristal genera la misma actividad visible que comprar los zapatos... pero compara la columna de la riqueza real: la destrucción solo repone lo que ya existía. «Lo que se ve y lo que no se ve.»</p>';
      function pintar() {
        cont.querySelector("#ba-visible").textContent = nf(estado.visible, 0) + " €";
        var real = cont.querySelector("#ba-real");
        real.textContent = (estado.real >= 0 ? "+" : "") + nf(estado.real, 0) + " €";
        real.style.color = estado.real >= 0 ? "var(--ok)" : "var(--error)";
        cont.querySelector("#ba-log").innerHTML = estado.sucesos.slice(-5).map(function (s) { return "<p style='margin:2px 0'>" + s + "</p>"; }).join("");
      }
      cont.querySelector("#ba-romper").addEventListener("click", function () {
        estado.visible += 100;
        estado.real -= 100;
        estado.sucesos.push("🪨 Cristal roto → el cristalero factura 100 € <em>(se ve)</em>… y los zapatos que el panadero iba a comprar nunca existirán <em>(no se ve)</em>.");
        pintar();
      });
      cont.querySelector("#ba-zapatos").addEventListener("click", function () {
        estado.visible += 100;
        estado.real += 100;
        estado.sucesos.push("👞 El panadero compra zapatos → el zapatero factura 100 € y el barrio conserva el cristal Y estrena zapatos.");
        pintar();
      });
      cont.querySelector("#ba-reset").addEventListener("click", function () {
        estado = { visible: 0, real: 0, sucesos: [] };
        pintar();
      });
      pintar();
    }
    registrar({
      id: "sim-bastiat", icono: "🪟", titulo: "La ventana rota", ley: "bastiat",
      resumen: "Rompe cristales o compra zapatos: el «PIB» no distingue, la riqueza sí.", render: renderBastiat
    });
  })();

  /* ---------- Efecto Zeigarnik ---------- */
  (function () {
    var TAREAS = ["la comanda de la mesa 4", "el informe trimestral", "el crucigrama", "la llamada al banco", "el correo al proveedor", "la maleta del viaje", "el puzle de 500 piezas", "la factura de marzo", "el capítulo 7", "la lista de la compra"];
    function renderZeigarnik(cont) {
      var estado = { tareas: [] };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim secundario" id="ze-completa">✔ Empezar una tarea y terminarla</button>' +
        '<button class="boton-sim" id="ze-corta">✂️ Empezar una tarea e interrumpirla</button>' +
        '<button class="boton-sim" id="ze-examen">🧠 Examen sorpresa de memoria</button>' +
        '<button class="boton-sim secundario" id="ze-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="ze-lienzo"><p style="margin:0;color:var(--tinta-tenue)">Acumula tareas terminadas e interrumpidas y luego examina tu memoria.</p></div>' +
        '<p class="nota-sim">Como los camareros de Zeigarnik: las tareas cerradas se archivan y se sueltan; las abiertas mantienen una tensión que las conserva en memoria. En el examen, las interrumpidas se recuerdan aproximadamente el doble.</p>';
      function anadir(tipo) {
        var libres = TAREAS.filter(function (t) {
          return !estado.tareas.some(function (x) { return x.nombre === t; });
        });
        if (!libres.length) return;
        estado.tareas.push({ nombre: libres[Math.floor(azar() * libres.length)], tipo: tipo });
        pintarLista();
      }
      function pintarLista() {
        var t = estado.tareas;
        cont.querySelector("#ze-lienzo").innerHTML =
          "<p style='margin:0 0 6px'>Tareas del día (" + t.length + "):</p>" +
          t.map(function (x) {
            return "<span style='display:inline-block;margin:3px;padding:5px 12px;border-radius:999px;font-size:0.85rem;background:" +
              (x.tipo === "fin" ? "var(--superficie)" : "color-mix(in srgb, var(--psi) 16%, var(--superficie))") +
              ";border:1px solid " + (x.tipo === "fin" ? "var(--borde)" : "var(--psi)") + "'>" +
              (x.tipo === "fin" ? "✔ " : "✂️ ") + esc(x.nombre) + "</span>";
          }).join("");
      }
      cont.querySelector("#ze-completa").addEventListener("click", function () { anadir("fin"); });
      cont.querySelector("#ze-corta").addEventListener("click", function () { anadir("corte"); });
      cont.querySelector("#ze-examen").addEventListener("click", function () {
        if (!estado.tareas.length) return;
        var recordadas = estado.tareas.map(function (x) {
          return { t: x, ok: azar() < (x.tipo === "fin" ? 0.35 : 0.75) };
        });
        function tasa(tipo) {
          var del = recordadas.filter(function (r) { return r.t.tipo === tipo; });
          if (!del.length) return null;
          return del.filter(function (r) { return r.ok; }).length / del.length;
        }
        var tf = tasa("fin"), tc = tasa("corte");
        cont.querySelector("#ze-lienzo").innerHTML =
          "<p style='margin:0 0 6px'><strong>¿Qué tareas recuerdas haber hecho hoy?</strong></p>" +
          recordadas.map(function (r) {
            return "<span style='display:inline-block;margin:3px;padding:5px 12px;border-radius:999px;font-size:0.85rem;opacity:" + (r.ok ? 1 : 0.3) + ";background:var(--superficie);border:1px solid " + (r.ok ? "var(--est)" : "var(--borde)") + "'>" +
              (r.ok ? "💭 " : "❓ ") + (r.t.tipo === "fin" ? "✔ " : "✂️ ") + esc(r.t.nombre) + "</span>";
          }).join("") +
          "<p class='marcador' style='margin-top:10px'>Recordadas — terminadas: <strong>" + (tf === null ? "—" : nf(tf * 100, 0) + "%") + "</strong> · interrumpidas: <strong>" + (tc === null ? "—" : nf(tc * 100, 0) + "%") + "</strong></p>";
      });
      cont.querySelector("#ze-reset").addEventListener("click", function () {
        estado.tareas = [];
        cont.querySelector("#ze-lienzo").innerHTML = '<p style="margin:0;color:var(--tinta-tenue)">Acumula tareas terminadas e interrumpidas y luego examina tu memoria.</p>';
      });
    }
    registrar({
      id: "sim-zeigarnik", icono: "✂️", titulo: "El camarero y la comanda", ley: "zeigarnik",
      resumen: "Termina o interrumpe tareas y examina qué recuerda tu memoria.", render: renderZeigarnik
    });
  })();

  /* ---------- Posición serial ---------- */
  registrar({
    id: "sim-posicion-serial", icono: "📝", titulo: "La U del recuerdo", ley: "posicion-serial",
    resumen: "Recorre una lista de 20 elementos y mira qué posiciones sobreviven.",
    render: simCurva({
      controles: [{ id: "p", etiqueta: "Posición del elemento en la lista", min: 1, max: 20, valor: 10 }],
      selector: { id: "modo", opciones: [["inmediata", "Prueba inmediata"], ["demorada", "Prueba tras 30 s de distracción"]] },
      grafico: function (v) {
        function rec(pos, modo) {
          var prim = 42 * Math.exp(-(pos - 1) / 3.2);
          var recencia = modo === "inmediata" ? 48 * Math.exp(-(20 - pos) / 2.2) : 0;
          return Math.min(95, 28 + prim + recencia);
        }
        var pts = [];
        for (var p = 1; p <= 20; p++) pts.push({ x: p, y: rec(p, v.modo) });
        return {
          series: [{ nombre: "% de recuerdo", color: "var(--psi)", puntos: pts }],
          xMax: 20, yMax: 100, xEtiq: "Posición en la lista", yEtiq: "% recordado",
          marcas: [{ x: v.p, y: rec(v.p, v.modo), texto: nf(rec(v.p, v.modo), 0) + "%" }]
        };
      },
      nota: function (v) {
        if (v.modo === "demorada" && v.p > 14) return "La recencia se esfumó: 30 segundos de distracción vaciaron la memoria de trabajo. Solo sobrevive la primacía.";
        return v.p <= 4 ? "🥇 Primacía: los primeros elementos reciben más repaso y pasan a la memoria a largo plazo." :
          v.p >= 16 ? "🕑 Recencia: los últimos siguen frescos en la memoria de trabajo... mientras no te distraigan." :
            "🕳️ El pantano del medio: ni repaso suficiente ni frescura. Aquí muere la lista de la compra.";
      },
      pie: "La U del recuerdo demuestra que hay dos memorias distintas: cambia a la prueba demorada y mira desaparecer solo la mitad derecha de la curva."
    })
  });

  /* ---------- Ventana de Overton ---------- */
  (function () {
    function renderOverton(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Años de debate y activismo: <strong id="ov-val">0</strong></label>' +
        '<input type="range" id="ov-rango" min="0" max="30" value="0">' +
        "</div>" +
        '<div class="lienzo-sim" id="ov-lienzo"></div>' +
        '<p class="marcador" id="ov-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">La idea ★ no cambia ni un milímetro: la que se mueve es la ventana de lo aceptable. Décadas de debate desplazan el marco hasta que lo impensable de ayer se vota mañana. Funciona en ambas direcciones.</p>';
      var rango = cont.querySelector("#ov-rango");
      function pintar() {
        var t = +rango.value;
        cont.querySelector("#ov-val").textContent = t;
        var centro = 25 + t * 1.8;
        var medio = 14 + t * 0.25;
        var idea = 78;
        var W = 560, H = 150;
        function X(v) { return 20 + (v / 100) * (W - 40); }
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<rect x="20" y="55" width="' + (W - 40) + '" height="30" rx="15" fill="var(--superficie)" stroke="var(--borde)"/>';
        s += '<rect x="' + X(Math.max(0, centro - medio)) + '" y="55" width="' + (X(Math.min(100, centro + medio)) - X(Math.max(0, centro - medio))) + '" height="30" rx="15" fill="color-mix(in srgb, var(--est) 35%, var(--superficie))" stroke="var(--est)" stroke-width="2"/>';
        s += '<text x="' + X(centro) + '" y="47" text-anchor="middle" font-size="11" fill="var(--est)" font-weight="700">ventana de lo aceptable</text>';
        s += '<text x="' + X(idea) + '" y="75" text-anchor="middle" font-size="16">★</text>';
        s += '<text x="' + X(idea) + '" y="105" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">la idea</text>';
        s += '<text x="24" y="130" font-size="10" fill="var(--tinta-tenue)">impensable ← </text>';
        s += '<text x="' + (W - 24) + '" y="130" text-anchor="end" font-size="10" fill="var(--tinta-tenue)"> → política vigente</text>';
        s += "</svg>";
        cont.querySelector("#ov-lienzo").innerHTML = s;
        var d = Math.abs(idea - centro);
        cont.querySelector("#ov-nota").innerHTML = "La idea ★ hoy es: <strong>" +
          (d <= medio * 0.4 ? "política sensata — se aprueba con aplausos" :
            d <= medio ? "aceptable — se debate en serio" :
              d <= medio + 14 ? "radical — solo la defienden «los exaltados»" : "impensable — nombrarla cuesta la carrera") + "</strong>";
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-overton", icono: "🪟", titulo: "La ventana que se mueve", ley: "overton",
      resumen: "Deja pasar años de debate: la idea no cambia, el marco sí.", render: renderOverton
    });
  })();

  /* ---------- Regla del 1% ---------- */
  registrar({
    id: "sim-regla1", icono: "👤", titulo: "Los que miran y el que escribe", ley: "regla-1",
    resumen: "Agranda una comunidad y cuenta quién crea de verdad el contenido.",
    render: simCurva({
      controles: [{ id: "x", etiqueta: "Miembros de la comunidad", min: 2, max: 6, paso: 0.1, valor: 4, fmt: function (v) { return nf(Math.round(Math.pow(10, v)), 0); } }],
      grafico: function (v) {
        var n = Math.round(Math.pow(10, v.x));
        var datos = [
          ["👀 Solo miran (90%)", Math.round(n * 0.9), "var(--borde)"],
          ["💬 Comentan a veces (9%)", Math.round(n * 0.09), "var(--tec)"],
          ["✍️ Crean el contenido (1%)", Math.max(1, Math.round(n * 0.01)), "var(--soc)"]
        ];
        var s = '<svg viewBox="0 0 560 160" style="width:100%;max-width:560px;margin:0 auto">';
        datos.forEach(function (fila, i) {
          var y = 14 + i * 48;
          var w = Math.max(4, (fila[1] / (n * 0.9)) * 330);
          s += '<text x="10" y="' + (y + 15) + '" font-size="12" fill="var(--tinta)">' + fila[0] + "</text>";
          s += '<rect x="200" y="' + y + '" width="' + w + '" height="22" rx="6" fill="' + fila[2] + '"/>';
          s += '<text x="' + (206 + w) + '" y="' + (y + 16) + '" font-size="12" font-weight="700" fill="var(--tinta)">' + nf(fila[1], 0) + "</text>";
        });
        s += "</svg>";
        return s;
      },
      nota: function (v) {
        var n = Math.round(Math.pow(10, v.x));
        return "Todo lo que leen " + nf(Math.round(n * 0.99), 0) + " personas lo escriben <strong>" + nf(Math.max(1, Math.round(n * 0.01)), 0) + "</strong>. Lo que ves en una plataforma no representa a su comunidad: representa a su 1% más motivado.";
      },
      pie: "La participación en línea es asimetría pura (prima de la ley de Price): las reseñas las firman los encantados y los furiosos, nunca el usuario mediano."
    })
  });

  /* ---------- Leyes de Wiio ---------- */
  (function () {
    var RUIDO = ["urgente", "el presupuesto", "mañana", "el jefe", "no", "quizá", "todo", "nadie"];
    function mutar(palabras) {
      var p = palabras.slice();
      if (p.length < 2) return p;
      var op = Math.floor(azar() * 4);
      var i = Math.floor(azar() * p.length);
      if (op === 0 && p.length > 3) p.splice(i, 1);
      else if (op === 1) { var j = Math.min(p.length - 1, i + 1); var t = p[i]; p[i] = p[j]; p[j] = t; }
      else if (op === 2) p[i] = RUIDO[Math.floor(azar() * RUIDO.length)];
      else p.splice(i, 0, RUIDO[Math.floor(azar() * RUIDO.length)]);
      return p;
    }
    function renderWiio(cont) {
      cont.innerHTML =
        '<div class="fila-controles" style="align-items:stretch;flex-direction:column">' +
        '<input type="text" id="wi-msj" value="La reunión del viernes se aplaza a la próxima semana" style="padding:10px 14px;border-radius:8px;border:1px solid var(--borde);background:var(--superficie);color:var(--tinta);font-size:0.95rem">' +
        "</div>" +
        '<div class="fila-controles">' +
        '<label>Personas en la cadena: <strong id="wi-n">5</strong></label>' +
        '<input type="range" id="wi-rango" min="2" max="8" value="5">' +
        '<button class="boton-sim" id="wi-enviar">📢 Transmitir el mensaje</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="wi-lienzo"><p style="margin:0;color:var(--tinta-tenue)">Escribe un mensaje y pásalo de boca en boca.</p></div>' +
        '<p class="nota-sim">El juego del teléfono con la contabilidad de Wiio: cada persona entiende «casi» lo que oyó. Mide la fidelidad final y recuerda su ley: la comunicación normalmente falla, excepto por accidente — la comunicación lograda hay que fabricarla (confirmar, repetir, ejemplificar).</p>';
      var rango = cont.querySelector("#wi-rango");
      rango.addEventListener("input", function () { cont.querySelector("#wi-n").textContent = rango.value; });
      cont.querySelector("#wi-enviar").addEventListener("click", function () {
        var original = cont.querySelector("#wi-msj").value.trim() || "La reunión del viernes se aplaza";
        var n = +rango.value;
        var cadena = [original];
        var palabras = original.toLowerCase().split(/\s+/);
        for (var i = 0; i < n; i++) {
          palabras = mutar(palabras);
          if (azar() < 0.5) palabras = mutar(palabras);
          cadena.push(palabras.join(" "));
        }
        var setO = {};
        original.toLowerCase().split(/\s+/).forEach(function (w) { setO[w] = true; });
        var finales = palabras.filter(function (w) { return setO[w]; }).length;
        var fidelidad = Math.round((finales / Math.max(palabras.length, original.split(/\s+/).length)) * 100);
        cont.querySelector("#wi-lienzo").innerHTML =
          cadena.map(function (m, i) {
            return "<p style='margin:4px 0;font-size:0.9rem'>" + (i === 0 ? "🗣️ <strong>Original:</strong> " : "👤 Persona " + i + ": ") +
              "<em>«" + esc(m) + "»</em></p>";
          }).join("") +
          "<p class='marcador' style='margin-top:10px'>Fidelidad final: <strong style='color:" + (fidelidad > 70 ? "var(--ok)" : "var(--error)") + "'>" + fidelidad + "%</strong>" +
          (fidelidad > 85 ? " — comunicación lograda... por accidente, como predijo Wiio." : " — la comunicación falló, como era de esperar.") + "</p>";
      });
    }
    registrar({
      id: "sim-wiio", icono: "📢", titulo: "El teléfono escacharrado", ley: "wiio",
      resumen: "Pasa un mensaje por una cadena de personas y mide lo que sobrevive.", render: renderWiio
    });
  })();

  /* ---------- La valla de Chesterton ---------- */
  registrar({
    id: "sim-chesterton", icono: "🚧", titulo: "¿Quitamos la valla?", ley: "chesterton",
    resumen: "Cuatro cosas aparentemente inútiles piden ser eliminadas. Tú decides.",
    render: simAdivina({
      preguntas: [
        {
          texto: "En el código heredado hay una línea que «no hace nada»: <code>esperar(50 ms)</code>. ¿La borramos?", opciones: [
            { t: "🚧 Investigar primero por qué está ahí", ok: true },
            { t: "🗑️ Borrarla: el código limpio no espera porque sí" }
          ], retro: "Se puso porque la impresora fiscal pierde datos si recibe órdenes seguidas. Borrarla tumbó la facturación... en la versión de la historia donde nadie preguntó."
        },
        {
          texto: "Un camino rural tiene una valla en medio de la nada. El comité de senderismo quiere retirarla.", opciones: [
            { t: "🚧 Averiguar quién la puso y para qué", ok: true },
            { t: "🗑️ Quitarla: afea el paisaje y no cerca nada" }
          ], retro: "Contiene al ganado que sube en agosto. La valla original de Chesterton: si no le ves el uso, no estás autorizado a quitarla; cuando lo sepas, quizá sí."
        },
        {
          texto: "El manual de la central dice «purgar la válvula B antes de arrancar». Nadie recuerda por qué y añade 10 minutos.", opciones: [
            { t: "🚧 Rastrear el origen de la norma antes de tocarla", ok: true },
            { t: "🗑️ Eliminarla del manual: burocracia heredada" }
          ], retro: "La norma nació de un accidente de 1987. Las reglas de seguridad «absurdas» suelen estar escritas con sustos: entiende, y después decide."
        },
        {
          texto: "Investigas la valla del formulario: campo «segundo apellido» obligatorio. Descubres que lo exige un registro legal externo. ¿Y ahora?", opciones: [
            { t: "✅ Ahora sí: decidir con conocimiento (mantener o negociar el cambio)", ok: true },
            { t: "🚧 Seguir sin tocar nada para siempre, por si acaso" }
          ], retro: "Chesterton no santifica las vallas: exige entenderlas. Una vez conoces el porqué, tienes derecho a mantenerla, cambiarla o tumbarla con argumentos."
        }
      ],
      final: function () { return "No quites una valla hasta saber por qué la pusieron: las vallas rara vez crecen solas — alguien pagó un problema para aprenderlas."; }
    })
  });

  /* ---------- Navaja de Hitchens ---------- */
  registrar({
    id: "sim-hitchens", icono: "🗡️", titulo: "¿Quién debe probarlo?", ley: "hitchens",
    resumen: "Cuatro afirmaciones sobre la mesa: reparte la carga de la prueba.",
    render: simAdivina({
      preguntas: [
        {
          texto: "«Mi pulsera magnética cura el insomnio. Demuestra tú que no.»", opciones: [
            { t: "🗡️ Afirmación sin pruebas: se descarta sin pruebas", ok: true },
            { t: "🔬 Me toca financiar un estudio para refutarla" }
          ], retro: "Quien afirma, prueba. Si aceptaras la inversión de la carga, cualquiera podría agotarte fabricando ocurrencias gratis (ley de Brandolini)."
        },
        {
          texto: "«Este fármaco reduce los infartos: aquí están los tres ensayos clínicos publicados.»", opciones: [
            { t: "🔬 Examinar las pruebas presentadas: la navaja ya no aplica", ok: true },
            { t: "🗡️ Descartarlo sin mirar: todo puede rechazarse" }
          ], retro: "La navaja corta afirmaciones SIN pruebas. Cuando hay pruebas, toca evaluarlas: usarla para ignorar evidencia es escepticismo de pacotilla."
        },
        {
          texto: "«Hay una tetera orbitando el Sol entre la Tierra y Marte, demasiado pequeña para verla.»", opciones: [
            { t: "🗡️ Irrefutable a propósito: rechazo sin más trámite", ok: true },
            { t: "🔭 Agnosticismo estricto: 50% de que exista" }
          ], retro: "La tetera de Russell, prima de esta navaja: lo infalsable diseñado para no poder comprobarse no merece ni el beneficio de la duda."
        },
        {
          texto: "«Te digo que vi a tu socio salir de la notaría rival. Créeme y rompe el contrato hoy.»", opciones: [
            { t: "🗡️ Afirmación grave + decisión costosa = exigir pruebas antes de actuar", ok: true },
            { t: "⚡ Actuar ya: quien avisa no traiciona" }
          ], retro: "Cuanto más cara la decisión que te piden, más pruebas debe traer la afirmación que la sostiene. Extraordinario lo afirmado, extraordinario lo exigido."
        }
      ],
      final: function () { return "Lo que se afirma sin pruebas puede rechazarse sin pruebas: la carga de la prueba pertenece a quien afirma, siempre."; }
    })
  });

  /* ---------- Ley de Hyrum ---------- */
  registrar({
    id: "sim-hyrum", icono: "🔗", titulo: "El contrato invisible", ley: "hyrum",
    resumen: "Gana usuarios y descubre de cuántos detalles internos dependen ya.",
    render: simCurva({
      controles: [{ id: "x", etiqueta: "Usuarios de tu sistema", min: 0, max: 6, paso: 0.1, valor: 3, fmt: function (v) { return nf(Math.round(Math.pow(10, v)), 0); } }],
      grafico: function (v) {
        function p(n) { return (1 - Math.pow(1 - 0.002, n)) * 100; }
        var pts = [];
        for (var x = 0; x <= 6; x += 0.1) pts.push({ x: x, y: p(Math.pow(10, x)) });
        return {
          series: [{ nombre: "P(alguien depende de un detalle no documentado)", color: "var(--tec)", puntos: pts }],
          xMax: 6, yMax: 105, xEtiq: "Usuarios (10ⁿ)", yEtiq: "Probabilidad (%)",
          marcas: [{ x: v.x, y: p(Math.pow(10, v.x)), texto: nf(p(Math.pow(10, v.x)), 0) + "%" }]
        };
      },
      nota: function (v) {
        var n = Math.round(Math.pow(10, v.x));
        var p = (1 - Math.pow(1 - 0.002, n)) * 100;
        return p < 20 ? "Con " + nf(n, 0) + " usuarios aún puedes cambiar detalles internos sin drama." :
          p < 90 ? "Con " + nf(n, 0) + " usuarios, es probable que alguien ya dependa de ese orden de lista «casual» o de ese mensaje de error literal." :
            "Con " + nf(n, 0) + " usuarios, TODO comportamiento observable tiene dependientes: corregir una falta de ortografía en un error romperá los scripts que la buscaban. Tu comportamiento real ES tu contrato.";
      },
      pie: "Nacida en Google: con suficientes usuarios, da igual lo que prometa la documentación — cada cosa observable que tu sistema hace será usada por alguien."
    })
  });

  /* ---------- Paradoja de Simpson ---------- */
  (function () {
    function renderSimpson(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Casos graves que atiende el hospital A: <strong id="si-val">30</strong>%</label>' +
        '<input type="range" id="si-rango" min="10" max="90" value="30">' +
        "</div>" +
        '<div class="lienzo-sim" id="si-lienzo"></div>' +
        '<p class="marcador" id="si-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">El hospital A es mejor en TODO: cura el 93% de los leves (B: 87%) y el 58% de los graves (B: 48%). Pero A es el hospital de referencia: sube su proporción de graves y mira qué cuenta la cifra total. Sin estratificar, los datos dicen lo contrario de la verdad.</p>';
      var rango = cont.querySelector("#si-rango");
      function pintar() {
        var g = +rango.value / 100;
        cont.querySelector("#si-val").textContent = rango.value;
        var A = (1 - g) * 93 + g * 58;
        var B = 0.8 * 87 + 0.2 * 48;
        cont.querySelector("#si-lienzo").innerHTML =
          '<table class="tabla-sim"><thead><tr><th></th><th>Casos leves</th><th>Casos graves</th><th>TOTAL agregado</th></tr></thead><tbody>' +
          "<tr><td><strong>Hospital A</strong> (" + rango.value + "% graves)</td><td style='color:var(--ok);font-weight:700'>93% ✔</td><td style='color:var(--ok);font-weight:700'>58% ✔</td><td style='font-weight:800;color:" + (A > B ? "var(--ok)" : "var(--error)") + "'>" + nf(A, 1) + "%</td></tr>" +
          "<tr><td><strong>Hospital B</strong> (20% graves)</td><td>87%</td><td>48%</td><td style='font-weight:800;color:" + (B > A ? "var(--ok)" : "inherit") + "'>" + nf(B, 1) + "%</td></tr>" +
          "</tbody></table>";
        cont.querySelector("#si-nota").innerHTML = A >= B ?
          "A gana en cada grupo y también en el total: sin paradoja... de momento." :
          "⚡ <strong>Paradoja de Simpson</strong>: A gana en leves, gana en graves... y «pierde» en el total (" + nf(A, 1) + "% frente a " + nf(B, 1) + "%), solo porque carga con los casos difíciles. El ranking agregado castigaría al mejor hospital.";
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-simpson", icono: "🔀", titulo: "El mejor hospital «pierde»", ley: "simpson",
      resumen: "Gana en cada subgrupo y pierde en el total: fabrica la paradoja tú mismo.", render: renderSimpson
    });
  })();

  /* ---------- Paradoja del cumpleaños ---------- */
  registrar({
    id: "sim-cumpleanos", icono: "🎂", titulo: "La fiesta de las coincidencias", ley: "cumpleanos",
    resumen: "Invita gente a una fiesta y apuesta por el cumpleaños compartido.",
    render: simCurva({
      controles: [{ id: "n", etiqueta: "Invitados", min: 2, max: 80, valor: 23 }],
      botones: [{
        id: "fiesta", texto: "🎉 Organizar la fiesta", accion: function (e, v) {
          var dias = {};
          e.resultado = null;
          for (var i = 0; i < v.n; i++) {
            var d = Math.floor(azar() * 365);
            if (dias[d] !== undefined) { e.resultado = d; break; }
            dias[d] = true;
          }
          e.probado = true;
        }
      }],
      inicial: function (e) { e.probado = false; },
      grafico: function (v) {
        function P(n) {
          var p = 1;
          for (var i = 0; i < n; i++) p *= (365 - i) / 365;
          return (1 - p) * 100;
        }
        var pts = [];
        for (var n = 2; n <= 80; n++) pts.push({ x: n, y: P(n) });
        return {
          series: [
            { nombre: "P(dos comparten cumpleaños)", color: "var(--est)", puntos: pts },
            { nombre: "50%", color: "var(--tinta-tenue)", puntos: [{ x: 2, y: 50 }, { x: 80, y: 50 }] }
          ], xMax: 80, yMax: 105, xEtiq: "Personas en la fiesta", yEtiq: "Probabilidad (%)",
          marcas: [{ x: v.n, y: P(v.n), texto: nf(P(v.n), 0) + "%" }]
        };
      },
      nota: function (v, e) {
        var parejas = (v.n * (v.n - 1)) / 2;
        var base = "Con " + v.n + " personas hay <strong>" + nf(parejas, 0) + " parejas</strong> posibles: la intuición piensa en «alguien coincide conmigo», la matemática cuenta pares.";
        if (!e.probado) return base;
        var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        if (e.resultado === null) return base + "<br>🎈 En TU fiesta no hubo coincidencia esta vez. Prueba otra.";
        var mes = 0, dia = e.resultado + 1;
        var DIAS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        while (dia > DIAS[mes]) { dia -= DIAS[mes]; mes++; }
        return base + "<br>🎊 ¡En TU fiesta dos invitados cumplen el <strong>" + dia + " de " + MESES[mes] + "</strong>!";
      },
      pie: "Con 23 personas, la probabilidad ya supera el 50%; con 60, roza la certeza. La misma matemática sostiene los «ataques de cumpleaños» de la criptografía."
    })
  });

  /* ---------- Monro-Kellie ---------- */
  registrar({
    id: "sim-monro-kellie", icono: "🧠", titulo: "La caja rígida", ley: "monro-kellie",
    resumen: "Haz crecer un hematoma dentro del cráneo y vigila la presión.",
    render: simCurva({
      controles: [{ id: "v", etiqueta: "Volumen del hematoma", min: 0, max: 120, valor: 20, fmt: function (v) { return v + " ml"; } }],
      grafico: function (v) {
        function pic(x) { return x <= 55 ? 10 + x * 0.09 : 15 + Math.pow(1.075, x - 55) * 4 - 4; }
        var pts = [];
        for (var x = 0; x <= 120; x += 2) pts.push({ x: x, y: Math.min(90, pic(x)) });
        return {
          series: [
            { nombre: "Presión intracraneal (mmHg)", color: "var(--med)", puntos: pts },
            { nombre: "Umbral de daño (~22 mmHg)", color: "var(--ges)", puntos: [{ x: 0, y: 22 }, { x: 120, y: 22 }] }
          ], xMax: 120, yMax: 95, xEtiq: "Volumen de la lesión (ml)", yEtiq: "PIC (mmHg)",
          marcas: [{ x: v.v, y: Math.min(90, v.v <= 55 ? 10 + v.v * 0.09 : 15 + Math.pow(1.075, v.v - 55) * 4 - 4) }]
        };
      },
      nota: function (v) {
        return v.v <= 40 ? "🟢 Fase compensada: el cráneo expulsa líquido cefalorraquídeo y sangre venosa; la presión casi no sube. El paciente habla y camina («intervalo lúcido»)." :
          v.v <= 60 ? "🟡 La compensación se agota: ya no queda líquido que expulsar. Cada mililitro empieza a contar." :
            "🔴 Descompensación exponencial: mililitros → mmHg a lo bestia. El cerebro se comprime y puede herniarse: cirugía inmediata. Por eso se vigilan los golpes «que parecían nada».";
      },
      pie: "Cráneo rígido: cerebro + sangre + líquido = constante. La curva plana-y-luego-vertical explica el deterioro fulminante tras horas de aparente normalidad."
    })
  });

  /* ---------- Bell-Magendie ---------- */
  (function () {
    function renderBell(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="chip activo" data-l="ninguna">Sin lesión</button>' +
        '<button class="chip" data-l="dorsal">Lesión de raíz dorsal</button>' +
        '<button class="chip" data-l="ventral">Lesión de raíz ventral</button>' +
        '<button class="chip" data-l="total">Nervio completo</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="bm-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="bm-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">La sensibilidad entra por detrás (raíz dorsal), las órdenes motoras salen por delante (raíz ventral). Lesiona cada puerta y deduce el síntoma: así nació la neurología localizadora.</p>';
      function pintar(lesion) {
        var dorsalRota = lesion === "dorsal" || lesion === "total";
        var ventralRota = lesion === "ventral" || lesion === "total";
        var s = '<svg viewBox="0 0 560 210" style="max-width:560px;margin:0 auto">';
        s += '<ellipse cx="120" cy="105" rx="55" ry="85" fill="color-mix(in srgb, var(--psi) 18%, var(--superficie))" stroke="var(--psi)" stroke-width="2"/>';
        s += '<text x="120" y="110" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)">médula</text>';
        s += '<rect x="440" y="60" width="90" height="90" rx="14" fill="color-mix(in srgb, var(--ges) 20%, var(--superficie))" stroke="var(--ges)" stroke-width="2"/>';
        s += '<text x="485" y="100" text-anchor="middle" font-size="20">🖐️</text><text x="485" y="128" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">piel y músculo</text>';
        s += '<path d="M 440 80 C 330 60 260 60 172 78" fill="none" stroke="' + (dorsalRota ? "var(--error)" : "var(--est)") + '" stroke-width="4"' + (dorsalRota ? ' stroke-dasharray="10 8"' : "") + "/>";
        s += '<text x="300" y="52" text-anchor="middle" font-size="11" fill="' + (dorsalRota ? "var(--error)" : "var(--est)") + '">raíz DORSAL → sensibilidad (entra) ' + (dorsalRota ? "✂️" : "◀") + "</text>";
        s += '<path d="M 172 132 C 260 150 330 150 440 130" fill="none" stroke="' + (ventralRota ? "var(--error)" : "var(--tec)") + '" stroke-width="4"' + (ventralRota ? ' stroke-dasharray="10 8"' : "") + "/>";
        s += '<text x="300" y="172" text-anchor="middle" font-size="11" fill="' + (ventralRota ? "var(--error)" : "var(--tec)") + '">raíz VENTRAL → orden motora (sale) ' + (ventralRota ? "✂️" : "▶") + "</text>";
        s += "</svg>";
        cont.querySelector("#bm-lienzo").innerHTML = s;
        cont.querySelector("#bm-nota").innerHTML =
          lesion === "ninguna" ? "Circuito íntegro: sientes el pinchazo y puedes apartar la mano." :
            lesion === "dorsal" ? "🖐️💤 <strong>Anestesia con fuerza conservada</strong>: no sientes el pinchazo, pero el músculo obedece perfectamente." :
              lesion === "ventral" ? "🖐️🚫 <strong>Parálisis con sensibilidad intacta</strong>: sientes todo... y no puedes mover nada." :
                "🖐️⚠️ Nervio completo: ni sientes ni mueves. Dos leyes rotas a la vez.";
      }
      cont.querySelectorAll(".chip[data-l]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          cont.querySelectorAll(".chip[data-l]").forEach(function (o) { o.classList.remove("activo"); });
          ch.classList.add("activo");
          pintar(ch.getAttribute("data-l"));
        });
      });
      pintar("ninguna");
    }
    registrar({
      id: "sim-bell-magendie", icono: "🔌", titulo: "Las dos puertas de la médula", ley: "bell-magendie",
      resumen: "Corta la raíz dorsal o la ventral y deduce el síntoma.", render: renderBell
    });
  })();

})();
