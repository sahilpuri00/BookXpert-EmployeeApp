import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('https://localhost:7076/api/employees/summary')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch summary');
        return res.json();
      })
      .then(data => setSummary(data))
      .catch(err => {
        console.error(err);
        setStatus("❌ Could not load summary data.");
      });
  }, []);

  if (!summary) return <p>{status || "Loading summary..."}</p>;

  return (
    <div>
      <h2>📊 Employee Summary Dashboard</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div className="card">👥 Total: {summary.totalEmployees}</div>
        <div className="card">👨 Male: {summary.maleCount}</div>
        <div className="card">👩 Female: {summary.femaleCount}</div>
        <div className="card">💰 Avg Salary: ₹{summary.averageSalary.toFixed(2)}</div>
        <div className="card">⬆ Max Salary: ₹{summary.maxSalary.toFixed(2)}</div>
        <div className="card">⬇ Min Salary: ₹{summary.minSalary.toFixed(2)}</div>
      </div>

      <h3>📍 Employees by State</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>State</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary.stateCounts).map(([state, count]) => (
            <tr key={state}>
              <td>{state}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
