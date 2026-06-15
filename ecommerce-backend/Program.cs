using System.Text;
using ecommerce_backend.Data;
using ecommerce_backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// 1. Add DB Context using Microsoft SQL Server driver
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Register Custom Services
builder.Services.AddSingleton<OtpService>();
builder.Services.AddScoped<TokenService>();

// 3. Add CORS Policies — Allow ALL origins (any frontend can call this API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClientDev", policy =>
    {
        // AllowAnyOrigin() permits requests from any domain (local, deployed, etc.)
        // NOTE: AllowCredentials() is not compatible with AllowAnyOrigin() per the CORS spec.
        // JWT tokens are passed via the Authorization header, so credentials/cookies are not needed.
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Add Controllers
builder.Services.AddControllers();

// 5. Add Swagger API Documentation with JWT Authorize support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TrendBaazar E-Commerce API",
        Version = "v1",
        Description = "ASP.NET Core Web API with Swagger and JWT authorization for TrendBaazar."
    });

    // Configure JWT Bearer authentication within Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT Bearer token. Example: 'Bearer 12345abcdef'"
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
    });
});

// 6. Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var keyString = jwtSettings["Key"] ?? "super_secret_trendbaazar_jwt_auth_key_12345!";
var issuer = jwtSettings["Issuer"] ?? "TrendBaazarIssuer";
var audience = jwtSettings["Audience"] ?? "TrendBaazarAudience";
var key = Encoding.UTF8.GetBytes(keyString);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// 7. Database Seeding & Schema Verification
if (args.Contains("--seed"))
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<AppDbContext>();
            Console.WriteLine("Executing database seeding on target backend...");
            DbInitializer.Initialize(context);
            Console.WriteLine("Database initialized and seeded successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database seeding failed: {ex.Message}");
        }
    }
    return; // Exit application after seeding completes
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.EnsureCreated();
        Console.WriteLine("Database schema verified (EnsureCreated). Ready for operations.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database schema validation failed: {ex.Message}");
    }
}


// 8. Configure HTTP Pipeline
if (app.Environment.IsDevelopment() || true) // enable for testing convenience
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TrendBaazar API v1");
        c.RoutePrefix = string.Empty; // Serve Swagger at app root URL
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowClientDev");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
