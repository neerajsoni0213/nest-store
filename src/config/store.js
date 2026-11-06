/* --------------------------------------------------------------------------
   ASSETS — drop transparent .webp cutouts into /public/assets and keep these
   file names (or edit the paths). Any image that is missing or fails to load
   falls back automatically to the built-in SVG illustration.

   Product cutouts should show ONE charm without its ear-wire: the stand draws
   the gold hook and mirrors the charm to make the pair.
   -------------------------------------------------------------------------- */
const base = import.meta.env.BASE_URL; // works on GitHub Pages sub-paths too

export const ASSETS = {
  rabbitIdle: `${base}assets/rabbit-idle.webp`, // poster rabbit in the hero bowl (before it comes alive in 3D)
  products: {
    chilli: `${base}assets/chilli-cutout.webp`,
    lemon: `${base}assets/lemon-cutout.webp`,
    coconut: `${base}assets/coconut-cutout.webp`,
    croissant: `${base}assets/croissant-cutout.webp`,
    tangerine: `${base}assets/tangerine-cutout.webp`,
    lime: `${base}assets/lime-cutout.webp`,
    delftVase: `${base}assets/delft-vase.webp`,
    cobaltVase: `${base}assets/cobalt-vase.webp`,
    heartMagnets: `${base}assets/heart-magnets.webp`,
  },
};

/* Store settings --------------------------------------------------------- */
export const STORE = {
  // Country code + number, digits only, e.g. "919876543210".
  // Left empty, WhatsApp opens the pre-filled bill and lets the buyer choose the chat.
  whatsappNumber: "",
  // Your UPI ID, e.g. "nest@okaxis". Added to the bill when set.
  upiId: "",
  freeShippingAbove: 1200,
  shippingFee: 80,
};

export const COLORS = {
  cream: "#FBF7EE",
  cobalt: "#0A3C8C",
  cobaltDeep: "#082F70",
  porcelain: "#F3EFE2",
  clover: "#5A7D4C",
  gold: "#C9A13B",
};

export const fmt = (n) => `Rs. ${Number(n).toLocaleString("en-IN")}`;
