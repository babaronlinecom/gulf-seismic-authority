/**
 * CMS data access — reads site content from the database.
 *
 * Used by public-facing components (Header, Footer, Hero, pages, blog) to
 * render content managed from the admin panel. All functions return seed
 * fallbacks when the DB is unreachable (build-time safety).
 */
import { db } from "./db";

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoText: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  linkedin: string;
  instagram: string;
  workingHours: string;
  footerAbout: string;
  certifications: string[];
}

export interface MenuLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

export interface HeroData {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  cta2Label?: string;
  cta2Url?: string;
  stats?: { label: string; value: string }[];
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Gulf Seismic",
  tagline: "Precision. Safety. Quality.",
  logoText: "GS",
  logoUrl: "/logo.png",
  phone: "+971 2 555 5769",
  whatsapp: "971549970833",
  email: "roadmarking@gulfseismic.com",
  address: "P.O. Box 93187, Abu Dhabi, United Arab Emirates",
  linkedin: "https://www.linkedin.com/company/gulf-seismic",
  instagram: "https://www.instagram.com/gulfseismic",
  workingHours: "Sat–Thu, 08:00–18:00",
  footerAbout:
    "Gulf Seismic General Contracting L.L.C. is a leading road marking service provider based in Abu Dhabi, UAE, with operations across Saudi Arabia through Seismic Contracting Company LLC.",
  certifications: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018", "OSHA", "ADNOC Approved", "Aramco Approved"],
};

const DEFAULT_HEADER_MENU: MenuLink[] = [
  { id: "1", label: "Services", url: "/services/road-marking", order: 1 },
  { id: "2", label: "🇦🇪 UAE", url: "/uae", order: 2 },
  { id: "3", label: "🇸🇦 Saudi Arabia", url: "/saudi-arabia", order: 3 },
  { id: "4", label: "Projects", url: "/projects", order: 4 },
  { id: "5", label: "Industries", url: "/industries", order: 5 },
  { id: "6", label: "Blog", url: "/blog", order: 6 },
  { id: "7", label: "About", url: "/about", order: 7 },
];

const DEFAULT_FOOTER_MENU: MenuLink[] = [
  { id: "f1", label: "About Us", url: "/about", order: 1 },
  { id: "f2", label: "Projects", url: "/projects", order: 2 },
  { id: "f3", label: "Industries", url: "/industries", order: 3 },
  { id: "f4", label: "Case Studies", url: "/case-studies", order: 4 },
  { id: "f5", label: "Blog", url: "/blog", order: 5 },
  { id: "f6", label: "Contact", url: "/contact", order: 6 },
];

const DEFAULT_HERO: HeroData = {
  eyebrow: "Serving 16 cities across UAE & Saudi Arabia",
  heading: "The Gulf's Authority in Road & Industrial Marking",
  subheading:
    "From thermoplastic highway lines to airport runways, warehouse floors and epoxy systems — Gulf Seismic delivers municipal-spec marking quality engineered for the extreme Gulf climate.",
  ctaLabel: "Get a Free Quote",
  ctaUrl: "/contact",
  cta2Label: "Explore Services",
  cta2Url: "/services/road-marking",
  stats: [
    { label: "Cities served", value: "16" },
    { label: "km of lines applied", value: "2,400+" },
    { label: "Projects delivered", value: "850+" },
    { label: "Years in the Gulf", value: "10" },
  ],
};

/** Get all site settings as a typed object. */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.siteSetting.findMany();
    if (rows.length === 0) return DEFAULT_SETTINGS;
    const obj: Record<string, unknown> = {};
    for (const row of rows) {
      try {
        obj[row.key] = JSON.parse(row.value);
      } catch {
        obj[row.key] = row.value;
      }
    }
    return { ...DEFAULT_SETTINGS, ...obj } as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Get menu items for a location (header | footer). */
export async function getMenuItems(location: "header" | "footer"): Promise<MenuLink[]> {
  try {
    const items = await db.menuItem.findMany({
      where: { location },
      orderBy: { order: "asc" },
    });
    if (items.length === 0) {
      return location === "header" ? DEFAULT_HEADER_MENU : DEFAULT_FOOTER_MENU;
    }
    return items.map((i) => ({ id: i.id, label: i.label, url: i.url, order: i.order }));
  } catch {
    return location === "header" ? DEFAULT_HEADER_MENU : DEFAULT_FOOTER_MENU;
  }
}

/** Get the hero section for a page (defaults to home). */
export async function getHero(page = "home"): Promise<HeroData> {
  try {
    const hero = await db.heroSection.findFirst({
      where: { page },
      orderBy: { order: "asc" },
    });
    if (!hero) return DEFAULT_HERO;
    let stats: { label: string; value: string }[] | undefined;
    if (hero.stats) {
      try {
        stats = JSON.parse(hero.stats);
      } catch {
        stats = undefined;
      }
    }
    return {
      eyebrow: hero.eyebrow ?? undefined,
      heading: hero.heading,
      subheading: hero.subheading ?? undefined,
      ctaLabel: hero.ctaLabel ?? undefined,
      ctaUrl: hero.ctaUrl ?? undefined,
      cta2Label: hero.cta2Label ?? undefined,
      cta2Url: hero.cta2Url ?? undefined,
      stats,
    };
  } catch {
    return DEFAULT_HERO;
  }
}

/** Get a page by slug (for dynamic page rendering). */
export async function getPage(slug: string) {
  try {
    return await db.page.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

/** Get all published pages. */
export async function getPublishedPages() {
  try {
    return await db.page.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

/** Get published blog posts (paginated). */
export async function getPublishedPosts(opts?: { limit?: number; category?: string }) {
  try {
    return await db.post.findMany({
      where: {
        status: "published",
        ...(opts?.category ? { category: opts.category } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: opts?.limit ?? 20,
    });
  } catch {
    return [];
  }
}

/** Get a single published post by slug. */
export async function getPublishedPost(slug: string) {
  try {
    return await db.post.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

/** Get all blog categories (for filter UI). */
export async function getPostCategories(): Promise<string[]> {
  try {
    const posts = await db.post.findMany({
      where: { status: "published", NOT: { category: null } },
      distinct: ["category"],
      select: { category: true },
    });
    return posts.map((p) => p.category!).filter(Boolean);
  } catch {
    return [];
  }
}
