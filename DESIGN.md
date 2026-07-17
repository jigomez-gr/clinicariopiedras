# Guía de Diseño y UI: Clínica Dental Ríos Piedras

Este documento detalla las directrices estéticas, paleta de colores, tipografías y reglas de comportamiento responsivo de la interfaz del portal.

---

## Paleta de Colores (Design Tokens)
La paleta está calibrada en torno a los colores reales corporativos (azul y rojo) combinados con un fondo crema tipo editorial premium:

- **Fondo Principal (Crema)**: `--crema: #F7F1E6` (un tono cálido que suaviza la lectura en comparación con el blanco puro).
- **Fondo Secundario (Crema 2)**: `--crema-2: #EFE7D7` (utilizado en franjas y secciones para jerarquizar contenidos).
- **Color Primario (Azul)**: `--azul: #1E4B94` (azul corporativo principal de la clínica).
- **Azul Oscuro / Textos**: `--azul-osc: #12326A` y `--azul-oscurisimo: #0B1F45`.
- **Color de Acento (Rojo)**: `--rojo: #D93844` (utilizado para CTAs principales y elementos de atención prioritaria).
- **Rojo Oscuro**: `--rojo-osc: #A82A34`.
- **Textos Suaves**: `--tinta-suave: #5A5F6B`.
- **Líneas y Bordes**: `--linea: rgba(30, 75, 148, .14)`.

---

## Tipografías
Se utilizan dos familias tipográficas desde Google Fonts para lograr un balance entre seriedad y estética de marca:

- **Titulares**: `--display: var(--font-fraunces), Georgia, serif` (Fuente Fraunces de estilo romana moderna, ideal para títulos elegantes y amplios).
- **Cuerpo de texto**: `--sans: var(--font-instrument-sans), sans-serif` (Fuente Instrument Sans, limpia e idónea para textos pequeños y medianos legibles).

---

## Componentes Singulares y Comportamientos

### 1. Burbuja de Asistente Flotante (`.assistant-btn`)
- **Posicionamiento**: Fijo a la esquina inferior derecha (`bottom: 1.4rem; right: 1.4rem; z-index: 60`).
- **Comportamiento**: Al hacer clic, abre un panel lateral flotante (`.assistant.open`) con opciones de contacto por WhatsApp, Telegram, email o web. Al abrirse, la burbuja de asistente se oculta temporalmente.

### 2. Botón de Simulador de Citas / Diagnóstico (`.simulador-btn`)
- **Posicionamiento**: Fijo a la izquierda de la burbuja del asistente (`right: 5.8rem`), alineado en el mismo eje inferior (`bottom: 1.4rem`).
- **Interacción**: Al hacer clic, redirige al simulador público de diagnósticos. Al abrir el panel del asistente, este botón también se oculta para no superponerse ni entorpecer el panel lateral.
- **Diseño**: Inspirado en los botones outline de Bootstrap con fondo blanco, bordes y texto azul, e iconos de FontAwesome.
- **Efecto Hover**: Cambia a fondo azul completo, texto blanco y realiza una micro-animación de elevación en el eje Y (`translateY(-2px)`).

---

## Comportamiento Responsivo en Dispositivos Móviles
A partir de resoluciones inferiores a **520px** de ancho:

- **Burbuja de Asistente**: Reduce sus dimensiones a `52px` y se ajusta con una separación de `1rem`.
- **Botón de Diagnóstico**:
  - El ancho máximo se restringe a `calc(100vw - 6.5rem)` para evitar que se desborde del margen izquierdo de la pantalla.
  - La altura se define como dinámica (`height: auto`), permitiendo que el texto largo del titular ("Solicitar diagnóstico con apoyo Inteligencia Artificial") se ajuste en múltiples líneas.
  - Se reduce el tamaño de las fuentes (`0.75rem` para el título principal y `0.62rem` para el subtexto) y los espaciados internos.
  - El subtexto descriptivo se mantiene siempre visible (`display: block !important`) satisfaciendo el requerimiento de no ocultar información en pantallas táctiles.
