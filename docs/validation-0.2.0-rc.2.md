# 0.1.4 fork verification — 2026-10-13

Target: installed macOS DeepSeek Harness **0.2.0-rc.2**. Desktop Node: 24.18.1;
isolated acceptance runner: the same desktop Electron Node 24.18.1. Original source:
`dd2673/dsh-cross-session-agent` at `f0f7c3d6ab66c66f19472ae33220bad4613724d4`.

## Results

| Check | Result | Evidence boundary |
| --- | --- | --- |
| Regression suite and pack allowlist | **57 passed, 0 failed, 0 skipped** | Installed desktop Electron Node; real rc.2 SessionQuery integration included. Three obsolete picker tests were removed with that feature |
| Fresh native profile acceptance | **9 assertions passed** | Packed fork installed through the official CLI into a temporary DSH_HOME; real Agent, tool dispatch, SessionQuery and JSONL services |
| Official reference integration | Passed | Canonical native mention captured the exact peer ID and its ready text as a durable session-reference snapshot before the isolated messaging loop |
| Cold A → B → A → B | Passed | Native Agent loops with a deterministic local model adapter; B ends with FIXTURE_APPROVED |
| Native receipts and fork ownership | Passed | Three receipts claimed through the plugin; a real fork excludes its parent's Inbox events |
| Authorization and lifecycle | Passed | Explicit pairs, same cwd, archive and abort gates; cross-cwd and unpaired targets rejected |
| Durable message budget | Passed | Fourth relay denied; restart still denies without waking cold B or calling a model |
| Deferred cancellation/archive/resume races | Passed | Controlled asynchronous regression fixtures, including fresh-handle disposal and publication commit validation |
| Main desktop installation | **Installed and running** | Official CLI, scripts disabled; runtime files byte-identical to the fork; profile's existing plugins preserved |
| Official desktop `@` picker | **Passed** | A single matching Session candidate, selected with the native picker at both leading and inline positions; two mentions of A in one request produced one native source descriptor |
| Native `@` reference-only request | **Passed** | B read the captured A context and actual files, discussed a proposed change and finished locally; zero sends, zero relays, and A was not woken |
| Plain Session ID reference-only request | **Passed** | B called get_peer_context for A's latest completed result and answered locally; no additional send or wakeup |
| Main desktop online-model review/fix/re-review | **Passed** | A delivered a real defective file; B independently reproduced 9 pass / 1 fail, sent the finding to A, and was automatically woken by A's fix report. B re-read the changed file, re-ran the unchanged acceptance file, obtained **10 pass / 0 fail** and finished with NATIVE_AT_REVIEW_APPROVED |
| Plain Session ID explicit send | **Passed** | A fresh user request using only the full ID sent one final verdict; A ended with NATIVE_ID_FINAL_RECEIVED and produced no relay reply |
| All four peer tools on the main desktop | **6 successful calls, 0 errors** | list_peer_agents, send_agent_message, check_delivery and get_peer_context used the configured online Flash route and actual host dispatch |
| Main desktop transport evidence | **3 of 3 claimed** | Two messages in the review/fix/re-review loop plus one separate ID-addressed final notification; public SessionQuery over exact UI-copied test IDs and native Inbox events |
| rc.2 relay rendering and sender navigation | Retained; regression passed | The existing relay/sender implementation remains covered by the behavioral test; desktop click/keyboard evidence was recorded in 0.1.3 |
| Header Session ID copying | **Passed on 0.1.4 main desktop** | The actual clipboard was pasted into an unsent composer and matched each newly created test Session ID; drafts were cleared without sending |
| Sidebar Session ID menu | Retained; regression passed | Row-specific copying and menu closing pass in 0.1.4. Actual desktop row clipboard read-back passed in 0.1.3; this action is unchanged |
| Dependency audit | **0 known advisories** | pnpm audit over 59 lockfile dependencies, including development dependencies |
| Runtime static review | No hidden network, telemetry, credential-file reads, shell/eval or independent mailbox found | Only the three lib runtime files are packed; acceptance scripts and local profiles are excluded |

