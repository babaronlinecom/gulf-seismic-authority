# Gulf Seismic — Saudi Arabia Expansion Strategy

> Saudi Arabia is the largest single market expansion for Gulf Seismic. This document defines the hub strategy, market opportunity, Vision 2030 alignment, and the localised content strategy for the 8 Saudi city hubs and 64 service-city pages.

---

## 1. Market Opportunity

| Metric | Value | Source |
|---|---|---|
| Population (KSA) | 36M+ | General Authority for Statistics |
| GDP | $1.1T | IMF 2024 |
| Construction market | $80B+ | Vision 2030 projects |
| Roads network | 270,000+ km | MOT |
| Airports (commercial) | 28 | GACA |
| Megaprojects pipeline | $1T+ | Vision 2030 |
| Industrial cities | 35 | MODON |
| Annual road marking demand (est.) | $250M+ | Industry estimate |

The Saudi road marking market is **3–4× larger** than the UAE market. Gulf Seismic's Saudi expansion is the primary growth vector for 2024–2026.

---

## 2. Vision 2030 Alignment

Saudi Vision 2030 is the kingdom's strategic framework to diversify the economy away from oil. It directly drives demand for road & industrial marking:

| Vision 2030 Theme | Marking demand driver |
|---|---|
| **NEOM** | $500B smart city — thousands of km of new road marking |
| **Red Sea Project** | Tourism megaproject — airport, highway, marina marking |
| **Qiddiya** | Entertainment city near Riyadh — theme park, road, parking marking |
| **Diriyah Gate** | Heritage site near Riyadh — wayfinding, safety signage |
| **Riyadh Metro & BRT** | Public transit — bus lane, station floor, platform marking |
| **Roshn** | National housing developer — residential road + parking marking |
| **MODON industrial cities** | 35 cities — warehouse, factory, hazard marking |
| **Renewable energy (ACWA Power)** | Solar fields — safety signage, equipment marking |
| **Pilgrimage (Hajj/Umrah)** | Makkah/Madinah — pedestrian wayfinding, road marking |
| **MOMRA road upgrades** | Municipal road marking tenders nationwide |

### Compliance & approvals
| Authority | Scope |
|---|---|
| **MOMRA** (Ministry of Municipal, Rural Affairs & Housing) | Municipal road marking specifications |
| **MOT** (Ministry of Transport) | Highway marking specs |
| **GACA** (General Authority of Civil Aviation) | Airport marking approval |
| **MODON** (Saudi Authority for Industrial Cities) | Industrial city marking approval |
| **SASO** (Saudi Standards Organization) | Material standards (SASO 2663 for thermoplastic) |
| **Saudi Building Code** | Epoxy flooring compliance |

---

## 3. The 8 Saudi City Hubs

| City | Province | Population | Strategic role | Route |
|---|---|---|---|---|
| **Riyadh** | Riyadh | 7.6M | Capital — largest market; Qiddiya, Diriyah, Roshn HQ | `/saudi-arabia/riyadh` |
| **Jeddah** | Makkah | 4M | Commercial gateway; Red Sea access; Jeddah Airport | `/saudi-arabia/jeddah` |
| **Dammam** | Eastern Province | 1.5M | Oil & gas hub; King Abdulaziz Port | `/saudi-arabia/dammam` |
| **Khobar** | Eastern Province | 500K | Corporate / commercial; petrochemical HQs | `/saudi-arabia/khobar` |
| **Jubail** | Eastern Province | 600K | World's largest industrial city (Jubail Industrial City) | `/saudi-arabia/jubail` |
| **Yanbu** | Madinah | 400K | Industrial city on Red Sea; oil refinery | `/saudi-arabia/yanbu` |
| **Makkah** | Makkah | 2M | Pilgrimage; Hajj/Umrah infrastructure | `/saudi-arabia/makkah` |
| **Madinah** | Madinah | 1.5M | Pilgrimage; Knowledge Economic City | `/saudi-arabia/madinah` |

