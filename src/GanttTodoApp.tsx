import React, { useState, useEffect } from "react";

const GanttTodoApp = () => {
  // 初期タスクデータ
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "レポート作成",
      startDate: "2025-03-01",
      dueDate: "2025-03-10",
      completed: false
    },
    {
      id: 2,
      name: "ミーティング準備",
      startDate: "2025-03-03",
      dueDate: "2025-03-05",
      completed: true
    },
    {
      id: 3,
      name: "プレゼン資料",
      startDate: "2025-03-05",
      dueDate: "2025-03-15",
      completed: false
    }
  ]);

  const [newTask, setNewTask] = useState({
    name: "",
    startDate: "",
    dueDate: ""
  });
  const [editId, setEditId] = useState(null);
  const [today] = useState(new Date().toISOString().split("T")[0]);

  // 日付の配列を生成（今日から30日分）
  const generateDates = () => {
    const dates = [];
    const baseDate = new Date();
    for (let i = -5; i < 25; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const [dates] = useState(generateDates());

  // 新規タスク追加処理
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.name || !newTask.startDate || !newTask.dueDate) return;

    if (editId) {
      // 既存タスクの編集
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? {
                ...task,
                name: newTask.name,
                startDate: newTask.startDate,
                dueDate: newTask.dueDate
              }
            : task
        )
      );
      setEditId(null);
    } else {
      // 新規タスク追加
      const newId = Math.max(...tasks.map((t) => t.id), 0) + 1;
      setTasks([...tasks, { ...newTask, id: newId, completed: false }]);
    }

    // フォームリセット
    setNewTask({ name: "", startDate: "", dueDate: "" });
  };

  // タスク編集モード設定
  const handleEdit = (task) => {
    setNewTask({
      name: task.name,
      startDate: task.startDate,
      dueDate: task.dueDate
    });
    setEditId(task.id);
  };

  // タスク完了ステータス切り替え
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // タスク削除
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // タスクの日付範囲確認用
  const isInRange = (task, date) => {
    return date >= task.startDate && date <= task.dueDate;
  };

  // 期限切れ確認
  const isPastDue = (task) => {
    return !task.completed && task.dueDate < today;
  };

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          ガントチャートToDo
        </h1>

        {/* タスク追加/編集フォーム */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white p-4 rounded-md shadow"
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                タスク名
              </label>
              <input
                type="text"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="タスク名を入力"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                開始日
              </label>
              <input
                type="date"
                value={newTask.startDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, startDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                期限日
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="self-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editId ? "更新" : "追加"}
              </button>
            </div>
          </div>
        </form>

        {/* ガントチャート */}
        <div className="bg-white p-4 rounded-md shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="w-64 px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">
                  タスク
                </th>
                {dates.map((date) => (
                  <th
                    key={date}
                    className={`w-10 px-1 py-2 text-center text-xs font-medium text-gray-600 border-b ${
                      date === today ? "bg-yellow-50" : ""
                    }`}
                  >
                    {new Date(date).getDate()}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="px-4 py-1 text-left text-xs font-normal text-gray-500"></th>
                {dates.map((date) => (
                  <th
                    key={`month-${date}`}
                    className={`px-1 py-1 text-center text-xs font-normal text-gray-500 ${
                      date === today ? "bg-yellow-50" : ""
                    }`}
                  >
                    {new Date(date).toLocaleDateString("ja-JP", {
                      month: "short"
                    })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="mr-2"
                      />
                      <span
                        className={`flex-1 ${
                          task.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.name}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-blue-600 hover:text-blue-800 text-sm px-2"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-800 text-sm px-2"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </td>
                  {dates.map((date) => (
                    <td
                      key={`${task.id}-${date}`}
                      className={`px-0 py-3 text-center border-b ${
                        date === today ? "bg-yellow-50" : ""
                      }`}
                    >
                      {isInRange(task, date) && (
                        <div
                          className={`h-6 ${
                            task.completed
                              ? "bg-green-200"
                              : isPastDue(task) && date > task.dueDate
                              ? "bg-red-200"
                              : date === task.dueDate
                              ? "bg-blue-300"
                              : "bg-blue-200"
                          }`}
                        >
                          {date === task.dueDate &&
                            !task.completed &&
                            task.dueDate < today && (
                              <span className="text-red-600 font-bold text-xs">
                                !
                              </span>
                            )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 凡例 */}
        <div className="mt-4 bg-white p-4 rounded-md shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-2">凡例</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-200 mr-2"></div>
              <span className="text-sm text-gray-600">進行中</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-300 mr-2"></div>
              <span className="text-sm text-gray-600">期限日</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-200 mr-2"></div>
              <span className="text-sm text-gray-600">期限超過</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-200 mr-2"></div>
              <span className="text-sm text-gray-600">完了</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 text-center text-yellow-600 bg-yellow-50 mr-2">
                今
              </div>
              <span className="text-sm text-gray-600">今日</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttTodoApp;
