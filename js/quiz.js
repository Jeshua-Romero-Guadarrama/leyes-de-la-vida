/* ==========================================================================
   Leyes de la Vida — Modo estudio (quiz)
   Autor: Jeshua Romero Guadarrama
   Dos tipos de pregunta: enunciado → ley, y escenario cotidiano → ley.
   ========================================================================== */

(function () {
  "use strict";

  /* Escenarios cotidianos redactados a mano (ley correcta por id). */
  var ESCENARIOS = [
    { ley: "parkinson", texto: "Te dan un mes para un informe que requiere tres días de trabajo... y lo entregas justo al mes, tras semanas de aplazarlo y retocarlo." },
    { ley: "sturgeon", texto: "Alguien desprecia los pódcast porque «casi todos son malísimos». Le respondes que eso mismo pasa con los libros, las películas y todo lo demás." },
    { ley: "goodhart", texto: "Un hospital empieza a premiar «altas rápidas»; pronto los pacientes salen antes... y reingresan el doble. El indicador mejora, la salud no." },
    { ley: "gresham", texto: "En un mercado con monedas de plata auténticas y monedas rebajadas del mismo valor legal, la gente paga con las rebajadas y guarda las de plata." },
    { ley: "pournelle", texto: "En una ONG, quienes reparten la ayuda pierden peso frente a quienes gestionan comités, normativa y presupuesto, que acaban dirigiéndolo todo." },
    { ley: "peter", texto: "La mejor programadora del equipo asciende a gerente... y resulta una gerente mediocre. Ahí se queda, sin más ascensos." },
    { ley: "murphy", texto: "El conector cabía de dos maneras y, naturalmente, alguien lo enchufó al revés. El nuevo diseño solo permite una." },
    { ley: "hofstadter", texto: "Presupuestaste seis semanas para la reforma «contando ya con retrasos»... y aun así lleva cuatro meses." },
    { ley: "brooks", texto: "El proyecto va tarde y la dirección mete a seis personas nuevas. Dos meses después va todavía más tarde." },
    { ley: "hick", texto: "En el restaurante con carta de 90 platos tardas un cuarto de hora en decidir; en el menú de 6, medio minuto." },
    { ley: "fitts", texto: "Fallas una y otra vez al pulsar el diminuto botón de «cerrar anuncio», colocado a propósito lejos y pequeño." },
    { ley: "dunning-kruger", texto: "Tras dos vídeos sobre bolsa, tu cuñado se declara inversor experto; el gestor con veinte años de oficio habla con prudencia." },
    { ley: "yerkes-dodson", texto: "Con nervios moderados bordas el examen; el día que entraste en pánico te quedaste en blanco." },
    { ley: "ebbinghaus", texto: "Repasaste el vocabulario 10 minutos hoy, mañana y en una semana, y lo retienes mejor que tu amigo que estudió tres horas de golpe." },
    { ley: "weber-fechner", texto: "Notas al instante que suben el café de 1€ a 1,50€, pero te da igual que el coche cueste 50€ más." },
    { ley: "campbell", texto: "Desde que el sueldo de los docentes depende de un examen estandarizado, las clases se dedican a entrenar el examen y aparecen trampas." },
    { ley: "cunningham", texto: "Nadie respondía tu pregunta en el foro; publicaste una solución equivocada a propósito y en diez minutos tres expertos te corrigieron con la buena." },
    { ley: "brandolini", texto: "Un bulo de diez palabras arrasa en redes; el desmentido documentado, con veinte fuentes, apenas lo lee nadie." },
    { ley: "godwin", texto: "El hilo iba de carriles bici y, doscientos comentarios después, alguien compara al ayuntamiento con el Tercer Reich." },
    { ley: "betteridge", texto: "Titular: «¿Ha descubierto la NASA vida en Marte?». Sin leer el artículo, ya sabes la respuesta." },
    { ley: "hanlon", texto: "Tu jefe no te invitó a la reunión. Antes de suponer una conspiración, compruebas si simplemente se le olvidó. (Se le olvidó.)" },
    { ley: "occam", texto: "No enciende la lámpara: antes de sospechar un sabotaje del vecino, miras si está desenchufada." },
    { ley: "benford", texto: "El auditor sospecha de la contabilidad porque los primeros dígitos de las facturas se reparten uniformemente en vez de empezar por 1 un tercio de las veces." },
    { ley: "zipf", texto: "Con solo las 100 palabras más comunes del inglés entiendes la mitad de cualquier conversación." },
    { ley: "pareto", texto: "El 20% de los clientes de la tienda genera el 80% de la facturación." },
    { ley: "grandes-numeros", texto: "El casino perdió contra un cliente afortunado esta noche, pero al cabo de un millón de apuestas su ventaja es una certeza contable." },
    { ley: "regresion-media", texto: "El delantero salió en portada tras su mejor racha; desde entonces «juega peor». En realidad, juega a su nivel de siempre." },
    { ley: "littlewood", texto: "Pensaste en una amiga y llamó a los cinco minutos. Antes de gritar milagro, cuentas cuántas veces piensas en gente que no llama." },
    { ley: "twyman", texto: "Las ventas «se dispararon» un 400% el martes. Antes de celebrarlo, descubres que ese día se duplicó la base de datos." },
    { ley: "trivialidad", texto: "El comité aprobó en cinco minutos un presupuesto millonario y debatió cuarenta sobre el color del logotipo." },
    { ley: "sutton", texto: "Ante tos, fiebre y dolor torácico, el médico pide primero una radiografía buscando neumonía, no una resonancia buscando rarezas." },
    { ley: "cuidados-inversos", texto: "Las clínicas mejor dotadas se concentran en los barrios más sanos y ricos; el barrio con más enfermos tiene la consulta más saturada." },
    { ley: "laplace-medicina", texto: "El cirujano vascular explica que operan el aneurisma al superar cierto diámetro: a más radio, más tensión de pared, más riesgo de rotura." },
    { ley: "frank-starling", texto: "Al hacer ejercicio llega más sangre al corazón, y este, sin orden externa alguna, bombea más fuerte en cada latido." },
    { ley: "conway", texto: "La aplicación tiene tres estilos de interfaz distintos... exactamente uno por cada equipo que la desarrolló." },
    { ley: "metcalfe", texto: "La nueva mensajería es técnicamente mejor, pero nadie se pasa a ella: sin contactos dentro, no vale nada." },
    { ley: "jevons", texto: "Las bombillas LED gastan diez veces menos... y ahora iluminamos fachadas, jardines y armarios: el consumo total no bajó." },
    { ley: "moore", texto: "Tu teléfono de bolsillo supera al superordenador más potente de los años noventa." },
    { ley: "duverger", texto: "En ese país con mayoría simple a una vuelta, votar a un tercer partido se considera «tirar el voto» y llevan un siglo con dos partidos." },
    { ley: "michels", texto: "La asamblea nació horizontal y sin jefes; cinco años después, «los de siempre» controlan la directiva, la agenda y los fondos." },
    { ley: "gall", texto: "El megaproyecto informático diseñado completo desde cero fracasó; el sistema que funciona empezó siendo una herramienta minúscula que creció." },
    { ley: "illich", texto: "En la hora catorce del turno cometes más errores de los que resuelves: trabajar más está produciendo menos." }
  ];

  function barajar(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function porId(id) {
    for (var i = 0; i < window.LEYES.length; i++) if (window.LEYES[i].id === id) return window.LEYES[i];
    return null;
  }

  function opcionesPara(correcta) {
    var mismas = window.LEYES.filter(function (l) { return l.id !== correcta.id && l.cat === correcta.cat; });
    var otras = window.LEYES.filter(function (l) { return l.id !== correcta.id && l.cat !== correcta.cat; });
    barajar(mismas); barajar(otras);
    var pool = mismas.slice(0, 2).concat(otras).slice(0, 3);
    return barajar(pool.concat([correcta]));
  }

  function generarPreguntas(n) {
    var preguntas = [];
    var escenarios = barajar(ESCENARIOS.slice()).slice(0, Math.ceil(n / 2));
    escenarios.forEach(function (e) {
      var ley = porId(e.ley);
      if (!ley) return;
      preguntas.push({ tipo: "Escenario", texto: e.texto, correcta: ley, opciones: opcionesPara(ley) });
    });
    var leyes = barajar(window.LEYES.slice());
    for (var i = 0; preguntas.length < n && i < leyes.length; i++) {
      var ley = leyes[i];
      preguntas.push({ tipo: "Enunciado", texto: "«" + ley.enunciado + "»", correcta: ley, opciones: opcionesPara(ley) });
    }
    return barajar(preguntas).slice(0, n);
  }

  window.iniciarQuiz = function (cont) {
    var TOTAL = 10;
    var preguntas, indice, aciertos;

    function inicio() {
      cont.innerHTML =
        '<div class="resultado-final">' +
        "<h2>🎓 Modo estudio</h2>" +
        '<p style="color:var(--tinta-suave)">Diez preguntas: la mitad son situaciones de la vida real y la otra mitad enunciados textuales. En ambas, identifica la ley. Cada fallo viene con su explicación.</p>' +
        '<button class="boton-sim" id="qz-empezar" style="font-size:1.05rem;padding:12px 28px">Empezar partida</button>' +
        "</div>";
      cont.querySelector("#qz-empezar").addEventListener("click", empezar);
    }

    function empezar() {
      preguntas = generarPreguntas(TOTAL);
      indice = 0;
      aciertos = 0;
      pregunta();
    }

    function pregunta() {
      var p = preguntas[indice];
      var cab = p.tipo === "Escenario" ? "¿Qué ley describe esta situación?" : "¿Qué ley se enuncia así?";
      cont.innerHTML =
        '<div class="progreso-quiz"><div style="width:' + ((indice / TOTAL) * 100) + '%"></div></div>' +
        '<p class="contexto-quiz">Pregunta ' + (indice + 1) + " de " + TOTAL + " · " + p.tipo + " · Aciertos: " + aciertos + "</p>" +
        '<p class="pregunta-quiz">' + cab + "</p>" +
        '<blockquote style="border-left:4px solid var(--acento);background:var(--superficie-2);padding:12px 16px;border-radius:0 8px 8px 0;margin:0 0 18px">' + p.texto + "</blockquote>" +
        '<div class="opciones-quiz"></div>' +
        '<div id="qz-retro"></div>' +
        '<div class="pie-quiz"><span></span><button class="boton-sim" id="qz-sig" hidden>Siguiente →</button></div>';
      var zona = cont.querySelector(".opciones-quiz");
      p.opciones.forEach(function (op) {
        var b = document.createElement("button");
        b.className = "opcion-quiz";
        b.textContent = op.nombre;
        b.addEventListener("click", function () { responder(op, b); });
        zona.appendChild(b);
      });
    }

    function responder(op, boton) {
      var p = preguntas[indice];
      var correcta = op.id === p.correcta.id;
      if (correcta) aciertos++;
      cont.querySelectorAll(".opcion-quiz").forEach(function (b) {
        b.disabled = true;
        if (b.textContent === p.correcta.nombre) b.classList.add("correcta");
      });
      if (!correcta) boton.classList.add("incorrecta");
      cont.querySelector("#qz-retro").innerHTML =
        '<div class="retro-quiz"><strong class="' + (correcta ? "bien" : "mal") + '">' +
        (correcta ? "✔ ¡Correcto!" : "✘ Era «" + p.correcta.nombre + "»") + "</strong> — " +
        p.correcta.explicacion.split(". ").slice(0, 2).join(". ") + "." +
        ' <em style="color:var(--tinta-tenue)">(' + p.correcta.autor + ", " + p.correcta.anio + ")</em></div>";
      var sig = cont.querySelector("#qz-sig");
      sig.hidden = false;
      sig.textContent = indice + 1 < TOTAL ? "Siguiente →" : "Ver resultado 🏁";
      sig.addEventListener("click", function () {
        indice++;
        if (indice < TOTAL) pregunta();
        else final();
      });
    }

    function final() {
      var frase = aciertos >= 9 ? "Meseta de la solidez: dominas las leyes." :
        aciertos >= 7 ? "Pendiente de la ilustración: muy buen nivel." :
          aciertos >= 5 ? "Vas por buen camino: repasa el catálogo y reintenta." :
            "Valle de la desesperación... que es justo donde empieza el aprendizaje.";
      cont.innerHTML =
        '<div class="resultado-final">' +
        '<span class="nota">' + aciertos + "/" + TOTAL + "</span>" +
        "<p>" + frase + "</p>" +
        '<div class="heroe-acciones">' +
        '<button class="boton-sim" id="qz-otra">Jugar otra partida</button>' +
        '<a class="boton boton-secundario" href="#/catalogo">Repasar el catálogo</a>' +
        "</div></div>";
      cont.querySelector("#qz-otra").addEventListener("click", empezar);
    }

    inicio();
  };
})();
