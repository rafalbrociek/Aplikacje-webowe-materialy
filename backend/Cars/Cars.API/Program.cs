using Cars.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Rejestracja DataContext w kontenerze
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Dodanie polityki CORS
builder.Services.AddCors(options =>
 {
     options.AddPolicy("CorsPolicy", policy =>
     {
         policy.AllowAnyHeader().
                AllowAnyMethod().
                WithOrigins("http://localhost:5173");
     });
 });

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Dodajemy użycie CORS
app.UseCors("CorsPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // uruchamia graficzny interfejs Scalar

}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Automatyczne wykonanie migracji przy starcie aplikacji
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
}

app.Run();
