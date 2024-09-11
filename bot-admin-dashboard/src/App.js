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
import { AuthProvider } from "./components/AuthContext";

import ConversationHistory from "./components/ConversationHistory";
import Dashboard from "./components/Dashboard";
import Navigation from "./components/Navigation";
import ChatInterface from "./components/ChatInterface";
import Login from "./components/Login";

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
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
