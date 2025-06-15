const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['pendente', 'em andamento', 'concluída'], 
    default: 'pendente' 
  },
  responsible: String,
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
