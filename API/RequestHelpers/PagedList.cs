using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers;

public class PagedList<T> : List<T> {

    public PagedList(List<T> items, int count, int pageNumber, int pageSize) {
        MetaData = new MetaData {
            CurrentPage = pageNumber,
            TotalCount = count,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((count / (double)pageSize)),
        };

        AddRange(items); // method from List<T>

    }

    public MetaData MetaData { get; set; }

    public static async Task<PagedList<T>> ToPagedListAsync(IQueryable<T> query, int pageNumber, int pageSize) {
        var count = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}
