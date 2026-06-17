# AGENTS.md — правила для AI-агентов и контрибьюторов CyberCity UI

## Иерархия документов (от старшего к младшему)

**Над репозиторием** — хаб `cybercity` держит системные документы:

- [`cybercity/COMPOSITION.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/COMPOSITION.md) — канон состава, контрактов, доверительной границы.
- [`cybercity/CONVENTIONS.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/CONVENTIONS.md) — кросс-репо конвенции (язык, скелет репо, ADR-формат, event envelope).
- [`cybercity/adr/`](https://github.com/TheCipherKeeper/cybercity/blob/main/adr/) — сквозные ADR (почему 6 репо, доверительная граница, Rust-коллектор).

**Внутри репозитория:**

1. `docs/adr/` — действующие архитектурные решения. ADR со статусом
   `superseded` не имеют силы.
2. `AGENTS.md` (этот файл) — операционные правила работы в репозитории.
3. `README.md` — краткое описание и quick start.
4. `docs/` — внутренняя документация репозитория.
5. Код, тесты, конфиги — реализация принятых решений.

Если документы противоречат друг другу, побеждает старший. Любое расхождение —
повод создать новый ADR.

## Ключевые принципы

- **Feature-Sliced Design.** Слои `app → pages → widgets → features →
  entities → shared` однонаправлены: импорт идёт только вниз. Слой `app`
  собирает провайдеры и корневой компонент; `shared` — переиспользуемые
  примитивы без бизнес-логики.
- **One-way dependency через алиасы.** Зависимость слоёв enforced через
  path-алиасы в `tsconfig.json` (`@/app/*`, `@/pages/*`, `@/widgets/*`,
  `@/features/*`, `@/entities/*`, `@/shared/*`). Импорт вверх запрещён: виджет
  не импортирует из `pages`, фича — из `widgets`.
- **Server-state — SWR.** Все данные (в v1 — `topology.json`, в v2 — API
  `cybercity-engine`) идут через SWR поверх единого fetcher
  (`shared/api/fetcher.ts`); клиентское состояние — через
  Zustand-per-feature. Серверное состояние не дублируется в Zustand-стор.
- **Zustand-per-feature.** Каждый фича-слайс держит собственный Zustand-slice
  (`selectService`, `filterNetwork`, `searchService`); глобального store нет.
- **TypeScript strict.** `"strict": true`, `noUnusedLocals`,
  `noUnusedParameters`, `noFallthroughCasesInSwitch`. Типы — контракт.
- **Статика-first, без unbuilt-deps.** v1 работает на `topology.json` и не
  ждёт `cybercity-engine`; live-интеграция — отдельный этап (см.
  [`docs/DATA_FLOW.md`](docs/DATA_FLOW.md)).
- **LLM — помощник, не хозяин.** LLM пишет код и YAML; линтеры, типы и тесты
  решают. Коммиты и пуши — человек.

## Правила для AI-агентов

### Что агенту МОЖНО

- Писать TS/React-код в `src/` по слоям FSD.
- Обновлять `README.md`, `AGENTS.md`, `docs/` при изменении структуры.
- Создавать новые ADR, если меняется архитектурное решение.
- Запускать `pnpm run lint`, `pnpm run typecheck`, `pnpm run build`.
- Обновлять `public/assets/topology.json` как копию артефакта
  `cybercity-data/build/topology.json` (после пересборки data).

### Чего агенту НЕЛЬЗЯ

- Нарушать однонаправленные слои FSD (импортировать вверх: `shared` →
  `features`, `features` → `widgets` и т.п.).
- Делать коммиты, пуши, PR — это делает человек.
- Редактировать ADR без явного указания или создания нового ADR.
- Добавлять runtime-зависимости (`dependencies`) без обоснования в ADR.
- Трогать `.claude/` (планы, `settings.local.json`) — это сессионное
  состояние, вне governance.
- Писать «защитный» код в обход типов или линтеров.

## Структура репозитория

```
cybercity-ui/
├── README.md                      # обзор + quick start
├── AGENTS.md                      # этот файл
├── CONTRIBUTING.md                # указатель → docs/DEVELOPMENT.md
├── LICENSE                        # MIT
├── LICENSE-DOCS                   # CC BY 4.0
├── package.json                   # скрипты: dev/build/preview/lint/typecheck
├── tsconfig.json                  # strict + path-алиасы @/*
├── vite.config.ts
├── tailwind.config.js             # палитра cc.*
├── .eslintrc.cjs                  # --max-warnings 0 (в lint-скрипте)
├── index.html
├── public/
│   └── assets/topology.json       # копия cybercity-data/build/topology.json
├── src/
│   ├── main.tsx                   # entry point
│   ├── app/                       # провайдеры, стили, корневой App
│   │   ├── App.tsx
│   │   ├── providers/             # Root-провайдеры
│   │   ├── styles/                # global CSS (Tailwind)
│   │   └── index.ts
│   ├── pages/                     # страницы
│   │   └── CityMapPage/
│   ├── widgets/                   # крупные самодостаточные блоки
│   │   ├── NetworkGraph/          # D3 forceSimulation, zoom/drag
│   │   ├── ServiceSidebar/        # детали выбранного сервиса
│   │   ├── NetworkFilters/        # фильтры по org/kind/exposure
│   │   ├── NetworkSummary/        # сводка узлов/рёбер/орг.
│   │   └── SearchBox/             # поиск сервиса
│   ├── features/                  # сценарии (Zustand-per-feature)
│   │   ├── selectService/
│   │   ├── filterNetwork/
│   │   └── searchService/
│   ├── entities/                  # бизнес-сущности (типы, мапперы)
│   │   ├── service/
│   │   ├── link/
│   │   └── organization/
│   └── shared/                    # переиспользуемый код (без бизнес-логики)
│       ├── api/                   # SWR fetcher
│       ├── config/               # colors, api-константы
│       ├── lib/                   # cn, debounce
│       ├── ui/                    # Badge, Button, Input, Panel
│       └── types/
└── docs/                          # документация
    ├── ARCHITECTURE.md
    ├── DEVELOPMENT.md
    ├── DATA_FLOW.md
    └── adr/
```

## Рабочий цикл

1. Прочитать соответствующий ADR и текущий код в `src/`.
2. Внести изменения, соблюдая однонаправленные слои FSD.
3. Запустить `pnpm run lint`, `pnpm run typecheck`, `pnpm run build`.
4. Показать результат пользователю. Не коммитить.

## Язык документации

Вся документация и ADR ведутся на русском языке. README может содержать
английские бейджи и ссылки, но основной текст — русский. Английский
допустим только для: бейджей, идентификаторов кода, имён библиотек и
значений поля `Status:` ADR (`Accepted` / `Superseded` / `Amended`).