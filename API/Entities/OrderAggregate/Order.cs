namespace Entity.OrderAggregate;

using System.ComponentModel.DataAnnotations;

public class Order {
    public int Id { get; set; }
    public string BuyerId { get; set; }
    [Required]
    public ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderDay { get; set; } = DateTime.Now;
    public List<OrderItem> OrderItems { get; set; }
    public long SubTotal { get; set; }
    public long DeliveryFee { get; set; }
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
    // for Stripe
    public string PaymentIntentId { get; set; }

    public long GetTotal() {
        return SubTotal + DeliveryFee;
    }
}
