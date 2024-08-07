import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='' style={{height:'100vh', backgroundColor:'#6c63ff'}}>
      <div className='d-flex align-items-center justify-content-center' style={{height:'80%'}}>
        <div>
          <h1 className='text-white fw-bold m-5' style={{fontSize:"100px"}}>Expense Tracker</h1>
          <div className='d-flex align-items-center justify-content-center'>
            <button className='btn losig me-4 fw-bold' onClick={()=> navigate('/signup')}>Signup</button>
            <button className='btn losig ms-4 fw-bold' onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home