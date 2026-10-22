# HeavyWeight™

Landing + tienda de camisetas de algodón pesado (serie gimnasio). HTML + CSS + JavaScript vanilla, GSAP (ScrollTrigger) para parallax/tilt 3D y **Stripe Checkout** para cobrar de verdad (serverless en Vercel).

## Características

- **Parallax + tilt 3D** con GSAP/ScrollTrigger.
- **Flip 3D** frontal/trasera (espalda visible primero, clic para girar).
- **Tienda**: 5 diseños a €35 (Again, Discipline, Focus, One More Rep, Toji Fushiguro), selector de talla con stock, selector de color en Focus, carrito persistente (`localStorage`).
- **Pago real**: Stripe Checkout vía `/api/checkout` + webhook de confirmación por email (Resend).
- **Stock en servidor**: catálogo en `lib/products.js`, expuesto vía `GET /api/products`.
- **Multilingüe**: pt-PT (principal), en, es — con `?lang=` en la URL y detección de navegador.
- **Precios en euros (€)** localizados por idioma.
- **Imágenes optimizadas**: WebP + fallback PNG, `srcset` 1x/2x, `lazy loading`.
- **SEO**: meta, Open Graph, Twitter Card, canonical, `hreflang`, Schema.org (JSON-LD), `sitemap.xml`, `robots.txt`.
- **Legal**: privacidad, términos y envíos/devoluciones (traducidas).
- **Accesibilidad**: contraste AA, navegación por teclado, focus trap en modales, `aria-*`, `skip-link`, validación de formulario.

## Estructura

```
heavyweight/
├── index.html            # Página principal (tienda)
├── obrigado.html         # Página de agradecimiento (post-pago)
├── privacidade.html      # Política de privacidade
├── termos.html           # Termos e condições
├── envios.html           # Envios e devoluções
├── robots.txt
├── sitemap.xml
├── package.json          # Dependencias (stripe, resend)
├── api/                  # Serverless functions (Vercel)
│   ├── products.js       # GET catálogo + stock
│   ├── checkout.js       # POST crea sesión de Stripe
│   └── webhook.js        # POST eventos de Stripe + email
├── lib/
│   └── products.js       # Catálogo y stock (fuente de verdad)
├── assets/
│   ├── css/styles.css
│   ├── js/i18n.js
│   ├── js/main.js
│   └── img/
├── README.md
└── LICENSE
```

## Backend y pagos (Stripe)

1. Crea una cuenta en [Stripe](https://stripe.com).
2. En Vercel (Settings → Environment Variables), define:
   | Variable | Descripción |
   |----------|-------------|
   | `STRIPE_SECRET_KEY` | Clave secreta de Stripe (`sk_live_...`) |
   | `STRIPE_WEBHOOK_SECRET` | Firma del webhook (`whsec_...`) |
   | `RESEND_API_KEY` | Clave de [Resend](https://resend.com) para el email de confirmación |
   | `EMAIL_FROM` | Remitente del email, p. ej. `HeavyWeight <pedidos@heavyweight.pt>` |
   | `SITE_URL` | URL de producción, p. ej. `https://heavyweight-sigma.vercel.app` |
3. En el dashboard de Stripe, añade un endpoint webhook apuntando a `https://TU-DOMINIO/api/webhook` con el evento `checkout.session.completed`, y copia el `whsec_...` a `STRIPE_WEBHOOK_SECRET`.

**Nota sobre stock**: el catálogo y el stock viven en `lib/products.js` (servidor). Para descuento de stock en tiempo real entre múltiples usuarios, conecta una base de datos (Vercel KV / Supabase) en el webhook — el hook ya está preparado (`TODO(stock)` en `api/webhook.js`).

## Idiomas

- **Por defecto**: portugués de Portugal.
- **Detección**: `?lang=` → `localStorage` → idioma del navegador → pt.
- Las traducciones están en `assets/js/i18n.js`.

## Ejecutar localmente

```bash
npm install
vercel dev
# o abre index.html directamente (el carrito funciona; /api no)
```

## Despliegue (Vercel)

Ya conectado al repo de GitHub — cada `git push` a `master` redespliega automáticamente.

```
https://heavyweight-sigma.vercel.app
```

## Configuración pendiente (antes de producción)

| Marcador | Dónde | Reemplazar por |
|----------|-------|----------------|
| `instagram.com/TU-CUENTA` | `index.html` (footer) | Tu cuenta de Instagram |
| `heavyweight-sigma.vercel.app` | `index.html` (canonical/OG), `sitemap.xml`, `robots.txt` | Tu dominio real (cuando lo tengas) |
| Google Analytics / Meta Pixel | (no incluido) | Tus IDs, tras el consentimiento de cookies |

## Notas

- **Fotografía**: reemplaza las imágenes por fotografía de estudio/mockups y regenera los WebP.
- **Email**: el correo de confirmación se envía desde el webhook cuando el pago se completa.
- **Analítica**: no incluida por defecto.

## Licencia

MIT. Ver [LICENSE](LICENSE).
