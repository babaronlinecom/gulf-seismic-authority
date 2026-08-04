/**
 * Seed ALL existing frontend content into the CMS database.
 * Pushes: 50 projects, 20 case studies, 6 blog posts, default pages, default forms.
 * Run: DATABASE_URL="..." bun run scripts/seed-content.ts
 */
import { db } from "../src/lib/db";
import { allProjects, allCaseStudies } from "../src/lib/gulf-content-merged";
import { blogPosts, services, industries, company } from "../src/lib/gulf-data";

async function main() {
  console.log("→ Seeding content into CMS database...\n");

  // --- 1. Projects ---
  console.log("→ Projects...");
  let projectCount = 0;
  for (const p of allProjects) {
    const existing = await db.projectRecord.findUnique({ where: { slug: p.slug } });
    if (existing) {
      // Update existing
      await db.projectRecord.update({
        where: { slug: p.slug },
        data: {
          title: p.title, country: p.country, city: p.city, service: p.service,
          industry: p.industry, client: p.client, year: p.year, duration: p.duration,
          location: p.location, area: p.area, challenge: p.challenge,
          solution: p.solution, execution: p.execution,
          materials: JSON.stringify(p.materials),
          equipment: JSON.stringify(p.equipment),
          results: JSON.stringify(p.results),
          status: "published",
        },
      });
    } else {
      await db.projectRecord.create({
        data: {
          slug: p.slug, title: p.title, country: p.country, city: p.city,
          service: p.service, industry: p.industry, client: p.client,
          year: p.year, duration: p.duration, location: p.location, area: p.area,
          challenge: p.challenge, solution: p.solution, execution: p.execution,
          materials: JSON.stringify(p.materials),
          equipment: JSON.stringify(p.equipment),
          results: JSON.stringify(p.results),
          status: "published",
        },
      });
      projectCount++;
    }
  }
  console.log(`  ✓ ${allProjects.length} projects (${projectCount} new)\n`);

  // --- 2. Case Studies ---
  console.log("→ Case Studies...");
  let csCount = 0;
  for (const cs of allCaseStudies) {
    const existing = await db.caseStudyRecord.findUnique({ where: { slug: cs.slug } });
    if (existing) {
      await db.caseStudyRecord.update({
        where: { slug: cs.slug },
        data: {
          title: cs.title, projectSlug: cs.projectSlug || null, summary: cs.summary,
          outcomes: JSON.stringify(cs.outcomes),
          testimonialQuote: cs.testimonial?.quote || null,
          testimonialAuthor: cs.testimonial?.author || null,
          testimonialRole: cs.testimonial?.role || null,
          status: "published",
        },
      });
    } else {
      await db.caseStudyRecord.create({
        data: {
          slug: cs.slug, title: cs.title, projectSlug: cs.projectSlug || null,
          summary: cs.summary, outcomes: JSON.stringify(cs.outcomes),
          testimonialQuote: cs.testimonial?.quote || null,
          testimonialAuthor: cs.testimonial?.author || null,
          testimonialRole: cs.testimonial?.role || null,
          status: "published",
        },
      });
      csCount++;
    }
  }
  console.log(`  ✓ ${allCaseStudies.length} case studies (${csCount} new)\n`);

  // --- 3. Blog Posts ---
  console.log("→ Blog Posts...");
  let postCount = 0;
  for (const post of blogPosts) {
    const existing = await db.post.findUnique({ where: { slug: post.slug } });
    const content = `# ${post.title}\n\n${post.excerpt}\n\n*Full article content to be expanded by the content team.*\n\n---\n\n**Category:** ${post.category}  \n**Author:** ${post.author}  \n**Read time:** ${post.readTime}\n`;
    if (existing) {
      await db.post.update({
        where: { slug: post.slug },
        data: {
          title: post.title, excerpt: post.excerpt, content,
          category: post.category, author: post.author,
          seoTitle: `${post.title} | Gulf Seismic`,
          seoDescription: post.excerpt,
          status: "published",
        },
      });
    } else {
      await db.post.create({
        data: {
          slug: post.slug, title: post.title, excerpt: post.excerpt, content,
          category: post.category, author: post.author,
          seoTitle: `${post.title} | Gulf Seismic`,
          seoDescription: post.excerpt,
          status: "published",
          publishedAt: new Date(post.date),
        },
      });
      postCount++;
    }
  }
  console.log(`  ✓ ${blogPosts.length} blog posts (${postCount} new)\n`);

  // --- 4. Default Pages ---
  console.log("→ Pages...");
  const pages = [
    {
      slug: "about", title: "About Gulf Seismic",
      heroEyebrow: "About Us",
      heroHeading: "The Gulf's authority in road & industrial marking",
      heroDescription: company.description,
      content: `## Our Mission\n\nTo deliver the highest-quality road and industrial marking across the Gulf — making roads safer, warehouses more efficient, and facilities more compliant — on every project, in every city.\n\n## Our Vision\n\nTo be the dominant authority platform for road and industrial marking across the UAE and Saudi Arabia.\n\n## Our Story\n\nFounded in ${company.founded} and headquartered in ${company.headquarters.city}, Gulf Seismic began as a specialist thermoplastic road marking contractor serving the UAE. Over a decade, we have grown into a full-spectrum marking authority.\n\n## Certifications\n\n- ISO 9001\n- ICAO Annex 14\n- OSHA / HSE\n- RTA & MOMRA Compliant`,
      excerpt: "Gulf Seismic is the UAE and Saudi Arabia authority for road and industrial marking.",
      seoTitle: "About Gulf Seismic | Road & Industrial Marking Authority",
      seoDescription: "Gulf Seismic — 10+ years delivering marking projects across the Gulf. ISO 9001 certified, ICAO Annex 14 compliant.",
      showInHeader: true, showInFooter: true, status: "published",
    },
    {
      slug: "privacy", title: "Privacy Policy",
      heroEyebrow: "Legal", heroHeading: "Privacy Policy",
      heroDescription: "How Gulf Seismic collects, uses, and protects your data.",
      content: `## Information We Collect\n\nWe collect information you provide when you submit a quote request, contact form, or subscribe to our newsletter. This includes your name, email, phone number, and project details.\n\n## How We Use Your Information\n\n- To respond to your inquiries and provide quotes\n- To deliver our services\n- To send you relevant updates (if you've subscribed)\n\n## Data Security\n\nWe implement appropriate technical and organizational measures to protect your personal data.\n\n## Contact\n\nFor privacy questions, email ${company.email}.`,
      seoTitle: "Privacy Policy | Gulf Seismic",
      seoDescription: "Gulf Seismic privacy policy — how we collect, use, and protect your data.",
      showInHeader: false, showInFooter: true, status: "published",
    },
    {
      slug: "terms", title: "Terms of Service",
      heroEyebrow: "Legal", heroHeading: "Terms of Service",
      heroDescription: "The terms and conditions for using Gulf Seismic's website and services.",
      content: `## Acceptance of Terms\n\nBy accessing this website, you agree to these terms of service.\n\n## Use of Website\n\nThis website is provided for informational purposes. You may not use it for any unlawful purpose.\n\n## Intellectual Property\n\nAll content on this website is the property of ${company.legalName} unless otherwise stated.\n\n## Limitation of Liability\n\nGulf Seismic shall not be liable for any indirect or consequential damages arising from the use of this website.\n\n## Contact\n\nFor questions about these terms, email ${company.email}.`,
      seoTitle: "Terms of Service | Gulf Seismic",
      seoDescription: "Gulf Seismic terms of service.",
      showInHeader: false, showInFooter: true, status: "published",
    },
  ];
  let pageCount = 0;
  for (const page of pages) {
    const existing = await db.page.findUnique({ where: { slug: page.slug } });
    if (existing) {
      await db.page.update({ where: { slug: page.slug }, data: page });
    } else {
      await db.page.create({ data: page });
      pageCount++;
    }
  }
  console.log(`  ✓ ${pages.length} pages (${pageCount} new)\n`);

  // --- 5. Default Forms ---
  console.log("→ Forms...");
  const forms = [
    {
      name: "Contact Form", slug: "contact",
      description: "General contact form displayed on the contact page.",
      fields: JSON.stringify([
        { type: "text", label: "Full Name", name: "name", required: true, placeholder: "Ahmed Al Mansoori" },
        { type: "email", label: "Email", name: "email", required: true, placeholder: "you@company.com" },
        { type: "tel", label: "Phone", name: "phone", required: false, placeholder: "+971 50 123 4567" },
        { type: "textarea", label: "Message", name: "message", required: true, placeholder: "How can we help?" },
      ]),
      submitLabel: "Send Message",
      successMessage: "Thank you! We'll get back to you within 1 business hour.",
      emailTo: company.email,
      status: "active",
    },
    {
      name: "RFQ Form", slug: "rfq",
      description: "Request for Quote form for project inquiries.",
      fields: JSON.stringify([
        { type: "text", label: "Full Name", name: "name", required: true },
        { type: "text", label: "Company", name: "company", required: false },
        { type: "email", label: "Email", name: "email", required: true },
        { type: "tel", label: "Phone / WhatsApp", name: "phone", required: true },
        { type: "select", label: "Country", name: "country", required: true, options: ["UAE", "Saudi Arabia", "Other"] },
        { type: "select", label: "Service", name: "service", required: true, options: services.map(s => s.name) },
        { type: "textarea", label: "Project Details", name: "message", required: true, placeholder: "Location, area, timeline, scope..." },
      ]),
      submitLabel: "Request Free Quote",
      successMessage: "Your request has been received. A Gulf Seismic specialist will contact you within 1 business hour.",
      emailTo: company.email,
      status: "active",
    },
    {
      name: "Newsletter Signup", slug: "newsletter",
      description: "Simple email signup for newsletter.",
      fields: JSON.stringify([
        { type: "email", label: "Email Address", name: "email", required: true, placeholder: "you@company.com" },
      ]),
      submitLabel: "Subscribe",
      successMessage: "You're subscribed! Watch for our next newsletter.",
      status: "active",
    },
  ];
  let formCount = 0;
  for (const form of forms) {
    const existing = await db.form.findUnique({ where: { slug: form.slug } });
    if (existing) {
      await db.form.update({ where: { slug: form.slug }, data: form });
    } else {
      await db.form.create({ data: form });
      formCount++;
    }
  }
  console.log(`  ✓ ${forms.length} forms (${formCount} new)\n`);

  console.log("=".repeat(50));
  console.log("  Content seeding complete!");
  console.log("=".repeat(50));
  console.log(`  Projects:     ${allProjects.length}`);
  console.log(`  Case Studies: ${allCaseStudies.length}`);
  console.log(`  Blog Posts:   ${blogPosts.length}`);
  console.log(`  Pages:        ${pages.length}`);
  console.log(`  Forms:        ${forms.length}`);
  console.log("=".repeat(50));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
