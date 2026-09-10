# HeavyWeight™

Landing + tienda de camisetas de algodón pesado (serie gimnasio). Construida con HTML, CSS y JavaScript vanilla + [GSAP](https://gsap.com) (ScrollTrigger) para el parallax y el tilt 3D.

## Características

- **Parallax + tilt 3D** con GSAP/ScrollTrigger (la camiseta crece al hacer scroll y se inclina con el mouse).
- **Flip 3D** frontal/trasera de cada producto (clic o teclado).
- **Tienda funcional**: selector de talla/color, control de stock, carrito persistente (`localStorage`) y checkout.
- **Imágenes optimizadas**: WebP con fallback PNG, `srcset` 1x/2x y `lazy loading`.
- **SEO**: meta description, Open Graph, Twitter Card, favicon SVG, canonical.
- **Legal**: políticas de privacidad, términos y envíos/devoluciones.
- **Cookies**: banner de consentimiento (esenciales vs. analítica).
- **Accesibilidad**: contraste AA, navegación por teclado, `aria-label`, foco visible, `skip-link`.

## Estructura

```
heavyweight/
├── index.html            # Página principal (tienda)
├── privacidad.html       # Política de privacidad
├── terminos.html         # Términos y condiciones
├── envios.html           # Envíos y devoluciones
├── assets/
│   ├── css/styles.css    # Estilos
│   ├── js/main.js        # Lógica (GSAP + carrito)
│   └── img/              # Imágenes (WebP + PNG + favicon)
├── README.md
├── LICENSE
└── .gitignore
```

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

## Configuración pendiente (antes de producción)

Reemplaza los siguientes marcadores:

| Marcador | Dónde | Reemplazar por |
|----------|-------|----------------|
| `https://TU-DOMINIO.com` | `index.html` (OG/Twitter/canonical) | Tu dominio real |
| `TU-DOMINIO.com` / `hola@TU-DOMINIO.com` | páginas legales | Tu dominio y correo |
| `instagram.com/TU-CUENTA` | `index.html` (footer) | Tu cuenta de Instagram |
| Google Analytics / Meta Pixel | `index.html` (comentado) | Tus IDs de analítica |

## Notas importantes

- **Fotografía**: las imágenes actuales (`frontal.png`, `trasera.png`) son recortes de producto. Para producción, reemplázalas por fotografía de estudio o mockups reales y regenera los WebP (`npx sharp-cli`, `cwebp`, etc.).
- **Checkout**: el flujo actual **simula** el pedido (genera un número de orden y vacía el carrito). Para cobrar de verdad, conecta un procesador de pagos (Stripe, MercadoPago, etc.) y un backend que persista pedidos.
- **Analítica**: el código de Google Analytics / Meta Pixel no está incluido por defecto; añádelo tras el consentimiento de cookies.

## Licencia

MIT. Ver [LICENSE](LICENSE).
