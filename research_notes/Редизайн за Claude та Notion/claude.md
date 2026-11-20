# Visual design language of Claude / Anthropic (state: 2026-11-20)

Evidence tags: **MEASURED** = computed styles / CSS custom properties read by Playwright from the live page on 2026-11-20; **CITED** = third-party or published source; **INFERRED** = my deduction. 
Measured sources: [anthropic.com](https://www.anthropic.com) (home, /news/announcements), [platform.claude.com/docs/en/home](https://platform.claude.com/docs/en/home) (docs.claude.com redirects here), claude.com via Firecrawl branding + screenshot (Playwright could not reach claude.com: ERR_TUNNEL_CONNECTION_FAILED). claude.ai/login returned only a bare system-ui page (no styling) to Playwright.

**Key discovery.** Three token layers exist: (1) marketing site anthropic.com: `--color-gray-*`, `--theme-*`, `--grid-*`; (2) Platform docs: `--cds-*` ("Claude Design System") tokens. The `--cds-*` set contains product tokens that only make sense in the claude.ai chat app (`--cds-message-bubble-*`, `--cds-assistant-message-text-inset`, `--cds-radius-composer`, `--font-claude-response`, `--font-user-message`, `--cds-git-*`, `--cds-border-editor-comment`). So the docs site ships the claude.ai app's shared token sheet; this is the best available proxy for the logged-in app (INFERRED, strong). The logged-in claude.ai app itself was NOT reachable; app-specific claims below are from that token sheet only.

---

## 1. Color

### Takeaway
Everything is a warm-tinted neutral ramp (yellow-green undertone, never blue-grey). Layers are separated by 1-2 steps of that ramp, text is near-black not black, the clay accent is reserved for the brand mark/primary-brand fill, and the functional UI (buttons, links, focus) is black-on-paper plus a blue focus/accent. A typical screen has about 5-7 distinct colors.

### Cited / measured findings
- **Marketing neutrals (MEASURED, anthropic.com `:root`)**: gray-000 `#fff`, 050 `#faf9f5`, 100 `#f5f4ed`, 150 `#f0eee6`, 200 `#e8e6dc`, 250 `#dedcd1`, 300 `#d1cfc5`, 400 `#b0aea5`, 500 `#87867f`, 600 `#5e5d59`, 700 `#3d3d3a`, 750 `#30302e`, 800 `#262624`, 900 `#1a1918`, 950 `#141413`. Step is 4-6 lightness points per 50; hue stays yellow-warm (R>G>B by ~5-8 units).
- **Page = `#faf9f5` (gray-050), text = `#141413` (gray-950)** — MEASURED computed body bg `rgb(250,249,245)`, color `rgb(20,20,19)`. Contrast 17.5:1 (computed by me).
- Theme role tokens (MEASURED): background-primary `#fff`, secondary `#faf9f5`, tertiary `#f0eee6`, quaternary `#dedcd1`; foreground primary `#141413`, secondary `#30302e`, tertiary `#5e5d59` (6.3:1), quaternary `#87867f` (3.5:1, only for decorative/meta); border-primary/secondary `#e8e6dc`, border-tertiary `#dedcd1`. Hairline `#e8e6dc` on `#faf9f5` = **1.19:1** — deliberately barely visible.
- **Accent palette (MEASURED, anthropic.com)**: clay `#d97757` (primary), clay-interactive `#c6613f`; oat `#e3dacc`, olive `#788c5d`, cactus `#bcd1ca`, sky `#6a9bcc`, heather `#cbcadb`, fig `#c46686`, coral `#ebcece`, iris `#dfdbfd`/`#4a3aa7`, periwinkle `#cde2fb`/`#184f95`. Pastel tints are used as illustration/section fills, not UI chrome.
- **Brand-guidelines skill (CITED, anthropics/skills, read via raw.githubusercontent 2026-11-20)**: Dark `#141413`, Light `#faf9f5`, Mid gray `#b0aea5`, Light gray `#e8e6dc`; accents orange `#d97757`, blue `#6a9bcc`, green `#788c5d`; "Non-text shapes use accent colors, cycles through orange, blue, green". Matches the measured tokens exactly. https://raw.githubusercontent.com/anthropics/skills/main/skills/brand-guidelines/SKILL.md
- **Product/app token sheet (MEASURED, platform.claude.com `--cds-*`)**: light page `#fcfcfb` (gray-10); surface-0 `#f9f9f7`, surface-1 `#fcfcfb`, surface-2/3/popover/panel `#fff`. Text primary `#0b0b0b` (19.2:1), secondary `#52514e` (7.7:1), muted `#898781` (3.5:1). Ramp gray-0..100 in ~1.5-point steps (`#fcfcfb,#f9f9f7,#f6f6f4,#f3f3f0,#f0efec,#edece8,#eae9e4,#e7e6e1,#e4e3dd,#e1e0d9`) then 150 `#d2d1c7` … 900 `#0b0b0b`. This is a slightly cooler/lighter/less yellow cousin of the marketing ramp: two ramps, same family.
- **Dark theme (MEASURED, `--cds-*` under prefers-color-scheme: dark)**: page `#151515`; surface-0 `#0b0b0b` (darker than page, used for wells), surface-1 `#151515`, surface-2/panel `#1a1a19`, surface-3/popover `#20201f`. Text primary `#f0efec` (15.9:1), secondary `#c3c2b7` (10.2:1), muted `#898781` (5.1:1). Not pure black, not blue; panels get lighter as they rise (elevation by lightness, not shadow). Marketing dark ramp: slate `#0f0f0e`…`#30302e`.
- **Borders in product = alpha of the text color**: `--cds-border` = text-color @ **10%** (`hsl(from #0b0b0b h s l / 10%)`; flat result on page ≈ `#e4e4e3`, 1.24:1); dark `#fff` @ 10% (≈`#2c2c2c`, 1.31:1). `border-strong` 20%, `border-stronger` 40%. `ring-color` 10%, `ring-hairline` 1px. Hover fill for ghost = text @ 5% (light) / 7.5% (dark); selected ghost = 10%; control fill 10%, hover 20%; disabled 5%.
- **Accent usage (MEASURED)**: brand fill `--cds-fill-brand` `#ba5b3c` (white text 4.5:1), icon-only `#c6613f`, hover `#d97757`; `--cds-clay-emphasized` `#ba5b3c`. Pure `#d97757` on paper is only 2.96:1, so clay is never used for small text; clay text/links use `#c6613f` (3.85:1) / `#c46849` (Firecrawl branding, claude.com link). In screenshots clay appears only in the spark mark in the logo. Primary buttons are **black** (`#141413`/`#0b0b0b` fill, `#faf9f5` text), not clay (screenshot claude.com 2026-11-20: "Try Claude", "Continue with email" are near-black).
- **Semantic colors (MEASURED `--cds-role-*`)**: accent=blue (fill `#2a78d6`, bg `#cde2fb`, text `#184f95`, border `#86b6ef`), danger (fill `#d03b3b`, bg `#fad6d6`, text `#8e2626`), success (`#009300`, bg `#caeac7`, text `#006300`), warning (`#fab219`, bg `#f9dca4`, text `#734500`), pro/plan (purple `#7161e0`, bg `#dfdbfd`, text `#4a3aa7`). Each role = 100/250/300/400/450/600/700/800 ramp + fill + fill-hover + on-color. Pattern: tinted background (100) + dark text (600) of the same hue; saturated fill only for solid buttons. Focus ring = blue: `0 0 0 1px #2a78d6, 0 0 6px 1px #cde2fb`.
- Anthropic's own coding-skill warns that "warm cream background + high-contrast serif + terracotta (near #D97757)" is now an AI-design cliché and "Anthropic's own Claude-interaction accent" — useful caution for a derivative design. https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md

### Inferences
- Distinct colors on a typical screen (INFERRED from the above, not counted from the logged-in app): page paper, one panel tone (white or +1 step), text primary, text secondary/muted, hairline (alpha), one black fill (button) — ~5-6; plus clay only inside the mark, plus 1 blue only on focus.
- Contrast budget: text ≥7:1 for primary/secondary, muted ~3.5:1 for meta, dividers ~1.2:1. The calm comes from the gap between 17-19:1 text and 1.2:1 lines: lines never compete with words.

### Gaps
- Real claude.ai app screenshots/computed styles (sidebar bg, chat bubble bg) not accessible; only the `--cds-*` token names exist, many app-specific values were empty strings in the docs context.
- The warm paper of the app itself (`#faf9f5` vs `#fcfcfb`/gray-30) is not verified; both are measured on different surfaces.

---

## 2. Typography

### Takeaway
Two custom families: **Anthropic Serif** (headlines, and Claude's response text) and **Anthropic Sans** (UI, labels, nav, user messages) plus **Anthropic Mono** for tiny data labels/code. Serif = voice/identity/content; sans = interface mechanics. Very few sizes per screen (4-8).

### Cited / measured findings
- **Faces (MEASURED)**: anthropic.com `--anthropic-sans: "anthropicSans"…`, `--anthropic-serif: "anthropicSerif"…`, plus `anthropicMono`. Platform docs adds `anthropicSansDisplay` (for ~22px headings) and `Anthropicons-Variable` icon font; app tokens: `--font-claude-response: var(--font-anthropic-serif)`, `--font-user-message: var(--font-ui)`, `--font-ui-serif`, `--font-dyslexia: open-dyslexic`. So **in the app Claude's answer text is serif, the user's message and all UI are sans** (MEASURED token mapping; the actual rendering in the app not seen). Variable weight axis incl. GRAD (`--cds-font-grad-semibold:180`, `-bold:200`) and optical size (`--font-opsz-display:48`, `--font-opsz-text:16`) on anthropic.com.
- **Lineage (CITED)**: original Geist identity used Styrene (sans) / Tiempos (serif) — [Unpack case study](https://unpack.so/case-study/anthropic-brand-identity); the 2026 faces are proprietary Anthropic Sans/Serif (names measured). Brand-guidelines skill for documents uses Poppins (headings) + Lora (body) with Arial/Georgia fallback — a stand-in, not the real brand faces. [source](https://raw.githubusercontent.com/anthropics/skills/main/skills/brand-guidelines/SKILL.md)
- **anthropic.com home (MEASURED, 1440px viewport, fluid type scale)**: body 16.69px / 25.53px (1.53) Sans 400; h1 40.78px / 50.98px (1.25) **Serif 400**, letter-spacing −0.41px (−1%); card/headline h3 21.37px/26.72px Sans 700; meta 14.69px; UI labels (nav pills, buttons) **13px / 20px, letter-spacing +0.13px (+1%)** Sans 400; code/eyebrow labels 11px Mono. Hero mixes weights inside one sentence: bold sans phrase then regular serif continuation (screenshot). Sizes found on the homepage: 13, 14.69, 16.69, 21.37, 40.78, 11(mono) = **6 sizes**, 3 weights (400/600/700). News index h1: Sans 700, 61.27px/63.73px (≈1.04); list rows bold 13px.
- **claude.com (Firecrawl branding)**: h1 56px, h2 52px, body 18px; stacks "anthropicSerif, Georgia, serif" for headings and paragraphs, "anthropicSans, system-ui" for UI. Landing screenshot (2026-11-20): "Question what's next" in serif ≈ 56px regular, tagline in serif ≈ 20px, form UI in sans ≈ 16-17px, legal 12px.
- **Docs (MEASURED, platform.claude.com)**: h1 Serif **300** (Light) 52px/57.2px (1.1); section h2 Sans-Display 500 22px/28px; body 14px/21px (1.5) and 15px/20px; labels 12px; code Mono 13px; icon text 16/20/24px. Sizes on the home screen: 12, 13(mono), 14, 15, 16.9, 20, 22, 26, 52 → 8-9 sizes but 90% of text is 12/14. Weights 300/400/500/580. Intermediate weight 580 (variable font) instead of 600.
- **Eyebrow labels** are small, regular, sentence case in docs ("Claude Platform", "Platform" at 12px, muted gray), but uppercase 11px mono in the news table header (screenshot) — used as data labels, not decoration.
- Measure: marketing reading column `--grid-reading-max-width: 720px` (MEASURED); at 16.7px that is ≈ 70-75 characters (INFERRED). Frontend-design skill: "line lengths of less than 80 characters… give serif body text slightly more line-height than sans." (CITED)
- Cyrillic: I could not verify glyph coverage of the proprietary faces (INFERRED: Anthropic Sans/Serif probably cover Latin+Vietnamese+Devanagari fallback; `--anthropic-sans` lists Kohinoor Devanagari/Nirmala UI as fallbacks, suggesting multi-script handling via system fallbacks, not Cyrillic).

### Inferences — freely licensed substitutes with Cyrillic (INFERRED visually, not Anthropic-endorsed)
- Serif (transitional/warm, low-contrast, humanist): **Source Serif 4** (variable, opsz axis, Cyrillic), **Newsreader** (Cyrillic? — partial, verify), **PT Serif**, **Literata** (Cyrillic, designed for reading), **Lora** (Cyrillic; used by Anthropic's own skill). Closest in spirit to Tiempos-like: Source Serif 4 / Literata.
- Sans (neo-grotesque/geometric-humanist, slightly quirky): **Inter** (default; Cyrillic), **Onest**, **Manrope**, **Geist Sans** (Cyrillic limited — verify), **Golos Text**, **Commissioner**. Styrene-like feel: Onest/Manrope with weight 400-500. Mono: **JetBrains Mono** / **IBM Plex Mono** (Cyrillic).
- Rule: do not copy the exact faces; copy the roles and the 1.5 line-height, −1% tracking on 40px+ headings, +1% tracking on 13px UI labels.

### Gaps
- Exact sizes in the logged-in chat UI (message text size, sidebar labels) unverified; typical values from public screenshots/teardowns not found in reliable sources.
- No primary statement from Anthropic on why serif is used for responses.

---

## 3. Space and layout

### Takeaway
Grid of 4 columns with 32px outer margin and 16px gutter, spacing on a 2/4/8/12/16/24/32/48/64/80/96/128/200 scale; sections are separated by 48-200px of empty paper; the screen is mostly empty.

### Cited / measured findings
- **Marketing (MEASURED `:root`)**: `--grid-columns:4`, `--grid-margin:32px`, `--grid-gutter:16px`, `--grid-max-width:1920px`, `--grid-reading-max-width:720px`, `--header-nav-height:84px`, `--page-top-spacer:48px`, section spacing sm/md/lg 24/32/48px, `--spacing-*`: 2,4,8,12,16,24,32,48,64,80,96,128,200. Nav padding 0 80px at 1440. Hero h1 spans the full width with a ~100px gap above and ≥100px below (screenshot 2026-11-20: headline block occupies ~190px of 900px; media tile below).
- **News index (screenshot)**: title area ≈ 270px of empty space between "Announcements" h1 and the "80 ARTICLES" row; table rows 53px tall (≈ 13px text + 20px padding each side); only 1px hairline row dividers.
- **Docs (MEASURED)**: header 56px high, padding 0 16px; page bg `#fcfcfb`; main content from x≈160 to 1265 (≈1100px) with hero text column ~480px and a code card 520px wide; hero gap ~120px before next section; cards 538x428 and 264x250 with 16-20px inner padding; control height 28px (`--cds-h-control:1.75rem`), xs 24px, nested 22px; padding scale pad-xs/sm/md/lg/xl = 6/8/12/16/24px; gaps xs/sm/md/lg/xl = 8/12/16/28/40px.
- **claude.com landing (screenshot)**: two-column hero — left 520px text + 390px login card, right photo 632x765 with 12px radius; 64px side margin; nav 84px; ~75% of the viewport is whitespace or a single photograph.

### Inferences
- Density rule: UI chrome is 28px-high controls at 14px text (dense), but the surrounding page has generous margins — "dense instrument, loose room". Rhythm is multiples of 4 with a jump to 48-200 between sections.

### Gaps
- Chat app widths (reading column ~ 700-760px in public screenshots) not measured.

---

## 4. Separation and depth

### Takeaway
Hierarchy comes from whitespace first, 1px alpha hairlines second, 1-2 step background tints third; shadows are almost absent. Radii are a small set (4/8/10/12/14 px + full pill) chosen by component size.

### Cited / measured findings
- **Borders**: 1px everywhere. Marketing `#e8e6dc` on `#faf9f5`; product `text @ 10%`. Cards in docs: 1px `hsl(0 0% 4% / .1)` border, **no shadow** (`box-shadow: none` on cards, tabs, buttons, inputs — MEASURED). Table rows on news page: 1px `#f0eee6`-ish dividers, no cell borders, no zebra (screenshot).
- **Shadows**: defined only in the docs `--cds-shadow-sm: 0 1px 2px #0000000d`, md `0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a`, lg `0 10px 15px -3px #0000001a…` (Tailwind-like) — for popovers/menus; none measured on resting elements. Interactive "ring" instead of shadow: `box-shadow: 0 0 0 1px` 10% alpha on hover/focus (`--cds-ring-outer:1px`); drop-target ring `inset 0 0 0 2px accent` + inner glow.
- **Radii (MEASURED)**: marketing `--radius-xs: 4px` (media), pills `999999px` for nav/buttons; docs: `--cds-radius .5rem` (8px) default for buttons/inputs, `radius-composer .875rem` (**14px**), panel radius 12px, checkbox 5px (xxs 3px), kbd 4px, code card 12px, large cards 14px, small list row 11px, CTA buttons 10px; claude.com media 12px, login card ≈ 24px, buttons ≈ 8px (screenshot).
- **Depth by lightness in dark mode**: surface 0 `#0b0b0b` → 1 `#151515` → panel `#1a1a19` → popover `#20201f` (MEASURED).

### Inferences
- Radius scales with the object: small controls 8px, containers 12-14px, hero containers 24px, pills for navigation toggles. Nothing is square except text and photos at 4px.

### Gaps
- No measurement of popover/menu shadows in the live app.

---

## 5. Components

### Cited / measured findings
- **Buttons (MEASURED anthropic.com theme tokens)**: primary bg `#141413` / fg `#faf9f5` / border same; secondary bg `#f0eee6` / fg `#3d3d3a` / border `#dedcd1`; tertiary bg `#fff` / fg `#5e5d59` / border `#e8e6dc`. Marketing nav pill: bg `#f5f4ed`, 1px `#e8e6dc`, fg `#3d3d3a`, 13px, padding 8px 16px, radius pill. Focus ring `#90c3f6` (sky-interactive). claude.com screenshot: primary black fill radius 8-12px, 14-15px label medium; secondary = transparent/white + 1px gray border (e.g. "Contact sales").
- **Docs buttons (MEASURED)**: height 28px (control) or 40px (CTA), radius 8/10px, padding 4px 9px / 9px 16px, text 14-15px/400-500, **transition `box-shadow 0.06s cubic-bezier(.4,0,.2,1)`** (60ms), ghost default transparent with hover `text @ 5%`; selected tab = `text @ 10%` fill, weight 500, no underline (screenshot "Python" tab). Primary "Log in" = black fill, white text.
- **Inputs**: search field bg `rgba(255,255,255,.5)` (`--cds-fill-field: #ffffff80`), 1px 10% ring, 28px high, radius 8px, kbd chips 4px radius 1px border 18% alpha, 12px. Composer radius 14px (`--cds-radius-composer`) with `--cds-composer-ring` (value not exposed).
- **Navigation**: docs top nav items are pills (radius full) with muted `#898781` text at 14px, current item darker + weight 500; marketing nav = outlined/tinted pills. Sidebar items likely ghost rows with 5%/10% fills (INFERRED from fill-ghost-hover/selected tokens; no sidebar element in public docs home).
- **Lists/tables**: news index = 4-col table, header in 11px uppercase mono (muted), body bold 13px title, description clipped single-line 13px, date 13px, 53px rows, 1px dividers, trailing "…" pill (`#e8e6dc` bg) (screenshot). 
- **Cards (docs)**: 1px 10% border, radius 12-14px, top image area (160px) with hand-drawn line pictogram on a tinted `gray-80` (`#e7e6e1`) field (`--cds-pictogram-highlight-default: var(--cds-gray-80)`, highlight tints heather/cactus), then 16-20px padded title + muted body.
- **Chips/tags**: "New", "Most capable" in cards: small 12px/500, pro/accent tinted backgrounds (INFERRED from role tokens); kbd 12px.
- **Code blocks (MEASURED)**: card container white `#fff`, 1px border, radius 12px, tab bar 28px at 12px, code Mono 13px / ~19px, text `#1f2328`, GitHub-light-like syntax colors: keywords red-brown, strings dark blue (screenshot); copy icon button top-right. Marketing mono labels 11px.
- **Icons**: "Anthropicons" variable icon font (weight axis 433–533 → ~1.5px stroke feel), 16/20/24px, outline, rounded caps, opacity-secondary .3 for dimmed state (`--cds-opacity-icon-secondary:.3`). Pictograms: 1.5-2px black outline with flat tint fill, slightly wobbly "hand-drawn" lines (screenshot).
- **Empty states / illustrations**: marketing: photographs with natural, slightly cluttered human scenes (claude.com hero) and line pictograms in docs. 
- **Anthropic wordmark**: ANTHROP\C with slash as C-crossing; the slash "references the code that underlies AI" per Geist ([Medium](https://tao-hpu.medium.com/design-confidence-in-the-age-of-ai-ceca3dda8b9e), secondary).

### Gaps
- Chat-bubble, sidebar, artifact panel and tooltip real styling not measured; only token names (`--cds-message-bubble-*` empty values).

---

## 6. Motion

### Cited / measured findings
- Hover/focus: **60ms** `cubic-bezier(.4,0,.2,1)` on box-shadow/color/background (MEASURED docs buttons). Message-action reveal: in **120ms**, out **60ms**, `cubic-bezier(.32,.72,0,1)` (`--cds-ease-snap`). Defined eases: ease-out `cubic-bezier(.165,.84,.44,1)` (also `(0,0,.2,1)` fallback), ease-snap `(.32,.72,0,1)`, overshoot `(.34,1.3,.64,1)`. Card hover reveals use a `linear(0,.2459,.6526,.9468,1.0764,1.0915,…)` **spring** over **450ms** on `transform`/`clip-path` (`--cds-btn-spring`) — a small overshoot (~9%) spring. Shimmer text loading effect (`--cds-shimmer-text-*`) for "thinking" state.
- Drop-target / focus glows are inset 24px blurs at 20% alpha.
- Anthropic's own frontend-design skill: "Use non-user-triggered motion sparingly… fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated. Motion that answers a person's action is welcome." (CITED)

### Inferences
- Motion budget: instant-feeling micro-feedback (60-120ms), one springy reveal at 450ms for cards/buttons; nothing animates idle.

### Gaps
- Page-load / streaming text animation in claude.ai not measured.

---

## 7. Illustration and brand devices

### Cited / measured findings
- **Spark mark** (clay `#d97757`, 12-point starburst with uneven hand-cut rays) sits left of the serif "Claude" wordmark (SVG from claude.com branding, viewBox 573x125; spark path ≈ 125px high, fill `#D97757`, wordmark `#141413`). It is the only clay element on the claude.com and docs headers (screenshots).
- Hand-drawn line pictograms with tinted fills in docs; photography (human, analog desks, paper) on claude.com hero; a tiny node-network glyph in the news table header; subtle paper-grain noise texture on the anthropic.com hero media placeholder (screenshot).
- Geist (identity agency) brief: capture "the company's human-centered mission, and a sense of the technical craft", frame Claude via Constitutional AI; services incl. illustration, motion, art direction ([Geist](https://geist.co/work/anthropic)). Brand principles named in secondary sources: Active Integrity, Intellectual Humility, Urgent Curiosity (CITED secondary, [Medium](https://tao-hpu.medium.com/design-confidence-in-the-age-of-ai-ceca3dda8b9e) — not verified against an Anthropic primary page). A case-study blog describes the look as "muted tones, careful neutrals, generous white space… editorial quality, closer to a scientific journal than a startup homepage" ([Studio Siraj](https://studiosiraj.com/blog/anthropic-brand-identity-case-study), secondary, interpretive).

### Gaps
- No primary Anthropic brand-guidelines page or design-team blog post found; Geist's page is a case study (2023-era; flag older). Illustration style rules (stroke, palette) inferred from screenshots only.

---

## 8. Voice / copy

### Cited / measured findings
- Headlines: "Question what's next", "Your thinking partner for big ambitions", "Start building with Claude", "Choose how you build", "Everything you need to integrate Claude into your applications. From first API call to production." (MEASURED text from screenshots 2026-11-20). Sentence case, plain verbs, no exclamation marks, no emojis, no uppercase marketing shouting; buttons name the exact action: "Continue with email", "Get API key in Claude Console", "Quickstart".
- Frontend-design skill's copy rules (CITED): active voice; CTA says exactly what happens ("Save changes", not "Submit"); same name for an action through the flow; "Errors don't apologize, and they are never vague"; "An empty screen is an invitation to act"; "sentence case, no filler". https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md

---

## 9. Stated principles (summary)
- Geist: identity should feel human-centered and technically crafted, introduced pre-launch (CITED, Geist page).
- Skill statements above: restraint ("Spend your boldness in one place… remove one accessory"), structure-as-information ("borders, eyebrows, dividers… encode information, not decorate"), avoid all-caps tracked eyebrow labels, "tinted near-black (#0B0B0B, #111) standing in for black" and "one border-radius on everything" as generic tells (CITED). Note the irony: Claude's own product tokens use `#0b0b0b` and a handful of radii; the skill is guidance for external clients, not a description of Claude's UI.

---

## The 10 most transferable rules (with values)
1. **Warm-neutral ramp, not grey**: paper `#faf9f5` (marketing) / `#fcfcfb` (app), panels white or +1 step, dark `#151515` page with `#1a1a19`/`#20201f` rising surfaces; hue stays yellow-warm throughout.
2. **Text near-black, never pure**: `#141413`/`#0b0b0b` (≈17-19:1), secondary `#52514e`/`#5e5d59` (6-8:1), muted `#898781` (3.5:1) only for meta.
3. **Hairlines are 1px, ≈1.2:1**: `text @ 10%` (or `#e8e6dc`); 20%/40% only for emphasis. Lines must never compete with text.
4. **Separate by space first**: 4-col grid, 32px margin, 16px gutter, 720px reading column, 48-200px between sections; ≥60% of a screen is empty paper.
5. **Accent clay `#d97757`/`#ba5b3c` is a brand signature, not a UI color**: appears in the spark/logo and brand fill; primary buttons are black on paper; small text never uses raw clay (2.96:1).
6. **Serif for voice, sans for machinery**: serif for headlines (300-400 weight, −1% tracking, line-height 1.1-1.25) and model answers; sans for UI at 13-15px with +1% tracking on 13px labels, 1.5 line-height.
7. **Few sizes**: ~6-9 per screen; 90% of text at 12-14px in product; one big display size per page.
8. **No resting shadows**: depth = border + 1-step tint (+ lightness in dark mode); shadows only on popovers; interaction = 1px ring at 10%→20%.
9. **Radius by object size**: 4 (kbd, media) / 8 (controls, 28px high) / 12-14 (cards, code, composer) / 24 (hero container) / pill (nav); no square cards.
10. **Quiet, fast motion**: 60ms color/ring feedback, 120ms snap reveals `cubic-bezier(.32,.72,0,1)`, one 450ms spring (≈9% overshoot) for card hover; no idle or scroll-triggered animation. Pair with hand-drawn 1.5-2px line pictograms and plain, sentence-case, no-apology copy.

## Open / unverified
- Logged-in claude.ai app (sidebar, chat bubbles, composer, artifacts) never rendered; only the shared `--cds-*` token sheet read from the docs site (many app tokens empty).
- claude.com computed styles not measured with Playwright (blocked); values from Firecrawl branding (heading 56/52, body 18, link `#C46849`) and one screenshot.
- Exact 2026 face glyph coverage (Cyrillic) for Anthropic Sans/Serif; substitute fonts listed are my judgments.
- Primary Anthropic statement of brand principles ("Active Integrity", etc.) not located; only secondary sources.
- Marketing and product ramps differ (`#faf9f5` vs `#fcfcfb`); unclear which governs the app page background.
- Product names in screenshots ("Fable 5.2", "Mythos 5.2", `claude-opus-5-5`) are as displayed on the live pages on 2026-11-20; not independently checked.
- Dark-mode marketing site values not captured (only docs/app tokens).
- Screenshots and scripts: /tmp/claude-0/-home-user-droneport-store/18492631-5d0a-5634-a255-46eeb1c9e21e/scratchpad/claude-research/
