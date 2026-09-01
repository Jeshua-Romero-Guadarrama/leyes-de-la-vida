# ⚖️ Leyes de la Vida

**Atlas interactivo de leyes epónimas**: un catálogo navegable de las leyes, principios y regularidades más célebres de la **economía, la psicología, la sociología, la gestión, la tecnología, la estadística y la medicina/psiquiatría**, con juegos, simuladores, diagramas y modo estudio.

De la **ley de Parkinson** («el trabajo se expande hasta llenar el tiempo disponible») a la **ley de Goodhart** («cuando una medida se convierte en objetivo, deja de ser una buena medida»), pasando por **Gresham**, **Sturgeon**, **Pournelle**, **Benford**, **Zipf**, **Dunning-Kruger**, **Frank-Starling** y muchas más.

**Autor:** [Jeshua Romero Guadarrama](https://github.com/Jeshua-Romero-Guadarrama)

---

## ✨ Características

- 📖 **Catálogo de más de 80 leyes** con enunciado, explicación, ejemplo cotidiano, autoría, año y leyes relacionadas.
- 🔍 **Buscador con filtros** por disciplina (busca «plazos», «fraude», «memoria»...).
- 🕹️ **Un juego o simulador por cada ley** (86 interactivos): todas las leyes del catálogo se pueden experimentar en primera persona. Algunos destacados:
  - ⏳ El trabajo que se expande (Parkinson)
  - 💎 La criba del 90 % (Sturgeon)
  - 🎯 La métrica corrompida (Goodhart)
  - 🪙 Dinero malo, dinero bueno (Gresham)
  - 🏰 La toma del castillo (Pournelle)
  - 🚦 Juego de reacción con opciones (Hick) y 🎯 cazar dianas (Fitts)
  - 🔢 La prueba del 7±2 (Miller) y 🔺 el triángulo que no existe (Gestalt/Kanizsa)
  - 🕵️ El detector de fraudes (Benford) y 📚 el analizador de textos (Zipf)
  - 🗳️ El voto útil (Duverger), ☠️ el hilo que muere (Godwin) y 🎭 ¿parodia o en serio? (Poe)
  - 🖐️ El signo de la vesícula (Courvoisier), 🫛 el huerto de Mendel y 🫁 la ecuación de respirar (Fick)
  - 🎬 La correlación fantasma (Berkson) y 🏷️ el nombre equivocado (Stigler)
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
│   ├── interactivos.js        # Juegos y simuladores principales + gráficos SVG
│   ├── interactivos-extra1.js # Interactivos de economía, tecnología y psicología
│   ├── interactivos-extra2.js # Interactivos de sociología, gestión, estadística y medicina
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
