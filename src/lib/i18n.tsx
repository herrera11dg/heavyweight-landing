import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en" | "es";
export const LANGS: Lang[] = ["pt", "en", "es"];
const LOCALES: Record<Lang, string> = { pt: "pt-PT", en: "en-GB", es: "es-ES" };

const pt = {
  skip: "Saltar para o conteúdo",
  nav: {
    shop: "Loja",
    brand: "A Marca",
    contact: "Contacto",
    menu: "Menu",
    cart: "Carrinho",
    lang: "Idioma",
  },
  hero: {
    label: "DROP 001 · PORTUGAL · HEAVY COTTON",
    l1: "Peso que",
    l2: "se nota.",
    sub: "240 GSM. BUILT TO LAST.",
    cta: "Explorar coleção",
    cap1: "TOJI FUSHIGURO · DROP 005",
    cap2: "DISCIPLINE · DROP 002",
  },
  col: {
    label: "— A COLEÇÃO —",
    title: "Coleção",
    count: "05 peças",
    featured: "Destaque",
    add: "Adicionar ao carrinho",
    addShort: "Adicionar",
    guide: "Guia de tamanhos",
    size: "Tamanho",
    color: "Cor",
    colors: { dark: "Escuro", wine: "Vinotinto" },
    inStock: "Em stock",
    only: "Só restam {n}",
    soldOut: "Esgotado",
    flip: "Clica para virar",
    featuredDesc:
      "Algodão pesado 240gsm com acabamento mineral wash. Estampa DTF de grande formato nas costas. Corte boxy.",
    pickSize: "Escolhe um tamanho",
    added: "Adicionado",
  },
  brand: {
    label: "— A MARCA —",
    title: "Não é só uma t-shirt.",
    body: "A HeavyWeight nasceu no chão do ginásio. Cada peça é pensada para aguentar o treino, a lavagem e o tempo. Algodão pesado, corte largo e gráficos que dizem o que pensas antes de levantares a barra.",
  },
  fabric: {
    label: "— O TECIDO —",
    items: [
      ["240 GSM", "Algodão pesado que mantém a forma, treino após treino."],
      ["MINERAL WASH", "Acabamento vintage com toque suave desde o primeiro uso."],
      ["CORTE BOXY", "Ombro descaído e corpo largo para liberdade total."],
      ["DTF PRINT", "Cores vivas e detalhe fino que não racha."],
    ],
  },
  custom: {
    title: "Não encontras o teu estilo?",
    body: "Fazemos peças personalizadas para equipas, ginásios e eventos.",
    cta: "Fala connosco",
  },
  thanks: {
    kick: "Pedido confirmado",
    title: "Obrigado pela tua compra!",
    body: "Recebemos o teu pedido. Vamos enviar-te um email de confirmação e coordenar o envio em breve.",
    cta: "Voltar à loja",
  },
  footer: {
    shop: "Loja",
    help: "Ajuda",
    contact: "Contacto",
    all: "Todas as peças",
    guide: "Guia de tamanhos",
    shipping: "Envios e devoluções",
    privacy: "Política de privacidade",
    terms: "Termos e condições",
    tagline: "BUILT FOR THE WORK · 240 GSM · DROP 001",
  },
  cart: {
    title: "Carrinho",
    empty: "O teu carrinho está vazio.",
    remove: "Remover",
    total: "Total",
    checkout: "Finalizar compra",
    close: "Fechar",
    dec: "Diminuir quantidade",
    inc: "Aumentar quantidade",
    shippingNote: "Envio calculado no checkout.",
  },
  checkout: {
    title: "Checkout",
    name: "Nome",
    email: "Email",
    phone: "Telefone",
    address: "Morada",
    confirm: "Confirmar encomenda",
    redirecting: "A redirecionar…",
    required: "Campo obrigatório",
    invalidEmail: "Email inválido",
    doneTitle: "Encomenda confirmada",
    doneBody: "Obrigado pela tua compra!",
    back: "Voltar à loja",
    simulated: "Pagamento seguro processado pela Stripe.",
  },
  guide: {
    title: "Guia de tamanhos",
    size: "Tamanho",
    chest: "Peito",
    length: "Comprimento",
    shoulder: "Ombro",
    note: "Medidas em cm, peça estendida.",
  },
  cookie: {
    text: "Usamos cookies essenciais para guardar o teu carrinho e idioma.",
    accept: "Aceitar",
    reject: "Rejeitar",
    more: "Saber mais",
  },
  mobile: { buy: "Comprar" },
  legal: {
    back: "← Voltar à loja",
    privacy: {
      title: "Política de Privacidade",
      body: [
        "Responsável — HeavyWeight™ é responsável pelo tratamento dos dados pessoais que nos facultas através deste site.",
        "Dados que recolhemos — Ao fazeres uma compra recolhemos: nome, email, telefone e morada de envio. Se usares analítica, podemos recolher dados de navegação de forma agregada.",
        "Finalidade — Gerir e entregar as tuas encomendas, atender pedidos de apoio ao cliente e enviar comunicações comerciais apenas se deres o teu consentimento.",
        "Cookies e analítica — Usamos cookies técnicas imprescindíveis para o funcionamento do carrinho. As cookies de analítica (Google Analytics, Meta Pixel) só são ativadas com o teu consentimento.",
        "Os teus direitos — Podes solicitar o acesso, retificação ou eliminação dos teus dados escrevendo para hello@heavyweight.pt.",
        "Conservação — Conservamos os teus dados apenas durante o tempo necessário para cumprir as finalidades descritas e as obrigações legais aplicáveis.",
      ],
    },
    terms: {
      title: "Termos e Condições",
      body: [
        "Aceitação — Ao navegar e comprar neste site aceitas os presentes termos e condições.",
        "Produtos — As imagens dos produtos são referenciais. As peças podem apresentar ligeiras variações de tom devido ao caráter cru do algodão e à calibração de cada ecrã.",
        "Preços e pagamentos — Os preços são apresentados em euros e incluem os impostos aplicáveis. O pagamento é gerido através dos meios disponibilizados no processo de compra.",
        "Envios — Os prazos de entrega são indicados na política de envios. Não nos responsabilizamos por atrasos causados por terceiros (transportadoras, alfândegas).",
        "Garantia e devoluções — Aplicam-se as condições descritas na política de envios e devoluções.",
        "Propriedade intelectual — Todo o conteúdo deste site (marca, design, textos) é propriedade da HeavyWeight™ e não pode ser reproduzido sem autorização.",
        "Legislação — Estes termos regem-se pela legislação vigente em Portugal.",
      ],
    },
    shipping: {
      title: "Envios e Devoluções",
      body: [
        "Enviamos para Portugal e para a Europa. O custo e o prazo são calculados ao finalizar a compra, consoante a tua localização.",
        "As encomendas são expedidas em 1–3 dias úteis após a confirmação do pagamento.",
        "Devoluções — Tens 15 dias após a entrega para solicitar uma troca ou devolução. A peça deve estar sem uso, com etiquetas e na embalagem original.",
        "As trocas de tamanho não têm custo adicional de envio.",
        "Para solicitar uma troca, escreve para hello@heavyweight.pt com o número da encomenda e o motivo. Respondemos num prazo máximo de 48 horas úteis.",
      ],
    },
  },
  meta: { cart: "{n} artigos no carrinho" },
};
type Dict = typeof pt;

