---
name: publish-page
description: Publish an Oz Docs document as a public web page and return its link, or update a page that was published before. Use when someone says "publish this document", "turn my doc into a web page", "give me a link I can share", "make this public", "update the published page", or asks how to take a published page down.
---

# Publish a document as a web page

`publish_page` on the `oz-docs` server turns one stored Markdown document into a themed web page and returns its URL. The page is deployed into the user's own OpZero account, through an OpZero connection that the user grants to Oz Docs. Oz Docs cannot publish anywhere else.

Publishing makes the content public: anyone who has the link can read it, and it stays online until the user removes it in OpZero.

## When to use

- The user asks for a document to be published or shared by link.
- The user changed a published document and wants the page to match.

Do not publish because a document looks finished. The user has to ask for it.

## Steps

1. Identify the document. If the user did not give a path, call `list_docs` and confirm which one.
2. Read it with `read_doc`. Check what is about to become public: credentials, private names, contact details, internal links, draft notes. Raise anything doubtful before going on.
3. Check for a name clash. The page name is built from the file name only, not its folder. `notes/launch.md` and `plans/launch.md` would publish to the same page, and the second would replace the first. If another document shares the file name, tell the user and suggest renaming one.
4. Confirm with the user: which document, and that it will be public. In Claude Code this plugin's hook also asks for confirmation before the call runs.
5. Call `publish_page` with `path`. Leave `markdown` out to publish the document as stored.
6. Give the user the URL from the result.

## The `markdown` argument

`publish_page` accepts `markdown`. When it is passed, the document is saved with that content first, replacing what was stored without a revision check, and then published. Use it only when the user asked to change and publish in one step and you have just read the document. Otherwise make the change with `update_doc` or `save_doc` first, then publish without `markdown`.

## When the connection has not been granted

The first time, the user has to let Oz Docs use their OpZero account. Until then `publish_page` returns an error that says the connection is needed, usually with a link that expires. The document is saved and nothing was published.

1. Pass the link to the user exactly as returned and say what it is for: it lets Oz Docs deploy pages into their own OpZero account.
2. Wait for them to say they have granted it.
3. Call `publish_page` again.

If the message says the connection needs to be authorized again, the same steps apply. Do not try another route to get the page online.

## Updating and removing a page

- Publishing the same document again replaces the earlier page.
- Deleting the document with `delete_doc` does not remove the page. It stays online.
- Oz Docs has no tool to take a page down. The page is a project in the user's OpZero account, with a name that starts with `md-`. Tell the user to remove it there.

## Problems

- "No document at ...": nothing is stored at that path. List and confirm the path.
- A failure that mentions the OpZero account: the deploy itself failed. Report the message. The document is still saved.
- A result with no page URL: it is not known whether the page went live. Say so and ask the user to check their OpZero projects before publishing again.

## What to tell the user

The public URL, the document it came from, and a reminder that anyone with the link can read it. If nothing was published, say that plainly and say what is needed.

## Examples

"Publish notes/launch-plan.md as a web page and give me the link."
`read_doc`, check the content, confirm, `publish_page` with `path`. Reply with the URL.

"I fixed the typo. Update the page."
`publish_page` with the same `path`. Reply with the URL it returns and say that the earlier page was replaced.

"Take my launch page down."
Explain that Oz Docs cannot remove a published page, that it lives in their OpZero account as a project whose name starts with `md-`, and that deleting the document would not remove it.

## Limits

- One page per file name. Folder names are not part of the page address.
- The page uses OpZero's Markdown theme with automatic light or dark mode. There are no layout options in this tool.
- The page title comes from the first `# ` heading, or the path when there is none.
