const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Custom'];
const ONE_SIZE = ['One Size'];
const ORIGIN = 'Kashmir, India';
const TEXTILE_CARE = 'Dry clean only. Store folded in a cool, dry place and keep away from direct sunlight.';
const COPPER_CARE = 'Wipe with a soft dry cloth and keep dry. Avoid abrasives, dishwashers and acidic cleaners. Natural patina is expected. Confirm food-use guidance for the exact piece before use.';
const WOOD_CARE = 'Dust with a soft dry cloth. Keep away from water, direct sunlight and strong heat. Do not use household polish or abrasive cleaners.';
const PAPIER_CARE = 'Dust gently with a soft dry cloth. Keep away from water, humidity, direct sunlight and sharp objects. Do not use household cleaners.';
const WILLOW_CARE = 'Dust with a soft brush or dry cloth. Keep dry and well ventilated. Avoid prolonged sunlight, soaking and heavy loads beyond the stated use.';

const supplementalProductImages = {
  Aari: ['/images/product-aari-forest.jpg', '/images/home/context-technique.webp'],
  Tilla: ['/images/product-tilla-ivory.jpg', '/images/home/pashmina-jamawar-shawl.jpeg'],
  Dabka: ['/images/product-dabka-bridal.jpg', '/images/home/culture-gathering.webp'],
  Zari: ['/images/product-sozni-burgundy.jpg', '/images/home/context-technique.webp'],
  Copperware: ['/images/home/kashmiri-copper-samovar.jpg', '/images/home/copperware-qalamzani.jpeg'],
  'Walnut Wood': ['/images/product-walnut-keepsake-box.jpg', '/images/home/walnut-wood-carving.jpeg'],
  'Papier Mache': ['/images/product-papier-mache-vase.jpg', '/images/home/papier-mache-vases.webp'],
  'Willow Wicker': ['/images/product-willow-basket.jpg', '/images/home/willow-wicker-baskets.jpeg'],
};

const ensureThreeImages = (images, fallbackKey) => {
  const seen = new Set();
  return [...images, ...(supplementalProductImages[fallbackKey] || [])]
    .filter(Boolean)
    .filter((image) => {
      if (seen.has(image)) return false;
      seen.add(image);
      return true;
    })
    .slice(0, 3);
};

const craftCopy = {
  Aari: {
    material: 'Wool blend',
    collection: 'Aari Edit',
    leadTime: 'Made to order in 10-14 business days',
    description: 'A softly structured Kashmiri silhouette finished with flowing Aari embroidery. Designed for comfortable occasion wear, it can be made to your measurements through our custom order service.',
  },
  Tilla: {
    material: 'Velvet blend',
    collection: 'Tilla Edit',
    leadTime: 'Made to order in 14-18 business days',
    description: 'A refined Kashmiri ensemble enriched with metallic Tilla embroidery. The relaxed shape balances ceremonial detail with an easy, modern fit and can be customised to your measurements.',
  },
  Dabka: {
    material: 'Velvet blend',
    collection: 'Wedding Edit',
    leadTime: 'Made to order in 18-24 business days',
    description: 'An occasion ensemble finished with dimensional Dabka embroidery and a clean, elongated silhouette. Each piece is prepared to order and can be adjusted to your preferred measurements.',
  },
  Zari: {
    material: 'Wool blend',
    collection: 'Zari Edit',
    leadTime: 'Made to order in 14-18 business days',
    description: 'A graceful Kashmiri pheran detailed with antique-gold Zari embroidery. The restrained surface work and easy line make it suitable for celebrations, gifting and winter evenings.',
  },
};

const buildImages = (craft, number, detailCount = 1) => {
  const directory = craft.toLowerCase();
  return [
    `/images/products/${directory}/${directory}${number}-main.jpg`,
    ...Array.from(
      { length: detailCount },
      (_, index) => `/images/products/${directory}/${directory}${number}-detail${index + 1}.jpg`,
    ),
  ];
};

