import { Router } from "express"
import { todoController } from "../controllers/homeController"

const router = Router()

router.get("/", todoController.getAll)
router.post("/", todoController.create)
router.put("/:id", todoController.update)
router.delete("/:id", todoController.delete)

// 🔹 Exportar tudo
router.get("/export", async (req, res) => {
    const todos = await todoController.getAll()
    res.json(todos)
})

// 🔹 Importar (recebe array de todos)
router.post("/import", async (req, res) => {
    const todos = req.body
    const created = []
    for (const todo of todos) {
        const newTodo = await todoController.create(todo)
        created.push(newTodo)
    }
    res.json(created)
})

export default router
