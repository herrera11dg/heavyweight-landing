# HeavyWeight™

Landing + tienda de camisetas de algodón pesado (serie gimnasio). Construida con HTML, CSS y JavaScript vanilla + [GSAP](https://gsap.com) (ScrollTrigger) para el parallax y el tilt 3D.

## Características

- **Parallax + tilt 3D** con GSAP/ScrollTrigger (la camiseta crece al hacer scroll y se inclina con el mouse).
- **Flip 3D** frontal/trasera de cada producto (clic o teclado).
- **Tienda funcional**: selector de talla/color, control de stock, carrito persistente (`localStorage`) y checkout.
- **Multilingüe**: portugués de Portugal (principal), inglés y español, con selector de idioma y detección del navegador.
- **Precios en euros (€)** con formato localizado por idioma.
- **Imágenes optimizadas**: WebP con fallback PNG, `srcset` 1x/2x y `lazy loading`.
- **SEO**: meta description, Open Graph, Twitter Card, favicon SVG, canonical.
- **Legal**: políticas de privacidad, términos y envíos/devoluciones (traducidas).
- **Cookies**: banner de consentimiento (esenciales vs. analítica).
- **Accesibilidad**: contraste AA, navegación por teclado, `aria-label`, foco visible, `skip-link`.

## Estructura

```
heavyweight/
├── index.html            # Página principal (tienda)
├── privacidade.html      # Política de privacidade
├── termos.html           # Termos e condições
├── envios.html           # Envios e devoluções
├── assets/
│   ├── css/styles.css    # Estilos
│   ├── js/i18n.js        # Traducciones (pt / en / es)
│   ├── js/main.js        # Lógica (GSAP + carrito)
│   └── img/              # Imágenes (WebP + PNG + favicon)
├── README.md
├── LICENSE
└── .gitignore
```

## Idiomas

- **Idioma por defecto**: portugués de Portugal.
- **Detección**: si el navegador está en `en` o `es`, se usa ese idioma automáticamente; si no, portugués.
- **Persistencia**: la elección se guarda en `localStorage`.
- Las traducciones están en `assets/js/i18n.js` (objeto `I18N` con claves `pt`, `en`, `es`).

## Ejecutar localmente

Abre `index.html` directamente, o sirve la carpeta:

```bash
npx serve .
```

## Despliegue

### GitHub Pages (HTTPS gratuito)

1. Ve a tu repo → **Settings → Pages**.
2. En *Source*, elige la rama `master` (o `main`) y la carpeta `/ (root)`.
3. GitHub publicará en `https://<usuario>.github.io/<repo>/`.

### Dominio propio + HTTPS

1. Compra un dominio y, en tu proveedor DNS, crea un registro **CNAME** apuntando a `<usuario>.github.io`.
2. En el repo, añade un archivo `CNAME` con tu dominio (sin `https://`):
   ```
   www.tudominio.com
   ```
3. En **Settings → Pages → Custom domain**, escribe tu dominio y activa **Enforce HTTPS**.

## Pagos (Portugal)

Para cobrar en Portugal, lo habitual es combinar:

- **Stripe** → tarjetas + Apple Pay / Google Pay.
- **MB WAY** y **Multibanco** (referência) → muy usados en Portugal (p. ej. vía [Ifthenpay](https://ifthenpay.com)).
- **PayPal** → opcional.

Además, necesitarás registrar la actividad (ENI o Unipessoal Lda), facturación certificada por la AT y liquidar el IVA (23% en Portugal continental). Consulta a un contabilista para los detalles fiscales.

## Configuración pendiente (antes de producción)

Reemplaza los siguientes marcadores:

| Marcador | Dónde | Reemplazar por |
|----------|-------|----------------|
| `https://TU-DOMINIO.com` | `index.html` (OG/Twitter/canonical) | Tu dominio real |
| `TU-DOMINIO.com` / `hola@TU-DOMINIO.com` | `i18n.js` (textos legales) | Tu dominio y correo |
| `instagram.com/TU-CUENTA` | `index.html` (footer) | Tu cuenta de Instagram |
| Google Analytics / Meta Pixel | (no incluido) | Tus IDs de analítica |
| Precios (€39 / €45 / €34) | `main.js` (`PRODUCTS`) | Tus precios reales |

## Notas importantes

- **Fotografía**: las imágenes actuales (`frontal.png`, `trasera.png`) son recortes de producto. Para producción, reemplázalas por fotografía de estudio o mockups reales y regenera los WebP (`npx sharp-cli`, `cwebp`, etc.).
- **Checkout**: el flujo actual **simula** el pedido (genera un número de orden y vacía el carrito). Para cobrar de verdad, conecta un procesador de pagos (Stripe, MB WAY, etc.) y un backend que persista pedidos.
- **Analítica**: el código de Google Analytics / Meta Pixel no está incluido por defecto; añádelo tras el consentimiento de cookies.

## Licencia

MIT. Ver [LICENSE](LICENSE).