const makeProduct = ({
  craft,
  number,
  title,
  color,
  price,
  category = 'Kurtis',
  detailCount = 1,
  stock = 3,
  bestseller = false,
  material,
  description,
  studioPreview = false,
  images: imageOverrides,
}) => {
  const code = `${craft.toLowerCase()}-${String(number).padStart(2, '0')}`;
  const images = imageOverrides || ensureThreeImages(buildImages(craft, number, detailCount), craft);
  const copy = craftCopy[craft];

  return {
    id: code,
    slug: code,
    sku: `PKM-${craft.toUpperCase()}-${String(number).padStart(2, '0')}`,
    title,
    category,
    collection: bestseller ? 'New Arrivals' : copy.collection,
    embroidery_type: craft,
    craft,
    short_description: `${color} ${craft} embroidery in a relaxed Kashmiri silhouette.`,
    description: description || copy.description,
    price,
    compare_at_price: null,
    images,
    image: images[0],
    sizes: category === 'Pashmina' || category === 'Shawls' ? ONE_SIZE : APPAREL_SIZES,
    colors: [color],
    stock,
    stock_quantity: stock,
    fabric: material || copy.material,
    material: material || copy.material,
    origin: ORIGIN,
    care_instructions: TEXTILE_CARE,
    lead_time: copy.leadTime,
    status: 'active',
    published: true,
    ready_to_ship: false,
    made_to_order: true,
    limited_edition: true,
    one_of_one: false,
    is_bestseller: bestseller,
    rating: 0,
    review_count: 0,
    reviews: [],
    catalog_source: 'local_catalog',
    image_is_studio_preview: studioPreview,
    image_disclosure: studioPreview
      ? 'Studio visualisation. Ask our team for photographs of the exact finished piece before ordering.'
      : '',
    created_date: `2026-07-${String(Math.min(number + 10, 28)).padStart(2, '0')}T12:00:00.000Z`,
  };
};

const makeCopperProduct = ({
  number,
  title,
  price,
  size,
  stock,
  description,
  bestseller = false,
}) => {
  const code = `copper-${String(number).padStart(2, '0')}`;
  const image = `/images/products/copperware/copper${number}-main.jpg`;
  const images = ensureThreeImages([image], 'Copperware');

  return {
    id: code,
    slug: code,
    sku: `PKM-COPPER-${String(number).padStart(2, '0')}`,
    title,
    category: 'Copperware',
    collection: 'Copperware',
    embroidery_type: 'Copper Engraving',
    craft: 'Naqashi Copperware',
    short_description: `${title} with chinar-inspired hand-engraved detail and an antique copper finish.`,
    description,
    price,
    compare_at_price: null,
    images,
    image,
    sizes: [size],
    colors: ['Antique copper'],
    stock,
    stock_quantity: stock,
    fabric: 'Copper with engraved antique finish',
    material: 'Copper with engraved antique finish',
    origin: ORIGIN,
    care_instructions: COPPER_CARE,
    lead_time: 'Dispatch timing is confirmed after current-piece photographs are approved',
    status: 'active',
    published: true,
    ready_to_ship: true,
    made_to_order: false,
    limited_edition: true,
    one_of_one: false,
    is_bestseller: bestseller,
    rating: 0,
    review_count: 0,
    reviews: [],
    catalog_source: 'local_catalog',
    image_is_studio_preview: true,
    image_disclosure: 'Studio visualisation. Engraving and patina vary by hand-finished piece. We will share photographs of the exact available item before dispatch.',
    customization_label: 'Personalize engraving',
    customization_prompt: 'Tell us your preferred size, finish, inscription or gifting request.',
    craft_description: 'Naqashi decoration is worked as dense floral and chinar-inspired linework across the copper surface. Exact motifs vary from piece to piece.',
    material_description: 'Copper develops a natural patina over time. Finish, weight and food-use guidance are confirmed for the exact available item before dispatch.',
    created_date: `2026-07-${String(number + 24).padStart(2, '0')}T12:00:00.000Z`,
  };
};

