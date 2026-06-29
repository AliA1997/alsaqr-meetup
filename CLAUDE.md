# Claude Constitution — AlSaqr Meetup App

This document holds the **durable, cross-cutting conventions** for this project.
Feature-specific decisions live in that feature's spec, not here.

---

## Tech Stack

- **React 18+** — function components and hooks only; no class components.
- **TailwindCSS** — all styling.
- **React Router v7** — routing.
- **Supabase Client** — authentication and session management (source of the bearer token).
- **Gradio Client** — calls to hosted model endpoints. <!-- CONFIRM: what is Gradio used for here — image gen, recommendations, chat? State the purpose and the canonical call site. -->

---

## Architectural Principles

- **Two top-level buckets: `features/` and `components/`.**
  - **Features are pages** — a feature owns a route and composes components into a screen.
  - **Components are reused inside features** — they do not own routes.
  - **`components/common/`** holds shared, app-wide components (buttons, inputs, modals, layout).
- **Every component declares a props interface** named `XxxProps`, even when it takes no props (use `Record<string, never>` or omit props entirely rather than `any`).
- **Auth: pass the Supabase bearer token on every authenticated request.**
  - When a Supabase session exists, attach `Authorization: Bearer <access_token>` to outgoing API requests.
  - Centralize this in the API client so individual call sites never set the header by hand.
  - Unauthenticated requests are allowed only for explicitly public endpoints.

---

## Code Standards

### Hooks
- Use `useMemo` only to avoid a genuinely expensive recompute, and `useCallback` only when a referentially-stable callback is actually required (e.g. it's a dependency of a memoized child or another hook). Don't reach for them by default.
- **Never use `useCallback` for input `onChange` handlers** — define the handler inline or as a plain function.

### Forms
- **Use Formik for all forms.** Validate required inputs and surface errors inline next to the field.
- Define validation as a schema (e.g. Yup) rather than ad-hoc per-field checks. <!-- CONFIRM your validation library if not Yup. -->
- **When implementing a new form, first ask which fields are required vs optional**, then build the validation schema from that answer.

### Styling
- Style with Tailwind utility classes. Extract repeated class strings into a shared component (in `components/common/`) rather than copy-pasting.

### General
- TypeScript everywhere; avoid `any`.
- One concern per file; co-locate a component with its types and styles.

---

## SDD and Workflow

The five phases run in order. Each phase produces a written artifact and has a gate
that must pass before the next phase begins. Do not skip ahead.

### Specifications
- Describes **what** and **why**, never **how**.
- Produces `spec.md` containing: the user-facing goal, user stories, acceptance criteria, the data shapes involved (request/response), and an explicit **out of scope** list.
- This is where feature-specific detail belongs (specific fields, specific copy, specific edge cases).
- **Gate:** spec reviewed and approved before any planning.

### Technical Planning
- Describes **how** the spec is realized within this stack.
- Produces `plan.md` mapping the spec to: which feature/route owns it, which existing common components are reused vs which new components are needed (with their `XxxProps`), the API calls (endpoint + auth), Supabase usage, and any Gradio calls.
- Calls out new shared abstractions and any constitution rules that apply.
- **Gate:** plan reviewed; no implementation detail is invented later that wasn't planned (or the plan is updated first).

### Task Breakdown
- Decomposes the plan into an **ordered checklist** of small, independently verifiable tasks.
- Produces `tasks.md`. Each task should be implementable and testable in a single pass.
- **Gate:** every acceptance criterion in the spec is covered by at least one task.

### Implementation
- Execute tasks in order, following the Code Standards above.
- One concern per commit/PR. If reality diverges from the plan, update `plan.md` rather than silently deviating.
- **Gate:** all tasks checked off.

### Validation
- Verify the build against the spec's acceptance criteria, not against the implementer's memory.
- Confirm: auth/bearer-token flow works for logged-in and logged-out states, form validation rejects bad input and accepts good input, and layouts behave responsively.
- Run the relevant Playwright/integration tests.
- **Gate:** all acceptance criteria pass; otherwise return to the failing phase.