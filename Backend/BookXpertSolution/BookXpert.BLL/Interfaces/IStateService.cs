using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookXpert.DAL.Models;

namespace BookXpert.BLL.Interfaces
{
    public interface IStateService
    {
        Task<IEnumerable<State>> GetAllStatesAsync();
    }
}
