"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Phone } from "lucide-react";

export function WhatsAppFab({ whatsapp, phone }: { whatsapp: string; phone: string }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {open && (
        <div className="w-72 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between bg-[#25D366] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold text-sm">Chat with Gulf Seismic</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Need road or industrial marking? Message us on WhatsApp for an instant response.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/${whatsapp}?text=Hello%20Gulf%20Seismic,%20I%20would%20like%20a%20quote%20for%20road%20marking.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1da851]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
              >
                <Phone className="h-4 w-4" />
                Call {phone}
              </a>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Open WhatsApp chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
