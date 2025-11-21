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

  let selectedTrackId = 1;

  if (tracks === null) {
    return (
      <>
        <h1>Musicfun Player</h1>
        <span>Loading...</span>
      </>
    )
  }

  if (tracks.length === 0) {
    return (
      <>
        <h1>Musicfun Player</h1>
        <span>No Tracks</span>
      </>
    )
  }

  return (
    <div>
      <h1>Musicfun Player</h1>
      <ul>
        {tracks.map(track => (
          <li key={track.id} style={{
            border: track.id === selectedTrackId ? "1px solid orange" : "none",
          }}>
            <div>
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