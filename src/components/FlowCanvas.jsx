// import React, { useCallback, useRef, useEffect } from "react";
// import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from "reactflow";

// import { useWorkflow } from "../context/WorkflowContext";
// import { simulateWorkflow } from "../api/mockApi";

// export default function FlowCanvas() {
//   const {
//     nodes,
//     edges,
//     onNodesChange,
//     onEdgesChange,
//     setNodes,
//     setEdges,
//     addNode,
//     connectEdge,
//     setSelected,
//     serialize,
//   } = useWorkflow();

//   const wrapperRef = useRef(null);
//   const { fitView } = useReactFlow?.() || {}; // optional

//   // drag/drop handlers
//   const onDrop = useCallback(
//     (event) => {
//       event.preventDefault();
//       const type = event.dataTransfer.getData("application/reactflow");
//       if (!type) return;
//       const bounds = wrapperRef.current.getBoundingClientRect();
//       const position = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
//       addNode({ type, position });
//     },
//     [addNode]
//   );

//   const onDragOver = useCallback((e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   }, []);

//   // clicking nodes/edges => select
//   function onElementClick(evt, element) {
//     setSelected(element);
//   }

//   // simulation trigger
//   async function runSimulation() {
//     const payload = serialize();
//     const res = await simulateWorkflow(payload);
//     // broadcast a custom event with simulation result so NodeFormPanel can show
//     window.dispatchEvent(new CustomEvent("workflow:simulate", { detail: res }));
//   }

//   // optional: highlight missing start
//   useEffect(() => {
//     const hasStart = nodes.some((n) => n.meta?.nodeType === "start");
//     // we can show visual hint - keep as simple alert for now
//     if (!hasStart && nodes.length > 0) {
//       // small non-intrusive console message; UI shows in panel too
//       console.info("No start node in workflow. Add a Start node.");
//     }
//   }, [nodes]);

//   return (
//     <div className="canvas-area relative" ref={wrapperRef}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={(params) => connectEdge(params)}
//         onDrop={onDrop}
//         onDragOver={onDragOver}
//         onElementClick={onElementClick}
//         fitView
//         style={{ width: "100%", height: "100%" }}
//       >
//         <Background gap={16} color="#f3f4f6" />
//         <Controls />
//         <MiniMap />
//       </ReactFlow>

//       <div className="absolute bottom-4 left-4 flex gap-2">
//         <button
//           className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:opacity-95"
//           onClick={runSimulation}
//         >
//           Run Simulation
//         </button>

//         <button
//           className="px-4 py-2 bg-white border rounded shadow text-gray-700"
//           onClick={() => {
//             const json = JSON.stringify(serialize(), null, 2);
//             navigator.clipboard.writeText(json);
//             alert("Workflow JSON copied to clipboard");
//           }}
//         >
//           Export JSON
//         </button>
//       </div>
//     </div>
//   );
// }
// import React, { useCallback, useRef, useEffect, useState } from "react";
// import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
// import "reactflow/dist/style.css";

// import { useWorkflow } from "../context/WorkflowContext";
// import { simulateWorkflow } from "../api/mockApi";

// export default function FlowCanvas() {
//   const {
//     nodes,
//     edges,
//     onNodesChange,
//     onEdgesChange,
//     addNode,
//     setSelected,
//     serialize,
//     connectEdge,
//   } = useWorkflow();

//   const wrapperRef = useRef(null);
//   const [reactFlowInstance, setReactFlowInstance] = useState(null); // ✅ store instance safely

//   // ------------------ Drag & Drop Node Logic ------------------
//   const onDrop = useCallback(
//     (event) => {
//       event.preventDefault();

//       const type = event.dataTransfer.getData("application/reactflow");
//       if (!type || !reactFlowInstance) return;

//       const bounds = wrapperRef.current.getBoundingClientRect();
//       const position = reactFlowInstance.project({
//         x: event.clientX - bounds.left,
//         y: event.clientY - bounds.top,
//       });

//       addNode({ type, position });
//     },
//     [addNode, reactFlowInstance]
//   );

//   const onDragOver = useCallback((event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = "move";
//   }, []);

//   // ------------------ Selection Logic ------------------
//   const onNodeClick = (_, node) => setSelected(node);
//   const onEdgeClick = (_, edge) => setSelected(edge);

//   // ------------------ Simulation ------------------
//   const runSimulation = useCallback(async () => {
//     const payload = serialize();
//     const result = await simulateWorkflow(payload);

//     // Dispatch event to trigger UI updates in NodeFormPanel or elsewhere
//     window.dispatchEvent(
//       new CustomEvent("workflow:simulate", { detail: result })
//     );
//   }, [serialize]);

//   // ------------------ Validation (Start Node Required) ------------------
//   useEffect(() => {
//     const hasStart = nodes.some((n) => n.meta?.nodeType === "start");
//     if (!hasStart && nodes.length > 0) {
//       console.warn("⚠️ Workflow missing a Start node.");
//     }
//   }, [nodes]);

//   return (
//     <div className="relative h-full w-full" ref={wrapperRef}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={connectEdge}
//         onDrop={onDrop}
//         onDragOver={onDragOver}
//         onNodeClick={onNodeClick}
//         onEdgeClick={onEdgeClick}
//         onInit={setReactFlowInstance} // ✅ safe initialization
//         fitView
//         className="border rounded-lg bg-gray-50 shadow-sm"
//         style={{ height: "100%" }}
//       >
//         <Background gap={18} color="#d9d9d9" />
//         <Controls />
//         <MiniMap zoomable pannable />
//       </ReactFlow>

