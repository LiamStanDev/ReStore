using API.Data;
using Microsoft.EntityFrameworkCore;
using Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add serices to Dependency Injection Container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<StoreContext>(opt => {
    // GetConnectionString is the short hand of builder.Configuration.GetSession("ConnectionStrings")["DefaultConnection"]
    // opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    opt.UseMySql(builder.Configuration.GetConnectionString("MariaDB"), ServerVersion.Parse("10.9.5-mariadb"));
    opt.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});

builder.Services.AddCors();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy => {
    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
});
app.UseAuthorization();

app.MapControllers();


using (var scope = app.Services.CreateScope()) {
    try {
        // 這邊不能使用app.Serivices.GetRequiredService，因為這樣取得的服務
        // 生命週期大於scope
        var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
        context.Database.Migrate();
        DbInitializer.Initialize(context);
    } catch (Exception ex) {

        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "A problem occurred during migration");
        throw ex;
    }
}

app.Run();
