import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNavbar from "../components/navbar/Navbar";
import Circle from "../components/Circle";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [expenses, setExpenses] = useState([]);
  const [id, setId] = useState();
  const user = JSON.parse(localStorage.getItem("user"));
  const [filteredData, setFilteredData] = useState([]);
  const [totalIncome, setTotalIncome] = useState();
  const [totalExpense, setTotalExpense] = useState();
  const [totalSaving, setTotalSaving] = useState();

  useEffect(() => {
    setId(user.id);
  }, [user.id]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/expenses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setExpenses([...data]))
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  useEffect(() => {
    const sortedData = expenses.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setFilteredData(sortedData);
    const totalIncome = expenses
      .filter((item) => item.type === "Income")
      .reduce((acc, item) => acc + item.amount, 0);

    const totalExpense = expenses
      .filter((item) => item.type === "Expenses")
      .reduce((acc, item) => acc + item.amount, 0);

    const totalSaving = totalIncome - totalExpense;

    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);
    setTotalSaving(totalSaving);
  }, [expenses]);

  //Bar Chart
  const dates = [...new Set(filteredData.map(item => new Date(item.date).toLocaleDateString()))];
  const expensesByDate = dates.map(date => {
    return filteredData
      .filter(item => item.type === 'Expenses' && new Date(item.date).toLocaleDateString() === date)
      .reduce((total, item) => total + item.amount, 0);
  });

  const barChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Expenses by Date',
        data: expensesByDate,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  //Pie Chart
  const categories = [...new Set(filteredData.map(item => item.category))];
  const expensesByCategory = categories.map(category => {
    return filteredData
      .filter(item => item.type === 'Expenses' && item.category === category)
      .reduce((total, item) => total + item.amount, 0);
  });

  const pieChartData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses by Category',
        data: expensesByCategory,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="d-flex">
      <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />
      <div className="flex-grow-1">
        <TopNavbar activeLink={activeLink} />
        <div className="m-4">
          <div className="row">
          <div className="col-3 p-4 d-flex align-items-center justify-content-center">
                  <Circle name="No. of Transactions:" data={filteredData.length}/>
                  </div>
                  <div className="col-3 p-4 d-flex align-items-center justify-content-center">
                  <Circle name="Total Income:" data={totalIncome}/>
                  </div>
                  <div className="col-3 p-4 d-flex align-items-center justify-content-center">
                  <Circle name="Total Expense:" data={totalExpense}/>
                  </div>
                  <div className="col-3 p-4 d-flex align-items-center justify-content-center">
                  <Circle name="Total Saving:" data={totalSaving}/>
                  </div>
          </div>
          <div className="m-4">
            <div className="row">
              <div className="col-8">
              <h3 style={{color:'#6c63ff'}}>Expenses by Date</h3>
              <Bar data={barChartData} style={{width:'100%'}}/>
              </div>
              <div className="col-4">
              <h3 style={{color:'#6c63ff'}}>Expenses by Category</h3>
              <Pie data={pieChartData} style={{width:'100%'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
