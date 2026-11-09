<div align="center">

<img src="./public/banner.svg" alt="Hanowallet: mining rigs, hosting and support" width="100%" />

<br />
<br />

![Next.js](https://img.shields.io/badge/Next.js-App_Router-0a1a30?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-1f4273?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-7-12305a?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-1f4273?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-3ec7b0?style=for-the-badge)
![pnpm](https://img.shields.io/badge/pnpm-workspace-0a1a30?style=for-the-badge)

**A modern storefront and contact platform for Bitcoin miners.**<br />
Browse mining rigs, ask about hosting, and reach the right team in one place.

[Getting started](#-getting-started) ·
[Features](#-features) ·
[API](#-contact-api) ·
[Data model](#-data-model) ·
[Troubleshooting](#-troubleshooting)

</div>

<br />

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🛒 Rig catalogue
Products with pricing, compare-at prices, hashrate, power draw, cooling type and noise level. Images, categories and tags are modelled as relations, and stock status covers `ACTIVE`, `DRAFT`, `OUT_OF_STOCK` and `DISCONTINUED`.

</td>
<td width="50%" valign="top">

### 💬 Smart contact form
Topic pills, a fleet-size picker that appears only for buying and hosting, live validation, a 1000-character counter, and deep links like `/contact?rig=s21-xp` that pre-fill the message.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🛡️ Built-in spam protection
Server-side Zod validation, an invisible honeypot field, and per-IP rate limiting (3 messages every 10 minutes) backed by the database.

</td>
<td width="50%" valign="top">

### 🔔 Friendly feedback
Loading, success and error toasts powered by Sonner, inline field errors returned from the API, and an animated confirmation screen.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🌗 Light and dark themes
Every component uses theme tokens, with a toggle in the header and full dark-mode support.

</td>
<td width="50%" valign="top">

### 📬 Newsletter ready
An `EmailSubscription` model with active and unsubscribed states, ready to plug into a signup form.

</td>
</tr>
</table>

<br />

## 🔄 How a message travels

<img src="./public/contact-flow.svg" alt="Contact form to API route, validation, rate limit, Prisma and Neon Postgres, then a 201 response with a success toast" width="100%" />

<br />

## 🧰 Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js (App Router, Route Handlers, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS, `clsx`, `lucide-react` icons |
| Database | PostgreSQL on Neon |
| ORM | Prisma 7 with `@prisma/adapter-pg` and the `prisma-client` generator |
| Validation | Zod on the server, lightweight validation on the client |
| Notifications | Sonner toasts |
| Package manager | pnpm |

<br />

## 🚀 Getting started

### Prerequisites

- Node.js 20 or newer
- pnpm
- A PostgreSQL database (a free [Neon](https://neon.tech) project works well)

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/hanowallet.git
cd hanowallet
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

| Variable | Required | Description |
| --- | :---: | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string, read by `prisma7.config.ts` and `lib/prisma.ts` |

### 3. Set up the database

```bash
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

### 4. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and you're in. 🎉

<br />

## 📁 Project structure

Trimmed to the parts you'll touch most.

```text
hanowallet/
├── app/
│   ├── api/
│   │   └── message/
│   │       └── route.ts          # POST /api/message: validate, rate limit, save
│   ├── contact/                  # Contact page
│   ├── shop/                     # Rig catalogue
│   └── layout.tsx                # Root layout, theme and <Toaster />
├── components/
│   ├── ContactForm.tsx           # Form UI, client validation, toasts
│   └── FeaturedRigs.tsx          # Rig cards that deep-link into the form
├── lib/
│   ├── prisma.ts                 # Shared Prisma client (Postgres adapter)
│   └── generated/prisma/         # Generated client, do not edit
├── prisma/
│   ├── schema.prisma             # Data model
│   └── migrations/               # Migration history
└── prisma7.config.ts             # Prisma CLI config
```

> [!TIP]
> Add `lib/generated/` to `.gitignore`. The client is rebuilt by `prisma generate`, so there's no need to commit it.

<br />

## 🗄️ Data model

```mermaid
erDiagram
  PRODUCT ||--o{ PRODUCT_IMAGE : has
  PRODUCT }o--o{ CATEGORY : "belongs to"
  PRODUCT }o--o{ TAG : "tagged with"

  PRODUCT {
    string id PK
    string name
    string slug UK
    decimal price
    decimal compareAtPrice
    string manufacturer
    string model
    string hashRate
    int power
    string cooling
    int stock
    enum status
  }
  PRODUCT_IMAGE {
    string id PK
    string url
    int position
    boolean isPrimary
    string productId FK
  }
  CATEGORY {
    string id PK
    string name UK
    string slug UK
  }
  TAG {
    string id PK
    string name UK
    string slug UK
  }
  CONTACT_MESSAGE {
    string id PK
    enum topic
    string fullName
    string email
    string company
    enum minerCount
    text message
    enum status
    datetime consentedAt
    string ipAddress
  }
  EMAIL_SUBSCRIPTION {
    string id PK
    string email UK
    enum status
    datetime subscribedAt
  }
```

<br />

## 📮 Contact API

### `POST /api/message`

Saves a message from the contact form.

```json
{
  "topic": "BUYING_A_RIG",
  "fullName": "Abdi Hassan",
  "email": "abdi@example.com",
  "company": "Optional Ltd",
  "minerCount": "SIX_TO_TWENTY",
  "message": "I'd like pricing for six units with hosting.",
  "consent": true
}
```

| Field | Type | Rules |
| --- | --- | --- |
| `topic` | enum | `BUYING_A_RIG`, `HOSTING`, `SUPPORT`, `PARTNERSHIP`, `OTHER` |
| `fullName` | string | Required, up to 120 characters |
| `email` | string | Required, valid email, stored lowercase |
| `company` | string | Optional, up to 160 characters |
| `minerCount` | enum | `ONE_TO_FIVE`, `SIX_TO_TWENTY`, `TWENTY_ONE_TO_ONE_HUNDRED`, `OVER_ONE_HUNDRED`. Required for buying and hosting, ignored otherwise |
| `message` | string | 10 to 1000 characters |
| `consent` | boolean | Must be `true` |

### Responses

| Status | Meaning | Body |
| :---: | --- | --- |
| `201` | Message saved | `{ "ok": true, "id": "..." }` |
| `400` | Body isn't valid JSON | `{ "error": "..." }` |
| `422` | Validation failed | `{ "error": "...", "fieldErrors": { "email": "..." } }` |
| `429` | Rate limit reached | `{ "error": "..." }` |
| `500` | Database or server error | `{ "error": "..." }` |

> [!NOTE]
> The rate limit is set by `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS` at the top of `app/api/message/route.ts`. Raise it while testing locally if you're sending lots of messages.

<br />

## 📜 Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server with Turbopack |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Lint the project |
| `pnpm exec prisma migrate dev` | Create and apply a migration from schema changes |
| `pnpm exec prisma generate` | Regenerate the Prisma client |
| `pnpm exec prisma studio` | Browse and edit data in the browser |

<br />

## ☁️ Deployment

Hanowallet deploys well to Vercel with Neon as the database.

1. Add `DATABASE_URL` to your project's environment variables.
2. Make sure the Prisma client is generated during the build:
   ```json
   "scripts": {
     "postinstall": "prisma generate",
     "build": "prisma migrate deploy && next build"
   }
   ```
3. Push to your main branch and let Vercel build it.

<br />

## 🩺 Troubleshooting

<details>
<summary><b><code>Cannot read properties of undefined (reading 'count')</code></b></summary>
<br />

The running server is using a Prisma client from before your latest `prisma generate`. `lib/prisma.ts` caches the client on `globalThis`, so it survives hot reloads. Stop `pnpm dev` and start it again.

</details>

<details>
<summary><b><code>Unknown argument</code> or <code>Invalid value for argument</code></b></summary>
<br />

Your schema and your route are out of sync. Check that the model in `prisma/schema.prisma` has every field the route writes, then run:

```bash
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

Restart the dev server afterwards.

</details>

<details>
<summary><b>The form keeps saying "You've sent a few messages already"</b></summary>
<br />

That's the rate limit doing its job. Wait 10 minutes, or raise `RATE_LIMIT_MAX` in `app/api/message/route.ts` while developing.

</details>

<details>
<summary><b>Toasts don't appear</b></summary>
<br />

Make sure `<Toaster />` from `sonner` is rendered once in `app/layout.tsx`.

</details>

<br />

## 🗺️ Roadmap

- [x] Rig catalogue data model
- [x] Contact form with validation, rate limiting and toasts
- [ ] Admin inbox for contact messages (`NEW` → `READ` → `REPLIED`)
- [ ] Email notification when a new message arrives
- [ ] Newsletter signup form
- [ ] Search and filters for the shop
- [ ] Checkout and payments

<br />

## 📞 Contact

| | |
| --- | --- |
| 🛒 Sales | [sales@hanowallet.com](mailto:sales@hanowallet.com) |
| 🤝 Partnerships and press | [partners@hanowallet.com](mailto:partners@hanowallet.com) |
| 📍 Office | Garowe, Nugaal, Puntland, Somalia |
| 🕘 Hours | Mon to Fri, 9:00 to 18:00. Online support every day |

<br />

## 📄 License

© 2026 Hanowallet. All rights reserved.

<br />

<img src="./public/footer.svg" alt="Built with care in Garowe, Somalia" width="100%" />