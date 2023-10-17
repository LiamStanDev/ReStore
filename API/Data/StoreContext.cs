using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext : DbContext {

    // because I need to add connection string to my StroreContext object,
    // I add this constructor. The options will pass to the base class which is 
    // DbContext.
    public StoreContext(DbContextOptions options) : base(options) {
    }

    public DbSet<Product> Products { get; set; }
}

