import React from "react";

const NODE_TYPES = [
  { type: "start", label: "Start" },
  { type: "task", label: "Task" },
  { type: "approval", label: "Approval" },
  { type: "automated", label: "Automated" },
  { type: "end", label: "End" },
];

export default function Sidebar() {
  const onDragStart = (e, nodeType) => {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col h-full p-4 bg-white border-r border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Workflow Nodes</h3>

      <div className="flex flex-col gap-3">
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className="p-3 border rounded-lg cursor-grab hover:bg-gray-50 transition flex flex-col"
          >
            <span className="font-medium text-gray-800">{node.label}</span>
            <span className="text-xs text-gray-500 mt-1">Drag me to canvas</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100 text-sm text-gray-600">
        <h4 className="font-medium text-gray-700 mb-1">Tips</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Drag nodes onto the canvas</li>
          <li>Click a node to edit its details</li>
          <li>Run simulation to test workflow</li>
        </ul>
      </div>
    </div>
  );
}
