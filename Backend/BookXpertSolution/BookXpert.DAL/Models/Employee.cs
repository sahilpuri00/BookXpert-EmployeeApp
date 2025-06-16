using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace BookXpert.DAL.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Designation { get; set; }

        public DateTime DateOfJoin { get; set; }

        public decimal Salary { get; set; }

        public string Gender { get; set; }

        public DateTime DOB { get; set; }

        [NotMapped]
        public int Age => DateTime.Now.Year - DOB.Year;

        public int StateId { get; set; }

        [JsonIgnore]
        public State? State { get; set; }
    }
}
