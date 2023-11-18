using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController : BaseApiController {
    private readonly StoreContext _context;

    public BasketController(StoreContext context) {
        _context = context;
    }

    [HttpGet(Name = "GetBasket")] // The name is for locating 201 Create.
    public async Task<ActionResult<BasketDTO>> GetBasket() {

        var basket = await RetriveBasket();

        if (basket == null) {
            return NotFound();
        }

        var basketDTO = MapBasketToDTO(basket);
        return Ok(basketDTO);
    }

    [HttpPost]
    public async Task<ActionResult<BasketDTO>> AddItemToBasket(int productId, int quantity) {
        var basket = await RetriveBasket();
        if (basket == null) basket = await CreateBasket();

        var product = await _context.Products.FindAsync(productId);
        if (product == null) return BadRequest(new ProblemDetails { Title = "Product Not Found" });

        basket.AddItem(product, quantity);

        var result = await _context.SaveChangesAsync() > 0;

        if (result) {
            // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
            // The standard 201 respones needs the location which indicate how
            // to get the new create resource in response header.

            // 1. Only return 201
            // return StatusCode(201); // 201 mean new create.

            // 2. Using the Created method which is not easy to use.
            // return Created("http://localhost:5000/api/Basket", MapBasketToDTO(basket));

            // 3. Using CreatedAtRoute method the first string is the Name property of controller action.
            return CreatedAtRoute("GetBasket", MapBasketToDTO(basket));
        }
        return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity) {
        var basket = await RetriveBasket();

        if (basket == null) {
            return NotFound();
        }

        var product = await _context.Products.FindAsync(productId);
        if (product == null) {
            return BadRequest(new ProblemDetails { Title = "Problem removing item from basket" });
        }

        basket.RemoveItem(productId, quantity);

        var result = await _context.SaveChangesAsync() > 0;

        if (result) {
            return Ok();
        }
        return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });

    }


    private async Task<Basket> RetriveBasket() {
        var basket = await _context.Baskets
            .Include(b => b.Items) // navigator should be include specifically
            .ThenInclude(i => i.Product)  // BasketItem has product navigator
            .FirstOrDefaultAsync(b => b.BuyerId == Request.Cookies["buyerId"]);
        return basket;
    }

    private async Task<Basket> CreateBasket() {
        var buyerId = Guid.NewGuid().ToString();

        var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
        Response.Cookies.Append("buyerId", buyerId, cookieOptions);

        var basket = new Basket { BuyerId = buyerId };

        await _context.Baskets.AddAsync(basket);

        return basket;
    }

    private BasketDTO MapBasketToDTO(Basket basket) {
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
}
