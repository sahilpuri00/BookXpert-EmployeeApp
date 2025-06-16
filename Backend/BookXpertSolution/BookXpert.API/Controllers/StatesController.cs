using BookXpert.BLL.Interfaces;
using BookXpert.DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace BookXpert.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatesController : ControllerBase
    {
        private readonly IStateService _stateService;

        public StatesController(IStateService stateService)
        {
            _stateService = stateService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<State>>> Get()
        {
            var states = await _stateService.GetAllStatesAsync();
            return Ok(states);
        }
    }

}
