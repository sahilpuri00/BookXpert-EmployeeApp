import React, { useEffect, useState } from 'react';

function EmployeeForm({ selectedEmployee, setSelectedEmployee, closeModal, onSaved }) {
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    dateOfJoin: '',
    salary: '',
    gender: '',
    dob: '',
    stateId: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('https://localhost:7076/api/states')
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(() => setStatus('❌ Failed to fetch states'));
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name,
        designation: selectedEmployee.designation,
        dateOfJoin: selectedEmployee.dateOfJoin?.split('T')[0],
        salary: selectedEmployee.salary,
        gender: selectedEmployee.gender,
        dob: selectedEmployee.dob?.split('T')[0],
        stateId: selectedEmployee.stateId
      });
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.salary || isNaN(formData.salary) || parseFloat(formData.salary) <= 0) newErrors.salary = "Salary must be a positive number";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob || new Date(formData.dob) >= new Date()) newErrors.dob = "DOB must be before today";
    if (!formData.stateId) newErrors.stateId = "State is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setStatus("❌ Please fix errors");
      return;
    }

    const payload = {
      employeeId: selectedEmployee?.employeeId || 0,
      ...formData,
      salary: parseFloat(formData.salary),
      stateId: parseInt(formData.stateId)
    };

    const url = selectedEmployee
      ? `https://localhost:7076/api/employees/${selectedEmployee.employeeId}`
      : 'https://localhost:7076/api/employees';

    const method = selectedEmployee ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setStatus("✅ Saved successfully");
      if (onSaved) onSaved();                             // <-- Refresh list
      if (setSelectedEmployee) setSelectedEmployee(null); // <-- Clear editing
      if (closeModal) closeModal();                       // <-- Close modal
      setFormData({
        name: '', designation: '', dateOfJoin: '',
        salary: '', gender: '', dob: '', stateId: ''
      });
    } else {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      setStatus(`❌ Error saving employee: ${response.statusText}`);
    }
  };

  return (
    <div>
      <h2>{selectedEmployee ? "Edit Employee" : "Add Employee"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name *" />
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
        </div>

        <div>
          <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" />
        </div>

        <div>
          <input name="dateOfJoin" type="date" value={formData.dateOfJoin} onChange={handleChange} />
        </div>

        <div>
          <input name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Salary *" />
          {errors.salary && <span style={{ color: 'red' }}>{errors.salary}</span>}
        </div>

        <div>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          {errors.gender && <span style={{ color: 'red' }}>{errors.gender}</span>}
        </div>

        <div>
          <input name="dob" type="date" value={formData.dob} onChange={handleChange} />
          {errors.dob && <span style={{ color: 'red' }}>{errors.dob}</span>}
        </div>

        <div>
          <select name="stateId" value={formData.stateId} onChange={handleChange}>
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.stateId} value={state.stateId}>{state.name}</option>
            ))}
          </select>
          {errors.stateId && <span style={{ color: 'red' }}>{errors.stateId}</span>}
        </div>

        <button type="submit">{selectedEmployee ? "Update" : "Submit"}</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default EmployeeForm;
