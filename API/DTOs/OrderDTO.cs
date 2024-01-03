using Entity.OrderAggregate;

namespace API.DTOs;

public class OrderDTO
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderDay { get; set; }
    public List<OrderItemDTO> OrderItems { get; set; }
    public long SubTotal { get; set; }
    public long DeliveryFee { get; set; }
    public string OrderStatus { get; set; }
    public long Total { get; set; }
}