const makeWalnutProduct = ({
  number,
  title,
  price,
  size,
  stock,
  description,
  bestseller = false,
}) => {
  const code = `walnut-${String(number).padStart(2, '0')}`;
  const image = `/images/products/walnut-wood/walnut${number}-main.jpg`;
  const images = ensureThreeImages(
    [image, `/images/products/walnut-wood/walnut${number}-main.png`],
    'Walnut Wood',
  );

  return {
    id: code,
    slug: code,
    sku: `PKM-WALNUT-${String(number).padStart(2, '0')}`,
    title,
    category: 'Walnut Wood',
    collection: 'Walnut Wood',
    embroidery_type: 'Walnut Wood Carving',
    craft: 'Kashmiri Walnut Wood Carving',
    short_description: `${title}, shaped and carved by hand in natural Kashmiri walnut wood.`,
    description,
    price,
    compare_at_price: null,
    images,
    image,
    sizes: [size],
    colors: ['Natural walnut'],
    stock,
    stock_quantity: stock,
    fabric: 'Kashmiri walnut wood',
    material: 'Kashmiri walnut wood',
    origin: ORIGIN,
    care_instructions: WOOD_CARE,
    lead_time: 'Dispatch timing is confirmed after current-piece photographs are approved',
    status: 'active',
    published: true,
    ready_to_ship: true,
    made_to_order: false,
    limited_edition: true,
    one_of_one: false,
    is_bestseller: bestseller,
    rating: 0,
    review_count: 0,
    reviews: [],
    catalog_source: 'local_catalog',
    image_is_studio_preview: true,
    image_disclosure: 'Studio visualisation. Grain, carving and colour vary by hand-finished piece. We will share photographs of the exact available item before dispatch.',
    customization_label: 'Personalize carving',
    customization_prompt: 'Tell us your preferred size, motif, inscription or gifting request.',
    craft_description: 'Each design is shaped and carved by hand, so depth, grain and small details naturally vary from piece to piece.',
    material_description: 'Natural Kashmiri walnut wood has distinctive grain and colour. The exact available piece is photographed and approved before dispatch.',
    created_date: `2026-08-${String(number).padStart(2, '0')}T12:00:00.000Z`,
  };
};

const makePapierProduct = ({
  number,
  title,
  price,
  size,
  stock,
  description,
  bestseller = false,
}) => {
  const code = `papier-${String(number).padStart(2, '0')}`;
  const image = `/images/products/papier-mache/papier${number}-main.jpg`;
  const images = ensureThreeImages(
    [image, `/images/products/papier-mache/papier${number}-main.png`],
    'Papier Mache',
  );

  return {
    id: code,
    slug: code,
    sku: `PKM-PAPIER-${String(number).padStart(2, '0')}`,
    title,
    category: 'Papier Mache',
    collection: 'Papier Mache',
    embroidery_type: 'Naqashi Painting',
    craft: 'Kashmiri Papier Mache',
    short_description: `${title}, shaped, lacquered and painted by hand in the Kashmiri naqashi tradition.`,
    description,
    price,
    compare_at_price: null,
    images,
    image,
    sizes: [size],
    colors: ['Hand-painted'],
    stock,
    stock_quantity: stock,
    fabric: 'Papier mache with hand-painted lacquer finish',
    material: 'Papier mache with hand-painted lacquer finish',
    origin: ORIGIN,
    care_instructions: PAPIER_CARE,
    lead_time: 'Dispatch timing is confirmed after current-piece photographs are approved',
    status: 'active',
    published: true,
    ready_to_ship: true,
    made_to_order: false,
    limited_edition: true,
    one_of_one: false,
    is_bestseller: bestseller,
    rating: 0,
    review_count: 0,
    reviews: [],
    catalog_source: 'local_catalog',
    image_is_studio_preview: true,
    image_disclosure: 'Studio visualisation. Brushwork, colour and lacquer naturally vary by hand-painted piece. We will share photographs of the exact available item before dispatch.',
    customization_label: 'Personalize painting',
    customization_prompt: 'Tell us your preferred colour, motif, inscription or gifting request.',
    craft_description: 'The form is prepared, smoothed and lacquered before fine naqashi patterns are painted by hand. Small differences are part of the craft.',
    material_description: 'A lightweight papier-mache base is sealed beneath painted and lacquered layers. The exact colour and surface are confirmed before dispatch.',
    created_date: `2026-08-${String(number + 6).padStart(2, '0')}T12:00:00.000Z`,
  };
};

