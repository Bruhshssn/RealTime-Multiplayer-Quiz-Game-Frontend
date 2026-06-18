import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Medal config for top 3
const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_STYLES = [
  "border-blue-500 bg-blue-50",
  "border-slate-300 bg-slate-50",
  "border-slate-200 bg-slate-50/50",
];

const Leaderboard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derive current player id from JWT stored in localStorage
  const getCurrentPlayerId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      // JWT payload is the second segment, base64-encoded
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Adjust claim name if your JWT uses a different key (e.g. "sub", "playerId")
      return payload.playerId ?? payload.sub ?? null;
    } catch {
      return null;
    }
  };

  const currentPlayerId = getCurrentPlayerId();

  useEffect(() => {
    fetchLeaderboard();
  }, [roomId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      // roomId here is used as questionId — adjust if you have a
      // separate room-level endpoint later.
      const response = await fetch(
        `http://localhost:9000/api/leaderboard/room/${roomId}?topN=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const data = await response.json();
      // Expects: { entries: [{ playerId, playerName, totalScore, rank }, ...] }
      setEntries(data.entries ?? []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Could not load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLobby = async () => {
    try {
      const token = localStorage.getItem("token");
      
      await fetch(
        `http://localhost:9000/api/rooms/${roomId}/leave`,
        {
          method: "DELETE", // change if your backend expects DELETE/PUT
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to leave room:", err);
    } finally {
      navigate("/");
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🏆</div>
          <p className="text-slate-600 text-lg font-medium">Tallying scores...</p>
        </div>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
        <div className="bg-white border border-blue-200 shadow-sm rounded-2xl p-8 text-center max-w-sm w-full">
          <p className="text-blue-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Empty ─────────────────────────────────────────────────────────────────

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
        <div className="text-center">
          <p className="text-slate-500 text-lg font-medium">No scores yet.</p>
        </div>
      </div>
    );
  }

  // Find current player's entry to show at bottom if they're outside top N
  const myEntry = entries.find((e) => String(e.playerId) === String(currentPlayerId));
  const myRank = myEntry ? entries.indexOf(myEntry) + 1 : null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
      <div className="w-full max-w-2xl">

        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-4xl font-extrabold text-slate-900">Leaderboard</h1>
          <p className="text-blue-600 font-medium text-sm mt-1">Room · {roomId}</p>
        </div>

        {/* Top 3 podium */}
        {entries.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-8">
            {/* 2nd place */}
            <PodiumCard entry={entries[1]} rank={2} isMe={String(entries[1]?.playerId) === String(currentPlayerId)} />
            {/* 1st place — taller */}
            <PodiumCard entry={entries[0]} rank={1} tall isMe={String(entries[0]?.playerId) === String(currentPlayerId)} />
            {/* 3rd place */}
            <PodiumCard entry={entries[2]} rank={3} isMe={String(entries[2]?.playerId) === String(currentPlayerId)} />
          </div>
        )}

        {/* Full list */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden mb-6">
          {/* Header row */}
          <div className="grid grid-cols-12 px-5 py-3 bg-slate-100/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-bold">
            <span className="col-span-1">#</span>
            <span className="col-span-7">Player</span>
            <span className="col-span-4 text-right">Score</span>
          </div>

          {entries.map((entry, index) => {
            const rank = index + 1;
            const isMe = String(entry.playerId) === String(currentPlayerId);
            const isTopThree = rank <= 3;

            return (
              <div
                key={entry.playerId ?? index}
                className={`
                  grid grid-cols-12 items-center px-5 py-4 border-t border-slate-100 first:border-t-0
                  transition-colors duration-150
                  ${isMe ? "bg-blue-50/70 border-l-4 border-l-blue-600" : "hover:bg-slate-50"}
                `}
              >
                {/* Rank */}
                <span className="col-span-1">
                  {isTopThree ? (
                    <span className="text-xl">{MEDALS[index]}</span>
                  ) : (
                    <span className="text-slate-400 font-mono text-sm font-semibold">{rank}</span>
                  )}
                </span>

                {/* Name */}
                <div className="col-span-7 flex items-center gap-2">
                  <span className={`font-semibold ${isMe ? "text-blue-700" : "text-slate-800"}`}>
                    {entry.playerName ?? `Player ${rank}`}
                  </span>
                  {isMe && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold shadow-sm">
                      You
                    </span>
                  )}
                </div>

                {/* Score */}
                <div className="col-span-4 text-right">
                  <span className={`font-bold text-lg ${isTopThree ? "text-blue-600" : isMe ? "text-blue-700" : "text-slate-700"}`}>
                    {entry.totalScore ?? entry.score ?? 0}
                  </span>
                  <span className="text-slate-400 text-xs ml-1 font-medium">pts</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Your rank summary (if outside visible list) */}
        {myEntry && (
          <div className="bg-blue-600 text-white rounded-xl p-4 mb-6 flex items-center justify-between shadow-md shadow-blue-600/10">
            <div>
              <p className="text-blue-100 text-sm font-medium">Your position</p>
              <p className="text-white text-base font-bold">
                Rank #{myRank} out of {entries.length} players
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">
                {myEntry.totalScore ?? myEntry.score ?? 0}
              </p>
              <p className="text-blue-100 text-xs font-medium">points</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleBackToLobby}
            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
          >
            Back to Lobby
          </button>
          <button
            onClick={fetchLeaderboard}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-600/10"
          >
            ↻ Refresh
          </button>
        </div>

      </div>
    </div>
  );
};

// ─── Podium Card ─────────────────────────────────────────────────────────────

const PodiumCard = ({ entry, rank, tall = false, isMe }) => {
  if (!entry) return null;

  return (
    <div
      className={`
        flex-1 flex flex-col items-center rounded-2xl border p-4 text-center transition-all shadow-sm
        ${RANK_STYLES[rank - 1]}
        ${tall ? "py-7 border-blue-400 shadow-md scale-105" : "py-4"}
      `}
    >
      <span className="text-3xl mb-1">{MEDALS[rank - 1]}</span>
      <p className={`font-bold text-sm truncate w-full text-center ${isMe ? "text-blue-700" : "text-slate-800"}`}>
        {entry.playerName ?? `Player ${rank}`}
        {isMe && " (You)"}
      </p>
      <p className="text-blue-600 font-extrabold text-xl mt-1">
        {entry.totalScore ?? entry.score ?? 0}
        <span className="text-slate-400 text-xs font-normal ml-1">pts</span>
      </p>
    </div>
  );
};

export default Leaderboard;