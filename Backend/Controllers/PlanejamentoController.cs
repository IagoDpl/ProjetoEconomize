using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanejamentoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlanejamentoController(AppDbContext context)
        {
            _context = context;
        }

        private string GetClienteId()
        {
            if (Request.Headers.TryGetValue("x-cliente-id", out var id))
                return id.ToString();
            return "anonimo";
        }

        [HttpGet]
        public async Task<IActionResult> GetTodos()
        {
            var clienteId = GetClienteId();

            var lista = await _context.Planejamentos
                .Include(x => x.ListaDeDespesa) // Traz os gastos juntos
                .Where(x => x.ClienteId == clienteId) // <--- O SEGREDO: SÓ TRAZ O MEU!
                .OrderByDescending(x => x.Id) // Mais recentes primeiro
                .ToListAsync();

            return Ok(lista);
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] Planejamento planejamento)
        {
            // Carimba o ID do cliente antes de salvar
            planejamento.ClienteId = GetClienteId();

            _context.Planejamentos.Add(planejamento);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodos), new { id = planejamento.Id }, planejamento);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] Planejamento input)
        {
            var clienteId = GetClienteId();

            // 1. Busca o planejamento antigo E suas despesas atuais
            var itemExistente = await _context.Planejamentos
                    .Include(x => x.ListaDeDespesa)
                    .FirstOrDefaultAsync(x => x.Id == id && x.ClienteId == clienteId);

            if (itemExistente == null) return NotFound();

            // 2. Atualiza os dados básicos (Salário, Meta, Nome...)
            itemExistente.ObjetivoNome = input.ObjetivoNome;
            itemExistente.ObjetivoValor = input.ObjetivoValor;
            itemExistente.Salario = input.Salario;
            itemExistente.GastosMensais = input.GastosMensais;

            // --- A CORREÇÃO MÁGICA ---
            // Removemos explicitamente as despesas antigas do Banco de Dados
            if (itemExistente.ListaDeDespesa.Any())
            {
                _context.Despesas.RemoveRange(itemExistente.ListaDeDespesa);
            }

            // 3. Adiciona as novas despesas limpinhas
            if (input.ListaDeDespesa != null)
            {
                foreach (var item in input.ListaDeDespesa)
                {
                    itemExistente.ListaDeDespesa.Add(new Despesa
                    {
                        Nome = item.Nome,
                        Valor = item.Valor
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(itemExistente);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var clienteId = GetClienteId();

            // Só deixa apagar se for meu
            var planejamento = await _context.Planejamentos
                .FirstOrDefaultAsync(x => x.Id == id && x.ClienteId == clienteId);

            if (planejamento == null) return NotFound();

            _context.Planejamentos.Remove(planejamento);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}