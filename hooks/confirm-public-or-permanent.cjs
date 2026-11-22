// Runs before this plugin's publish_page and delete_doc tools. Publishing makes
// a document public and deleting one is permanent, so the user is asked to
// confirm each. Reads the hook event from stdin, writes a decision to stdout,
// and does nothing else: no files, no network.
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => { input += chunk; });
process.stdin.on("end", () => {
  let event = null;
  try {
    event = JSON.parse(input);
  } catch {
    event = null;
  }
  const toolName = event && typeof event.tool_name === "string" ? event.tool_name : "";
  const toolInput = event && event.tool_input ? event.tool_input : {};
  const path = typeof toolInput.path === "string" && toolInput.path ? " " + toolInput.path : "";
  let reason = "This Oz Docs action could not be checked. Confirm it before proceeding.";
  if (toolName.endsWith("__publish_page")) {
    reason = "This publishes" + (path || " the document") + " as a public web page. Anyone with the link can read it.";
    if (typeof toolInput.markdown === "string") {
      reason += " The stored document is also replaced with the content in this call.";
    }
  } else if (toolName.endsWith("__delete_doc")) {
    reason = "This permanently deletes" + (path || " the document") + ". It cannot be undone, and a page already published from it stays online.";
  }
  const decision = {
    hookEventName: "PreToolUse",
    permissionDecision: "ask",
    permissionDecisionReason: reason
  };
  process.stdout.write(JSON.stringify({hookSpecificOutput: decision}));
});
