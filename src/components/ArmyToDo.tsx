import { useState, useEffect } from 'react';
import axios from 'axios';

enum TodoStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

enum TodoPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

interface TodoItem {
  _id?: string;
  name: string;
  status: TodoStatus;
  priority: TodoPriority;
  description: string;
}

const API_URL = 'https://reactexambackend.onrender.com/missions/:0613';

const TodoApp = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState<TodoItem>({
    name: '',
    status: TodoStatus.Pending,
    priority: TodoPriority.Low,
    description: '',
  });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(API_URL);
        setTodos(response.data);
        
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, [todos]);

  const addTodo = async () => {
    if (newTodo.name.trim()) {
      try {
    
        const response = await axios.post(API_URL, newTodo);
        //add the new todo to the list
        setTodos([response.data, ...todos]);
        //reset the form
        setNewTodo({ name: '', status: TodoStatus.Pending, priority: TodoPriority.Low, description: '' });
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const removeTodo = async (id: string | undefined) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error removing todo:', error);
    }
  };

  const toggleComplete = async (id: string | undefined) => {
    try {
      const todo = todos.find((todo) => todo._id === id);
      if (todo) {
        await axios.post(`${API_URL}/progress/${id}`);
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };
  

  return (
    <div className="TodoApp">
      <h3>Military Operation Dashbored</h3>
      <div>
        <input
          type="text"
          value={newTodo.name}
          onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
          placeholder="Name"
        />
        <select
          value={newTodo.status}
          onChange={(e) => setNewTodo({ ...newTodo, status: e.target.value as TodoStatus })}
        >
          <option value={TodoStatus.Pending}>Pending</option>
          <option value={TodoStatus.InProgress}>In Progress</option>
          <option value={TodoStatus.Completed}>Completed</option>
        </select>
        <select
          value={newTodo.priority}
          onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as TodoPriority })}
        >
          <option value={TodoPriority.Low}>Low</option>
          <option value={TodoPriority.Medium}>Medium</option>
          <option value={TodoPriority.High}>High</option>
        </select>
        <input
          type="text"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          placeholder="Description"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}
           className={todo.status === TodoStatus.Pending ? 'pending' : 
            todo.status === TodoStatus.InProgress ? 'in-progress' : 
            'done'}>

            <p><strong>Name:</strong> {todo.name} <br />
            <strong>Status:</strong> {todo.status} <br />
            <strong>Priority:</strong> {todo.priority} <br />
           <strong>Description:</strong> {todo.description}</p> <br />

            <button onClick={() => toggleComplete(todo._id)} id='progress'>
              {todo.status}
            </button>
            <button onClick={() => removeTodo(todo._id)} id='remove'>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;

