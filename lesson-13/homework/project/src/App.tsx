import { useEffect, useState } from "react"

export const App = () => {
  const [tasks, setTasks] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const apiKey = "aFigTebe";
  const API = "https://trelly.it-incubator.app/api/1.0";

  // загрузка всех задач
  useEffect(() => {
    // проверяем localStorage
    const key = "trellyTasks"

    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API}/boards/tasks`, {
          method: "GET",
          headers: {
            "API-KEY": apiKey,
          }
        });
        const data = await response.json();
        console.log(data);
        localStorage.setItem(key, JSON.stringify(data.data));
        setTasks(data.data);
      } catch (error) {
        console.error(`Oops error: ${error.message}`);
      }
    };

    try {
      const savedTasks = JSON.parse(localStorage.getItem(key) || "");
      setTasks(savedTasks);
    } catch (e) {
      fetchTasks();
    }
  }, []);

  // эффект для получения деталей выбранной задачи
  useEffect(() => {
    if ([boardId, selectedTaskId].includes(null)) return;

    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`${API}/boards/${boardId}/tasks/${selectedTaskId}`, {
          method: "GET",
          headers: {
            "API-KEY": apiKey,
          },
        });

        const data = await response.json();
        setTaskDetails(data.data);
      } catch (error) {
        console.log(`Oops error: ${error.message}`);
      }
    }

    fetchTaskDetails();
  }, [selectedTaskId]);

  const formatDate = (date) => {
    return Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="grid grid-cols-5 gap-6 container mx-auto py-10">
      {/* список задач */}
      <div className="col-span-3 flex flex-col items-start gap-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button
          className="px-4 py-2 rounded text-md font-medium bg-gray-200 border border-gray-300 cursor-pointer"
          onClick={() => setSelectedTaskId(null)}
        >Сбросить выделение</button>
        {tasks ? (
          <div className="w-full flex flex-col gap-4">
            {tasks.map(task => (
              <div
                className={`
                  w-full
                  flex flex-col items-start gap-3 px-4 py-2 rounded 
                  bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer 
                  ${selectedTaskId === task.id ? "border-gray-900 border-2" : "border-2 border-gray-300"}`}
                key={task.id}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setBoardId(task.attributes.boardId);
                }}
              >
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  Заголовок:
                  <span className={`text-md font-medium ${task.attributes.status === 2 ? "line-through" : ""}`}>{task.attributes.title}</span>
                </h3>

                <div className="flex items-center gap-2 text-lg font-bold">
                  <span>Статус:</span>
                  <input
                    checked={task.attributes.status === 2}
                    type="checkbox"
                  />
                </div>

                <p>Создано: {formatDate(task.attributes.addedAt)}</p>
              </div>
            ))}
          </div>
        ) : (<p>Loading Tasks...</p>)}
      </div>

      {/* детали задачи */}
      <div className="col-span-2 flex flex-col gap-4 bg-gray-200 rounded px-4 py-2">
        <h2 className="text-2xl font-bold">Task Details</h2>
        {
          selectedTaskId === null ?
            (<p>Task is not selected</p>) : taskDetails && taskDetails.id === selectedTaskId ?
              (<div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 items-start">
                  <p>Title</p>
                  <h3 className="text-xl">{taskDetails?.attributes?.title}</h3>
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <p>Board title</p>
                  <h3 className="text-xl">{taskDetails?.attributes?.boardTitle}</h3>
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <p>Description</p>
                  <h3 className="text-xl">{taskDetails?.attributes?.description}</h3>
                </div>
              </div>)
              :
              (<p>Loading...</p>)
        }
      </div>
    </div >
  )
}
