# CyberCity — UI

[![Part of CyberCity](https://img.shields.io/badge/CyberCity-composition-blueviolet)](https://github.com/TheCipherKeeper/cybercity)
[![License: MIT](https://img.shields.io/badge/code-MIT-green)](LICENSE)
[![Docs: CC BY 4.0](https://img.shields.io/badge/docs-CC%20BY%204.0-lightgrey)](LICENSE-DOCS)

Визуальный слой полигона CyberCity: 2D-карта топологии города, таймлайн
событий и дашборды red/blue. Построен как статический-first SPA на Vite +
React + TypeScript по методологии Feature-Sliced Design; граф сервисов
рисуется через D3 forceSimulation. В v1 работает на статической топологии
из [`cybercity-data`](https://github.com/TheCipherKeeper/cybercity-data);
позже переключится на live-поток
[`cybercity-engine`](https://github.com/TheCipherKeeper/cybercity-engine).

> Канон композиции, контрактов и доверительной границы —
> [`cybercity/COMPOSITION.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/COMPOSITION.md).

## Быстрый старт

```bash
pnpm install
pnpm run dev
```

Приложение откроется на http://localhost:5173 и загрузит топологию из
`public/assets/topology.json`.

## Скрипты

| Команда | Описание |
|---------|----------|
| `pnpm run dev` | Dev-сервер Vite (http://localhost:5173) |
| `pnpm run build` | `tsc --noEmit` + production build Vite |
| `pnpm run preview` | Локальный просмотр production-сборки |
| `pnpm run lint` | ESLint (`--max-warnings 0`) |
| `pnpm run typecheck` | TypeScript без эмиссии |

## Статус

Каркас v1 построен: карта сервисов на статичной топологии (D3-граф, боковая
панель, фильтры, поиск). Тестов пока нет. Live-интеграция с
`cybercity-engine` — в дорожной карте.

## Документация

- [`AGENTS.md`](AGENTS.md) — правила для AI-агентов и контрибьюторов.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — внутренняя архитектура (FSD, D3).
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — руководство разработчика.
- [`docs/DATA_FLOW.md`](docs/DATA_FLOW.md) — поток данных (статика → live).
- [`docs/adr/`](docs/adr/) — архитектурные решения.

## Лицензия

- Код: [MIT](LICENSE)
- Документация: [CC BY 4.0](LICENSE-DOCS)