# CyberCity — UI

[![Part of CyberCity](https://img.shields.io/badge/CyberCity-composition-blueviolet)](#)
[![License: MIT](https://img.shields.io/badge/code-MIT-green)](LICENSE)
[![Docs: CC BY 4.0](https://img.shields.io/badge/docs-CC%20BY%204.0-lightgrey)](LICENSE-DOCS)

Визуализация полигона: 2D-карта города, таймлайн событий, дашборды red/blue,
генератор отчётов. Читает события из [`cybercity-core`](https://github.com/TheCipherKeeper/cybercity)
и метаданные города из [`cybercity-data`](https://github.com/TheCipherKeeper/cybercity-data).

## Экраны

- **City map** — топология сегментов, инциденты в реальном времени (ускоренно: 1 мин симуляции = 1 сек UI)
- **Event timeline** — фильтруемый лог всех событий учений
- **Service dashboard** — состояние сервисов по `kind` / `exposure`
- **Red team console** — карта атаки, текущие цели, счёт
- **Blue team console** — алерты, IOC, цепочки атак
- **Report builder** — экспорт post-mortem в PDF / Markdown

## Стек

Планируется (ADR-0001: Go + K8s + Postgres):
- Frontend: статический SPA (Vite + TypeScript, финальный выбор — в отдельном ADR)
- Backend: gRPC/REST-клиент к eventstore из core
- Map: SVG-схема сегментов + leaflet/MapLibre для гео-слоя

> До UI живём через API + curl. Это последний из 6 этапов (master.md).

## Композиция CyberCity

| Слой | Репозиторий |
|---|---|
| Профиль / витрина | [TheCipherKeeper](https://github.com/TheCipherKeeper/TheCipherKeeper) |
| Сайт | [thecipherkeeper.github.io](https://github.com/TheCipherKeeper/thecipherkeeper.github.io) |
| Core | [cybercity](https://github.com/TheCipherKeeper/cybercity) |
| Данные | [cybercity-data](https://github.com/TheCipherKeeper/cybercity-data) |
| Сценарии | [cybercity-scenarios](https://github.com/TheCipherKeeper/cybercity-scenarios) |
| **UI (этот репо)** | **cybercity-ui** |
| Агенты | [cybercity-agents](https://github.com/TheCipherKeeper/cybercity-agents) |
| Blueprints | [cybercity-blueprints](https://github.com/TheCipherKeeper/cybercity-blueprints) |

## Лицензия

- Код: [MIT](LICENSE)
- Документация: [CC BY 4.0](LICENSE-DOCS)
