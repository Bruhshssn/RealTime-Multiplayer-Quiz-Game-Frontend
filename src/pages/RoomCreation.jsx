import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowLeft, LogIn, Plus } from "lucide-react";

export default function RoomCreation() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // CREATE ROOM
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [loadingCreate, setLoadingCreate] = useState(false);

  // JOIN ROOM
  const [roomIdInput, setRoomIdInput] = useState("");
  const [loadingJoin, setLoadingJoin] = useState(false);

  const playerOptions = [5, 10, 20, 50, 100];

  // ================= CREATE ROOM =================
  const createRoom = async () => {
    // Validation: Prevent 0, empty string, or negative numbers
    const finalMaxPlayers = Number(maxPlayers);
    if (!finalMaxPlayers || finalMaxPlayers < 1) {
      alert("Please enter a valid number of players (at least 1).");
      return;
    }

    try {
      setLoadingCreate(true);

      const response = await fetch(
        "http://localhost:9000/api/rooms/createRoom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ maxPlayers: finalMaxPlayers }),
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create room");
      }

      // mark as host
      localStorage.setItem("isHost", "true");

      navigate(`/game_room/${data.roomId}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoadingCreate(false);
    }
  };

  // ================= JOIN ROOM =================
  const joinRoom = async () => {
    try {
      if (!roomIdInput.trim()) {
        alert("Enter Room ID");
        return;
      }

      setLoadingJoin(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:9000/api/rooms/${roomIdInput}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to join room");
      }

      localStorage.setItem("isHost", "false");

      navigate(`/game_room/${roomIdInput}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoadingJoin(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 flex items-center justify-center px-6 py-12">
      {/* Container - Light gray panel with border */}
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Title */}
        <div className="text-center mb-10">
          <Users className="mx-auto mb-3 h-12 w-12 text-blue-600" />
          <h1 className="text-black text-3xl font-extrabold tracking-tight">Quiz Lobby</h1>
          <p className="text-slate-500 mt-2 font-medium">
            Create a new room or join an existing one
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* ================= CREATE ROOM ================= */}
          <div className="bg-slate-100/70 p-6 rounded-2xl border border-black">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">Create Room</h2>
            </div>

            <p className="text-sm text-slate-500 mb-4 font-medium">
              Select max players
            </p>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {playerOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setMaxPlayers(count)}
                  className={`rounded-lg py-2 text-sm font-bold transition ${
                    maxPlayers === Number(count)
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
                      : "bg-white border border-black text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={maxPlayers}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d+$/.test(val)) {
                  setMaxPlayers(val);
                }
              }}
              placeholder="Enter number of max players..."
              className="w-full mb-4 px-4 py-3 rounded-xl bg-white border border-black text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />

            <button
              onClick={createRoom}
              disabled={loadingCreate}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 shadow-lg shadow-blue-600/15"
            >
              {loadingCreate ? "Creating..." : "Create Room"}
            </button>
          </div>

          {/* ================= JOIN ROOM ================= */}
          <div className="bg-slate-100/70 p-6 rounded-2xl border border-black">
            <div className="flex items-center gap-2 mb-4">
              <LogIn className="text-cyan-600" />
              <h2 className="text-xl font-bold text-slate-800">Join Room</h2>
            </div>

            <p className="text-sm text-slate-500 mb-4 font-medium">
              Enter Room ID
            </p>

            <input
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              placeholder="e.g. ABC123"
              className="w-full mb-4 px-4 py-3 rounded-xl bg-white border border-black text-slate-800 outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />

            <button
              onClick={joinRoom}
              disabled={loadingJoin}
              className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 shadow-lg shadow-cyan-600/15"
            >
              {loadingJoin ? "Joining..." : "Join Room"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}