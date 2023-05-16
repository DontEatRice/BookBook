using BookBook.Application;
using BookBook.Domain;
using BookBook.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddDomain()
    .AddApplication()
    .AddInfrastructure();

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();