const makeWillowProduct = ({
  number,
  title,
  price,
  size,
  stock,
  description,
  bestseller = false,
}) => {
  const code = `willow-${String(number).padStart(2, '0')}`;
  const image = `/images/products/willow-wicker/willow${number}-main.jpg`;
  const images = ensureThreeImages(
    [image, `/images/products/willow-wicker/willow${number}-main.png`],
    'Willow Wicker',
  );

  return {
    id: code,
    slug: code,
    sku: `PKM-WILLOW-${String(number).padStart(2, '0')}`,
    title,
    category: 'Willow Wicker',
    collection: 'Willow Wicker',
    embroidery_type: 'Willow Weaving',
    craft: 'Kashmiri Willow Wicker',
    short_description: `${title}, woven by hand from carefully selected willow.`,
    description,
    price,
    compare_at_price: null,
    images,
    image,
    sizes: [size],
    colors: ['Natural willow'],
    stock,
    stock_quantity: stock,
    fabric: 'Natural willow with wood accents where shown',
    material: 'Natural willow with wood accents where shown',
    origin: ORIGIN,
    care_instructions: WILLOW_CARE,
    lead_time: 'Dispatch timing is confirmed after current-piece photographs are approved',
    status: 'active',
    published: true,
    ready_to_ship: true,
    made_to_order: false,
    limited_edition: true,
    one_of_one: false,
    is_bestseller: bestseller,
    rating: 0,
    review_count: 0,
    reviews: [],
    catalog_source: 'local_catalog',
    image_is_studio_preview: true,
    image_disclosure: 'Studio visualisation. Willow tone, weave and dimensions naturally vary by handwoven piece. We will share photographs of the exact available item before dispatch.',
    customization_label: 'Customize weave',
    customization_prompt: 'Tell us your preferred size, weave, colour accent or gifting request.',
    craft_description: 'Willow rods are selected, softened and woven by hand around a shaped frame. Natural variation gives each basket its own rhythm.',
    material_description: 'Natural willow changes gently in tone with age. Wood accents and exact dimensions are confirmed for the available piece before dispatch.',
    created_date: `2026-08-${String(number + 12).padStart(2, '0')}T12:00:00.000Z`,
  };
};

const AARI_PRODUCTS = [
  makeProduct({
    craft: 'Aari',
    number: 1,
    title: 'Ivory Blue Aari Pheran',
    color: 'Ivory & blue',
    price: 12500,
    bestseller: true,
    images: [
      '/images/products/aari/generated/aari1-clean-front.png',
      '/images/products/aari/generated/aari1-angle-side.png',
      '/images/products/aari/generated/aari1-angle-detail.png',
    ],
  }),
  makeProduct({
    craft: 'Aari',
    number: 2,
    title: 'Charcoal Meadow Aari Pheran',
    color: 'Charcoal',
    price: 13500,
    images: [
      '/images/products/aari/generated/aari2-clean-front.png',
      '/images/products/aari/generated/aari2-angle-side.png',
      '/images/products/aari/generated/aari2-angle-detail.png',
    ],
  }),
  makeProduct({ craft: 'Aari', number: 3, title: 'Crimson Garden Aari Pheran', color: 'Crimson', price: 14500, bestseller: true }),
  makeProduct({ craft: 'Aari', number: 4, title: 'Cobalt Gold Aari Pheran', color: 'Cobalt blue', price: 14500 }),
  makeProduct({ craft: 'Aari', number: 5, title: 'Ivory Rose Aari Pheran', color: 'Ivory & rose', price: 12500 }),
  makeProduct({ craft: 'Aari', number: 6, title: 'Ivory Indigo Aari Pheran', color: 'Ivory & indigo', price: 12500 }),
  makeProduct({ craft: 'Aari', number: 7, title: 'Sand Garden Aari Pheran', color: 'Sand', price: 13500 }),
  makeProduct({ craft: 'Aari', number: 8, title: 'Teal Saffron Aari Pheran', color: 'Teal & saffron', price: 14500, bestseller: true }),
  makeProduct({ craft: 'Aari', number: 9, title: 'Ivory Garnet Aari Kurta', color: 'Ivory & garnet', price: 15500 }),
  makeProduct({ craft: 'Aari', number: 10, title: 'Aubergine Sage Aari Kurta', color: 'Aubergine', price: 15500, detailCount: 2 }),
];

