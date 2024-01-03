using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
    {
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));
        // 因為 CORS 政策, 非同源訪問得 JS 只能訪問受限的 Header, 也就是說
        // 默認情況下就算使用 UseCors 也無法訪問 Header, 故要添加訪問控制暴露
        // 的頭部有哪些, 使網頁可以使用 JS 取得頭部位。
        // 注意：Sweager 是同源的故看得到
        response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }
}
