using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookXpert.DAL.Models
{
    public class EmployeeDto
    {
        public int EmployeeId { get; set; }
        public string Name { get; set; }
        public string Designation { get; set; }
        public DateTime DateOfJoin { get; set; }
        public decimal Salary { get; set; }
        public string Gender { get; set; }
        public DateTime DOB { get; set; }
        public int StateId { get; set; }
        public string StateName { get; set; }
    }

}
