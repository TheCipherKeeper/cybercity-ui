# План: первый MVP cybercity-ui

## Цель
Создать статический SPA (Vite + React + TypeScript) по методологии Feature-Sliced Design, который визуализирует топологический граф из `cybercity-data`. Первая фича — интерактивная карта сервисов (City Map).

## Стек
- **Bundler / dev:** Vite
- **UI:** React 18, TypeScript (strict)
- **Состояние сервера:** SWR
- **Клиентское состояние:** Zustand
- **Стили:** TailwindCSS
- **Граф:** D3 (forceSimulation, zoom, drag) — parity с `cybercity-data/build/network.html`
- **Линт / типы:** ESLint + TypeScript (встроенный vite-plugin-checker по желанию)

## Архитектура Feature-Sliced Design
```
src/
  app/                 # инициализация, провайдеры, корневые стили
  pages/
    CityMapPage/         # единственная страница MVP
  widgets/
    NetworkGraph/        # canvas-область графа (D3)
    ServiceSidebar/        # боковая панель деталей сервиса
    NetworkFilters/        # фильтры + поиск
    NetworkSummary/        # сводка узлов/рёбер/орг.
  features/
    selectService/         # выбор сервиса (zustand-слайс + хук)
    filterNetwork/         # фильтрация графа (zustand-слайс + хук)
    searchService/         # поиск по id/host (zustand-слайс + хук)
  entities/
    service/               # типы Service, мапперы, helpers
    organization/          # типы Organization, helpers
    link/                  # типы Link
  shared/
    api/                   # fetcher для SWR, базовые типы
    config/                # константы (URL JSON, цвета)
    lib/                   # утилиты (debounce, color, graph layout)
    ui/                    # переиспользуемые UI-примитивы (Badge, Button, Input)
    types/                 # глобальные типы
```

## Источник данных MVP
- Файл `cybercity-data/build/topology.json` копируется в `public/assets/topology.json`.
- SWR фетчит `/assets/topology.json`.
- Позже заменяем на `GET /topology` движка без изменения слоя `entities/service`.

## Модели (entities/service)
```ts
export interface ServiceNode {
  id: string;
  kind: string;
  orgId: string;
  orgName: string;
  networkId: string | null;
  bindIp: string | null;
  exposure: 'public' | 'intranet' | 'ot' | 'mgmt';
  criticality: 'critical' | 'high' | 'medium' | 'low';
  auth: string;
  dataClassification: string;
  ports: string[];
  host: string | null;
  isMock: boolean;
}

export interface ServiceLink {
  id: string;        // `${from}→${to}:${kind}`
  from: string;
  to: string;
  kind: string;
  protocol: string | null;
  encryption: string | null;
  label: string | null;
}
```

## Фичи
### `features/selectService`
- Zustand store slice: `selectedServiceId: string | null`.
- Хук `useSelectedService()` возвращает выбранный `ServiceNode`.
- Клик по узлу в графе устанавливает выбор; клик по фону сбрасывает.

### `features/filterNetwork`
- Store slice: `orgIds: string[]`, `kinds: string[]`, `exposures: string[]`.
- Селектор `useFilteredGraph()` фильтрует узлы и рёбра.
- Цвет узла по `orgId` через D3 ordinal scale (`shared/config/colors`).

### `features/searchService`
- Store slice: `query: string`.
- Селектор `useSearchMatch()` ищет по `id`, `host`, `orgName`.
- При выборе результата — зум к узлу и `selectService`.

## Виджеты
### `widgets/NetworkGraph`
- Full-screen SVG canvas.
- D3 forceSimulation:
  - `forceLink` distance 240
  - `forceManyBody` strength -1000
  - `forceCenter`
  - `forceCollide` radius 48
- Zoom/pan через `d3.zoom`.
- Drag узлов.
- Стрелки на рёбрах (marker-end).
- Подсветка выбранного узла и соседей.
- Resize Observer для адаптации к размеру контейнера.

### `widgets/ServiceSidebar`
- Показывает детали выбранного сервиса: id, kind, org, network, IP, exposure, criticality, auth, data classification, ports, host.
- Список исходящих/входящих связей.
- Кнопка «центрировать на графе».

### `widgets/NetworkFilters`
- Мультиселекты по организациям, kind, exposure (простые группируемые чекбоксы).
- Кнопка «сбросить фильтры».

### `widgets/NetworkSummary`
- Число узлов/рёбер/организаций после фильтра.
- Индикатор загрузки / ошибки SWR.

## Порядок реализации
1. **Скелет проекта** — `package.json`, Vite config, TypeScript config, Tailwind config, ESLint, `.gitignore`.
2. **Слой `shared`** — базовые типы, fetcher, цвета, UI-примитивы.
3. **Слой `entities/service`** — типы + маппер из `topology.json` + helpers (соседи, фильтрация).
4. **Слой `features/selectService`, `filterNetwork`, `searchService`** — Zustand slices + хуки.
5. **Виджет `NetworkGraph`** — D3 force-граф с зумом/паном/drag/выбором.
6. **Виджеты `ServiceSidebar`, `NetworkFilters`, `NetworkSummary`**.
7. **Страница `CityMapPage`** — сборка layout.
8. **Слой `app`** — `main.tsx`, `App.tsx`, провайдеры.
9. **Скрипт / документация** — копирование `topology.json`, запуск dev-сервера, README-обновление.
10. **Проверка** — `npm run build`, ручной smoke-test в браузере.

## Критерии готовности
- `npm install` → `npm run dev` запускает приложение без ошибок.
- Граф отображает ≥263 узла и 464 рёбра из `topology.json`.
- Можно кликнуть узел — открывается боковая панель с деталями.
- Можно отфильтровать по организации / kind / exposure.
- Можно искать сервис и центрировать камеру на нём.
- `npm run build` проходит успешно.

## Дальнейшие шаги (не в MVP)
- Интеграция с `cybercity-engine` API (`/topology`, `/state`, `/ws`).
- Роутинг (`react-router`) и дополнительные страницы (timeline, dashboards).
- SWR mutation / revalidation по WebSocket.
- Тесты (Vitest + React Testing Library).
