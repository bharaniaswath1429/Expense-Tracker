import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNavbar from "../components/navbar/Navbar";
import { Table, Form, InputGroup, Pagination } from "react-bootstrap";
import { FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import "./Transactions.css";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";

const Transactions = () => {
  const [activeLink, setActiveLink] = useState("Transactions");
  const [expenses, setExpenses] = useState([]);
  const [id, setId] = useState();
  const user = JSON.parse(localStorage.getItem("user"));

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    type: "",
    date: "",
    amount: "",
    category: "",
    account: "",
    note: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setEditData({ ...item });
    setShow(true);
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
      .then((data) => setExpenses([...data]))
      .catch((error) => console.error("Error fetching employee data:", error));
  }, [id]);

  useEffect(() => {
    const sortedData = expenses.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setFilteredData(sortedData);
  }, [expenses]);

  useEffect(() => {
    const filtered = expenses.filter(
      (item) =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.note.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, expenses]);

  const handleDelete = async (itemid) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/expenses/${itemid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setExpenses((prevExpenses) =>
          prevExpenses.filter((item) => item.id !== itemid)
        );
        toast.success("Deleted successfully!");
      } else {
        toast.error("Failed to delete expense.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  };

  const categories =
    editData.type === "Expenses"
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
          "Other",
        ]
      : ["Allowance", "Salary", "Petty Cash", "Bonus", "Other"];

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/expenses/${editData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      if (response.ok) {
        setExpenses((prevExpenses) =>
          prevExpenses.map((item) =>
            item.id === editData.id ? editData : item
          )
        );
        toast.success("Transaction updated successfully!");
        handleClose();
      } else {
        toast.error("Failed to update transaction.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="d-flex">
      <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />
      <div className="flex-grow-1">
        <TopNavbar activeLink={activeLink} />
        <div className="m-4">
          {expenses.length > 0 ? (
            <div>
              <div className="d-flex align-items-center justify-content-center my-5">
                <div className="" style={{ width: "25%" }}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search by Type, Date, Category, Account"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Account</th>
                    <th>Note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="">
                        {item.type === "Income" ? (
                          <span className="text-success">
                            <FaArrowUp /> {item.type}
                          </span>
                        ) : (
                          <span className="text-danger">
                            <FaArrowDown /> {item.type}
                          </span>
                        )}
                      </td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>$ {item.amount.toLocaleString()}</td>
                      <td>{item.category}</td>
                      <td>{item.account}</td>
                      <td>{item.note}</td>
                      <td>
                        <button
                          className="btn fs-6 text-primary p-0"
                          onClick={() => handleShow(item)}
                          style={{ height: "32px", width: "32px" }}
                        >
                          <GrEdit />
                        </button>
                        <button
                          className="btn fs-5 text-danger p-0"
                          onClick={() => handleDelete(item.id)}
                          style={{ height: "32px", width: "32px" }}
                        >
                          <MdDeleteForever />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            </div>
          ) : (
            <p>No transactions found.</p>
          )}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formtype" className="mb-3">
                  <Form.Label
                    className="d-flex justify-content-start"
                    style={{ color: "#6c63ff" }}
                  >
                    Type
                  </Form.Label>
                  <Form.Select
                    name="type"
                    value={editData.type === "Income" ? "Income" : "Expense"}
                    onChange={(e) =>
                      setEditData({ ...editData, type: e.target.value })
                    }
                    style={{ backgroundColor: "#6c63ff", color: "#fff" }}
                  >
                    <option value="Expenses">Expenses</option>
                    <option value="Income">Income</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="formdate" className="mb-3">
                  <Form.Label
                    className="d-flex justify-content-start"
                    style={{ color: "#6c63ff" }}
                  >
                    Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={
                      editData.date
                        ? new Date(editData.date).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formamount" className="mb-3">
                  <Form.Label
                    className="d-flex justify-content-start"
                    style={{ color: "#6c63ff" }}
                  >
                    Amount
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({ ...editData, amount: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group controlId="formCategory" className="mb-3">
                  <Form.Label
                    className="d-flex justify-content-start"
                    style={{ color: "#6c63ff" }}
                  >
                    Category
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value })
                    }
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
                  <Form.Label
                    className="d-flex justify-content-start"
                    style={{ color: "#6c63ff" }}
                  >
                    Account
                  </Form.Label>
                  <Form.Select
                    name="account"
                    value={editData.account}
                    onChange={(e) =>
                      setEditData({ ...editData, account: e.target.value })
                    }
                    style={{ backgroundColor: "#6c63ff", color: "#fff" }}
                  >
                    <option value="Bank Account">Bank Account</option>
                    <option value="Cash">Cash</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="formnote" className="mb-3">
                  <Form.Label
                    className="d-flex justify-content-start"
                    style={{ color: "#6c63ff" }}
                  >
                    Note
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="note"
                    rows={3}
                    value={editData.note}
                    onChange={(e) =>
                      setEditData({ ...editData, note: e.target.value })
                    }
                    style={{ backgroundColor: "#f8f9fa", color: "#000" }}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