const TILLA_PRODUCTS = [
  makeProduct({ craft: 'Tilla', number: 1, title: 'Graphite Copper Tilla Pheran', color: 'Graphite & copper', price: 21500, detailCount: 3, bestseller: true }),
  makeProduct({ craft: 'Tilla', number: 2, title: 'Cinnamon Silver Tilla Pheran', color: 'Cinnamon', price: 19500, detailCount: 2 }),
  makeProduct({ craft: 'Tilla', number: 3, title: 'Emerald Silver Tilla Ensemble', color: 'Emerald', price: 24500, detailCount: 2, category: 'Bridal', bestseller: true }),
  makeProduct({ craft: 'Tilla', number: 4, title: 'Garnet Silver Tilla Ensemble', color: 'Garnet', price: 22500, detailCount: 2 }),
  makeProduct({
    craft: 'Tilla',
    number: 5,
    title: 'Ruby Tilla Pashmina Wrap',
    color: 'Ruby red',
    price: 18500,
    detailCount: 2,
    category: 'Pashmina',
    material: 'Pashmina blend',
    description: 'A generous ruby wrap framed with metallic Tilla embroidery. The one-size drape is designed for winter occasions, bridal trousseaux and meaningful gifting.',
  }),
  makeProduct({ craft: 'Tilla', number: 6, title: 'Plum Silver Tilla Ensemble', color: 'Plum', price: 22500, detailCount: 1 }),
  makeProduct({ craft: 'Tilla', number: 7, title: 'Aqua Rose Tilla Ensemble', color: 'Aqua', price: 23500, detailCount: 1 }),
  makeProduct({ craft: 'Tilla', number: 8, title: 'Ivory Sapphire Tilla Ensemble', color: 'Ivory & sapphire', price: 24500, detailCount: 2, category: 'Bridal', bestseller: true }),
  makeProduct({ craft: 'Tilla', number: 9, title: 'Teal Copper Tilla Ensemble', color: 'Teal & copper', price: 23500, detailCount: 1 }),
  makeProduct({ craft: 'Tilla', number: 10, title: 'Burgundy Silver Tilla Ensemble', color: 'Burgundy', price: 22500, detailCount: 3 }),
];

const DABKA_PRODUCTS = [
  makeProduct({ craft: 'Dabka', number: 1, title: 'Midnight Fuchsia Dabka Ensemble', color: 'Midnight & fuchsia', price: 22500, detailCount: 2, bestseller: true }),
  makeProduct({ craft: 'Dabka', number: 2, title: 'Burnished Copper Dabka Ensemble', color: 'Burnished copper', price: 21500, detailCount: 1 }),
  makeProduct({ craft: 'Dabka', number: 3, title: 'Saffron Dabka Ensemble', color: 'Saffron', price: 19500, detailCount: 2 }),
  makeProduct({ craft: 'Dabka', number: 4, title: 'Sand Rose Dabka Ensemble', color: 'Sand & rose', price: 24500, detailCount: 1, category: 'Bridal' }),
  makeProduct({ craft: 'Dabka', number: 5, title: 'Maroon Dabka Ensemble', color: 'Maroon', price: 25500, detailCount: 1, category: 'Bridal', bestseller: true }),
  makeProduct({ craft: 'Dabka', number: 6, title: 'Forest Dabka Cape', color: 'Forest green', price: 23500, detailCount: 1 }),
  makeProduct({ craft: 'Dabka', number: 7, title: 'Ivory Gold Dabka Pheran', color: 'Ivory & gold', price: 21500, detailCount: 1 }),
];

const ZARI_PRODUCTS = [
  makeProduct({ craft: 'Zari', number: 1, title: 'Black Coral Zari Ensemble', color: 'Black & coral', price: 19500, detailCount: 2, material: 'Velvet blend', bestseller: true }),
  makeProduct({ craft: 'Zari', number: 2, title: 'Ivory Antique Gold Zari Pheran', color: 'Ivory & antique gold', price: 18500, detailCount: 0, studioPreview: true }),
];

