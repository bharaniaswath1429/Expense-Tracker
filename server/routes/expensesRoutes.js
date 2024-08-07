const express = require('express');
const { createExpense, getExpensesByUser, deleteExpense, editExpense } = require('../controllers/expensesController');

const router = express.Router();

router.post('/expenses', createExpense);
router.get('/expenses/:userId', getExpensesByUser); 
router.delete('/expenses/:expenseId', deleteExpense);
router.patch('/expenses/:expenseId', editExpense);

module.exports = router;