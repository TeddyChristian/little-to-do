import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  CheckCircle,
  Circle,
  Moon,
  Sun,
  GripVertical,
  Search,
  Filter,
} from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "light" : "light");
  }, [isDark]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo.trim(), completed: false },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    const filteredTodos = getFilteredTodos();
    if (
      filteredTodos.length <= (currentPage - 1) * ITEMS_PER_PAGE &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo);
  };

  const handleDragOver = (e: React.DragEvent, targetTodo: Todo) => {
    e.preventDefault();
    if (!draggedTodo || draggedTodo.id === targetTodo.id) return;

    const newTodos = [...todos];
    const draggedIndex = todos.findIndex((t) => t.id === draggedTodo.id);
    const targetIndex = todos.findIndex((t) => t.id === targetTodo.id);

    newTodos.splice(draggedIndex, 1);
    newTodos.splice(targetIndex, 0, draggedTodo);
    setTodos(newTodos);
  };

  const handleDragEnd = () => {
    setDraggedTodo(null);
  };

  const getFilteredTodos = () => {
    return todos.filter((todo) => {
      const matchesSearch = todo.text
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "active"
          ? !todo.completed
          : todo.completed;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredTodos = getFilteredTodos();
  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-500/10 rounded-full -top-20 -left-20 blur-3xl animate-blob"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full top-[60%] left-[60%] blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute w-[500px] h-[500px] bg-pink-400/20 dark:bg-pink-500/10 rounded-full top-[20%] -right-20 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 relative h-screen sm:h-auto flex flex-col sm:block">
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl p-4 sm:p-8 transition-all duration-200 flex flex-col h-full sm:h-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center sm:text-left">
              Task Manager
            </h1>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 self-end sm:self-auto"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="text-yellow-500" size={24} />
              ) : (
                <Moon className="text-gray-600" size={24} />
              )}
            </button>
          </div>

          <form onSubmit={addTodo} className="mb-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 sm:w-auto w-full hover:scale-105 active:scale-95"
              >
                <PlusCircle size={20} />
                <span>Add</span>
              </button>
            </div>
          </form>

          <div className="flex flex-row gap-3 mb-6 ">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter
                className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                size={20}
              />
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "active" | "completed")
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active Tasks</option>
                <option value="completed">Completed Tasks</option>
              </select>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <div className="space-y-3 mb-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {paginatedTodos.map((todo) => (
                <div
                  key={todo.id}
                  draggable
                  onDragStart={() => handleDragStart(todo)}
                  onDragOver={(e) => handleDragOver(e, todo)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg group hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 animate-slide-in"
                >
                  <GripVertical
                    className="text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing hidden sm:block"
                    size={20}
                  />
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform duration-200 hover:scale-110 flex-shrink-0"
                  >
                    {todo.completed ? (
                      <CheckCircle
                        className="text-green-500 dark:text-green-400"
                        size={24}
                      />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-gray-800 dark:text-gray-200 break-words ${
                      todo.completed
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-110 flex-shrink-0"
                    aria-label="Delete task"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              {filteredTodos.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8 animate-fade-in px-4">
                  {searchQuery
                    ? "No tasks match your search"
                    : filter !== "all"
                    ? `No ${filter} tasks found`
                    : "No tasks yet. Add one to get started!"}
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              {filteredTodos.length > ITEMS_PER_PAGE && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-800 dark:text-gray-200 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              )}

              {todos.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {filter === "all"
                    ? `${todos.length} total tasks`
                    : `Showing ${filteredTodos.length} of ${todos.length} tasks`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
