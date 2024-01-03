
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProduct
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    [Range(100, Double.PositiveInfinity)]
    public long Price { get; set; }

    // 因為是使用表單，故使用 IFormFile
    // 若不是表單可以直接使用 request.Body 用 stream 接收
    public IFormFile File { get; set; }

    [Required]
    public string Type { get; set; }

    [Required]
    public string Brand { get; set; }

    [Required]
    [Range(0, 200)]
    public int QuantityInStock { get; set; }
}

