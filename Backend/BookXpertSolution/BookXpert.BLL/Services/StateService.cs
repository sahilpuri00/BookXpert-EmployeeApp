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
    public class StateService : IStateService
    {
        private readonly AppDbContext _context;

        public StateService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<State>> GetAllStatesAsync()
        {
            return await _context.States.ToListAsync();
        }
    }
}
