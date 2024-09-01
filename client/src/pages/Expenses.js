import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNavbar from "../components/navbar/Navbar";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const initialFormData = {
  id: "",
  type: "Expenses",
  date: "",
  amount: "",
  category: "Food",
  account: "Bank Account",
  note: "",
};


const Expenses = () => {
  const [activeLink, setActiveLink] = useState("Expenses");
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState(initialFormData);
  const categories =
    formData.type === "Expenses"
      ? [
          "Food",
          "Social Life",
          "Pets",
          "Transport",
          "Culture",
          "Household",
          "Apparel",
          "Beauty",
          "Health",
          "Education",
          "Gift",
          "Other"
        ]
      : ["Allowance", "Salary", "Petty Cash", "Bonus","Other"];

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      id: user.id,
    }));
  }, [user.id]);
  useEffect(() => {
    if(formData.type === "Income"){
      setFormData((prevData) => ({
        ...prevData,
        category:"Allowance"
      }))
    }
    else{
      setFormData((prevData) => ({
        ...prevData,
        category:"Food"
      }))
    }
  }, [formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { type, date, amount, category, account } = formData;
    if (!type || !date || isNaN(amount) || !category || !account) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response)
      if (response.ok) {
        toast.success("Created successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        setFormData(initialFormData);
      } else {
        toast.error("Failed to create expense.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  };
  

  return (
    <div className="d-flex">
      <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />
      <div className="flex-grow-1">
        <TopNavbar activeLink={activeLink} />
        <div className="d-flex align-items-center justify-content-center">
          <Form
            className="m-4 p-4 bg-white"
            onSubmit={handleSubmit}
            style={{
              borderRadius: "15px",
              backgroundColor: "rgba(33, 37, 41, 0.75)",
              color: "#fff",
              width: "500px",
            }}
          >
            {/* <div
              className="d-flex align-items-center justify-content-center mb-3"
              style={{ color: "#6c63ff" }}
            >
              <h3>Expense</h3>
            </div> */}
            <Form.Group controlId="formtype" className="mb-3">
              <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>
                Type
              </Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{ backgroundColor: "#6c63ff", color: "#fff" }}
              >
                <option value="Expenses">Expenses</option>
                <option value="Income">Income</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formdate" className="mb-3">
              <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>
                Date
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                placeholder="Enter Date"
                value={formData.date}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formamount" className="mb-3">
              <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>
                Amount
              </Form.Label>
              <Form.Control
                type="number"
                name="amount"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formCategory" className="mb-3">
              <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>
                Category
              </Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ backgroundColor: "#6c63ff", color: "#fff" }}
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formaccount" className="mb-3">
              <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>
                Account
              </Form.Label>
              <Form.Select
                name="account"
                value={formData.account}
                onChange={handleChange}
                style={{ backgroundColor: "#6c63ff", color: "#fff" }}
              >
                <option value="Bank Account">Bank Account</option>
                <option value="Cash">Cash</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formnote" className="mb-3">
              <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>
                Note
              </Form.Label>
              <Form.Control
                as="textarea"
                name="note"
                rows={3}
                value={formData.note}
                onChange={handleChange}
                style={{ backgroundColor: "#f8f9fa", color: "#000" }}
              />
            </Form.Group>

            <div className="d-flex align-items-center justify-content-center mt-4">
              <Button
                style={{ backgroundColor: "#6c63ff" }}
                type="submit"
                className="w-50 mb-3 border-0"
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Expenses;