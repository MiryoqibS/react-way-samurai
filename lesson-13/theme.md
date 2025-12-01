# 🎯 Тема 13 — UI/UX паттерн: детали выбранного трека

> 💡 В этой теме я наконец разобрал одну очень взрослую штуку — как правильно показывать детали выбранного трека, как работать с запросами, которые идут в фоне, и как сделать так, чтобы UI не лагал, не моргал и вообще чувствовал себя, как будто ему 144 FPS.

---

## 🔎 Что я понял

- Самая важная мысль от Дымыча: интерфейс обязан обновляться мгновенно, даже если запрос ещё идёт.

- Пока сервер думает → UI не должен “зависать”.

И вот ключевые проблемы, которые обычно ломают UX:

- пользователь кликает по треку → запрос идёт, но UI пока молчит

- запрос может “опоздать” — вернуть данные после того, как выбрали другой трек

- каждый клик делает новый fetch → миллион запросов

- нет кеша → повторный выбор трека снова ждёт сервер

- нет loading-состояния → пользователь думает, что ничего не происходит

- нет cancel для старых запросов → гонки

---

## 🚀 Подходы, которые мы изучили (и почему это реально важно)

### 1. Фетчить детали по клику (самый простой, но слабый вариант)

Работает, но UX такой себе.
Уходит куча запросов, и старые ответы могут перезаписать новые.

### 2. Показывать loading

Без этого UX разваливается — человек думает, что всё зависло.

---

## 🧠 Мой код, который я собрал после темы

```javascript
import { useEffect, useState, useRef, useCallback } from "react";

function App() {
  const apiKey = "aFigTebe";
  const [tracks, setTracks] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);

  const [detailsCache, setDetailsCache] = useState({});
  const [selectedTrackDetails, setSelectedTrackDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const currentControllerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("tracks");
    try {
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        setTracks(parsed);
        return;
      }
    } catch (e) {}

    const fetchTracks = async () => {
      try {
        const res = await fetch(
          "https://musicfun.it-incubator.app/api/1.0/playlists/tracks",
          { method: "GET", headers: { "API-KEY": apiKey } }
        );
        const json = await res.json();
        const fetched = json.data || [];
        localStorage.setItem("tracks", JSON.stringify(fetched));
        setTracks(fetched);
      } catch (err) {
        console.error("Ошибка загрузки треков:", err);
        setTracks([]);
      }
    };

    fetchTracks();
  }, []);

  const fetchDetails = useCallback(async (trackId, { signal } = {}) => {
    const url = `https://musicfun.it-incubator.app/api/1.0/playlists/tracks/${trackId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "API-KEY": apiKey },
      signal,
    });
    const json = await res.json();
    return json.data;
  }, []);

  useEffect(() => {
    if (currentControllerRef.current) {
      currentControllerRef.current.abort();
      currentControllerRef.current = null;
    }

    if (selectedTrackId === null) {
      setSelectedTrackDetails(null);
      setDetailsLoading(false);
      setDetailsError(null);
      return;
    }

    if (detailsCache[selectedTrackId]) {
      setSelectedTrackDetails(detailsCache[selectedTrackId]);
      setDetailsLoading(false);
      setDetailsError(null);
      return;
    }

    const controller = new AbortController();
    currentControllerRef.current = controller;

    setDetailsLoading(true);
    setDetailsError(null);
    setSelectedTrackDetails(null);

    fetchDetails(selectedTrackId, { signal: controller.signal })
      .then((details) => {
        setDetailsCache((prev) => ({ ...prev, [selectedTrackId]: details }));
        setSelectedTrackDetails(details);
        setDetailsLoading(false);
        currentControllerRef.current = null;
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Ошибка деталей:", err);
        setDetailsError("Не удалось загрузить детали.");
        setDetailsLoading(false);
        currentControllerRef.current = null;
      });
  }, [selectedTrackId, detailsCache, fetchDetails]);

  const handlePrefetch = useCallback(
    (trackId) => {
      if (detailsCache[trackId]) return;

      const controller = new AbortController();
      fetchDetails(trackId, { signal: controller.signal })
        .then((details) => {
          setDetailsCache((prev) => ({ ...prev, [trackId]: details }));
        })
        .catch(() => {});
    },
    [detailsCache, fetchDetails]
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        columnGap: 12,
      }}
    >
      <div style={{ width: "60%" }}>
        <h1>Musicfun Player</h1>
        <button onClick={() => setSelectedTrackId(null)}>
          Reset selection
        </button>

        <ul>
          {tracks.map((track) => (
            <li
              key={track.id}
              style={{
                border:
                  track.id === selectedTrackId ? "1px solid orange" : "none",
                padding: 8,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              {track.attributes.images?.main?.[2] && (
                <img
                  width={50}
                  height={50}
                  src={track.attributes.images.main[2].url}
                  alt={track.attributes.title}
                  style={{ objectFit: "cover" }}
                />
              )}
              <div
                onClick={() => setSelectedTrackId(track.id)}
                onMouseEnter={() => handlePrefetch(track.id)}
                style={{ cursor: "pointer", flex: 1 }}
              >
                {track.attributes.title}
              </div>
              <audio src={track.attributes.attachments?.[0]?.url} controls />
            </li>
          ))}
        </ul>
      </div>

      <div style={{ width: "35%", padding: 12, borderLeft: "1px solid #eee" }}>
        <h2>Details</h2>

        {selectedTrackId === null ? (
          <div>Track is not selected</div>
        ) : detailsLoading ? (
          <div>Loading details…</div>
        ) : detailsError ? (
          <div style={{ color: "red" }}>{detailsError}</div>
        ) : selectedTrackDetails ? (
          <div>
            <h3>{selectedTrackDetails.attributes.title}</h3>
            <p>
              <strong>Lyrics</strong>
            </p>
            <div>{selectedTrackDetails.attributes?.lyrics ?? "No lyrics"}</div>
          </div>
        ) : (
          <div>No details available.</div>
        )}
      </div>
    </div>
  );
}

export default App;
```

---

## ⚙️ Мои выводы по теме

- интерфейс должен обновляться моментально
- запросы в фоне — это нормально
- но старые запросы надо отменять
- кеш — это мой новый лучший друг
- префетч — маленький хак, который делает UX “волшебным”
- loading/error состояния — обязательны
- без этого UI выглядит «сломано»

---

## ⚠️ Подводные камни, которые я теперь точно избегаю

- ❌ не показывать загрузку
- ❌ делать 100500 запросов на один и тот же трек
- ❌ позволять старому fetch перезаписать новый
- ❌ забывать про onMouseEnter (префетч)
- ❌ хранить детали только в одном state, без кеша

---

## 🙏 Благодарность Димычу (IT-KAMASUTRA)

> 💡 Спасибо тебе, Димыч, за труд, за искренность и за то, что ты не просто учишь React, а даёшь направление — как мыслить, как расти и не бояться нового. Этот курс не про синтаксис, а про путь. И каждый, кто пройдёт его с открытой головой, выйдет не просто разработчиком, а самураем, готовым к реальному миру.
