import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddTodo from "./pages/AddTodo";
import EditTodo from "./pages/EditTodo";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewTodo from "./pages/ViewTodo";

const App = () => {
  return (

    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddTodo />
            </ProtectedRoute>
          }
        />

        <Route
         path="/view/:id"
         element={
            <ProtectedRoute>
              <ViewTodo />
            </ProtectedRoute>
          } 
         />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditTodo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;