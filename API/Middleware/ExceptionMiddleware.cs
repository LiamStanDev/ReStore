using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Middleware;

public class ExceptionMiddleware {
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    /*
    * 1. RequestDelegate: can let us to process HTTP request.
    * 2. IHostEnvironment: use for checking we are in dev mode or production mode.
    */
    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env) {
        this._next = next;
        this._logger = logger;
        this._env = env;
    }

    public async Task InvokeAsync(HttpContext context) {

        try {
            await _next(context);
        } catch (Exception ex) {
            _logger.LogError(ex, ex.Message);

            /* Because we are not inside API controller,
             * so we need to manually setting response.
             */
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;

            var prob = new ProblemDetails() {
                Status = 500,
                Title = ex.Message,
                Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
            };
            /*
             * Becuase we are not in API controller,
             * we need to change object to json, and set
             * it to obey camelcase. The other method is call
             * context.Respone.WriteAsJsonAsync() method
             */
            var opt = new JsonSerializerOptions() {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            string json = JsonSerializer.Serialize(prob, opt);

            await context.Response.WriteAsync(json);
        }
    }
}
