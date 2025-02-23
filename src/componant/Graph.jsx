import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Graphcontext } from "./GraphProvider";

import { useParams } from "react-router-dom";
import { LucideSpline, Plus, Save, Trash } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
const complexityColors = {
  O1: "bg-green-100 border-green-500",
  ON: "bg-yellow-100 border-yellow-500",
  ON2: "bg-orange-100 border-orange-500",
  ONlogN: "bg-blue-100 border-blue-500",
  exponential: "bg-red-100 border-red-500",
};

const connectionTypes = {
  default: {
    style: { stroke: "#666" },
    type: "default",
    animated: false,
    label: "Next Step",
  },
  recursive: {
    style: { stroke: "#ff0072" },
    type: "step",
    animated: true,
    label: "Recursive Call",
  },
  conditional: {
    style: { stroke: "#00ff72" },
    type: "smoothstep",
    animated: false,
    label: "Conditional",
  },
  loop: {
    style: { stroke: "#0072ff" },
    type: "smoothstep",
    animated: true,
    label: "Loop",
  },
};

const CustomNode = ({ data, isConnectable }) => {
  return (
    <div
      className={`px-4 py-2 shadow-lg rounded-md text-black bg-white border-2 ${data.complexityClass} min-w-[200px] relative`}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={true}
        className="w-3 h-3 bg-blue-500"
      />
      <div className="font-bold">{data.label}</div>
      {data.stepNumber && (
        <div className="absolute -left-3 -top-3 bg-blue-500  rounded-full w-6 h-6 flex items-center justify-center text-sm">
          {data.stepNumber}
        </div>
      )}
      {data.description && (
        <div className="text-gray-600 text-sm mt-1">{data.description}</div>
      )}
      {data.complexity && (
        <div className="text-xs mt-1 font-mono">Time: {data.complexity}</div>
      )}
      {data.space && (
        <div className="text-xs font-mono">Space: {data.space}</div>
      )}
      {data.code && (
        <pre className="bg-gray-50 p-2 rounded mt-2 text-xs overflow-x-auto">
          {data.code}
        </pre>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={true}
        className="w-3 h-3 bg-blue-500"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={true}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectable={true}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function Graph({ InEdge, InNode }) {
  const { id } = useParams();

  const { Graphdata, setGraphdata, Edgedata, setEdgedata } =
    useContext(Graphcontext);

  const [nodes, setNodes, onNodesChange] = useNodesState(InNode);
  const [edges, setEdges, onEdgesChange] = useEdgesState(InEdge);
  const [selectedConnection, setSelectedConnection] = useState("default");

  const [nodeData, setNodeData] = useState({
    label: "",
    description: "",
    complexity: "",
    space: "",
    code: "",
    stepNumber: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [showConnectionMenu, setShowConnectionMenu] = useState(false);

  const getComplexityClass = (complexity) => {
    if (complexity.includes("O(1)")) return complexityColors.O1;
    if (complexity.includes("O(n)")) return complexityColors.ON;
    if (complexity.includes("O(n²)")) return complexityColors.ON2;
    if (complexity.includes("O(n log n)")) return complexityColors.ONlogN;
    if (complexity.includes("O(2^n)")) return complexityColors.exponential;
    return "border-gray-200";
  };

  const send_notes = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/problem/update/${id}`,
        {
          edge: JSON.stringify(edges),
          node: JSON.stringify(nodes),
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onConnect = useCallback(
    (params) => {
      const connection = connectionTypes[selectedConnection];
      const newEdge = {
        ...params,
        ...connection,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: connection.style.stroke,
        },
        label: connection.label,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [selectedConnection, setEdges]
  );

  const addNode = useCallback(() => {
    if (!nodeData.label) return;

    const complexityClass = getComplexityClass(nodeData.complexity);
    const newNode = {
      id: `${Date.now()}`,
      type: "custom",
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {
        ...nodeData,
        complexityClass,
      },
    };

    setNodes((nds) => [...nds, newNode]);

    setNodeData({
      label: "",
      description: "",
      complexity: "",
      space: "",
      code: "",
      stepNumber: "",
    });
    setShowForm(false);
  }, [nodeData, setNodes]);

  const deleteSelectedNodes = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !edge.selected &&
          nodes.some((node) => node.id === edge.source && !node.selected) &&
          nodes.some((node) => node.id === edge.target && !node.selected)
      )
    );
    localStorage.setItem("graph", Graphdata);
    localStorage.setItem("edge", Edgedata);
  }, [nodes, setNodes, setEdges]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNodeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />

        <Panel
          position="top-left"
          className="bg-white p-4 rounded-lg shadow-lg"
        >
          <div className="space-y-4">
            {!showForm && !showConnectionMenu && (
              <>
                <div className="flex flex-col gap-2 justify-center items-center   space-x-1">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white w-fir px-2 py-2 rounded hover:bg-blue-600"
                  >
                    <Plus />
                  </button>
                  <button
                    onClick={() => setShowConnectionMenu(true)}
                    className="bg-green-500 text-white px-2 w-fir py-2 rounded hover:bg-green-600"
                  >
                    <LucideSpline />
                  </button>
                  <button
                    onClick={deleteSelectedNodes}
                    className="bg-red-500 text-white  py-2 px-2 w-fit rounded hover:bg-red-600"
                  >
                    <Trash />
                  </button>
                  <button
                    className="bg-gray-500 w-fit  text-white flex items-center justify-center py-2 px-2 rounded hover:bg-gray-600"
                    onClick={() => {
                      setGraphdata(nodes);
                      localStorage.setItem("graph", JSON.stringify(nodes));

                      setEdgedata(edges);
                      localStorage.setItem("edge", JSON.stringify(edges));

                      send_notes();
                    }}
                  >
                    <Save className="" />
                  </button>
                </div>
              </>
            )}

            {showConnectionMenu && (
              <div className="space-y-4 text-black">
                <h3 className="font-bold">Select Connection Type</h3>
                <div className="space-y-2">
                  {Object.entries(connectionTypes).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedConnection(key);
                        setShowConnectionMenu(false);
                      }}
                      className={`w-full p-2 text-left rounded border ${
                        selectedConnection === key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-0.5"
                          style={{ backgroundColor: value.style.stroke }}
                        />
                        <span>{value.label}</span>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setShowConnectionMenu(false)}
                    className="w-full p-2 bg-gray-500 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {showForm && (
              <div className="space-y-4 max-w-md">
                <div className="space-y-2 text-black">
                  <input
                    type="text"
                    name="label"
                    value={nodeData.label}
                    onChange={handleInputChange}
                    placeholder="Step Title"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="stepNumber"
                    value={nodeData.stepNumber}
                    onChange={handleInputChange}
                    placeholder="Step Number (e.g., 1, 2, 3)"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    value={nodeData.description}
                    onChange={handleInputChange}
                    placeholder="Step Description"
                    className="w-full p-2 border rounded h-20"
                  />
                  <input
                    type="text"
                    name="complexity"
                    value={nodeData.complexity}
                    onChange={handleInputChange}
                    placeholder="Time Complexity (e.g., O(n))"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="space"
                    value={nodeData.space}
                    onChange={handleInputChange}
                    placeholder="Space Complexity (e.g., O(1))"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="code"
                    value={nodeData.code}
                    onChange={handleInputChange}
                    placeholder="Code Snippet (optional)"
                    className="w-full p-2 border rounded font-mono h-32"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={addNode}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Step
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
