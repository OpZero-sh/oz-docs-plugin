---
name: write-doc
description: Write, edit, organise or publish a Markdown document in Oz Docs. Use when the user asks to save notes or a draft as a document, open the document editor, change a stored document, list their documents, or publish one as a web page.
---

# Working with Oz Docs

Oz Docs (MCP server `oz-docs`) stores Markdown documents per user. A document is addressed by a path such as `notes/launch.md`; the `.md` suffix is added when missing. Each read returns a `revision`.

## Choosing a tool

| Request | Tool |
|---|---|
| See what exists | `list_docs` |
| Read a document | `read_doc` |
| Create a document or replace its whole body | `save_doc` |
| Change part of a document | `update_doc` |
| Work in the editor view | `open_editor` |
| Publish as a themed web page | `publish_page` |
| Remove a document | `delete_doc` |

## Rules

1. Read before changing. Call `read_doc`, keep its `revision`, and pass it as `if_revision` to `save_doc` so a concurrent edit is refused rather than overwritten.
2. Prefer `update_doc` for a targeted change. `find` must match exactly once; widen it with surrounding text when it does not, or pass `all: true` to replace every occurrence. `append` adds text at the end.
3. `open_editor` renders the editor in hosts that support MCP Apps. While it is open, `read_open_doc`, `edit_open_doc` and `get_selection` act on the open document, including edits the user has not saved.
4. `publish_page` makes content public: it deploys the document as a web page into the user's own OpZero account, through their OpZero connection. Confirm with the user before publishing, and give them the returned URL. When the connection has not been granted, the tool returns a link to grant it; pass that link on.
5. `delete_doc` is permanent. Confirm the path with the user first.
