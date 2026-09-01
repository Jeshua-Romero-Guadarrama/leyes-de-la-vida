/* ==========================================================================
   Leyes de la Vida — Interactivos adicionales II
   Autor: Jeshua Romero Guadarrama
   Interactivos de sociología, gestión, estadística y medicina.
   ========================================================================== */

(function () {
  "use strict";

  var U = window.UTILSIM;
  var nf = U.nf, graficoLineas = U.graficoLineas, barajar = U.barajar;
  var simCurva = U.simCurva, simAdivina = U.simAdivina, registrar = U.registrar;
  var azar = Math.random;

  /* ======================= SOCIOLOGÍA Y COMUNICACIÓN ======================= */

  registrar({
    id: "sim-campbell", icono: "🏫", titulo: "Enseñar para el examen", ley: "campbell",
    resumen: "Ata sueldos a una prueba estandarizada y mira qué le pasa a la educación.",
    render: simCurva({
      controles: [{ id: "p", etiqueta: "Peso del examen en sueldos y rankings", min: 0, max: 100, valor: 0, fmt: function (v) { return v + "%"; } }],
      grafico: function (v) {
        var nota = [], real = [];
        for (var t = 0; t <= 10; t++) {
          nota.push({ x: t, y: Math.min(100, 55 + t * 1.2 + t * (v.p / 100) * 4.2) });
          real.push({ x: t, y: Math.max(15, 55 + t * 1.2 - t * (v.p / 100) * 4.5) });
        }
        return {
          series: [
            { nombre: "Nota media del examen", color: "var(--tec)", puntos: nota },
            { nombre: "Aprendizaje real", color: "var(--est)", puntos: real }
          ], xMax: 10, yMax: 105, xEtiq: "Cursos escolares", yEtiq: "Índice",
          marcas: []
        };
      },
      nota: function (v) {
        return v.p < 20 ? "El examen solo informa: mide razonablemente bien." :
          v.p < 60 ? "Las clases empiezan a entrenar el examen: la nota sube más que el saber." :
            "🚨 Currículo reducido al examen, trampas, exclusión de alumnos flojos: el indicador corrompió el proceso que medía.";
      },
      pie: "La versión sociológica de Goodhart, formulada por Campbell sobre políticas públicas: el indicador no solo se falsea, deforma la actividad real."
    })
  });

  registrar({
    id: "sim-michels", icono: "👑", titulo: "De asamblea a cúpula", ley: "michels",
    resumen: "Deja madurar una organización horizontal y mira formarse su oligarquía.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años de vida de la organización", min: 0, max: 30, valor: 5 }],
      grafico: function (v) {
        var cupula = [], bases = [];
        for (var t = 0; t <= 30; t++) {
          var c = 15 + 75 * (1 - Math.exp(-t / 9));
          cupula.push({ x: t, y: c });
          bases.push({ x: t, y: 100 - c });
        }
        function fc(t) { return 15 + 75 * (1 - Math.exp(-t / 9)); }
        return {
          series: [
            { nombre: "Decisiones tomadas por la cúpula", color: "var(--soc)", puntos: cupula },
            { nombre: "Decisiones tomadas por las bases", color: "var(--est)", puntos: bases }
          ], xMax: 30, yMax: 100, xEtiq: "Años", yEtiq: "% de las decisiones",
          marcas: [{ x: v.t, y: fc(v.t) }]
        };
      },
      nota: function (v) {
        return v.t < 5 ? "Asamblea joven: todo se vota, nadie manda." :
          v.t < 15 ? "La organización exige delegar: los delegados acumulan información, contactos y aparato." :
            "«Quien dice organización, dice oligarquía»: los de siempre controlan agenda, fondos y ascensos.";
      },
      pie: "Michels lo demostró estudiando los partidos más igualitarios de su época. La profesionalización necesaria para funcionar es la misma que concentra el poder."
    })
  });

  (function () {
    function renderDuverger(cont) {
      var estado;
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<select id="dv-sistema"><option value="fptp">Mayoría simple a una vuelta</option><option value="pr">Representación proporcional</option></select>' +
        '<button class="boton-sim" id="dv-eleccion">🗳️ Celebrar elección</button>' +
        '<button class="boton-sim secundario" id="dv-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="dv-lienzo"></div>' +
        '<p class="marcador" id="dv-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Tres partidos parten con 40-35-25. Con mayoría simple, votar al tercero es «tirar el voto»: elección tras elección, sus votantes se refugian en los dos grandes. Con proporcional, el tercero sobrevive. Esa es la ley de Duverger.</p>';
      function reiniciar() {
        estado = { votos: [40, 35, 25], elecciones: 0 };
        pintar();
      }
      function eleccion() {
        var sistema = cont.querySelector("#dv-sistema").value;
        estado.elecciones++;
        if (sistema === "fptp") {
          var fuga = estado.votos[2] * 0.35;
          estado.votos[2] -= fuga;
          estado.votos[0] += fuga * 0.55;
          estado.votos[1] += fuga * 0.45;
        } else {
          for (var i = 0; i < 3; i++) estado.votos[i] += (azar() - 0.5) * 3;
          var suma = estado.votos[0] + estado.votos[1] + estado.votos[2];
          for (var j = 0; j < 3; j++) estado.votos[j] = (estado.votos[j] / suma) * 100;
        }
        pintar();
      }
      function pintar() {
        var NOMBRES = ["Partido A", "Partido B", "Partido C"], COLORES = ["var(--tec)", "var(--soc)", "var(--est)"];
        var s = '<svg viewBox="0 0 560 190" style="width:100%;max-width:560px;margin:0 auto">';
        estado.votos.forEach(function (v, i) {
          var h = (v / 60) * 130;
          s += '<rect x="' + (90 + i * 150) + '" y="' + (160 - h) + '" width="90" height="' + h + '" rx="8" fill="' + COLORES[i] + '"/>';
          s += '<text x="' + (135 + i * 150) + '" y="' + (150 - h) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--tinta)">' + nf(v, 1) + "%</text>";
          s += '<text x="' + (135 + i * 150) + '" y="180" text-anchor="middle" font-size="12" fill="var(--tinta-suave)">' + NOMBRES[i] + "</text>";
        });
        s += "</svg>";
        cont.querySelector("#dv-lienzo").innerHTML = s;
        cont.querySelector("#dv-nota").innerHTML = "Elecciones celebradas: <strong>" + estado.elecciones + "</strong>" +
          (estado.votos[2] < 5 ? " — el tercer partido ha desaparecido: bipartidismo consumado." :
            estado.votos[2] < 15 ? " — el «voto útil» está vaciando al tercero." : "");
      }
      cont.querySelector("#dv-eleccion").addEventListener("click", eleccion);
      cont.querySelector("#dv-reset").addEventListener("click", reiniciar);
      cont.querySelector("#dv-sistema").addEventListener("change", reiniciar);
      reiniciar();
    }
    registrar({
      id: "sim-duverger", icono: "🗳️", titulo: "El voto útil", ley: "duverger",
      resumen: "Celebra elecciones con dos sistemas y mira nacer (o no) el bipartidismo.", render: renderDuverger
    });
  })();

  (function () {
    function renderGodwin(cont) {
      var estado;
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="gw-mas">💬 Añadir 10 comentarios</button>' +
        '<button class="boton-sim secundario" id="gw-reset">Nuevo hilo</button>' +
        "</div>" +
        '<div class="lienzo-sim">' +
        '<p style="margin:0 0 8px">Tema del hilo: <em>«Normas para el carril bici»</em> · Comentarios: <strong id="gw-n">0</strong></p>' +
        '<p style="margin:0 0 6px">Probabilidad acumulada de comparación nazi:</p>' +
        '<div style="height:22px;border-radius:999px;background:var(--superficie);border:1px solid var(--borde);overflow:hidden"><div id="gw-barra" style="height:100%;width:0%;background:var(--soc);transition:width 200ms"></div></div>' +
        '<p class="marcador" id="gw-msj" style="margin-top:10px">El hilo empieza civilizado.</p>' +
        "</div>" +
        '<p class="nota-sim">Cada comentario tiene una probabilidad pequeña de invocar a Hitler; a medida que el hilo crece, la probabilidad acumulada tiende a 1. Por convención, quien hace la comparación pierde el debate y el hilo muere.</p>';
      function reiniciar() {
        estado = { n: 0, muerto: false };
        cont.querySelector("#gw-n").textContent = "0";
        cont.querySelector("#gw-barra").style.width = "0%";
        cont.querySelector("#gw-msj").innerHTML = "El hilo empieza civilizado.";
        cont.querySelector("#gw-mas").disabled = false;
      }
      cont.querySelector("#gw-mas").addEventListener("click", function () {
        if (estado.muerto) return;
        for (var i = 0; i < 10 && !estado.muerto; i++) {
          estado.n++;
          if (azar() < 0.012) estado.muerto = true;
        }
        var p = (1 - Math.pow(1 - 0.012, estado.n)) * 100;
        cont.querySelector("#gw-n").textContent = estado.n;
        cont.querySelector("#gw-barra").style.width = nf(p, 0) + "%";
        if (estado.muerto) {
          cont.querySelector("#gw-msj").innerHTML = '☠️ Comentario ' + estado.n + ': <em>«Esto es literalmente lo que hacían los nazis»</em>. <strong>El hilo ha muerto.</strong> Ley de Godwin cumplida.';
          cont.querySelector("#gw-mas").disabled = true;
        } else {
          cont.querySelector("#gw-msj").innerHTML = estado.n > 60 ? "El tono se agria: mayúsculas, hombres de paja, alusiones personales..." :
            estado.n > 30 ? "Aparecen los primeros reproches fuera de tema." : "Debate razonable... de momento (p acumulada: " + nf(p, 0) + "%).";
        }
      });
      cont.querySelector("#gw-reset").addEventListener("click", reiniciar);
      reiniciar();
    }
    registrar({
      id: "sim-godwin", icono: "☠️", titulo: "El hilo que muere", ley: "godwin",
      resumen: "Alarga una discusión de internet y cronometra la llegada inevitable.", render: renderGodwin
    });
  })();

  (function () {
    var CITAS = [
      "Las palomas de las plazas son drones del gobierno: fíjate en que nunca ves crías.",
      "La Tierra es plana solo los martes; el resto de la semana la NASA la infla.",
      "Los microondas leen tus pensamientos mientras calientan la sopa; por eso giran el plato.",
      "El brócoli es una conspiración de los dentistas para que mastiquemos más.",
      "Las nubes son generadas por servidores; por eso lo llaman «la nube».",
      "Los espejos guardan una copia de todo lo que reflejan: no vendas nunca un espejo viejo."
    ];
    function renderPoe(cont) {
      var indice = 0, aciertos = 0, orden = [];
      function empezar() {
        orden = barajar(CITAS.slice());
        indice = 0; aciertos = 0;
        ronda();
      }
      function ronda() {
        var esParodia = azar() < 0.5;
        cont.innerHTML =
          '<p class="contexto-quiz">Cita ' + (indice + 1) + " de " + orden.length + " · Aciertos: " + aciertos + "</p>" +
          '<p class="pregunta-quiz">¿Parodia o lo dice en serio?</p>' +
          '<blockquote style="border-left:4px solid var(--soc);background:var(--superficie-2);padding:12px 16px;border-radius:0 8px 8px 0">«' + orden[indice] + "»</blockquote>" +
          '<div class="opciones-quiz">' +
          '<button class="opcion-quiz" data-r="parodia">🎭 Es una parodia</button>' +
          '<button class="opcion-quiz" data-r="serio">😐 Lo dice convencido</button>' +
          "</div><div id=\"po-retro\"></div>" +
          '<div class="pie-quiz"><span></span><button class="boton-sim" id="po-sig" hidden>Siguiente →</button></div>';
        cont.querySelectorAll(".opcion-quiz").forEach(function (b) {
          b.addEventListener("click", function () {
            var eligeParodia = b.getAttribute("data-r") === "parodia";
            var acierto = eligeParodia === esParodia;
            if (acierto) aciertos++;
            b.classList.add(acierto ? "correcta" : "incorrecta");
            cont.querySelectorAll(".opcion-quiz").forEach(function (x) { x.disabled = true; });
            cont.querySelector("#po-retro").innerHTML = '<div class="retro-quiz">La escribió ' +
              (esParodia ? "un <strong>satírico</strong> riéndose" : "alguien <strong>convencido</strong>") +
              "... pero fíjate: <em>nada en el texto podía decírtelo</em>. Esa es exactamente la ley de Poe.</div>";
            cont.querySelector("#po-sig").hidden = false;
          });
        });
        cont.querySelector("#po-sig").addEventListener("click", function () {
          indice++;
          if (indice < orden.length) ronda(); else fin();
        });
      }
      function fin() {
        cont.innerHTML = '<div class="resultado-final"><span class="nota">' + aciertos + "/" + orden.length + "</span>" +
          "<p>Tu puntuación ronda el 50%... como lanzar una moneda. Sin un guiño explícito, la parodia del disparate y el disparate sincero son <strong>indistinguibles</strong>: acabas de demostrar la ley de Poe.</p>" +
          '<button class="boton-sim" id="po-otra">Jugar de nuevo</button></div>';
        cont.querySelector("#po-otra").addEventListener("click", empezar);
      }
      empezar();
    }
    registrar({
      id: "sim-poe", icono: "🎭", titulo: "¿Parodia o en serio?", ley: "poe",
      resumen: "Intenta distinguir sátira de convicción. Alerta: no se puede.", render: renderPoe
    });
  })();

  (function () {
    function renderCunningham(cont) {
      cont.innerHTML =
        '<div class="fila-controles"><button class="boton-sim" id="cu-publicar">📤 Publicar en ambos foros</button><button class="boton-sim secundario" id="cu-reset">Reiniciar</button></div>' +
        '<div class="lienzo-sim" style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
        '<div><p style="margin:0 0 6px"><strong>Foro 1: preguntas</strong></p><div id="cu-preg" style="min-height:130px;font-size:0.88rem;color:var(--tinta-suave)"></div></div>' +
        '<div><p style="margin:0 0 6px"><strong>Foro 2: afirmaciones erróneas</strong></p><div id="cu-err" style="min-height:130px;font-size:0.88rem;color:var(--tinta-suave)"></div></div>' +
        "</div>" +
        '<p class="nota-sim">La misma duda, dos estrategias: preguntar con educación o afirmar el error con aplomo. Corregir motiva más que ayudar: la mejor forma de obtener la respuesta correcta en internet no es preguntar, es publicar la respuesta incorrecta.</p>';
      var temporizadores = [];
      function limpiar() { temporizadores.forEach(clearTimeout); temporizadores = []; }
      function reiniciar() {
        limpiar();
        cont.querySelector("#cu-preg").innerHTML = "";
        cont.querySelector("#cu-err").innerHTML = "";
      }
      cont.querySelector("#cu-publicar").addEventListener("click", function () {
        reiniciar();
        var preg = cont.querySelector("#cu-preg"), err = cont.querySelector("#cu-err");
        preg.innerHTML = "<p>🙋 «¿Alguien sabe configurar el servidor Deimos en Linux?»</p>";
        err.innerHTML = "<p>😤 «El servidor Deimos NO se puede configurar en Linux, punto.»</p>";
        var RESPUESTAS = [
          "🤓 «Falso. Se configura editando /etc/deimos.conf, mira:...»",
          "😠 «Incorrecto. Lo hice ayer mismo. Pasos: 1)...»",
          "🧐 «No puedo creer que esto tenga votos. La documentación dice claramente...»",
          "⌨️ «Aquí tienes hasta un script que lo automatiza:»"
        ];
        RESPUESTAS.forEach(function (r, i) {
          temporizadores.push(setTimeout(function () {
            err.innerHTML += "<p>" + r + "</p>";
          }, 900 + i * 900));
        });
        temporizadores.push(setTimeout(function () {
          preg.innerHTML += '<p style="color:var(--tinta-tenue)">🦗 (silencio... 0 respuestas)</p>';
        }, 2200));
        temporizadores.push(setTimeout(function () {
          err.innerHTML += '<p class="marcador" style="color:var(--ok)">✔ 4 respuestas correctas y detalladas en minutos.</p>';
        }, 900 + RESPUESTAS.length * 900));
      });
      cont.querySelector("#cu-reset").addEventListener("click", reiniciar);
    }
    registrar({
      id: "sim-cunningham", icono: "😤", titulo: "El error como cebo", ley: "cunningham",
      resumen: "Publica una pregunta y un error, y compara quién recibe respuestas.", render: renderCunningham
    });
  })();

  registrar({
    id: "sim-brandolini", icono: "🔥", titulo: "La asimetría del bulo", ley: "brandolini",
    resumen: "Compara la energía de fabricar un bulo con la de desmontarlo.",
    render: simCurva({
      controles: [{ id: "w", etiqueta: "Tamaño del bulo", min: 5, max: 50, valor: 10, fmt: function (v) { return v + " palabras"; } }],
      grafico: function (v) {
        var crear = v.w, refutar = v.w * 12;
        var W = 560, H = 190;
        var maxE = 50 * 12;
        function ancho(e) { return (e / maxE) * (W - 200); }
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<text x="10" y="45" font-size="12" fill="var(--tinta)">Crear el bulo</text>';
        s += '<rect x="150" y="30" width="' + Math.max(ancho(crear), 4) + '" height="24" rx="6" fill="var(--soc)"/>';
        s += '<text x="' + (156 + ancho(crear)) + '" y="47" font-size="12" font-weight="700" fill="var(--tinta)">' + crear + " min</text>";
        s += '<text x="10" y="105" font-size="12" fill="var(--tinta)">Refutarlo bien</text>';
        s += '<rect x="150" y="90" width="' + ancho(refutar) + '" height="24" rx="6" fill="var(--est)"/>';
        s += '<text x="' + (156 + ancho(refutar)) + '" y="107" font-size="12" font-weight="700" fill="var(--tinta)">' + refutar + " min</text>";
        s += '<text x="10" y="165" font-size="12" fill="var(--tinta)">Alcance típico</text>';
        s += '<text x="150" y="165" font-size="12" fill="var(--soc)">bulo: 100 000 personas</text>';
        s += '<text x="340" y="165" font-size="12" fill="var(--est)">desmentido: 800 personas</text>';
        s += "</svg>";
        return s;
      },
      nota: function (v) {
        return "Orden de magnitud: refutar cuesta <strong>~10 veces más</strong> que inventar, y llega tarde y a menos gente. Por eso la verificación nunca da abasto.";
      },
      pie: "Inventar es gratis; desmontar exige documentarse, citar y redactar. Esta asimetría estructural es el viento de cola de toda desinformación."
    })
  });

  registrar({
    id: "sim-betteridge", icono: "📰", titulo: "Responde al titular", ley: "betteridge",
    resumen: "Seis titulares con interrogación: tú solo di sí o no.",
    render: simAdivina({
      preguntas: [
        { texto: "«¿Es este el fin del dinero en efectivo?»", opciones: [{ t: "Sí" }, { t: "No", ok: true }], retro: "Si el periodista tuviera pruebas del sí, el titular sería «El efectivo se acaba»." },
        { texto: "«¿Ha encontrado la NASA vida extraterrestre?»", opciones: [{ t: "Sí" }, { t: "No", ok: true }], retro: "Semejante hallazgo jamás se anunciaría con un interrogante." },
        { texto: "«¿Cura el café el cáncer?»", opciones: [{ t: "Sí" }, { t: "No", ok: true }], retro: "La pregunta permite publicar una especulación jugosa sin comprometerse." },
        { texto: "«¿Es tu vecino un espía?»", opciones: [{ t: "Sí" }, { t: "No", ok: true }], retro: "Especulación pura: el interrogante es el paraguas legal del titular." },
        { texto: "«¿Serán los robots tus jefes en 2030?»", opciones: [{ t: "Sí" }, { t: "No", ok: true }], retro: "Futurología sin pruebas: no." },
        { texto: "«¿Debería preocuparte el nuevo virus del que nadie habla?»", opciones: [{ t: "Sí" }, { t: "No", ok: true }], retro: "Si nadie habla de él, ya tienes la pista. La ley no es infalible, pero acierta asombrosamente." }
      ],
      fijo: true,
      final: function (a, n) {
        return a === n ? "Pleno: todo titular que termina en interrogación puede responderse con un «no». Ya piensas como Betteridge." :
          "Recuerda el truco: cuando hay pruebas del sí, el titular afirma; cuando no las hay, pregunta.";
      }
    })
  });

  registrar({
    id: "sim-sayre", icono: "🥊", titulo: "Peleas de bajo riesgo", ley: "sayre",
    resumen: "Ajusta lo que está en juego y mira arder (o calmarse) la disputa.",
    render: simCurva({
      controles: [{ id: "j", etiqueta: "Lo que está en juego", min: 1, max: 100, valor: 10, fmt: function (v) { return v < 15 ? "casi nada" : v < 50 ? "algo serio" : "muchísimo"; } }],
      grafico: function (v) {
        var pts = [];
        for (var x = 1; x <= 100; x++) pts.push({ x: x, y: 100 / Math.pow(x, 0.55) });
        return {
          series: [{ nombre: "Intensidad de las emociones", color: "var(--soc)", puntos: pts }],
          xMax: 100, yMax: 105, xEtiq: "Importancia real del asunto", yEtiq: "Ferocidad de la disputa",
          marcas: [{ x: v.j, y: 100 / Math.pow(v.j, 0.55) }]
        };
      },
      nota: function (v) {
        return v.j < 15 ? "🔥 Guerra total por el color de los buzones: sin consecuencias, la pelea es identitaria — puro estatus y orgullo." :
          v.j < 50 ? "Debate acalorado pero con límites: las consecuencias imponen cierta prudencia." :
            "🧊 Millones en juego: negociación fría, abogados, silencio. Las pasiones se las guardan.";
      },
      pie: "«Las disputas académicas son tan feroces precisamente porque hay tan poco en juego»: cuando no importan las consecuencias, se pelea por la identidad."
    })
  });

  registrar({
    id: "sim-hanlon", icono: "🔪", titulo: "¿Maldad o torpeza?", ley: "hanlon",
    resumen: "Cinco agravios cotidianos: diagnostica antes de ofenderte.",
    render: simAdivina({
      preguntas: [
        { texto: "Tu compañero no te copió en el correo clave del proyecto.", opciones: [{ t: "🗡️ Maniobra para apartarte" }, { t: "🤦 Se le olvidó, iba con prisa", ok: true }], retro: "El descuido es cientos de veces más frecuente que la conspiración. Pregunta antes de rumiar." },
        { texto: "El camarero lleva 20 minutos sin traerte el plato... y a la mesa de al lado ya le sirvió.", opciones: [{ t: "🗡️ Te tiene manía" }, { t: "🤦 Cocina desbordada y comandas cruzadas", ok: true }], retro: "Tú eres protagonista de tu película, no de la suya: nadie te está castigando." },
        { texto: "Tu jefe programó la reunión importante justo el día de tus vacaciones.", opciones: [{ t: "🗡️ Quiere decidir sin ti" }, { t: "🤦 Ni miró el calendario compartido", ok: true }], retro: "La agenda ajena es invisible para casi todo el mundo. Avísale: casi seguro la mueve." },
        { texto: "La aplicación del banco borró tu configuración con la actualización.", opciones: [{ t: "🗡️ Quieren obligarte a llamar y venderte algo" }, { t: "🤦 Error de programación banal", ok: true }], retro: "Los errores de software superan en número a los planes maquiavélicos en una proporción astronómica." },
        { texto: "El mismo proveedor «se equivoca» en la factura por cuarta vez este año... siempre a su favor.", opciones: [{ t: "🗡️ Esto ya no es torpeza", ok: true }, { t: "🤦 Otra casualidad más" }], retro: "El corolario prudente de Hanlon: cuando la «torpeza» se repite siempre en beneficio del mismo, deja de ser torpeza." }
      ],
      final: function (a, n) {
        return "Nunca atribuyas a la maldad lo que explica la torpeza... y mantén un ojo abierto para la excepción sistemática.";
      }
    })
  });

  registrar({
    id: "sim-occam", icono: "🪒", titulo: "Afeitando hipótesis", ley: "occam",
    resumen: "Ante cada misterio, elige la explicación con menos supuestos.",
    render: simAdivina({
      preguntas: [
        {
          texto: "Las luces de tu casa no encienden.", opciones: [
            { t: "Se fue la luz en el edificio <em>(1 supuesto)</em>", ok: true },
            { t: "Un apagón selectivo dirigido contra ti <em>(4 supuestos)</em>" },
            { t: "Todas las bombillas se fundieron a la vez <em>(12 supuestos)</em>" }
          ], retro: "Con igual poder explicativo, gana la hipótesis que menos entidades exige. Casi siempre acierta."
        },
        {
          texto: "Tu amigo no contesta desde ayer.", opciones: [
            { t: "Está liado o sin batería <em>(1 supuesto)</em>", ok: true },
            { t: "Está enfadado por algo que dijiste hace un mes <em>(3 supuestos)</em>" },
            { t: "Le clonaron el teléfono y no le llegan tus mensajes <em>(6 supuestos)</em>" }
          ], retro: "La explicación aburrida es la favorita estadística. La navaja no garantiza: solo apuesta bien."
        },
        {
          texto: "Faltan 20 € de tu cartera.", opciones: [
            { t: "Los gastaste y no lo recuerdas <em>(1 supuesto)</em>", ok: true },
            { t: "Alguien de casa los tomó prestados en secreto <em>(2 supuestos)</em>" },
            { t: "Un carterista con llave maestra entró solo a por 20 € <em>(7 supuestos)</em>" }
          ], retro: "Cada supuesto extra multiplica las maneras de estar equivocado."
        },
        {
          texto: "El paciente presenta fiebre, tos y mocos en enero.", opciones: [
            { t: "Un virus respiratorio común <em>(1 supuesto)</em>", ok: true },
            { t: "Una enfermedad tropical rarísima sin haber viajado <em>(5 supuestos)</em>" },
            { t: "Dos enfermedades exóticas simultáneas <em>(8 supuestos)</em>" }
          ], retro: "«Cuando oigas cascos, piensa en caballos, no en cebras.» (Aunque a veces son cebras: mira la máxima de Hickam.)"
        }
      ],
      final: function () { return "No multipliques entidades sin necesidad: la explicación más simple no siempre es la verdadera, pero es la mejor apuesta inicial."; }
    })
  });

  (function () {
    var FENOMENOS = {
      peste: ["La peste", "Castigo divino por los pecados de la ciudad.", "Desequilibrio de humores y «miasmas» que corrompen el aire.", "Bacteria <em>Yersinia pestis</em> transmitida por pulgas: verificable y tratable."],
      rayo: ["El rayo", "Ira de Zeus (o del dios de turno) arrojada desde el cielo.", "Fuego «etéreo» que busca su lugar natural en la tierra.", "Descarga electrostática medible; se domestica con un pararrayos."],
      cosecha: ["La mala cosecha", "Los dioses están ofendidos: hay que sacrificar.", "La tierra está «cansada» y su esencia fértil, agotada.", "Nitrógeno agotado y plagas: rotación de cultivos y fertilizantes."]
    };
    function renderComte(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="chip activo" data-f="peste">La peste</button>' +
        '<button class="chip" data-f="rayo">El rayo</button>' +
        '<button class="chip" data-f="cosecha">La mala cosecha</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="co-lienzo" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px"></div>' +
        '<p class="nota-sim">Para Comte, cada rama del saber recorre tres estadios: teológico (voluntades), metafísico (esencias) y positivo (leyes verificables). Elige un fenómeno y compara sus tres explicaciones históricas.</p>';
      function pintar(clave) {
        var f = FENOMENOS[clave];
        var ETAPAS = ["1º Teológico", "2º Metafísico", "3º Positivo"];
        var COLORES = ["var(--soc)", "var(--ges)", "var(--est)"];
        cont.querySelector("#co-lienzo").innerHTML = f.slice(1).map(function (texto, i) {
          return '<div style="border-top:4px solid ' + COLORES[i] + ';background:var(--superficie);border-radius:8px;padding:12px">' +
            '<p style="margin:0 0 6px;font-weight:700;color:' + COLORES[i] + '">' + ETAPAS[i] + "</p>" +
            '<p style="margin:0;font-size:0.9rem;color:var(--tinta-suave)">' + texto + "</p></div>";
        }).join("");
      }
      cont.querySelectorAll(".chip[data-f]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          cont.querySelectorAll(".chip[data-f]").forEach(function (o) { o.classList.remove("activo"); });
          ch.classList.add("activo");
          pintar(ch.getAttribute("data-f"));
        });
      });
      pintar("peste");
    }
    registrar({
      id: "sim-comte", icono: "🏛️", titulo: "Tres maneras de explicar", ley: "tres-estadios",
      resumen: "El mismo fenómeno contado por el sacerdote, el metafísico y el científico.", render: renderComte
    });
  })();

  (function () {
    function renderDunbar(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Contactos en tu red social: <strong id="du-val">300</strong></label>' +
        '<input type="range" id="du-rango" min="5" max="3000" step="5" value="300">' +
        "</div>" +
        '<div class="lienzo-sim" id="du-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="du-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Los anillos de Dunbar: ~5 íntimos, ~15 cercanos, ~50 amigos, ~150 relaciones reales. Todo lo que exceda 150 son conocidos sin relación mantenida: el neocórtex no da para más, tengas los seguidores que tengas.</p>';
      var rango = cont.querySelector("#du-rango");
      function pintar() {
        var n = +rango.value;
        cont.querySelector("#du-val").textContent = nf(n, 0);
        var ANILLOS = [
          [5, "íntimos", "var(--med)"],
          [15, "cercanos", "var(--ges)"],
          [50, "amigos", "var(--est)"],
          [150, "relaciones reales", "var(--tec)"]
        ];
        var extra = Math.max(0, n - 150);
        var rExtra = 88 + Math.min(60, Math.sqrt(extra) * 1.4);
        var s = '<svg viewBox="0 0 460 320" style="max-width:460px;margin:0 auto">';
        if (extra > 0) {
          s += '<circle cx="230" cy="160" r="' + rExtra + '" fill="var(--borde)" opacity="0.5"/>';
          s += '<text x="230" y="' + (160 - rExtra + 16) + '" text-anchor="middle" font-size="11" fill="var(--tinta-tenue)">' + nf(extra, 0) + " conocidos sin relación real</text>";
        }
        ANILLOS.slice().reverse().forEach(function (an, idx) {
          var r = [88, 66, 42, 20][idx];
          var lleno = Math.min(n, an[0]);
          s += '<circle cx="230" cy="160" r="' + r + '" fill="' + an[2] + '" opacity="' + (0.25 + 0.5 * (lleno / an[0])) + '"/>';
        });
        s += '<text x="230" y="165" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">tú</text>';
        var ly = 300;
        var lx = 20;
        ANILLOS.forEach(function (an) {
          s += '<rect x="' + lx + '" y="' + (ly - 9) + '" width="10" height="10" rx="3" fill="' + an[2] + '"/><text x="' + (lx + 14) + '" y="' + ly + '" font-size="11" fill="var(--tinta-suave)">' + an[0] + " " + an[1] + "</text>";
          lx += 14 + (String(an[0]).length + an[1].length) * 6.4 + 18;
        });
        s += "</svg>";
        cont.querySelector("#du-lienzo").innerHTML = s;
        cont.querySelector("#du-nota").innerHTML = n <= 150 ?
          "Tus " + nf(n, 0) + " contactos caben dentro del límite cognitivo: relaciones con historia y confianza." :
          "De tus " + nf(n, 0) + " contactos, unas <strong>150</strong> son relaciones reales; el resto (" + nf(extra, 0) + ") son nombres con avatar.";
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-dunbar", icono: "⭕", titulo: "Los anillos de la amistad", ley: "dunbar",
      resumen: "Infla tu lista de contactos y mira cuántas relaciones reales caben.", render: renderDunbar
    });
  })();

  /* ======================= GESTIÓN Y ORGANIZACIONES ======================= */

  (function () {
    function renderTrivialidad(cont) {
      cont.innerHTML =
        '<div class="fila-controles"><button class="boton-sim" id="tr-sim">📋 Simular la reunión del comité</button></div>' +
        '<div class="lienzo-sim" id="tr-lienzo"><p style="margin:0;color:var(--tinta-tenue)">Orden del día: tres puntos, una hora.</p></div>' +
        '<p class="nota-sim">El comité aprueba en minutos el reactor (nadie lo entiende, nadie osa opinar) y debate una eternidad el cobertizo y el café (todos tienen opinión sobre cobertizos y café). El tiempo dedicado es inversamente proporcional a la importancia.</p>';
      cont.querySelector("#tr-sim").addEventListener("click", function () {
        var puntos = [
          { nombre: "☢️ Reactor nuclear", coste: "10 000 000 €", min: 2 + Math.floor(azar() * 3), frase: "«Confiemos en los técnicos.» Aprobado." },
          { nombre: "🚲 Cobertizo para bicis", coste: "3 500 €", min: 35 + Math.floor(azar() * 12), frase: "¿Chapa o aluminio? ¿Verde o gris? Se crea una subcomisión." },
          { nombre: "☕ Café de las reuniones", coste: "120 €", min: 55 + Math.floor(azar() * 15), frase: "Debate encarnizado sobre cápsulas, ética y descafeinado. Sin acuerdo." }
        ];
        var maxMin = 70;
        cont.querySelector("#tr-lienzo").innerHTML =
          '<table class="tabla-sim"><thead><tr><th>Punto</th><th>Coste</th><th>Debate</th></tr></thead><tbody>' +
          puntos.map(function (p) {
            return "<tr><td>" + p.nombre + "</td><td>" + p.coste + "</td><td><div style='background:var(--soc);height:14px;border-radius:7px;width:" + nf((p.min / maxMin) * 100, 0) + "%;min-width:6px'></div><span style='font-size:0.82rem'>" + p.min + " min — <em>" + p.frase + "</em></span></td></tr>";
          }).join("") + "</tbody></table>";
      });
    }
    registrar({
      id: "sim-trivialidad", icono: "🚲", titulo: "El comité y el cobertizo", ley: "trivialidad",
      resumen: "Simula una reunión: a menor importancia, mayor debate.", render: renderTrivialidad
    });
  })();

  (function () {
    function renderPeter(cont) {
      var estado;
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="pe-ascender">⬆️ Ascender a los mejores</button>' +
        '<button class="boton-sim secundario" id="pe-reset">Reiniciar la empresa</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="pe-lienzo"></div>' +
        '<p class="marcador" id="pe-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Cada ronda asciende a quienes destacan en su puesto actual... a un puesto distinto que quizá no dominan. Quien rinde mal ya no asciende: se queda. Mira cómo cada nivel se va llenando de gente en su nivel de incompetencia.</p>';
      function reiniciar() {
        estado = { niveles: [92, 78, 65], rondas: 0 };
        pintar();
      }
      function pintar() {
        var NOMBRES = ["Dirección", "Mandos intermedios", "Base"];
        var ANCHOS = [180, 320, 460];
        var datos = [estado.niveles[2], estado.niveles[1], estado.niveles[0]];
        var s = '<svg viewBox="0 0 560 210" style="width:100%;max-width:560px;margin:0 auto">';
        datos.forEach(function (comp, i) {
          var w = ANCHOS[i], x = (560 - w) / 2, y = 14 + i * 64;
          var color = comp > 70 ? "var(--est)" : comp > 45 ? "var(--ges)" : "var(--med)";
          s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="48" rx="10" fill="' + color + '" opacity="0.85"/>';
          s += '<text x="280" y="' + (y + 21) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">' + NOMBRES[i] + "</text>";
          s += '<text x="280" y="' + (y + 39) + '" text-anchor="middle" font-size="11" fill="#fff">competencia media: ' + nf(comp, 0) + "%</text>";
        });
        s += "</svg>";
        cont.querySelector("#pe-lienzo").innerHTML = s;
        cont.querySelector("#pe-nota").innerHTML = estado.rondas === 0 ? "Empresa recién fundada: cada cual en lo que sabe hacer." :
          estado.niveles[2] < 45 ? "🚨 Tras " + estado.rondas + " rondas, la cúpula está poblada por excelentes ex-vendedores que no saben dirigir: principio de Peter consumado." :
            "Ronda " + estado.rondas + ": los buenos suben... hacia oficios que no son el suyo.";
      }
      cont.querySelector("#pe-ascender").addEventListener("click", function () {
        estado.rondas++;
        estado.niveles[1] = Math.max(30, estado.niveles[1] - 7);
        estado.niveles[2] = Math.max(25, estado.niveles[2] - 9);
        pintar();
      });
      cont.querySelector("#pe-reset").addEventListener("click", reiniciar);
      reiniciar();
    }
    registrar({
      id: "sim-peter", icono: "🪜", titulo: "Ascensos hasta fallar", ley: "peter",
      resumen: "Asciende siempre a los mejores y mira decaer la pirámide.", render: renderPeter
    });
  })();

  registrar({
    id: "sim-dilbert", icono: "👔", titulo: "El ascensor del inepto", ley: "dilbert",
    resumen: "Según la sátira de Adams: ¿a dónde envía la empresa a cada perfil?",
    render: simCurva({
      controles: [{ id: "c", etiqueta: "Competencia técnica del empleado", min: 0, max: 100, valor: 50, fmt: function (v) { return v + "%"; } }],
      grafico: function (v) {
        var pts = [];
        for (var x = 0; x <= 100; x += 2) pts.push({ x: x, y: 88 - 0.72 * x });
        return {
          series: [{ nombre: "Probabilidad de acabar en gestión (según Adams)", color: "var(--ges)", puntos: pts }],
          xMax: 100, yMax: 100, xEtiq: "Competencia técnica", yEtiq: "P(gestión) %",
          marcas: [{ x: v.c, y: 88 - 0.72 * v.c, texto: nf(88 - 0.72 * v.c, 0) + "%" }]
        };
      },
      nota: function (v) {
        return v.c > 75 ? "«Demasiado valioso donde está»: se queda construyendo el producto. (Y quizá sin ascenso.)" :
          v.c > 40 ? "Zona mixta: dependerá de la política de pasillo." :
            "«Aquí no rompe nada»: directo a coordinar reuniones y organigramas. Es sátira... con un fondo incómodo.";
      },
      pie: "La versión cínica del principio de Peter: se asciende al inepto para apartarlo del trabajo real. Humor de oficina con una pregunta seria: ¿qué premia tu organización?"
    })
  });

  registrar({
    id: "sim-pournelle", icono: "🏰", titulo: "La toma del castillo", ley: "pournelle",
    resumen: "Deja envejecer una institución y mira quién acaba mandando.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años de vida de la institución", min: 0, max: 40, valor: 8 }],
      grafico: function (v) {
        var mision = [], aparato = [];
        for (var t = 0; t <= 40; t++) {
          var m = 12 + 68 * Math.exp(-t / 14);
          mision.push({ x: t, y: m });
          aparato.push({ x: t, y: 100 - m });
        }
        function fm(t) { return 12 + 68 * Math.exp(-t / 14); }
        return {
          series: [
            { nombre: "Poder de los dedicados a la misión", color: "var(--est)", puntos: mision },
            { nombre: "Poder de los dedicados a la organización", color: "var(--soc)", puntos: aparato }
          ], xMax: 40, yMax: 100, xEtiq: "Años", yEtiq: "% del poder interno",
          marcas: [{ x: v.t, y: fm(v.t) }]
        };
      },
      nota: function (v) {
        var m = 12 + 68 * Math.exp(-v.t / 14);
        return m > 55 ? "Institución joven: mandan quienes enseñan, curan o construyen." :
          m > 30 ? "Los comités, la normativa y el presupuesto ganan terreno: controlan ascensos y recursos." :
            "🏰 Ley de hierro cumplida: la organización trabaja para sí misma; la misión es un trámite. Quien enseña rellena formularios para quien no enseña.";
      },
      pie: "En toda burocracia hay dos bandos: los dedicados a los fines y los dedicados a la organización. El segundo controla las reglas del juego, así que acaba mandando."
    })
  });

  registrar({
    id: "sim-murphy", icono: "🔌", titulo: "El conector traicionero", ley: "murphy",
    resumen: "Diseña una pieza con formas incorrectas de montarse y déjala en manos del mundo.",
    render: simCurva({
      controles: [
        { id: "w", etiqueta: "Maneras incorrectas de montarla", min: 0, max: 5, valor: 1 },
        { id: "n", etiqueta: "Veces que se montará", min: 10, max: 5000, paso: 10, valor: 500, fmt: function (v) { return nf(v, 0); } }
      ],
      grafico: function (v) {
        var p = v.w === 0 ? 0 : (v.w / (v.w + 1)) * 0.02;
        var pts = [];
        for (var n = 0; n <= 5000; n += 50) pts.push({ x: n, y: (1 - Math.pow(1 - p, n)) * 100 });
        return {
          series: [{ nombre: "P(al menos un montaje erróneo)", color: "var(--med)", puntos: pts }],
          xMax: 5000, yMax: 105, xEtiq: "Número de montajes", yEtiq: "Probabilidad (%)",
          marcas: [{ x: v.n, y: (1 - Math.pow(1 - p, v.n)) * 100, texto: nf((1 - Math.pow(1 - p, v.n)) * 100, 0) + "%" }]
        };
      },
      nota: function (v) {
        if (v.w === 0) return "🛡️ Cero maneras incorrectas: <strong>a prueba de Murphy</strong>. El error es imposible por diseño (como el USB-C reversible).";
        var p = (v.w / (v.w + 1)) * 0.02;
        var prob = (1 - Math.pow(1 - p, v.n)) * 100;
        return "Con " + v.w + " forma(s) incorrecta(s) y " + nf(v.n, 0) + " montajes, la probabilidad de que alguien lo monte mal es del <strong>" + nf(prob, 0) + "%</strong>. Si puede salir mal, saldrá mal.";
      },
      pie: "El origen real de la ley: un sensor con dos maneras de montarse, montado al revés. La lección no es pesimismo, es ingeniería: haz imposible el error."
    })
  });

  (function () {
    function renderSegal(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="chip activo" data-n="1">1 reloj</button>' +
        '<button class="chip" data-n="2">2 relojes</button>' +
        '<button class="chip" data-n="3">3 relojes</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="se-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="se-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Más información sin criterio para arbitrarla produce menos certeza, no más. Por eso los sistemas críticos (aviones, naves) llevan sensores de tres en tres: con dos discrepantes no sabes cuál miente; con tres, vota la mayoría.</p>';
      function reloj(cx, hora, min, color) {
        var aH = ((hora % 12) / 12 + min / 720) * 2 * Math.PI - Math.PI / 2;
        var aM = (min / 60) * 2 * Math.PI - Math.PI / 2;
        return '<g><circle cx="' + cx + '" cy="80" r="52" fill="var(--superficie)" stroke="' + color + '" stroke-width="4"/>' +
          '<line x1="' + cx + '" y1="80" x2="' + (cx + 26 * Math.cos(aH)) + '" y2="' + (80 + 26 * Math.sin(aH)) + '" stroke="var(--tinta)" stroke-width="4" stroke-linecap="round"/>' +
          '<line x1="' + cx + '" y1="80" x2="' + (cx + 40 * Math.cos(aM)) + '" y2="' + (80 + 40 * Math.sin(aM)) + '" stroke="var(--tinta)" stroke-width="2.5" stroke-linecap="round"/>' +
          '<text x="' + cx + '" y="152" text-anchor="middle" font-size="12" fill="var(--tinta-suave)">' + String(hora).padStart(2, "0") + ":" + String(min).padStart(2, "0") + "</text></g>";
      }
      function pintar(n) {
        var s = '<svg viewBox="0 0 560 165" style="max-width:560px;margin:0 auto">';
        if (n === 1) s += reloj(280, 10, 8, "var(--est)");
        if (n === 2) { s += reloj(190, 10, 8, "var(--ges)") + reloj(370, 10, 17, "var(--ges)"); }
        if (n === 3) { s += reloj(120, 10, 8, "var(--est)") + reloj(280, 10, 17, "var(--med)") + reloj(440, 10, 9, "var(--est)"); }
        s += "</svg>";
        cont.querySelector("#se-lienzo").innerHTML = s;
        cont.querySelector("#se-nota").innerHTML =
          n === 1 ? "«Son las 10:08.» Certeza total (esté bien o mal el reloj)." :
            n === 2 ? "¿10:08 o 10:17? <strong>Nunca estarás seguro</strong>: la segunda fuente restó certeza en vez de sumarla." :
              "10:08, 10:17, 10:09 → la mayoría vota: <strong>~10:08</strong>. Tres fuentes permiten arbitrar; dos, solo dudar.";
      }
      cont.querySelectorAll(".chip[data-n]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          cont.querySelectorAll(".chip[data-n]").forEach(function (o) { o.classList.remove("activo"); });
          ch.classList.add("activo");
          pintar(+ch.getAttribute("data-n"));
        });
      });
      pintar(1);
    }
    registrar({
      id: "sim-segal", icono: "⌚", titulo: "El hombre con dos relojes", ley: "segal",
      resumen: "Consulta uno, dos o tres relojes y mide tu certeza.", render: renderSegal
    });
  })();

  registrar({
    id: "sim-illich", icono: "🥱", titulo: "La hora catorce", ley: "illich",
    resumen: "Alarga la jornada y mira a la productividad volverse contra ti.",
    render: simCurva({
      controles: [{ id: "h", etiqueta: "Horas de trabajo al día", min: 1, max: 16, valor: 8 }],
      grafico: function (v) {
        function marginal(h) { return 10 * Math.exp(-Math.pow(h - 3, 2) / 22) - Math.max(0, (h - 9)) * 1.6; }
        var marg = [], total = [], acum = 0, totalPts = [];
        for (var h = 1; h <= 16; h++) {
          marg.push({ x: h, y: marginal(h) });
          acum += marginal(h);
          totalPts.push({ x: h, y: acum });
        }
        return {
          series: [
            { nombre: "Producción de esa hora", color: "var(--ges)", puntos: marg },
            { nombre: "Producción acumulada", color: "var(--est)", puntos: totalPts }
          ], xMax: 16, yMin: -8, yMax: 70, xEtiq: "Hora de la jornada", yEtiq: "Producción",
          marcas: [{ x: v.h, y: marginal(v.h) }]
        };
      },
      nota: function (v) {
        function marginal(h) { return 10 * Math.exp(-Math.pow(h - 3, 2) / 22) - Math.max(0, (h - 9)) * 1.6; }
        var m = marginal(v.h);
        return m > 6 ? "Hora fresca: rendimiento pleno." :
          m > 0 ? "La fatiga muerde: cada hora extra rinde menos." :
            "🚨 Productividad <strong>negativa</strong>: los errores de esta hora cuestan más de lo que produce. Illich lo llamó contraproductividad.";
      },
      pie: "Pasado un umbral, seguir trabajando resta: los errores, accidentes y decisiones malas de la fatiga superan lo producido. Las jornadas heroicas producen menos que las razonables."
    })
  });

  registrar({
    id: "sim-price", icono: "🧑‍🔬", titulo: "La raíz cuadrada que trabaja", ley: "price",
    resumen: "Agranda el grupo y mira encogerse (en proporción) a quienes hacen la mitad.",
    render: simCurva({
      controles: [{ id: "x", etiqueta: "Tamaño del grupo", min: 1, max: 4, paso: 0.1, valor: 2, fmt: function (v) { return nf(Math.round(Math.pow(10, v)), 0) + " personas"; } }],
      grafico: function (v) {
        var n = Math.round(Math.pow(10, v.x));
        var raiz = Math.round(Math.sqrt(n));
        var W = 560, H = 170;
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<text x="10" y="20" font-size="12" fill="var(--tinta)">Mitad del trabajo ← <tspan font-weight="700">' + nf(raiz, 0) + " personas (√n)</tspan></text>";
        s += '<rect x="10" y="30" width="' + (raiz / n) * 520 + '" height="30" rx="6" fill="var(--acento)" style="min-width:3px"/>';
        s += '<rect x="' + Math.max(13, 10 + (raiz / n) * 520) + '" y="30" width="' + (1 - raiz / n) * 520 + '" height="30" rx="6" fill="var(--borde)"/>';
        s += '<text x="10" y="90" font-size="12" fill="var(--tinta)">La otra mitad ← <tspan font-weight="700">' + nf(n - raiz, 0) + " personas</tspan></text>";
        s += '<rect x="10" y="100" width="260" height="30" rx="6" fill="var(--acento)"/><rect x="270" y="100" width="260" height="30" rx="6" fill="var(--borde)" opacity="0"/>';
        s += '<rect x="10" y="100" width="260" height="30" rx="6" fill="var(--acento)" opacity="0.45"/>';
        s += '<text x="10" y="158" font-size="11" fill="var(--tinta-tenue)">Cada mitad del trabajo total, repartida entre grupos muy distintos.</text>';
        s += "</svg>";
        return s;
      },
      nota: function (v) {
        var n = Math.round(Math.pow(10, v.x));
        var raiz = Math.round(Math.sqrt(n));
        return "En un grupo de " + nf(n, 0) + ", la ley de Price predice que <strong>" + nf(raiz, 0) + "</strong> personas (el " + nf((raiz / n) * 100, 1) + "%) firman la mitad de la obra. Cuanto mayor el grupo, más brutal la asimetría.";
      },
      pie: "Más feroz que Pareto: 100 investigadores → 10 firman la mitad; 10 000 empleados → 100 generan la mitad del impacto. La contribución nunca se reparte uniforme."
    })
  });

  (function () {
    function renderHofstadter(cont) {
      var estado = { historial: [] };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Tu estimación para la reforma: <strong id="ho-val">6</strong> semanas</label>' +
        '<input type="range" id="ho-rango" min="2" max="20" value="6">' +
        '<button class="boton-sim" id="ho-ejecutar">🔨 Ejecutar el proyecto</button>' +
        "</div>" +
        '<div class="lienzo-sim"><table class="tabla-sim"><thead><tr><th>#</th><th>Estimado</th><th>Real</th><th>Desvío</th></tr></thead><tbody id="ho-tabla"></tbody></table></div>' +
        '<p class="marcador" id="ho-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Estima, ejecuta y compara. Los imprevistos individualmente improbables son colectivamente seguros, así que la duración real sigue una distribución de cola pesada: aunque acolches la estimación... ya sabes cómo sigue la frase.</p>';
      var rango = cont.querySelector("#ho-rango");
      rango.addEventListener("input", function () { cont.querySelector("#ho-val").textContent = rango.value; });
      cont.querySelector("#ho-ejecutar").addEventListener("click", function () {
        var est = +rango.value;
        var factor = Math.exp(0.35 + (azar() + azar() + azar() - 1.5) * 0.55);
        var real = Math.max(est * 0.75, est * factor);
        estado.historial.push({ est: est, real: real });
        cont.querySelector("#ho-tabla").innerHTML = estado.historial.map(function (h, i) {
          var d = ((h.real - h.est) / h.est) * 100;
          return "<tr><td>" + (i + 1) + "</td><td>" + h.est + " sem</td><td>" + nf(h.real, 1) + " sem</td><td style='color:" + (d > 0 ? "var(--error)" : "var(--ok)") + ";font-weight:700'>" + (d > 0 ? "+" : "") + nf(d, 0) + "%</td></tr>";
        }).join("");
        var tarde = estado.historial.filter(function (h) { return h.real > h.est; }).length;
        cont.querySelector("#ho-nota").innerHTML = "Proyectos que se retrasaron: <strong>" + tarde + " de " + estado.historial.length + "</strong>." +
          (estado.historial.length >= 5 ? " Incluso conociendo la ley de Hofstadter." : "");
      });
    }
    registrar({
      id: "sim-hofstadter", icono: "🔨", titulo: "La reforma eterna", ley: "hofstadter",
      resumen: "Estima un proyecto, ejecútalo y compara. Repite. Llora.", render: renderHofstadter
    });
  })();

  (function () {
    function renderSod(cont) {
      var estado = { normales: 0, importantes: 0, fallosN: 0, fallosI: 0, recuerdos: [] };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim secundario" id="so-normal">Vivir 30 días normales</button>' +
        '<button class="boton-sim" id="so-importante">📅 Vivir un día de entrega</button>' +
        '<button class="boton-sim secundario" id="so-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim">' +
        '<table class="tabla-sim"><thead><tr><th></th><th>Días</th><th>Fallos de la impresora</th><th>Tasa</th></tr></thead><tbody id="so-tabla"></tbody></table>' +
        '<p style="margin:12px 0 4px"><strong>🧠 Lo que tu memoria registró:</strong></p>' +
        '<div id="so-recuerdos" style="font-size:0.88rem;color:var(--tinta-suave)">Nada todavía.</div>' +
        "</div>" +
        '<p class="nota-sim">La impresora falla un 10% de los días, sin favoritismos. Pero tu memoria solo archiva los fallos con moraleja («¡justo hoy!»). Al cabo de un tiempo, jurarás que falla siempre en el peor momento: esa es la mitad psicológica de la ley de Sod.</p>';
      function pintar() {
        function tasa(f, d) { return d ? nf((f / d) * 100, 0) + "%" : "—"; }
        cont.querySelector("#so-tabla").innerHTML =
          "<tr><td>Días normales</td><td>" + estado.normales + "</td><td>" + estado.fallosN + "</td><td>" + tasa(estado.fallosN, estado.normales) + "</td></tr>" +
          "<tr><td>Días de entrega</td><td>" + estado.importantes + "</td><td>" + estado.fallosI + "</td><td>" + tasa(estado.fallosI, estado.importantes) + "</td></tr>";
        cont.querySelector("#so-recuerdos").innerHTML = estado.recuerdos.length ?
          estado.recuerdos.map(function (r) { return "<p style='margin:2px 0'>" + r + "</p>"; }).join("") :
          "Nada todavía.";
      }
      cont.querySelector("#so-normal").addEventListener("click", function () {
        for (var i = 0; i < 30; i++) {
          estado.normales++;
          if (azar() < 0.1) estado.fallosN++;
        }
        pintar();
      });
      cont.querySelector("#so-importante").addEventListener("click", function () {
        estado.importantes++;
        if (azar() < 0.1) {
          estado.fallosI++;
          estado.recuerdos.push("😡 «¡La impresora se atascó JUSTO el día de la entrega!» (día " + (estado.normales + estado.importantes) + ")");
        }
        pintar();
      });
      cont.querySelector("#so-reset").addEventListener("click", function () {
        estado = { normales: 0, importantes: 0, fallosN: 0, fallosI: 0, recuerdos: [] };
        pintar();
      });
      pintar();
    }
    registrar({
      id: "sim-sod", icono: "🖨️", titulo: "La impresora rencorosa", ley: "sod",
      resumen: "Comprueba si la impresora falla más en los días importantes... o solo lo recuerdas más.", render: renderSod
    });
  })();

  /* ======================= ESTADÍSTICA Y DATOS ======================= */

  registrar({
    id: "sim-littlewood", icono: "✨", titulo: "Un milagro al mes", ley: "littlewood",
    resumen: "Cuenta cuántos sucesos percibes y calcula tu ración de milagros.",
    render: simCurva({
      controles: [{ id: "s", etiqueta: "Sucesos que percibes por hora", min: 500, max: 5000, paso: 100, valor: 3600, fmt: function (v) { return nf(v, 0); } }],
      grafico: function (v) {
        var porMes = (v.s * 8 * 30) / 1e6;
        var pts = [];
        for (var s = 500; s <= 5000; s += 100) pts.push({ x: s, y: (s * 8 * 30) / 1e6 });
        return {
          series: [{ nombre: "«Milagros» (1 entre un millón) esperados al mes", color: "var(--est)", puntos: pts }],
          xMax: 5000, yMax: 1.4, xEtiq: "Sucesos percibidos por hora", yEtiq: "Milagros/mes",
          marcas: [{ x: v.s, y: porMes, texto: nf(porMes, 2) }]
        };
      },
      nota: function (v) {
        var dias = 1e6 / (v.s * 8);
        return "A tu ritmo, un suceso «de uno entre un millón» te toca cada <strong>" + nf(dias, 0) + " días</strong>. Las coincidencias asombrosas no necesitan explicación sobrenatural: necesitan un contador.";
      },
      pie: "El cálculo de Littlewood: ~1 suceso por segundo, 8 horas al día → un millón de sucesos al mes. Lo improbable, con suficientes oportunidades, es rutina."
    })
  });

  registrar({
    id: "sim-twyman", icono: "🚨", titulo: "El dato demasiado bueno", ley: "twyman",
    resumen: "Seis hallazgos espectaculares: ¿descubrimiento o error de medición?",
    render: simAdivina({
      preguntas: [
        { texto: "Las ventas del martes se dispararon un +400% respecto a la media.", opciones: [{ t: "📈 ¡Descubrimiento!" }, { t: "🔧 Error de datos", ok: true }], retro: "Ese martes se duplicó la base de datos durante una migración. El pico era un duplicado." },
        { texto: "Una sucursal responde las encuestas con 100% de satisfacción, 500 de 500.", opciones: [{ t: "📈 Equipo perfecto" }, { t: "🔧 Error (o trampa) de medición", ok: true }], retro: "Nadie complace a 500 de 500: el gerente rellenaba las encuestas. Perfección = alarma." },
        { texto: "Un estudio pequeño: los que desayunan chocolate adelgazan el doble.", opciones: [{ t: "📈 Titular inmediato" }, { t: "🔧 Ruido estadístico", ok: true }], retro: "Muestras diminutas + muchas variables = algún hallazgo falso garantizado. No sobrevivió a la réplica." },
        { texto: "El sensor marca que la temperatura del almacén subió 40 grados en un minuto.", opciones: [{ t: "📈 ¡Incendio!" }, { t: "🔧 Sensor averiado", ok: true }], retro: "Verificar el sensor cuesta un paseo; evacuar por un cable suelto, una fortuna. (Pero verifica rápido.)" },
        { texto: "Tras cambiar el botón a verde, las suscripciones subieron un 2% en un mes (muestra grande, efecto estable).", opciones: [{ t: "📈 Mejora real, aunque modesta", ok: true }, { t: "🔧 Seguro que es error" }], retro: "Los efectos reales suelen ser así: modestos, estables y aburridos. Lo espectacular es lo sospechoso." },
        { texto: "Un país informa de 0 casos de una enfermedad que azota a todos sus vecinos.", opciones: [{ t: "📈 Milagro sanitario" }, { t: "🔧 No los mide (o no los cuenta)", ok: true }], retro: "El cero perfecto rodeado de brotes no describe salud: describe un sistema que no mide." }
      ],
      final: function () { return "Cuanto más interesante parece un dato, más probable es que sea un error: verifica tres veces la cifra que te haría famoso."; }
    })
  });

  registrar({
    id: "sim-stigler", icono: "🏷️", titulo: "El nombre equivocado", ley: "stigler",
    resumen: "¿Quién descubrió de verdad cada ley con nombre propio?",
    render: simAdivina({
      preguntas: [
        { texto: "¿Quién describió primero la «ley de Benford» de los primeros dígitos?", opciones: [{ t: "Frank Benford (1938)" }, { t: "Simon Newcomb (1881)", ok: true }], retro: "Newcomb la publicó 57 años antes al notar las páginas gastadas de las tablas de logaritmos. El nombre se lo llevó el divulgador." },
        { texto: "¿Quién enunció antes que Gresham que «el dinero malo expulsa al bueno»?", opciones: [{ t: "Nadie: fue Gresham" }, { t: "Nicolás de Oresme y Copérnico", ok: true }], retro: "Oresme lo escribió en el siglo XIV y Copérnico antes de que Gresham naciera. El epónimo llegó en 1858." },
        { texto: "La distribución «campana de Gauss»... ¿de quién era?", opciones: [{ t: "De Gauss, obviamente" }, { t: "Abraham de Moivre la publicó antes", ok: true }], retro: "De Moivre la derivó en 1733, cuando Gauss no había nacido. Stigler ataca de nuevo." },
        { texto: "¿Y el «teorema de Pitágoras»?", opciones: [{ t: "Pitágoras, siglo VI a.C." }, { t: "Babilonios, mil años antes", ok: true }], retro: "Tablillas babilónicas con ternas pitagóricas preceden a Pitágoras en más de un milenio." },
        { texto: "¿Quién formuló la propia «ley de Stigler»?", opciones: [{ t: "Stephen Stigler" }, { t: "Robert Merton (según el propio Stigler)", ok: true }], retro: "Stigler atribuyó su ley a Merton a propósito: la cumplió en el acto de enunciarla. 🎩" }
      ],
      final: function () { return "Ningún descubrimiento lleva el nombre de su verdadero descubridor: el crédito va al que populariza, no al pionero."; }
    })
  });

  (function () {
    function renderBerkson(cont) {
      var puntos = [];
      for (var i = 0; i < 260; i++) {
        var talento = Math.max(3, Math.min(97, 50 + (azar() + azar() + azar() - 1.5) * 26));
        var belleza = Math.max(3, Math.min(97, 50 + (azar() + azar() + azar() - 1.5) * 26));
        puntos.push({ x: belleza, y: talento });
      }
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Umbral de fama (belleza + talento ≥): <strong id="be-val">120</strong></label>' +
        '<input type="range" id="be-rango" min="60" max="160" value="120">' +
        "</div>" +
        '<div class="lienzo-sim" id="be-lienzo"></div>' +
        '<p class="marcador" id="be-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Belleza y talento se generaron <strong>independientes</strong> (correlación ≈ 0 en la población). Ahora filtra: solo se hacen famosos quienes suman bastante de ambas. Entre los famosos aparece una correlación negativa que no existe en la realidad: la fabricó el filtro.</p>';
      var rango = cont.querySelector("#be-rango");
      function correlacion(pts) {
        var n = pts.length;
        if (n < 3) return 0;
        var mx = 0, my = 0;
        pts.forEach(function (p) { mx += p.x; my += p.y; });
        mx /= n; my /= n;
        var sxy = 0, sx = 0, sy = 0;
        pts.forEach(function (p) {
          sxy += (p.x - mx) * (p.y - my);
          sx += (p.x - mx) * (p.x - mx);
          sy += (p.y - my) * (p.y - my);
        });
        return sxy / Math.sqrt(sx * sy || 1);
      }
      function pintar() {
        var u = +rango.value;
        cont.querySelector("#be-val").textContent = u;
        var W = 560, H = 280, m = 40;
        function X(v) { return m + (v / 100) * (W - 2 * m); }
        function Y(v) { return H - m - (v / 100) * (H - 2 * m); }
        var famosos = puntos.filter(function (p) { return p.x + p.y >= u; });
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<line x1="' + X(Math.max(0, u - 100)) + '" y1="' + Y(Math.min(100, u)) + '" x2="' + X(Math.min(100, u)) + '" y2="' + Y(Math.max(0, u - 100)) + '" stroke="var(--acento)" stroke-width="2" stroke-dasharray="6 4"/>';
        puntos.forEach(function (p) {
          var famoso = p.x + p.y >= u;
          s += '<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="' + (famoso ? 4 : 2.5) + '" fill="' + (famoso ? "var(--soc)" : "var(--borde)") + '"/>';
        });
        s += '<text x="' + (W / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="var(--tinta-suave)">Belleza</text>';
        s += '<text x="14" y="' + (H / 2) + '" text-anchor="middle" font-size="11" fill="var(--tinta-suave)" transform="rotate(-90 14 ' + (H / 2) + ')">Talento</text>';
        s += "</svg>";
        cont.querySelector("#be-lienzo").innerHTML = s;
        var rTodos = correlacion(puntos), rFamosos = correlacion(famosos);
        cont.querySelector("#be-nota").innerHTML = "Correlación en la población: <strong>" + nf(rTodos, 2) + "</strong> · Entre los " + famosos.length + " «famosos»: <strong style='color:var(--soc)'>" + nf(rFamosos, 2) + "</strong>" +
          (rFamosos < -0.15 ? " — «los guapos tienen menos talento»... solo dentro de la muestra filtrada." : "");
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-berkson", icono: "🎬", titulo: "La correlación fantasma", ley: "berkson",
      resumen: "Filtra una población y mira nacer una correlación que no existe.", render: renderBerkson
    });
  })();

  /* ======================= MEDICINA Y FISIOLOGÍA ======================= */

  registrar({
    id: "sim-sutton", icono: "🏦", titulo: "Donde está el dinero", ley: "sutton",
    resumen: "Tres pacientes, tres decisiones: elige la primera prueba como un clínico.",
    render: simAdivina({
      preguntas: [
        {
          texto: "Joven con tos, fiebre de 39° y dolor al respirar. ¿Primera prueba?", opciones: [
            { t: "Radiografía de tórax (buscando neumonía)", ok: true },
            { t: "Resonancia magnética completa" },
            { t: "Panel genético de enfermedades raras" }
          ], retro: "Ve donde está el dinero: la causa frecuente, con la prueba barata que la confirma. Neumonía confirmada en 20 minutos."
        },
        {
          texto: "Fumador de 60 años con tos crónica que ahora escupe sangre. ¿Primera prueba?", opciones: [
            { t: "Radiografía/TAC de tórax (buscando lo grave y probable)", ok: true },
            { t: "Tratamiento de prueba para el reflujo" },
            { t: "Esperar un mes a ver si remite" }
          ], retro: "Aquí «el dinero» está en descartar cáncer de pulmón: probable Y grave. Sutton también ordena por lo que no puede esperar."
        },
        {
          texto: "Niña con dolor de garganta, placas de pus y ganglios. ¿Primera prueba?", opciones: [
            { t: "Test rápido de estreptococo", ok: true },
            { t: "TAC de cuello" },
            { t: "Biopsia de amígdala" }
          ], retro: "Cinco minutos y céntimos: la prueba dirigida a la causa más probable. Primero caballos; las cebras, si los caballos fallan."
        }
      ],
      final: function () { return "«Ve donde está el dinero»: la hipótesis más probable, con la prueba que mejor la confirma. Es la navaja de Occam con bata."; }
    })
  });

  registrar({
    id: "sim-hickam", icono: "🦓", titulo: "¿Una causa o dos?", ley: "hickam",
    resumen: "Decide entre la elegancia de Occam y el realismo de Hickam.",
    render: simAdivina({
      preguntas: [
        {
          texto: "Anciano con ahogo y piernas hinchadas. Toma 8 medicamentos y tiene 4 enfermedades crónicas.", opciones: [
            { t: "🦓 Puede ser asma + insuficiencia venosa: dos procesos banales a la vez", ok: true },
            { t: "🪒 Buscar un único diagnóstico que lo explique todo" }
          ], retro: "Máxima de Hickam: «el paciente puede tener tantas enfermedades como le venga en gana». En mayores y crónicos, apostar por la causa única retrasa tratamientos."
        },
        {
          texto: "Joven sana con fiebre, tos y dolor de cabeza desde ayer.", opciones: [
            { t: "🪒 Un solo virus lo explica todo", ok: true },
            { t: "🦓 Tres enfermedades simultáneas e independientes" }
          ], retro: "En jóvenes sanos con síntomas agudos, Occam gana: una causa común y reciente. Hickam es para la multimorbilidad."
        },
        {
          texto: "Diabético con dolor torácico Y dolor de espalda tras cargar cajas.", opciones: [
            { t: "🦓 Evaluar corazón Y espalda por separado", ok: true },
            { t: "🪒 Todo es muscular: una sola causa y a casa" }
          ], retro: "Aquí el error de la parsimonia mata: el dolor muscular es real Y el infarto silente del diabético también puede serlo. Dos hipótesis, dos comprobaciones."
        }
      ],
      final: function () { return "Occam para el joven sano con síntomas agudos; Hickam para el paciente crónico y complejo: la clínica es saber cuándo usar cada navaja."; }
    })
  });

  registrar({
    id: "sim-cuidados", icono: "🗺️", titulo: "El mapa invertido", ley: "cuidados-inversos",
    resumen: "Expón la sanidad al mercado y mira los recursos huir de la necesidad.",
    render: simCurva({
      controles: [{ id: "m", etiqueta: "Exposición de la sanidad al mercado", min: 0, max: 100, valor: 20, fmt: function (v) { return v + "%"; } }],
      grafico: function (v) {
        var W = 560, H = 210;
        var necesidadPobre = 85, necesidadRico = 30;
        var recPobre = 75 - 0.55 * v.m, recRico = 40 + 0.5 * v.m;
        function barra(x, etiqueta, nec, rec) {
          var s = '<text x="' + x + '" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)">' + etiqueta + "</text>";
          s += '<rect x="' + (x - 85) + '" y="' + (180 - nec * 1.5) + '" width="70" height="' + nec * 1.5 + '" rx="6" fill="var(--med)" opacity="0.8"/>';
          s += '<text x="' + (x - 50) + '" y="196" text-anchor="middle" font-size="10" fill="var(--tinta-suave)">necesidad</text>';
          s += '<rect x="' + (x + 15) + '" y="' + (180 - rec * 1.5) + '" width="70" height="' + rec * 1.5 + '" rx="6" fill="var(--est)" opacity="0.9"/>';
          s += '<text x="' + (x + 50) + '" y="196" text-anchor="middle" font-size="10" fill="var(--tinta-suave)">recursos</text>';
          return s;
        }
        return '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">' +
          barra(150, "Barrio pobre", necesidadPobre, recPobre) +
          barra(420, "Barrio rico", necesidadRico, recRico) + "</svg>";
      },
      nota: function (v) {
        return v.m < 25 ? "Con planificación según necesidad, los recursos siguen (más o menos) a la enfermedad." :
          v.m < 65 ? "Los recursos empiezan a seguir al dinero: clínicas nuevas donde ya había salud." :
            "🚨 Ley de cuidados inversos plena: máxima atención donde mínima necesidad. La distorsión crece con la exposición al mercado, tal y como escribió Tudor Hart.";
      },
      pie: "Quien más atención necesita es quien menos recibe. Formulada por un médico rural galés en The Lancet (1971); sigue siendo el texto fundacional de la equidad sanitaria."
    })
  });

  registrar({
    id: "sim-frank-starling", icono: "❤️", titulo: "El corazón que se autorregula", ley: "frank-starling",
    resumen: "Llena más el corazón y mira crecer (o no) la fuerza del latido.",
    render: simCurva({
      controles: [{ id: "p", etiqueta: "Retorno venoso (precarga)", min: 5, max: 100, valor: 40 }],
      selector: { id: "estado", opciones: [["sano", "Corazón sano"], ["icc", "Insuficiencia cardíaca"]] },
      grafico: function (v) {
        function vs(p, tipo) {
          return tipo === "sano" ? 100 * (1 - Math.exp(-p / 32)) : 52 * (1 - Math.exp(-p / 45));
        }
        var sano = [], icc = [];
        for (var p = 0; p <= 100; p += 2) {
          sano.push({ x: p, y: vs(p, "sano") });
          icc.push({ x: p, y: vs(p, "icc") });
        }
        return {
          series: [
            { nombre: "Corazón sano", color: "var(--est)", puntos: sano },
            { nombre: "Insuficiencia cardíaca", color: "var(--med)", puntos: icc }
          ], xMax: 100, yMax: 105, xEtiq: "Llenado diastólico (precarga)", yEtiq: "Volumen expulsado por latido",
          marcas: [{ x: v.p, y: vs(v.p, v.estado) }]
        };
      },
      nota: function (v) {
        return v.estado === "sano" ?
          (v.p < 60 ? "Más llenado → fibras más estiradas → contracción más fuerte: el corazón bombea lo que recibe, sin órdenes externas." : "Cerca del tope de la curva: el mecanismo tiene límites incluso en el corazón sano.") :
          "En la insuficiencia, la curva se aplana: más llenado ya no da más fuerza, solo congestión (edemas, ahogo). Por eso los diuréticos alivian.";
      },
      pie: "La autorregulación latido a latido que iguala lo que entra y lo que sale. Al incorporarte o correr, esta ley trabaja para ti en silencio."
    })
  });

  (function () {
    function renderStarlingCap(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Presión hidrostática (empuja fuera): <strong id="sc-ph">32</strong></label>' +
        '<input type="range" id="sc-rph" min="10" max="60" value="32">' +
        '<label>Albúmina / presión oncótica (succiona dentro): <strong id="sc-po">25</strong></label>' +
        '<input type="range" id="sc-rpo" min="5" max="40" value="25">' +
        "</div>" +
        '<div class="lienzo-sim" id="sc-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="sc-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">El capilar pierde o recupera líquido según el balance de dos fuerzas. Sube la hidrostática (insuficiencia cardíaca) o baja la albúmina (desnutrición, hígado enfermo) y fabrica un edema tú mismo.</p>';
      var rph = cont.querySelector("#sc-rph"), rpo = cont.querySelector("#sc-rpo");
      function pintar() {
        var ph = +rph.value, po = +rpo.value;
        cont.querySelector("#sc-ph").textContent = ph;
        cont.querySelector("#sc-po").textContent = po;
        var neto = ph - po;
        var s = '<svg viewBox="0 0 560 190" style="max-width:560px;margin:0 auto">';
        s += '<rect x="80" y="70" width="400" height="50" rx="25" fill="color-mix(in srgb, var(--med) 30%, var(--superficie))" stroke="var(--med)" stroke-width="3"/>';
        s += '<text x="280" y="100" text-anchor="middle" font-size="12" font-weight="700" fill="var(--tinta)">capilar</text>';
        var flechas = Math.min(5, Math.max(1, Math.round(Math.abs(neto) / 8) + 1));
        for (var i = 0; i < flechas; i++) {
          var x = 140 + i * 75;
          if (neto > 3) s += '<path d="M ' + x + ' 62 L ' + x + ' 34 M ' + (x - 7) + ' 44 L ' + x + ' 34 L ' + (x + 7) + ' 44" stroke="var(--ges)" stroke-width="3" fill="none"/>';
          else if (neto < -3) s += '<path d="M ' + x + ' 34 L ' + x + ' 62 M ' + (x - 7) + ' 52 L ' + x + ' 62 L ' + (x + 7) + ' 52" stroke="var(--est)" stroke-width="3" fill="none"/>';
        }
        s += '<text x="280" y="160" text-anchor="middle" font-size="12" fill="var(--tinta-suave)">' +
          (neto > 3 ? "líquido saliendo al tejido" : neto < -3 ? "líquido reabsorbido al capilar" : "equilibrio") + "</text></svg>";
        cont.querySelector("#sc-lienzo").innerHTML = s;
        cont.querySelector("#sc-nota").innerHTML = "Balance neto: <strong>" + (neto > 0 ? "+" : "") + neto + "</strong> → " +
          (neto > 14 ? "🦵 <strong>edema franco</strong>: el tejido se encharca (piernas hinchadas, pulmón húmedo)." :
            neto > 3 ? "filtración moderada: el sistema linfático aún drena el exceso." :
              neto < -3 ? "reabsorción: el capilar recupera líquido del tejido." : "equilibrio fisiológico: ni seco ni encharcado.");
      }
      rph.addEventListener("input", pintar);
      rpo.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-starling-capilar", icono: "💧", titulo: "Fabricar un edema", ley: "starling-capilar",
      resumen: "Juega con las dos fuerzas del capilar hasta encharcar el tejido.", render: renderStarlingCap
    });
  })();

  registrar({
    id: "sim-poiseuille", icono: "🚰", titulo: "La cuarta potencia", ley: "poiseuille",
    resumen: "Estrecha o ensancha un vaso y mira al flujo responder a lo bestia.",
    render: simCurva({
      controles: [{ id: "r", etiqueta: "Radio del vaso", min: 10, max: 100, valor: 100, fmt: function (v) { return v + "%"; } }],
      grafico: function (v) {
        var pts = [];
        for (var r = 10; r <= 100; r += 2) pts.push({ x: r, y: Math.pow(r / 100, 4) * 100 });
        return {
          series: [{ nombre: "Flujo (% del normal)", color: "var(--med)", puntos: pts }],
          xMax: 100, yMax: 105, xEtiq: "Radio (% del normal)", yEtiq: "Flujo (%)",
          marcas: [{ x: v.r, y: Math.pow(v.r / 100, 4) * 100, texto: nf(Math.pow(v.r / 100, 4) * 100, 0) + "%" }]
        };
      },
      nota: function (v) {
        var flujo = Math.pow(v.r / 100, 4) * 100;
        return v.r >= 95 ? "Vaso normal: flujo pleno." :
          v.r >= 70 ? "Radio al " + v.r + "% → flujo al <strong>" + nf(flujo, 0) + "%</strong>: la cuarta potencia castiga pronto." :
            v.r >= 45 ? "Una placa que estrecha «solo» a la mitad deja el flujo en el <strong>" + nf(flujo, 0) + "%</strong>. Así se gesta una angina." :
              "🚨 Flujo residual del " + nf(flujo, 1) + "%: isquemia. Y al revés: duplicar el radio multiplica el flujo ×16 (por eso la vía gruesa en urgencias).";
      },
      pie: "Q ∝ r⁴: el radio manda con cuarta potencia. Gobierna la hipertensión, el asma, las varices y la elección de catéteres."
    })
  });

  (function () {
    function renderFick(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="chip activo" data-p="sano">Pulmón sano</button>' +
        '<button class="chip" data-p="enfisema">Enfisema</button>' +
        '<button class="chip" data-p="fibrosis">Fibrosis</button>' +
        "</div>" +
        '<div class="fila-controles">' +
        '<label>Superficie de intercambio: <strong id="fk-s">100</strong>%</label><input type="range" id="fk-rs" min="10" max="100" value="100">' +
        '<label>Grosor de la barrera: <strong id="fk-g">1,0</strong>×</label><input type="range" id="fk-rg" min="10" max="50" value="10">' +
        '<label>Gradiente de O₂: <strong id="fk-d">100</strong>%</label><input type="range" id="fk-rd" min="20" max="100" value="100">' +
        "</div>" +
        '<div class="lienzo-sim" id="fk-lienzo"></div>' +
        '<p class="nota-sim">Difusión = superficie × gradiente ÷ grosor. El enfisema destruye superficie; la fibrosis engrosa la barrera: dos maneras opuestas de estropear la misma ecuación, y las dos acaban en falta de oxígeno.</p>';
      var rs = cont.querySelector("#fk-rs"), rg = cont.querySelector("#fk-rg"), rd = cont.querySelector("#fk-rd");
      function pintar() {
        var s = +rs.value, g = +rg.value / 10, d = +rd.value;
        cont.querySelector("#fk-s").textContent = s;
        cont.querySelector("#fk-g").textContent = nf(g, 1);
        cont.querySelector("#fk-d").textContent = d;
        var dif = (s * d) / (g * 100);
        var color = dif > 70 ? "var(--est)" : dif > 40 ? "var(--ges)" : "var(--med)";
        cont.querySelector("#fk-lienzo").innerHTML =
          '<p style="margin:0 0 8px">Difusión de O₂ conseguida:</p>' +
          '<div style="height:30px;border-radius:999px;background:var(--superficie);border:1px solid var(--borde);overflow:hidden"><div style="height:100%;width:' + Math.min(100, dif) + '%;background:' + color + ';transition:width 200ms"></div></div>' +
          '<p class="marcador" style="margin-top:10px;text-align:center">' + nf(dif, 0) + "% — " +
          (dif > 70 ? "oxigenación normal" : dif > 40 ? "hipoxia al esfuerzo: falta aire al subir escaleras" : "🚨 hipoxia en reposo: oxígeno domiciliario") + "</p>";
      }
      cont.querySelectorAll(".chip[data-p]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          cont.querySelectorAll(".chip[data-p]").forEach(function (o) { o.classList.remove("activo"); });
          ch.classList.add("activo");
          var p = ch.getAttribute("data-p");
          if (p === "sano") { rs.value = 100; rg.value = 10; rd.value = 100; }
          if (p === "enfisema") { rs.value = 35; rg.value = 10; rd.value = 90; }
          if (p === "fibrosis") { rs.value = 80; rg.value = 38; rd.value = 90; }
          pintar();
        });
      });
      [rs, rg, rd].forEach(function (r) { r.addEventListener("input", pintar); });
      pintar();
    }
    registrar({
      id: "sim-fick", icono: "🫁", titulo: "La ecuación de respirar", ley: "fick",
      resumen: "Estropea la superficie o engorda la barrera: dos caminos a la hipoxia.", render: renderFick
    });
  })();

  registrar({
    id: "sim-wolff", icono: "🦴", titulo: "El hueso escucha", ley: "wolff",
    resumen: "Carga (o descarga) un esqueleto durante meses y mide su densidad.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Meses transcurridos", min: 0, max: 24, valor: 12 }],
      selector: {
        id: "modo", opciones: [
          ["tenista", "🎾 Tenista profesional (brazo dominante)"],
          ["normal", "🚶 Vida sedentaria"],
          ["astronauta", "🚀 Astronauta en ingravidez"]
        ]
      },
      grafico: function (v) {
        var TASAS = { tenista: 0.9, normal: -0.08, astronauta: -1.1 };
        function dens(t, modo) { return 100 + TASAS[modo] * t * (1 - Math.exp(-t / 30)); }
        var series = ["tenista", "normal", "astronauta"].map(function (m) {
          var pts = [];
          for (var t = 0; t <= 24; t++) pts.push({ x: t, y: dens(t, m) });
          return {
            nombre: m === "tenista" ? "Tenista" : m === "normal" ? "Sedentario" : "Astronauta",
            color: m === "tenista" ? "var(--est)" : m === "normal" ? "var(--ges)" : "var(--med)",
            puntos: pts
          };
        });
        return {
          series: series, xMax: 24, yMin: 70, yMax: 125, xEtiq: "Meses", yEtiq: "Densidad ósea (inicio = 100)",
          marcas: [{ x: v.t, y: (function () { var TAS = { tenista: 0.9, normal: -0.08, astronauta: -1.1 }; return 100 + TAS[v.modo] * v.t * (1 - Math.exp(-v.t / 30)); })() }]
        };
      },
      nota: function (v) {
        return v.modo === "tenista" ? "El brazo que golpea gana masa ósea mes a mes: el hueso se refuerza exactamente donde hay carga (hasta un tercio más que el otro brazo)." :
          v.modo === "normal" ? "Sin apenas carga, el hueso se mantiene... y con la edad, sin ejercicio, empieza a ceder: por eso el ejercicio con peso previene la osteoporosis." :
            "En ingravidez se pierde ~1% de hueso al mes: sin cargas que escuchar, el esqueleto se desmonta. El gran problema de un viaje a Marte.";
      },
      pie: "El hueso es un tejido vivo que se remodela según las fuerzas que soporta: sus trabéculas siguen las líneas de carga como los tirantes de un puente."
    })
  });

  (function () {
    function renderTodoONada(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Intensidad del estímulo: <strong id="tn-val">20</strong></label>' +
        '<input type="range" id="tn-rango" min="0" max="100" value="20">' +
        "</div>" +
        '<div class="lienzo-sim" id="tn-lienzo"></div>' +
        '<p class="marcador" id="tn-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Bajo el umbral (40): silencio absoluto. Sobre el umbral: espigas siempre de la misma altura — solo cambia la <strong>frecuencia</strong>. El sistema nervioso es digital: codifica en ritmo, no en tamaño.</p>';
      var rango = cont.querySelector("#tn-rango");
      function pintar() {
        var i = +rango.value;
        cont.querySelector("#tn-val").textContent = i;
        var W = 560, H = 150;
        var s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:560px;margin:0 auto">';
        s += '<line x1="10" y1="110" x2="' + (W - 10) + '" y2="110" stroke="var(--tinta-tenue)"/>';
        if (i >= 40) {
          var n = Math.round(1 + ((i - 40) / 60) * 14);
          var paso = (W - 60) / n;
          for (var k = 0; k < n; k++) {
            var x = 40 + k * paso;
            s += '<path d="M ' + x + " 110 L " + (x + 4) + " 25 L " + (x + 8) + ' 110" fill="none" stroke="var(--med)" stroke-width="2.5"/>';
          }
          s += '<text x="' + (W - 12) + '" y="20" text-anchor="end" font-size="11" fill="var(--tinta-suave)">' + n + " impulsos — todos de la MISMA altura</text>";
        } else {
          s += '<text x="' + (W / 2) + '" y="70" text-anchor="middle" font-size="13" fill="var(--tinta-tenue)">— silencio: estímulo bajo el umbral —</text>';
        }
        s += "</svg>";
        cont.querySelector("#tn-lienzo").innerHTML = s;
        cont.querySelector("#tn-nota").innerHTML = i < 40 ?
          "Estímulo " + i + " &lt; umbral 40: <strong>nada</strong>. No existen medios impulsos." :
          "Estímulo " + i + " ≥ umbral: respuesta <strong>completa</strong>. Apretar más fuerte no agranda el impulso: lo repite más veces.";
      }
      rango.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-todo-o-nada", icono: "⚡", titulo: "Silencio o espiga", ley: "todo-o-nada",
      resumen: "Sube el estímulo poco a poco y descubre el interruptor neuronal.", render: renderTodoONada
    });
  })();

  (function () {
    function renderMendel(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Progenitor 1:</label><select id="me-p1"><option value="AA">AA (ojos marrones puros)</option><option value="Aa" selected>Aa (marrones, porta claro)</option><option value="aa">aa (ojos claros)</option></select>' +
        '<label>Progenitor 2:</label><select id="me-p2"><option value="AA">AA (ojos marrones puros)</option><option value="Aa" selected>Aa (marrones, porta claro)</option><option value="aa">aa (ojos claros)</option></select>' +
        "</div>" +
        '<div class="lienzo-sim" id="me-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="me-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">El cuadro de Punnett: cada progenitor aporta un alelo al azar. «A» (marrón) domina sobre «a» (claro). Cruza dos portadores y verás la célebre proporción 3:1... y por qué dos padres de ojos marrones pueden tener un hijo de ojos claros.</p>';
      function pintar() {
        var p1 = cont.querySelector("#me-p1").value.split("");
        var p2 = cont.querySelector("#me-p2").value.split("");
        var hijos = [];
        p1.forEach(function (a1) {
          p2.forEach(function (a2) {
            var g = [a1, a2].sort().join("");
            hijos.push(g === "Aa" || g === "AA" || g === "aa" ? g : g);
          });
        });
        function color(g) { return g.indexOf("A") !== -1 ? "#7c4a1e" : "#7ab3d4"; }
        function fenotipo(g) { return g.indexOf("A") !== -1 ? "marrones" : "claros"; }
        var s = '<table class="tabla-sim" style="max-width:340px;margin:0 auto;text-align:center"><tr><th></th><th>' + p2[0] + "</th><th>" + p2[1] + "</th></tr>";
        for (var f = 0; f < 2; f++) {
          s += "<tr><th>" + p1[f] + "</th>";
          for (var c = 0; c < 2; c++) {
            var g = [p1[f], p2[c]].sort().join("");
            s += '<td style="padding:10px"><span style="display:inline-block;width:56px;padding:8px 0;border-radius:8px;background:' + color(g) + ';color:#fff;font-weight:700">' + g + "</span></td>";
          }
          s += "</tr>";
        }
        s += "</table>";
        cont.querySelector("#me-lienzo").innerHTML = s;
        var marrones = hijos.filter(function (g) { return g.indexOf("A") !== -1; }).length;
        cont.querySelector("#me-nota").innerHTML = "Descendencia esperada: <strong>" + marrones + " de 4</strong> con ojos marrones, <strong>" + (4 - marrones) + " de 4</strong> con ojos claros" +
          (marrones === 3 ? " — la proporción 3:1 del huerto de Mendel." : marrones === 4 && (cont.querySelector("#me-p1").value === "Aa" || cont.querySelector("#me-p2").value === "Aa") ? " — pero la mitad porta el alelo claro en silencio." : ".");
      }
      cont.querySelector("#me-p1").addEventListener("change", pintar);
      cont.querySelector("#me-p2").addEventListener("change", pintar);
      pintar();
    }
    registrar({
      id: "sim-mendel", icono: "🫛", titulo: "El huerto de Mendel", ley: "mendel",
      resumen: "Cruza genotipos en un cuadro de Punnett y predice a los hijos.", render: renderMendel
    });
  })();

  (function () {
    function renderCourvoisier(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label><input type="checkbox" id="cv-ictericia" checked disabled> Ictericia (piel amarilla)</label>' +
        '<label><input type="checkbox" id="cv-palpable"> Vesícula palpable y distendida</label>' +
        '<label><input type="checkbox" id="cv-dolor"> Dolor intenso tipo cólico</label>' +
        "</div>" +
        '<div class="lienzo-sim" id="cv-lienzo"></div>' +
        '<p class="nota-sim">Combina los signos de la exploración. La lógica de Courvoisier: los cálculos inflaman la vesícula durante años y la dejan fibrosa (no se dilata, duele); una obstrucción tumoral lenta la deja dilatarse sin dolor. Un signo con las manos que ordena diagnósticos graves.</p>';
      function pintar() {
        var palpable = cont.querySelector("#cv-palpable").checked;
        var dolor = cont.querySelector("#cv-dolor").checked;
        var dx, detalle, color;
        if (palpable && !dolor) {
          dx = "🚨 Sospecha de obstrucción tumoral (cabeza de páncreas)";
          detalle = "Ley de Courvoisier en estado puro: vesícula grande, tensa e indolora + ictericia = probablemente NO son cálculos. Prioridad: TAC y derivación urgente.";
          color = "var(--med)";
        } else if (!palpable && dolor) {
          dx = "Probable coledocolitiasis (cálculo en la vía biliar)";
          detalle = "Dolor cólico + vesícula fibrosa que no se palpa: la historia clásica de la piedra. Ecografía y extracción endoscópica.";
          color = "var(--ges)";
        } else if (palpable && dolor) {
          dx = "Cuadro mixto: colecistitis sobre obstrucción";
          detalle = "La combinación existe (la ley es orientativa, no infalible): vesícula distendida e inflamada a la vez. Se estudia con imagen urgente.";
          color = "var(--ges)";
        } else {
          dx = "Ictericia sin datos vesiculares";
          detalle = "Sin vesícula palpable ni dolor: pensar también en causas hepáticas (hepatitis, fármacos — mira la ley de Hy). La exploración dirige el siguiente paso.";
          color = "var(--tec)";
        }
        cont.querySelector("#cv-lienzo").innerHTML =
          '<p class="marcador" style="color:' + color + '">' + dx + "</p><p style='color:var(--tinta-suave)'>" + detalle + "</p>";
      }
      cont.querySelector("#cv-palpable").addEventListener("change", pintar);
      cont.querySelector("#cv-dolor").addEventListener("change", pintar);
      pintar();
    }
    registrar({
      id: "sim-courvoisier", icono: "🖐️", titulo: "El signo de la vesícula", ley: "courvoisier",
      resumen: "Explora a un paciente ictérico combinando signos con las manos.", render: renderCourvoisier
    });
  })();

  (function () {
    function renderHy(cont) {
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<label>Transaminasas (ALT): <strong id="hy-alt">2</strong>× el límite</label>' +
        '<input type="range" id="hy-ralt" min="1" max="20" value="2">' +
        '<label>Bilirrubina: <strong id="hy-bil">1</strong>× el límite</label>' +
        '<input type="range" id="hy-rbil" min="1" max="10" value="1">' +
        "</div>" +
        '<div class="lienzo-sim" id="hy-lienzo"></div>' +
        '<p class="nota-sim">Criterios de la ley de Hy para un fármaco en ensayo: ALT ≥ 3× + bilirrubina ≥ 2× sin otra causa = lesión hepática grave con ~10% de mortalidad. Dos «casos de Hy» pueden tumbar el desarrollo entero de un medicamento.</p>';
      var ralt = cont.querySelector("#hy-ralt"), rbil = cont.querySelector("#hy-rbil");
      function pintar() {
        var alt = +ralt.value, bil = +rbil.value;
        cont.querySelector("#hy-alt").textContent = alt;
        cont.querySelector("#hy-bil").textContent = bil;
        var citolisis = alt >= 3, ictericia = bil >= 2;
        var caso = citolisis && ictericia;
        cont.querySelector("#hy-lienzo").innerHTML =
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">' +
          '<div style="padding:10px;border-radius:8px;border:2px solid ' + (citolisis ? "var(--med)" : "var(--borde)") + '">Daño hepatocelular (ALT ≥ 3×): <strong>' + (citolisis ? "SÍ" : "no") + "</strong></div>" +
          '<div style="padding:10px;border-radius:8px;border:2px solid ' + (ictericia ? "var(--med)" : "var(--borde)") + '">Ictericia (bilirrubina ≥ 2×): <strong>' + (ictericia ? "SÍ" : "no") + "</strong></div></div>" +
          '<p class="marcador" style="text-align:center;color:' + (caso ? "var(--error)" : "var(--ok)") + '">' +
          (caso ? "🚨 CASO DE HY: el hígado ha perdido su reserva funcional. Mortalidad ≥ 10%. El comité de seguridad detiene el ensayo." :
            citolisis ? "Elevación enzimática aislada: vigilancia estrecha, aún con reserva hepática." :
              "Perfil hepático tranquilizador.") + "</p>";
      }
      ralt.addEventListener("input", pintar);
      rbil.addEventListener("input", pintar);
      pintar();
    }
    registrar({
      id: "sim-hy", icono: "🧪", titulo: "El centinela del hígado", ley: "hy",
      resumen: "Ajusta las analíticas de un ensayo clínico y decide si se detiene.", render: renderHy
    });
  })();

  registrar({
    id: "sim-kraepelin", icono: "📈", titulo: "El curso lo es todo", ley: "kraepelin",
    resumen: "Dos psicosis con síntomas iguales hoy: síguelas veinte años.",
    render: simCurva({
      controles: [{ id: "t", etiqueta: "Años de seguimiento", min: 0, max: 20, valor: 6 }],
      grafico: function (v) {
        var esq = [], bip = [];
        for (var t = 0; t <= 20; t += 0.25) {
          esq.push({ x: t, y: 88 - 40 * (1 - Math.exp(-t / 6)) - 6 * Math.max(0, Math.sin(t * 1.1)) });
          bip.push({ x: t, y: 86 - 38 * Math.max(0, Math.sin(t * 1.35 + 0.4)) * Math.exp(-((t * 1.35 + 0.4) % (Math.PI)) * 0) * (Math.sin(t * 1.35 + 0.4) > 0 ? 1 : 0) });
        }
        return {
          series: [
            { nombre: "Curso deteriorante y continuo (esquizofrenia)", color: "var(--med)", puntos: esq },
            { nombre: "Curso episódico con recuperación (bipolar)", color: "var(--tec)", puntos: bip }
          ], xMax: 20, yMin: 20, yMax: 100, xEtiq: "Años", yEtiq: "Funcionamiento global",
          marcas: [{ x: v.t, y: 88 - 40 * (1 - Math.exp(-v.t / 6)) - 6 * Math.max(0, Math.sin(v.t * 1.1)) }]
        };
      },
      nota: function (v) {
        return v.t < 2 ? "Hoy, en la consulta, ambos pacientes tienen delirios idénticos: los síntomas no bastan." :
          v.t < 10 ? "Con los años, las trayectorias se separan: una declina de forma continua, la otra oscila y se recupera entre episodios." :
            "El curso y el desenlace —no la foto del momento— separan las dos grandes psicosis: la intuición fundadora de la psiquiatría moderna.";
      },
      pie: "Kraepelin clasificó por trayectoria, no por síntoma: demencia precoz (esquizofrenia) frente a locura maníaco-depresiva (bipolar). El DSM y la CIE descienden de esta dicotomía."
    })
  });

  (function () {
    function renderKandel(cont) {
      var estado = { actividad: 90, sesiones: 0, farmacos: 0 };
      cont.innerHTML =
        '<div class="fila-controles">' +
        '<button class="boton-sim" id="ka-terapia">🛋️ Sesión de psicoterapia</button>' +
        '<button class="boton-sim" id="ka-farmaco">💊 Semana de medicación</button>' +
        '<button class="boton-sim secundario" id="ka-reset">Reiniciar</button>' +
        "</div>" +
        '<div class="lienzo-sim" id="ka-lienzo" style="text-align:center"></div>' +
        '<p class="marcador" id="ka-nota" style="text-align:center"></p>' +
        '<p class="nota-sim">Un circuito cerebral hiperactivo (ansiedad patológica: actividad 90, normal ≤ 45). Trátalo con palabras o con fármacos: por caminos distintos, ambos cambian físicamente el mismo órgano. Eso es el principio de Kandel.</p>';
      function pintar() {
        var a = estado.actividad;
        var color = a > 70 ? "var(--med)" : a > 45 ? "var(--ges)" : "var(--est)";
        var s = '<svg viewBox="0 0 460 150" style="max-width:460px;margin:0 auto">';
        var w = 2 + (a / 100) * 8;
        s += '<circle cx="110" cy="75" r="34" fill="var(--superficie)" stroke="' + color + '" stroke-width="3"/><text x="110" y="80" text-anchor="middle" font-size="11" fill="var(--tinta)">amígdala</text>';
        s += '<circle cx="350" cy="75" r="34" fill="var(--superficie)" stroke="' + color + '" stroke-width="3"/><text x="350" y="80" text-anchor="middle" font-size="11" fill="var(--tinta)">córtex</text>';
        s += '<line x1="144" y1="75" x2="316" y2="75" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round" opacity="0.8"/>';
        s += "</svg>";
        cont.querySelector("#ka-lienzo").innerHTML = s;
        cont.querySelector("#ka-nota").innerHTML = "Actividad del circuito: <strong style='color:" + color + "'>" + nf(a, 0) + "</strong> (normal ≤ 45) · Terapia: " + estado.sesiones + " sesiones · Fármaco: " + estado.farmacos + " semanas" +
          (a <= 45 ? "<br>✔ Circuito normalizado: la palabra y la molécula esculpieron las mismas sinapsis." : "");
      }
      cont.querySelector("#ka-terapia").addEventListener("click", function () {
        estado.sesiones++;
        estado.actividad = Math.max(38, estado.actividad - 6);
        pintar();
      });
      cont.querySelector("#ka-farmaco").addEventListener("click", function () {
        estado.farmacos++;
        estado.actividad = Math.max(40, estado.actividad - 8);
        pintar();
      });
      cont.querySelector("#ka-reset").addEventListener("click", function () {
        estado = { actividad: 90, sesiones: 0, farmacos: 0 };
        pintar();
      });
      pintar();
    }
    registrar({
      id: "sim-kandel", icono: "🛋️", titulo: "La palabra que esculpe", ley: "kandel",
      resumen: "Trata un circuito ansioso con terapia o fármacos: ambos cambian el cerebro.", render: renderKandel
    });
  })();

})();
