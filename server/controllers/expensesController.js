const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createExpense = async (req, res) => {
  const { id, type, date, amount, category, account, note } = req.body;
  try {
    const newExpense = await prisma.expense.create({
      data: {
        type,
        date: new Date(date),
        amount,
        category,
        account,
        note,
        user: {
          connect: { id: id },
        },
      },
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getExpensesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: Number(userId) },
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const editExpense = async (req, res) => {
  const { expenseId } = req.params;
  const editData = req.body;
  try{
    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(expenseId) },
      data: {
        type: editData.type,
        date: new Date(editData.date),
        amount: parseFloat(editData.amount),
        category: editData.category,
        account: editData.account,
        note: editData.note,
      },
    });
    res.json(updatedExpense);
  }catch(error){
    res.status(500).json({ message: 'Server error' });
  }
}

const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expenses = await prisma.expense.delete({
      where: { id: Number(expenseId) },
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createExpense, getExpensesByUser, deleteExpense, editExpense };