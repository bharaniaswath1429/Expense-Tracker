import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import './Sidebar.css';
import links from '../../data/links';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sidebar = ({ activeLink, setActiveLink }) => {
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    setActiveLink(link.name);
    navigate(link.path);
  };

  const logout = () => {
    toast.success("Logging out!")
    navigate('/login')
    localStorage.clear();
  }

  return (
    <div className="sidebar d-flex flex-column vh-100 position-relative" style={{backgroundColor:'#6c63ff'}}>
        <div className='d-flex align-items-center justify-content-center py-3' style={{borderBottom:'2px solid white'}}>
        <h2>Expense Tracker</h2>
        </div>
      <Nav className="flex-column align-items-center justify-content-center py-3" style={{width:'100%'}}>
      {links.map((link, index) => (
        <Nav.Link key={index} href={link.path} onClick={() => handleLinkClick(link)} className={`text-white py-3 d-flex align-items-center justify-content-center navli ${activeLink === link.name ? 'active' : ''}`} style={{width:'100%', fontWeight:'500'}}>
          {link.name}
        </Nav.Link>
      ))}
      <Nav.Item className='position-absolute' style={{bottom:'10%'}}><Button onClick={logout} className='fw-bold bg-white btn1' style={{color:'#6c63ff', border:"2px solid #6c63ff"}}>Logout</Button></Nav.Item>
      </Nav>
    </div>
  );
}

export default Sidebar;