---

## 4. Localised Content Strategy

Every Saudi page must reflect the local market reality — not be a translation of the UAE page.

### 4.1 Authority differences
| Concern | UAE | Saudi Arabia |
|---|---|---|
| Highway authority | RTA / DoT | MOT / MOMRA |
| Airport authority | GCAA | GACA |
| Industrial authority | IDC | MODON |
| Standards | RTA M115 | SASO 2663 / Saudi Building Code |
| Currency | AED | SAR |
| Weekend | Sat–Sun | Fri–Sat |
| Language | English + Arabic | Arabic-primary + English |
| Prayer times | Less critical | Schedule around Salah (esp. Friday) |
| Ramadan | Reduced hours | Reduced hours; iftar breaks |

### 4.2 Climate differences
| City | Summer peak | Notes |
|---|---|---|
| Riyadh | 47°C | Dry heat, large diurnal range |
| Jeddah | 42°C | Humid coastal |
| Dammam / Khobar | 46°C | Humid coastal, dust storms |
| Jubail | 44°C | Industrial, high humidity |
| Yanbu | 43°C | Coastal, industrial |
| Makkah | 45°C | Pilgrim heat stress |
| Madinah | 44°C | Dry, dust storms |

Marking specifications must reference city-specific climate (UV index, humidity, dust) — not generic "Gulf climate".

### 4.3 Megaproject mentions per city
| City | Megaprojects to reference |
|---|---|
| Riyadh | Qiddiya, Diriyah Gate, Roshn, Riyadh Metro, King Salman Park |
| Jeddah | Jeddah Central Project, Jeddah Airport expansion, Red Sea Gateway |
| Dammam | King Abdulaziz Port expansion, Dammam Metro (proposed) |
| Khobar | Khobar Corniche redevelopment, Half Moon Bay |
| Jubail | Jubail 3 expansion, crude-to-chemicals (COTC) project |
| Yanbu | Yanbu Refinery expansion, Red Sea petrochemical complex |
| Makkah | Makkah Route Initiative, Haram expansion, Makkah BRT |
| Madinah | Knowledge Economic City, Madinah Airport expansion |

### 4.4 Local FAQ per city (examples)
| City | Sample FAQ |
|---|---|
| Riyadh | "Are you approved by MOMRA Riyadh Municipality?" |
| Jeddah | "Do you work with Jeddah Airports Company (JAC)?" |
| Dammam | "Can you mark petrochemical plant floors in Dammam?" |
| Jubail | "Are you MODON-approved for Jubail Industrial City?" |
| Makkah | "Can you complete marking before Hajj season?" |
| Madinah | "Do you offer pedestrian wayfinding for pilgrim routes?" |

---

## 5. Bilingual Strategy (Phase 2)

| Phase | Scope |
|---|---|
| Phase 1 | English-only content for all Saudi pages |
| Phase 2 | Add Arabic translations for: 8 city hubs + 64 service-city pages + key services |
| Phase 3 | Full Arabic mirror site with RTL layout |

### Hreflang implementation (Phase 2)
```html
<link rel="alternate" hreflang="en-sa" href="https://gulfseismic.com/sa/{city}/{service}" />
<link rel="alternate" hreflang="ar-sa" href="https://gulfseismic.com/ar/sa/{city}/{service}" />
<link rel="alternate" hreflang="x-default" href="https://gulfseismic.com/sa/{city}/{service}" />
```

---

## 6. Local SEO Signals

| Signal | Implementation |
|---|---|
| Local phone number | Saudi number (+966) on all `/saudi-arabia/*` pages |
| Local business schema | `LocalBusiness` with `addressCountry: "SA"` |
| City-level schema | `LocalBusiness` per city hub with lat/lng |
| Saudi-specific content | Reference to local authorities (MOMRA, GACA, MODON) |
| Saudi certifications | SASO compliance badge on `/saudi-arabia/*` pages |
| Local testimonials | Saudi client testimonials (Phase 2) |
| Google Business Profile | Per-city listings (Phase 2) |

