using Microsoft.AspNetCore.Identity;


// 因為 UserAddress 是用 int 作為 Id
// IdentityUser 默認使用 string 作為 Id，
// 所以使用 IdentityUser<int> 將Primary key 設定為
// int，這樣可以統一 Id 為 int
public class User : IdentityUser<int>
{
    public UserAddress Address { get; set; }
}
