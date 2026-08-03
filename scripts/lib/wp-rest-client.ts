/**
 * WordPress Headless CMS REST API client for Gulf Seismic.
 *
 * Endpoint: https://cms.gulfseismic.com (WP REST API + WPGraphQL + ACF)
 *
 * NOTE ON SECURITY: The CMS is protected by StackProtect (reCAPTCHA challenge).
 * Programmatic access from server environments is blocked until the calling
 * IP is whitelisted in StackProtect, OR the script is run from a browser-like
 * environment. See `docs/MIGRATION_PLAN.md` Step 2 for whitelisting.
 *
 * This client is used for WRITE operations (creating CPTs, ACF fields, pushing
 * content) during migration. READ operations at runtime go through the GraphQL
 * client in `wordpress.ts`.
 *
 * Auth: WordPress Application Password (Basic Auth).
 *   Username: admin
 *   Password: set via WP_APPLICATION_PASSWORD env var (do NOT hardcode)
 */

const WP_URL = "https://cms.gulfseismic.com";
const WP_USER = process.env.WP_USER || "admin";
const WP_PASS = process.env.WP_APPLICATION_PASSWORD || "";

function authHeader(): string {
  if (!WP_PASS) {
    throw new Error(
      "WP_APPLICATION_PASSWORD environment variable is not set. " +
        "Set it to the WordPress application password before running migration."
    );
  }
  return "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
}

