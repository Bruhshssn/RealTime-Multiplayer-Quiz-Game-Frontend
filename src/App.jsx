import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RoomCreaction from "./pages/RoomCreation";
import GameRoom from "./pages/GameRoom";
import QuizGame from "./pages/QuizGame";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create_room" element={<RoomCreaction />} />
        <Route path="/game_room/:roomId" element={<GameRoom />} />
        <Route path="/quiz/:roomId" element={<QuizGame />} />
        <Route path="/leaderboard/:roomId" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;