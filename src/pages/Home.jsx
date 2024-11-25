import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState(null); // State to manage editing task
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(
        tasksQuery,
        (snapshot) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksData);
        },
        (error) => {
          console.error("Error fetching tasks: ", error);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const handleAddTask = async () => {
    if (newTask.title && newTask.description) {
      try {
        await addDoc(collection(db, "tasks"), {
          ...newTask,
          userId: user.uid,
          createdAt: new Date(),
        });
        setNewTask({ title: "", description: "" });
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    }
  };

  const handleUpdateTask = async () => {
    if (editingTask && editingTask.title && editingTask.description) {
      try {
        const taskDoc = doc(db, "tasks", editingTask.id);
        await updateDoc(taskDoc, {
          title: editingTask.title,
          description: editingTask.description,
        });
        setEditingTask(null); // Reset after updating
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task); // Set task for editing
  };

  const cancelEditing = () => {
    setEditingTask(null); // Reset editing task
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center text-white p-4 ">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <button onClick={logout} className="bg-red-600 p-2 rounded-lg text-lg shadow-lg hover:bg-red-700 transition-all">
            Logout
          </button>
        </div>

        {/* Add Task Section */}
        <div className="mt-8 border-2 border-gray-600 rounded-lg p-6 shadow-lg ">
          <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
          <input
            type="text"
            className="p-3 mb-3 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:ring-2 focus:ring-teal-500 outline-none w-full"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <textarea
            className="p-3 mb-4 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:ring-2 focus:ring-teal-500 outline-none w-full"
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <button
            onClick={handleAddTask}
            className="bg-teal-600 text-white p-3 rounded-lg shadow-lg hover:bg-teal-700 transition-all"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="bg-gray-700 p-6 rounded-lg shadow-lg ">
              {editingTask?.id === task.id ? (
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Edit Task</h3>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="p-3 mb-3 rounded-lg bg-gray-600 text-white w-full"
                  />
                  <textarea
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, description: e.target.value })
                    }
                    className="p-3 mb-6 rounded-lg bg-gray-600 text-white w-full"
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={handleUpdateTask}
                      className="bg-indigo-600 text-white p-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 text-white p-3 rounded-lg shadow-lg hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                  <p className="text-gray-400">{task.description}</p>
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => startEditing(task)}
                      className="bg-yellow-600 text-white p-3 rounded-lg shadow-lg hover:bg-yellow-700 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-600 text-white p-3 rounded-lg shadow-lg hover:bg-red-700 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
