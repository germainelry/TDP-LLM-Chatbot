import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ConversationHistory from "./components/ConversationHistory";
import Dashboard from "./components/Dashboard";
import Navigation from "./components/Navigation";
import ChatInterface from "./components/ChatInterface";
import Login from "./components/Login";
import UobTmrwAppInterface from "./components/UobTmrwAppInterface";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="dashboard">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route
            path="/Analytics"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/Conversation_history"
            element={
              <PrivateRoute>
                <ConversationHistory />
              </PrivateRoute>
            }
          />
          <Route path="/Chat_Interface" element={<ChatInterface />} />
          <Route path="/TMRW_Interface" element={<UobTmrwAppInterface />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
