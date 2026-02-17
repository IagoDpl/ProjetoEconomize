using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Despesa
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [JsonPropertyName("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        [JsonPropertyName("valor")]
        public decimal Valor { get; set; }

        public string Categoria { get; set; } = "Fixo";

        public int PlanejamentoId { get; set; }
    }
}