---

## 7. Saudi Arabic Phone & WhatsApp

```ts
// from src/lib/gulf-data.ts
{
  slug: "saudi-arabia",
  dialCode: "+966",
  whatsapp: "966500000000",
  phone: "+966 11 000 0000",
}
```

The `Header`, `Footer`, `WhatsAppFab`, and `LeadCtaSection` components use `company.whatsapp` for the global CTA. Per-country WhatsApp numbers are read from the `Country` entity on country/city/service-city pages.

---

## 8. Saudi Localised Lead Form

On `/saudi-arabia/*` pages, the LeadForm defaults:
- `defaultCountry = "saudi-arabia"`
- Phone placeholder: `+966 5X XXX XXXX`
- City dropdown: 8 Saudi cities
- Service dropdown: same 8 services

Lead records from Saudi pages get:
- `country = "saudi-arabia"`
- WhatsApp link uses +966 number
- Email notification flags the lead as Saudi-market

---

## 9. Tender Funnel for Saudi

Saudi government tenders are a major lead source. The Tender Funnel (see `LEAD_SYSTEM.md` §1) flags leads with `isTender=true`. Specific Saudi tender sources:

| Source | Portal |
|---|---|
| MOMRA tenders | Etimad portal |
| MOT tenders | Etimad portal |
| GACA tenders | Etimad portal |
| MODON tenders | Etimad portal |
| Aramco tenders | Aramco supplier portal |
| SABIC tenders | SABIC supplier portal |
| Royal Commission (Jubail/Yanbu) | RC tender portal |

Phase 2: Auto-import tender opportunities from Etimad and create `Tender` CPT entries with deadline, scope, and submission instructions.

---

## 10. Saudi Payment & Currency

| Page | Currency |
|---|---|
| `/uae/*` | AED |
| `/saudi-arabia/*` | SAR |
| Service schema `offers.priceCurrency` | SAR on Saudi pages |
| Lead form | No price quoted; RFQ only |

---

## 11. KPIs (Saudi-specific)

| KPI | 90-day target |
|---|---|
| Saudi pages indexed | ≥ 80 / 80 |
| Saudi pages in top 20 | ≥ 30 |
| Saudi leads / month | ≥ 30 |
| Saudi lead → SQL | ≥ 40% |
| Saudi tender wins | ≥ 1 |

---

## 12. Cultural Considerations

| Concern | Mitigation |
|---|---|
| Prayer times | Schedule operations around Salah; iftar breaks during Ramadan |
| Friday weekend | Friday = weekend; Saturday = workday |
| Pilgrim sensitivities | Avoid loud equipment near Haram during Hajj |
| Female crew members | Provide appropriate PPE and prayer facilities on site |
| Ramadan | Reduced working hours; night-shift operations preferred |
| Arabic language | Bilingual signage on site; Arabic deliverables |

---

## 13. Pilot Launch Sequence

| Week | Action |
|---|---|
| 1 | Publish `/saudi-arabia` country hub |
| 2 | Publish 8 Saudi city hubs |
| 3–4 | Publish 8 Saudi thermoplastic-road-marking city pages (one per city) |
| 5–6 | Publish 8 Saudi warehouse-marking city pages |
| 7–10 | Publish remaining 48 Saudi service-city pages |
| 11+ | Add Saudi projects (Riyadh, Jubail, Dammam airports) |

---

## 14. Related Documents

- `PROGRAMMATIC_SEO.md` — full 128-page strategy (64 Saudi + 64 UAE)
- `AUTHORITY_GRAPH.md` — how Saudi nodes interconnect
- `LEAD_SYSTEM.md` — Saudi-specific lead tracking
- `WORDPRESS_DATA_MODEL.md` — Saudi CPT data
- `CONTENT_OPERATIONS.md` — Saudi localisation in content pipeline
