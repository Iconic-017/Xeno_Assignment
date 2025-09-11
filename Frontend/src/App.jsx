// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";
// // import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   // const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

//   return (
//     <Router>
//       <Routes>
//         {/* <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} /> */}
//         {/* <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} /> */}
//         <Route path="/" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;










import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
