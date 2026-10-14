export type Category = {
  slug: string;
  name: string;
  tag: string;
  blurb: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  img: string;
  desc: string;
};

export const categories: Category[] = [
  {
    slug: "bracelets",
    name: "Bracelets",
    tag: "silver / beaded",
    blurb: "Dainty stacks, charm bracelets and everyday silvers.",
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    tag: "heart / pearl",
    blurb: "Tiny hearts, pearls and layering pieces.",
  },
  {
    slug: "bookmarks",
    name: "Bookmarks",
    tag: "ribbon / charm",
    blurb: "Ribbon-and-charm bookmarks for your slow reads.",
  },
  {
    slug: "phone-charms",
    name: "Phone Charms",
    tag: "bow / star",
    blurb: "Little friends to hang from your phone.",
  },
  {
    slug: "keychains",
    name: "Keychains",
    tag: "tiny keepsakes",
    blurb: "Cute little charms to make your keys yours.",
  },
  {
    slug: "earrings",
    name: "Earrings",
    tag: "sweet little details",
    blurb: "Handmade earrings for everyday outfits and special days.",
  },
  {
    slug: "bag-charms",
    name: "Bag Charms",
    tag: "clip-on cuties",
    blurb: "Playful charms made to clip onto your favorite bag.",
  },
];

const categoryByPrefix: Record<string, { slug: string; productType: string }> = {
  bracelet: { slug: "bracelets", productType: "Bracelet" },
  necklace: { slug: "necklaces", productType: "Necklace" },
  bookcharm: { slug: "bookmarks", productType: "Bookmark" },
  phonecharm: { slug: "phone-charms", productType: "Phone Charm" },
  keychain: { slug: "keychains", productType: "Keychain" },
  earring: { slug: "earrings", productType: "Earrings" },
  bagcharm: { slug: "bag-charms", productType: "Bag Charm" },
};

const productImages = import.meta.glob<string>("../assets/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

const titleCase = (value: string) => value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

// Individual prices in rupees; edit the value next to an item's image filename.
const pricesByProductId: Record<string, number> = {
  bracelet_aura: 200,
  bracelet_bluebrown: 100,
  bracelet_butterfly: 150,
  bracelet_candydrops: 150,
  bracelet_caramelcollection_toffeetwist: 150,
  bracelet_cherry: 170,
  bracelet_chunky: 180,
  bracelet_chunkyheart: 100,
  bracelet_coastalwhisper: 150,
  bracelet_faintypink: 100,
  bracelet_floralchain: 120,
  bracelet_flowermetal: 120,
  bracelet_handchain: 150,
  bracelet_indie: 180,
  bracelet_layered: 180,
  bracelet_littleheart: 150,
  bracelet_lock: 120,
  bracelet_marshmallowpop: 200,
  bracelet_midnightembrace: 200,
  bracelet_moonlit_spiral: 120,
  bracelet_moonlit_star: 120,
  bracelet_morsecode: 120,
  bracelet_paperclipcharm: 200,
  bracelet_pinkcharm: 200,
  bracelet_spiderman: 170,
  bracelet_squarepearl: 150,
  bracelet_stone: 150,
  bracelet_stonecharm_blue: 150,
  bracelet_stonecharm_green: 150,
  bracelet_stonecharm_pearl: 150,
  bracelet_stonecharm_pink: 150,
  bracelet_stonecharm_red: 150,
  bracelet_stonecharm_white: 150,
  bracelet_string_floral: 170,
  bracelet_string_pinkandpeach: 170,
  bracelet_string_pinkfloral: 170,
  bracelet_string_pinkflowers: 170,
  bracelet_string_purplefloral: 170,
  bracelet_string_redfloral1: 170,
  bracelet_string_redfloral2: 170,
  bracelet_string_whitefloral: 170,
  bracelet_teddycharm: 180,
  bracelet_toffeetwist: 150,
  bracelet_vintagepearl: 150,
  bracelet_watch_blackspider: 250,
  bracelet_watch_petalgrace: 250,
  bracelet_watch_vividessence: 250,
  bracelet_white: 170,
  necklace_at_high: 280,
  necklace_at_low: 200,
  necklace_at_med: 250,
  necklace_at_med1: 250,
  necklace_at_medlow: 220,
  necklace_bow: 180,
  necklace_caramelcollection_goldendrizzle: 350,
  necklace_fairy: 250,
  necklace_fire1: 200,
  necklace_goldendawn: 200,
  necklace_longchain: 300,
  necklace_pearlbow: 200,
  necklace_pinkheart: 200,
  necklace_vintage: 200,
  bookcharm_bouquet: 200,
  bookcharm_butterfly_blue: 180,
  bookcharm_butterfly_grey: 180,
  bookcharm_butterfly_pink: 180,
  bookcharm_butterfly_purple: 180,
  bookcharm_butterfly_white: 180,
  bookcharm_pinkbow: 200,
  phonecharm_hellokitty: 180,
  phonecharm_pearlheart: 180,
  phonecharm_pink: 150,
  phonecharm_pinkphone: 180,
  phonecharm_pinkstring: 200,
  phonecharm_tulip: 120,
  phonecharm_white: 150,
  keychain_fishies: 200,
  keychain_pinkbow: 200,
  keychain_pinkbow1: 200,
  earring_chained1: 200,
  earring_snake: 150,
  "bagcharm_lippie (1) - Copy": 200,
  "bagcharm_lippie (2)": 300,
};

export const products: Product[] = Object.entries(productImages)
  .flatMap(([path, img]) => {
    const filename =
      path
        .split("/")
        .pop()
        ?.replace(/\.png$/i, "") ?? "";
    const separator = filename.indexOf("_");
    if (separator < 0) return [];

    const prefix = filename.slice(0, separator);
    const category = categoryByPrefix[prefix];
    if (!category) return [];

    const price = pricesByProductId[filename];
    if (price === undefined) {
      throw new Error(`Add a price for product image "${filename}" in pricesByProductId.`);
    }

    const itemName = titleCase(filename.slice(separator + 1).replace(/_/g, " "));
    const categoryName = categories.find((item) => item.slug === category.slug)?.name;
    if (!categoryName) return [];

    return [
      {
        id: filename,
        name: `${itemName} ${category.productType}`,
        price,
        category: category.slug,
        img,
        desc: `Handmade ${categoryName.toLowerCase()} piece — small batch, packed with a little note.`,
      },
    ];
  })
  .sort(
    (a, b) =>
      categories.findIndex((category) => category.slug === a.category) -
        categories.findIndex((category) => category.slug === b.category) ||
      a.name.localeCompare(b.name),
  );

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const formatPrice = (n: number) => `₹ ${n.toLocaleString("en-IN")}`;
