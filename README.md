# CyberCity — UI

[![Part of CyberCity](https://img.shields.io/badge/CyberCity-composition-blueviolet)](https://github.com/TheCipherKeeper/cybercity)
[![License: MIT](https://img.shields.io/badge/code-MIT-green)](LICENSE)
[![Docs: CC BY 4.0](https://img.shields.io/badge/docs-CC%20BY%204.0-lightgrey)](LICENSE-DOCS)

Визуализация полигона CyberCity: интерактивная топологическая карта сервисов,
событийный таймлайн, дашборды red/blue, генератор отчётов.

## Стек

- **Bundler:** Vite
- **Frontend:** React 18 + TypeScript (strict)
- **Состояние сервера:** SWR
- **Клиентское состояние:** Zustand
- **Стили:** TailwindCSS
- **Граф:** D3 (force-directed graph)
- **Архитектура:** Feature-Sliced Design

## Быстрый старт

```bash
pnpm install
pnpm run dev
```

Приложение откроется на http://localhost:5173 и загрузит топологию из
`public/assets/topology.json`.

## Сборка

```bash
pnpm run build
pnpm run preview
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `pnpm run dev` | Dev-сервер Vite |
| `pnpm run build` | TypeScript check + production build |
| `pnpm run preview` | Просмотр production-сборки |
| `pnpm run lint` | ESLint |
| `pnpm run typecheck` | TypeScript без эмиссии |

## Структура (Feature-Sliced Design)

```
src/
  app/            # провайдеры, стили, корневой App
  pages/          # страницы приложения
  widgets/        # крупные самодостаточные блоки (NetworkGraph, ServiceSidebar)
  features/       # пользовательские сценарии (selectService, filterNetwork, searchService)
  entities/       # бизнес-сущности (service, organization, link)
  shared/         # переиспользуемый код (api, config, ui, lib, types)
```

## Обновление топологии

`public/assets/topology.json` — это копия артефакта `cybercity-data/build/topology.json`.
После изменений в `cybercity-data` пересоздайте его:

```bash
cp ../cybercity-data/build/topology.json public/assets/topology.json
```

Позже источник данных будет переключён на API `cybercity-engine` (`GET /topology`).

## Композиция CyberCity

| Слой | Репозиторий |
|---|---|
| Витрина | [cybercity](https://github.com/TheCipherKeeper/cybercity) |
| Данные | [cybercity-data](https://github.com/TheCipherKeeper/cybercity-data) |
| Runtime | [cybercity-engine](https://github.com/TheCipherKeeper/cybercity-engine) |
| Управление | [cybercity-manage](https://github.com/TheCipherKeeper/cybercity-manage) |
| Коллектор | [cybercity-collector](https://github.com/TheCipherKeeper/cybercity-collector) |
| **Визуал (этот репо)** | **[cybercity-ui](https://github.com/TheCipherKeeper/cybercity-ui)** |

> Канон композиции, контрактов и доверительной границы —
> [`cybercity/COMPOSITION.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/COMPOSITION.md).

## Лицензия

- Код: [MIT](LICENSE)
- Документация: [CC BY 4.0](LICENSE-DOCS)
