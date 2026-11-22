---
name: work-in-editor
description: Open the Oz Docs visual editor in the conversation and work on the document the user has open, including text they selected or have not saved yet. Use when someone says "open the editor", "open my doc so I can edit it", "start a new document in the editor", "rewrite what I selected", "tighten the paragraph I highlighted", or "look at what I have open".
---

# Work in the Oz Docs editor

`open_editor` on the `oz-docs` server shows a Markdown editor inside the conversation in hosts that support MCP Apps. The user can type in it directly. While it is open, three more tools let you read and change what the user sees, including edits they have not saved.

## When to use

- The user wants to write or edit by hand, with you helping alongside.
- The user refers to "what I have open", "this paragraph" or "what I selected".

If the user only wants a stored document changed and has no editor open, use the `write-doc` skill. It does not need the view.

## Open the editor

| Call | Result |
|---|---|
| `open_editor` with no arguments | A blank document that is not saved yet. |
| `open_editor` with `path` | That stored document. If nothing is stored there, a new empty document at that path, saved when the user or you first save it. |
| `open_editor` with `path` and `markdown` | Creates the document with that content if the path is free, then opens it. If a document already exists there, it is opened as stored and the content you passed is not written. |

`open_editor` never overwrites an existing document. Read the status line in the result: when it says the document already exists and the supplied content was not written, tell the user and ask whether they want the existing document changed.

## Tools while the editor is open

These three tools belong to the open editor view. They appear only while it is open in a host that supports MCP Apps. If they are not in your tool list, the editor is not open or the host does not support it: use `read_doc` and `update_doc` on the stored document instead.

| Tool | What it does |
|---|---|
| `read_open_doc` | Returns the Markdown as shown in the editor, including unsaved edits, with its path and whether it has unsaved edits. |
| `get_selection` | Returns the text the user has selected, or an empty string when nothing is selected. |
| `edit_open_doc` | Changes the open document. The change shows in the editor at once and is saved, together with the user's unsaved edits. |

`edit_open_doc` takes exactly one of:

- `find` with `replace`: replaces an exact piece of text. `find` must match once, unless `all: true`.
- `append`: adds text at the end, on a new line.
- `markdown`: replaces the whole document.

## Steps for "change what I selected"

1. Call `get_selection`. If it is empty, ask the user to select the text or tell you which part they mean.
2. Call `read_open_doc` so you have the surrounding text and know the current state.
3. Call `edit_open_doc` with `find` set to the selected text and `replace` set to your revision. If the selection occurs more than once in the document, extend `find` with words on either side, taken from `read_open_doc`, until it is unique, and extend `replace` the same way.
4. Tell the user what you changed in a sentence.

## Care

- Always `read_open_doc` before editing. The stored copy can be behind what is on screen, so `read_doc` is the wrong source while the editor is open.
- An edit saves the document, including the user's own unsaved typing. For anything larger than a sentence or two, say what you are about to change first.
- Use the `markdown` form of `edit_open_doc` only for a rewrite the user asked for. It replaces everything.
- Do not use `save_doc` or `update_doc` on a document that is open in the editor. They change the stored copy behind the user's screen.

## Examples

"Open the editor and start a new document called meeting-notes."
`open_editor` with `path: "meeting-notes"`. Tell the user it is open and offer to draft a structure.

"Make the paragraph I selected shorter."
`get_selection`, `read_open_doc`, `edit_open_doc` with `find` and `replace`. Reply with one line on what was cut.

"Add a summary at the end of what I have open."
`read_open_doc`, write the summary from its content, `edit_open_doc` with `append`.

## Limits

- The editor needs a host that supports MCP Apps. Elsewhere `open_editor` returns the document as data without the interactive view, and the three view tools are not available.
- The three view tools act on the document currently open in the view, not on any other document.