const COPPER_PRODUCTS = [
  makeCopperProduct({
    number: 1,
    title: 'Chinar Naqashi Copper Ewer',
    price: 8500,
    size: '1.8 L',
    stock: 4,
    bestseller: true,
    description: 'A sculptural copper ewer with a long pouring lip, curved handle and chinar-inspired engraved surface. Its warm antique finish makes it a graceful table object or meaningful wedding gift.',
  }),
  makeCopperProduct({
    number: 2,
    title: 'Chinar Naqashi Lidded Serving Dish',
    price: 6800,
    size: '30 cm',
    stock: 3,
    description: 'A round copper serving dish paired with a matching domed lid. Dense engraved leaf work continues across the interior and cover for a ceremonial, heirloom-led presentation.',
  }),
  makeCopperProduct({
    number: 3,
    title: 'Chinar Naqashi Copper Keepsake Box',
    price: 5800,
    size: '24 cm',
    stock: 4,
    description: 'A low-footed copper keepsake box with a removable engraved lid and gently scalloped edges. Designed for jewellery, letters or gifting, with natural variation in every hand-finished surface.',
  }),
  makeCopperProduct({
    number: 4,
    title: 'Chinar Naqashi Copper Bowl Trio',
    price: 7500,
    size: 'Set of 3',
    stock: 3,
    description: 'Three graduated copper bowls brought together as a coordinated serving or display set. Wide polished rims balance the darkened chinar and floral engraving around each rounded form.',
  }),
  makeCopperProduct({
    number: 5,
    title: 'Kashmir Naqashi Copper Samovar Set',
    price: 18500,
    size: '3 L',
    stock: 2,
    bestseller: true,
    description: 'A statement copper samovar with a domed lid, pedestal warming base, serving tap and two matching cups. The richly engraved set is made for ceremonial tea moments and distinguished gifting.',
  }),
];

const WALNUT_PRODUCTS = [
  makeWalnutProduct({
    number: 1,
    title: 'Birdsong Carved Walnut Keepsake Box',
    price: 9500,
    size: '28 cm',
    stock: 2,
    bestseller: true,
    description: 'A rectangular walnut keepsake box covered with deep openwork carving of birds, flowers and curling leaves. The fitted lid and warm hand-rubbed finish make it an heirloom home object for letters, jewellery or meaningful gifts.',
  }),
  makeWalnutProduct({
    number: 2,
    title: 'Gul Carved Walnut Lidded Box',
    price: 6500,
    size: '24 cm',
    stock: 3,
    description: 'A round lidded walnut box with layered leaf carving around the top and a continuous floral band around the body. Its generous form suits dry keepsakes, jewellery or a considered wedding gift.',
  }),
  makeWalnutProduct({
    number: 3,
    title: 'Chinar Carved Walnut Wall Clock',
    price: 12500,
    size: '45 cm',
    stock: 2,
    bestseller: true,
    description: 'A statement wall clock framed by hand-carved scrolling leaves and warm natural walnut grain. A quiet clock movement and clear hour markers bring daily function to an ornamental Kashmiri woodcraft piece.',
  }),
  makeWalnutProduct({
    number: 4,
    title: 'Iris Carved Walnut Wall Panel',
    price: 8500,
    size: '60 cm',
    stock: 2,
    description: 'A tall arched walnut panel carved with a balanced flowering iris motif. Designed as a slim wall or shelf accent, its restrained relief lets the natural grain remain part of the composition.',
  }),
  makeWalnutProduct({
    number: 5,
    title: 'Tree of the Valley Chinar Plaque',
    price: 5500,
    size: '38 cm',
    stock: 3,
    description: 'A freestanding chinar-leaf plaque carved with a branching tree and textured foliage. The sculptural outline gives the small object presence on a console, bookshelf or gifting table.',
  }),
  makeWalnutProduct({
    number: 6,
    title: 'Gul Carved Walnut Hair Comb',
    price: 2800,
    size: '18 cm',
    stock: 5,
    description: 'A crescent-shaped wide-tooth walnut comb finished with a hand-carved floral vine. Smooth rounded teeth and a polished grip make it a useful personal object with the warmth of Kashmir woodcraft.',
  }),
];

