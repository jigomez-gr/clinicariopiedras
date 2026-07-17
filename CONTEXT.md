# Contexto del Proyecto: Clínica Dental Ríos Piedras

Este documento detalla el contexto del proyecto, su estructura general y las configuraciones técnicas necesarias para su correcto funcionamiento.

## Descripción General
La aplicación es una landing page premium e interactiva para la **Clínica Dental Ríos Piedras** (fundada en 1985 en Madrid). Está integrada con un sistema de reserva de citas, pasarela de pagos simulada con Stripe, y un asistente virtual por canales de comunicación.

---

## Ficha Técnica y Dependencias

- **Framework Principal**: Next.js 16.2.10 (con compilador Turbopack)
- **Biblioteca de UI**: React 19.2.4 y React DOM 19.2.4
- **ORM / Base de Datos**: Prisma 6.4.0 con soporte para PostgreSQL
- **Pasarela de Pago**: Stripe 22.3.0 (`@stripe/stripe-js` 9.9.0)
- **Estilos**: CSS Vanilla customizado + Tailwind CSS v4 (`tailwindcss` 4.0.0 y `@tailwindcss/postcss` 4)
- **Iconografía**: Lucide React (`lucide-react`) y FontAwesome CSS (6.4.0 cargado mediante CDN de cdnjs)

---

## Variables de Entorno (.env)
Las siguientes variables son obligatorias para el correcto funcionamiento local e internacional de la aplicación:

- `DATABASE_URL`: Cadena de conexión al servidor de base de datos PostgreSQL.
- `STRIPE_PUBLIC_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`: Credenciales de la API de Stripe para cobros y webhook de estado.
- `NEXT_PUBLIC_APPMVCCLINICA`: Dirección base del portal MVC de clientes.
- `NEXT_PUBLIC_CLINICA_URL`: Dirección base de la clínica utilizada para la construcción de URLs dinámicas del simulador de citas (`https://clinicadentalriopiedras.n8njigretera.cloud/`).

---

## Estructura de Archivos Clave

- **[/src/app/page.tsx](file:///c:/tmp/antigraviti/clinicariopiedras/caso1/src/app/page.tsx)**: Componente React cliente principal de la aplicación. Gestiona la lógica del reproductor de vídeo del Hero, sincronización de subtítulos, carruseles de tecnología, y estados de apertura del asistente virtual.
- **[/src/app/globals.css](file:///c:/tmp/antigraviti/clinicariopiedras/caso1/src/app/globals.css)**: Hoja de estilos principal con los tokens de diseño (colores, fuentes, sombras) y clases auxiliares.
- **[/index-prototipo.html](file:///c:/tmp/antigraviti/clinicariopiedras/caso1/index-prototipo.html)** y **[/public/index.html](file:///c:/tmp/antigraviti/clinicariopiedras/caso1/public/index.html)**: Versiones de prototipo estático en HTML5 y JS puro utilizadas para pruebas rápidas de maquetación de frontend sin requerir compilación de Next.js.
