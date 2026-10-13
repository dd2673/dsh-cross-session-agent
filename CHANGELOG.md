# Changelog

## 0.1.4 — 2026-10-13

- Reuse the official DSH `@` Session references. Remove the duplicate candidate source, claimed-input submission, candidate decoration, reference decoration and input-trigger dependency.
- Keep the four cross-session tools, relay rendering, sender navigation and both Session ID copy actions. Clarify stable target IDs, snapshot freshness and explicit messaging in the tool description and bilingual workflow instructions.
- Validate reference-only and explicit-send requests through both native `@` and plain Session IDs on the main desktop, including a real-file review/fix/re-review loop. The native profile fixture also verifies official snapshot preparation.

## 0.1.3 — 2026-10-13

- Add Copy session ID to the sidebar Session … menu through the public workspace menu slot; copy the target row’s stable ID without opening it. Keep the header copy button.
- Route sender links through the public `uiWorkspace.openSession` service; the rc.2 `sessions` binding service has no `open` method. Cover click and keyboard navigation in the client regression.


## 0.1.2 — 2026-10-13

- Real desktop/online-model A→B→A→B acceptance exposed the new 0.2 turn-trigger card structure. Decorate only matching relay bodies with a safe sender link and literal text, retaining the original non-human notice and legacy context rendering.


## 0.1.1 — 2026-10-13 (lilongsky fork)

- Target DSH 0.2.0-rc.2 / Node 24; update pinned development dependencies and client icon.
- Use public SessionQuery for all receipts and inheritedEventCount for fork ownership.
- Default-deny exact A/B pair authorization, same-cwd checks and sender-scoped receipts for every host tool.
- Revalidate cancellation/archive/identity across reads, resume setup, publication commit and delivery.
- Enforce a durable per-coordination message budget from native logs with serialized pair delivery.
- Sanitize error codes and clarify that readable conversation text is not scanned for secrets.
- Add regression and disposable native profile acceptance, retaining MIT attribution and legacy card rendering.

## 0.1.0 - 2026-08-15

- Renamed the independently maintained package to
  `dsh-cross-session-agent`.
- Added the bounded, read-only `get_peer_context` public tool contract.
- Added explicit security, privacy, provenance, and unofficial-project notices.
- Kept legacy `dsh-agent-message` relay rendering for existing Harness history.
