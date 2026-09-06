# 📋 ESTADO DEL PROYECTO — Leyes de la Vida

> Bitácora interna de avance. Última actualización: 2026-09-06.

## Dónde estamos

Proyecto: atlas interactivo de leyes epónimas. Publicado en:
- Repo: https://github.com/Jeshua-Romero-Guadarrama/leyes-de-la-vida
- Web: https://jeshua-romero-guadarrama.github.io/leyes-de-la-vida/
- Local: `docker compose up -d` → http://localhost:8080
- Autor único en todos los commits: Jeshua Romero Guadarrama (sin menciones de IA).

## Hecho ✅

1. **Catálogo**: 141 leyes en 10 disciplinas (`js/datos.js`):
   - Economía (16), Psicología (13), Sociología (17), Gestión (13), Tecnología (14),
     Estadística (10), Medicina (17), **Física (17)**, **Química (12)**, **Biología (12)**.
2. **Interactivos 1:1** (cada ley tiene el suyo), repartidos en:
   - `js/interactivos.js` — 17 originales + utilidades compartidas (`window.UTILSIM`: gráficos SVG, fábricas).
   - `js/interactivos-extra1.js` — fábricas `simCurva`/`simAdivina` + eco/tec/psi.
   - `js/interactivos-extra2.js` — soc/ges/est/med.
   - `js/interactivos-extra3.js` — ampliación a 100 (Overton, Simpson, cumpleaños, Monro-Kellie...).
   - `js/interactivos-extra4.js` — FÍSICA con animaciones rAF (helper `UTILSIM.animar`):
     barco de Arquímedes ⛵, globo aerostático 🎈, péndulo, Doppler, Kepler, gas de Boyle,
     entropía, Ohm, Hooke, Snell, inercia, F=ma, acción-reacción...
   - `js/interactivos-extra5.js` — QUÍMICA y BIOLOGÍA: burbujas de Henry 🥤, Lavoisier,
     Le Chatelier, tabla periódica, polillas de Darwin 🦋, barril de Liebig, Gause...
3. **Rediseño UI/UX + colorimetría** (`css/estilos.css`): tipografía serif editorial en títulos,
   degradados (`--grad-acento`), franja arcoíris en cabecera, focus-visible, scrollbar,
   `prefers-reduced-motion`, tarjetas con tinte por categoría, tema oscuro afinado.
   Colores nuevos: `--fis` naranja, `--qui` lima, `--bio` verde azulado.
4. Modo estudio (quiz), buscador, filtros, tema claro/oscuro, PWA, Docker+nginx.

## En curso 🔧

✅ TODO COMPLETADO en la tanda del 2026-09-06:
app.js (chips con contador, 🎲 al azar, iconos), index.html (scripts extra3/4/5 enlazados,
SEO completo: meta, OG, Twitter, canonical, JSON-LD, noscript), robots.txt, sitemap.xml,
sw.js v4, README actualizado, Docker verificado (todo 200), paridad 141=141 verificada,
commit + push como Jeshua Romero Guadarrama.

## Pendiente futuro 💡 (peticiones del usuario aún no completadas)

- El usuario pidió «100 leyes por disciplina» (~1000 en total): inviable de una tanda con calidad.
  Plan propuesto: ampliar por tandas de 20-30 leyes por disciplina en sesiones sucesivas,
  manteniendo el 1:1 ley↔interactivo. Prioridad sugerida: física/química/biología hasta ~30,
  luego igualar el resto.
- Posibles mejoras: URLs legibles por ley para SEO real por página (requiere prerender o
  páginas estáticas generadas), compartir en redes con OG por ley, PWA instalable con iconos PNG.

## Convenciones del proyecto

- Vanilla JS (sin frameworks, sin CDNs), español neutro, todo offline.
- Cada ley: `{id, nombre, autor, anio, cat, enunciado, explicacion, ejemplo, tags, rel}`.
- Cada interactivo: `{id, icono, titulo, ley, resumen, render(cont)}` registrado con `UTILSIM.registrar`.
- Animaciones: `UTILSIM.animar(cont, fn)` — el bucle muere solo cuando `cont` sale del DOM.
- La correspondencia ley↔interactivo se valida con el script Node de paridad antes de cada publicación.
