import React, { useState, useEffect } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import Dashboard from './components/Dashboard';

import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔄 Load employee list from API
  const loadEmployees = async () => {
    try {
      const res = await fetch('https://localhost:7076/api/employees');
      const data = await res.json();
      setEmployees(data);
      console.log("🔄 Employee list updated");
    } catch {
      console.error("❌ Failed to fetch employees");
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="App">
      <Dashboard />
      <h1>BookXpert Employee Management</h1>

      {/* Add New Employee Form */}
      <EmployeeForm onSaved={loadEmployees} />

      {/* Employee List Table */}
      <EmployeeList
        employees={employees}
        setSelectedEmployee={setSelectedEmployee}
        setShowModal={setShowModal}
        onDeleted={loadEmployees}
      />

      {/* Modal for Editing */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <EmployeeForm
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              closeModal={() => setShowModal(false)}
              onSaved={loadEmployees}
            />
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
