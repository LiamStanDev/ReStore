using System.Text;
using API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add serices to Dependency Injection Container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(cfg => {
    var jwtSecurityScheme = new OpenApiSecurityScheme {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    cfg.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    cfg.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
    });
});
builder.Services.AddDbContext<StoreContext>(opt => {
    // GetConnectionString is the short hand of builder.Configuration.GetSession("ConnectionStrings")["DefaultConnection"]
    // the other way is use buidler.Configuration["ConnectionStrings:DefaultConnection"]
    // opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    // opt.UseMySql(builder.Configuration["ConnectionStrings:MariaDB"], ServerVersion.Parse("10.9.5-mariadb"));
    opt.UseMySql(builder.Configuration.GetConnectionString("MariaDB"), ServerVersion.Parse("10.9.5-mariadb"));
});

builder.Services.AddCors();
// builder.Services.AddIdentityCore<User>()
//     .AddRoles<IdentityRole>()
//     .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddIdentity<User, Role>(opt => {
    opt.Password.RequireNonAlphanumeric = false;
    opt.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<StoreContext>();

builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(opt => {
        opt.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.
                GetBytes(builder.Configuration["JWTSettings:TokenKey2"]))
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddScoped<TokenService>();
var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI(cfg =>
        cfg.ConfigObject.AdditionalItems.Add("persistAuthorization", "true")
    );
}

app.UseCors(policy => {
    // why allow creadentials?
    // because the cookies etc. are in the localhost:3000 which is not
    // in the same domain, we need to set allow creadential to accept cookies.
    policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


using (var scope = app.Services.CreateScope()) {
    try {
        // 這邊不能使用app.Serivices.GetRequiredService，因為這樣取得的服務
        // 生命週期大於scope
        var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
        await context.Database.MigrateAsync();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        await DbInitializer.Initialize(context, userManager);
    } catch (Exception ex) {

        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "A problem occurred during migration");
        throw ex;
    }
}

app.Run();
