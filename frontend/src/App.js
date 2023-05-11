import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import ChatPage from "./Pages/ChatPage";
import Testing from "./Pages/testing";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/test" element={<Testing />} />
      </Routes>
    </div>
  );
}

export default App;
