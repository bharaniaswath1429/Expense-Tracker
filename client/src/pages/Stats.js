import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNavbar from "../components/navbar/Navbar";

import { Line, Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Stats = () => {
  const [activeLink, setActiveLink] = useState("Stats");
  const [expenses, setExpenses] = useState([]);
  const [data, setData] = useState([]);
  const [id, setId] = useState();
  const user = JSON.parse(localStorage.getItem("user"));

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const today = new Date().toISOString().split("T")[0];
  const todayExpenses = expenses.filter((d) => d.date.startsWith(today));

  // Today's Expenses by Category Chart
  const categoryData1 = todayExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const todayByCategoryData = {
    labels: Object.keys(categoryData1),
    datasets: [
      {
        label: "Today's Expenses by Category",
        data: Object.values(categoryData1),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };
  //daily expenses
  const dailyExpensesData = {
    labels: expenses.map((d) => formatDate(d.date)),
    datasets: [
      {
        label: "Daily Expenses",
        data: expenses.map((d) => d.amount),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  //monthly expenses
  const monthlyData = expenses.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + curr.amount;
    return acc;
  }, {});

  const monthlyExpensesData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Monthly Expenses",
        data: Object.values(monthlyData),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  // Expenses by Category Bar Chart
  const categoryData = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const expensesByCategoryData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryData),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };


  //income and expenses bar chart
  const income = data.filter((item) => item.type === "Income");
  const expense = expenses.filter((item) => item.type === "Expenses");

  const chartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Cash",
        data: [
          income
            .filter((item) => item.account === "Cash")
            .reduce((acc, curr) => acc + curr.amount, 0),
          expense
            .filter((item) => item.account === "Cash")
            .reduce((acc, curr) => acc + curr.amount, 0),
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  //Cash vs Bank Account expenses
  const expensesCash = data
    .filter((item) => item.type === "Expenses" && item.account === "Cash")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const expensesBank = data
    .filter(
      (item) => item.type === "Expenses" && item.account === "Bank Account"
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const chartData1 = {
    labels: ["Expenses"],
    datasets: [
      {
        label: "Cash",
        data: [expensesCash],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Bank Account",
        data: [expensesBank],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

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
      .then((data) => {
        setData([...data]);
        const filteredExpenses = [...data].filter(
          (item) => item.type === "Expenses"
        );
        setExpenses(filteredExpenses);
      })
      .catch((error) => console.error("Error fetching employee data:", error));
  }, [id, data]);

  return (
    <div className="d-flex">
      <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />
      <div className="flex-grow-1">
        <TopNavbar activeLink={activeLink} />
        <div className="m-4">
          <div className="row mt-5">
            <div className="col-4">
              <h3>Today's Expenses by Category Chart</h3>
              <Bar data={todayByCategoryData} />
            </div>
            <div className="col-4">
              <h3>Daily Expenses by Date Line Chart</h3>
              <Line data={dailyExpensesData} />
            </div>
            <div className="col-4">
              <h3>Monthly Expenses Bar Chart</h3>
              <Bar data={monthlyExpensesData} />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-4">
              <h3>Expenses by Category Bar Chart</h3>
              <Bar data={expensesByCategoryData} />
            </div>
            <div className="col-4">
              <h3>Income and Expenses Bar Chart</h3>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
            <div className="col-4 ">
              <h3>Cash and Bank Account Bar Chart</h3>
              <Bar
                data={chartData1}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
