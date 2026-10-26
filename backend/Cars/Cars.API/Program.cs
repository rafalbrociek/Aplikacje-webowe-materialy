using Cars.API.Middleware;
using Cars.Application.Cars;
using Cars.Application.Common.Behaviors;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// 1. REJESTRACJA USŁUG W KONTENERZE DEPENDENCY INJECTION
// =========================================================

// Dodaje obsługę kontrolerów ASP.NET Core.
// Dzięki temu aplikacja rozpoznaje klasy dziedziczące po ControllerBase
// oraz endpointy oznaczone atrybutami [HttpGet], [HttpPost] itd.
builder.Services.AddControllers();

// Dodaje generowanie dokumentu OpenAPI opisującego endpointy aplikacji.
// Sam dokument będzie dostępny w środowisku deweloperskim,
// ale nie oznacza to automatycznego dodania interfejsu Swagger UI.
builder.Services.AddOpenApi();


// =========================================================
// 2. KONFIGURACJA ENTITY FRAMEWORK CORE
// =========================================================

// Rejestrujemy DataContext w kontenerze DI.
// Dla każdego żądania HTTP zostanie utworzona odpowiednia instancja
// kontekstu bazy danych.
builder.Services.AddDbContext<DataContext>(options =>
{
    // UseSqlite informuje EF Core, że używamy bazy SQLite.
    // Connection string jest pobierany z pliku appsettings.json
    // z sekcji ConnectionStrings i klucza DefaultConnection.
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});


// =========================================================
// 3. KONFIGURACJA CORS
// =========================================================

// CORS określa, które aplikacje frontendowe mogą wysyłać
// żądania do naszego backendu.
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            // Zezwalamy na żądania z aplikacji React uruchomionej
            // przez Vite na porcie 5173.
            .WithOrigins("http://localhost:5173")

            // Zezwalamy na dowolne nagłówki żądania,
            // np. Content-Type lub Authorization.
            .AllowAnyHeader()

            // Zezwalamy na wszystkie metody HTTP,
            // np. GET, POST, PUT i DELETE.
            .AllowAnyMethod();
    });
});


// =========================================================
// 4. REJESTRACJA MEDIATR
// =========================================================

// MediatR wyszukuje w projekcie Cars.Application klasy obsługujące
// komendy i zapytania, czyli implementacje IRequestHandler.
//
// Podajemy assembly zawierające GetCarsList.Handler.
// W tym samym assembly znajdują się również pozostałe handlery,
// np. Create.Handler, Edit.Handler i Delete.Handler.
builder.Services.AddMediatR(configuration =>
{
    configuration.RegisterServicesFromAssembly(
        typeof(GetCarsList.Handler).Assembly);
});


// =========================================================
// 5. REJESTRACJA FLUENTVALIDATION
// =========================================================

// Wyszukuje i rejestruje wszystkie walidatory znajdujące się
// w tym samym assembly co Create.CommandValidator.
//
// Dzięki temu nie musimy rejestrować osobno każdego walidatora.
builder.Services.AddValidatorsFromAssemblyContaining<
    Create.CommandValidator>();


// =========================================================
// 6. REJESTRACJA PIPELINE MEDIATR
// =========================================================

// ValidationBehavior jest wykonywany przed właściwym handlerem.
//
// Przykładowy przepływ:
// Create.Command
//     -> ValidationBehavior
//     -> Create.Handler
//
// Jeżeli dane są niepoprawne, ValidationBehavior zgłasza
// ValidationException i handler nie zostaje wykonany.
builder.Services.AddTransient(
    typeof(IPipelineBehavior<,>),
    typeof(ValidationBehavior<,>));


// =========================================================
// 7. UTWORZENIE APLIKACJI
// =========================================================

var app = builder.Build();


// =========================================================
// 8. PRZYGOTOWANIE BAZY DANYCH
// =========================================================

// Automatyczne wykonanie migracji i dodanie danych początkowych
// stosujemy tylko w środowisku deweloperskim.
//
// Jest to wygodne podczas laboratoriów, ale w aplikacji produkcyjnej
// migracje zwykle wykonuje się w kontrolowany sposób podczas wdrożenia.
if (app.Environment.IsDevelopment())
{
    await ApplyMigrationsAndSeedDataAsync(app);
}


// =========================================================
// 9. KONFIGURACJA POTOKU HTTP
// =========================================================

// Middleware obsługi wyjątków umieszczamy wysoko w potoku,
// aby mógł przechwycić wyjątki zgłoszone przez kolejne elementy,
// np. kontrolery, walidację MediatR i handlery.
app.UseMiddleware<ApiExceptionMiddleware>();

// Przekierowuje żądania HTTP na HTTPS.
app.UseHttpsRedirection();

// Jawnie włączamy mechanizm routingu.
// Routing ustala, który endpoint powinien obsłużyć dane żądanie.
app.UseRouting();

// Stosujemy wcześniej zdefiniowaną politykę CORS.
// UseCors powinno znajdować się po routingu,
// ale przed uwierzytelnianiem i autoryzacją.
app.UseCors("CorsPolicy");

// W późniejszej części kursu, po dodaniu logowania,
// pojawi się tutaj:
//
// app.UseAuthentication();
//
// Authentication ustala, kim jest użytkownik.
// Authorization sprawdza, czy użytkownik ma dostęp do zasobu.

// Dodaje obsługę autoryzacji.
// Na tym etapie nie mamy jeszcze zabezpieczonych endpointów,
// ale przygotowujemy właściwą strukturę potoku.
app.UseAuthorization();


// =========================================================
// 10. MAPOWANIE ENDPOINTÓW
// =========================================================

// Dokument OpenAPI udostępniamy tylko podczas pracy lokalnej.
// Domyślny adres ma zwykle postać:
// https://localhost:<port>/openapi/v1.json
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Mapuje endpointy zdefiniowane w kontrolerach.
// Dopiero dzięki tej instrukcji atrybuty takie jak
// [HttpGet], [HttpPost] i [Route] stają się aktywne.
app.MapControllers();


// =========================================================
// 11. URUCHOMIENIE APLIKACJI
// =========================================================

// Uruchamia serwer i rozpoczyna nasłuchiwanie żądań HTTP.
app.Run();


// =========================================================
// 12. METODA POMOCNICZA: MIGRACJA I DANE POCZĄTKOWE
// =========================================================

static async Task ApplyMigrationsAndSeedDataAsync(WebApplication app)
{
    // Tworzymy osobny zakres dependency injection.
    // Jest to potrzebne, ponieważ DataContext jest usługą typu scoped.
    await using var scope = app.Services.CreateAsyncScope();

    var services = scope.ServiceProvider;

    try
    {
        // Pobieramy DataContext z kontenera dependency injection.
        var context = services.GetRequiredService<DataContext>();

        // Stosujemy wszystkie migracje, które nie zostały jeszcze
        // wykonane dla aktualnej bazy danych.
        await context.Database.MigrateAsync();

        // Dodajemy przykładowe rekordy, jeżeli baza jest pusta.
        await Seed.SeedData(context);
    }
    catch (Exception ex)
    {
        // Pobieramy logger i zapisujemy szczegóły błędu.
        var logger = services.GetRequiredService<ILogger<Program>>();

        logger.LogError(
            ex,
            "An error occurred while migrating or seeding the database.");

        // Ponownie zgłaszamy wyjątek.
        // Dzięki temu aplikacja nie uruchomi się z niepoprawnie
        // przygotowaną albo nieaktualną bazą danych.
        throw;
    }
}