//       {/* ------------------ Action Buttons ------------------ */}
//       <div className="absolute bottom-4 left-4 flex gap-3">
//         <button
//           className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:shadow-lg hover:scale-105 transition"
//           onClick={runSimulation}
//         >
//           ▶ Run Simulation
//         </button>

//         <button
//           className="px-4 py-2 bg-white border rounded shadow hover:bg-gray-100 transition"
//           onClick={() => {
//             navigator.clipboard.writeText(JSON.stringify(serialize(), null, 2));
//             alert("Workflow JSON copied!");
//           }}
//         >
//           📄 Export JSON
//         </button>
//       </div>
//     </div>
//   );
// }
// import { useCallback, useRef, useState, useEffect } from "react";
// import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
// import "reactflow/dist/style.css";

// import { useWorkflow } from "../context/WorkflowContext";
// import { simulateWorkflow } from "../api/mockApi";

// export default function FlowCanvas() {
//   const {
//     nodes,
//     edges,
//     onNodesChange,
//     onEdgesChange,
//     addNode,
//     setSelected,
//     serialize,
//     connectEdge,
//   } = useWorkflow();

//   const wrapperRef = useRef(null);
//   const [instance, setInstance] = useState(null);

//   // Allow drag + drop nodes from sidebar into canvas
//   const handleDrop = useCallback(
//     (e) => {
//       e.preventDefault();
//       const type = e.dataTransfer.getData("application/reactflow");
//       if (!type || !instance) return;

//       const bounds = wrapperRef.current.getBoundingClientRect();

//       const pos = instance.project({
//         x: e.clientX - bounds.left,
//         y: e.clientY - bounds.top,
//       });

//       addNode({ type, position: pos });
//     },
//     [instance, addNode]
//   );

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   };

//   // Store selected node/edge for right-side editor
//   const handleNodeClick = (_, node) => setSelected(node);
//   const handleEdgeClick = (_, edge) => setSelected(edge);

//   // Run mock workflow simulation
//   const handleRunSimulation = async () => {
//     const data = serialize();
//     const result = await simulateWorkflow(data);

//     window.dispatchEvent(
//       new CustomEvent("workflow:simulate", { detail: result })
//     );
//   };

//   // Warn if workflow missing "Start Node"
//   useEffect(() => {
//     const missingStart = !nodes.some((n) => n.meta?.nodeType === "start");

//     if (missingStart && nodes.length > 0) {
//       console.warn("Workflow should include a Start node.");
//     }
//   }, [nodes]);

//   return (
//     <div ref={wrapperRef} className="relative h-full w-full overflow-hidden">

//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={connectEdge}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onNodeClick={handleNodeClick}
//         onEdgeClick={handleEdgeClick}
//         onInit={setInstance}
//         fitView
//         className="bg-gray-100 border rounded-lg"
//       >
//         <Background gap={16} />
//         <Controls />
//         <MiniMap pannable zoomable />
//       </ReactFlow>

//       {/* Bottom Action Bar */}
//       <div className="absolute bottom-4 left-4 flex gap-3">

//         <button
//           className="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 transition"
//           onClick={handleRunSimulation}
//         >
//           Run Simulation
//         </button>

//         <button
//           className="px-4 py-2 border rounded bg-white hover:bg-gray-100 transition"
//           onClick={() => {
//             navigator.clipboard.writeText(
//               JSON.stringify(serialize(), null, 2)
//             );
//             alert("Workflow JSON copied.");
//           }}
//         >
//           Export JSON
//         </button>

//       </div>
//     </div>
//   );
// }
import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

import { useWorkflow } from "../context/WorkflowContext";
import { simulateWorkflow } from "../api/mockApi";

export default function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    setSelected,
    serialize,
    connectEdge,
  } = useWorkflow();

  const wrapperRef = useRef(null);
  const [instance, setInstance] = useState(null);

  // Drag + Drop support
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow");
      if (!type || !instance) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = instance.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      addNode({ type, position });
    },
    [instance, addNode]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleNodeClick = (_, node) => setSelected(node);
  const handleEdgeClick = (_, edge) => setSelected(edge);

  // Workflow Simulation + Toast
  const handleRunSimulation = async () => {
    const data = serialize();
    const result = await simulateWorkflow(data);

    window.dispatchEvent(
      new CustomEvent("workflow:simulate", { detail: result })
    );

    showToast("Simulation executed successfully.");
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-md shadow-lg text-sm animate-fade";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 2000);
  };

  // Warn missing start node (console for now)
  useEffect(() => {
    const missingStart = !nodes.some((node) => node.meta?.nodeType === "start");
    if (missingStart && nodes.length > 0) {
      console.warn("Workflow must include a Start node.");
    }
  }, [nodes]);

  return (
    <div ref={wrapperRef} className="relative h-full w-full overflow-hidden">

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={connectEdge}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onInit={setInstance}
        fitView
        className="bg-gray-50 border rounded-lg shadow-sm"
      >
        <Background gap={14} color="#d1d5db" />
        <Controls />
        <MiniMap maskColor="#f1f5f9" />
      </ReactFlow>

      {/* Action Bar */}
      <div className="absolute bottom-4 left-4 flex gap-3 flex-wrap">

        <button
          onClick={handleRunSimulation}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition"
        >
          Run Simulation
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(serialize(), null, 2));
            showToast("Workflow JSON copied.");
          }}
          className="px-4 py-2 rounded-lg text-sm border bg-white hover:bg-gray-100 transition"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}
