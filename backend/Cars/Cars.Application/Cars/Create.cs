using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public class Create
{
    // Żądanie zostanie wysłane przez MediatR i po wykonaniu zwróci obiekt typu Car
    public class Command : IRequest<Car>
    {
        // Wymagny obiekt Car
        public required Car Car { get; set; }
    }

    // Handler jest klasą, która rzeczywiście wykonuje operację.
    // Przyjmuje żądanie typu Command
    // Zwraca wynik typu Car.
    public class Handler : IRequestHandler<Command, Car>
    {
        // Handler potrzebuje dostępu do bazy danych.
        // DataContext jest dostarczany przez kontener dependency injection.
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }


        // Ta metoda jest wywoływana przez MediatR.
        // request — przesłany obiekt Create.Command,
        // cancellationToken — sygnał pozwalający anulować operację,
        // Task<Car> — operacja jest asynchroniczna i zwróci samochód.
        public async Task<Car> Handle(Command request, CancellationToken cancellationToken)
        {
            _context.Cars.Add(request.Car);
            await _context.SaveChangesAsync(cancellationToken);

            return request.Car;
        }
    }

    // Walidator zostaje znaleziony przez dependency injection, a następnie uruchomiony
    // przez ValidationBehavior.
    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            // Dla właściwości Car zastosuj reguły z klasy CarValidator.
            RuleFor(x => x.Car).SetValidator(new CarValidator());
        }
    }
}