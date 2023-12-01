using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext : IdentityDbContext<User> {

    // because I need to add connection string to my StroreContext object,
    // I add this constructor. The options will pass to the base class which is 
    // DbContext.
    public StoreContext(DbContextOptions options) : base(options) { }

    public DbSet<Product> Products { get; set; }

    public DbSet<Basket> Baskets { get; set; }

    protected override void OnModelCreating(ModelBuilder builder) {
        base.OnModelCreating(builder); // is neccessary.

        builder.Entity<IdentityRole>()
            .HasData(
                 new IdentityRole { Name = "Member", NormalizedName = "MEMBER" },
                 new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" }
            );
    }
}

