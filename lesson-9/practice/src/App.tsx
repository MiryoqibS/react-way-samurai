import { useState } from "react";

function App() {
  const tracks = [
    {
      id: 0,
      title: "Musicfun soundtrack",
      url: "https://musicfun.it-incubator.app/api/samurai-way-soundtrack.mp3"
    },
    {
      id: 1,
      title: "Musicfun soundtrack instrumental",
      url: "https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3"
    },
    {
      id: 2,
      title: "Musicfun soundtrack instrumental",
      url: "https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3"
    },
    {
      id: 3,
      title: "Musicfun soundtrack instrumental",
      url: "https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3"
    },
  ];

  const [selectedTrackId, setSelectedTrackId] = useState(null);

  return (
    <div>
      <h1>Musicfun Player</h1>
      <button onClick={() => {
        setSelectedTrackId(null);
      }}>Reset selection</button>
      <ul>
        {tracks.map(track => (
          <li key={track.id} style={{
            border: track.id === selectedTrackId ? "1px solid orange" : "none",
          }}>
            <div onClick={() => setSelectedTrackId(track.id)}>
              {track.title}
            </div>
            <audio src={track.url}
              controls></audio>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;