# CyberCity UI — Архитектура

## TL;DR

`cybercity-ui` — статический-first SPA (Vite + React + TypeScript) по
методологии Feature-Sliced Design, визуализирующий топологический граф
города CyberCity. В v1 рисует граф сервисов на статическом
`topology.json` через D3 forceSimulation; позже переключится на live-поток
событий `cybercity-engine`.

> Системный контекст (диаграмма, таблица ответственностей, слои развёртывания,
> observability, модель безопасности на системном уровне) — в
> [`cybercity/ARCHITECTURE.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/ARCHITECTURE.md).
> Ниже — только внутреннее устройство UI. Контракты событий и моделей — в
> репозиториях `cybercity-engine` / `cybercity-data`.

## Feature-Sliced Design и однонаправленные слои

Код разбит на шесть слоёв; импорт идёт **только вниз**:

```text
app        провайдеры, стили, корневой App; собирает приложение
  │
pages      страницы (точки входа экранов)
  │
widgets    крупные самодостаточные блоки (NetworkGraph, ServiceSidebar, …)
  │
features   пользовательские сценарии (selectService, filterNetwork, searchService)
  │
entities   бизнес-сущности (service, link, organization) — типы, мапперы
  │
shared     переиспользуемый код без бизнес-логики (api, config, lib, ui, types)
```

Правило одной зависимости: `shared` не импортирует из `entities`;
`entities` — из `features`; `features` — из `widgets`; `widgets` — из
`pages`. Слой `app` — единственный, кому разрешено собирать всё вместе.

Зависимость enforced не только конвенцией, но и path-алиасами в
`tsconfig.json`:

```json
"@/app/*":      ["src/app/*"],
"@/pages/*":    ["src/pages/*"],
"@/widgets/*":  ["src/widgets/*"],
"@/features/*": ["src/features/*"],
"@/entities/*": ["src/entities/*"],
"@/shared/*":   ["src/shared/*"]
```

Импорт вверх (`@/pages/*` из `@/widgets/*` и т.п.) — нарушение архитектуры.
Алиасы делают слойность явной и читаемой в ревью.

### Управление состоянием

- **Server-state — SWR.** Все данные (в v1 — `topology.json`, в v2 — API
  `cybercity-engine`) фетчатся через SWR поверх единого fetcher
  (`shared/api/fetcher.ts`). Серверное состояние не кладётся в Zustand.
- **Клиентское состояние — Zustand-per-feature.** Каждый фича-слайс держит
  собственный slice (`features/selectService/model.ts`,
  `features/filterNetwork/model.ts`, `features/searchService/model.ts`).
  Глобального store нет; фичи изолированы.

## Граф сервисов — D3 forceSimulation

Виджет `widgets/NetworkGraph` рисует SVG-граф сервисов через D3
`forceSimulation` (parity со статическим
`cybercity-data/build/network.html`):

| Сила | Параметр | Значение |
|------|----------|----------|
| `forceLink` | `distance` | 180 |
| `forceManyBody` | `strength` | -600 |
| `forceCenter` | — | центр контейнера |
| `forceCollide` | `radius` | 18 |

Дополнительно: zoom/pan через `d3.zoom` (`scaleExtent` 0.1–4), drag узлов,
стрелки на рёбрах (`marker-end`), подсветка выбранного узла и его соседей,
центрирование камеры на узле, ResizeObserver для адаптации к размеру
контейнера.

> Примечание: план в `.claude/plans/initial-fsd-spa.md` называл целевые
> значения `distance 240 / strength -1000 / radius 48`; текущая реализация
> использует более мягкие `180 / -600 / 18`. Параметры подбираются под
> читаемость графа на 263 узлах; план — ориентир, код — факт.

## Модели сущностей

Типы живут в `src/entities/`:

```ts
// entities/service/types.ts
export type Exposure = 'public' | 'intranet' | 'ot' | 'mgmt'
export type Criticality = 'critical' | 'high' | 'medium' | 'low'

export interface ServiceNode {
  id: string
  kind: string
  description: string | null
  orgId: string
  orgName: string
  networkIndex: number
  networkId: string | null
  bindIp: string | null
  exposure: Exposure
  auth: string
  dataClassification: string
  criticality: Criticality
  ports: string[]
  osHint: string | null
  isHoneypot: boolean
  host: string | null
}

// entities/link/types.ts
export interface ServiceLink {
  id: string        // `${from}→${to}:${kind}:${index}`
  from: string
  to: string
  kind: string
  protocol: string | null
  encryption: string | null
  label: string | null
}
```

Сырой `topology.json` приходит в snake_case (`RawServiceNode` /
`RawServiceLink`); мапперы `normalizeServiceNode` / `normalizeServiceLink`
превращают его в camelCase-сущности и проверяют enum-поля (`exposure`,
`criticality`) с безопасным fallback. Слой `entities` не знает о SWR и UI —
только чистые модели и преобразования.

## Источник данных: статика → live

**v1 (текущее):** `public/assets/topology.json` — копия артефакта
`cybercity-data/build/topology.json` (46 организаций / 263 сервиса /
464 линка). SWR фетчит `/assets/topology.json` через
`shared/api/fetcher.ts`. Это сознательный выбор: демо работает на статике,
без зависимости от недостроенного `cybercity-engine`.

Обновить копию после пересборки `cybercity-data`:

```bash
cp ../cybercity-data/build/topology.json public/assets/topology.json
```

**v2 (план):** источник переключается на live `cybercity-engine` без
переписывания слоя `entities` — меняется только fetcher/key в SWR:
`GET /topology` (статичный граф), `GET /state` (world-state),
`WS /ws` (поток событий). Подробно — в [`DATA_FLOW.md`](DATA_FLOW.md).

## Точки расширения

- Новый виджет → добавить в `widgets/`, собрать на `pages/`.
- Новая фича → новый слайс в `features/` с собственным Zustand-store и хуком.
- Новая сущность → `entities/<name>/` (типы + маппер).
- Новый UI-примитив → `shared/ui/`.
- Live-интеграция → замена fetcher-ключа в SWR; слой `entities` не трогается.

## Связанные документы

- [`cybercity/ARCHITECTURE.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/ARCHITECTURE.md) — системная архитектура.
- [`DATA_FLOW.md`](DATA_FLOW.md) — поток данных (статика → live).
- [`DEVELOPMENT.md`](DEVELOPMENT.md) — сборка, линтеры, тесты.
- [`adr/0001-fsd-spa.md`](adr/0001-fsd-spa.md) — почему FSD + статика-first.