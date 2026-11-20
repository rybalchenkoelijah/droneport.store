# Дронопорт — дизайн-система v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перебудувати дизайн-систему «Дронопорт» за варіантом 2: спокійний інтерфейс за правилами Claude/Notion, мова креслення лише у справжніх кресленнях.

**Architecture:** Файли системи живуть у репозиторії в `design/ds-v2/project/` у форматі артефакту Design System (`tokens.json`, `README.md`, `components/…`). `tokens.css` генерується з `tokens.json`; `components/bundle.css` бере значення лише через `var()`. Перевірка — скрипт `check.mjs` (кількості, контраст, невжиті токени) і знімки екрана через Playwright. Публікація — НОВИЙ артефакт, наявний `TQjeVTSu3wAjM1U7osC4ia` не змінюється.

**Tech Stack:** JSON, CSS custom properties, статичний HTML, Node 20 + Playwright (уже встановлені), шрифти woff2 (Geologica, Martian Mono, Science Gothic з наявної системи; Literata з `@fontsource-variable/literata`).

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
- Create: `design/ds-v2/project/tokens.json`, `design/ds-v2/tools/build-tokens.mjs`, `design/ds-v2/tools/check.mjs`
- Generated: `design/ds-v2/project/tokens.css`

**Interfaces:**
- Produces: CSS-змінні `--<name>` для кожного токена; теми через `:root` (світла), `@media (prefers-color-scheme: dark)` і `[data-theme="dark"|"light"]`. Текстові стилі як `--fs-<style>`, `--lh-<style>`, `--fw-<style>`, `--ff-<family>`.

Значення (світла / темна):

| Токен | Значення | Роль |
|---|---|---|
| `page` | `#FAFAF7` / `#151614` | фон сторінки |
| `surface` | `#F3F3EE` / `#1C1D1A` | бічна панель, шапка таблиці |
| `plate` | `#FFFFFF` / `#FFFFFF` | плита фото |
| `ink` | `#1A1B17` / `#ECEDE6` | текст |
| `ink-2` | `#55574F` / `#A9AC9F` | другорядний текст |
| `line` | `#1A1B171A` / `#ECEDE61F` | єдиний роздільник |
| `line-control` | `#8B8D84` / `#777A6F` | межа поля вводу |
| `fill-hover` | `#1A1B170D` / `#ECEDE60D` | наведення |
| `fill-selected` | `#1A1B1714` / `#ECEDE617` | обраний пункт |
| `olive` | `#5C6A30` / `#8A9A52` | основна кнопка |
| `olive-ink` | `#4F5A2A` / `#B4C47A` | посилання, фокус, «є» |
| `on-olive` | `#FFFFFF` / `#0E100C` | текст на `olive` |
| `olive-tint` | `#5C6A301F` / `#8A9A5229` | тиха кнопка, виділення |
| `brand` | `#6B7A3A` / `#6B7A3A` | лого |
| `warn` | `#8A5A00` / `#E0B040` | з текстом |
| `danger` | `#A6342A` / `#F07A6A` | з текстом |

- Родини: `serif` = `"Literata", Georgia, serif`; `text` = `"Geologica", system-ui, sans-serif`; `mark` = `"Martian Mono", ui-monospace, monospace`; `draw` = `"Science Gothic", "Arial Narrow", sans-serif`.
- Стилі (розмір / інтерліньяж / вага / родина): `display` 56/1.1/400/serif; `h1` 40/1.15/400/serif; `h2` 26/1.25/400/serif; `h3` 20/1.35/600/text; `body` 17/1.65/400/text; `ui` 16/1.5/400/text; `small` 14/1.45/400/text; `label` 12/1.35/500/text; `mark` 12/1.4/500/mark; `price-lg` 40/1.1/600/text; `wordmark` 21/1/900/draw. Mobile ≤900px: `display` 40, `h1` 32, `h2` 22, `price-lg` 32.
- Відступи: `space-4`, `8`, `12`, `16`, `24`, `32`, `48`, `72`; `gutter` 32px, `gutter-m` 16px.
- Радіуси: `radius-sm` 6px, `radius-md` 10px, `radius-pill` 999px.
- Розміри: `control` 44px, `control-lg` 48px, `topbar` 60px, `marker` 22px, `marker-lg` 30px, `panel` 280px, `container` 1200px, `measure` 720px.
- Брейкпоінти: `bp-sm` 620px, `bp-md` 900px, `bp-lg` 1200px.
- Лінії: `line-w` 1px, `line-focus` 2px, `line-icon` 1.5px, `line-dwg-main` 2px, `line-dwg-dim` 1px.
- Рух: `dur-fast` .12s, `dur-base` .2s, `ease-out` `cubic-bezier(.32,.72,0,1)`.

