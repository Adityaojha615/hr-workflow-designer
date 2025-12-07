// local mock data
export async function fetchAutomations() {
  // in real app, this will be `await fetch('/api/automations')`
  return [
    { id: "send_email", label: "Send Email", params: ["to", "subject"] },
    { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] }
  ];
}

/**
 * simulateWorkflow: takes { nodes, edges } and returns { ok, log, error? }
 * BFS-style traversal from Start node; simple cycle detection.
 */
export async function simulateWorkflow(workflow) {
  const nodes = workflow.nodes || [];
  const edges = workflow.edges || [];
  const log = [];

  const idToNode = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const adjacency = {};
  edges.forEach((e) => {
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  const start = nodes.find((n) => n.meta?.nodeType === "start");
  if (!start) {
    return { ok: false, error: "No Start node found", log };
  }

  const visited = new Set();
  const q = [start.id];

  while (q.length) {
    const nid = q.shift();
    if (visited.has(nid)) {
      log.push(`Cycle detected at ${nid}. Stopping traversal.`);
      break;
    }
    visited.add(nid);

    const node = idToNode[nid];
    if (!node) {
      log.push(`Missing node data for ${nid}`);
      continue;
    }

    const t = node.meta?.nodeType;
    switch (t) {
      case "start":
        log.push(`Start: ${node.data?.title || "Start"}`);
        break;
      case "task":
        log.push(`Task: ${node.data?.title || "Task"} assigned to ${node.data?.assignee || "unassigned"}`);
        break;
      case "approval":
        log.push(`Approval: ${node.data?.title || "Approval"} -> Approver: ${node.data?.approverRole || "role"}`);
        break;
      case "automated":
        log.push(`Automated: ${node.data?.title || "Automated"} -> action: ${node.data?.actionId || "none"}`);
        break;
      case "end":
        log.push(`End: ${node.data?.message || "Completed"}`);
        break;
      default:
        log.push(`Unknown node type ${t}`);
    }

    const outs = adjacency[nid] || [];
    outs.forEach((o) => q.push(o));
  }

  return { ok: true, log };
}
