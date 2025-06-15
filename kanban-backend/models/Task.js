const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  responsible: { type: String, required: true },
  status: {
    type: String,
    enum: ['pendente', 'em andamento', 'concluída'],
    default: 'pendente'
  },
  dueDate: { type: Date },
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
