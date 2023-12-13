using Microsoft.AspNetCore.Identity;

// 因為 IdentityUser 使用 int 作為 Id
// 所以 IdentityRole 也設定為 int 會比較方便
public class Role : IdentityRole<int> {

}
