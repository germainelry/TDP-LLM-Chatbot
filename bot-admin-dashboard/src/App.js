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
          {/* Add other routes as needed */}
        </Routes>
      </Router>
      {/* <Dashboard /> */}
      {/* <ConversationHistory /> */}
    </div>
  );
}

export default App;
