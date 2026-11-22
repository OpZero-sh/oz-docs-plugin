#!/bin/sh
# Runs after publish_page returns. It prints one fixed cue for the model.
# It never reads the tool payload, never writes to disk and never opens a network connection.
cat <<'RESULT'
{"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": "Read the publish result before reporting success. When it contains a page URL, give the person that exact URL, name the document it came from, and say that anyone with the link can read the page until they remove it in OpZero. When the result asks for an OpZero connection, pass on the returned link exactly and say that nothing was published yet. When there is no page URL, say that it is not known whether the page went live."}}
RESULT