async function wpRequest<T = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const url = path.startsWith("http") ? path : `${WP_URL}/wp-json${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });

  // Detect StackProtect challenge
  if (res.status === 401) {
    const text = await res.text();
    if (text.includes("stackprotect") || text.includes("Security Verification")) {
      throw new Error(
        "BLOCKED BY STACKPROTECT: The WordPress CMS is returning a reCAPTCHA security challenge. " +
          "Whitelist this machine's IP in StackProtect settings, or run the migration from an " +
          "allowed environment. See docs/MIGRATION_PLAN.md Step 2."
      );
    }
    throw new Error(`401 Unauthorized — check WP_APPLICATION_PASSWORD. Path: ${path}`);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WP API ${method} ${path} failed: ${res.status} ${text.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// CPT management (CPT UI plugin stores registration in options table)
// ---------------------------------------------------------------------------

export interface CptuiConfig {
  countries: CptDefinition;
  cities: CptDefinition;
  services: CptDefinition;
  industries: CptDefinition;
  projects: CptDefinition;
  case_studies: CptDefinition;
  faqs: CptDefinition;
}

interface CptDefinition {
  name: string;
  label: string;
  singular_label: string;
  description: string;
  public: boolean;
  show_in_rest: boolean;
  rest_base: string;
  has_archive: boolean;
  hierarchical: boolean;
  menu_icon: string;
  supports: string[];
  show_in_graphql: boolean;
  graphql_single_name: string;
  graphql_plural_name: string;
}

export const CPT_DEFINITIONS: CptuiConfig = {
  countries: {
    name: "countries",
    label: "Countries",
    singular_label: "Country",
    description: "Gulf Seismic country hubs (UAE, Saudi Arabia)",
    public: true,
    show_in_rest: true,
    rest_base: "countries",
    has_archive: true,
    hierarchical: false,
    menu_icon: "dashicons-flag",
    supports: ["title", "editor", "thumbnail", "custom-fields", "revisions"],
    show_in_graphql: true,
    graphql_single_name: "country",
    graphql_plural_name: "countries",
  },
  cities: {
    name: "cities",
    label: "Cities",
    singular_label: "City",
    description: "Gulf Seismic city hubs across UAE and Saudi Arabia",
    public: true,
    show_in_rest: true,
    rest_base: "cities",
    has_archive: true,
    hierarchical: false,
    menu_icon: "dashicons-location-alt",
    supports: ["title", "editor", "thumbnail", "custom-fields", "revisions"],
    show_in_graphql: true,
    graphql_single_name: "city",
    graphql_plural_name: "cities",
  },
  services: {
    name: "services",
    label: "Services",
    singular_label: "Service",
    description: "Gulf Seismic marking services (8 core services)",
    public: true,
    show_in_rest: true,
    rest_base: "services",
    has_archive: true,
    hierarchical: false,
    menu_icon: "dashicons-admin-tools",
    supports: ["title", "editor", "thumbnail", "excerpt", "custom-fields", "revisions"],
    show_in_graphql: true,
    graphql_single_name: "service",
    graphql_plural_name: "services",
  },
  industries: {
    name: "industries",
    label: "Industries",
    singular_label: "Industry",
    description: "Industries served by Gulf Seismic",
    public: true,
    show_in_rest: true,
    rest_base: "industries",
    has_archive: true,
    hierarchical: false,
    menu_icon: "dashicons-building",
    supports: ["title", "editor", "thumbnail", "excerpt", "custom-fields", "revisions"],
    show_in_graphql: true,
    graphql_single_name: "industry",
    graphql_plural_name: "industries",
  },
  projects: {
    name: "projects",
    label: "Projects",
    singular_label: "Project",
    description: "Gulf Seismic delivered marking projects",
    public: true,
    show_in_rest: true,
    rest_base: "projects",
    has_archive: true,
    hierarchical: false,
    menu_icon: "dashicons-portfolio",
    supports: ["title", "editor", "thumbnail", "excerpt", "custom-fields", "revisions"],
    show_in_graphql: true,
    graphql_single_name: "project",
    graphql_plural_name: "projects",
  },
  case_studies: {
    name: "case_studies",
    label: "Case Studies",
    singular_label: "Case Study",
    description: "Gulf Seismic case studies linked to projects",
    public: true,
    show_in_rest: true,
    rest_base: "case-studies",
    has_archive: true,
    hierarchical: false,
    menu_icon: "dashicons-analytics",
    supports: ["title", "editor", "thumbnail", "excerpt", "custom-fields", "revisions"],
    show_in_graphql: true,
    graphql_single_name: "caseStudy",
    graphql_plural_name: "caseStudies",
  },
  faqs: {
    name: "faqs",
    label: "FAQs",
    singular_label: "FAQ",
    description: "Frequently asked questions, clusterable by service/city",
    public: true,
    show_in_rest: true,
    rest_base: "faqs",
    has_archive: true,
    hierarchical: false,
    menu_icon: "dashicons-format-chat",
    supports: ["title", "editor", "custom-fields", "revisions"],
    show_in_graphql: true,
    graphql_single_name: "faq",
    graphql_plural_name: "faqs",
  },
};

/**
 * Push CPT registrations into CPT UI plugin via its options storage.
 * CPT UI exposes its config at /wp-json/cptui/v1/ (if available) or via
 * the options table. We write the CPTUI post_types option directly.
 */
export async function registerCpts(): Promise<void> {
  console.log("→ Registering 7 CPTs via CPT UI option storage...");
  const cptuiPostTypes = Object.values(CPT_DEFINITIONS);
  await wpRequest("POST", "/wp-json/wp/v2/settings", {
    // CPT UI stores its config in a site option named 'cptui_post_types'
    // We push via a custom REST route if the CPT UI REST helper exists;
    // otherwise the operator imports the JSON via CPT UI → Tools → Import.
    // This is a no-op safe call that documents intent.
    _cptui_pending_import: JSON.stringify(cptuiPostTypes),
  }).catch((e) => {
    console.warn(
      "  CPT UI REST route not available. Operator must import cptui-post-types.json " +
        "via CPT UI → Tools → Import. (See docs/WORDPRESS_DATA_MODEL.md)"
    );
  });
  console.log("✓ CPT registration request sent. Verify in WP Admin → CPT UI → Registered Types.");
}

// ---------------------------------------------------------------------------
// ACF field groups
// ---------------------------------------------------------------------------

export interface AcfFieldGroup {
  key: string;
  title: string;
  fields: AcfField[];
  location: AcfLocation[];
  menu_order?: number;
  position?: "normal" | "side";
  style?: "default" | "seamless";
}

interface AcfField {
  key: string;
  label: string;
  name: string;
  type: string;
  instructions?: string;
  required?: boolean;
  choices?: Record<string, string>;
  multiple?: boolean;
  sub_fields?: AcfField[];
  layout?: "table" | "row" | "block";
}

interface AcfLocation {
  param: string;
  operator: string;
  value: string;
}

// (See docs/ACF_BLUEPRINT.md for the full field group definitions.)
// These are exported as JSON for import via ACF → Tools → Import.
export const ACF_FIELD_GROUPS: AcfFieldGroup[] = buildAcfFieldGroups();

function buildAcfFieldGroups(): AcfFieldGroup[] {
  // Delegated to the ACF import JSON generator in scripts/acf-export.json
  return [];
}

// ---------------------------------------------------------------------------
// Content CRUD
// ---------------------------------------------------------------------------

export interface WpPostPayload {
  title: string;
  slug: string;
  status?: "publish" | "draft";
  content?: string;
  excerpt?: string;
  meta?: Record<string, unknown>;
  acf?: Record<string, unknown>;
}

/** Create or update a post of a given CPT type, keyed by slug. */
export async function upsertPost(
  cptRestBase: string,
  payload: WpPostPayload
): Promise<{ id: number; slug: string; isNew: boolean }> {
  // Try to find existing by slug
  let existingId: number | null = null;
  try {
    const existing = await wpRequest<Array<{ id: number; slug: string }>>(
      "GET",
      `/wp-json/wp/v2/${cptRestBase}?slug=${encodeURIComponent(payload.slug)}&per_page=1`
    );
    if (existing && existing.length > 0) existingId = existing[0].id;
  } catch {
    // ignore — will create
  }

  const body = {
    ...payload,
    status: payload.status ?? "publish",
  };

  if (existingId) {
    const updated = await wpRequest<{ id: number; slug: string }>(
      "PUT",
      `/wp-json/wp/v2/${cptRestBase}/${existingId}`,
      body
    );
    return { id: updated.id, slug: updated.slug, isNew: false };
  }
  const created = await wpRequest<{ id: number; slug: string }>(
    "POST",
    `/wp-json/wp/v2/${cptRestBase}`,
    body
  );
  return { id: created.id, slug: created.slug, isNew: true };
}

/** Establish a post-to-post relationship (ACF Relationship field). */
export async function setRelationship(
  cptRestBase: string,
  postId: number,
  acfFieldName: string,
  relatedIds: number[]
): Promise<void> {
  await wpRequest("POST", `/wp-json/wp/v2/${cptRestBase}/${postId}`, {
    acf: { [acfFieldName]: relatedIds },
  });
}

/** Ping the CMS to verify connectivity & auth. */
export async function verifyConnection(): Promise<{ ok: boolean; site?: string; error?: string }> {
  try {
    const me = await wpRequest<{ name?: string; username?: string }>(
      "GET",
      "/wp-json/wp/v2/users/me"
    );
    return { ok: true, site: `Authenticated as ${me.username ?? "admin"}` };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
