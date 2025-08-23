using BACKEND.Data;
using BACKEND.Extensions;
using BACKEND.Mapping;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddTeretanaSwaggerGen();
builder.Services.AddTeretanaCORS();


builder.Services.AddDbContext<TeretanaContext>(opcije => opcije.UseSqlServer(builder.Configuration.GetConnectionString("EdunovaContext")));


builder.Services.AddAutoMapper(cfg => {
    cfg.AddProfile<TeretanaMappingProfile>();
});


builder.Services.AddTeretanaSecurity();
builder.Services.AddAuthorization();



var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(opcije => {
    opcije.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
    opcije.EnableTryItOutByDefault();
    opcije.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
});

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles();
app.UseDefaultFiles();
app.MapFallbackToFile("index.html");

app.UseCors("CorsPolicy");

app.Run();
