[assembly: Xunit.CollectionBehavior(DisableTestParallelization = true)]

namespace CitasApi.Tests;

using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class ProgramStartupTests
{
    [Fact]
    public void Startup_DebeArrojarExcepcion_CuandoJwtSecretEsVacio()
    {
        var prevSecret = Environment.GetEnvironmentVariable("Jwt__Secret");
        Environment.SetEnvironmentVariable("Jwt__Secret", null);

        try
        {
            var factory = new WebApplicationFactory<Program>();
            var ex = Record.Exception(() => factory.CreateClient());
            Assert.NotNull(ex);
        }
        finally
        {
            Environment.SetEnvironmentVariable("Jwt__Secret", prevSecret);
        }
    }
}
