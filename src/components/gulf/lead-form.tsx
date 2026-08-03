"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { services, countries, cities, type CountrySlug } from "@/lib/gulf-data";

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  company: z.string().optional(),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Valid phone required"),
  country: z.string(),
  city: z.string(),
  service: z.string(),
  message: z.string().min(10, "Please describe your requirement"),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  defaultService?: string;
  defaultCountry?: CountrySlug;
  defaultCity?: string;
  source?: string;
  variant?: "card" | "plain";
}

export function LeadForm({
  defaultService,
  defaultCountry = "uae",
  defaultCity,
  source = "website-rfq",
  variant = "card",
}: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const availableCities = cities.filter((c) => c.country === defaultCountry);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      country: defaultCountry,
      city: defaultCity ?? "",
      service: defaultService ?? "",
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = form;

  const selectedCountry = watch("country");

  async function onSubmit(values: LeadFormValues) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      toast({
        title: "Request received",
        description: "Our team will contact you within 1 business hour.",
      });
      reset();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold">Request Received</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you. A Gulf Seismic specialist will contact you within 1 business hour to
          discuss your project.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Submit another request
        </Button>
      </div>
    );
  }

  const fields = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" {...register("name")} placeholder="Ahmed Al Mansoori" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register("company")} placeholder="Company name" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="you@company.com" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone / WhatsApp *</Label>
          <Input id="phone" {...register("phone")} placeholder="+971 50 123 4567" />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Country</Label>
          <Select
            value={selectedCountry}
            onValueChange={(v) => {
              setValue("country", v);
              setValue("city", "");
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.flag} {c.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>City</Label>
          <Select value={watch("city")} onValueChange={(v) => setValue("city", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities
                .filter((c) => c.country === selectedCountry)
                .map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Service</Label>
          <Select value={watch("service")} onValueChange={(v) => setValue("service", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Project Details *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Describe your project: location, area, timeline, scope..."
          rows={4}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Request Free Quote
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        We respond within 1 business hour. Your details are confidential.
      </p>
    </form>
  );

  if (variant === "plain") return fields;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">{fields}</div>
  );
}
