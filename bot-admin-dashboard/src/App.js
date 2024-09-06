import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  Outlet,
} from "react-router-dom";

import ConversationHistory from "./components/ConversationHistory";
import Dashboard from "./components/Dashboard";
import Navigation from "./components/Navigation";
import ChatInterface from "./components/ChatInterface";

function App() {
  return (
    <div className="dashboard">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" exact element={<Dashboard />} />
          <Route
            path="/Conversation_history"
            element={<ConversationHistory />}
          />
          <Route path="/Chat_Interface" element={<ChatInterface />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
