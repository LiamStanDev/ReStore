using API.Data;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
	private readonly UserManager<User> _userManager;
	private readonly TokenService _tokenService;
	private readonly StoreContext _context;

	public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService, StoreContext context)
	{
		_userManager = userManager;
		_tokenService = tokenService;
		_context = context;
	}

	[HttpPost("login")]
	public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
	{
		var user = await _userManager.FindByNameAsync(loginDTO.UserName);
		if (user == null || !await _userManager.CheckPasswordAsync(user, loginDTO.Password))
		{
			return Unauthorized();
		}

		var userBasket = await RetriveBasket(user.UserName);
		var anonBasket = await RetriveBasket(Request.Cookies["buyerId"]);

		if (anonBasket != null)
		{
			if (userBasket != null)
			{
				_context.Baskets.Remove(userBasket);
			}
			anonBasket.BuyerId = user.UserName;
			Response.Cookies.Delete("buyerId");

			await _context.SaveChangesAsync();
		}


		var userDTO = new UserDTO
		{
			Email = user.Email,
			Token = await _tokenService.GenerateToken(user),
			// the ? before MapBasketToDTO is used because
			// userBasket and anonBasket may both null
			Basket = (anonBasket != null ? anonBasket : userBasket)?.MapBasketToDTO()
		};

		return Ok(userDTO);
	}

	[HttpPost("register")]
	public async Task<IActionResult> Register(RegisterDTO registerDTO)
	{
		var newUser = new User { UserName = registerDTO.UserName, Email = registerDTO.Email };

		var result = await _userManager.CreateAsync(newUser, registerDTO.Password);

		if (!result.Succeeded)
		{
			foreach (var error in result.Errors)
			{
				ModelState.AddModelError(error.Code, error.Description);
			}
			return ValidationProblem();
		}

		await _userManager.AddToRoleAsync(newUser, "Member");
		return StatusCode(201);
	}


	// [Authorize(AuthenticationSchemes = "Bearer")]
	[Authorize]
	[HttpGet("currentUser")]
	public async Task<ActionResult<UserDTO>> GetCurrentUser()
	{
		// User is from controller base.
		var user = await _userManager.FindByNameAsync(User.Identity.Name);

		var userBasket = await RetriveBasket(User.Identity.Name);

		var userDTO = new UserDTO
		{
			Email = user.Email,
			Token = await _tokenService.GenerateToken(user),
			Basket = userBasket?.MapBasketToDTO()
		};

		return Ok(userDTO);
	}

	[Authorize]
	[HttpGet("savedAddress")]
	public async Task<ActionResult<UserAddress>> GetSavedAddress()
	{
		return await _userManager.Users
			.Where(u => u.UserName == User.Identity.Name)
			.Select(u => u.Address)
			.FirstOrDefaultAsync();
	}


	private async Task<Basket> RetriveBasket(string buyerId)
	{
		if (string.IsNullOrEmpty(buyerId))
		{
			Response.Cookies.Delete("buyerId");
			return null;
		}

		var basket = await _context.Baskets
			.Include(b => b.Items) // navigator should be include specifically
			.ThenInclude(i => i.Product)  // BasketItem has product navigator
			.FirstOrDefaultAsync(b => b.BuyerId == buyerId);
		return basket;
	}
}
