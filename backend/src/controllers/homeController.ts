import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const todoController = {
    async getAll(req: Request, res: Response) {
        const todos = await prisma.todo.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.json(todos);
    },

    async create(req: Request, res: Response) {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: "O título é obrigatório" });
        }

        const todo = await prisma.todo.create({
            data: { title, description },
        });

        return res.status(201).json(todo);
    },

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        try {
            const todo = await prisma.todo.update({
                where: { id: Number(id) },
                data: { title, description, completed },
            });

            return res.json(todo);
        } catch {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await prisma.todo.delete({ where: { id: Number(id) } });
            return res.json({ message: "Tarefa deletada com sucesso" });
        } catch {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }
    },
};
