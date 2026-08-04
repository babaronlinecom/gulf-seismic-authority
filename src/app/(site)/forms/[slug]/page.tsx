import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { Card } from "@/components/ui/card";
import { PublicFormRenderer } from "@/components/gulf/public-form-renderer";
import { db } from "@/lib/db";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const form = await db.form.findUnique({ where: { slug } });
  if (!form) return { title: "Form Not Found" };
  return { title: `${form.name} | Gulf Seismic` };
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await db.form.findUnique({ where: { slug } });
  if (!form || form.status !== "active") notFound();

  return (
    <>
      <PageHero
        eyebrow="Form"
        title={form.name}
        description={form.description || undefined}
        crumbs={[{ name: form.name, url: `/forms/${form.slug}` }]}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PublicFormRenderer
            form={{
              name: form.name,
              slug: form.slug,
              description: form.description,
              fields: JSON.parse(form.fields),
              submitLabel: form.submitLabel,
              successMessage: form.successMessage,
              status: form.status,
            }}
          />
        </div>
      </section>
    </>
  );
}