- [ ] **Step 1:** Написати `check.mjs`: перевіряє, що кольорів рівно 16, текстових стилів 11, кроків `space-*` 8; контраст (з урахуванням альфи поверх `page`) `ink`/`page` ≥ 12, `ink-2`/`page` ≥ 4.5, `ink-2`/`surface` ≥ 4.5, `olive-ink`/`page` ≥ 4.5, `on-olive`/`olive` ≥ 4.5, `warn`/`page` ≥ 4.5, `danger`/`page` ≥ 4.5, `line-control`/`page` ≥ 3, `ink` на `fill-selected` ≥ 12 — в обох темах; формат `tokens.json` — списки `{name,value,usage}`, кожен токен має `usage`.
- [ ] **Step 2:** `node design/ds-v2/tools/check.mjs` → FAIL (файлу токенів немає).
- [ ] **Step 3:** Написати `tokens.json` зі значеннями вище і `build-tokens.mjs` (`node build-tokens.mjs` пише `tokens.css`, перший рядок `/* Дронопорт — дизайн-система v2 — generated from tokens.json */`).
- [ ] **Step 4:** `node design/ds-v2/tools/check.mjs` → `OK`. Якщо пара не проходить контраст — змінити лише світлоту токена, записати нове значення в цю таблицю.
- [ ] **Step 5:** Commit.

### Task 2: Стилі компонентів

**Files:**
- Create: `design/ds-v2/project/components/bundle.css`, `design/ds-v2/project/fonts/*` (копії з v1 + Literata cyrillic, cyrillic-ext, latin, latin-ext)
- Modify: `design/ds-v2/tools/check.mjs`

**Interfaces:**
- Consumes: змінні з Task 1.
- Produces: класи v1 з новим виглядом: `.top`, `.tree`, `.grid`/`.tile`, `.btn` (`.btn--primary`, `.btn--quiet`, `.btn--ghost`), `.fld`, `.data`, `.req`, `.spec-list`, `.pos`, `.st`, `.topics`, `.crumbs`.

Правила:
- `.top`: без меж між пунктами; знизу `line`; обраний пункт — `fill-selected`, вага 600, `radius-sm`.
- `.tree`: рядок 36px (зона дотику 44px на ≤900px), без ліній між рядками; обраний — `fill-selected` + 600; наведення — `fill-hover`.
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
- Create: `design/ds-v2/compare/catalog-v2.html`, `design/ds-v2/tools/shoot.mjs`, `design/ds-v2/compare/shots/*.png`

**Interfaces:**
- Consumes: `tokens.css`, `bundle.css`; для «до» — файли v1 зі scratchpad аудиту або з артефакту (лише читання).

Вміст екрана: шапка, крихти, дерево розділів (один розкритий, один обраний), заголовок «Мотори», сортування, 6 плиток: 4 «Є на складі», 1 «Немає в нашому магазині», 1 з назвою на три рядки. Плита фото — нейтральна `plate` з підписом розміру, без креслярських заглушок.

- [ ] **Step 1:** `shoot.mjs`: знімає `catalog-v2.html` у 1440×1100 світлій і темній темі та 390×1600; рахує елементи з видимою межею контрастом > 3 : 1 і друкує число.
- [ ] **Step 2:** Зібрати `catalog-v2.html`.
- [ ] **Step 3:** `node design/ds-v2/tools/shoot.mjs` → 3 знімки; контрастних меж ≤ 6 (у v1 — 21 відрізок L1+L2); горизонтальної прокрутки на 390px немає.
- [ ] **Step 4:** Переглянути знімки поруч із `screen-light.png` v1, виправити очевидне.
- [ ] **Step 5:** Commit. Показати користувачеві знімки «до / після» і ЗУПИНИТИСЯ до його рішення.

### Task 4: README (книга бренду) і прев'ю компонентів

**Files:**
- Create: `design/ds-v2/project/README.md`, `design/ds-v2/project/components/<Name>/{README.md,preview.html}` для Button, Field, TopBar, SectionTree, CatalogTile, DataTable, Requirements, SpecRow, PositionMarker, Stock, TopicTags, Palette, TypeScale, Spacing, Lines, Icons, Cover.

- [ ] **Step 1:** README: розділи «Принципи» (папір; простір перед лінією; одна олива на екран; обране — відтінком; дані замість реклами; польові умови), «Колір», «Лінії», «Типографіка», «Простір», «Рух», «Іконографія», «Тексти», «Креслення» (де мова креслення дозволена: схеми, розпіновки, специфікація, маркери), Do / Don't. Без назв на кшталт «… Rule».
- [ ] **Step 2:** Прев'ю: перший рядок `<!-- @dsCard group="…" height=… -->`; розмітка з класів Task 2.
- [ ] **Step 3:** `check.mjs` доповнити: кожна тека компонента має обидва файли; у README немає токенів, яких немає в `tokens.json`. Запустити → `OK`.
- [ ] **Step 4:** Commit.

### Task 5: Публікація

- [ ] **Step 1:** Після згоди користувача створити НОВИЙ артефакт типу Design System з назвою «Дронопорт — дизайн-система v2» і опублікувати `design/ds-v2/project/` (логотипи й іконки — копією з v1 через `from_url`).
- [ ] **Step 2:** Надіслати посилання; наявні артефакти лишаються без змін.

Поза цим планом: перенесення макетів сторінок сайту на v2 і тема OpenCart — окремі плани після схвалення v2.
