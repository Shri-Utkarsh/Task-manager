import React, { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const TaskList = ({ onEditTask }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      setTasks(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="p-4">
      {tasks.map((task) => (
        <div key={task.id} className="border p-2 mt-2">
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <button onClick={() => onEditTask(task)} className="text-blue-500">Edit</button>
          <button onClick={() => handleDelete(task.id)} className="text-red-500 ml-2">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
