# Дронопорт — дизайн-система v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перебудувати дизайн-систему «Дронопорт» за варіантом 2: інтерфейс, дуже схожий на застосунок Claude (еталон — знімок екрана сесії Claude Code в темній темі, наданий користувачем 20.11.2026), мова креслення лише у справжніх кресленнях.

**Architecture:** Файли системи живуть у репозиторії в `design/system/project/` у форматі артефакту Design System (`tokens.json`, `README.md`, `components/…`). `tokens.css` генерується з `tokens.json`; `components/bundle.css` бере значення лише через `var()`. Перевірка — скрипт `check.mjs` (кількості, контраст, невжиті токени) і знімки екрана через Playwright. Публікація — НОВИЙ артефакт, наявний `TQjeVTSu3wAjM1U7osC4ia` не змінюється.

**Tech Stack:** JSON, CSS custom properties, статичний HTML, Node 20 + Playwright (уже встановлені), шрифти woff2 (Geologica, Martian Mono, Science Gothic з наявної системи; Onest з `@fontsource-variable/onest` як кандидат на заміну Geologica).

**Spec:** `reports/Редизайн за Claude та Notion.md` (розділ «Пропозиція (варіант 2)»). Вихідна система: `research_notes/Редизайн за Claude та Notion/current-system-audit.md`.

## Global Constraints

- Сайт лише українською; назви токенів і класів латиницею, як у v1 (`btn`, `fld`, `tree`, `grid`, `top`, `data`, `req`, `spec-list`, `pos`, `st`, `topics`).
- Контраст тексту ≥ 4,5 : 1 в обох темах; межі полів вводу й фокус ≥ 3 : 1; зони дотику ≥ 44px.
- Без тіней, градієнтів, емодзі, суцільної заливки `ink` для обраного стану.
- Одна заливна оливова кнопка на екран.
- Статус ніколи лише кольором; типографіка одиниць із v1 (нерозривний пробіл, кома, кирилиця) без змін.
- Mono лише для артикулів, позначень і вимірів; ціни — Geologica з `font-variant-numeric: tabular-nums`.
- Science Gothic лише у вордмарку.
- У `bundle.css` жодного hex-кольору й жодного `px`, крім `0`, `1px` у медіазапитах і значень усередині `tokens.css`.
- Нічого не публікувати в наявні артефакти користувача; макети сторінок сайту не чіпати.

## Review Focus

- Темна тема: лінія `line` 12% на `page` може зникнути на дешевому екрані — очікується, що зони все одно розрізняються відступом і `surface`. Тест: знімок темної теми в Task 3.
- Яскраве сонце (польові умови): поле вводу має лишатися видимим — `line-control` ≥ 3 : 1. Тест: `check.mjs`, Task 1.
- Довга назва товару (3 рядки) у плитці без роздільників — ряди не мають «пливти». Тест: плитка з довгою назвою в Task 3.
- Товару немає в наявності: плитка без ціни не повинна виглядати порожньою. Тест: така плитка в Task 3.
- Ширина 390px: дерево розділів і таблиця специфікацій без горизонтальної прокрутки сторінки. Тест: мобільний знімок у Task 3.

---

### Task 1: Токени

**Files:**
- Create: `design/system/project/tokens.json`, `design/system/tools/build-tokens.mjs`, `design/system/tools/check.mjs`
- Generated: `design/system/project/tokens.css`

**Interfaces:**
- Produces: CSS-змінні `--<name>` для кожного токена; теми через `:root` (світла), `@media (prefers-color-scheme: dark)` і `[data-theme="dark"|"light"]`. Текстові стилі як `--fs-<style>`, `--lh-<style>`, `--fw-<style>`, `--ff-<family>`.

Значення (світла / темна):

| Токен | Значення | Роль |
|---|---|---|
| `page` | `#FAF9F5` / `#1F1E1D` | фон сторінки й бічних панелей |
| `surface` | `#FFFFFF` / `#2A2A28` | підняті об'єкти: поле пошуку, блок покупки, меню |
| `plate` | `#FFFFFF` / `#FFFFFF` | плита фото |
| `ink` | `#1A1A18` / `#ECEBE7` | текст |
| `ink-2` | `#5E5D59` / `#A3A199` | другорядний текст, підписи груп |
| `line` | `#1A1A181A` / `#ECEBE71A` | єдиний роздільник (10%) |
| `line-control` | `#8C8B85` / `#7C7B75` | межа поля вводу |
| `fill-hover` | `#1A1A180D` / `#ECEBE70D` | наведення (5%) |
| `fill-selected` | `#1A1A1814` / `#ECEBE71A` | обраний пункт |
| `olive` | `#5C6A30` / `#8A9A52` | основна кнопка |
| `olive-ink` | `#4F5A2A` / `#B4C47A` | посилання, фокус, «є» |
| `on-olive` | `#FFFFFF` / `#0E100C` | текст на `olive` |
| `olive-tint` | `#5C6A301F` / `#8A9A5229` | тиха кнопка, виділення |
| `brand` | `#6B7A3A` / `#6B7A3A` | лого |
| `warn` | `#8A5A00` / `#E0B040` | з текстом |
| `danger` | `#A6342A` / `#F07A6A` | з текстом |

