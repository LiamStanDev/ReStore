namespace Entity.OrderAggregate;

using Microsoft.EntityFrameworkCore;

/*
 * Owned means thant don't create a table for this.
 * This is owned by other table, so the properties
 * in the ShippingAddress is stored in Order class.
 */
[Owned]
public class ShippingAddress : Address
{

}
