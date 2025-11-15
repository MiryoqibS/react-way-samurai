const tracks = [
    {
        title: "Musicfun soundtrack",
        url: "https://musicfun.it-incubator.app/api/samurai-way-soundtrack.mp3"
    },
    {
        title: "Musicfun soundtrack instrumental",
        url: "https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3"
    },
];

const rootEl = document.getElementById("root");

const headerEl = document.createElement("h1");
headerEl.append("Musinfun Player");
rootEl.append(headerEl);

const tracksEl = document.createElement("ul");
tracks.forEach(track => {
    const trackEl = document.createElement("li");

    const trackTitleEl = document.createElement("div");
    trackTitleEl.append(track.title);
    trackEl.append(trackTitleEl);

    const trackPlayerEl = document.createElement("audio");
    trackPlayerEl.controls = true;
    trackPlayerEl.src = track.url;
    
    trackEl.append(trackPlayerEl);
    tracksEl.append(trackEl);
});
rootEl.append(tracksEl);