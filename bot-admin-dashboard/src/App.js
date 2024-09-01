import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import ConversationHistory from "./components/ConversationHistory";
import Dashboard from "./components/Dashboard";
import WordCloudDisplay from "./components/WordCloudDisplay";

function App() {
  return (
    <div className="dashboard">
      <h1 className="main-header">
        LLM Bot Admin Dashboard
        <i className="bi bi-telegram"></i>
        <i className="bi bi-robot"></i>
      </h1>
      <Dashboard />
      {/* <WordCloudDisplay /> */}
      <ConversationHistory />
    </div>
  );
}

export default App;
