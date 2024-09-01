const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expensesRoutes');
const billRoutes = require('./routes/billRoutes');

const app = express();
const PORT = process.env.PORT;

app.use(cors({origin:'http://localhost:3000', credentials:true}));
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', expenseRoutes);
app.use('/api', billRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
  