const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 🔸 GET com filtros e paginação
router.get('/', async (req, res) => {
  try {
    const { status, responsible, startDate, endDate, limit = 10, skip = 0 } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (responsible) filter.responsible = new RegExp(responsible, 'i');

    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate);
      if (endDate) filter.dueDate.$lte = new Date(endDate);
    }

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      total,
      count: tasks.length,
      tasks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔸 GET por ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔸 POST - Criar tarefa
router.post('/', async (req, res) => {
  const { title, responsible, status, dueDate } = req.body;
  const task = new Task({ title, responsible, status, dueDate });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🔸 PUT - Atualizar tarefa
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: 'Tarefa não encontrada' });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🔸 DELETE - Remover tarefa
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: 'Tarefa não encontrada' });
    res.json({ message: 'Tarefa excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


// Swagger //

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - responsible
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-gerado
 *         title:
 *           type: string
 *         responsible:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pendente, em andamento, concluída]
 *         dueDate:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *       example:
 *         _id: "65d5e8b0d7a9a34f6c9e2f10"
 *         title: "Fazer relatório"
 *         responsible: "Ana"
 *         status: "em andamento"
 *         dueDate: "2025-06-30"
 *         createdAt: "2025-06-14"
 *         updatedAt: "2025-06-14"
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retorna todas as tarefas (com filtros)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, em andamento, concluída]
 *       - in: query
 *         name: responsible
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tarefas
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Busca tarefa por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retorna a tarefa
 *       404:
 *         description: Tarefa não encontrada
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tarefa criada
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Atualiza uma tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Deleta uma tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarefa excluída
 */
