import React, { useState, useEffect } from "react"
import { api } from "./api"

interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await api.get("/")
      setTodos(res.data)
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
    }
  }

  const addTodo = async () => {
    if (!title.trim() || !description.trim()) return
    try {
      const res = await api.post("/", { title, description })
      setTodos([...todos, res.data])
      setTitle("")
      setDescription("")
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error)
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const res = await api.put(`/${id}`, { completed: !completed })
      setTodos(todos.map((t) => (t.id === id ? res.data : t)))
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await api.delete(`/${id}`)
      setTodos(todos.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
    }
  }

  const exportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "todos.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTodos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const imported: Todo[] = JSON.parse(text)

    for (const todo of imported) {
      await api.post("/", {
        title: todo.title,
        description: todo.description,
      })
    }

    fetchTodos()
  }

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <h2 className="text-center mb-4">📝 To-Do List</h2>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-outline-secondary" onClick={exportTodos}>
          ⬇️ Exportar
        </button>

        <label className="btn btn-outline-success mb-0">
          ⬆️ Importar
          <input
            type="file"
            accept=".json"
            hidden
            onChange={importTodos}
          />
        </label>
      </div>

      <form
        className="mb-3"
        onSubmit={(e) => {
          e.preventDefault()
          addTodo()
        }}
      >
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Descrição"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="btn btn-primary w-100">
          Adicionar
        </button>
      </form>

      <ul className="list-group">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div
              onClick={() => toggleTodo(todo.id, todo.completed)}
              style={{ cursor: "pointer", flex: 1 }}
            >
              <strong
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </strong>
              <p
                style={{
                  margin: 0,
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.description}
              </p>
            </div>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deleteTodo(todo.id)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
