using Entity.OrderAggregate;

namespace API.Entities.OrderAggregate;

public class CreateOrderDTO {
    public bool SaveAddress { get; set; }

    public ShippingAddress ShippingAddress { get; set; }
}