- Темна тема в еталоні — основна; значення темної теми оцінені зі знімка екрана на око й звірені з виміряними токенами `--cds-*` (`#151515` / `#1a1a19` / `#20201f`), тому їх уточнює Task 3.
- Родини: `text` = `"Geologica", system-ui, sans-serif` (кандидат на заміну — `"Onest"`, рішення в Task 3); `mark` = `"Martian Mono", ui-monospace, monospace`; `draw` = `"Science Gothic", "Arial Narrow", sans-serif`. Серифного шрифту немає: в еталоні весь інтерфейс набрано одним sans.
- Стилі (розмір / інтерліньяж / вага / родина): `h1` 32/1.2/600/text; `h2` 22/1.3/600/text; `h3` 17/1.4/600/text; `body` 16/1.6/400/text; `ui` 15/1.45/400/text; `small` 13/1.4/400/text; `label` 12/1.35/500/text; `mark` 13/1.4/400/mark; `price-lg` 32/1.1/600/text; `wordmark` 21/1/900/draw. Mobile ≤900px: `h1` 26, `h2` 20, `price-lg` 28.
- Відступи: `space-4`, `8`, `12`, `16`, `24`, `32`, `48`, `72`; `gutter` 32px, `gutter-m` 16px.
- Радіуси: `radius-xs` 4px (чип артикула), `radius-sm` 8px (рядки меню, кнопки, поля), `radius-md` 12px (плити фото, блоки), `radius-lg` 16px (поле пошуку, блок покупки), `radius-pill` 999px.
- Розміри: `control` 44px, `control-lg` 48px, `topbar` 52px, `marker` 22px, `marker-lg` 30px, `panel` 280px, `container` 1200px, `measure` 720px.
- Брейкпоінти: `bp-sm` 620px, `bp-md` 900px, `bp-lg` 1200px.
- Лінії: `line-w` 1px, `line-focus` 2px, `line-icon` 1.5px, `line-dwg-main` 2px, `line-dwg-dim` 1px.
- Рух: `dur-fast` .12s, `dur-base` .2s, `ease-out` `cubic-bezier(.32,.72,0,1)`.

- [ ] **Step 1:** Написати `check.mjs`: перевіряє, що кольорів рівно 16, текстових стилів 10, кроків `space-*` 8; контраст (з урахуванням альфи поверх `page`) `ink`/`page` ≥ 12, `ink-2`/`page` ≥ 4.5, `ink-2`/`surface` ≥ 4.5, `olive-ink`/`page` ≥ 4.5, `on-olive`/`olive` ≥ 4.5, `warn`/`page` ≥ 4.5, `danger`/`page` ≥ 4.5, `line-control`/`page` ≥ 3, `ink` на `fill-selected` ≥ 12 — в обох темах; формат `tokens.json` — списки `{name,value,usage}`, кожен токен має `usage`.
- [ ] **Step 2:** `node design/system/tools/check.mjs` → FAIL (файлу токенів немає).
- [ ] **Step 3:** Написати `tokens.json` зі значеннями вище і `build-tokens.mjs` (`node build-tokens.mjs` пише `tokens.css`, перший рядок `/* Дронопорт — дизайн-система v2 — generated from tokens.json */`).
- [ ] **Step 4:** `node design/system/tools/check.mjs` → `OK`. Якщо пара не проходить контраст — змінити лише світлоту токена, записати нове значення в цю таблицю.
- [ ] **Step 5:** Commit.

### Task 2: Стилі компонентів

**Files:**
- Create: `design/system/project/components/bundle.css`, `design/system/project/fonts/*` (копії з v1 + Onest cyrillic, cyrillic-ext, latin, latin-ext)
- Modify: `design/system/tools/check.mjs`

**Interfaces:**
- Consumes: змінні з Task 1.
- Produces: класи v1 з новим виглядом: `.top`, `.tree`, `.grid`/`.tile`, `.btn` (`.btn--primary`, `.btn--quiet`, `.btn--ghost`), `.fld`, `.data`, `.req`, `.spec-list`, `.pos`, `.st`, `.topics`, `.crumbs`.

