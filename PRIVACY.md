# Privacy

The runtime runs within DeepSeek Harness and performs no networking, telemetry,
credential-file reads, shell execution or independent durable storage. Harness
owns all Session logs and Inbox persistence. The in-memory sent table is bounded
and records sender, target, time and mode, not message content.

All host tools require an explicitly configured pair of stable Session IDs,
identical nonempty cwd, normal root/fork identity and an unarchived caller/target.
No pair means no authority. Receipts reveal only the caller's own relay IDs,
including after restart. Inherited parent Inbox events do not belong to a fork.

get_peer_context exposes only direct-user text, canonical compact checkpoints,
completed assistant text and bounded structural turn/tool activity. Reasoning,
raw tool args/results, error messages, metadata, system prompts, plugin/relay
messages, request context, attachments, todos, approvals and Inbox state are
excluded. Error codes must match [A-Z][A-Z0-9_]{0,63}; others become TOOL_ERROR.

This is a field whitelist, not a secret-content scanner. Allowed user, assistant
and compact text may contain sensitive information copied into that text. Do
not place credentials in readable conversation text. Returned peer text remains
untrusted data and does not represent user consent or permission.

The test-only scripts create synthetic Sessions in a disposable DSH_HOME. They
write local acceptance reports; they are excluded from the published package.
