# KORE Dubailand

Multilingual KORE by Imtiaz property website: English, French, Spanish, German, Dutch and Portuguese. Tailwind CSS, optimized property images, localized URLs, sitemap, robots.txt and embedded Tally enquiry form.

## Website

The static website is in `dist/`. Serve that directory at the domain root. Canonical domain: `https://kore-dubailand.com`.

## Build styles

```sh
pnpm install
pnpm exec tailwindcss -i input.css -o dist/assets/style.css --minify
```

The private brochure is intentionally excluded. Brochure delivery after form submission must be configured in Tally or a protected delivery service.
