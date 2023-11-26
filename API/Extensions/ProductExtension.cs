using API.Entities;

namespace API.Extensions;

public static class ProductExtension {
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy) {
        if (string.IsNullOrWhiteSpace(orderBy)) {
            return query.OrderBy(p => p.Name);
        }
        var querySorted = orderBy switch {
            "price" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            _ => query.OrderBy(p => p.Name)
        };

        return querySorted;
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm) {
        if (string.IsNullOrEmpty(searchTerm)) return query;

        var lowerCaseSearchIerm = searchTerm.Trim().ToLower();

        return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchIerm));
    }

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types) {
        HashSet<string> brandSet = new();
        HashSet<string> typeSet = new();

        if (!string.IsNullOrEmpty(brands)) {
            foreach (var brand in brands.ToLower().Split(",")) {
                brandSet.Add(brand);
            }
        }

        if (!string.IsNullOrEmpty(types)) {
            foreach (var type in types.ToLower().Split(",")) {
                typeSet.Add(type);
            }
        }

        var filteredQuery = query.Where(p => brandSet.Count == 0 || brandSet.Contains(p.Brand));
        filteredQuery = filteredQuery.Where(p => typeSet.Count == 0 || typeSet.Contains(p.Type));

        return filteredQuery;
    }
}
