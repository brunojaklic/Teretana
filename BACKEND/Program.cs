using BACKEND.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen();

// dodavanje DB contexta
builder.Services.AddDbContext<EdunovaContext>(o =>
{
    o.UseSqlServer(builder.Configuration.GetConnectionString("EdunovaContext"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(p =>
{
    p.EnableTryItOutByDefault();
});

app.MapControllers();

app.Run();