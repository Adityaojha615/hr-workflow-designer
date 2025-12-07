
// import React, { createContext, useContext, useMemo, useState } from "react";
// import { useNodesState, useEdgesState, addEdge } from "reactflow";

// const WorkflowContext = createContext(null);

// export function WorkflowProvider({ children }) {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [selected, setSelected] = useState(null);

//   // Default details for each workflow node type
//   const defaultNodeData = (type) => {
//     const base = { label: type.charAt(0).toUpperCase() + type.slice(1) };

//     switch (type) {
//       case "start":
//         return { ...base, info: "Workflow starts here" };
//       case "task":
//         return {
//           ...base,
//           assignee: "",
//           description: "",
//           deadline: "",
//           status: "pending",
//         };
//       case "approval":
//         return { ...base, approver: "", level: 1 };
//       case "automated":
//         return { ...base, script: "", trigger: "" };
//       case "end":
//         return { ...base, info: "Workflow completed" };
//       default:
//         return base;
//     }
//   };

//   // Add Node Handler
//   const addNode = ({ type, position }) => {
//     const id = `${type}_${Date.now()}`;
//     const newNode = {
//       id,
//       type,
//       position,
//       data: defaultNodeData(type),
//       meta: { nodeType: type },
//     };

//     setNodes((prev) => [...prev, newNode]);
//     return newNode;
//   };

//   const updateNodeData = (id, updatedData) => {
//     setNodes((prev) =>
//       prev.map((node) =>
//         node.id === id ? { ...node, data: { ...node.data, ...updatedData } } : node
//       )
//     );
//   };

//   const removeNode = (id) => {
//     setNodes((prev) => prev.filter((n) => n.id !== id));
//     setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
//     setSelected(null);
//   };

//   // Connection Handler
//   const connectEdge = (params) => {
//     setEdges((prev) => addEdge({ ...params, animated: true }, prev));
//   };

//   const removeEdge = (id) => {
//     setEdges((prev) => prev.filter((e) => e.id !== id));
//   };

//   // Export/Import Workflow
//   const serialize = () => ({ nodes, edges });
//   const importFlow = ({ nodes: nextNodes, edges: nextEdges }) => {
//     setNodes(nextNodes || []);
//     setEdges(nextEdges || []);
//     setSelected(null);
//   };

//   // Exposed context values
//   const value = useMemo(
//     () => ({
//       nodes,
//       edges,
//       selected,
//       setSelected,
//       onNodesChange,
//       onEdgesChange,
//       addNode,
//       updateNodeData,
//       removeNode,
//       connectEdge,
//       removeEdge,
//       serialize,
//       importFlow,
//     }),
//     [nodes, edges, selected]
//   );

//   return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
// }

// export function useWorkflow() {
//   const context = useContext(WorkflowContext);
//   if (!context) throw new Error("useWorkflow must be used within WorkflowProvider");
//   return context;
// }
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNodesState, useEdgesState, addEdge } from "reactflow";
import { toast } from "sonner";

const WorkflowContext = createContext(null);

export function WorkflowProvider({ children }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selected, setSelected] = useState(null);

  // Default Node Schema (Human readable & scalable)
  const defaultNodeData = (type) => {
    const label = `${type[0].toUpperCase()}${type.slice(1)}`;

    const templates = {
      start: { label, info: "Workflow begins" },
      task: { label, assignee: "", description: "", deadline: "", status: "pending" },
      approval: { label, approver: "", level: 1 },
      automated: { label, script: "", trigger: "" },
      end: { label, info: "Workflow completed" },
    };

    return templates[type] || { label };
  };

  //  Add Node 
    const addNode = ({ type, position }) => {
    const id = `${type}_${Date.now()}`;
    const newNode = { id, type, position, data: defaultNodeData(type), meta: { type } };

    setNodes((prev) => [...prev, newNode]);
    toast.success(`${type.toUpperCase()} node added`);
    return newNode;
  };

  //  Update Node
  const updateNodeData = (id, updatedData) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...updatedData } } : node))
    );
  };

  //  Delete Node
  const removeNode = (id) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setEdges((prev) => prev.filter((edge) => edge.source !== id && edge.target !== id));

    setSelected(null);
    // toast.error("Node removed");
  };

  //  Drag Edge Connect
  const connectEdge = (params) => {
    setEdges((prev) => addEdge({ ...params, animated: true }, prev));
  };

  //  Remove Edge
  const removeEdge = (id) => {
    setEdges((prev) => prev.filter((edge) => edge.id !== id));
  };

  //  Export JSON
  const serialize = () => ({ nodes, edges });

  //  Load JSON
  const importFlow = ({ nodes: n, edges: e }) => {
    setNodes(n || []);
    setEdges(e || []);
    setSelected(null);
    toast.success("Workflow Imported");
  };

  // ⌨ Delete key support
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Delete" && selected) removeNode(selected);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected]);

  // Value exposed
  const value = useMemo(
    () => ({
      nodes,
      edges,
      selected,
      setSelected,
      onNodesChange,
      onEdgesChange,
      addNode,
      updateNodeData,
      removeNode,
      connectEdge,
      removeEdge,
      serialize,
      importFlow,
    }),
    [nodes, edges, selected]
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) throw new Error("useWorkflow must be used inside WorkflowProvider");
  return context;
}
