# shadcn + Radix Hybrid Migration Plan

Goal: Migrate to a hybrid approach where shadcn-styled components are used as the primary component set while keeping Radix primitives for low-level behavior.

PoC
- Dialog: `src/components/ui/dialog.tsx` (done)
- Toast: `src/components/ui/Toast.tsx` (refactor into shadcn-style)

Priority migration order
1. Toast (global notifications)
2. Dialog / Modal
3. Button
4. Input
5. Select, Radio, Checkbox
6. Tabs, Drawer, Accordion
7. Complex: DatePicker, TimePicker, Virtualized lists

Per-component migration steps
- Create a styled wrapper component that consumes Radix primitives.
- Provide a consistent API (props, variant, size) matching existing usage.
- Add accessibility checks: keyboard, focus trap, aria labels.
- Add visual smoke test + snapshot.
- Replace usages incrementally; keep old components as adapters until complete.

Estimates
- Toast + Dialog PoC: 0.5-1 day
- Buttons + Inputs + Forms: 1-2 days
- Site-wide migration and QA: 1-2 weeks (project dependent)

Notes
- Keep Radix as a dependency. shadcn is styling and component patterns on top of Radix.
- Keep changes incremental and test-heavy to avoid regressions.

***

If you want, I will now:
- Convert `Toast` to a shadcn-style component (auto-dismiss, aria-live, types) and wire it globally (ToastProvider already in layout).
- Add a small accessibility and visual QA checklist and run quick smoke tests.

Choose: (I will start converting Toast next if you confirm.)
