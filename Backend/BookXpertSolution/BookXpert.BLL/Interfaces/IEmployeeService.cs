using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookXpert.DAL.Models;

namespace BookXpert.BLL.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAllAsync();
        Task<Employee> GetByIdAsync(int id);
        Task AddAsync(Employee emp);
        Task<bool> UpdateAsync(Employee emp);
        Task DeleteAsync(int id);
        Task<string> GetEmployeesHtmlReportAsync();
        Task<EmployeeSummaryDto> GetEmployeeSummaryAsync();


    }
}
