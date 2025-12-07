// import React from "react";
// import { WorkflowProvider } from "./context/WorkflowContext";
// import Sidebar from "./components/Sidebar";
// import FlowCanvas from "./components/FlowCanvas";
// import NodeFormPanel from "./components/NodeFormPanel";

// export default function App() {
//   return (
//     <WorkflowProvider>
//       <div className="h-screen flex flex-col bg-gray-50">
//         <header className="h-16 flex items-center px-6 shadow-sm bg-white z-10">
//           <h1 className="text-lg font-semibold">HR Workflow Designer</h1>
//           <div className="ml-auto text-sm text-gray-500">Prototype — React Flow + Tailwind</div>
//         </header>

//         <div className="flex flex-1 overflow-hidden">
//           <aside className="w-72 border-r bg-white p-4">
//             <Sidebar />
//           </aside>

//           <main className="flex-1 relative bg-linear-to-b from-white to-gray-50">
//             <FlowCanvas/>
//           </main>

//           <aside className="w-96 border-l bg-white p-4 overflow-auto">
//             <NodeFormPanel />
//           </aside>
//         </div>
//       </div>
//     </WorkflowProvider>
//   );
// }
import React from "react";
import { WorkflowProvider } from "./context/WorkflowContext";
import Sidebar from "./components/Sidebar";
import FlowCanvas from "./components/FlowCanvas";
import NodeFormPanel from "./components/NodeFormPanel";
import { Toaster } from "sonner";
export default function App() {
  return (
    <WorkflowProvider>
       <Toaster richColors position="top-right" closeButton />
      <div className="h-screen flex flex-col bg-gray-100 text-gray-900">

        {/* Header */}
        <header className="h-16 flex items-center px-5 border-b bg-white">
          <h1 className="text-lg font-semibold">HR Workflow Designer</h1>
          <span className="ml-auto text-xs sm:text-sm text-gray-500">
            Prototype Demo
          </span>
        </header>

        {/* Body Layout */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left Sidebar */}
          <aside className="w-60 sm:w-72 border-r bg-white p-4 overflow-y-auto">
            <Sidebar />
          </aside>

          {/* Main Canvas */}
          <main className="flex-1 overflow-hidden bg-gray-50 relative">
            <FlowCanvas />
          </main>

          {/* Inspector Panel */}
          <aside className="hidden md:block w-80 lg:w-96 border-l bg-white p-4 overflow-y-auto">
            <NodeFormPanel />
          </aside>

        </div>

        {/* Footer (Optional) */}
        <footer className="h-10 flex items-center justify-center text-xs text-gray-500 border-t bg-white">
          © 2025 HR Workflow Tool — Internal Use Only
        </footer>

      </div>
    </WorkflowProvider>
  );
}
