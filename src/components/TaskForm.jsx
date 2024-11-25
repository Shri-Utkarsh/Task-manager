import React, { useState } from "react";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

const TaskForm = ({ currentTask, onTaskSaved }) => {
  const [title, setTitle] = useState(currentTask?.title || "");
  const [description, setDescription] = useState(currentTask?.description || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTask) {
        await updateDoc(doc(db, "tasks", currentTask.id), { title, description });
      } else {
        await addDoc(collection(db, "tasks"), { title, description });
      }
      onTaskSaved();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        required
        className="border p-2 w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        required
        className="border p-2 w-full mt-2"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-2">
        {currentTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
