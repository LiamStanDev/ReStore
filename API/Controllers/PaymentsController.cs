using API.Data;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services;

namespace API.Controllers;

public class PaymentsController : BaseApiController {
    private readonly PaymentService _paymentService;
    private readonly StoreContext _context;

    public PaymentsController(PaymentService paymentService, StoreContext context) {
        _paymentService = paymentService;
        _context = context;
    }


    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDTO>> CreateOrUpdatePaymentIntent() {
        var basket = await _context.Baskets
                    .RetriveBasketWithItems(User.Identity.Name)
                    .FirstOrDefaultAsync();

        if (basket == null) {
            return NotFound();
        }

        var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

        if (intent == null) {
            return BadRequest(new ProblemDetails {
                Title = "Problem creating payment intent"
            });
        }

        basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
        basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) {
            return BadRequest(new ProblemDetails {
                Title = "Problem updating basket with intent"
            });
        }

        return basket.MapBasketToDTO();
    }
}



