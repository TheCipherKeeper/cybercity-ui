# ADR-0001: Feature-Sliced Design + статика-first SPA

## Status

Accepted

## Context

`cybercity-ui` — витрина полигона CyberCity: 2D-карта топологии города,
таймлайн событий, дашборды. Первое, что видит зритель, — живой граф на
реальных данных. Репозиторий начинает с самой эффектной проекции модели
города — карты сервисов.

На старте доступны:

- Готовый артефакт `cybercity-data/build/topology.json` (46 организаций /
  263 сервиса / 464 линка) и эталонная статическая визуализация
  `cybercity-data/build/network.html` (D3 force-graph).
- `cybercity-engine` — на стадии скелета: live-контракты (`GET /topology`,
  `GET /state`, `WS /ws`) ещё не стабилизированы.

Требования к v1:

- Демо доезжает до деплоя и «вау» здесь и сейчас, без зависимости от
  недостроенного engine.
- Граф — реальная модель города, не косметика: связи и роли сетей берутся
  из декларированной топологии.
- Кодовая база масштабируется от одного виджета-карты к карте + таймлайну +
  дашбордам без переписывания.

Состав проекта и роль `cybercity-ui` описаны в
[`cybercity/COMPOSITION.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/COMPOSITION.md).

## Decision

1. **Стек:** Vite + React 18 + TypeScript (strict) + TailwindCSS + D3.
2. **Архитектура кода — Feature-Sliced Design.** Шесть однонаправленных
   слоёв `app → pages → widgets → features → entities → shared`; импорт
   только вниз; зависимость enforced через path-алиасы `@/*` в
   `tsconfig.json`.
3. **Server-state — SWR**, клиентское состояние — **Zustand-per-feature**
   (без глобального store).
4. **Статика-first:** v1 фетчит `public/assets/topology.json` (копию
   `cybercity-data/build/topology.json`) через SWR. Граф рисуется D3
   `forceSimulation` с parity к `cybercity-data/build/network.html`
   (`forceLink`, `forceManyBody`, `forceCenter`, `forceCollide`).
5. **Путь к live:** переход на `cybercity-engine` (`GET /topology`,
   `GET /state`, `WS /ws`) выполняется заменой fetcher/key в SWR; слой
   `entities/*` (типы, мапперы) не переписывается.

## Consequences

- **Плюсы:** демо не наследует «in-progress»-запах engine; слои изолированы
  и тестируются независимо; live-миграция локализована в `shared/api` и
  ключах SWR; единый контракт моделей (`ServiceNode` / `ServiceLink`) для
  статики и live.
- **Минусы:** копию `topology.json` надо синхронизировать вручную после
  пересборки `cybercity-data`; до live-интеграции нет real-time событий и
  scoring-дашбордов; тестовый стек (Vitest + React Testing Library) ещё не
  заведён.
- **Нейтрально:** FSD требует дисциплины импортов, но алиасы `@/*` делают
  нарушения явными на ревью.

## Alternatives considered

- **Классическая «админка» (плоские компоненты).** Отвергнуто: не даёт
  изоляции фич и не масштабируется от карты к таймлайну/дашбордам без
  переписывания.
- **Live-first (ждать engine).** Отвергнуто: демо привязывается к
  недостроенному engine и теряет «вау здесь и сейчас».
- **Redux / глобальный store.** Отвергнуто: избыточен для per-feature
  клиентского состояния; Zustand-slice на фичу проще и изолированнее.
- **React Query вместо SWR.** Рассмотрен; SWR выбран за минимализм и
  достаточность для статики-first и будущей WebSocket-ревалидации.

## Related

- [`cybercity/COMPOSITION.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/COMPOSITION.md) — состав проекта, роль `cybercity-ui`.
- [`../ARCHITECTURE.md`](../ARCHITECTURE.md) — внутренняя архитектура UI (FSD, D3, модели).
- [`../DATA_FLOW.md`](../DATA_FLOW.md) — поток данных (статика → live).
- [`cybercity/CONVENTIONS.md`](https://github.com/TheCipherKeeper/cybercity/blob/main/CONVENTIONS.md) — кросс-репо конвенции, ADR-формат.