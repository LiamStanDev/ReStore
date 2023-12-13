using API.Entities;
using Entity.OrderAggregate;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;
/*
 * The the third generic type means the user and role use
 * int as primary key
 */
public class StoreContext : IdentityDbContext<User, Role, int> {

    // because I need to add connection string to my StroreContext object,
    // I add this constructor. The options will pass to the base class which is 
    // DbContext.
    public StoreContext(DbContextOptions options) : base(options) { }

    public DbSet<Product> Products { get; set; }

    public DbSet<Basket> Baskets { get; set; }

    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder builder) {
        base.OnModelCreating(builder); // is neccessary.

        // 這麼做主要是希望不要有navigator
        // 不然等等又要寫 DTO Mapping 方法
        builder.Entity<User>()
            .HasOne(u => u.Address)
            .WithOne() // UserAddressAddress 沒有 navigator 指向 User
            .HasForeignKey<UserAddress>(a => a.Id) // User 有 ForeignKey 指向 UserAddress 的 Id
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Role>()
            .HasData(
                 new Role { Id = 1, Name = "Member", NormalizedName = "MEMBER" },
                 new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
            );
    }
}