const PAPIER_PRODUCTS = [
  makePapierProduct({
    number: 1,
    title: 'Noor Chinar Papier-Mache Keepsake Box',
    price: 3800,
    size: '15 cm',
    stock: 5,
    bestseller: true,
    description: 'A scalloped charcoal keepsake box covered in antique-gold chinar leaves and fine vine borders. The compact lacquered form is made for jewellery, small letters or considered gifting.',
  }),
  makePapierProduct({
    number: 2,
    title: 'Saffron Garden Papier-Mache Box Pair',
    price: 5500,
    size: 'Set of 2',
    stock: 3,
    description: 'A coordinated pair of rounded keepsake boxes: one ivory garden pattern and one garnet chinar design. Their different sizes make the set useful for jewellery, mementos and wedding gifts.',
  }),
  makePapierProduct({
    number: 3,
    title: 'Zoon Garden Papier-Mache Floor Vase',
    price: 12500,
    size: '60 cm',
    stock: 2,
    bestseller: true,
    description: 'A tall floor vase with a long neck, generous shoulder and dense painted garden. Muted saffron, forest and rust details give the sculptural form a warm, collected character.',
  }),
  makePapierProduct({
    number: 4,
    title: 'Guldaan Papier-Mache Decorative Ewer',
    price: 8500,
    size: '45 cm',
    stock: 2,
    description: 'A lidded decorative ewer with a curved black handle, pouring spout and pedestal foot. Fine floral painting wraps the rounded body for an expressive shelf or table object.',
  }),
  makePapierProduct({
    number: 5,
    title: 'Nigeen Miniature Papier-Mache Trinket Box',
    price: 2800,
    size: '12 cm',
    stock: 6,
    description: 'A small round trinket box painted with coral and dusty-blue flowers around a central medallion. Its quiet ivory ground and fine brushwork suit rings, small keepsakes and guest gifting.',
  }),
  makePapierProduct({
    number: 6,
    title: 'Chinar Garden Papier-Mache Box Quartet',
    price: 7500,
    size: 'Set of 4',
    stock: 3,
    description: 'Four graduated round and oval boxes brought together as a coordinated gift set. Each charcoal-lacquered lid carries a different floral medallion in muted turquoise, rust and gold.',
  }),
];

const WILLOW_PRODUCTS = [
  makeWillowProduct({
    number: 1,
    title: 'Crescent Willow Carry Basket',
    price: 3500,
    size: '38 cm',
    stock: 5,
    bestseller: true,
    description: 'A sculptural crescent basket whose broad curved rim becomes the handle. The close honey-toned weave is strong enough for daily carrying and elegant enough to leave on display.',
  }),
  makeWillowProduct({
    number: 2,
    title: 'Valley Willow Picnic Basket',
    price: 4800,
    size: '45 cm',
    stock: 4,
    description: 'A low oval picnic basket with a tall arched handle, braided rim and fitted split lids. Its generous interior is designed for relaxed outings, gifting or useful home storage.',
  }),
  makeWillowProduct({
    number: 3,
    title: 'Lidded Willow Storage Basket',
    price: 4200,
    size: '35 cm',
    stock: 4,
    description: 'A round woven storage basket framed by dark walnut-toned bands and a flat handled lid. The calm two-material finish works naturally in bedrooms, studies and living spaces.',
  }),
  makeWillowProduct({
    number: 4,
    title: 'Willow and Walnut Tissue Box Cover',
    price: 2200,
    size: '25 cm',
    stock: 6,
    description: 'A rectangular tissue box cover that pairs close willow weaving with a dark wooden top and fine braided edges. It brings useful craft detail to a bedside, desk or washroom.',
  }),
  makeWillowProduct({
    number: 5,
    title: 'Valley Stripe Willow Market Basket',
    price: 3800,
    size: '40 cm',
    stock: 4,
    description: 'An open oval market basket with two integrated handles and restrained forest and terracotta woven bands. The sturdy braided rim makes it practical for errands, storage and gifting.',
  }),
];

export const CATALOG_PRODUCTS = [
  ...AARI_PRODUCTS,
  ...TILLA_PRODUCTS,
  ...DABKA_PRODUCTS,
  ...ZARI_PRODUCTS,
  ...COPPER_PRODUCTS,
  ...WALNUT_PRODUCTS,
  ...PAPIER_PRODUCTS,
  ...WILLOW_PRODUCTS,
];

export const CATALOG_PRODUCT_COUNT = CATALOG_PRODUCTS.length;


