import ReactDOM from "react-dom/client";

import "./index.css";

import UsrProvider from "./componant/UsrProvider.jsx";

import Nav from "./componant/Nav.jsx";
import Dashboard from "./componant/Dashboard.jsx";
import Rout from "./componant/Rout.jsx";
import CodeEditor from "./componant/CodeEditor.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <UsrProvider>
      <Rout />
    </UsrProvider>
  </>
);
