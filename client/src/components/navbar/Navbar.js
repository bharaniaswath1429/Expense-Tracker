import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css';
import { BsPersonCircle } from "react-icons/bs";

const TopNavbar = ({ activeLink }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Navbar bg="light" expand="lg" className="navbar-custom">
      <Navbar.Brand className='ms-4 fs-3' style={{color:'#6c63ff', fontWeight:'500'}}>{activeLink}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end me-4'>
        <Nav className="ml-auto">
          <Nav.Link href="#" className='mx-3' style={{color:'#6c63ff'}}>
            <div className='d-flex align-items-center justify-content-center'>
                <BsPersonCircle className='me-2 fs-3'/>
                {user.name}
            </div>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default TopNavbar;