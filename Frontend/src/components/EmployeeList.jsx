import React, { useState } from 'react';

function EmployeeList({ employees, setSelectedEmployee, setShowModal, onDeleted }) {
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await fetch(`https://localhost:7076/api/employees/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        onDeleted(); // reload employee list
      } else {
        alert("❌ Failed to delete employee.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error connecting to the server.");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  return (
    <div>
      <h3>Employee List</h3>

      {/* Export buttons */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => window.open('https://localhost:7076/api/employees/export/excel', '_blank')}>
          📄 Export to Excel
        </button>
        <button onClick={() => window.open('https://localhost:7076/api/employees/export/pdf', '_blank')}>
          🧾 Export to PDF
        </button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Date of Join</th>
            <th>Salary</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length === 0 ? (
            <tr><td colSpan="8">No employees found.</td></tr>
          ) : (
            currentEmployees.map(emp => (
              <tr key={emp.employeeId}>
                <td
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => handleEdit(emp)}
                >
                  {emp.name}
                </td>
                <td>{emp.designation}</td>
                <td>{emp.dateOfJoin?.split('T')[0]}</td>
                <td>{emp.salary}</td>
                <td>{emp.gender}</td>
                <td>{emp.dob?.split('T')[0]}</td>
                <td>{emp.stateName ?? 'N/A'}</td>
                <td>
                  <button onClick={() => handleEdit(emp)}>Edit</button>
                  <button onClick={() => handleDelete(emp.employeeId)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: '10px' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
          <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
