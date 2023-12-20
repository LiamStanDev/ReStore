using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class ProductsController : BaseApiController {
    private readonly StoreContext _context;
    private readonly IMapper _mapper;
    private readonly ImageService _imageService;

    public ProductsController(StoreContext context, IMapper mapper, ImageService imageService) {
        _context = context;
        _mapper = mapper;
        _imageService = imageService;
    }

    [HttpGet("{id}", Name = "GetProduct")]
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

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDTO productDTO) {
        var product = _mapper.Map<Product>(productDTO);

        if (productDTO.File is not null) {
            var imageResult = await _imageService.AddImageAsync(productDTO.File);

            if (imageResult.Error is not null) return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

            product.PictureUrl = imageResult.SecureUrl.ToString();
            product.PublicId = imageResult.PublicId;
        }

        await _context.Products.AddAsync(product);
        var result = await _context.SaveChangesAsync() > 0;
        if (result) {
            return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);
        } else {
            return BadRequest(new ProblemDetails { Title = "Problem creating new Product..." });
        }
    }


    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProduct productDTO) {
        var product = await _context.Products.FindAsync(productDTO.Id);

        if (product is null) {
            return NotFound();
        }

        _mapper.Map(productDTO, product);

        if (productDTO.File is not null) {
            var imageResult = await _imageService.AddImageAsync(productDTO.File);

            if (imageResult.Error is not null) { return BadRequest(new ProblemDetails { Title = imageResult.Error.Message }); }

            if (!string.IsNullOrEmpty(product.PublicId)) { await _imageService.DeleteImageAsync(product.PublicId); }

            product.PictureUrl = imageResult.SecureUrl.ToString();
            product.PublicId = imageResult.PublicId;
        }

        var result = await _context.SaveChangesAsync() > 0;

        if (result) {
            return Ok(product);
        } else {
            return BadRequest(new ProblemDetails { Title = "Problem updating Product..." });
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id) {
        var product = await _context.Products.FindAsync(id);
        if (product is null) {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(product.PublicId)) { await _imageService.DeleteImageAsync(product.PublicId); }

        _context.Products.Remove(product);

        var result = await _context.SaveChangesAsync() > 0;

        if (result) {
            return Ok();
        } else {
            return BadRequest(new ProblemDetails { Title = "Problem deleting Product..." });
        }
    }
}
