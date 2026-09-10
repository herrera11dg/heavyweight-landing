# HeavyWeight™ — Conversación Completa del Proyecto

**Fecha**: Septiembre 2026
**Estado**: Landing + tienda funcional desplegada en GitHub Pages
**Repo**: https://github.com/herrera11dg/heavyweight-landing
**Último commit**: `4a64981` (i18n + EUR + páginas legales en PT)

---

## Objetivo

Crear una landing page de comercio electrónico para camisetas de gimnasio de alta gramaje, con parallax 3D, tilt y flip, desplegada en GitHub con i18n (PT/EN/ES) y precios en EUR.

## Decisiones Clave del Proyecto

| Decisión | Elección |
|----------|----------|
| Marca | HeavyWeight™ (H mayúscula, W mayúscula) |
| Idioma principal | Portugués de Portugal (pt-PT) |
| Idiomas secundarios | Inglés (en), Español (es) |
| Moneda | EUR con formato localizado por idioma |
| Paleta | Cálida (no cliché rojo): `--ink:#14110d`, `--bone:#f0ead9`, `--copper:#b96a3b`, `--olive:#7a7a5c` |
| GSAP CDN | `3.12.5` (cdnjs) |
| GSAP Gate | Removido `if(!reduceMotion)` — animaciones siempre activas |
| Tilt 3D | Solo `rotationY` (horizontal) para no conflictuar con scroll parallax |
| Scroll parallax | Anima `.js-tilt` con scale/y/rotateX/opacity |
| Preserved-3d chain | `.shirt-stage` → `.shirt-zoom` → `.shirt-flip` |
| Checkout | Simulado (sin gateway real) |
| Dominio | Placeholder `TU-DOMINIO.com` |
| Pagos (pendiente) | Stripe + MB WAY/Multibanco (Lisboa) |
| Mercancía real | Ninguna — todos los nombres/precios son placeholders |

---

## Estructura Final del Proyecto

```
heavyweight/
├── index.html              # Página principal (tienda)
├── privacidade.html        # Política de privacidad (PT)
├── termos.html             # Termos e condições (PT)
├── envios.html             # Envios e devoluções (PT)
├── assets/
│   ├── css/styles.css      # Estilos completos
│   ├── js/i18n.js          # Traducciones (pt / en / es)
│   ├── js/main.js          # Lógica (GSAP + carrito)
│   └── img/
│       ├── frontal.webp            # 11KB
│       ├── frontal@2x.webp         # 31KB
│       ├── frontal.png             # Fallback PNG (377x502)
│       ├── trasera.webp            # 17KB
│       ├── trasera@2x.webp         # 41KB
│       ├── trasera.png             # Fallback PNG (377x502)
│       └── favicon.svg
├── README.md
├── LICENSE
├── .gitignore
└── HEAVYWEIGHT_CONVERSATION.md    # Este archivo
```

---

## Funcionalidades Implementadas

### Animaciones (GSAP + ScrollTrigger)
- **Parallax hero**: la camiseta crece de `scale 0.7→1.6` y se desplaza de `y 60→-140` al hacer scroll.
- **Mouse tilt 3D**: solo `rotationY` en la camiseta del hero.
- **Click-to-flip**: en la sección de destacado y en la cuadrícula de productos, clic → `rotateY(180)`.
- **Tilt independiente**: cada `.js-tilt` tiene su propio transform, no comparte estado.
- **`preserve-3d` chain**: `.shirt-stage` (perspective) → `.shirt-zoom` (scroll) → `.shirt-flip` (click flip).

### Imágenes
- **WebP con fallback PNG**: `<picture>` + `srcset` 1x/2x.
- **Lazy loading**: `loading="lazy"` + `fetchpriority="high"` en hero.
- **`ScrollTrigger.refresh()`**: llamado en `window.load` y después de carga de imágenes.

### SEO
- Meta description, Open Graph, Twitter Card, canonical, theme-color.
- Favicon SVG (placa de peso).
- `<meta>` con `data-i18n-content` para traducción dinámica.

### Tienda Funcional
- **Selector de talla**: S, M, L, XL.
- **Selector de color**: 3 swatches por producto.
- **Stock por talla**: control de disponibilidad.
- **Carrito persistente**: `localStorage`.
- **Checkout simulado**: genera número de orden `HW-XXXXXX`.
- **Badges de stock**: "Esgotado / Agotado" (PT/ES) o "Sold out" (EN).

### Accesibilidad
- `skip-link` (saltar al contenido).
- `:focus-visible` styles.
- `aria-label` en todos los botones interactivos.
- `role="dialog"` y `aria-modal` en checkout.
- `prefers-reduced-motion`: desactiva animaciones CSS + JS.

### Cookies
- Banner de consentimiento (localStorage: `heavyweight_cookies`).
- Solo cookies técnicas (carrito) por defecto.
- Analítica (GA/Meta Pixel) solo con consentimiento.

### Selector de Idioma (PT | EN | ES)
- **Detección automática**: si el navegador está en `en` o `es`, usa ese idioma; si no, portugués.
- **Persistencia**: `localStorage` (`hw_lang`).
- **API i18n**:
  - `t(key, vars)` — traduce con interpolación `{n}`.
  - `formatPrice(value)` — formato localizado EUR.
  - `setLanguage(lang)` — cambia idioma + aplica traducciones.
  - `applyTranslations()` — actualiza todos los `[data-i18n*]`.
- **Atributos**:
  - `data-i18n` → textContent
  - `data-i18n-html` → innerHTML (para HTML en traducciones)
  - `data-i18n-aria` → aria-label
  - `data-i18n-placeholder` → placeholder
  - `data-i18n-content` → content (meta tags)

