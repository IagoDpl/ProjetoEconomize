using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [Table("planejamentos")]
    public class Planejamento 
    {
        [Key]
        public int Id { get; set; }

        public string ClienteId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Adicione o nome do Objetivo")]
        [StringLength(100)]
        public string ObjetivoNome { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Salario { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal GastosMensais { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ObjetivoValor { get; set; }

        [NotMapped]
        public decimal Saldo => Salario - GastosMensais;

        [JsonPropertyName("listaDeDespesa")]
        public List<Despesa> ListaDeDespesa { get; set; } = new List<Despesa>();
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}
