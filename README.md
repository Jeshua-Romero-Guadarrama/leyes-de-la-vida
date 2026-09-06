# ⚖️ Leyes de la Vida

**Atlas interactivo de leyes epónimas**: un catálogo navegable de las leyes, principios y regularidades más célebres de **diez disciplinas** (20 leyes por cada una, 200 en total) —economía, psicología, sociología, gestión, tecnología, estadística, medicina/psiquiatría, **física, química y biología**— con juegos, simuladores, animaciones y modo estudio.

De la **ley de Parkinson** («el trabajo se expande hasta llenar el tiempo disponible») a la **ley de Goodhart**, del **principio de Arquímedes** (con su barco ⛵ y su globo aerostático 🎈 animados) a la **selección natural de Darwin** (con sus polillas del abedul 🦋), pasando por **Gresham**, **Sturgeon**, **Pournelle**, **Benford**, **Zipf**, **Dunning-Kruger**, **Kepler**, **Le Chatelier**, **Mendel** y muchas más.

🌐 **Web**: https://jeshua-romero-guadarrama.github.io/leyes-de-la-vida/

**Autor:** [Jeshua Romero Guadarrama](https://github.com/Jeshua-Romero-Guadarrama)

---

## ✨ Características

- 📖 **Catálogo de 200 leyes en 10 disciplinas (20 por cada una)** con enunciado, explicación, ejemplo cotidiano, autoría, año y leyes relacionadas.
- 🔍 **Buscador con filtros** por disciplina, contadores y botón 🎲 «ley al azar».
- 🕹️ **Un juego, simulador o animación por cada ley** (correspondencia 1:1 verificada). Algunos destacados:
  - ⛵ El barco de acero que flota y 🎈 el globo aerostático (Arquímedes y Charles, animados)
  - 🕰️ El péndulo de Galileo, 🚑 el efecto Doppler y 🪐 las elipses de Kepler (animados)
  - 🧯 Cuarenta moléculas apretadas (Boyle) y 🎬 la película irreversible de la entropía
  - 🥤 El «pssshhh» de la ley de Henry y ⚖️ la balanza incorruptible de Lavoisier
  - 🦋 Las polillas del abedul (Darwin), 🛢️ el barril de Liebig y 🦊 las orejas del zorro (Allen)
  - ⏳ El trabajo que se expande (Parkinson) y 🎯 la métrica corrompida (Goodhart)
  - 🪙 Dinero malo, dinero bueno (Gresham) y 🏰 la toma del castillo (Pournelle)
  - 🚦 Reacción con opciones (Hick), 🎯 cazar dianas (Fitts) y 🔢 la prueba del 7±2 (Miller)
  - 🕵️ El detector de fraudes (Benford), 📚 el analizador de textos (Zipf) y 🔀 la paradoja de Simpson
  - 🗳️ El voto útil (Duverger), 🪟 la ventana de Overton y 🎭 ¿parodia o en serio? (Poe)
  - 🖐️ El signo de la vesícula (Courvoisier), 🫛 el huerto de Mendel y 🧠 la caja rígida (Monro-Kellie)
- 🎓 **Modo estudio**: partidas de 10 preguntas mezclando enunciados textuales y escenarios de la vida real, con explicación en cada respuesta.
- 🌙 **Tema claro/oscuro** con memoria de preferencia.
- 📴 **Funciona sin conexión** (service worker + manifest PWA).
- 🧩 **Cero dependencias externas**: HTML, CSS y JavaScript puros; todo el contenido vive en el repositorio.

## 🚀 Uso

### Abrir directamente

Basta con abrir `index.html` en cualquier navegador moderno. No requiere servidor ni instalación.

### Servir en local

```bash
# Con Python
python -m http.server 8080

# Con Node
npx serve .
```

### 🐳 Docker

```bash
docker compose up -d
# → http://localhost:8080
```

o sin compose:

```bash
docker build -t leyes-de-la-vida .
docker run -d -p 8080:80 --name leyes-de-la-vida leyes-de-la-vida
```

### GitHub Pages

El sitio es 100 % estático: activa GitHub Pages sobre la rama principal y quedará publicado tal cual.

## 📁 Estructura

```
├── index.html            # Punto de entrada único (SPA con rutas por hash)
├── css/
│   └── estilos.css       # Tokens de diseño, disposición y componentes
├── js/
│   ├── datos.js               # Catálogo completo de leyes (contenido)
│   ├── interactivos.js        # Juegos y simuladores principales + gráficos SVG compartidos
│   ├── interactivos-extra1.js # Fábricas reutilizables + economía, tecnología y psicología
│   ├── interactivos-extra2.js # Sociología, gestión, estadística y medicina
│   ├── interactivos-extra3.js # Ampliación (Overton, Simpson, Monro-Kellie...)
│   ├── interactivos-extra4.js # Física con animaciones (barco, globo, péndulo, Doppler...)
│   ├── interactivos-extra5.js # Química y biología (Henry, Lavoisier, Darwin, Liebig...)
│   ├── interactivos-extra6.js # Ampliación a 200: eco/tec/psi/soc/ges (Stroop, Lindy...)
│   ├── interactivos-extra7.js # Ampliación: estadística/medicina/física (Monty Hall, Bayes...)
│   ├── interactivos-extra8.js # Ampliación: química/biología (Graham, Lotka-Volterra...)
│   ├── quiz.js                # Modo estudio
│   └── app.js            # Navegación, catálogo, modal, arranque
├── sw.js                 # Service worker (sin conexión)
├── manifest.webmanifest  # Manifiesto PWA
├── Dockerfile            # Imagen nginx con el sitio estático
└── docker-compose.yml    # Orquestación local
```

## ⚠️ Nota

Contenido divulgativo: las «leyes» aquí recogidas son principios empíricos, heurísticas y regularidades célebres, no leyes exactas de la naturaleza. Cada ficha indica autor y año, y señala cuando la formulación popular difiere del hallazgo original.

## 📄 Licencia

© Jeshua Romero Guadarrama. Contenido divulgativo de elaboración propia.
