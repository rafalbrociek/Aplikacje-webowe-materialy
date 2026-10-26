using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Cars.Application.Cars;

public class Edit
{
    public class Command : IRequest<bool>
    {
        public Guid Id { get; set; }
        public required Car Car { get; set; }
    }

    public class Handler : IRequestHandler<Command, bool>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
        {
            // Argument new object[] { request.Id } tworzy tablicę wartości klucza.
            // W naszym przypadku klucz jest jednoelementowy, ale EF Core dopuszcza również klucze złożone z kilku pól.
            var car = await _context.Cars.FindAsync(new object[] { request.Id }, cancellationToken);

            if (car is null)
            {
                return false;
            }

            car.Brand = request.Car.Brand;
            car.Model = request.Car.Model;
            car.DoorsNumber = request.Car.DoorsNumber;
            car.LuggageCapacity = request.Car.LuggageCapacity;
            car.EngineCapacity = request.Car.EngineCapacity;
            car.FuelType = request.Car.FuelType;
            car.ProductionDate = request.Car.ProductionDate;
            car.AverageFuelConsumption = request.Car.AverageFuelConsumption;
            car.BodyType = request.Car.BodyType;


            //CancellationToken to mechanizm pozwalający przekazać informację o żądaniu anulowania operacji.
            //W aplikacjach ASP.NET Core token może być powiązany z żądaniem HTTP.
            //Przekazujemy go do handlerów i metod asynchronicznych, np.Entity Framework Core,
            //aby nie kontynuować niepotrzebnej pracy po anulowaniu żądania.
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Car).SetValidator(new CarValidator());
        }
    }
}