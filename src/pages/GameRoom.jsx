import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function GameRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isHost = localStorage.getItem("isHost") === "true";

  useEffect(() => {
    fetchRoom();

    const interval = setInterval(() => {
      fetchRoom();
    }, 2000);

    return () => clearInterval(interval);
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/rooms/${roomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.status === "IN_PROGRESS") {
        navigate(`/quiz/${roomId}`);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load room");
      }

      const playersArray = Object.entries(data.players || {}).map(
        ([id, name]) => ({
          id: Number(id),
          name,
          host: Number(id) === data.hostId,
        })
      );

      setRoom(data);
      setPlayers(playersArray);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const token = localStorage.getItem("token");

  const leaveRoom = async () => {
    try {
      await fetch(
        `http://localhost:9000/api/rooms/${roomId}/leave`,
        {
          method: "DELETE",
          headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
          credentials: "include",
        }
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to leave room");
    }
  };

  const startQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:9000/api/rooms/${roomId}/start`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start quiz");
      }

      navigate(`/quiz/${roomId}`);
    } catch (err) {
      console.error(err);
      alert("Could not start quiz");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading room...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">
            Quiz Game Room
          </h1>

          <div className="bg-slate-400 px-4 py-2 rounded-xl text-black">
            Room ID:
            <span className="ml-2 font-bold text-black">
              {room.roomId}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        {/* Players */}
        <section className="lg:col-span-2 bg-slate-200 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-black">
              Players
            </h2>

            <div className="bg-slate-400 text-black px-4 py-2 rounded-lg">
              {players.length}/{room.maxPlayers}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-blue-500 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-lg">
                    {player.name}
                  </p>

                  {player.host && (
                    <p className="text-yellow-400 text-sm">
                      👑 Host
                    </p>
                  )}
                </div>

                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="bg-slate-200 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-black">
            Room Details
          </h2>

          <div className="space-y-4">

            <div className="bg-slate-400 p-4 rounded-xl">
              <p className="text-black font-bold">
                Max Players
              </p>

              <p className="font-bold text-black">
                {room.maxPlayers}
              </p>
            </div>

            <div className="bg-slate-400 p-4 rounded-xl">
              <p className="text-black font-bold">
                Players Joined
              </p>

              <p className="font-bold text-black">
                {players.length}
              </p>
            </div>

            {isHost ? (
              <button
                onClick={startQuiz}
                className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition font-bold"
              >
                Start Quiz
              </button>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-300">
                Waiting for host to start the game...
              </div>
            )}

            <button
              onClick={leaveRoom}
              className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 transition font-bold"
            >
              Leave Room
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}