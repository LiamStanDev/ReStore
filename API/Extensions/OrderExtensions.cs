using API.DTOs;
using Entity.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class OrderExtensions
{

    public static IQueryable<OrderDTO> MapOrderToDTO(this IQueryable<Order> query)
    {
        return query
            .AsNoTracking()
            .Select(o => new OrderDTO
            {
                Id = o.Id,
                ShippingAddress = o.ShippingAddress,
                Total = o.GetTotal(),
                BuyerId = o.BuyerId,
                OrderDay = o.OrderDay,
                SubTotal = o.SubTotal,
                OrderStatus = o.OrderStatus.ToString(),
                DeliveryFee = o.DeliveryFee,
                OrderItems = o.OrderItems.Select(i => new OrderItemDTO
                {
                    Name = i.ItemOrdered.Name,
                    ProductId = i.ItemOrdered.ProductId,
                    Price = i.Price,
                    Quantity = i.Quantity,
                    PictureUrl = i.ItemOrdered.PictureUrl
                }).ToList()
            });
    }
}