The 0.1.4 Client no longer registers a duplicate candidate source, claims the
composer input, or decorates native reference chips or candidates. Its
input-trigger dependency is removed. The messaging implementation is retained;
the tool contract now distinguishes reference-only discussion from an explicit
send request for both native mentions and full Session IDs.

The real desktop prompts selected A through the official picker rather than
manually inserting an ID or constructing the URI. Native source records prove
the snapshot came from A and repeated mentions were deduplicated. Initial
snapshots stayed unchanged while A fixed the real file; B's subsequent reads
and test commands establish fresh re-review rather than reliance on that old
snapshot or A's completion claim. The acceptance file SHA-256 remained
`65f101b8a22ff27d9beaea1e033c7e16b037d5a64eac45928089edbbf7336ef9`.
The artifact tests ran under the workspace's Node 26.8.1; the plugin and native
acceptance ran under the desktop's Node 24.18.1.

The main profile installer reports missing npm peers for Cordis, Schemastery,
LLM and Tools: the desktop supplies those core packages through its runtime
resolver. The real model's successful tool dispatch establishes that the Host
resolved and executed all four tools. No duplicate core packages were added to
the profile.

The installed app.asar SHA-256 remained
`18d5036bbb58eaff41d351ede99314b8d06505aec06fb2e164c49874ada30f9e`.
No main application restart or core patch was needed. Existing personal Session
content was not used for messaging; the online test had a dedicated workspace
and two new synthetic Sessions. The temporary test pair was revoked afterward;
the entire personal profile patch is byte-identical to its pre-test backup.
Existing profile dependencies are preserved except for this plugin's package
locator. Exact native logs, fixture files and personal profile backups are kept
locally and are not included in this repository or npm package.

## Reproduce the isolated acceptance

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm test
node scripts/live-profile-e2e.mjs /path/to/dsh
```

The runner creates a fresh temporary home, packs and installs the plugin with
scripts disabled, disables HMR only in that test profile, and uses uncompressed
native JSONL to make the evidence inspectable. It boots the profile, gracefully
stops its own process and restarts over the same logs. Its deterministic model
adapter has no online credentials or requests. It never connects to an existing
server or submits to a personal Session. Native transport, lifecycle and
persistence services come from the target CLI.

For desktop reproduction, create two same-workspace root Sessions and configure
their exact IDs as a finite pair. Give A implementation/fix/reply duties and B
review/re-review duties. A can deliver this intentionally defective initial
fixture, preserving it for review:

```js
export function canAccess(role, suspended = false) {
  return role === 'admin' || role === 'editor' && !suspended
}
```

Use an independent acceptance file for the boolean contract: only admin/editor
may access, and suspended roles must all be denied. Keep that file unchanged.
In B, select A from the official `@` menu, first asking only to reference its
work and discuss a future change. Verify no send or A wakeup. Then ask B to
review A, send findings to A, request a fix and a reply, and re-review the
current files after that reply. Verify actual test failures before the fix,
passing results afterward, true sender IDs, native claims and B's explicit
approval. The review loop consumes two messages. The live test allowed one
additional message for a separate plain-ID final verdict request, then revoked
that temporary pair. Plain-ID read-only discussion was also tested separately.
Transport claims do not establish business approval.

## Use boundary

This revision is usable for explicitly configured same-workspace root/fork
pairs on the tested host version. It defaults to no authority. Give both
Sessions finite orchestration duties and a finite maxMessages budget. Remove
the pair when the task ends. The receiver's own Harness permissions still apply.

For actual work, configure the intended Session IDs and a new coordination id;
native `@` or a plain ID does not grant authority, and the model cannot change
configuration or reset the budget. Neither input form automatically sends:
the model uses the message tool for a current explicit request or user-granted
orchestration duty. The tested reference-only prompts stayed local.

Readable user/assistant/compact text is not scanned for secrets. Cold resume can
continue pre-existing Inbox work. Already accepted messages are not retracted
by a later sender stop. Arbitrary model behavior, other DSH releases, future
source updates and undisclosed dependency vulnerabilities are outside this
acceptance.
