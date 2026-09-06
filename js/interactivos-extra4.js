/* ==========================================================================
   Leyes de la Vida — Interactivos IV: Física (con animaciones)
   Autor: Jeshua Romero Guadarrama
   ========================================================================== */

(function () {
  "use strict";

  var U = window.UTILSIM;
  var nf = U.nf, graficoLineas = U.graficoLineas;
  var simCurva = U.simCurva, registrar = U.registrar;
  var azar = Math.random;

  /* Bucle de animación que se detiene solo al salir del interactivo. */
  function animar(cont, paso) {
    var previo = null;
    function bucle(t) {
      if (!cont.isConnected) return;
      var dt = previo === null ? 16 : Math.min(48, t - previo);
      previo = t;
      paso(dt / 1000, t / 1000);
      requestAnimationFrame(bucle);
    }
    requestAnimationFrame(bucle);
  }
  U.animar = animar;

  /* ---------- 1ª ley de Newton: inercia ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Rozamiento de la pista: <strong id="in-val">alto</strong></label>' +
        '<input type="range" id="in-rango" min="0" max="100" value="70">' +
        '<button class="boton-sim" id="in-empujar">👋 Dar un empujón</button>' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 120" style="width:100%"><rect x="0" y="86" width="560" height="8" rx="4" fill="var(--borde)" id="in-pista"/><circle id="in-disco" cx="40" cy="70" r="16" fill="var(--fis)"/><text id="in-texto" x="280" y="30" text-anchor="middle" font-size="12" fill="var(--tinta-suave)">Empuja el disco y suéltalo: la única fuerza que queda es el rozamiento.</text></svg></div>' +
        '<p class="nota-sim">Con rozamiento alto el disco «se cansa» pronto; bájalo a cero (pista de hielo perfecta) y el disco no se detiene jamás: los cuerpos no necesitan motor para seguir moviéndose, necesitan que nada los frene. Eso es la inercia.</p>';
      var disco = cont.querySelector("#in-disco"), texto = cont.querySelector("#in-texto");
      var rango = cont.querySelector("#in-rango");
      var x = 40, v = 0;
      rango.addEventListener("input", function () {
        cont.querySelector("#in-val").textContent = +rango.value === 0 ? "NULO (hielo ideal)" : +rango.value < 40 ? "bajo" : "alto";
      });
      cont.querySelector("#in-empujar").addEventListener("click", function () { v = 260; });
      animar(cont, function (dt) {
        var mu = +rango.value / 100;
        v = Math.max(0, v - mu * 220 * dt);
        x += v * dt;
        if (x > 576) x = -16;
        disco.setAttribute("cx", x);
        texto.textContent = v === 0 ? "En reposo: y en reposo seguirá (1ª ley)." :
          mu === 0 ? "Sin rozamiento: velocidad constante para siempre (1ª ley)." :
            "Frenando: no se cansa, lo frena el rozamiento (" + nf(v, 0) + " px/s).";
      });
    }
    registrar({ id: "sim-inercia", icono: "🏒", titulo: "El disco que no se cansa", ley: "newton-inercia", resumen: "Empuja un disco con y sin rozamiento: descubre quién frena de verdad.", render: render });
  })();

  /* ---------- 2ª ley de Newton: F = m·a ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Fuerza del motor: <strong id="f2-f">200</strong> N</label>' +
        '<input type="range" id="f2-rf" min="50" max="400" value="200">' +
        '<label>Masa del carrito B: <strong id="f2-m">2</strong>× la de A</label>' +
        '<input type="range" id="f2-rm" min="10" max="40" value="20">' +
        '<button class="boton-sim" id="f2-go">🏁 ¡Carrera!</button>' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 150" style="width:100%">' +
        '<line x1="0" y1="60" x2="560" y2="60" stroke="var(--borde)"/><line x1="0" y1="120" x2="560" y2="120" stroke="var(--borde)"/>' +
        '<rect id="f2-a" x="10" y="30" width="44" height="26" rx="6" fill="var(--fis)"/><text x="10" y="24" font-size="11" fill="var(--tinta-suave)">A (masa 1)</text>' +
        '<rect id="f2-b" x="10" y="90" width="44" height="26" rx="6" fill="var(--tec)"/><text id="f2-btxt" x="10" y="84" font-size="11" fill="var(--tinta-suave)">B (masa 2×)</text>' +
        '<text id="f2-res" x="555" y="24" text-anchor="end" font-size="12" font-weight="700" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">Misma fuerza para ambos carritos: el que tiene el doble de masa acelera la mitad, exactamente como dicta a = F/m. Sube la fuerza o cambia la masa y vuelve a competir.</p>';
      var a = cont.querySelector("#f2-a"), b = cont.querySelector("#f2-b"), res = cont.querySelector("#f2-res");
      var rf = cont.querySelector("#f2-rf"), rm = cont.querySelector("#f2-rm");
      var xa = 10, xb = 10, va = 0, vb = 0, corriendo = false;
      rf.addEventListener("input", function () { cont.querySelector("#f2-f").textContent = rf.value; });
      rm.addEventListener("input", function () {
        cont.querySelector("#f2-m").textContent = nf(+rm.value / 10, 1);
        cont.querySelector("#f2-btxt").textContent = "B (masa " + nf(+rm.value / 10, 1) + "×)";
      });
      cont.querySelector("#f2-go").addEventListener("click", function () {
        xa = 10; xb = 10; va = 0; vb = 0; corriendo = true; res.textContent = "";
      });
      animar(cont, function (dt) {
        if (!corriendo) return;
        var F = +rf.value, m = +rm.value / 10;
        va += (F / 1) * dt * 0.6;
        vb += (F / m) * dt * 0.6;
        xa = Math.min(506, xa + va * dt);
        xb = Math.min(506, xb + vb * dt);
        a.setAttribute("x", xa);
        b.setAttribute("x", xb);
        if (xa >= 506) {
          corriendo = false;
          res.textContent = "A gana: misma F, " + nf(m, 1) + "× menos masa → " + nf(m, 1) + "× más aceleración";
        }
      });
    }
    registrar({ id: "sim-fma", icono: "🏎️", titulo: "La carrera de F = m·a", ley: "newton-fuerza", resumen: "Misma fuerza, distinta masa: apuesta por un carrito.", render: render });
  })();

  /* ---------- 3ª ley: acción y reacción ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Masa del patinador grande: <strong id="ar-m">3</strong>× la del pequeño</label>' +
        '<input type="range" id="ar-rango" min="10" max="60" value="30">' +
        '<button class="boton-sim" id="ar-push">🤜🤛 ¡Que se empujen!</button>' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 130" style="width:100%">' +
        '<line x1="0" y1="104" x2="560" y2="104" stroke="var(--borde)" stroke-width="3"/>' +
        '<text id="ar-p1" x="250" y="90" font-size="34" text-anchor="middle">⛸️</text>' +
        '<text id="ar-p2" x="310" y="90" font-size="52" text-anchor="middle">🧊</text>' +
        '<text id="ar-msj" x="280" y="26" text-anchor="middle" font-size="12" fill="var(--tinta-suave)">Dos patinadores en hielo, quietos, palma contra palma.</text>' +
        "</svg></div>" +
        '<p class="nota-sim">Se empujan una sola vez: la MISMA fuerza actúa sobre ambos (3ª ley), pero el ligero sale disparado y el pesado apenas se mueve (2ª ley). El producto masa × velocidad de ambos es idéntico y opuesto: así también vuela un cohete, empujando sus gases.</p>';
      var p1 = cont.querySelector("#ar-p1"), p2 = cont.querySelector("#ar-p2"), msj = cont.querySelector("#ar-msj");
      var rango = cont.querySelector("#ar-rango");
      var x1 = 250, x2 = 310, v1 = 0, v2 = 0;
      rango.addEventListener("input", function () { cont.querySelector("#ar-m").textContent = nf(+rango.value / 10, 1); });
      cont.querySelector("#ar-push").addEventListener("click", function () {
        x1 = 250; x2 = 310;
        var m = +rango.value / 10;
        v2 = 60;
        v1 = -60 * m;
        msj.textContent = "Misma fuerza sobre ambos → velocidades inversas a las masas.";
      });
      animar(cont, function (dt) {
        v1 *= (1 - 0.25 * dt); v2 *= (1 - 0.25 * dt);
        x1 = Math.max(20, x1 + v1 * dt);
        x2 = Math.min(540, x2 + v2 * dt);
        p1.setAttribute("x", x1);
        p2.setAttribute("x", x2);
      });
    }
    registrar({ id: "sim-accion", icono: "⛸️", titulo: "El empujón simétrico", ley: "newton-accion", resumen: "Dos patinadores se empujan: la fuerza es igual, el resultado no.", render: render });
  })();

  /* ---------- Gravitación universal ---------- */
  registrar({
    id: "sim-gravitacion", icono: "🌍", titulo: "El apretón que se diluye", ley: "gravitacion",
    resumen: "Aleja dos cuerpos y mira caer la atracción con el cuadrado.",
    render: simCurva({
      controles: [{ id: "d", etiqueta: "Distancia entre los cuerpos", min: 1, max: 10, paso: 0.5, valor: 2, fmt: function (v) { return nf(v, 1) + " unidades"; } }],
      grafico: function (v) {
        var pts = [];
        for (var d = 1; d <= 10; d += 0.25) pts.push({ x: d, y: 100 / (d * d) });
        return {
          series: [{ nombre: "Fuerza de atracción (a d=1 vale 100)", color: "var(--fis)", puntos: pts }],
          xMax: 10, yMax: 105, xEtiq: "Distancia", yEtiq: "Fuerza",
          marcas: [{ x: v.d, y: 100 / (v.d * v.d), texto: nf(100 / (v.d * v.d), 1) }]
        };
      },
      nota: function (v) {
        return "Al doble de distancia, un cuarto de fuerza; al triple, un noveno. Esta caída exacta en 1/d² es la que hace estables las órbitas: la Luna cae hacia la Tierra eternamente... y eternamente falla el golpe.";
      },
      pie: "La misma fuerza que suelta la manzana sostiene a la Luna: la primera gran unificación de la física."
    })
  });

  /* ---------- Arquímedes: el barco ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Carga del barco: <strong id="bq-val">20</strong> contenedores</label>' +
        '<input type="range" id="bq-rango" min="0" max="120" value="20">' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 220" style="width:100%">' +
        '<defs><linearGradient id="bq-mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3aa7c9"/><stop offset="1" stop-color="#155e7c"/></linearGradient></defs>' +
        '<rect x="0" y="120" width="560" height="100" fill="url(#bq-mar)"/>' +
        '<path id="bq-ola" d="" fill="#5fc0dd" opacity="0.7"/>' +
        '<g id="bq-barco"><path d="M -70 0 L 70 0 L 50 26 L -50 26 Z" fill="#8a5a2b"/><rect id="bq-carga" x="-40" y="-26" width="80" height="24" rx="3" fill="var(--fis)" opacity="0.9"/><rect x="-6" y="-46" width="12" height="22" fill="#555"/></g>' +
        '<text id="bq-msj" x="280" y="26" text-anchor="middle" font-size="12" font-weight="600" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">El barco flota mientras el agua que desaloja pesa tanto como él: al cargarlo se hunde más para desalojar más. Pasa de ~100 contenedores y ni hundiéndose entero desaloja suficiente: se va al fondo. Empuje de Arquímedes en vivo.</p>';
      var rango = cont.querySelector("#bq-rango");
      var barco = cont.querySelector("#bq-barco"), ola = cont.querySelector("#bq-ola"), carga = cont.querySelector("#bq-carga"), msj = cont.querySelector("#bq-msj");
      var y = 0, hundido = 0;
      rango.addEventListener("input", function () { cont.querySelector("#bq-val").textContent = rango.value; });
      animar(cont, function (dt, t) {
        var c = +rango.value;
        var objetivo = c <= 100 ? c * 0.28 : 100;
        var sobre = c > 100;
        if (sobre) hundido = Math.min(140, hundido + 30 * dt);
        else hundido = Math.max(0, hundido - 40 * dt);
        y += ((objetivo - y) * 2.2) * dt;
        var bob = Math.sin(t * 1.8) * 3;
        barco.setAttribute("transform", "translate(280," + (118 + y * 0.6 + bob + hundido) + ") rotate(" + (sobre ? Math.min(18, hundido * 0.3) : Math.sin(t * 1.2) * 1.6) + ")");
        carga.setAttribute("height", 6 + Math.min(114, c) * 0.3);
        carga.setAttribute("y", -(8 + Math.min(114, c) * 0.3) - 18);
        var d = "M 0 120 ";
        for (var x = 0; x <= 560; x += 20) d += "L " + x + " " + (120 + Math.sin(x / 40 + t * 2.2) * 4) + " ";
        d += "L 560 132 L 0 132 Z";
        ola.setAttribute("d", d);
        msj.textContent = sobre ? "⚠️ ¡Sobrecarga! El empuje máximo ya no iguala el peso: se hunde." :
          c > 75 ? "Cerca del límite: la línea de flotación sube (por eso existe la marca de Plimsoll)." :
            "Flota: peso del barco = peso del agua desalojada.";
      });
    }
    registrar({ id: "sim-arquimedes", icono: "⛵", titulo: "El barco de acero que flota", ley: "arquimedes", resumen: "Carga el barco contenedor a contenedor... hasta pasarte.", render: render });
  })();

  /* ---------- Bernoulli ---------- */
  registrar({
    id: "sim-bernoulli", icono: "🛫", titulo: "El aire que deja de apretar", ley: "bernoulli",
    resumen: "Acelera el viento sobre un tejado y calcula cuándo sale volando.",
    render: simCurva({
      controles: [{ id: "v", etiqueta: "Velocidad del viento", min: 0, max: 200, paso: 5, valor: 60, fmt: function (v) { return v + " km/h"; } }],
      grafico: function (v) {
        var pts = [];
        for (var x = 0; x <= 200; x += 5) pts.push({ x: x, y: 0.5 * 1.2 * Math.pow(x / 3.6, 2) / 100 });
        function sube(x) { return 0.5 * 1.2 * Math.pow(x / 3.6, 2) / 100; }
        return {
          series: [
            { nombre: "Succión sobre el tejado (kg/m²)", color: "var(--fis)", puntos: pts },
            { nombre: "Peso típico de una teja (~45 kg/m²)", color: "var(--med)", puntos: [{ x: 0, y: 45 }, { x: 200, y: 45 }] }
          ], xMax: 200, yMax: 200, xEtiq: "Velocidad del viento (km/h)", yEtiq: "kg por m²",
          marcas: [{ x: v.v, y: sube(v.v), texto: nf(sube(v.v), 0) + " kg/m²" }]
        };
      },
      nota: function (v) {
        var s = 0.5 * 1.2 * Math.pow(v.v / 3.6, 2) / 100;
        return v.v < 60 ? "Brisa: el aire rápido de fuera apenas baja su presión." :
          s < 45 ? "Ventarrón: el aire veloz sobre el tejado presiona menos que el aire quieto de dentro — el tejado ya «pesa menos»." :
            "🌪️ La diferencia de presión supera el peso de las tejas: el tejado no «se lo lleva» el viento, lo EMPUJA hacia arriba el aire de dentro de la casa. Bernoulli en acción.";
      },
      pie: "Donde el fluido corre, la presión cae: la misma ley sostiene alas, curva balones con efecto y te pega la cortina de la ducha."
    })
  });

  /* ---------- Pascal: prensa hidráulica ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Área del pistón grande: <strong id="pa2-val">10</strong>× la del pequeño</label>' +
        '<input type="range" id="pa2-rango" min="2" max="40" value="10">' +
        "</div>" +
        '<div class="lienzo-sim" id="pa2-lienzo"></div>' +
        '<p class="marcador" id="pa2-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Aprietas con 10 kg el pistón pequeño; el fluido transmite la presión ÍNTEGRA y el pistón grande empuja con 10 kg × su área relativa. Nada es gratis: el pistón grande sube proporcionalmente menos recorrido.</p>';
      var rango = cont.querySelector("#pa2-rango");
      function pintar() {
        var A = +rango.value;
        cont.querySelector("#pa2-val").textContent = A;
        var fuerza = 10 * A;
        var s = '<svg viewBox="0 0 560 200" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<path d="M 80 100 L 80 170 L 480 170 L 480 100" fill="none" stroke="var(--borde)" stroke-width="4"/>';
        s += '<rect x="60" y="100" width="40" height="70" fill="color-mix(in srgb, var(--tec) 35%, transparent)"/>';
        s += '<rect x="440" y="100" width="' + Math.min(110, 40 + A * 1.8) + '" height="70" fill="color-mix(in srgb, var(--tec) 35%, transparent)"/>';
        s += '<rect x="58" y="86" width="44" height="16" rx="4" fill="var(--fis)"/><text x="80" y="70" text-anchor="middle" font-size="12" fill="var(--tinta)">⬇ 10 kg</text>';
        var w = Math.min(110, 40 + A * 1.8);
        s += '<rect x="438" y="86" width="' + (w + 4) + '" height="16" rx="4" fill="var(--fis)"/>';
        s += '<text x="' + (440 + w / 2) + '" y="66" text-anchor="middle" font-size="13" font-weight="800" fill="var(--fis)">⬆ ' + nf(fuerza, 0) + " kg</text>";
        s += '<text x="280" y="195" text-anchor="middle" font-size="11" fill="var(--tinta-tenue)">el fluido transmite la presión a todos sus puntos</text>';
        s += "</svg>";
        cont.querySelector("#pa2-lienzo").innerHTML = s;
        cont.querySelector("#pa2-nota").innerHTML = "10 kg de esfuerzo levantan <strong>" + nf(fuerza, 0) + " kg</strong>" + (fuerza >= 300 ? " — ya levantas un piano con una mano: el gato hidráulico de tu coche." : ".");
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-pascal", icono: "🛠️", titulo: "La prensa multiplicadora", ley: "pascal", resumen: "Levanta un coche con una mano usando dos pistones y un fluido.", render: render });
  })();

  /* ---------- Boyle: pistón con partículas ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Volumen del recipiente: <strong id="by-val">100</strong>%</label>' +
        '<input type="range" id="by-rango" min="30" max="100" value="100">' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 200" style="width:100%">' +
        '<rect x="40" y="20" width="480" height="160" fill="none" stroke="var(--borde)" stroke-width="3" rx="6"/>' +
        '<rect id="by-piston" x="520" y="20" width="14" height="160" fill="var(--fis)" rx="4"/>' +
        '<g id="by-gas"></g>' +
        '<text id="by-p" x="60" y="44" font-size="13" font-weight="800" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">Las mismas 40 moléculas, a la misma temperatura. Comprime el pistón: más choques por segundo contra las paredes = más presión, exactamente P×V constante. Con la mitad de volumen, el doble de presión.</p>';
      var gas = cont.querySelector("#by-gas"), piston = cont.querySelector("#by-piston"), pTxt = cont.querySelector("#by-p");
      var rango = cont.querySelector("#by-rango");
      var parts = [];
      for (var i = 0; i < 40; i++) {
        parts.push({ x: 50 + azar() * 460, y: 30 + azar() * 140, vx: (azar() - 0.5) * 160, vy: (azar() - 0.5) * 160 });
      }
      gas.innerHTML = parts.map(function () { return '<circle r="4" fill="var(--tec)"/>'; }).join("");
      var nodos = gas.querySelectorAll("circle");
      rango.addEventListener("input", function () { cont.querySelector("#by-val").textContent = rango.value; });
      animar(cont, function (dt) {
        var vol = +rango.value / 100;
        var pared = 40 + 480 * vol;
        piston.setAttribute("x", pared);
        parts.forEach(function (p, k) {
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < 48) { p.x = 48; p.vx = Math.abs(p.vx); }
          if (p.x > pared - 8) { p.x = pared - 8; p.vx = -Math.abs(p.vx); }
          if (p.y < 28) { p.y = 28; p.vy = Math.abs(p.vy); }
          if (p.y > 172) { p.y = 172; p.vy = -Math.abs(p.vy); }
          nodos[k].setAttribute("cx", p.x);
          nodos[k].setAttribute("cy", p.y);
        });
        pTxt.textContent = "Presión: " + nf(100 / vol, 0) + " (V=" + rango.value + "% → P×V constante)";
      });
    }
    registrar({ id: "sim-boyle", icono: "🧯", titulo: "Cuarenta moléculas apretadas", ley: "boyle", resumen: "Comprime un gas y mira multiplicarse los choques (la presión).", render: render });
  })();

  /* ---------- Charles: el globo aerostático ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Temperatura del aire interior: <strong id="gl-val">60</strong> °C</label>' +
        '<input type="range" id="gl-rango" min="20" max="120" value="60">' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 260" style="width:100%">' +
        '<defs><radialGradient id="gl-cielo" cx="0.5" cy="0.1" r="1"><stop offset="0" stop-color="#9fd4ef"/><stop offset="1" stop-color="#5a9dc4"/></radialGradient>' +
        '<radialGradient id="gl-tela" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#ff9d5c"/><stop offset="1" stop-color="#d64545"/></radialGradient></defs>' +
        '<rect x="0" y="0" width="560" height="240" fill="url(#gl-cielo)"/>' +
        '<rect x="0" y="240" width="560" height="20" fill="#4e7d3a"/>' +
        '<g id="gl-globo"><ellipse id="gl-tela2" cx="0" cy="-52" rx="46" ry="54" fill="url(#gl-tela)"/><path d="M -18 -6 L 18 -6 L 12 16 L -12 16 Z" fill="#7a4a1d"/><line x1="-30" y1="-14" x2="-12" y2="4" stroke="#5b3a17" stroke-width="2"/><line x1="30" y1="-14" x2="12" y2="4" stroke="#5b3a17" stroke-width="2"/><ellipse id="gl-llama" cx="0" cy="-8" rx="5" ry="9" fill="#ffd23e" opacity="0.9"/></g>' +
        '<text id="gl-alt" x="12" y="24" font-size="13" font-weight="700" fill="#fff"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">Charles + Arquímedes: al calentar el aire interior se dilata, parte escapa por la boca y el globo pesa menos que el aire que desaloja → sube. Deja enfriar y baja. El quemador no «empuja»: solo cambia la densidad.</p>';
      var globo = cont.querySelector("#gl-globo"), llama = cont.querySelector("#gl-llama"), tela = cont.querySelector("#gl-tela2"), alt = cont.querySelector("#gl-alt");
      var rango = cont.querySelector("#gl-rango");
      var y = 170;
      rango.addEventListener("input", function () { cont.querySelector("#gl-val").textContent = rango.value; });
      animar(cont, function (dt, t) {
        var T = +rango.value;
        var objetivo = 236 - Math.max(0, (T - 42)) * 2.4;
        objetivo = Math.max(58, Math.min(236, objetivo));
        y += (objetivo - y) * 0.8 * dt;
        var deriva = Math.sin(t * 0.6) * 8;
        globo.setAttribute("transform", "translate(" + (280 + deriva) + "," + y + ")");
        llama.setAttribute("ry", 4 + (T - 20) * 0.09 + Math.sin(t * 14) * 1.6);
        llama.setAttribute("opacity", T > 30 ? 0.95 : 0.15);
        var infla = 1 + (T - 20) * 0.0022;
        tela.setAttribute("rx", 46 * infla);
        tela.setAttribute("ry", 54 * infla);
        var metros = Math.max(0, Math.round((236 - y) * 6));
        alt.textContent = "Altitud: " + nf(metros, 0) + " m" + (y >= 234 ? " — en tierra: aire interior casi tan denso como el exterior" : "");
      });
    }
    registrar({ id: "sim-globo", icono: "🎈", titulo: "El globo aerostático", ley: "charles", resumen: "Regula el quemador y pilota el globo: calor = menos densidad = subir.", render: render });
  })();

  /* ---------- 1ª termodinámica ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Energía a movimiento: <strong id="t1-m">25</strong> J</label>' +
        '<input type="range" id="t1-rm" min="0" max="100" value="25">' +
        '<label>A calor del motor: <strong id="t1-c">60</strong> J</label>' +
        '<input type="range" id="t1-rc" min="0" max="100" value="60">' +
        "</div>" +
        '<div class="lienzo-sim" id="t1-lienzo"></div>' +
        '<p class="marcador" id="t1-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Tienes 100 J de gasolina. Repártelos: lo que no va a movimiento ni a calor del motor se lo llevan ruido y rozamiento... pero la suma será SIEMPRE 100. Intenta pasarte y verás que la contabilidad no perdona: nada se crea ni se destruye.</p>';
      var rm = cont.querySelector("#t1-rm"), rc = cont.querySelector("#t1-rc");
      function pintar() {
        var m = +rm.value, c = +rc.value;
        var resto = 100 - m - c;
        cont.querySelector("#t1-m").textContent = m;
        cont.querySelector("#t1-c").textContent = c;
        var valido = resto >= 0;
        var filas = [["🚗 Movimiento", m, "var(--fis)"], ["🔥 Calor del motor", c, "var(--med)"], ["🔊 Ruido y rozamiento", Math.max(0, resto), "var(--tinta-tenue)"]];
        var s = '<svg viewBox="0 0 560 150" style="width:100%;max-width:560px;margin:0 auto">';
        filas.forEach(function (f, i) {
          var y = 12 + i * 44;
          s += '<text x="10" y="' + (y + 15) + '" font-size="12" fill="var(--tinta)">' + f[0] + "</text>";
          s += '<rect x="190" y="' + y + '" width="' + Math.max(2, f[1] * 3.2) + '" height="22" rx="6" fill="' + f[2] + '"/>';
          s += '<text x="' + (196 + f[1] * 3.2) + '" y="' + (y + 16) + '" font-size="12" font-weight="700" fill="var(--tinta)">' + nf(f[1], 0) + " J</text>";
        });
        s += "</svg>";
        cont.querySelector("#t1-lienzo").innerHTML = s;
        cont.querySelector("#t1-nota").innerHTML = valido ?
          "Suma: <strong>100 J = 100 J</strong> ✔ La energía solo cambió de forma." :
          "🚫 Pides " + (m + c) + " J de 100: <strong>imposible</strong>. Ningún reparto supera lo que entró — eso sería un móvil perpetuo.";
      }
      rm.addEventListener("input", pintar);
      rc.addEventListener("input", pintar);
      pintar();
    }
    registrar({ id: "sim-termo1", icono: "⚡", titulo: "La contabilidad de los julios", ley: "termo1", resumen: "Reparte 100 J de gasolina: la suma nunca cambiará.", render: render });
  })();

  /* ---------- 2ª termodinámica: mezcla irreversible ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="t2-abrir">🚪 Quitar la pared</button>' +
        '<button class="boton-sim secundario" id="t2-reset">Reiniciar (ordenar)</button>' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 200" style="width:100%">' +
        '<rect x="40" y="20" width="480" height="160" fill="none" stroke="var(--borde)" stroke-width="3" rx="6"/>' +
        '<rect id="t2-pared" x="276" y="20" width="8" height="160" fill="var(--borde)"/>' +
        '<g id="t2-gas"></g>' +
        '<text id="t2-ent" x="60" y="44" font-size="13" font-weight="800" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">Calientes (rojas) a un lado, frías (azules) al otro: orden. Quita la pared y observa: se mezclan solas y JAMÁS se vuelven a separar. Puedes reiniciar el universo con el botón; el universo real no tiene ese botón — eso es la entropía y la flecha del tiempo.</p>';
      var gas = cont.querySelector("#t2-gas"), pared = cont.querySelector("#t2-pared"), ent = cont.querySelector("#t2-ent");
      var abierta = false;
      var parts = [];
      function iniciar() {
        abierta = false;
        pared.setAttribute("width", 8);
        parts = [];
        for (var i = 0; i < 60; i++) {
          var caliente = i < 30;
          parts.push({
            x: caliente ? 50 + azar() * 215 : 295 + azar() * 215,
            y: 30 + azar() * 140,
            vx: (azar() - 0.5) * (caliente ? 220 : 110),
            vy: (azar() - 0.5) * (caliente ? 220 : 110),
            caliente: caliente
          });
        }
        gas.innerHTML = parts.map(function (p) { return '<circle r="4" fill="' + (p.caliente ? "#e05252" : "#4f8fd6") + '"/>'; }).join("");
      }
      iniciar();
      cont.querySelector("#t2-abrir").addEventListener("click", function () { abierta = true; pared.setAttribute("width", 0); });
      cont.querySelector("#t2-reset").addEventListener("click", iniciar);
      animar(cont, function (dt) {
        var nodos = gas.querySelectorAll("circle");
        var izqCal = 0, izqTot = 0;
        parts.forEach(function (p, k) {
          p.x += p.vx * dt; p.y += p.vy * dt;
          var minX = 48, maxX = 512;
          if (!abierta) { if (p.caliente) maxX = 268; else minX = 292; }
          if (p.x < minX) { p.x = minX; p.vx = Math.abs(p.vx); }
          if (p.x > maxX) { p.x = maxX; p.vx = -Math.abs(p.vx); }
          if (p.y < 28) { p.y = 28; p.vy = Math.abs(p.vy); }
          if (p.y > 172) { p.y = 172; p.vy = -Math.abs(p.vy); }
          nodos[k].setAttribute("cx", p.x);
          nodos[k].setAttribute("cy", p.y);
          if (p.x < 280) { izqTot++; if (p.caliente) izqCal++; }
        });
        var mezcla = izqTot ? Math.round((1 - Math.abs((izqCal / izqTot) - 0.5) * 2) * 100) : 0;
        ent.textContent = abierta ? "Desorden (mezcla): " + mezcla + "%" : "Estado ordenado: entropía baja (e improbable)";
      });
    }
    registrar({ id: "sim-termo2", icono: "🎬", titulo: "La película irreversible", ley: "termo2", resumen: "Quita la pared entre caliente y frío: la mezcla no tiene vuelta atrás.", render: render });
  })();

  /* ---------- Ohm ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Voltaje: <strong id="oh-v">12</strong> V</label>' +
        '<input type="range" id="oh-rv" min="1" max="24" value="12">' +
        '<label>Resistencia: <strong id="oh-r">6</strong> Ω</label>' +
        '<input type="range" id="oh-rr" min="1" max="24" value="6">' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 170" style="width:100%">' +
        '<rect x="60" y="40" width="440" height="90" fill="none" stroke="var(--tinta-suave)" stroke-width="3" rx="10"/>' +
        '<rect x="50" y="70" width="20" height="30" fill="var(--fis)"/><text x="60" y="120" text-anchor="middle" font-size="10" fill="var(--tinta-suave)">pila</text>' +
        '<circle id="oh-bombilla" cx="500" cy="85" r="16" fill="#ffd23e" opacity="0.3"/><text x="500" y="122" text-anchor="middle" font-size="10" fill="var(--tinta-suave)">bombilla</text>' +
        '<g id="oh-e"></g>' +
        '<text id="oh-i" x="280" y="24" text-anchor="middle" font-size="13" font-weight="800" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">Los puntos son electrones: el voltaje los empuja, la resistencia los frena. I = V/R decide cuántos pasan por segundo y cuánto brilla la bombilla. Sube V o baja R y mira la corriente responder al instante.</p>';
      var rv = cont.querySelector("#oh-rv"), rr = cont.querySelector("#oh-rr");
      var g = cont.querySelector("#oh-e"), bombilla = cont.querySelector("#oh-bombilla"), iTxt = cont.querySelector("#oh-i");
      var N = 14, pos = [];
      for (var i = 0; i < N; i++) pos.push(i / N);
      g.innerHTML = pos.map(function () { return '<circle r="4" fill="var(--tec)"/>'; }).join("");
      var nodos = g.querySelectorAll("circle");
      function xy(f) {
        var per = 2 * (440 + 90);
        var d = f * per;
        if (d < 440) return [60 + d, 40];
        d -= 440;
        if (d < 90) return [500, 40 + d];
        d -= 90;
        if (d < 440) return [500 - d, 130];
        d -= 440;
        return [60, 130 - d];
      }
      [rv, rr].forEach(function (r) {
        r.addEventListener("input", function () {
          cont.querySelector("#oh-v").textContent = rv.value;
          cont.querySelector("#oh-r").textContent = rr.value;
        });
      });
      animar(cont, function (dt) {
        var I = +rv.value / +rr.value;
        pos = pos.map(function (f) { return (f + I * 0.035 * dt) % 1; });
        pos.forEach(function (f, k) {
          var p = xy(f);
          nodos[k].setAttribute("cx", p[0]);
          nodos[k].setAttribute("cy", p[1]);
        });
        bombilla.setAttribute("opacity", Math.min(1, 0.15 + I / 8));
        bombilla.setAttribute("r", 13 + Math.min(9, I));
        iTxt.textContent = "I = V/R = " + rv.value + "/" + rr.value + " = " + nf(I, 2) + " A";
      });
    }
    registrar({ id: "sim-ohm", icono: "💡", titulo: "El forcejeo eléctrico", ley: "ohm", resumen: "Empuja electrones con voltaje contra una resistencia y mide la corriente.", render: render });
  })();

  /* ---------- Hooke ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Peso colgado: <strong id="hk2-val">2</strong> kg</label>' +
        '<input type="range" id="hk2-rango" min="0" max="10" value="2">' +
        '<button class="boton-sim" id="hk2-soltar">〰️ Tirar y soltar</button>' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 240" style="width:100%">' +
        '<rect x="230" y="10" width="100" height="8" fill="var(--tinta-suave)"/>' +
        '<path id="hk2-muelle" d="" fill="none" stroke="var(--fis)" stroke-width="3"/>' +
        '<rect id="hk2-peso" x="255" y="120" width="50" height="34" rx="6" fill="var(--tec)"/>' +
        '<text id="hk2-txt" x="420" y="60" font-size="13" font-weight="700" fill="var(--tinta)"></text>' +
        '<text id="hk2-aviso" x="420" y="84" font-size="11" fill="var(--med)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">Cada kilo estira el muelle lo mismo: deformación proporcional a la fuerza (ut tensio, sic vis). Pasa de 8 kg y saldrás de la zona elástica: deformación permanente. El botón lo hace oscilar: la vibración de vuelta también es Hooke.</p>';
      var muelle = cont.querySelector("#hk2-muelle"), peso = cont.querySelector("#hk2-peso"), txt = cont.querySelector("#hk2-txt"), aviso = cont.querySelector("#hk2-aviso");
      var rango = cont.querySelector("#hk2-rango");
      var y = 60, vy = 0, danio = 0;
      rango.addEventListener("input", function () { cont.querySelector("#hk2-val").textContent = rango.value; });
      cont.querySelector("#hk2-soltar").addEventListener("click", function () { vy = 220; });
      animar(cont, function (dt) {
        var m = +rango.value;
        if (m > 8) danio = Math.max(danio, (m - 8) * 9);
        var reposo = 40 + m * 11 + danio;
        var k = 60;
        var a = -k * (y - reposo) - vy * 2.2;
        vy += a * dt;
        y += vy * dt;
        var vueltas = 8, d = "M 280 18 ";
        for (var i = 1; i <= vueltas; i++) {
          var yy = 18 + (y / vueltas) * i;
          d += "L " + (280 + (i % 2 ? 22 : -22)) + " " + (yy - (y / vueltas) / 2) + " L 280 " + yy + " ";
        }
        muelle.setAttribute("d", d);
        peso.setAttribute("y", 18 + y);
        txt.textContent = "Estiramiento: " + nf(y - 40, 0) + " px (" + rango.value + " kg × cte)";
        aviso.textContent = danio > 0 ? "⚠️ Superaste el límite elástico: deformación permanente de " + nf(danio, 0) + " px" : "";
      });
    }
    registrar({ id: "sim-hooke", icono: "〰️", titulo: "El muelle honesto", ley: "hooke", resumen: "Cuelga pesos de un muelle, hazlo vibrar... y no superes su límite.", render: render });
  })();

  /* ---------- Snell ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Ángulo del rayo: <strong id="sn-val">40</strong>°</label>' +
        '<input type="range" id="sn-rango" min="5" max="85" value="40">' +
        '<select id="sn-medio"><option value="aire-agua">Del aire al agua</option><option value="agua-aire">Del agua al aire</option></select>' +
        "</div>" +
        '<div class="lienzo-sim" id="sn-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="sn-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">La luz «tuerce» al cambiar de velocidad entre medios. Del agua al aire, pasa algo especial: más allá de ~48,6° el rayo YA NO SALE — reflexión total interna, la cárcel de luz que hace funcionar la fibra óptica.</p>';
      var rango = cont.querySelector("#sn-rango"), medio = cont.querySelector("#sn-medio");
      function pintar() {
        var a1 = +rango.value * Math.PI / 180;
        cont.querySelector("#sn-val").textContent = rango.value;
        var deAguaAire = medio.value === "agua-aire";
        var n1 = deAguaAire ? 1.33 : 1, n2 = deAguaAire ? 1 : 1.33;
        var sen2 = (n1 / n2) * Math.sin(a1);
        var total = sen2 > 1;
        var a2 = total ? 0 : Math.asin(sen2);
        var cx = 280, cy = 110;
        var s = '<svg viewBox="0 0 560 220" style="max-width:560px;margin:0 auto">';
        s += '<rect x="0" y="110" width="560" height="110" fill="color-mix(in srgb, var(--tec) 25%, transparent)"/>';
        s += '<text x="12" y="' + (deAguaAire ? 200 : 24) + '" font-size="11" fill="var(--tinta-suave)">' + (deAguaAire ? "AGUA (origen)" : "AIRE (origen)") + "</text>";
        s += '<line x1="280" y1="10" x2="280" y2="210" stroke="var(--tinta-tenue)" stroke-dasharray="4 4"/>';
        var y0 = deAguaAire ? 1 : -1;
        s += '<line x1="' + (cx - Math.sin(a1) * 95) + '" y1="' + (cy + y0 * Math.cos(a1) * 95) + '" x2="' + cx + '" y2="' + cy + '" stroke="#f2b21d" stroke-width="4"/>';
        if (total) {
          s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.sin(a1) * 95) + '" y2="' + (cy + y0 * Math.cos(a1) * 95) + '" stroke="#f2b21d" stroke-width="4" stroke-dasharray="8 4"/>';
          s += '<text x="' + (cx + 100) + '" y="' + (cy + y0 * 60) + '" font-size="12" font-weight="700" fill="var(--med)">¡reflexión total!</text>';
        } else {
          s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.sin(a2) * 95) + '" y2="' + (cy - y0 * Math.cos(a2) * 95) + '" stroke="#f2b21d" stroke-width="4"/>';
        }
        s += "</svg>";
        cont.querySelector("#sn-lienzo").innerHTML = s;
        cont.querySelector("#sn-nota").innerHTML = total ?
          "🚫 Pasado el ángulo crítico (~48,6°), la luz rebota dentro del agua: <strong>así viaja internet por la fibra óptica</strong>." :
          "Rayo refractado a <strong>" + nf(a2 * 180 / Math.PI, 1) + "°</strong>: " + (deAguaAire ? "se aleja de la vertical al acelerar" : "se acerca a la vertical al frenar") + ".";
      }
      rango.addEventListener("input", pintar);
      medio.addEventListener("change", pintar);
      pintar();
    }
    registrar({ id: "sim-snell", icono: "🔦", titulo: "La luz que tuerce", ley: "snell", resumen: "Dobla un rayo de luz entre aire y agua hasta encarcelarlo (fibra óptica).", render: render });
  })();

  /* ---------- Doppler ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Velocidad de la ambulancia: <strong id="dp-val">40</strong>% de la del sonido*</label>' +
        '<input type="range" id="dp-rango" min="0" max="80" value="40">' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 220" style="width:100%">' +
        '<line x1="0" y1="160" x2="560" y2="160" stroke="var(--borde)" stroke-width="3"/>' +
        '<g id="dp-ondas"></g>' +
        '<text id="dp-amb" x="80" y="150" font-size="30">🚑</text>' +
        '<text x="530" y="150" font-size="26">🧍</text>' +
        '<text id="dp-txt" x="280" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">*Exagerado para que se vea. La ambulancia emite ondas a ritmo fijo, pero al avanzar «pisa» sus propias ondas: delante llegan apretadas (tono agudo) y detrás estiradas (grave). El famoso «niiii-noo» al pasar. Con luz, lo mismo: el corrimiento al rojo de las galaxias.</p>';
      var g = cont.querySelector("#dp-ondas"), amb = cont.querySelector("#dp-amb"), txt = cont.querySelector("#dp-txt");
      var rango = cont.querySelector("#dp-rango");
      var x = 80, ondas = [], emisor = 0;
      rango.addEventListener("input", function () { cont.querySelector("#dp-val").textContent = rango.value; });
      animar(cont, function (dt) {
        var v = +rango.value * 2.2;
        x += v * dt;
        if (x > 600) { x = -40; ondas = []; }
        amb.setAttribute("x", x);
        emisor += dt;
        if (emisor > 0.38) {
          emisor = 0;
          ondas.push({ cx: x + 8, r: 4 });
          if (ondas.length > 14) ondas.shift();
        }
        ondas.forEach(function (o) { o.r += 130 * dt; });
        g.innerHTML = ondas.map(function (o) {
          return '<circle cx="' + o.cx + '" cy="132" r="' + o.r + '" fill="none" stroke="var(--fis)" stroke-width="2" opacity="' + Math.max(0, 1 - o.r / 260) + '"/>';
        }).join("");
        var f = 1 / (1 - Math.min(0.79, v / 340));
        txt.textContent = v === 0 ? "Fuente quieta: ondas concéntricas, mismo tono en todas partes." :
          "El peatón (derecha) oye la sirena " + nf(f, 2) + "× más aguda mientras se acerca.";
      });
    }
    registrar({ id: "sim-doppler", icono: "🚑", titulo: "El niiii-noo explicado", ley: "doppler", resumen: "Mira a la ambulancia comprimir sus propias ondas de sonido.", render: render });
  })();

  /* ---------- Kepler ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Excentricidad de la órbita: <strong id="kp-val">0,5</strong></label>' +
        '<input type="range" id="kp-rango" min="5" max="75" value="50">' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 260" style="width:100%">' +
        '<ellipse id="kp-orbita" cx="280" cy="130" rx="200" ry="100" fill="none" stroke="var(--borde)" stroke-width="1.5" stroke-dasharray="5 4"/>' +
        '<path id="kp-area" d="" fill="color-mix(in srgb, var(--fis) 30%, transparent)"/>' +
        '<circle id="kp-sol" cx="0" cy="130" r="14" fill="#f2b21d"/>' +
        '<circle id="kp-planeta" r="8" fill="var(--tec)"/>' +
        '<text id="kp-txt" x="280" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">1ª ley: elipse con el Sol en un FOCO (no en el centro). 2ª ley: el «quesito» sombreado barre áreas iguales en tiempos iguales — mira al planeta correr cerca del Sol y arrastrarse lejos. Sube la excentricidad y tendrás un cometa.</p>';
      var planeta = cont.querySelector("#kp-planeta"), sol = cont.querySelector("#kp-sol"), orbita = cont.querySelector("#kp-orbita"), area = cont.querySelector("#kp-area"), txt = cont.querySelector("#kp-txt");
      var rango = cont.querySelector("#kp-rango");
      var theta = 0;
      var cola = [];
      rango.addEventListener("input", function () { cont.querySelector("#kp-val").textContent = nf(+rango.value / 100, 2); });
      animar(cont, function (dt) {
        var e = +rango.value / 100;
        var a = 200, b = a * Math.sqrt(1 - e * e);
        var c = a * e;
        orbita.setAttribute("ry", b);
        sol.setAttribute("cx", 280 + c);
        var r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
        var velocidad = 2.4 / (r * r / (a * a));
        theta += velocidad * dt * 0.8;
        var px = 280 + c + r * Math.cos(theta);
        var py = 130 + r * Math.sin(theta) * (b / a) / Math.sqrt(1 - Math.pow(e * Math.cos(theta) / (1 + 0.0001), 2) || 1);
        px = 280 + a * Math.cos(theta) ;
        py = 130 + b * Math.sin(theta);
        planeta.setAttribute("cx", px);
        planeta.setAttribute("cy", py);
        cola.push(theta);
        if (cola.length > 26) cola.shift();
        var sx = 280 + c;
        var d = "M " + sx + " 130 ";
        cola.forEach(function (t2) {
          d += "L " + (280 + a * Math.cos(t2)) + " " + (130 + b * Math.sin(t2)) + " ";
        });
        d += "Z";
        area.setAttribute("d", d);
        var cerca = Math.hypot(px - sx, py - 130) < a * 0.75;
        txt.textContent = cerca ? "Cerca del Sol: el planeta ACELERA para barrer la misma área" : "Lejos del Sol: se arrastra — misma área, más radio";
      });
    }
    registrar({ id: "sim-kepler", icono: "🪐", titulo: "El vals de las elipses", ley: "kepler", resumen: "Pon un planeta en órbita y mira cómo barre áreas iguales.", render: render });
  })();

  /* ---------- Péndulo de Galileo ---------- */
  (function () {
    function render(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Longitud de la cuerda: <strong id="pn-l">1,0</strong> m</label>' +
        '<input type="range" id="pn-rl" min="4" max="25" value="10">' +
        '<label>Masa: <strong id="pn-m">1</strong> kg</label>' +
        '<input type="range" id="pn-rm" min="1" max="10" value="1">' +
        "</div>" +
        '<div class="lienzo-sim"><svg viewBox="0 0 560 250" style="width:100%">' +
        '<rect x="230" y="8" width="100" height="6" fill="var(--tinta-suave)"/>' +
        '<line id="pn-cuerda" x1="280" y1="14" x2="280" y2="200" stroke="var(--tinta-suave)" stroke-width="2"/>' +
        '<circle id="pn-bola" cx="280" cy="200" r="12" fill="var(--fis)"/>' +
        '<text id="pn-txt" x="280" y="240" text-anchor="middle" font-size="13" font-weight="700" fill="var(--tinta)"></text>' +
        "</svg></div>" +
        '<p class="nota-sim">Cambia la masa: el periodo NO se inmuta. Cambia la longitud: el ritmo cambia con su raíz cuadrada (T = 2π√(L/g)). Galileo lo cronometró con su propio pulso mirando una lámpara oscilar; tres siglos de relojes salieron de ahí.</p>';
      var cuerda = cont.querySelector("#pn-cuerda"), bola = cont.querySelector("#pn-bola"), txt = cont.querySelector("#pn-txt");
      var rl = cont.querySelector("#pn-rl"), rm = cont.querySelector("#pn-rm");
      var ang = 0.5, vel = 0;
      rl.addEventListener("input", function () { cont.querySelector("#pn-l").textContent = nf(+rl.value / 10, 1); });
      rm.addEventListener("input", function () { cont.querySelector("#pn-m").textContent = rm.value; });
      animar(cont, function (dt) {
        var L = +rl.value / 10;
        var g = 9.8;
        vel += (-(g / L) * Math.sin(ang)) * dt * 3;
        ang += vel * dt * 3;
        var px = 280 + Math.sin(ang) * L * 78;
        var py = 14 + Math.cos(ang) * L * 78;
        cuerda.setAttribute("x2", px);
        cuerda.setAttribute("y2", py);
        bola.setAttribute("cx", px);
        bola.setAttribute("cy", py);
        bola.setAttribute("r", 8 + (+rm.value) * 1.2);
        txt.textContent = "Periodo: " + nf(2 * Math.PI * Math.sqrt(L / g), 2) + " s — la masa de " + rm.value + " kg no pinta nada";
      });
    }
    registrar({ id: "sim-pendulo", icono: "🕰️", titulo: "El vaivén imperturbable", ley: "pendulo", resumen: "Cuelga masas distintas y comprueba quién manda de verdad: la longitud.", render: render });
  })();

})();
