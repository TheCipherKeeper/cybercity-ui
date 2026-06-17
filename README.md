# CyberCity — UI

[![Part of CyberCity](https://img.shields.io/badge/CyberCity-composition-blueviolet)](https://github.com/TheCipherKeeper/cybercity)
[![License: MIT](https://img.shields.io/badge/code-MIT-green)](LICENSE)
[![Docs: CC BY 4.0](https://img.shields.io/badge/docs-CC%20BY%204.0-lightgrey)](LICENSE-DOCS)

Визуализация полигона CyberCity. **Лендинг репозитория — интерактивный
blast-radius-визуализатор**: задаёшь точку компрометации на реальной
топологии города и наблюдаешь, как атака расползается от сервиса к сервису
по декларированным связям — с живым причинным таймлайном и replay.

Это «вау-лицо» системы: первое, что видит зритель, — живой граф на реальных
данных из [`cybercity-data`](https://github.com/TheCipherKeeper/cybercity-data),
а за ним — глубина всей композиции (модель, ADR, CI, доверительная граница).

> Канон композиции, контрактов и доверительной границы —
> [`cybercity/COMPOSITION.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/COMPOSITION.md).

## Идея

Город — это данные. Визуализация — проекция тех же данных, что кормят
runtime и учения. Поэтому `cybercity-ui` начинается не с «ещё одной
админки», а с **самого эффектного, что можно показать на модели города** —
распространения атаки по графу сервисов. Это и витрина проекта, и seed
полноценного UI: blast-radius позже обрастает картой, таймлайном,
дашбордами red/blue и отчётами.

## Демо

> Живая страница на GitHub Pages + 60-секундный gif появятся с релизом v1.
> Сейчас репо на стадии `feat: initial SPA` (D3-граф на статичной топологии).

## Стек

- **Bundler:** Vite
- **Frontend:** React 18 + TypeScript (strict)
- **Состояние сервера:** SWR
- **Клиентское состояние:** Zustand
- **Стили:** TailwindCSS
- **Граф:** D3 (force-directed graph)
- **Деплой:** GitHub Pages (запланирован)
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
  widgets/        # крупные самодостаточные блоки
                  #   NetworkGraph, ServiceSidebar, BlastRadiusGraph (hero)
  features/       # пользовательские сценарии
                  #   selectService, filterNetwork, searchService,
                  #   launchAttack, replayAttack
  entities/       # бизнес-сущности (service, organization, link, attack)
  shared/         # переиспользуемый код (api, config, ui, lib, types)
```

## Источник данных

`public/assets/topology.json` — копия артефакта
`cybercity-data/build/topology.json` (46 организаций / 263 сервиса /
464 линка). Это **сознательный выбор v1**: демо работает на статике,
**без зависимости от недостроенного `cybercity-engine`**, и потому
доезжает до деплоя и «вау» здесь и сейчас.

Обновить копию после изменений в `cybercity-data`:

```bash
cp ../cybercity-data/build/topology.json public/assets/topology.json
```

Позже источник переключится на live-поток из `cybercity-engine`
(`GET /topology` + WebSocket событий) — см. дорожную карту.

## Дорожная карта

| Этап | Содержание | Статус |
|---|---|---|
| **v1 — blast-radius hero** | интерактивный запуск атаки на статичной топологии, распространение по `links` / `exposure` / `trust`, причинный таймлайн, replay; деплой в GitHub Pages; gif в README | в работе |
| **v2 — live** | live-топология и поток событий из `cybercity-engine` (`GET /topology` + WebSocket) | запланировано |
| **v3 — range UI** | red/blue-дашборды, генератор отчётов, поиск/фильтры сервисов | каркас |

Модель распространения — **реальная, не косметика**: распространение идёт
по декларированным рёбрам и ролям сетей (OT не светится наружу, decoy не
заражает real, directed-рёбра направлены). Это делает «вау» одновременно
правдоподобным blast-radius-симулятором, а не анимацией на фейке.

## Принципы

- **Витрина системы.** Лендинг = самое эффектное, что можно показать на
  модели города; глубина композиции — за ним.
- **Zero unbuilt-deps для демо.** v1 работает на статике и не ждёт engine —
  иначе демо наследует запах «in-progress».
- **Реальная модель, не косметика.** Распространение по настоящим
  `links` / `exposure` / `trust`; вау и правдоподобие не торгуются.
- **Законченность важнее breadth.** Сначала достроить и задеплоить
  hero-слайс, потом обрастать картой / таймлайном / дашбордами. Не
  превращать в шесть недоделанных модулей.
- **LLM — помощник, не хозяин.** LLM пишет/правит, человек решает;
  валидатор — контракт правды.

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