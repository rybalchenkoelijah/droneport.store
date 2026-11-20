# Notion visual design language (as of 2026-11-20): product UI and notion.com

Evidence tags: **MEASURED-FC** = I extracted it myself via Firecrawl branding scrape on 2026-11-20. **CITED-M** = computed-style measurement done by a third party on real Notion pages (the Blok repo research docs, 2026-10-09; a headless Chrome and a signed-in session), so credible but second-hand. **CITED** = published statement or secondary write-up. **INFERRED** = my own derivation, with arithmetic shown where relevant.

Access note: my direct Playwright load of notion.com, notion.so and notion.site failed (`net::ERR_TUNNEL_CONNECTION_FAILED`, the host is blocked by the egress proxy). Everything below therefore comes via Firecrawl and third-party measurements. No screenshots of my own were taken, so composition and density claims rest on measured numbers, not on my visual inspection. The scratch dir `/tmp/claude-0/-home-user-droneport-store/18492631-5d0a-5634-a255-46eeb1c9e21e/scratchpad/notion-research/` holds only the failed script.

Source-quality warnings (details at the end): several "Notion design system" sites contradict each other (shadcn.io shows a purple `#5645d4` primary, getdesignsystem.io `#2537b1`). These conflict with every measured source and were rejected. notionpartners.com is an unrelated agency with a similar name; ignore it.

---

## 1. Color: backgrounds, text, dividers, tags, accent

### Takeaway
The product is almost colourless. Surfaces are white (`#FFF`) or `rgb(25,25,25)`. Ink is a warm near-black, and everything else is a ladder of 3 warm greys. Dividers are translucent warm-brown hairlines at about 7% alpha, only about 1.15:1 against the page. The only saturated colour is one blue (`rgb(39,131,222)`), used for selection, focus, primary buttons and active-filter state. The ten user-facing tag hues are low-alpha tints of the same family, so they never out-shout content.

