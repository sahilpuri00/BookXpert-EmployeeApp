using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookXpert.BLL.Interfaces;
using BookXpert.DAL.Data;
using BookXpert.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace BookXpert.BLL.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            return await _context.Employees.Include(e => e.State).ToListAsync();
        }

        public async Task<Employee> GetByIdAsync(int id)
        {
            return await _context.Employees.Include(e => e.State).FirstOrDefaultAsync(e => e.EmployeeId == id);
        }

        public async Task AddAsync(Employee emp)
        {
            _context.Employees.Add(emp);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(Employee emp)
        {
            var existing = await _context.Employees.FindAsync(emp.EmployeeId);
            if (existing == null) return false;

            _context.Entry(existing).CurrentValues.SetValues(emp);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task DeleteAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp != null)
            {
                _context.Employees.Remove(emp);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<string> GetEmployeesHtmlReportAsync()
        {
            var employees = await _context.Employees.Include(e => e.State).ToListAsync();

            var html = @"
        <h2 style='text-align:center'>Employee Report</h2>
        <table border='1' cellpadding='5' cellspacing='0' width='100%'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Salary</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>State</th>
                </tr>
            </thead>
            <tbody>";

            foreach (var emp in employees)
            {
                html += $@"
            <tr>
                <td>{emp.Name}</td>
                <td>{emp.Designation}</td>
                <td>{emp.Salary}</td>
                <td>{emp.Gender}</td>
                <td>{emp.DOB.ToShortDateString()}</td>
                <td>{emp.State?.Name}</td>
            </tr>";
            }

            html += "</tbody></table>";
            return html;
        }

        public async Task<EmployeeSummaryDto> GetEmployeeSummaryAsync()
        {
            var employees = await _context.Employees
                                          .Include(e => e.State)
                                          .ToListAsync();

            var maleCount = employees.Count(e => e.Gender.ToLower() == "male" || e.Gender.ToLower() == "m");
            var femaleCount = employees.Count(e => e.Gender.ToLower() == "female" || e.Gender.ToLower() == "f");

            var stateCounts = employees
                .GroupBy(e => e.State?.Name ?? "Unknown")
                .ToDictionary(g => g.Key, g => g.Count());

            return new EmployeeSummaryDto
            {
                TotalEmployees = employees.Count,
                MaleCount = maleCount,
                FemaleCount = femaleCount,
                AverageSalary = employees.Count > 0 ? employees.Average(e => e.Salary) : 0,
                MaxSalary = employees.Count > 0 ? employees.Max(e => e.Salary) : 0,
                MinSalary = employees.Count > 0 ? employees.Min(e => e.Salary) : 0,
                StateCounts = stateCounts
            };
        }


    }
}
