// import { useEffect, useState } from "react";
// import { useWorkflow } from "../context/WorkflowContext";
// import { fetchAutomations } from "../api/mockApi";
// import { toast } from "sonner";

// export default function NodeFormPanel() {
//   const {
//     selected,
//     setSelected,
//     updateNodeData,
//     removeNode,
//     importFlow,
//     serialize,
//   } = useWorkflow();

//   const [local, setLocal] = useState(null);
//   const [initial, setInitial] = useState(null);
//   const [automations, setAutomations] = useState([]);
//   const [simOutput, setSimOutput] = useState(null);
//   const [importText, setImportText] = useState("");

//   // Fetch mock automation list
//   useEffect(() => {
//     fetchAutomations().then(setAutomations);
//   }, []);

//   // Detect selected node change
//   useEffect(() => {
//     if (!selected) {
//       setLocal(null);
//       setInitial(null);
//       return;
//     }

//     const clone = structuredClone(selected);
//     setLocal(clone);
//     setInitial(clone);
//   }, [selected]);

//   // Simulation listener
//   useEffect(() => {
//     const handler = (e) => setSimOutput(e.detail || null);
//     window.addEventListener("workflow:simulate", handler);
//     return () => window.removeEventListener("workflow:simulate", handler);
//   }, []);

//   // ---------- EARLY UI RETURN ----------
//   if (!local) {
//     return (
//       <div>
//         <h3 className="font-semibold">Inspector</h3>
//         <p className="text-sm text-gray-500 mt-2">
//           Select a workflow node to edit settings.
//         </p>

//         <textarea
//           placeholder="Paste workflow JSON to import..."
//           className="w-full p-3 mt-4 border rounded h-32 text-sm"
//           value={importText}
//           onChange={(e) => setImportText(e.target.value)}
//         />

//         <button
//           onClick={() => {
//             try {
//               const parsed = JSON.parse(importText);
//               importFlow(parsed);
//               toast.success("Workflow imported");
//             } catch {
//               toast.error("Invalid JSON format");
//             }
//           }}
//           className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
//         >
//           Import
//         </button>

//         <h4 className="font-medium mt-5">Simulation Output</h4>
//         <div className="mt-2 p-3 border bg-gray-50 rounded h-60 overflow-auto text-sm">
//           {simOutput
//             ? simOutput.log?.map((l, i) => <div key={i}>{l}</div>)
//             : "No simulation run"}
//         </div>
//       </div>
//     );
//   }

//   const type = local?.meta?.type;
//   const isChanged = JSON.stringify(local.data) !== JSON.stringify(initial.data);

//   // ---------- Save Form ----------
//   const saveChanges = () => {
//     if (!local.data.label?.trim()) return toast.error("Title is required.");

//     if (type === "task") {
//       if (!local.data.assignee?.trim())
//         return toast.error("Assignee required.");
//       if (!local.data.deadline) return toast.error("Deadline is required.");
//     }

//     if (type === "automated" && !local.data.actionId) {
//       return toast.error("Please select an automation action.");
//     }

//     updateNodeData(local.id, local.data);
//     setInitial(structuredClone(local));
//     toast.success("Node updated");
//   };

//   // ---------- Reset ----------
//   const resetForm = () => {
//     setLocal(structuredClone(initial));
//     toast.success("Reset done");
//   };

//   // ---------- Delete ----------
//   const deleteNode = () => {
//     removeNode(local.id);
//     setLocal(null);
//     setSelected(null);
//     toast.error("Node removed");
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="font-semibold capitalize">{type} Node</h3>
//         <button
//           className="text-red-600 hover:underline text-sm"
//           onClick={deleteNode}
//         >
//           Delete
//         </button>
//       </div>

//       {/* Common Title */}
//       <label className="text-sm">Title</label>
//       <input
//         className="w-full p-2 border rounded mb-3"
//         value={local.data.label || ""}
//         onChange={(e) =>
//           setLocal({ ...local, data: { ...local.data, label: e.target.value } })
//         }
//       />

//       {/* Conditional Fields */}
//       {type === "task" && (
//         <>
//           <label className="text-sm">Assignee</label>
//           <input
//             className="w-full p-2 border rounded mb-3"
//             value={local.data.assignee || ""}
//             onChange={(e) =>
//               setLocal({
//                 ...local,
//                 data: { ...local.data, assignee: e.target.value },
//               })
//             }
//           />

//           <label className="text-sm">Deadline</label>
//           <input
//             type="date"
//             className="w-full p-2 border rounded"
//             value={local.data.deadline || ""}
//             onChange={(e) =>
//               setLocal({
//                 ...local,
//                 data: { ...local.data, deadline: e.target.value },
//               })
//             }
//           />
//         </>
//       )}

//       {type === "automated" && (
//         <>
//           <label className="text-sm">Automation Action</label>
//           <select
//             className="w-full p-2 border rounded"
//             value={local.data.actionId || ""}
//             onChange={(e) =>
//               setLocal({
//                 ...local,
//                 data: { ...local.data, actionId: e.target.value },
//               })
//             }
//           >
//             <option value="">Select...</option>
//             {automations.map((a) => (
//               <option key={a.id} value={a.id}>
//                 {a.label}
//               </option>
//             ))}
//           </select>
//         </>
//       )}

//       {/* BUTTON BAR */}
//       <div className="mt-6 flex gap-2">
//         <button
//           disabled={!isChanged}
//           onClick={saveChanges}
//           className={`px-3 py-2 rounded text-white ${
//             isChanged
//               ? "bg-blue-600 hover:bg-blue-700"
//               : "bg-gray-400 cursor-not-allowed"
//           }`}
//         >
//           Save
//         </button>

