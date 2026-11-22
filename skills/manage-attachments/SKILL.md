---
name: manage-attachments
description: Attach a file from the user's OpZero storage to an Oz Docs document, list what a document references, or remove a reference. Use when someone says "attach this image to my doc", "add that file to the document", "what files does this document use", "is the image in my doc still there", or "remove the attachment".
---

# Attach files to a document

An Oz Docs document can reference files that already sit in the signed in user's OpZero file storage. An attachment is a reference only. No bytes are copied, and attaching a file gives nobody access to it: a reader still needs their own read access to the file.

## When to use

- The user has a file handle and wants it tied to a document.
- The user wants to see or tidy the files a document references.

Oz Docs has no tool to upload a file or to browse storage. If the user has no file handle, say so. They need to add the file to their OpZero storage first and bring back its handle.

## Tools

| Request | Tool | Arguments |
|---|---|---|
| Attach a file | `attach_image` | `path`, `handle`, optional `label`, `role`, `position` |
| List a document's files | `doc_attachments` | `path` |
| Remove one reference | `detach_image` | `attachment_id` |

Despite the tool names, any file can be attached, not only images.

## Attach

1. Get the document `path` and the file `handle` from the user. A handle looks like `file_` followed by an id. Adding `@` and a revision pins the document to that version of the file.
2. Choose `role`: `inline` (the default), `attachment` or `thumbnail`. Use the default unless the user asks for one of the others.
3. Call `attach_image`. `label` sets a caption. `position` sets the order. Left out, the file goes at the end.
4. The result lists all attachments of the document. Confirm the new one is there with state `ok`.

Attaching the same file again in the same role keeps a single reference. The Markdown body of the document is not changed by attaching.

## List and check

`doc_attachments` returns the references in order. Each row has:

| Field | Meaning |
|---|---|
| `id` | The attachment id, starting with `att_`. This is what `detach_image` takes. |
| `fileId` | The file it points to. |
| `role`, `label`, `position` | As set when attaching. |
| `state` | `ok`, `absent` when the file has been deleted, or `denied` when the caller has no read access to it. |
| `stale` | True when a pinned revision is no longer the file's current one. |
| `path`, `size` | The file's own path and size, when known. |

Report `absent` and `denied` rows to the user. They are references that no longer resolve.

## Detach

1. Call `doc_attachments` and find the row. Use its `id`, not the file id.
2. Call `detach_image` with `attachment_id`.
3. The file itself, its revisions and its access settings are untouched. Other documents that reference the same file keep their own attachment.

Detaching removes only the reference, but confirm which one when a document has several.

## Problems

- "Could not attach ...": the handle is wrong, the file is gone, or the user cannot read it. Pass on the reason in the message.
- "No attachment ...": the id does not exist or was already removed. List again.

## Examples

"Attach file_01J... to notes/launch-plan.md as the thumbnail."
`attach_image` with `role: "thumbnail"`. Reply with the attachment id and state.

"What files does my launch plan use?"
`doc_attachments`. Reply with a short table and point out any row that is `absent`, `denied` or `stale`.

"Remove the old diagram from that doc."
`doc_attachments`, pick the row by label or file, confirm, `detach_image`.

## Limits

- No upload and no browsing of storage from this plugin.
- Up to 200 attachments are listed per document.
- Whether an attached file appears on a published page is not something these tools report. Do not promise it.
