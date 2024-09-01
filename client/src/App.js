import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { ErrorPage, Login, Signup, Dashboard, Home, Expenses, Transactions, Stats, Bills } from './pages';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
       <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses/></ProtectedRoute>} />
          <Route path="/bills" element={<ProtectedRoute><Bills/></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions/></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><Stats/></ProtectedRoute>} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
