namespace CitasApi.Infrastructure.Middleware;

public class LoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LoggingMiddleware> _logger;

    public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var inicio = DateTime.UtcNow;
        var method = context.Request.Method;
        var path = context.Request.Path;
        var usuarioId = context.User?.FindFirst("id")?.Value ?? "anonimo";

        await _next(context);

        var status = context.Response.StatusCode;
        var ms = (DateTime.UtcNow - inicio).TotalMilliseconds;

        if (status >= 400)
            _logger.LogWarning("{Method} {Path} — usuario={UsuarioId} — {Status} ({Ms}ms)", method, path, usuarioId, status, (int)ms);
        else
            _logger.LogInformation("{Method} {Path} — usuario={UsuarioId} — {Status} ({Ms}ms)", method, path, usuarioId, status, (int)ms);
    }
}
