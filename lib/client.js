window.__ModuleLoader__.load({
  id: "dsh-cross-session-agent",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    const React = require("react");
    const { createRoot } = require("react-dom/client");
    const { IconQueueOutlineRegular: SessionIcon, IconCopyOutlineRegular, MenuItemButton } = require("@deepseek-ai/dsh-client-ui-primitives");

    const name = "dsh-cross-session-agent-client";
    const inject = ["slots", "timer", "sessions", "uiWorkspace"];

    function apply(ctx) {
      const senderSelector = '[data-ref-chip="subagent"], [data-context-relay-sender]';
      const reactRootSelector = "[data-agent-msg-react-root]";
      const mountedRoots = new Map();
      const sessionLinks = new Set();

      function uiText(zh, en) {
        const language = String(document.documentElement.lang || navigator.language || "zh").toLowerCase();
        return language.startsWith("zh") ? zh : en;
      }

      function sessionRow(id) {
        return ctx.sessions.list.getSnapshot().byId[id];
      }

      function sessionTitle(row) {
        return String(row?.displayTitle || row?.title || row?.id || "");
      }

      function renderInto(host, content) {
        let root = mountedRoots.get(host);
        if (!root) {
          root = createRoot(host);
          mountedRoots.set(host, root);
          host.setAttribute("data-agent-msg-react-root", "true");
        }
        root.render(content);
      }

      function cleanupRoots(node) {
        if (!(node instanceof Element)) return;
        const hosts = node.matches(reactRootSelector)
          ? [node].concat(Array.from(node.querySelectorAll(reactRootSelector)))
          : Array.from(node.querySelectorAll(reactRootSelector));
        hosts.forEach(function (host) {
          const root = mountedRoots.get(host);
          if (!root) return;
          root.unmount();
          mountedRoots.delete(host);
        });
        const links = node.matches(".agent-msg-session-link")
          ? [node].concat(Array.from(node.querySelectorAll(".agent-msg-session-link")))
          : Array.from(node.querySelectorAll(".agent-msg-session-link"));
        links.forEach(function (element) { sessionLinks.delete(element); });
      }

      function RelaySender(props) {
        return React.createElement("span", { className: "agent-msg-relay-sender-content" },
          React.createElement(SessionIcon, { size: 14, className: "agent-msg-session-icon" }),
          React.createElement("span", null, uiText("来自会话 · ", "From Session · ") + props.title + ":"));
      }

      function senderLink(target) {
        if (!(target instanceof Element)) return null;
        const element = target.closest(senderSelector);
        if (!element) return null;
        if (element.dataset.agentMsgSessionId) {
          return { element: element, sessionId: element.dataset.agentMsgSessionId };
        }
        const match = String(element.textContent || "").match(/session-[\w-]+/);
        return match ? { element: element, sessionId: match[0] } : null;
      }

      function titleFrom(text) {
        const line = String(text || "").split("\n", 1)[0].trim();
        const current = line.match(/^(?:From (?:Session|Agent)|来自会话)(?: ·)? (.+?):(?: @session-[\w-]+)?$/);
        const previous = line.match(/^来自 Agent · (.+)$/);
        const legacy = line.match(/^来自 Agent「(.+)」\s*[·：:]?$/);
        return (current || previous || legacy)?.[1]?.trim() || "";
      }

      function senderTitle(element) {
        if (element.dataset.agentMsgSenderTitle) return element.dataset.agentMsgSenderTitle;
        const label = element.previousElementSibling;
        const title = titleFrom(label?.textContent);
        if (title && label) {
          label.classList.add("agent-msg-sender-prefix");
        }
        return title;
      }

      function prepareSenderLinks(root) {
        if (!(root instanceof Element)) return;
        const elements = root.matches(senderSelector)
          ? [root].concat(Array.from(root.querySelectorAll(senderSelector)))
          : Array.from(root.querySelectorAll(senderSelector));
        elements.forEach(function (element) {
          const link = senderLink(element);
          if (!link) return;
          const relay = element.matches("[data-context-relay-sender]");
          const title = relay ? sessionTitle(sessionRow(link.sessionId)) || "@" + link.sessionId : senderTitle(element);
          if (!relay && !title) return;
          element.dataset.agentMsgSessionId = link.sessionId;
          if (title) element.dataset.agentMsgSenderTitle = title;
          if (relay) renderInto(element, React.createElement(RelaySender, { title: title }));
          else element.textContent = uiText("来自会话 · ", "From Session · ") + title + ":";
          element.classList.add("agent-msg-session-link", "agent-msg-sender-link");
          sessionLinks.add(element);
          element.setAttribute("role", "link");
          element.setAttribute("tabindex", "0");
          element.setAttribute("title", uiText("打开发送方会话", "Open sender session"));
          element.setAttribute("aria-label", uiText("打开发送方会话：", "Open sender session: ") + (title || link.sessionId));
        });
      }

      function prepareRelayCards(root) {
        if (!(root instanceof Element)) return;
        const disclosures = root.matches("[data-disclosure-row]")
          ? [root].concat(Array.from(root.querySelectorAll("[data-disclosure-row]")))
          : Array.from(root.querySelectorAll("[data-disclosure-row]"));
        disclosures.forEach(function (row) {
          if (!String(row.textContent || "").includes("dsh-cross-session-agent")
            && !String(row.textContent || "").includes("dsh-agent-message")) return;
          if (row.getAttribute("aria-expanded") !== "true") row.click();
        });

        // rc.2 renders non-human turn inputs as turn-trigger cards, not context rows.
        // Only decorate a card after its body exposes our protocol; leave other notices alone.
        const bodySelector = '[data-context-form="relay"], [data-turn-trigger]';
        const bodies = root.matches(bodySelector)
          ? [root].concat(Array.from(root.querySelectorAll(bodySelector)))
          : Array.from(root.querySelectorAll(bodySelector));
        const parentTrigger = root.closest('[data-turn-trigger]');
        if (parentTrigger && !bodies.includes(parentTrigger)) bodies.push(parentTrigger);
        bodies.forEach(function (body) {
          const text = body.querySelector("[data-context-text]");
          const raw = String(text?.textContent || "");
          const protocol = raw.startsWith("<dsh-cross-session-agent>")
            ? "dsh-cross-session-agent"
            : raw.startsWith("<dsh-agent-message>")
              ? "dsh-agent-message"
              : "";
          if (protocol === "") return;
          const closingTag = protocol === "" ? "" : "</" + protocol + ">";
          const end = raw.indexOf(closingTag);
          if (end < 0) return;
          if (body.matches('[data-turn-trigger]')) {
            let senderId;
            try { senderId = JSON.parse(raw.slice(protocol.length + 2, end)).senderSessionId; } catch (_) { return; }
            if (typeof senderId !== "string" || !/^session-[\w-]+$/.test(senderId)) return;
            let sender = body.querySelector('[data-context-relay-sender]');
            if (!sender) {
              sender = document.createElement("p");
              sender.setAttribute("data-context-relay-sender", "true");
              text.parentElement.insertBefore(sender, text);
            }
            sender.dataset.agentMsgSessionId = senderId;
            prepareSenderLinks(sender);
          }
          const card = body.closest('[data-chat-flow-kind="context"]') || body;
          card?.setAttribute("data-agent-msg-relay-card", "true");
          const content = raw.slice(end + closingTag.length).trimStart();
          if (text.textContent !== content) {
            text.textContent = content;
            text.dataset.agentMsgRelayBody = "true";
          }
        });
      }

      function prepare(root) {
        prepareRelayCards(root);
        prepareSenderLinks(root);
      }

      function refreshSessionLinks() {
        sessionLinks.forEach(function (element) {
          if (!element.isConnected) {
            sessionLinks.delete(element);
            return;
          }
          prepareSenderLinks(element);
        });
      }

      function openSender(event) {
        const element = event.target instanceof Element
          ? event.target.closest(".agent-msg-session-link")
          : null;
        const sessionId = element?.dataset.agentMsgSessionId;
        if (!sessionId) return;
        event.preventDefault();
        event.stopPropagation();
        ctx.uiWorkspace.openSession(sessionId);
      }

      function onKeyDown(event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        openSender(event);
      }

      function legacyCopyText(text) {
        let ta;
        try {
          ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          return document.execCommand("copy");
        } catch (_) {
          return false;
        } finally {
          ta?.remove();
        }
      }

      async function copyText(text) {
        try {
          if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
          }
        } catch (_) {}
        return legacyCopyText(text);
      }

      function CopyButton(props) {
        const [copyState, setCopyState] = React.useState("idle");
        async function onClick() {
          const text = String(props.sessionId || "");
          if (text === "") return;
          setCopyState(await copyText(text) ? "copied" : "failed");
          ctx.timeout(function () { setCopyState("idle"); }, 2000);
        }
        function onMouseLeave() { setCopyState("idle"); }
        return React.createElement("button", {
          type: "button",
          onClick: onClick,
          onMouseLeave: onMouseLeave,
          title: uiText("复制会话 ID", "Copy session ID"),
          "aria-label": uiText("复制会话 ID", "Copy session ID"),
          className: "agent-msg-copy-id"
        }, copyState === "copied"
          ? uiText("已复制", "Copied")
          : copyState === "failed"
            ? uiText("复制失败", "Copy failed")
            : uiText("复制ID", "Copy ID"));
      }

      ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register(
        { name: "conversation.session.header.actions", id: "copy-session-id", order: 30, label: uiText("复制会话ID", "Copy session ID") },
        (props) => React.createElement(CopyButton, { sessionId: props.sessionId })
      ));

      function CopySessionMenuItem(props) {
        const [failed, setFailed] = React.useState(false);
        const [, setMenuOpen] = props.useMenuOpenState();
        return React.createElement(MenuItemButton, {
          icon: React.createElement(IconCopyOutlineRegular, { size: 14 }),
          disabled: !props.sessionId,
          async onSelect() {
            if (await copyText(String(props.sessionId))) setMenuOpen(false);
            else setFailed(true);
          },
        }, failed ? uiText("复制失败，请重试", "Copy failed, try again") : uiText("复制会话 ID", "Copy session ID"));
      }

      ctx.slots.inject("sidebar.workspaces.session.menu.item", () => ctx.slots.register(
        { name: "sidebar.workspaces.session.menu.item", id: "copy-session-id", order: 350 },
        CopySessionMenuItem
      ));

      const css =
        ".agent-msg-copy-id { cursor: pointer; font-size: 12px; line-height: 1; padding: 5px 10px; border: 1px solid rgba(127,127,127,.35); border-radius: 6px; background: transparent; color: inherit; opacity: .85; } " +
        ".agent-msg-copy-id:hover { opacity: 1; border-color: rgba(127,127,127,.7); } " +
        ".agent-msg-sender-prefix { display: none !important; } " +
        ".agent-msg-session-link { cursor: pointer; text-decoration: none; } " +
        ".agent-msg-sender-link[data-ref-chip=\"subagent\"] { display: block; width: fit-content; padding: 0; background: transparent; color: inherit; font-size: 13px; font-weight: 600; line-height: 1.5; } " +
        ".agent-msg-session-icon { display: inline-flex; flex: none; color: var(--dsw-alias-state-business-primary); } " +
        ".agent-msg-relay-sender-content { display: inline-flex; align-items: center; gap: 5px; } " +
        "[data-agent-msg-relay-card] [data-disclosure-row] { display: none !important; } " +
        "[data-agent-msg-relay-card] [data-context-form=\"relay\"] { width: fit-content; max-width: min(78%, 760px); max-height: none; margin: 0; padding: 14px 16px; overflow: visible; border: 1px solid rgba(127,127,127,.24); border-radius: 16px 16px 16px 4px; background: var(--dsw-alias-markdown-code-block); color: var(--dsw-alias-label-primary); font: inherit; } " +
        "[data-agent-msg-relay-card] [data-context-relay-sender] { display: block; width: fit-content; margin: 0 0 8px; color: var(--dsw-alias-state-business-primary); font-size: 13px; font-weight: 600; line-height: 1.5; } " +
        "[data-agent-msg-relay-card] [data-context-text] { margin: 0; overflow: visible; white-space: pre-wrap; overflow-wrap: anywhere; color: inherit; font: inherit; } " +
        ".agent-msg-session-link:hover { text-decoration: underline; text-underline-offset: 3px; } " +
        ".agent-msg-session-link:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; border-radius: 2px; }";
      const tag = document.createElement("style");
      tag.setAttribute("data-plugin", name);
      tag.textContent = css;
      document.head.appendChild(tag);
      prepare(document.body);
      const observer = new MutationObserver(function (records) {
        records.forEach(function (record) {
          record.removedNodes.forEach(cleanupRoots);
          record.addedNodes.forEach(prepare);
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const unsubscribeSessions = ctx.sessions.list.subscribe(refreshSessionLinks);
      document.addEventListener("click", openSender);
      document.addEventListener("keydown", onKeyDown);
      ctx.effect(() => () => {
        observer.disconnect();
        unsubscribeSessions();
        document.removeEventListener("click", openSender);
        document.removeEventListener("keydown", onKeyDown);
        mountedRoots.forEach(function (root) { root.unmount(); });
        mountedRoots.clear();
        sessionLinks.clear();
        tag.remove();
      });
    }

    exports.name = name;
    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
