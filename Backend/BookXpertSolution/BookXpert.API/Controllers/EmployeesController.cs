using BookXpert.BLL.Interfaces;
using BookXpert.DAL.Models;
using ClosedXML.Excel;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookXpert.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IConverter _converter;

        public EmployeesController(IEmployeeService employeeService, IConverter converter)
        {
            _employeeService = employeeService;
            _converter = converter;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> Get(int id)
        {
            var emp = await _employeeService.GetByIdAsync(id);
            return emp == null ? NotFound() : emp;
        }

        [HttpPost]
        public async Task<ActionResult> Post(Employee emp)
        {
            await _employeeService.AddAsync(emp);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, Employee emp)
        {
            if (id != emp.EmployeeId)
                return BadRequest("ID mismatch");

            var updated = await _employeeService.UpdateAsync(emp);
            return updated ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _employeeService.DeleteAsync(id);
            return Ok();
        }

        [HttpGet("export/pdf")]
        public async Task<IActionResult> ExportEmployeesToPdf()
        {
            var html = await _employeeService.GetEmployeesHtmlReportAsync();

            var pdf = new HtmlToPdfDocument
            {
                GlobalSettings = new GlobalSettings
                {
                    PaperSize = PaperKind.A4,
                    Orientation = Orientation.Portrait,
                    DocumentTitle = "Employee Report"
                },
                Objects = {
                    new ObjectSettings
                    {
                        HtmlContent = html,
                        WebSettings = { DefaultEncoding = "utf-8" }
                    }
                }
            };

            var pdfBytes = _converter.Convert(pdf);
            return File(pdfBytes, "application/pdf", "EmployeeReport.pdf");
        }

        [HttpGet("export/excel")]
        public async Task<IActionResult> ExportEmployeesToExcel()
        {
            var employees = (await _employeeService.GetAllAsync()).ToList();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Employees");

            worksheet.Cell(1, 1).Value = "Name";
            worksheet.Cell(1, 2).Value = "Designation";
            worksheet.Cell(1, 3).Value = "Salary";
            worksheet.Cell(1, 4).Value = "Gender";
            worksheet.Cell(1, 5).Value = "Date of Birth";
            worksheet.Cell(1, 6).Value = "State";

            for (int i = 0; i < employees.Count; i++)
            {
                var row = i + 2;
                worksheet.Cell(row, 1).Value = employees[i].Name;
                worksheet.Cell(row, 2).Value = employees[i].Designation;
                worksheet.Cell(row, 3).Value = employees[i].Salary;
                worksheet.Cell(row, 4).Value = employees[i].Gender;
                worksheet.Cell(row, 5).Value = employees[i].DOB.ToShortDateString();
                worksheet.Cell(row, 6).Value = employees[i].StateName;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "EmployeeReport.xlsx");
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var summary = await _employeeService.GetEmployeeSummaryAsync();
            return Ok(summary);
        }
    }


}
