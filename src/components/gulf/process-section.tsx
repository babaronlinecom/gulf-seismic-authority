"use client";

import { motion } from "framer-motion";
import { ClipboardList, PenTool, Truck, HardHat, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Consult & Survey",
    description: "We assess your site, spec requirements and traffic conditions, then scope the work.",
  },
  {
    icon: PenTool,
    title: "Design & Plan",
    description: "Layout design, material selection and scheduling that minimise your downtime.",
  },
  {
    icon: Truck,
    title: "Mobilise",
    description: "Crews, equipment and materials mobilised to site with full HSE compliance.",
  },
  {
    icon: HardHat,
    title: "Execute",
    description: "Precision application to municipal spec with real-time quality control.",
  },
  {
    icon: ShieldCheck,
    title: "QC & Handover",
    description: "Reflectivity, line-width and adhesion verified before we hand over.",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground/80">
            How We Work
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            A proven five-step delivery process
          </h2>
          <p className="mt-4 text-primary-foreground/60">
            Every project follows the same disciplined process — so you get consistent, municipal-spec
            quality on time, every time.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="relative h-full overflow-hidden border-primary-foreground/10 bg-primary-foreground/5 p-5">
                  <div className="absolute right-3 top-3 text-4xl font-bold text-primary-foreground/10">
                    {i + 1}
                  </div>
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-brand text-amber-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-primary-foreground/60">{step.description}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
