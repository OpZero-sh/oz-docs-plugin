# Paths, revisions and results

Reference for the document tools on the `oz-docs` server. Taken from the server's tool definitions.

## Paths

- A path looks like `notes/launch.md`. Results return it with a `docs/` prefix, for example `docs/notes/launch.md`. Both forms are accepted as input and name the same document.
- `.md` is added when missing.
- A leading slash is dropped. Spaces become hyphens. Characters other than letters, digits, dot, underscore, slash, space and hyphen are removed.
- An empty path becomes `untitled.md`.

Because of these rules, two different looking names can land on the same document. `Launch Plan` and `Launch-Plan.md` are one path. Check with `list_docs` when in doubt.

## Revisions

Every stored document has a `revision`. `read_doc`, `save_doc`, `update_doc` and `list_docs` all return it.

`save_doc` takes `if_revision` in three ways:

| `if_revision` | Effect |
|---|---|
| a revision string | The write succeeds only while the stored document still has that revision. |
| `null` | The write succeeds only if no document exists at the path. Use it to create. |
| left out | The write replaces the document whatever its state. Avoid this on an existing document. |

`update_doc` has no `if_revision` argument. It reads the document and writes it back guarded by the revision it just read, so a change that lands during the call makes it fail instead of being overwritten.

## Results

| Tool | Text result | Structured fields |
|---|---|---|
| `list_docs` | One line per document, or "No documents yet" | `docs`: rows of `path`, `title`, `size` (bytes), `updatedAt` (ISO time), `revision`. Newest first. |
| `read_doc` | The raw Markdown | `path`, `markdown`, `revision` |
| `save_doc` | "Saved <path> (<n> bytes)" | `path`, `title`, `size`, `revision`, `docs` |
| `update_doc` | "Updated <path> (...)" with the number of replacements or "appended" | `path`, `size`, `revision`, `replacements`, `mode` (`replace` or `append`) |
| `delete_doc` | "Deleted <path>" | none |

The `title` in a `list_docs` row is derived from the path. The title in a `save_doc` result, in the editor and on a published page comes from the first `# ` heading, cut to 60 characters, and falls back to the path.

## Error messages from `update_doc`

| Message | Cause | Fix |
|---|---|---|
| "No document at <path>" | Nothing stored there | List and check the path |
| "Pass find/replace or append, not both" | Both modes in one call | Make two calls |
| "Provide find (with replace) or append" | Neither mode given | Send one |
| "find text not present in <path>" | No exact match | Read again and copy the text exactly |
| "find matches <n> places in <path>; widen it with surrounding text or pass all: true" | More than one match | Add context to `find`, or set `all: true` on purpose |

`append` adds the text on a new line at the end of the document.

## Health

`health` takes no input and returns "ok" when the server is up. Use it only to tell a server outage apart from a problem with a document.
