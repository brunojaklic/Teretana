using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;

namespace BACKEND.Extensions
{
    /// <summary>
    /// Sadrži ekstenzijske metode za konfiguraciju Swaggera, CORS-a i sigurnosti za Teretana API.
    /// </summary>
    public static class TeretanaExtensions
    {
        /// <summary>
        /// Dodaje i konfigurira Swagger dokumentaciju za Teretana API, uključujući JWT autentikaciju.
        /// </summary>
        /// <param name="Services">Kolekcija servisa aplikacije.</param>
        public static void AddTeretanaSwaggerGen(this IServiceCollection Services)
        {

            Services.AddSwaggerGen(sgo =>
            {
                var o = new OpenApiInfo()
                {
                    Title = "Teretana API",
                    Version = "v1",
                    Contact = new OpenApiContact()
                    {
                        Email = "bruno.jaklic.2005@gmail.com",
                        Name = "Bruno Jaklić"
                    },
                    Description = "Ovo je dokumentacija za Teretana API",
                    License = new OpenApiLicense()
                    {
                        Name = "Edukacijska licenca"
                    }
                };
                sgo.SwaggerDoc("v1", o);

                sgo.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Autorizacija radi tako da se prvo na ruti /api/v1/Autorizacija/token.  
                                  autorizirate i dobijete token (bez navodnika). Upišite 'Bearer' [razmak] i dobiveni token.
                                  Primjer: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2OTc3MTc2MjksImV4cCI6MTY5Nzc0NjQyOSwiaWF0IjoxNjk3NzE3NjI5fQ.PN7YPayllTrWESc6mdyp3XCQ1wp3FfDLZmka6_dAJsY'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                sgo.AddSecurityRequirement(new OpenApiSecurityRequirement()
                  {
                                {
                                  new OpenApiSecurityScheme
                                  {
                                    Reference = new OpenApiReference
                                      {
                                        Type = ReferenceType.SecurityScheme,
                                        Id = "Bearer"
                                      },
                                      Scheme = "oauth2",
                                      Name = "Bearer",
                                      In = ParameterLocation.Header,

                                    },
                                    new List<string>()
                                  }
                    });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                sgo.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);

            });

        }

        /// <summary>
        /// Dodaje i konfigurira CORS politiku koja dopušta sve izvore, metode i zaglavlja.
        /// </summary>
        /// <param name="Services">Kolekcija servisa aplikacije.</param>
        public static void AddTeretanaCORS(this IServiceCollection Services)
        {

            Services.AddCors(opcije =>
            {
                opcije.AddPolicy("CorsPolicy",
                    builder =>
                        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
                );

            });

        }

        /// <summary>
        /// Dodaje i konfigurira JWT autentikaciju za Teretana API.
        /// </summary>
        /// <param name="Services">Kolekcija servisa aplikacije.</param>
        public static void AddTeretanaSecurity(this IServiceCollection Services)
        {
            Services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("MojKljucKojijeJakoTajan i dovoljno dugačak da se može koristiti")),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = false
                };
            });

        }

    }
}
