# Oz Docs

Keep a Markdown document you can return to by name. Open it alongside your conversation, revise the section you are discussing, and turn the finished draft into a web page. Documents are private to your account until you publish one.

[Connect with Claude, ChatGPT, Muse Code, or Grok](PROVIDERS.md)

> “Open my release notes, find the installation section, and suggest a clearer opening.”

> “Save these notes as notes/launch-plan.md.”

> “Publish notes/launch-plan.md as a web page and give me the link.”

## What is in the plugin

### Skills

| Skill | What it does |
|---|---|
| `write-doc` | Creates, reads, lists, revises, renames and deletes stored documents. Changes are made against the revision that was read, so an edit made elsewhere is not overwritten. |
| `publish-page` | Publishes a document as a public web page in your own OpZero account, handles the one time connection grant, and explains how a page is updated or taken down. |
| `work-in-editor` | Opens the visual editor in the conversation and works on the document you have open, including selected text and edits you have not saved. |
| `manage-attachments` | Attaches a file from your OpZero storage to a document, lists a document's file references and removes one. |

The `write-doc` folder holds a `references` file with path rules, revision behavior and error messages. Claude reads it when it needs it.

### Agent

`document-editor` reviews a stored document and returns proposed edits tied to its section headings. It can only read: its tools are `list_docs`, `read_doc` and `doc_attachments`. It never saves, publishes or deletes.

### Hook

One `PreToolUse` hook runs before this plugin's `publish_page` and `delete_doc` tools. Publishing makes a document public and deleting one is permanent, so Claude Code asks you to confirm each call and tells you which document is affected. The hook is the script `hooks/confirm-public-or-permanent.cjs`. It needs Node.js on your PATH, reads the pending tool call from standard input, and does not touch files or the network.

## What the plugin connects to and sends

- **MCP server.** The plugin connects to one remote server at `https://oz-docs.mcp.opzero.sh/mcp`. You sign in with an OpZero account using OAuth. No API key is stored in the plugin.
- **What is sent.** Read and edit operations send the document path and the text of the requested edit. Saving sends the document body. Documents are stored in your private scope on OpZero.
- **Publishing.** Publishing is the one action that makes content public. It deploys the document as a web page into your own OpZero account, through an OpZero connection that you grant to Oz Docs yourself. The page can be read by anyone who has its link and stays online until you remove it in OpZero. Deleting the document does not remove the page.
- **What is not sent.** The plugin has no telemetry and makes no other network calls of its own.

### Optional files for other clients

These files are not run by Claude. They exist so the same product can be used from other assistants.

- `scripts/build_openai.py` builds a ZIP package for ChatGPT and Codex from the files in this repository. It reads local files and writes ZIP files to the folder you name. It makes no network calls.
- `integrations/grok_example.py` is a sample for the xAI API. It runs only when you run it. With `--dry-run` it prints a request and sends nothing. Without it, the script reads `XAI_API_KEY` from your environment and sends one request to `https://api.x.ai/v1/responses`. If `OZ_DOCS_ACCESS_TOKEN` is set, that OpZero access token is included in the request so that xAI can call the Oz Docs server for you.
- `integrations/grok-servers.json`, `integrations/muse-settings.json` and the files under `integrations/openai` are configuration for those clients. They contain the same server URL and no credentials.

## Limits

- Documents are Markdown text. There is no search tool and no way to bring back an earlier version through these tools.
- The editor view needs a client that supports MCP Apps. Elsewhere the document tools still work as text.
- Oz Docs cannot take a published page down. That is done in your OpZero account.

[Product documentation](https://oz-docs.mcp.opzero.sh/) · [Privacy](https://opzero.sh/privacy) · [Support](https://opzero.sh/support)

## Install in Claude Code

```text
/plugin marketplace add OpZero-sh/plugins
/plugin install oz-docs@opzero
```

After installing, open `/mcp` and sign in to **oz-docs**.
