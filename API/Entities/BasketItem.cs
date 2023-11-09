using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("BasketItems")]
public class BasketItem {
    public int Id { get; set; }
    public int Quantity { get; set; }

    // navigation properties
    // I use convension so I don't need to use
    // Fluent API or Data Annotation.
    public int ProductId { get; set; }
    public Product Product { get; set; }

    public int BasketId { get; set; }
    public Basket Basket { get; set; }
}