Правила:
- Каркас як в еталоні: три зони на одному тлі `page` — бічна панель `panel`, вміст, права панель (блок покупки, специфікація); між зонами лише вертикальна `line`.
- `.top`: тонка смуга `topbar`, без меж між пунктами; знизу `line`; обраний пункт — `fill-selected`, `radius-sm`.
- `.tree`: як бічна панель еталона — рядок 36px (зона дотику 44px на ≤900px), іконка `line-icon` + назва `ui`, без ліній між рядками, `radius-sm`; обраний — `fill-selected`; наведення — `fill-hover`; назви груп — `label` кольором `ink-2`.
- Поле пошуку: `surface`, межа `line-control`, `radius-lg`, висота `control-lg` (як поле вводу еталона).
- Артикул і позначення в тексті: `mark` на `fill-hover`, `radius-xs` (як вставки коду в еталоні).
- `.grid`: проміжок `space-24` (`space-32` від 1200px), без роздільників; `.tile` без рамки; плита фото `plate`, `radius-md`, межа `line`.
- `.btn--primary`: `olive`/`on-olive`; `.btn--quiet`: `olive-tint`, текст `olive-ink`; `.btn--ghost`: без рамки, наведення `fill-hover`. Усі `radius-sm`, висота `control`.
- `.fld`: межа `line-control`, `radius-sm`, фокус 2px `olive-ink` з відступом 2px.
- `.data`: лише нижня `line` у рядків, шапка — `label` кольором `ink-2`, без зовнішньої рамки, рядок 40px.
- `.req`: тло `surface`, `radius-md`, без рамки.
- `.pos`: коло `radius-pill`, межа 1px `ink`; при наведенні `fill-selected` (не негатив).

- [ ] **Step 1:** Додати в `check.mjs` перевірки `bundle.css`: немає `#[0-9a-f]{3,8}`; немає `px`-значень, крім `0` і медіазапитів; кожен токен із `tokens.json` вжито через `var()` хоча б раз (крім `brand`, `wordmark`, `line-dwg-*`); немає `box-shadow`, `gradient`.
- [ ] **Step 2:** Запустити → FAIL.
- [ ] **Step 3:** Написати `bundle.css` за правилами вище; `@font-face` з `unicode-range` на початку файлу.
- [ ] **Step 4:** Запустити → `OK`.
- [ ] **Step 5:** Commit.

### Task 3: Екран каталогу «до / після» (контрольна точка з користувачем)

**Files:**
- Create: `design/system/compare/catalog-v2.html`, `design/system/tools/shoot.mjs`, `design/system/compare/shots/*.png`

**Interfaces:**
- Consumes: `tokens.css`, `bundle.css`; для «до» — файли v1 зі scratchpad аудиту або з артефакту (лише читання).

Вміст екрана: шапка, крихти, дерево розділів (один розкритий, один обраний), заголовок «Мотори», сортування, 6 плиток: 4 «Є на складі», 1 «Немає в нашому магазині», 1 з назвою на три рядки. Плита фото — нейтральна `plate` з підписом розміру, без креслярських заглушок.

- [ ] **Step 1:** `shoot.mjs`: знімає `catalog-v2.html` у 1440×1100 світлій і темній темі та 390×1600; рахує елементи з видимою межею контрастом > 3 : 1 і друкує число.
- [ ] **Step 2:** Зібрати `catalog-v2.html`; перемикач `?font=geologica|onest` для порівняння гарнітур.
- [ ] **Step 3:** `node design/system/tools/shoot.mjs` → знімки темної й світлої теми 1440×1100 в обох гарнітурах і 390×1600; контрастних меж ≤ 6 (у v1 — 21 відрізок L1+L2); горизонтальної прокрутки на 390px немає.
- [ ] **Step 4:** Переглянути знімки поруч зі знімком еталона й `screen-dark.png` v1; підігнати `page`, `surface`, `fill-selected` темної теми під еталон, повторити `check.mjs`.
- [ ] **Step 5:** Commit. Показати користувачеві знімки «до / після» і ЗУПИНИТИСЯ до його рішення.

### Task 4: README (книга бренду) і прев'ю компонентів

**Files:**
- Create: `design/system/project/README.md`, `design/system/project/components/<Name>/{README.md,preview.html}` для Button, Field, TopBar, SectionTree, CatalogTile, DataTable, Requirements, SpecRow, PositionMarker, Stock, TopicTags, Palette, TypeScale, Spacing, Lines, Icons, Cover.

- [ ] **Step 1:** README: розділи «Принципи» (одне тло; простір перед лінією; одна олива на екран; обране — відтінком; дані замість реклами; польові умови), «Колір», «Лінії», «Типографіка», «Простір», «Рух», «Іконографія», «Тексти», «Креслення» (де мова креслення дозволена: схеми, розпіновки, специфікація, маркери), Do / Don't. Без назв на кшталт «… Rule».
- [ ] **Step 2:** Прев'ю: перший рядок `<!-- @dsCard group="…" height=… -->`; розмітка з класів Task 2.
- [ ] **Step 3:** `check.mjs` доповнити: кожна тека компонента має обидва файли; у README немає токенів, яких немає в `tokens.json`. Запустити → `OK`.
- [ ] **Step 4:** Commit.

### Task 5: Публікація

- [ ] **Step 1:** Після згоди користувача створити НОВИЙ артефакт типу Design System з назвою «Дронопорт — дизайн-система v2» і опублікувати `design/system/project/` (логотипи й іконки — копією з v1 через `from_url`).
- [ ] **Step 2:** Надіслати посилання; наявні артефакти лишаються без змін.

Поза цим планом: перенесення макетів сторінок сайту на v2 і тема OpenCart — окремі плани після схвалення v2.