const en: Dict = {
  skip: "Skip to content",
  nav: {
    shop: "Shop",
    brand: "The Brand",
    contact: "Contact",
    menu: "Menu",
    cart: "Cart",
    lang: "Language",
  },
  hero: {
    label: "DROP 001 · PORTUGAL · HEAVY COTTON",
    l1: "Weight you",
    l2: "feel.",
    sub: "240 GSM. BUILT TO LAST.",
    cta: "Explore collection",
    cap1: "TOJI FUSHIGURO · DROP 005",
    cap2: "DISCIPLINE · DROP 002",
  },
  col: {
    label: "— THE COLLECTION —",
    title: "Collection",
    count: "05 pieces",
    featured: "Featured",
    add: "Add to cart",
    addShort: "Add",
    guide: "Size guide",
    size: "Size",
    color: "Color",
    colors: { dark: "Dark", wine: "Wine" },
    inStock: "In stock",
    only: "Only {n} left",
    soldOut: "Sold out",
    flip: "Click to flip",
    featuredDesc:
      "Heavy 240gsm cotton with a mineral wash finish. Large-format DTF print on the back. Boxy fit.",
    pickSize: "Pick a size",
    added: "Added",
  },
  brand: {
    label: "— THE BRAND —",
    title: "Not just a t-shirt.",
    body: "HeavyWeight was born on the gym floor. Every piece is made to survive the training, the wash and time. Heavy cotton, wide cut and graphics that say what you think before you lift the bar.",
  },
  fabric: {
    label: "— THE FABRIC —",
    items: [
      ["240 GSM", "Heavy cotton that holds its shape, session after session."],
      ["MINERAL WASH", "Vintage finish, soft hand from the first wear."],
      ["BOXY FIT", "Dropped shoulder and wide body for full freedom."],
      ["DTF PRINT", "Vivid colour and fine detail that won't crack."],
    ],
  },
  custom: {
    title: "Can't find your style?",
    body: "We make custom pieces for teams, gyms and events.",
    cta: "Get in touch",
  },
  thanks: {
    kick: "Order confirmed",
    title: "Thank you for your purchase!",
    body: "We've received your order. We'll email you a confirmation and arrange shipping shortly.",
    cta: "Back to store",
  },
  footer: {
    shop: "Shop",
    help: "Help",
    contact: "Contact",
    all: "All pieces",
    guide: "Size guide",
    shipping: "Shipping & returns",
    privacy: "Privacy policy",
    terms: "Terms & conditions",
    tagline: "BUILT FOR THE WORK · 240 GSM · DROP 001",
  },
  cart: {
    title: "Cart",
    empty: "Your cart is empty.",
    remove: "Remove",
    total: "Total",
    checkout: "Checkout",
    close: "Close",
    dec: "Decrease quantity",
    inc: "Increase quantity",
    shippingNote: "Shipping calculated at checkout.",
  },
  checkout: {
    title: "Checkout",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    confirm: "Confirm order",
    redirecting: "Redirecting…",
    required: "Required field",
    invalidEmail: "Invalid email",
    doneTitle: "Order confirmed",
    doneBody: "Thank you for your purchase!",
    back: "Back to store",
    simulated: "Secure payment processed by Stripe.",
  },
  guide: {
    title: "Size guide",
    size: "Size",
    chest: "Chest",
    length: "Length",
    shoulder: "Shoulder",
    note: "Measurements in cm, garment laid flat.",
  },
  cookie: {
    text: "We use essential cookies to keep your cart and language.",
    accept: "Accept",
    reject: "Reject",
    more: "Learn more",
  },
  mobile: { buy: "Buy" },
  legal: {
    back: "← Back to store",
    privacy: {
      title: "Privacy Policy",
      body: [
        "Controller — HeavyWeight™ is responsible for processing the personal data you provide through this site.",
        "Data we collect — When you make a purchase we collect: name, email, phone and shipping address. If you use analytics, we may collect aggregated browsing data.",
        "Purpose — To manage and deliver your orders, handle customer support requests and send commercial communications only with your consent.",
        "Cookies and analytics — We use essential technical cookies required for the cart to work. Analytics cookies (Google Analytics, Meta Pixel) are only enabled with your consent.",
        "Your rights — You can request access, correction or deletion of your data by writing to hello@heavyweight.pt.",
        "Retention — We keep your data only for as long as necessary to fulfil the purposes described and applicable legal obligations.",
      ],
    },
    terms: {
      title: "Terms & Conditions",
      body: [
        "Acceptance — By browsing and purchasing on this site you accept these terms and conditions.",
        "Products — Product images are for reference. Pieces may show slight shade variations due to the raw nature of cotton and each screen's calibration.",
        "Prices and payments — Prices are shown in euros and include applicable taxes. Payment is handled through the methods available in the checkout process.",
        "Shipping — Delivery times are stated in the shipping policy. We are not responsible for delays caused by third parties (carriers, customs).",
        "Warranty and returns — The conditions described in the shipping and returns policy apply.",
        "Intellectual property — All content on this site (brand, design, text) is the property of HeavyWeight™ and may not be reproduced without authorisation.",
        "Governing law — These terms are governed by the law in force in Portugal.",
      ],
    },
    shipping: {
      title: "Shipping & Returns",
      body: [
        "We ship to Portugal and across Europe. Cost and delivery time are calculated at checkout according to your location.",
        "Orders are dispatched within 1–3 business days after payment confirmation.",
        "Returns — You have 15 days after delivery to request an exchange or return. The piece must be unworn, with tags and in its original packaging.",
        "Size exchanges have no additional shipping cost.",
        "To request an exchange, email hello@heavyweight.pt with your order number and reason. We reply within 48 business hours.",
      ],
    },
  },
  meta: { cart: "{n} items in cart" },
};

