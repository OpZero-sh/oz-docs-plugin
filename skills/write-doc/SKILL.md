---
name: write-doc
description: Create, read, list, revise, rename or delete Markdown documents stored in Oz Docs. Use when someone says "save this as a document", "save these notes", "write this up and keep it", "open my release notes", "list my documents", "change the date in my launch plan", "add a section to my doc", "rename that document", or "delete that draft".
---

# Write and revise documents in Oz Docs

Oz Docs (MCP server `oz-docs`) keeps Markdown documents in the signed in user's private storage. A document is addressed by a path such as `notes/launch.md`. Documents stay there between conversations, so the user can come back to one by name.

Publishing a document as a web page is in `publish-page`. The visual editor is in `work-in-editor`. File attachments are in `manage-attachments`.

## When to use

- The user wants text kept as a document they can return to.
- The user wants a stored document read, changed, renamed or removed.
- The user asks what documents they have.

If the user only wants an answer in the conversation, answer there. Do not save a document nobody asked for.

## Tools

| Request | Tool | Key arguments |
|---|---|---|
| See what exists | `list_docs` | none |
| Read a document | `read_doc` | `path` |
| Create a document, or replace its whole body | `save_doc` | `path`, `markdown`, `if_revision` |
| Change part of a document, or add to the end | `update_doc` | `path`, then `find` with `replace`, or `append` |
| Remove a document | `delete_doc` | `path` |

Path rules, result fields and every error message are in [references/paths-and-revisions.md](references/paths-and-revisions.md).

## Steps

### Create

1. Choose a path. Use the name the user gave. If they gave none, propose a short one from the title, in a folder that fits (`notes/`, `drafts/`), and say what you chose. `.md` is added when missing.
2. Call `save_doc` with `path`, `markdown` and `if_revision: null`. With `null` the write succeeds only if no document exists at that path, so you cannot overwrite something by accident.
3. If the call fails because a document already exists at that path, read the existing document and ask whether to replace it, add to it, or use another name.
4. Start the body with a level one heading. The editor and a published page take their title from the first `# ` heading.

### Read

Call `read_doc`. Keep the `revision` it returns. If the path is not found, call `list_docs` and look for a close match before telling the user it does not exist.

### Change part of a document

1. `read_doc` first, so that `find` is copied from the stored text and not from memory.
2. Call `update_doc` with `path`, `find` and `replace`. `find` must match exactly once. If it matches several places, add surrounding text until it is unique. Pass `all: true` only when the user wants every occurrence changed.
3. To add to the end, call `update_doc` with `path` and `append`. Do not send `find` and `append` together.
4. An empty `replace` deletes the matched text.

Prefer `update_doc` for anything smaller than a rewrite. It leaves the rest of the document untouched and you do not resend the whole body.

### Rewrite a whole document

1. `read_doc` and keep `revision`.
2. Call `save_doc` with the full new `markdown` and `if_revision` set to that revision. If the document changed in the meantime, for example in the editor, the write is refused and nothing is lost. Read again and reapply.

Never call `save_doc` on an existing document without `if_revision`. Left out, the write replaces the document no matter what changed.

### Rename or move

There is no rename tool. Read the document, `save_doc` it at the new path with `if_revision: null`, confirm the new copy by reading it, then ask the user before you `delete_doc` the old path. Tell them that a page already published from the old path stays online under its old address.

### Delete

`delete_doc` is permanent. Name the path back to the user and wait for a clear yes. If the document was published, tell them the web page is not removed by deleting the document.

## Problems

- "No document at ...": the path is wrong or the document was deleted. List and offer the nearest match.
- "find text not present": the stored text differs from what you sent. Read again and copy exactly, including punctuation and line breaks.
- "find matches N places": widen `find` or use `all: true` if that is what the user wants.
- A refused `save_doc` with a revision: someone changed the document after you read it. Read again. Do not retry without `if_revision`.

## What to tell the user

The path, what changed in one line, and for a new document where to find it again. Do not paste the whole document back unless asked.

## Examples

"Save these notes as notes/launch-plan.md."
`save_doc` with `if_revision: null`. Reply with the path.

"In notes/launch-plan.md, change the launch date from March 3 to March 10."
`read_doc`, find the sentence that holds the date, `update_doc` with a `find` long enough to be unique. Reply with the changed sentence.

"List my documents and read the most recent one."
`list_docs` returns newest first. `read_doc` on the first path. Summarize or show it as asked.

## Limits

- Documents are Markdown text. There is no search tool: to find a document by content, list and read.
- Folders exist only as path prefixes.
- Documents are private to the signed in account. Nothing is shared unless the user publishes it.
- These tools offer no way to bring back an earlier version. An overwrite or delete cannot be undone.