### Traducciones (i18n.js)
- Diccionarios completos para PT, EN, ES.
- Incluye textos de páginas legales como HTML (para `data-i18n-html`).
- Precios: PT/ES `39,00 €` · EN `€39.00`.
- Nombres de color traducidos: Preto/Grafite/Taupe ↔ Black/Graphite/Taupe ↔ Negro/Grafito/Gris pardo.
- Placeholder product names: "Heavy Tee" (PT), "Heavy Tee" (EN), "Heavy Tee" (ES).

### Páginas Legales (en portugués)
- `privacidade.html` — Política de Privacidade (7 secciones: responsável, dados, finalidade, cookies, direitos, conservação).
- `termos.html` — Termos e Condições (7 secciones: aceitação, produtos, preços, envios, garantia, propriedade, legislação).
- `envios.html` — Envios e Devoluções (envios, devoluções, como solicitar troca).

### Estilos (styles.css)
- CSS custom properties (paleta warm).
- Responsive design (mobile-first).
- Zona de compra sticky en mobile.
- Cart drawer overlay.
- Checkout modal (dialog).
- Lang-switch buttons (active underline).

---

## Productos (Placeholder)

| ID | Nombre (PT) | Nombre (EN) | Nombre (ES) | Precio EUR | Stock (S/M/L/XL) |
|----|-------------|-------------|-------------|------------|------------------|
| `iron-core` | Heavy Tee | Heavy Tee | Heavy Tee | €39.00 | 0/3/2/1 |
| `atlas` | Heavy Tee | Heavy Tee | Heavy Tee | €45.00 | 2/1/0/2 |
| `grind` | Heavy Tee | Heavy Tee | Heavy Tee | €34.00 | 1/2/1/0 |

---

## Archivos Clave y sus Responsabilidades

### `index.html`
- Nav con lang-switch (`PT | EN | ES`) + carrito + Instagram.
- Hero con `<picture>` para camiseta frontal.
- Sección destacada (scroll) con `<picture>` para trasera.
- Cuadrícula de 3 productos con `<picture>` cada uno.
- Guía de tallas.
- Footer con enlaces legales.
- Banner de cookies.
- Modal de checkout.

### `assets/js/i18n.js`
- Objeto `I18N` con claves `pt`, `en`, `es`.
- Funciones: `t()`, `formatPrice()`, `setLanguage()`, `applyTranslations()`.
- Detección de idioma del navegador.
- Persistencia en `localStorage`.
- Exposición global: `window.t`, `window.formatPrice`, `window.setLanguage`, `window.onLanguageChange`.

### `assets/js/main.js`
- Constantes: `I18N`, `LANGS`, `t`, `formatPrice`, `PRODUCTS`.
- GSAP animations: `initParallax()`, `initFeatured()`, `initGrid()`.
- E-commerce: `renderFeatured()`, `renderGrid()`, `addToCart()`, `removeFromCart()`, `openCart()`, `closeCart()`, `openCheckout()`, `closeCheckout()`, `confirmOrder()`.
- `window.onLanguageChange`: re-render de featured + grid cuando cambia el idioma.

### `assets/css/styles.css`
- Paleta CSS custom properties.
- Responsive (mobile + desktop).
- Componentes: shirt-stage, cart drawer, checkout modal, lang-switch, skip-link.

---

## Commits

| Hash | Mensaje |
|------|---------|
| `4a64981` | `feat: i18n pt-PT (principal) / en / es + precios en EUR con selector de idioma, páginas legales en portugués` |
| `16a61a0` | `restructure + i18n + EUR + images optimized + GSAP parallax + accessibility` |

---

## Pendiente (Próximos Pasos)

### Alta Prioridad
1. **Personalizar productos**: cambiar nombres placeholder ("Heavy Tee") por nombres reales + actualizar precios EUR + stock real + fotos reales.
2. **Conectar pagos**: Stripe + MB WAY/Multibanco (vía Ifthenpay u otro proveedor PT).
3. **Añadir cuenta de Instagram** en el footer (reemplazar `instagram.com/TU-CUENTA`).
4. **Dominio propio**: comprar dominio + configurar CNAME + HTTPS en GitHub Pages.

### Media Prioridad
5. **A/B testing**: probar diferentes versiones de la landing.
6. **Analytics**: añadir Google Analytics / Meta Pixel después del consentimiento de cookies.
7. **Email marketing**: integrar servicio de newsletters (Mailchimp, Brevo, etc.).
8. **Blog SEO**: añadir contenido de entrenamiento para posicionar.

### Baja Prioridad
9. **Backend real**: nodo/express o serverless para persistir pedidos.
10. **Facturación**: cumplir con AT (portal das finanças) + emitir facturas certificadas.
11. **Más productos**: expandir catálogo más allá de camisetas.
12. **Redes sociales**: crear perfiles en Instagram/TikTok para la marca.

---

## Notas para el Desarrollador

- El archivo `i18n.js` exporta `t()` y `formatPrice()` globalmente via `window`.
- Para añadir un nuevo string, buscar la clave en `pt` y añadir en `en` y `es`.
- Los textos legales en `i18n.js` están como HTML (con `<h1>`, `<p>`, `<ul>`) para usar con `data-i18n-html`.
- El `title` de la página se maneja por separado: si tiene `data-i18n`, usa esa clave; si no, usa `meta_title`.
- Los colores de producto son keys de traducción (`color_black`, etc.), no strings hardcoded.
- El carrito almacena la KEY del color (no el string traducido), y se traduce al renderizar.
- `window.onLanguageChange` es el hook para re-renderizar contenido dinámico cuando cambia el idioma.

---

*Archivo generado automáticamente el 10 de septiembre de 2026.*
