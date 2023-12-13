using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

public static class BasketExtensions {
    public static BasketDTO MapBasketToDTO(this Basket basket) {
        return new BasketDTO {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
            Items = basket.Items.Select(i =>
                    new BasketItemDTO {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        Name = i.Product.Name,
                        Type = i.Product.Type,
                        Brand = i.Product.Brand,
                        Price = i.Product.Price,
                        PictureUrl = i.Product.PictureUrl
                    }).ToList()

        };
    }

    public static IQueryable<Basket> RetriveBasketWithItems(this IQueryable<Basket> query, string buyerId) {
        return query.Include(b => b.Items).ThenInclude(i => i.Product).Where(b => b.BuyerId == buyerId);
    }
}
