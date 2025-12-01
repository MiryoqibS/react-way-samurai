import { useEffect, useState } from "react";

function App() {
  const apiKey = "aFigTebe";
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [selectedTrackDetails, setSelectedTrackDetails] = useState(null);
  const [tracks, setTracks] = useState(null)

  useEffect(() => {
    try {
      // проверяем есть ли в LocalStorage
      const savedTracks = JSON.parse(localStorage.getItem("tracks"));
      if (Array.isArray(savedTracks)) setTracks(savedTracks);
    } catch (e) {
      // если нету то делаем запрос на сервер
      const fetchTracks = async () => {
        const response = await fetch("https://musicfun.it-incubator.app/api/1.0/playlists/tracks", {
          method: "GET",
          headers: {
            "API-KEY": apiKey,
          },
        });
        const data = await response.json();
        const fetchedTracks = data.data;
        localStorage.setItem("tracks", JSON.stringify(fetchedTracks));
        setTracks(fetchedTracks);
      };

      fetchTracks();
    }
  }, []);

  // Эффект для получения деталей выбранного трека
  useEffect(() => {
    if (selectedTrackId === null) return;

    const fetchSelectedTrackDetails = async () => {
      try {
        const response = await fetch(`https://musicfun.it-incubator.app/api/1.0/playlists/tracks/${selectedTrackId}`, {
          method: "GET",
          headers: {
            "API-KEY": apiKey,
          },
        })
        const data = await response.json();
        const details = data.data;
        console.log(details);

        setSelectedTrackDetails(details);
      } catch (error) {
        console.error(`Произошла ошибка при получении деталей трека: ${error.message}`)
      }
    }

    fetchSelectedTrackDetails();
  }, [selectedTrackId]);

  if (!tracks) {
    return (
      <div>
        <h1>Musicfun Player</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div>
        <h1>Musicfun Player</h1>
        <p>No tracks found.</p>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between", columnGap: "12px" }}>

      {/* Список треков */}
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
              {track.attributes.images.main[2] && (
                <img
                  width={50}
                  height={50}
                  src={track.attributes.images.main[2].url}
                  alt={track.attributes.title}
                  style={{ objectFit: "cover" }}
                />
              )}
              <div onClick={() => setSelectedTrackId(track.id)}>
                {track.attributes.title}
              </div>
              <audio src={track.attributes.attachments[0].url}
                controls></audio>
            </li>
          ))}
        </ul>
      </div>

      {/* Детали выбранного трека */}
      <ul>
        <h2>Details</h2>
        {selectedTrackId === null ? "Track is not selected" : (
          <div>
            <h3>Lyrics</h3>
            {selectedTrackDetails?.attributes?.lyrics ?? "No lyrics"}
          </div>
        )}
      </ul>
    </div>
  )
}

export default App;