import ConversationHistory from "./components/ConversationHistory";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

function App() {
  return (
    <div className="dashboard">
      <h1 className="main-header">LLM Bot Admin Dashboard</h1>
      <Dashboard />
      <ConversationHistory />
    </div>
  );
}

export default App;
