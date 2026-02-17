using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarteiraController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarteiraController(AppDbContext context)
        {
            _context = context;
        }

        // Função auxiliar para pegar o ID do cabeçalho da requisição
        private string GetClienteId()
        {
            // O frontend vai mandar um cabeçalho chamado "x-cliente-id"
            // Se não vier nada, usamos "anonimo" (segurança básica)
            if (Request.Headers.TryGetValue("x-cliente-id", out var id))
            {
                return id.ToString();
            }
            return "anonimo";
        }

        // GET: api/carteira (Pega o saldo do usuário)
        [HttpGet]
        public async Task<IActionResult> GetSaldo()
        {
            var clienteId = GetClienteId();

            // Busca a carteira DESTE cliente específico
            var carteira = await _context.Carteiras
                .FirstOrDefaultAsync(x => x.ClienteId == clienteId);

            // Se esse cliente nunca entrou, cria uma carteira zerada pra ele agora
            if (carteira == null)
            {
                carteira = new Carteira { Saldo = 0, ClienteId = clienteId };
                _context.Carteiras.Add(carteira);
                await _context.SaveChangesAsync();
            }

            return Ok(carteira);
        }

        // POST: api/carteira (Atualiza o saldo)
        [HttpPost]
        public async Task<IActionResult> AtualizarSaldo([FromBody] Carteira dados)
        {
            var clienteId = GetClienteId();

            var carteira = await _context.Carteiras
                .FirstOrDefaultAsync(x => x.ClienteId == clienteId);

            if (carteira == null)
            {
                carteira = new Carteira { ClienteId = clienteId };
                _context.Carteiras.Add(carteira);
            }

            // Atualiza o valor com o que veio do frontend
            carteira.Saldo = dados.Saldo;

            await _context.SaveChangesAsync();
            return Ok(carteira);
        }
    }
}