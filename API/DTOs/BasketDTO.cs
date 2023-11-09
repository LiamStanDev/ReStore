// Why we need DTOs
// We encounter object cycle Json Serialize problem which is 
// came from Basket has List of basket and basket has navigator 
// properties to basket. The situation is call object cycle.
// The problem came from the data we need to transmit are different
// the data we use in c# code and to Respone are different, so we 
// need DTO the shape the data.

namespace API.DTOs;

public class BasketDTO {
    public int Id { get; set; }

    public string BuyerId { get; set; }

    public List<BasketItemDTO> Items { get; set; }

}
