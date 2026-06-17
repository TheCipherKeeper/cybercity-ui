# CyberCity UI — Поток данных

> Системные контракты (event envelope, доверительная граница, артефакты
> `cybercity-data`) — в
> [`cybercity/COMPOSITION.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/COMPOSITION.md).
> Ниже — внутренний поток данных UI.

## TL;DR

В v1 данные идут от статического файла через SWR в сущности и виджеты. В v2
источник заменяется на live `cybercity-engine` (HTTP + WebSocket) без
переписывания слоя `entities`.

## v1 — статический topology.json

```text
public/assets/topology.json   (копия cybercity-data/build/topology.json)
        │
        │  fetch('/assets/topology.json')
        ▼
shared/api/fetcher.ts         (SWR fetcher)
        │
        │  useSWR(key, fetcher)
        ▼
entities/service/model.ts     (raw → ServiceNode / ServiceLink, helpers)
entities/link/
entities/organization/
        │
        ▼
features/*                     (Zustand slices: select/filter/search)
        │
        ▼
widgets/*                      (NetworkGraph, ServiceSidebar, NetworkFilters,
                                 NetworkSummary, SearchBox)
        │
        ▼
pages/CityMapPage              (сборка layout)
```

- **Источник:** `public/assets/topology.json` — копия артефакта
  `cybercity-data/build/topology.json` (46 организаций / 263 сервиса /
  464 линка). Сознательная статика v1, чтобы демо не зависело от
  недостроенного engine.
- **Транспорт:** SWR поверх `shared/api/fetcher.ts`; кеш и ревалидация — на
  стороне SWR. Fetcher — тонкая обёртка над `fetch` с проверкой `res.ok`.
- **Маппинг:** `entities/service/model.ts` превращает сырой JSON (snake_case
  `RawServiceNode` / `RawServiceLink`) в `ServiceNode` / `ServiceLink`
  (camelCase) и даёт helpers (соседи, фильтрация).
- **Серверное состояние не дублируется** в Zustand: SWR — единственный
  источник server-state.

### Обновление копии

```bash
# в cybercity-data
pnpm run build
cp ../cybercity-data/build/topology.json public/assets/topology.json
```

## v2 — live cybercity-engine (план)

Замена источника: fetcher/key в SWR меняется, слой `entities/*` остаётся.

```text
cybercity-engine
   │
   ├── GET /topology   ── статичный топологический граф
   ├── GET /state      ── world-state (сервисы, статусы)
   └── WS /ws          ── поток событий (event envelope)
        │
        ▼
shared/api/fetcher.ts   (HTTP + WebSocket transport)
        │
        ▼  (тот же контракт моделей, что в v1)
entities/service/model.ts
        │
        ▼
features/* / widgets/* / pages/*
```

- `GET /topology` — разовый фетч графа (аналог `topology.json`).
- `GET /state` — текущий world-state; ревалидация через SWR.
- `WS /ws` — поток событий; ревалидация/мутация кеша SWR по событиям
  (каноническая форма event envelope — в
  [`cybercity/CONVENTIONS.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/CONVENTIONS.md)).

Контракт событий пересекает границу репозиториев (`engine → WebSocket →
ui`); модели событий — в
[`cybercity-engine`/docs](https://github.com/TheCipherKeeper/cybercity-engine/blob/main/docs/MODELS.md).

## Что НЕ меняется при переходе v1 → v2

- `entities/service` / `entities/link` (типы, мапперы `normalize*`).
- Слои `features`, `widgets`, `pages` — они потребляют типы, а не транспорт.
- Правило «server-state через SWR, client-state через Zustand-per-feature».

## Что меняется

- `shared/api/fetcher.ts` — добавляется WebSocket-transport и engine-базовый URL.
- Ключи SWR — с `/assets/topology.json` на engine-эндпоинты.
- Ревалидация по событиям WS (мутация/обновление кеша SWR).

## Связанные документы

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — слои FSD, D3, модели.
- [`DEVELOPMENT.md`](DEVELOPMENT.md) — сборка, линтеры, тесты.
- [`cybercity/COMPOSITION.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/COMPOSITION.md) — системные контракты и поток данных.