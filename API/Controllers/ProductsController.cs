using System.Text.Json;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class ProductsController : BaseApiController {
    private readonly StoreContext _context;

    public ProductsController(StoreContext context) {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id) {
        var product = await _context.Products.FindAsync(id);

        return product == null ? NotFound() : Ok(product);
    }


    // If using object as an action argument, they will persume that
    // the data is from request body. I want to use in query string, so
    // I use [FromQuery] attribute
    [HttpGet]
    public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams) {
        var query = _context.Products
            .AsQueryable()
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types);


        var products = await PagedList<Product>.ToPagedListAsync(
                query,
                productParams.PageNumber,
                productParams.PageSize
                );

        Response.AddPaginationHeader(products.MetaData);

        return Ok(products);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> GetFilters() {
        var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
        var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

        return Ok(new { brands, types });
    }
}
