# Thinking Progress System — Plan

Add a **thinking progress** UI when users click Generate (or equivalent) on the website generator and other AI features. Users see step-by-step status (e.g. "Fetching profile" → "Building case studies" → "Generating…") instead of a single "Generating…" or spinner.

---

## Current State

| Feature | Location | Current loading UX |
|--------|----------|---------------------|
| **Portfolio website** | `/portfolio/[username]/build` | Button text "Generating…"; no steps |
| **Portfolio case studies** | `/ai` (portfolio tab), `/portfolio/[username]` | "Generating Portfolio…"; no steps |
| **Profile Intelligence** | `/ai` (intel tab) | "Building Intelligence…"; no steps |
| **Profile Analysis** | `/ai` (analyze tab) | "Analyzing with Gemini…"; no steps |
| **Theme Recommendations** | `/ai` (themes tab) | "Getting Recommendations…"; no steps |
| **Explain Profile** | `/ai` (analyze tab) | "Explaining..."; no steps |
| **README Generator** | `/readme-generator` | **Has** step progress (timer-based): "Fetching…" → "Gemini thinking…" → "Refining…" |
| **Live README Agent** | `/readme-agent` | **Has** streaming thoughts; no change needed |
| **Portfolio website edit** | Same build page, "Apply" | "Applying…"; single step |
| **Daily Dev Card** | `/daily` | Fetch stats then optional AI text; could add "Generating card text…" |
| **Chat** | `/ai` (chat tab) | "Thinking…" in input; optional single step |
| **Wrapped / Visualize** | `/wrapped`, `/visualize` | Already stream; own progress UI |

All non-streaming APIs are single `POST` → JSON; they do not emit progress. So progress will be **simulated on the frontend** (timer-based) unless we add streaming later.

---

## Approach

### Phase 1: Shared component + timer-based steps (no API changes)

1. **Add a reusable `ThinkingProgress` component** used everywhere we show "AI is working".
2. **Define steps per feature** and advance the active step on a timer while the request is in flight; on success set "all done", on error reset.
3. **Integrate** into: portfolio website builder, AI page (analyze, themes, intel, portfolio, explain), portfolio case studies page, README generator (refactor existing steps into the component), portfolio edit, daily card AI text, chat (optional).

### Phase 2 (optional): Real progress via SSE

- For long-running routes (e.g. `/api/ai/portfolio-website`), add **SSE progress events** (e.g. `{ step: 'fetch_profile' }`, `{ step: 'case_studies' }`, `{ step: 'generate_website' }`).
- Frontend consumes the stream and drives `ThinkingProgress` from real events instead of a timer.

This plan focuses on **Phase 1** only.

---

## 1. Shared component: `ThinkingProgress`

**File:** `src/components/ThinkingProgress.tsx`

**Props:**

- `steps: { id: string; label: string }[]` — Ordered list of step labels (e.g. "Fetching GitHub profile", "Building case studies", "Generating website").
- `activeIndex: number` — Current step (0-based). When `activeIndex >= steps.length`, treat as "all done".
- `variant?: 'inline' | 'card'` — Optional. `card`: block like README generator (green-tinted box with spinner). `inline`: compact line under button or in-place.

**Behavior:**

- For each step:
  - **Index < activeIndex:** Done — show checkmark (or dimmed label).
  - **Index === activeIndex:** Active — show spinner + label (and optional short sub-label).
  - **Index > activeIndex:** Pending — show muted label (optional).
- When `activeIndex >= steps.length` and still "loading", show a brief "Done" or final checkmark before parent clears loading (optional; or parent sets loading false and activeIndex to last at same time).

**Visual:**

- Reuse README generator style: green tint (`rgba(34, 197, 94, 0.08)`), border `rgba(34, 197, 94, 0.2)`, green text, spinner on active step, checkmark for done.
- Optional: small step list (e.g. vertical) with connectors so multiple steps are visible at once.

**Export:**

- Default export: `ThinkingProgress`.
- Optional: a hook `useThinkingProgress(steps, { intervalMs })` that returns `{ activeIndex, setActiveIndex, start, complete, reset }` and advances `activeIndex` on a timer when `start()` is called, up to `steps.length - 1`; `complete()` sets to `steps.length`; `reset()` sets to 0.

---

## 2. Step definitions per feature

| Feature | Steps (in order) |
|---------|-------------------|
| **Portfolio website** | "Fetching GitHub profile" → "Building case studies" → "Generating website" → (done) |
| **Portfolio case studies** (AI tab + portfolio page) | "Fetching profile" → "Analyzing repos" → "Writing case studies" → (done) |
| **Profile Intelligence** | "Fetching profile" → "Searching benchmarks" → "Generating insights" → (done) |
| **Profile Analysis** | "Fetching profile" → "Analyzing with Gemini" → (done) |
| **Theme Recommendations** | "Fetching profile" → "Matching themes" → (done) |
| **Explain Profile** | "Fetching profile" → "Explaining profile" → (done) |
| **README Generator** | Already: "Fetching GitHub profile" → "Gemini 3 is thinking…" → "Refining for {role}…" → (done). Refactor to use shared component + these labels. |
| **Portfolio website edit** | "Applying changes…" (single step) → (done) |
| **Daily Dev Card** (AI text) | "Generating card text…" (single step) → (done) |
| **Chat** | Optional: "Thinking…" (single step). |

