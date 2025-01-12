import React, { createContext, useEffect, useState } from "react";

export const Graphcontext = createContext();

export default function GraphProvider({ children }) {
  const [Graphdata, setGraphdata] = useState([]);
  const [Edgedata, setEdgedata] = useState(() => {
    const storededge = localStorage.getItem("edge");
    return storededge ? JSON.parse(storededge) : [];
  });

  return (
    <Graphcontext.Provider
      value={{ Graphdata, setGraphdata, Edgedata, setEdgedata }}
    >
      {children}
    </Graphcontext.Provider>
  );
}