const es: Dict = {
  skip: "Saltar al contenido",
  nav: {
    shop: "Tienda",
    brand: "La Marca",
    contact: "Contacto",
    menu: "Menú",
    cart: "Carrito",
    lang: "Idioma",
  },
  hero: {
    label: "DROP 001 · PORTUGAL · HEAVY COTTON",
    l1: "Peso que",
    l2: "se nota.",
    sub: "240 GSM. BUILT TO LAST.",
    cta: "Explorar colección",
    cap1: "TOJI FUSHIGURO · DROP 005",
    cap2: "DISCIPLINE · DROP 002",
  },
  col: {
    label: "— LA COLECCIÓN —",
    title: "Colección",
    count: "05 piezas",
    featured: "Destacado",
    add: "Añadir al carrito",
    addShort: "Añadir",
    guide: "Guía de tallas",
    size: "Talla",
    color: "Color",
    colors: { dark: "Oscuro", wine: "Vinotinto" },
    inStock: "En stock",
    only: "Solo quedan {n}",
    soldOut: "Agotado",
    flip: "Haz clic para girar",
    featuredDesc:
      "Algodón pesado 240gsm con acabado mineral wash. Estampado DTF de gran formato en la espalda. Corte boxy.",
    pickSize: "Elige una talla",
    added: "Añadido",
  },
  brand: {
    label: "— LA MARCA —",
    title: "No es solo una camiseta.",
    body: "HeavyWeight nació en el suelo del gimnasio. Cada pieza está hecha para aguantar el entreno, el lavado y el tiempo. Algodón pesado, corte amplio y gráficos que dicen lo que piensas antes de levantar la barra.",
  },
  fabric: {
    label: "— EL TEJIDO —",
    items: [
      ["240 GSM", "Algodón pesado que mantiene la forma, entreno tras entreno."],
      ["MINERAL WASH", "Acabado vintage, tacto suave desde el primer uso."],
      ["CORTE BOXY", "Hombro caído y cuerpo amplio para total libertad."],
      ["DTF PRINT", "Colores vivos y detalle fino que no se agrieta."],
    ],
  },
  custom: {
    title: "¿No encuentras tu estilo?",
    body: "Hacemos piezas personalizadas para equipos, gimnasios y eventos.",
    cta: "Contáctanos",
  },
  thanks: {
    kick: "Pedido confirmado",
    title: "¡Gracias por tu compra!",
    body: "Hemos recibido tu pedido. Te enviaremos un email de confirmación y coordinaremos el envío en breve.",
    cta: "Volver a la tienda",
  },
  footer: {
    shop: "Tienda",
    help: "Ayuda",
    contact: "Contacto",
    all: "Todas las piezas",
    guide: "Guía de tallas",
    shipping: "Envíos y devoluciones",
    privacy: "Política de privacidad",
    terms: "Términos y condiciones",
    tagline: "BUILT FOR THE WORK · 240 GSM · DROP 001",
  },
  cart: {
    title: "Carrito",
    empty: "Tu carrito está vacío.",
    remove: "Eliminar",
    total: "Total",
    checkout: "Finalizar compra",
    close: "Cerrar",
    dec: "Disminuir cantidad",
    inc: "Aumentar cantidad",
    shippingNote: "Envío calculado en el checkout.",
  },
  checkout: {
    title: "Checkout",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    address: "Dirección",
    confirm: "Confirmar pedido",
    redirecting: "Redirigiendo…",
    required: "Campo obligatorio",
    invalidEmail: "Email no válido",
    doneTitle: "Pedido confirmado",
    doneBody: "¡Gracias por tu compra!",
    back: "Volver a la tienda",
    simulated: "Pago seguro procesado por Stripe.",
  },
  guide: {
    title: "Guía de tallas",
    size: "Talla",
    chest: "Pecho",
    length: "Largo",
    shoulder: "Hombro",
    note: "Medidas en cm, prenda extendida.",
  },
  cookie: {
    text: "Usamos cookies esenciales para guardar tu carrito e idioma.",
    accept: "Aceptar",
    reject: "Rechazar",
    more: "Saber más",
  },
  mobile: { buy: "Comprar" },
  legal: {
    back: "← Volver a la tienda",
    privacy: {
      title: "Política de Privacidad",
      body: [
        "Responsable — HeavyWeight™ es responsable del tratamiento de los datos personales que nos facilitas a través de este sitio.",
        "Datos que recogemos — Al hacer una compra recogemos: nombre, email, teléfono y dirección de envío. Si usas analítica, podemos recoger datos de navegación de forma agregada.",
        "Finalidad — Gestionar y entregar tus pedidos, atender solicitudes de atención al cliente y enviar comunicaciones comerciales solo si das tu consentimiento.",
        "Cookies y analítica — Usamos cookies técnicas imprescindibles para el funcionamiento del carrito. Las cookies de analítica (Google Analytics, Meta Pixel) solo se activan con tu consentimiento.",
        "Tus derechos — Puedes solicitar el acceso, rectificación o eliminación de tus datos escribiendo a hello@heavyweight.pt.",
        "Conservación — Conservamos tus datos solo durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales aplicables.",
      ],
    },
    terms: {
      title: "Términos y Condiciones",
      body: [
        "Aceptación — Al navegar y comprar en este sitio aceptas estos términos y condiciones.",
        "Productos — Las imágenes de los productos son referenciales. Las piezas pueden presentar ligeras variaciones de tono debido al carácter crudo del algodón y a la calibración de cada pantalla.",
        "Precios y pagos — Los precios se muestran en euros e incluyen los impuestos aplicables. El pago se gestiona a través de los métodos disponibles en el proceso de compra.",
        "Envíos — Los plazos de entrega se indican en la política de envíos. No nos responsabilizamos de retrasos causados por terceros (transportistas, aduanas).",
        "Garantía y devoluciones — Se aplican las condiciones descritas en la política de envíos y devoluciones.",
        "Propiedad intelectual — Todo el contenido de este sitio (marca, diseño, textos) es propiedad de HeavyWeight™ y no puede reproducirse sin autorización.",
        "Legislación — Estos términos se rigen por la legislación vigente en Portugal.",
      ],
    },
    shipping: {
      title: "Envíos y Devoluciones",
      body: [
        "Enviamos a Portugal y a toda Europa. El coste y el plazo se calculan al finalizar la compra, según tu ubicación.",
        "Los pedidos se expiden en 1–3 días laborables tras la confirmación del pago.",
        "Devoluciones — Tienes 15 días desde la entrega para solicitar un cambio o devolución. La pieza debe estar sin uso, con etiquetas y en su embalaje original.",
        "Los cambios de talla no tienen coste adicional de envío.",
        "Para solicitar un cambio, escribe a hello@heavyweight.pt con el número de pedido y el motivo. Respondemos en un plazo máximo de 48 horas laborables.",
      ],
    },
  },
  meta: { cart: "{n} artículos en el carrito" },
};

export const DICTS: Record<Lang, Dict> = { pt, en, es };

export const fmt = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

export function formatPrice(n: number, lang: Lang) {
  return new Intl.NumberFormat(LOCALES[lang], { style: "currency", currency: "EUR" }).format(n);
}

export function detectLang(search: string, stored: string | null, nav: string | undefined): Lang {
  const q = new URLSearchParams(search).get("lang");
  if (q && LANGS.includes(q as Lang)) return q as Lang;
  if (stored && LANGS.includes(stored as Lang)) return stored as Lang;
  const n = (nav || "").slice(0, 2).toLowerCase();
  if (LANGS.includes(n as Lang)) return n as Lang;
  return "pt";
}

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void; price: (n: number) => string };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");
  useEffect(() => {
    setLangState(
      detectLang(window.location.search, localStorage.getItem("hw-lang"), navigator.language),
    );
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("hw-lang", l);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", l);
    window.history.replaceState(window.history.state, "", url);
  }, []);
  return (
    <I18nCtx.Provider value={{ lang, t: DICTS[lang], setLang, price: (n) => formatPrice(n, lang) }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
