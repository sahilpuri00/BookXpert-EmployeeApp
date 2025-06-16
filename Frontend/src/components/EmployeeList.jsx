import React, { useState } from 'react';

function EmployeeList({ employees, setSelectedEmployee, setShowModal, onDeleted }) {
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(employees.length / pageSize);
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    const response = await fetch(`https://localhost:7076/api/employees/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setStatus("✅ Employee deleted");
      if (onDeleted) onDeleted();
    } else {
      setStatus("❌ Failed to delete employee");
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Employee List</h2>
      {status && <p style={{ color: 'red' }}>{status}</p>}

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.length === 0 ? (
            <tr><td colSpan="7">No employees found</td></tr>
          ) : (
            paginatedEmployees.map(emp => (
              <tr key={emp.employeeId}>
                <td>{emp.name}</td>
                <td>{emp.designation}</td>
                <td>{emp.salary}</td>
                <td>{emp.gender}</td>
                <td>{emp.dob?.split('T')[0]}</td>
                <td>{emp.state?.name || 'N/A'}</td>
                <td>
                  <button onClick={() => handleDelete(emp.employeeId)}>Delete</button>
                  <button onClick={() => {
                    setSelectedEmployee(emp);
                    setShowModal(true);
                  }}>Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: '15px' }}>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>⬅ Prev</button>
        <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next ➡</button>
      </div>
      <button
  onClick={() => window.open('https://localhost:7076/api/employees/export/pdf')}
  style={{ marginBottom: '10px' }}
>
  📄 Export to PDF
</button>
<button onClick={() => window.open("https://localhost:7076/api/employees/export/excel")}>
  📥 Export to Excel
</button>


    </div>
  );
}

export default EmployeeList;
