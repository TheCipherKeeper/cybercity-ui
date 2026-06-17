# CyberCity UI — Руководство разработчика

## Быстрый старт

```bash
cd /path/to/cybercity-ui

# Установка зависимостей
pnpm install

# Dev-сервер (http://localhost:5173)
pnpm run dev
```

Приложение загрузит топологию из `public/assets/topology.json`. Чтобы
обновить копию после изменений в `cybercity-data`:

```bash
# в cybercity-data
pnpm run build
cp ../cybercity-data/build/topology.json public/assets/topology.json
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `pnpm run dev` | Dev-сервер Vite (http://localhost:5173) |
| `pnpm run build` | `tsc --noEmit` + production build Vite |
| `pnpm run preview` | Локальный просмотр production-сборки |
| `pnpm run lint` | ESLint (`--max-warnings 0`) |
| `pnpm run typecheck` | `tsc --noEmit` без эмиссии |

## Конфигурация

- **TypeScript strict.** `tsconfig.json`: `"strict": true`,
  `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`. Path-алиасы `@/*` и per-layer
  (`@/app/*` … `@/shared/*`) — см. [`ARCHITECTURE.md`](ARCHITECTURE.md).
- **ESLint.** `.eslintrc.cjs`: `eslint:recommended` +
  `@typescript-eslint/recommended` + `react-hooks/recommended`;
  `@typescript-eslint/no-unused-vars` — `error`. Линт-скрипт ходит с
  `--max-warnings 0`: предупреждения равно ошибкам.
- **Tailwind.** `tailwind.config.js`: кастомная палитра `cc.*` (`cc-bg`,
  `cc-panel`, `cc-border`, `cc-text`, `cc-muted`, `cc-accent`,
  `cc-accentHover`, `cc-danger`, `cc-warning`, `cc-success`). Сканируются
  `index.html` и `src/**/*.{js,ts,jsx,tsx}`.

## Работа над кодом

### Добавление виджета

1. Создать слайс `src/widgets/<Name>/` (`ui/`, `index.ts`).
2. Использовать сущности из `@/entities/*` и фичи из `@/features/*`.
3. Собрать виджет на странице в `src/pages/`.
4. Не импортировать из `@/pages/*` или `@/app/*` — это вверх по слоям.

### Добавление фичи

1. Создать слайс `src/features/<name>/` (`model.ts`, `hooks.ts`, `index.ts`).
2. Zustand-store живёт внутри фичи (`model.ts`); хук экспортируется из
   `hooks.ts`.
3. Использовать типы из `@/entities/*` и утилиты из `@/shared/*`.

### Изменение источника данных

1. Меняется только fetcher/key в SWR (`shared/api/fetcher.ts`) и хуки
   потребителей.
2. Слой `entities/*` (типы, мапперы) не переписывается при переходе
   статика → live.

## Тестирование

> **Статус: тестов пока нет.** Это известная дыра; ниже — целевой стек.

Целевой стек (TODO):

- **Vitest** — unit-тесты для чистой логики слоёв `entities` и `features`
  (мапперы, селекторы, Zustand-slices).
- **React Testing Library** — компонентные тесты для `widgets` и `shared/ui`.

После заведения тестов (план):

```bash
pnpm run test          # Vitest watch
pnpm run test:ci       # Vitest run, для CI
```

Пока контракт правды — `pnpm run lint` + `pnpm run typecheck` +
`pnpm run build` (см. [`AGENTS.md`](../AGENTS.md)).

## Линтинг и проверки

```bash
pnpm run lint          # ESLint, --max-warnings 0
pnpm run typecheck     # tsc --noEmit
pnpm run build         # typecheck + production build
```

Сборка падает на первой же ошибке типов или неиспользуемом символе
(`noUnusedLocals` / `noUnusedParameters`).

## Стиль коммитов

Conventional Commits (см.
[`cybercity/CONVENTIONS.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/CONVENTIONS.md)):

```text
feat: add NetworkSummary widget
fix: clamp forceCollide radius
docs: update DATA_FLOW.md
refactor: extract service mapper
adr: document FSD choice
```

Summary line — английский допустим; тело коммита — на русском. Коммиты и
пуши делает человек, не агент.

## Процесс ADR

Если изменение затрагивает архитектурное решение (новый слой, смена
источника данных, выбор стека тестов):

1. Написать или обновить ADR в `docs/adr/`.
2. Сослаться на него из `docs/ARCHITECTURE.md`.
3. Старые ADR помечать `superseded`, а не удалять.

## Troubleshooting

### `pnpm run build` падает на неиспользуемой переменной

`noUnusedLocals` / `noUnusedParameters` — это `error`, не warning.
Уберите символ или префиксуйте неиспользуемый параметр `_`.

### Граф пустой / не загружается

Проверьте, что `public/assets/topology.json` существует и не пуст
(см. «Быстрый старт» — обновление копии из `cybercity-data`).

## Связанные документы

- [`AGENTS.md`](../AGENTS.md) — правила для AI-агентов и контрибьюторов.
- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — внутренняя архитектура (FSD, D3).
- [`docs/DATA_FLOW.md`](DATA_FLOW.md) — поток данных.