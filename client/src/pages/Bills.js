import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNavbar from "../components/navbar/Navbar";
import { Form, Button, Modal, Table, Pagination, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { GrDocumentPdf } from "react-icons/gr"; // Import for "View Bill" link

const Bills = () => {
  const [activeLink, setActiveLink] = useState("Bills");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [billData, setBillData] = useState({ id: "", name: "", description: "" });
  const [pendingBill, setPendingBill] = useState(null); // To store the bill for pending modal
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [uploading, setUploading] = useState(false); // To track uploading status
  const user = JSON.parse(localStorage.getItem("user"));

  // Set user ID in bill data
  useEffect(() => {
    if (user.id) {
      setBillData((prevData) => ({ ...prevData, id: user.id }));
    }
  }, [user.id]);

  // Fetch bills on load
  useEffect(() => {
    if (billData.id) {
      fetch(`http://localhost:8000/api/bills/${billData.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setBills(data))
        .catch((error) => console.error("Error fetching bill data:", error));
    }
  }, [billData.id]);

  // Sort bills by date and set filtered data
  useEffect(() => {
    const sortedData = bills.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredData(sortedData);
  }, [bills]);

  // Filter bills based on search term
  useEffect(() => {
    const filtered = bills.filter(
      (bill) =>
        bill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, bills]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission to create a new bill
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description } = billData;
    if (!name || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });
      if (response.ok) {
        const newBill = await response.json();
        toast.success("Bill saved successfully!");
        setBills((prevBills) => [...prevBills, newBill]);
        setBillData([]);
        handleCloseCreateModal();
      } else {
        toast.error("Failed to create bill.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  };

  // Handle deleting a bill
  const handleDelete = async (billId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bills/${billId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setBills((prevBills) => prevBills.filter((bill) => bill.id !== billId));
        toast.success("Bill deleted successfully!");
      } else {
        toast.error("Failed to delete bill.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle modal visibility
  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleShowPendingModal = (bill) => {
    setPendingBill(bill);
    setShowPendingModal(true);
  };
  const handleClosePendingModal = () => setShowPendingModal(false);

  // Handle upload screenshot
  const handleFileChange = (e) => {
    setBillData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handlePendingSubmit = async () => {
    if (!pendingBill) return;
    try {
      // Mock save functionality (upload image if present)
      const formData = new FormData();
      formData.append("id", pendingBill.id);
      formData.append("name", pendingBill.name);
      formData.append("description", pendingBill.description);
      if (billData.image) {
        formData.append("image", billData.image);
      }

      const response = await fetch(`http://localhost:8000/api/bills/${pendingBill.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        setUploading(true);
        toast.success("Bill updated successfully!");
      } else {
        toast.error("Failed to update bill.");
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
        <div className="m-4">
          <div className="d-flex align-items-center justify-content-start mt-4">
            <button className="btn btn-primary" onClick={() => handleShowCreateModal()}>Create Bill</button>
          </div>
          {bills.length > 0 ? (
            <div>
              <div className="d-flex align-items-center justify-content-center my-5">
                <div style={{ width: "25%" }}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search by Name or Description"
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
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Delete Bill</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((bill) => (
                    <tr key={bill.id}>
                      <td>{bill.name}</td>
                      <td >{bill.description}</td>
                      <td>
                        <button
                          className={`btn ${uploading ? "btn-success" : "btn-primary"} fs-6 p-1`}
                          onClick={() => handleShowPendingModal(bill)}
                        >
                          {uploading ? "Completed" : "Pending"}
                        </button>
                        {uploading && (
                          <a href={`http://localhost:8000/api/bills/${bill.id}/view`} target="_blank" rel="noopener noreferrer">
                            <GrDocumentPdf className="ms-2" />
                          </a>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn fs-5 text-danger p-0"
                          onClick={() => handleDelete(bill.id)}
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
            <p>No bills found.</p>
          )}
        </div>
      </div>

      {/* Create Bill Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBillName">
              <Form.Label>Bill Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter bill name"
                value={billData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBillDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                placeholder="Enter bill description"
                value={billData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button className="mt-3" variant="primary" type="submit">
              Save Bill
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Pending Bill Modal */}
      <Modal show={showPendingModal} onHide={handleClosePendingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Pending Bill Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingBill && (
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={pendingBill.name}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  value={pendingBill.description}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Upload Screenshot</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Button className="mt-3 me-3" variant="primary" onClick={handlePendingSubmit}>
                Save
              </Button>
              <Button className="mt-3 ms-3" variant="secondary" onClick={handleClosePendingModal}>
                Cancel
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Bills;