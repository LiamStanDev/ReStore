namespace Services;

using API.Entities;
using Stripe;

public class PaymentService {
    private readonly IConfiguration _config;

    public PaymentService(IConfiguration config) {
        _config = config;
    }


    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket) {

        StripeConfiguration.ApiKey = _config["StripeSettings:ScretKey"];

        var service = new PaymentIntentService();
        var intent = new PaymentIntent();

        var subtotal = basket.Items.Sum(i => i.Quantity * i.Product.Price);
        var deliveryFee = subtotal > 1000 ? 0 : 500;

        // Create
        if (string.IsNullOrEmpty(basket.PaymentIntentId)) {
            var options = new PaymentIntentCreateOptions {
                Amount = subtotal + deliveryFee,
                Currency = "usd", // us dollar
                PaymentMethodTypes = new List<string>() { "card" },
            };

            intent = await service.CreateAsync(options);
        } else {  // Update
            var options = new PaymentIntentUpdateOptions {
                Amount = subtotal + deliveryFee
            };

            intent = await service.UpdateAsync(basket.PaymentIntentId, options);
        }
        return intent;
    }
}
