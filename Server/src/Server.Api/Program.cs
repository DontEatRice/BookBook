using Server.Application;
using Server.Domain;
using Server.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddDomain()
    .AddApplication()
    .AddInfrastructure();

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();