---

## 3. Integration points

### 3.1 Portfolio website builder — `src/app/portfolio/[username]/build/page.tsx`

- Add state: `progressStep: number` (0–3 for the 3 steps above).
- When "Generate website" is clicked: set `loading = true`, `progressStep = 0`.
- Start an interval (e.g. 1.2–1.5 s) that increments `progressStep` until `progressStep >= 2` (stop at "Generating website").
- Render `<ThinkingProgress steps={[...]} activeIndex={progressStep} variant="card" />` above or below the button when `loading` is true.
- On fetch success: set `progressStep = 3` (or steps.length), then set `loading = false` and clear interval.
- On fetch error: set `loading = false`, `progressStep = 0`, clear interval.

### 3.2 AI page — `src/app/ai/page.tsx`

- Add one progress state per tab that can trigger long-running work: e.g. `analyzeProgressStep`, `themesProgressStep`, `intelProgressStep`, `portfolioProgressStep`, `explainProgressStep` (each 0..max for that feature).
- For each "Generate" / "Run" handler (Analyze, Get Theme Recommendations, Run Profile Intelligence, Generate Portfolio, Explain):
  - Set loading true and progress step 0.
  - Start timer advancing step (cap at step count - 1).
  - Render `<ThinkingProgress steps={...} activeIndex={...} />` in that tab’s content when loading.
  - On response: set step to "done", then set loading false and clear timer; on error: loading false, step 0.

Use the step lists from the table above for each feature.

### 3.3 Portfolio case studies page — `src/app/portfolio/[username]/page.tsx`

- Same pattern: when fetching case studies, show `<ThinkingProgress steps={["Fetching profile", "Analyzing repos", "Writing case studies"]} activeIndex={progressStep} />` with timer-based `progressStep`.

### 3.4 README Generator — `src/app/readme-generator/page.tsx`

- Replace the existing step progress block and button copy logic with `<ThinkingProgress steps={[...]} activeIndex={currentStep} variant="card" />` and the same timer logic (or a small hook that encapsulates timer + currentStep). Keep Career Mode logic: 3 steps vs 2 steps.

### 3.5 Portfolio website edit — `src/app/portfolio/[username]/build/page.tsx`

- When "Apply" is clicked: show a single-step progress ("Applying changes…") using the same component with `steps={["Applying changes…"]}` and `activeIndex={0}` while `editLoading` is true; on done set activeIndex to 1 or hide.

### 3.6 Daily Dev Card — `src/app/daily/page.tsx`

- When AI text is being generated after fetch (`aiLoading`), show a small progress: one step "Generating card text…" (e.g. inline or small card) using `ThinkingProgress`.

### 3.7 Chat — `src/app/ai/page.tsx`

- Optional: while `chatLoading`, show a single-step "Thinking…" (e.g. under the input or in the message list) via `ThinkingProgress`.

---

## 4. Hook (optional but recommended)

**File:** `src/hooks/useThinkingProgress.ts` (or `src/lib/thinking-progress.ts`)

- `useThinkingProgress(stepLabels: string[], options?: { intervalMs?: number })`
- Returns: `{ activeIndex, start, complete, reset, isActive }`.
- `start()`: set activeIndex 0, start interval that increments activeIndex every `intervalMs` (default 1200), max `stepLabels.length - 1`.
- `complete()`: clear interval, set activeIndex to stepLabels.length.
- `reset()`: clear interval, set activeIndex to 0.
- Parent calls `start()` when kicking off the request, `complete()` on success, `reset()` on error (and when opening a new flow).

This keeps timer logic and cleanup in one place and avoids duplicate interval logic in every page.

---

## 5. Files to add

| File | Purpose |
|------|--------|
| `src/components/ThinkingProgress.tsx` | Reusable step progress UI (steps, activeIndex, variant). |
| `src/hooks/useThinkingProgress.ts` | Optional hook for timer-based step advancement and cleanup. |

---

## 6. Files to modify

| File | Change |
|------|--------|
| `src/app/portfolio/[username]/build/page.tsx` | Add progress state + timer; render ThinkingProgress for "Generate website" and optionally for "Apply". |
| `src/app/ai/page.tsx` | Add progress state + timer per tab (analyze, themes, intel, portfolio, explain); render ThinkingProgress in each tab when loading. |
| `src/app/portfolio/[username]/page.tsx` | Add progress state + timer; render ThinkingProgress when loading case studies. |
| `src/app/readme-generator/page.tsx` | Refactor existing step UI to use ThinkingProgress; keep step labels and Career Mode step count. |
| `src/app/daily/page.tsx` | When aiLoading, show ThinkingProgress with single step "Generating card text…". |
| (Optional) Chat in `src/app/ai/page.tsx` | Show single-step "Thinking…" while chatLoading. |

---

## 7. Summary

- **One shared component** (`ThinkingProgress`) and an optional **hook** (`useThinkingProgress`) for timer-based steps.
- **No backend changes** in Phase 1; all progress is estimated on the frontend.
- **Consistent UX** across: portfolio website, portfolio case studies (AI + portfolio page), profile intel, profile analysis, theme recommendations, explain profile, README generator (refactor), portfolio edit, daily card AI, and optionally chat.
- **Optional Phase 2:** Add SSE progress events to long-running APIs and drive `ThinkingProgress` from real backend steps.
