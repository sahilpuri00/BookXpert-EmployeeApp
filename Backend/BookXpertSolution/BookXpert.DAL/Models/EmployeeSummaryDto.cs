using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookXpert.DAL.Models
{
    public class EmployeeSummaryDto
    {
        public int TotalEmployees { get; set; }
        public int MaleCount { get; set; }
        public int FemaleCount { get; set; }
        public decimal AverageSalary { get; set; }
        public decimal MaxSalary { get; set; }
        public decimal MinSalary { get; set; }
        public Dictionary<string, int> StateCounts { get; set; }
    }

}
