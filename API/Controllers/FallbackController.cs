using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

// 若直接輸入網址，會無法 map 到指定的 index.html
// 故要設定一個 FallBackController 尋找 index.html
[AllowAnonymous]
public class FallbackController : Controller { // Controller has view support

    public IActionResult Index() {
        // GetCurrentDirectory
        return PhysicalFile(Path.Combine(
                    Directory.GetCurrentDirectory(), "wwwroot", "index.html"), // should run in  the API folder
                    "text/HTML");
    }
}

