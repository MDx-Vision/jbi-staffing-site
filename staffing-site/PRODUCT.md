# PRODUCT.md — JBI Software Staffing Site

## What this product is

A marketing and lead-generation website for **JBISOFTWARE**, a healthcare IT staffing and consulting company. The primary audience is health system procurement managers, CIOs, and IT directors evaluating staffing vendors for Epic implementations and related healthcare technology projects.

## Core user goals

1. **Health systems seeking staff** → Understand JBI's specialization, trust the track record, submit a staffing request or schedule a consultation
2. **Consultants seeking work** → Browse open jobs, apply, or join the network via intake form
3. **Both** → Reach the right page fast and take the intended action without friction

## Business objectives (in priority order)

1. Drive qualified inbound contacts via Contact page and Intake form
2. Position JBI as the specialized, operator-led choice (vs. generalist staffing firms)
3. Surface the Epic specialization above everything else — it's the highest-margin, highest-trust offering
4. Support secondary services: IT staffing, clinical staffing, software development, TWS translation, Kliks AI

## Key differentiators to emphasize

- Founded by practitioners who worked Epic go-lives (not recruiters who pivoted)
- 200+ successful go-lives, 3,500+ professionals placed, 250+ health systems
- One vendor for Epic staffing, IT augmentation, clinical, and software — one contract, one standard
- Speed to placement without sacrificing vetting quality

## Content hierarchy (page by page)

| Page | Primary CTA | Secondary CTA |
|------|-------------|---------------|
| index.html | Request Talent | Find Opportunities |
| epic.html | Schedule Consultation | — |
| services.html | Get Started | Intake Form |
| jobs.html | Apply (modal) | Join Network |
| about.html | Schedule Consultation | Submit Staffing Request |
| contact.html | Submit form | — |
| intake.html | Submit form | — |
| software.html | Contact Us | — |
| kliks.html | Learn More / Contact | — |
| tws.html | Contact Us | — |

## Pages and their purpose

- **index.html** — Homepage. Hero + logo bar + "What We Deliver" + numbers split + testimonials + CTA
- **about.html** — Company story. Operator origin, stats, values, scope, CTA
- **epic.html** — Epic EHR specialization. Detailed services, certifications, process
- **services.html** — All staffing services overview with anchors to sub-sections
- **jobs.html** — Job board with modal apply flow (static job data in JS)
- **contact.html** — Contact form (Formspree) + office info
- **intake.html** — Detailed staffing request form for procurement managers
- **client-questionnaire.html** — Long-form onboarding questionnaire (PDF export)
- **software.html** — In-house dev team overview
- **kliks.html** — Kliks AI helpdesk product page
- **tws.html** — TWS Translation platform page
- **404.html** — Error page

## Tone

Direct, specific, operator-confident. No buzzwords. No "transform your organization." Speaks like someone who has run a go-live and knows what actually matters.

## Known constraints

- Static HTML/CSS/JS only — no build tools, no framework, no CMS
- Forms submit via Formspree
- Job data is hardcoded in jobs.html JavaScript
- Images live in /img/ — no CDN
- Deployed to GitHub Pages at https://mdx-vision.github.io/jbi-staffing-site/
- Production domain: staffing.jbisoftware.com