### Cited Findings
- **Light ink / greys (product, Oct 2026):** primary ink `rgb(44,44,43)` = `#2C2C2B`; secondary (header text, inactive tab, labels) `rgb(125,122,117)` = `#7D7A75`; icon grey `rgb(142,139,134)`; tertiary (counts, "Empty", weekday names, ID values, placeholders) `rgb(161,158,153)` = `#A19E99`; a further `rgb(173,169,163)` for drag handles and "+" glyphs. Page bg `rgb(255,255,255)`. — CITED-M [08](https://raw.githubusercontent.com/jackuait/blok/0fa615be7c626c753c9280d2f06d1b4522d06e70/docs/plans/2026-10-09-database-notion-parity/research/08-notion-signed-in-measurements.md), [07](https://raw.githubusercontent.com/jackuait/blok/0fa615be7c626c753c9280d2f06d1b4522d06e70/docs/plans/2026-10-09-database-notion-parity/research/07-notion-live-measurements.md)
- A public 2026 notion.site page extracted by Firecrawl: text `#2C2C2B`, button primary bg `#2C2C2B` with text `#F0EFED`, radius 6px, body 16px, h1 40px. — MEASURED-FC (https://thomasfrank.notion.site/Color-Reference-0877519165f34930ad1fe53071e54155, 2026-11-20). This corroborates the CITED-M ink value.
- **The "famous" `rgb(55,53,47)` / `#37352F` warm black is the older generation.** Third-party colour tables still list text `#373530`/`rgba(55,53,47,…)`, dark text `#D4D4D4`, dark bg `#191919`. — CITED [matthiasfrank.de](https://matthiasfrank.de/en/notion-colors/), [notioneers.eu](https://notioneers.eu/en/insights/notion-colors-codes). In dark mode, older pages used `#2F3437` (pre-2021) — CITED [docs.super.so](https://docs.super.so/notion-colors). The current measured ink is a slightly cooler/neutral `#2C2C2B`. The old opacity-based system (`rgba(55,53,47,0.6/0.4/0.16/0.09)`) survives in places: list-row hover `rgba(55,53,47,0.06)`, gallery-card hover `rgba(55,53,47,0.04)` (CITED-M 07). Treat `#37352F` as pre-2025 and `#2C2C2B` as current.
- **Dividers / borders:** `rgba(42,28,0,0.07)` 1px for table cells, header underline, cover bottom line, popover ring; `rgb(230,229,227)` for calendar grid and weekday rule; checkbox unchecked border `rgba(27,21,0,0.19)`; outlined small buttons `1px solid rgba(28,19,1,0.11)`. Weekend calendar cell bg `rgb(249,248,247)`. — CITED-M 07/08
- **Dark mode:** app bg `rgb(25,25,25)`; ink `rgb(240,239,237)`; header/secondary `rgb(173,169,163)`; hairline `rgba(255,255,243,0.082)`; menu bg `rgb(37,37,37)` with ring `rgb(56,56,54)`; board/gallery card bg `rgb(32,32,32)` or `rgba(255,255,255,0.055)`; active tab `rgba(255,255,255,0.055)`. Accent blue and selection overlays are identical to light. — CITED-M 08
- **Hover/selected neutral fill:** `rgba(33,27,23,0.05)` is the single hover/active tint (menu item highlight, active view tab, header-cell hover, icon button hover). Board-card hover `≈rgba(54,29,2,0.031)`. — CITED-M 07/08
- **Single blue accent:** `rgb(39,131,222)` (`#2783DE`): checked checkbox, active filter/sort icon and pill text, selection ring (`2px inset`) with fill `rgba(35,131,226,0.07)`, row-selection halo `rgba(35,131,226,0.14)`, drag-drop line `rgba(35,131,226,0.43)`, toggle-on, selected layout tile, focus ring (`2px #F8F8F7 gap + 2px blue`), date picker selected day, the "New" split button (bg blue, text `rgb(243,249,253)`). Red `rgb(229,100,88)` appears only for "today" in calendar/timeline and a destructive "Remove". — CITED-M 08. Selection state is blue everywhere, including the "N selected" label.
- **Tag/select palette (10 hues, light):** each pill is a translucent tint + a dark same-hue text, not a solid fill:

| hue | light bg | light text |
|---|---|---|
| default | `rgba(42,28,0,0.07)` | `rgb(44,44,43)` |
| gray | `rgba(28,19,1,0.11)` | `rgb(73,72,70)` |
| brown | `rgba(127,51,0,0.157)` | `rgb(88,68,55)` |
| orange | `rgba(196,88,0,0.204)` | `rgb(106,66,34)` |
| yellow | `rgba(209,156,0,0.282)` | `rgb(101,81,33)` |
| green | `rgba(0,96,38,0.157)` | `rgb(42,83,60)` |
| blue | `rgba(0,118,217,0.204)` | `rgb(38,74,114)` |
| purple | `rgba(92,0,163,0.14)` | `rgb(85,59,105)` |
| pink | `rgba(183,0,78,0.153)` | `rgb(104,53,78)` |
| red | `rgba(206,24,0,0.165)` | `rgb(109,53,49)` |

  Dark versions use alpha 0.31 to 0.53 with near-white text (e.g. blue `rgba(81,166,255,0.494)` / `rgb(229,242,252)`). Status dots: gray `rgb(142,139,134)`, blue `rgb(39,131,222)`, green `rgb(70,161,113)`. Board column tints are alpha 0.03 to 0.06 (`rgba(66,35,3,0.03)` default). — CITED-M 08
- **Design-system direction (Notion's own team, Config 2026, published 2026-07-01):** the new colour system has "the same tokens in every palette" and "translucent versions for every opaque colour", because user-controlled content colours stack in unpredictable ways; palettes cover light, dark and user content; high-contrast mode is "just mapping some new values"; a "bold new yellow" was tried and partly reverted; all colours were migrated to CSS variables in a 56-part run, and RGBA was converted to OKLCH. — CITED [Config 2026 talk transcript](https://www.youtube.com/watch?v=u7_Qof3AJ1g)
- **Marketing site colours (2026-11-20):** homepage text `#1A1A1A`, bg `#FFFFFF`, primary button black `#000` with white text, secondary button `#F6F5F4` fill; both pill-shaped (radius 9999px). — MEASURED-FC (notion.com). Help centre: text `#0D0D0D`, link/primary `#0075DE`/`#2383E2`, secondary button white with `#E6E6E6` border, radius 8px, callout tint `#FFF5E0`. — MEASURED-FC (notion.com/help). Third-party May 2026 token reading of notion.so: surfaces `#F6F5F4` and `#F0EFED`, border `#DFDCD9`, muted text `#615D59`, subtle `#A39E98`, link `#0075DE`, pressed `#005BAB`, primary `#097FE8`, hero navy `#02093A`. — CITED [designmd.cc](https://designmd.cc/benchmarks/notion) (self-described "not official"). The navy hero contradicts my own 2026-11-20 homepage extraction (bg white), so it is either a section, an A/B variant or an earlier state.

### Inferences
- **Contrast arithmetic (WCAG relative luminance, my calculation):** ink `#2C2C2B` on white about 14:1; secondary `#7D7A75` about 4.3:1 (just under AA for body text); tertiary `#A19E99` about 2.7:1 (fails AA, used only for non-essential info such as counts, "Empty", weekday names); hairline `rgba(42,28,0,0.07)` over white composites to about `#F0EFED`, about 1.15:1 against white, i.e. barely visible by design; the checkbox border `rgba(27,21,0,0.19)` composites to about `#D4D3CF`, about 1.5:1. Rule: the information carries the contrast, the structure does not.
- **Distinct colours on a typical table screen:** about 1 ink + 3 greys (125/142/161) + 1 hairline + 1 white + 1 blue = 7 neutral/accents, plus 0 to 3 tag tints. Ten tag hues exist but rarely co-occur. The dominant visible palette is therefore about 7 to 10 colours, 90% of which are warm greys.
- Warmth: all greys have R>G>B by small steps (e.g. 125/122/117), and hairlines are brown-based (`42,28,0`). Neutral greys would read colder and busier next to the white page.
- Opacity-based neutrals mean that the same hairline works over white, tinted callouts and dark surfaces without new tokens.

### Gaps
- Sidebar background, hover and selected colours were not found in any measured source (older Notion used `#F7F7F5` sidebar bg, from memory only, not verified here).
- Exact current dark-mode tokens for purple/pink/red pills not measured (the 08 doc gives them, 07 did not; both agree where they overlap).

---

## 2. Typography

### Takeaway
One variable sans (Inter-derived "NotionInter", in the product a system-font stack with `ui-sans-serif` first) at a narrow set of sizes. In the data UI almost everything is 14px/21px at weight 400, with weight 500 reserved for titles and active labels and weight 600 for group headings. Marketing uses a separate display face for very large headlines.

### Cited Findings
- **Product font stack (public notion.site, signed-out):** `ui-sans-serif, -apple-system, "system-ui", "Segoe UI Variable Display", "Segoe UI", Helvetica, "Apple Color Emoji", "Noto Sans Arabic", "Noto Sans Hebrew", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"`. — CITED-M 07; MEASURED-FC (notion.site page: heading stack starts with `ui-sans-serif`, body `sans-serif`).
- **Marketing/help font:** body "NotionInter" (Inter-based custom build) with Inter/system fallbacks; homepage headings **"Die Grotesk"**. Sizes on the homepage: h1 80px, h2 40px, body 18px; help centre: h1 54px, h2 32px, body 14px. Base unit 4px. — MEASURED-FC (notion.com and /help, 2026-11-20). A third-party May 2026 reading lists display 54/600/1.2/-0.02em, H1 40/600, H2 24/500, body 16/400/1.5, caption 14/400/1.5, serif **Lyon Text** (quotes, 22px/1.25) and mono **Nitti** (14px). — CITED designmd.cc (not official; the Lyon/Nitti attribution is not confirmed by a primary source).
- **Page font options:** exactly three per page: `Default`, `Serif`, `Mono`, chosen in ••• > Appearance & layout; plus a `Small text` toggle and a `Full width` toggle (desktop/web only). — CITED [Notion Help](https://www.notion.com/help/customize-and-style-your-content)
- **Data-UI type scale (measured, light, Oct 2026):**
  - Table header 14px/16.8px, 400, secondary grey.
  - Cell text 14px/21px, 400; title cell 14/21 **500**.
  - Select/multi-select pill 14/20 400 (in table), 12/18 in board card, 13/18 in list/timeline; group header pill 14/20 **500**.
  - View tab label 14/16.8 **500**; toolbar buttons 14 **500**.
  - Property label 14/20 grey; value 14/21 ink.
  - Board/gallery card title 15px/22.5px **500**; card property text 12/18.
  - Calendar month title 14 **600**; weekday labels 12/18; day numbers 14/24.
  - "OPEN" hover button 12/18 **500**; menu section labels 12/14.4 **500**; calc-footer label 10/15 **500** uppercase with 1px letter-spacing.
  - Inline database title 24/31.2 **600**; side-peek title 32/38.4 **700**; center-peek and page title 40/48 **700**; feed card title 26/26 **600**; dialog title 16/24 **600**.
  — CITED-M 07/08
- **Page body:** the public page extraction gives body 16px and h1 40px (MEASURED-FC). The gallery page-preview, rendered at a reduced scale, shows h2 22.5/29.25 **600**, h3 18/23.4 **600**, text 12/18 (CITED-M 07).
- **Page measure:** at the default (non-full) width the text column is **720px** (viewport 1512, column at x=531, i.e. centred, sidebar open); at full width the column is `viewport - 2×96px` (1248px at 1440). — CITED-M 08/07
- Line-height is 1.5 across UI text (14/21, 15/22.5, 12/18, 16/24 dialog) and 1.2 for headings (40/48, 32/38.4, 24/31.2).

### Inferences
- If the gallery preview is a 0.75× scale (22.5, 18 and 12 are exactly 0.75 × 30, 24, 16), the page defaults are about **H2 30px, H3 24px, body 16px/24px**, with H1 at 40px. (My arithmetic; consistent with the measured 16px body and 40px title; unconfirmed that the preview is scaled by exactly 0.75.)
- **Distinct text sizes in a table screen:** 14 (about 90% of text), 12 (hover controls, menu labels), 10 (footer label), plus the page title (32/40) and 24 for an inline database title, so about 5 sizes. In an entire database UI (all views) the set is {10, 11, 12, 13, 14, 15, 16, 24, 26, 32, 40}. Hierarchy is made with weight (400/500/600/700) and grey value, not with many sizes.
- Notion avoids bold for data: weight 500 marks identity (title cell, active tab), 400 everything else; headers are grey 400, not bold or uppercase.

### Gaps
- Product-side font file name and the exact Serif/Mono faces (I believe Lyon Text and iA Writer Mono but that is memory, not verified).
- Marketing display tracking/weights for Die Grotesk not captured.

---

## 3. Space and layout

### Takeaway
Fixed, small modules on a 4px grid. Wide pages keep content inside 96px side gutters and a 720px reading column; data views extend beyond the column but are aligned to it.

### Cited Findings
- Page side padding 96px (table/board/inline DB); 104px (calendar, gallery, list = 96 + 8 row margin); inline DB in a normal-width page: gallery/list `padding: 0 275px` so content aligns with the 720px text column; the scroller itself spans edge to edge (tables scroll under the gutter, the content starts at the column edge). — CITED-M 07/08
- Table: header row 36px; body row 37px (36px content + 1px bottom border); cell padding 7.5px/8px (select/person 8px, checkbox 10px/8px); row has `margin-left: 8px`; bottom "+ New page" row 36px; group header row 42px with 12px gap between groups; column widths in the sample 85 to 276px; calc footer row 35px. — CITED-M 07/08
- List view: rows 30px tall with 1px margin (32px pitch), icon 22px, left padding 4px, radius 6px. Property slot 30px.
- Board: column 276px (260px card + 8px pads), gap 12px; card property rows 28px, card gap 8px; column header strip 40px.
- Gallery: grid gap 16px, cards 296px at 1440 (4 columns), cover 146.25px, title area 40px.
- Peek/row page: property row 34px (+4px gap), label column 160px, label with 16px icon; center peek 960px wide, 72px top/bottom margin, top bar 44px; side peek = half viewport (756px at 1512) and the page beside it narrows.
- Toolbar controls: view tab wrapper 40px, pill 32px (padding 6/12); icon buttons 28×28 (padding 6px, radius 6px, 16px icon); "New" button 28px tall; small pills/filters 24px tall; menu items 28px (single column) or 32px (two-column grid).
- Sidebar (older source, May 2025, secondary): width 224px; nav block 131px for 4 items; search field 30px tall; icon 22px square; 6px gap between sections; row corner radius 8px; the author claims an 8px grid. — CITED [Medium breakdown](https://medium.com/@quickmasum/ui-breakdown-of-notions-sidebar-2121364ec78d). This is a screenshot-based article, not computed styles; the sidebar can be resized by users and I could not verify the 2026 default.
- Block spacing: Notion's own rule (Mar 2026): spacing is standardised padding around blocks (not baseline alignment); paragraph spacing is larger than single-line spacing; when a list item's neighbour is another list item (checklist, bullets, toggles, numbered, lists of pages) the padding is reduced so list items chunk together; rolled out to all pages from March 2026. — CITED [Paul Velleux, Notion blog, 2026-03-18](https://www.notion.com/blog/updating-the-design-of-notion-pages). The blog gives no pixel values.

### Inferences
- A 4px base unit shows up in every measured size (28, 32, 36, 40, 44, 24, 8, 12, 16, 96), with 1px used only for hairlines and 7.5px as the single deliberate half-step (to get a 37px row with a 21px line height: 7.5×2 + 21 = 36).
- Density comes from 14px text with 1.5 leading in a 36px row (about 2 lines of text height per row, content 58% of row height), while the *page* around it uses 96px gutters. The ratio of dense data inside generous margins is the main mechanism that makes dense data read as calm.

### Gaps
- 2026 sidebar: width, row height (I suspect ~28px, unverified), indent per level, hover/selected fills, section labels, tree chevron size. No computed-style source found.
- Breadcrumb and top-bar metrics (only the peek top bar 44px is known; the main top bar fades out 700ms while typing, CITED-M 08).
- Block margins in the editor (the blog gives rules but no numbers).

---

## 4. Separation and depth

### Takeaway
Structure is drawn with 1px translucent hairlines, quiet fill tints and whitespace. Shadows are tiny layered ambient shadows plus a 1px ring, used on floating things (menus, popovers, dialogs, peek) and on cards, not on the page, table or sidebar. "Border" is often a 1px `box-shadow` ring, not a CSS border.

### Cited Findings
- **Table:** only `border-right` and `border-bottom` 1px `rgba(42,28,0,0.07)` per cell (no top/left, no outer frame); the header underline is an inset box-shadow `rgba(42,28,0,0.07) 0 -1px 0 inset`; no zebra striping; no row hover fill (hover shows gutter controls and the OPEN button); header hover fill `rgba(33,27,23,0.05)` only in the signed-in app. — CITED-M 07/08
- **Sidebar vs content:** no measured value found (see gaps). Do not assume a border.
- **Active tab:** filled gray pill `rgba(33,27,23,0.05)`, no underline. Hover on inactive tab uses the same fill, text stays grey. — CITED-M 07
- **Callouts:** default callout is a white block with a light gray outline; coloured callouts use a background tint. — CITED [Notion Help](https://www.notion.com/help/customize-and-style-your-content)
- **Radii (measured):** pills/tags 4px (status pill 10px, view tabs 20px on 32px height, filter/sort pills 32px/12px); buttons, icon buttons, inputs, list rows 6px; menus 10px (cell popovers 6px); cards (board/gallery) 10px; dialogs 12px; center peek 12px; feed card 12px; checkbox 3px (Notion staff mention a long debate settled at **1.5px**); page icons 3.5 to 5px; menu item highlight 6px. — CITED-M 07/08; CITED Config 2026 (checkbox 1.5px). Marketing: buttons 8px (help) or pill (home); cards 12px (third-party reading).
- **Shadows (all measured):**
  - Hover action button / small popover: `rgba(25,25,25,0.027) 0 8px 12px, rgba(25,25,25,0.027) 0 2px 6px, rgba(42,28,0,0.07) 0 0 0 1px`.
  - Board/gallery card: `rgba(25,25,25,0.027) 0 4px 12px, rgba(25,25,25,0.02) 0 1px 2px, rgba(42,28,0,0.07) 0 0 0 1px`.
  - Menus/view-settings panel: `rgba(25,25,25,0.05) 0 20px 24px, rgba(25,25,25,0.027) 0 5px 8px, rgba(42,28,0,0.07) 0 0 0 1px`.
  - Modal dialog: `rgba(25,25,25,0.24) 0 24px 48px, rgba(25,25,25,0.14) 0 4px 12px, ring`; backdrop `rgba(15,15,15,0.6)`.
  - Timeline bar / calendar event: `rgba(0,0,0,0.04) 0 2px 4px, ring`. Dark: ring becomes `rgba(255,255,243,0.082)` or `rgb(56,56,54)`.
  — CITED-M 07/08

### Inferences
- Peak shadow alpha is 0.027 to 0.05 for everything except modals (0.24/0.14); at those values the shadow reads as a slight lift, and the 1px ring does the edge work. The shadow budget is: page 0, table 0, sidebar 0 (assumed), cards 1 level, popovers 1 level, dialog 1 level.
- Elevation order: hairline < card (ring + 4/12) < popover (8/12) < menu (20/24) < dialog (24/48). Only floating layers get the larger blur.

### Gaps
- Sidebar/content separation (border vs tint) not confirmed; top bar divider not confirmed; collapsed-toggle chevrons not measured.

---

## 5. Components

### Takeaway
Each component is a flat, grey-on-white building block with a 20 to 28px control height, hover fills of one tint and controls that only appear on hover. The same two or three sizes recur across tables, lists, boards and menus.

### Cited Findings
- **Sidebar tree:** no 2026 computed values found. Secondary only: 224px width, 30px search, rows with 8px radius, 22px icon slot. — CITED Medium (May 2025). Notion Help states page icon (emoji or image, 280×280 ideal) appears next to the page in the sidebar.
- **Table/database:** see sections 2 to 4. Plus: title-cell page icon 22px box (14px emoji glyph); person avatar 20px; checkbox 16×16 radius 3px; number cells right-aligned; ID cells in tertiary grey; file chip 24px with `rgba(42,28,0,0.07)` fill; button property 24px, 1px `rgba(28,19,1,0.11)` border, radius 6px; calc footer label uppercase 10px with 1px letter-spacing, value in secondary grey. — CITED-M 07/08
- **Property rows (row page):** label column 160px with 16px icon and 14/20 secondary grey; value 14/21 ink; empty value shows "Empty" in tertiary grey; row height 34px; "View details / Hide details" is a plain 28px text button, 14px, grey `rgb(142,139,134)`. — CITED-M 07/10
- **Buttons:** primary "New" split button blue `rgb(39,131,222)` 28px, radius 6px, 14/500, no shadow; secondary/ghost buttons have no fill, `rgb(142,139,134)` text and hover `rgba(33,27,23,0.05)`; outlined variant 1px `rgba(28,19,1,0.11)`. Marketing: pill (9999px) black or `#F6F5F4`, or 8px blue on help. — CITED-M 08, MEASURED-FC
- **Inputs:** filter value input 28px, padding 3/6, radius 6px, bg `rgba(66,35,3,0.03)`, no border at rest; focus ring `rgb(35,131,226)` 1px inset + 1px outer. Search-or-create select editor: 300px wide, input area bg `rgba(242,241,238,0.6)` with an inset bottom hairline. Marketing input: transparent, 0 radius (MEASURED-FC branding; low confidence). — CITED-M 08
- **Tags/pills:** table pill 20px, padding 0 6px, radius 4px, 14/20 400; status pill with 8px dot, radius 10px, 20px; multi-select gap 8px. See the palette in section 1. — CITED-M 07/08
- **Callouts, toggles (block), breadcrumb, search, icons:** toggle block uses `>` shortcut; callout: icon + text, default white with gray outline, colour options set background tint. Breadcrumb/search styles not measured. UI toggle switch (settings): 30×18 track, knob 14px, on = blue, 200ms. — CITED Notion Help; CITED-M 08 (switch)
- **Icons:** the whole web app's icons were redrawn in 2025/26 as one custom set (thousands of icons, drawn by one designer) with a consistent sizing system and stroke weight; 529 icons had been used only once; UI icon sizes seen: 16px (header, toolbar), 20px (tabs), 22px (sidebar/list), 24px (card icon box), 11 to 14px (carets, checks). Icon grey `rgb(142,139,134)`; drag handle `rgb(173,169,163)`. — CITED Config 2026 (set), CITED-M 07/08 (sizes)
- **Empty states:** a filtered-to-nothing table shows a centred "Edit filters" outlined button (28px) and "+ New page" under the header; a new database shows three blank rows with "+ New page" in the first row; no illustration. Empty values are the word "Empty" in tertiary grey. — CITED-M 08. (Other views' empty states were not captured.)
- **Menus:** 10px radius, items 28px, 14/16.8, section labels 12/14.4 500 secondary; footer metadata in menu ("Last edited by…"). — CITED-M 08
- **View tabs / toolbar:** pills in a 40px bar; filter/sort/search icon buttons at the right; active filter = blue pill `rgba(0,124,215,0.094)` with blue text; inactive "+ Filter" ghost pill in tertiary grey. — CITED-M 08

### Inferences
- Component inventory is tiny: a 28px control, a 24px chip, a 20px tag, a 36px row. Variation is made by the fill (none / 5% grey / 10% grey / blue tint) not by new shapes.
- Notion data screens use *no* icon-only affordances at rest except the toolbar; the row gutter controls are hidden.

### Gaps
- Sidebar tree: indentation per level, chevron, row hover/selected, section headers, "Favorites" styling.
- Breadcrumb, search modal, simple-table (block) visual details, callout padding/radius, toggle chevron, block-handle sizes.
- Icon stroke width (not published); icon style appears outlined/simple but not measured.

---

## 6. Interaction and motion

### Takeaway
Hover reveals controls; motion is nearly absent and extremely short. Only floating layers fade and scale (200ms); hover tints switch in 20ms; view contents swap without animation.

### Cited Findings (all CITED-M 08)
- Hover bg changes: menu item and header cell 20ms `ease-in`; tabs and icon buttons 100ms `ease-in-out`; card background 100ms `ease-out`.
- Menu/popover open and close: 200ms `ease`, `opacity 0 to 1` and `scale(0.96) to 1`, transform-origin at the anchor corner. Modal dialog: `scale(0.97)` to 1 and fade, 200ms. Side peek: `translateX` slide plus the page frame width narrowing, 200ms `ease`.
- No animation at all: center peek, cell editors (date/select/person), view-tab switch (body swaps in one frame), group collapse (rows unmount; only the caret rotates 200ms `ease-out`), card drop, new board column.
- Checkbox fill 200ms `ease-out`; toggle knob 200ms `ease-out`; selection halo fade 200ms; hover "..." button on cards fades 0 to 1 in 200ms.
- Drag: ghost row/card `opacity 0.4`, no shadow/rotation/scale; 4px drop line `rgba(35,131,226,0.43)`.
- The top bar fades out (700ms) while typing and returns on pointer move.
- **Hover-reveal inventory:** row gutter "+", ⋮⋮ drag handle and checkbox (left of the row); OPEN button in the title cell (12/500, ring + shadow); card "..." and gallery edit pill; board column "..." and "+" buttons; block handles in the editor (the help states the ⋮⋮ "appears on hover"). — CITED-M 08; CITED Notion Help
- Keyboard: clicking a cell opens the editor immediately; Esc closes then goes cell selection to row selection; arrows/Tab navigate; focus ring is a 2px light gap + 2px blue ring. — CITED-M 08

### Inferences
- The shortest-possible feedback (20ms) on hover plus 200ms only for appearing surfaces keeps the UI feeling instant; there is no stagger, bounce, or parallax in the product UI.

### Gaps
- Marketing-site motion (the third-party reading mentions `fadeIn` keyframes and card hover `translateY(-2px)` on cards, unverified).
- Sidebar expand/collapse animation.

---

## 7. Illustration (hand-drawn black-and-white style)

### Takeaway
Illustration is a brand-layer asset (marketing, help, empty callouts), drawn by one in-house illustrator in a loose line style; the product UI itself carries none.

### Cited Findings
- Notion's in-house illustrator **Roman Muradov** developed the line style ("line style originally created by Roman"); head of creative Rob Giampietro said the "more minimalistic look, inspired by our software, was getting lost in applications like global OOH", which led to the July 2024 campaign with agency Buck that kept the line characters but added primary colours (red, blue, yellow pencil), halftone skin tones/clothing patterns, and heroic scale, inspired by Saul Steinberg drawings; the idea: "a tidy calm space where you can do your best thinking" (building blocks, tiny books). — CITED [It's Nice That, 2024-07-17](https://www.itsnicethat.com/articles/buck-notion-graphic-design-illustration-project-170724), [TCJ interview](https://www.tcj.com/pumping-raw-sewage-into-the-water-supply-a-conversation-about-tech-and-stock-illustrations-with-roman-muradov/) (snippet only)
- The help centre uses small illustrated PNG icons (e.g. `illustrated-icons/catLookingUp.png`) and 96px illustrated callout badges ("Note", "Tip") inside articles. — CITED/observed in Firecrawl scrape of notion.com/help (2026-11-20)
- The Config 2026 talk closes with an illustration "done by Roman", i.e. illustration is still active in 2026. — CITED Config 2026
- Page cover and icon systems are user-controlled; Notion's own gallery of covers and emoji (including a "Notion-style" illustration library) is not part of the UI chrome. — CITED Notion Help

### Inferences
- Illustration is confined to (a) marketing hero/section art, (b) help-article badges, (c) occasional onboarding. It never appears inside tables, sidebar or properties. For a parts catalogue, the equivalent would be restricting illustration to empty states, the landing page and help.
- The black-and-white claim holds for the legacy line characters; the 2024 campaign deliberately added primary colour for marketing impact. I could not view the assets directly.

### Gaps
- Exact stroke weight and colour of the line art; frequency of illustration per marketing page (I could not load the page in a browser).

---

## 8. Stated principles (published by Notion or its designers)

### Takeaway
Notion states its design goals as building blocks, consistency, rhythm and care ("beautiful tools for your life's work"); the design-system team formalised colour, icons and type in 2025 to 2026 without letting the system strip out hand-made quality.

### Cited Findings
- "Notion builds software to help you create beautiful tools for your life's work… just the right building blocks, which you can combine and recombine." Examine each block and update spacing/margins/padding so blocks fall into a predictable flow in any configuration. "Good tools get out of your way." — CITED [Notion blog, 2026-03-18](https://www.notion.com/blog/updating-the-design-of-notion-pages)
- Rhythm without a baseline grid: standardised spacings instead of baseline alignment; paragraph spacing distinct from single-line spacing; adjacency rule for lists (see section 3). — same post
- Design system team formed in July 2025; Notion's CEO had said it had no design system; a design system is "a set of shared decisions… what gives your product a soul"; start with the most foundational decisions (colour, type, icons); one text component, one way to do layout, one button; enforce through "ratcheting" lint rules; "make the right way the easy way"; the goal is how the product makes people feel, and the half-pixel debate (checkbox radius 1.5px) illustrates the care. — CITED [Config 2026, Figma, 2026-07-01](https://www.youtube.com/watch?v=u7_Qof3AJ1g)
- Legacy fact from the same talk: styling had been done with inline JavaScript style objects, with no CSS pseudo-classes. — same talk
- Rob Giampietro (head of creative): marketing look was refreshed because the minimalist look "inspired by our software" got lost in outdoor media. — CITED It's Nice That 2024.

### Inferences
- The stated principles are about consistency and flexibility (blocks), not about "minimalism" per se; the quiet look is a result of the token choices above.

### Gaps
- No Notion-authored document explains the warm greys or the 4px grid. Older essays (e.g. design leads on the original Inter adoption) not found in this pass.

---

## 10 most transferable rules (with key values)

1. **One ink, three greys.** Ink `#2C2C2B`; secondary `#7D7A75`; icon `#8E8B86`; tertiary `#A19E99`; all warm (R>G>B by 2 to 8). Rank info by grey value, not by size or colour. White page `#FFF`; dark `#191919` with ink `#F0EFED`.
2. **Hairlines are translucent and nearly invisible.** 1px `rgba(42,28,0,0.07)` (about 1.15:1 on white; dark `rgba(255,255,243,0.082)`). Information carries the contrast, structure does not.
3. **Table cells get only right + bottom hairlines**, no outer frame, no zebra, no row hover fill. Header 36px, row 37px (21px line + 7.5px×2 + 1px), 14px text, header grey 400 not bold.
4. **Hover-reveal the controls** (row handle, checkbox, OPEN, "...", "+") and keep the resting UI free of icons. Hover tint is a single `rgba(33,27,23,0.05)`.
5. **One accent, one meaning:** blue `#2783DE` for selection, focus, primary action, active filter; selection fill `rgba(35,131,226,0.07)` and halo 0.14; red only for "today" and destructive.
6. **Tags are translucent tints** (alpha 0.14 to 0.28 plus a dark same-hue text) at 20px height, 4px radius, 14/20; 10 hues with the same structure; tints of 3 to 6% for column backgrounds. Ship each colour as a translucent token plus an opaque token (Notion's own colour-system rule).
7. **Few sizes, weight carries identity:** 14/21 for all data text; 12 for secondary UI; 500 for titles and active labels; 600 for group headings; 700 only for page titles (32 to 40px). Line-height 1.5 body, 1.2 headings.
8. **Dense data inside generous margins:** 96px page gutters and a 720px reading column; data views may scroll wider but start aligned to the column; row pitch 30 to 37px.
9. **Floating things get a ring plus tiny layered shadow; flat things get nothing.** Ring `0 0 0 1px rgba(42,28,0,0.07)`; popover `0 8px 12px`/`0 2px 6px` at alpha 0.027; menu `0 20px 24px` at 0.05; dialog `0 24px 48px` at 0.24. Radii: 4 tags, 6 controls, 10 cards/menus, 12 dialogs/peek.
10. **Motion is only for surfaces that appear, 200ms `ease`** (opacity + scale 0.96 to 1); hover tints 20 to 100ms; everything else (view swaps, collapses, editors) is instant. Keep illustration and brand colour in marketing and empty states, never inside tables; adopt list-adjacency spacing (list item next to list item = tighter padding).

---

## Open / unverified

- **Sidebar and breadcrumb:** no 2026 computed styles. Only a May 2025 screenshot-based article (224px width, 30px search, 8px row radius, 22px icon). Selected/hover colours, indent per level, row height, chevron and section label styles are unknown. A direct Playwright/Chrome measurement from an allowed network (or a logged-in session) is the best next step.
- **Direct measurement** of notion.com / help / public Notion pages was impossible here (proxy blocked the hosts). Values in sections 1 to 6 are second-hand (Blok repo measurement docs dated 2026-10-09 and 2026-10-20, from `*.notion.site` and signed-in `app.notion.com`) except the Firecrawl branding extractions. They are consistent with each other and with my own notion.site extraction, but not independently reproduced.
- **Marketing hero colour:** third-party reading shows deep navy `#02093A` hero and primary `#097FE8`; my homepage extraction shows white bg and black pill buttons. Unresolved which is current.
- **Serif/mono page fonts and marketing display face:** Lyon Text, Nitti and Die Grotesk come from third-party or extraction data; I did not confirm that Nitti is the product's Mono option (I believe iA Writer Mono, unverified).
- **Editor block metrics:** heading sizes (inferred 40/30/24), block padding/margins after the March 2026 spacing update, callout padding/radius, toggle chevron, block handle size, quote bar width.
- **Icon stroke width/style** and exact sizes in the sidebar.
- **Illustration usage frequency** and exact asset style on notion.com pages (not seen directly).
- **Rejected/low-trust sources:** shadcn.io and getdesignsystem.io design-system pages (contradict all measured values), designmd.co blog (claims 1.7 line height and a cream background; measured data shows 1.5 and white), notionpartners.com (unrelated company). The designmd.cc benchmark is a useful corroboration but self-labelled as not official.
- **Notion staff name:** blog byline "Paul Velleux", Config transcript auto-caption "Paul Verlu"; I treat them as the same person (icon designer) by inference.
