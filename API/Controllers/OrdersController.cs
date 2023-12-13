namespace API.Controllers;

using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using Entity.OrderAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
public class OrdersController : BaseApiController {
    private readonly StoreContext _context;

    public OrdersController(StoreContext context) {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDTO>>> GetOrders() {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.BuyerId == User.Identity.Name)
            .MapOrderToDTO()
            .ToListAsync();

        return orders;
    }

    [HttpGet("{id}", Name = "GetOrder")]
    public async Task<ActionResult<OrderDTO>> GetOrder(int id) {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.BuyerId == User.Identity.Name && o.Id == id)
            .MapOrderToDTO()
            .FirstOrDefaultAsync();
        return order;
    }

    [HttpPost]
    // 其實這邊返回值，因為我偷懶所以應該寫成 Task<ActionResult<int>>
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDTO orderDTO) {
        var basket = await _context.Baskets
            .AsQueryable()
            .RetriveBasketWithItems(User.Identity.Name)
            .FirstOrDefaultAsync();

        if (basket == null) {
            return BadRequest(new ProblemDetails {
                Title = "Could not locate basket"
            });
        }

        var items = new List<OrderItem>();

        foreach (var item in basket.Items) {
            // 下單時需要確保是新的價格，因為價格可能會改變。
            var productItem = await _context.Products.FindAsync(item.ProductId);

            var itemOrdered = new ProductItemOrdered {
                ProductId = productItem.Id,
                Name = productItem.Name,
                PictureUrl = productItem.PictureUrl
            };

            var orderItem = new OrderItem {
                ItemOrdered = itemOrdered,
                Price = productItem.Price,
                Quantity = item.Quantity
            };

            items.Add(orderItem);

            productItem.QuantityInStock -= item.Quantity;
        }

        var subtotal = items.Sum(i => i.Price * i.Quantity);
        var deliveryFee = subtotal > 10000 ? 0 : 500;

        var order = new Order {
            OrderItems = items,
            BuyerId = User.Identity.Name,
            SubTotal = subtotal,
            DeliveryFee = deliveryFee,
            ShippingAddress = orderDTO.ShippingAddress
        };

        await _context.Orders.AddAsync(order);
        _context.Baskets.Remove(basket);

        if (orderDTO.SaveAddress) {
            var user = await _context.Users
                .Include(u => u.Address)
                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
            var address = new UserAddress {
                FullName = orderDTO.ShippingAddress.FullName,
                Address1 = orderDTO.ShippingAddress.Address1,
                Address2 = orderDTO.ShippingAddress.Address2,
                City = orderDTO.ShippingAddress.City,
                State = orderDTO.ShippingAddress.State,
                Country = orderDTO.ShippingAddress.Country,
                ZipCode = orderDTO.ShippingAddress.ZipCode
            };
            user.Address = address;
            // _context.Update(user); // 沒有必要
        }


        var result = await _context.SaveChangesAsync() > 0;

        // 第二個參數用於使用 GetOrder 時候所要傳入的參數，第三個可以反為新建立的Order
        // 物件，但是這邊覺得前端沒必要知道，所以就傳了個 Id 填充就好。
        if (result) return CreatedAtRoute("GetOrder", new { Id = order.Id }, order.Id);

        return BadRequest("Problem creating order");
    }

}