//         <button
//           disabled={!isChanged}
//           onClick={resetForm}
//           className={`px-3 py-2 rounded ${
//             isChanged
//               ? "bg-gray-200 hover:bg-gray-300"
//               : "bg-gray-100 cursor-not-allowed"
//           }`}
//         >
//           Reset
//         </button>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useWorkflow } from "../context/WorkflowContext";
import { fetchAutomations } from "../api/mockApi";
import { toast } from "sonner";

export default function NodeFormPanel() {
  const {
    selected,
    setSelected,
    updateNodeData,
    removeNode,
    importFlow,
    serialize,
  } = useWorkflow();

  const [local, setLocal] = useState(null);
  const [initial, setInitial] = useState(null);
  const [automations, setAutomations] = useState([]);
  const [simOutput, setSimOutput] = useState(null);
  const [importText, setImportText] = useState("");

  // Fetch mock automation list
  useEffect(() => {
    fetchAutomations().then(setAutomations);
  }, []);

  // Detect selected node change
  useEffect(() => {
    if (!selected) {
      setLocal(null);
      setInitial(null);
      return;
    }

    const clone = structuredClone(selected);
    setLocal(clone);
    setInitial(clone);
  }, [selected]);

  // Simulation listener
  useEffect(() => {
    const handler = (e) => setSimOutput(e.detail || null);
    window.addEventListener("workflow:simulate", handler);
    return () => window.removeEventListener("workflow:simulate", handler);
  }, []);

  // ---------- EARLY UI (No Node Selected) ----------
  if (!local) {
    return (
      <div>
        <h3 className="font-semibold">Inspector</h3>
        <p className="text-sm text-gray-500 mt-2">
          Select a workflow node to edit settings.
        </p>

        <textarea
          placeholder="Paste workflow JSON to import..."
          className="w-full p-3 mt-4 border rounded h-32 text-sm"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />

        <button
          onClick={() => {
            try {
              const parsed = JSON.parse(importText);
              importFlow(parsed);
              toast.success("Workflow imported");
            } catch {
              toast.error("Invalid JSON format");
            }
          }}
          className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
        >
          Import
        </button>

        <h4 className="font-medium mt-5">Simulation Output</h4>
        <div className="mt-2 p-3 border bg-gray-50 rounded h-60 overflow-auto text-sm">
          {simOutput
            ? simOutput.log?.map((l, i) => <div key={i}>{l}</div>)
            : "No simulation run"}
        </div>
      </div>
    );
  }

  const type = local?.meta?.type;
  const isChanged = JSON.stringify(local.data) !== JSON.stringify(initial.data);

  // ---------- Save Form ----------
  const saveChanges = () => {
    if (!local.data.label?.trim())
      return toast.error("Title is required.");

    if (type === "task") {
      if (!local.data.assignee?.trim())
        return toast.error("Assignee required.");
      if (!local.data.deadline)
        return toast.error("Deadline is required.");
    }

    if (type === "automated" && !local.data.actionId) {
      return toast.error("Please select an automation action.");
    }

    updateNodeData(local.id, local.data);
    setInitial(structuredClone(local));
    toast.success("Node updated");
  };

  // ---------- Reset ----------
  const resetForm = () => {
    setLocal(structuredClone(initial));
    toast.success("Reset done");
  };

  // ---------- Fixed Delete (No Double Toast) ----------
  const deleteNode = () => {
    if (!local?.id) return;

    const deletedLabel = local?.data?.label || "Node";

    removeNode(local.id);
    setLocal(null);
    setSelected(null);

    toast.error(`"${deletedLabel}" deleted`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold capitalize">{type} Node</h3>

        <button
          className="text-red-600 hover:text-red-800 text-sm font-medium"
          onClick={deleteNode}
        >
          Delete
        </button>
      </div>

      {/* Common Title */}
      <label className="text-sm font-medium">Title</label>
      <input
        className="w-full p-2 border rounded mb-3"
        value={local.data.label || ""}
        onChange={(e) =>
          setLocal({ ...local, data: { ...local.data, label: e.target.value } })
        }
      />

      {/* Task Config */}
      {type === "task" && (
        <>
          <label className="text-sm font-medium">Assignee</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={local.data.assignee || ""}
            onChange={(e) =>
              setLocal({
                ...local,
                data: { ...local.data, assignee: e.target.value },
              })
            }
          />

          <label className="text-sm font-medium">Deadline</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={local.data.deadline || ""}
            onChange={(e) =>
              setLocal({
                ...local,
                data: { ...local.data, deadline: e.target.value },
              })
            }
          />
        </>
      )}

      {/* Automated Config */}
      {type === "automated" && (
        <>
          <label className="text-sm font-medium">Automation Action</label>
          <select
            className="w-full p-2 border rounded"
            value={local.data.actionId || ""}
            onChange={(e) =>
              setLocal({
                ...local,
                data: { ...local.data, actionId: e.target.value },
              })
            }
          >
            <option value="">Select...</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </>
      )}

      {/* BUTTON BAR */}
      <div className="mt-6 flex gap-2">
        <button
          disabled={!isChanged}
          onClick={saveChanges}
          className={`px-3 py-2 rounded text-white ${
            isChanged
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Save
        </button>

        <button
          disabled={!isChanged}
          onClick={resetForm}
          className={`px-3 py-2 rounded ${
            isChanged
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 cursor-not-allowed"
          }`}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
