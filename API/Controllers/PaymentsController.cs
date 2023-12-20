using API.Data;
using API.DTOs;
using Entity.OrderAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Services;
using Stripe;

namespace API.Controllers;

public class PaymentsController : BaseApiController {
    private readonly PaymentService _paymentService;
    private readonly StoreContext _context;
    private readonly IConfiguration _config;

    public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config) {
        _paymentService = paymentService;
        _context = context;
        _config = config;
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

        // if (!result) {
        //     return BadRequest(new ProblemDetails {
        //         Title = "Problem updating basket with intent"
        //     });
        // }

        return basket.MapBasketToDTO();
    }

    [HttpPost("webhook")]
    public async Task<ActionResult> StripeWebHook() {
        // from stream to stream reader
        StreamReader sr = new StreamReader(Request.Body);
        var json = await sr.ReadToEndAsync();

        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _config["StripeSettings:WHSecret"]);
        var chargeEvent = stripeEvent.Data.Object as Charge;

        var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == chargeEvent.PaymentIntentId);

        if (chargeEvent.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

        await _context.SaveChangesAsync();

        return new EmptyResult(); // just let stripe know we receive
    }
}



