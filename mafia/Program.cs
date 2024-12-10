using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using WebApplication1.Hubs;

var builder = WebApplication.CreateBuilder(args);



// Configuring Cross-Origin Resource Sharing (CORS) for the React development server
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", builder =>
        builder.WithOrigins("https://localhost:3000") // URL of the React development server
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()); // Enable credentials like cookies, authorization headers
});

builder.Services.AddSignalR(); // Add SignalR Services

/*var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"];
var issuer = jwtSettings["Issuer"];
var audience = jwtSettings["Audience"];*/

// Configuration for logging
var loggerFactory = LoggerFactory.Create(loggingBuilder => loggingBuilder.AddConsole());
var logger = loggerFactory.CreateLogger<Program>();

//logger.LogInformation("JWT Authentication configured with issuer: " + issuer);


// Configure the database context for the application
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                       throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)); // PostgreSQL database context
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Configure Identity services and authentication
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

// Configuring external authentication providers
builder.Services.AddAuthentication()
    .AddGoogle(options =>
    {
        // Google authentication configuration
        options.ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
    options.ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");

    })
    .AddFacebook(options =>
    {
        // Facebook authentication configuration
        options.AppId = Environment.GetEnvironmentVariable("FACEBOOK_APP_ID");
        options.AppSecret = "FACEBOOK_APP_SECRET";
    });

/*builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
    })
    .AddCookie(options =>
    {
        // Configure your cookie settings here
        options.Cookie.Path = "/";
        options.LoginPath = "/Identity/Account/Login";
        options.LogoutPath = "/Identity/Account/Logout";
        options.AccessDeniedPath = "/Identity/Account/AccessDenied";
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    })
    /*.AddJwtBearer(options =>
    {
        // Your existing JWT configuration
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    })*/
    /*.AddGoogle(googleOptions =>
    {
        // Your existing Google configuration
        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
        googleOptions.CallbackPath = new PathString("/signin-google");
    })
    .AddFacebook(options =>
    {
        // Your existing Facebook configuration
        options.AppId = builder.Configuration["Authentication:Facebook:AppId"];
        options.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"];
    });*/



var app = builder.Build();

// Initialize the database with predefined data
using (var services = app.Services.CreateScope())
{
    var db = services.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var um = services.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var rm = services.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    ApplicationDbInitializer.Initialize(db, um, rm);
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
    
    // Update CORS policy for development environment
    app.UseCors(x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .SetIsOriginAllowed(origin => true) // Allow any origin
        .AllowCredentials()); // Allow credentials
    
    // Proxy for redirecting certain requests to React development server in development environment
    app.Use(async (context, next) =>
    {
        if (context.Request.Path.StartsWithSegments("/host") || context.Request.Path.StartsWithSegments("/player"))
        {
            // Redirect requests to React development server
            context.Response.Redirect($"https://localhost:3000{context.Request.Path}{context.Request.QueryString}");
        }
        else
        {
            await next();
        }
    });
}
else
{
    app.UseExceptionHandler("/Home/Error"); // Use custom error handler
    app.UseHsts(); // Enforce HTTPS
    app.UseCors("MyCorsPolicy");
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Serve static files

app.UseRouting(); // Enable routing
app.UseCors("MyCorsPolicy"); // Apply CORS policy
app.UseAuthentication(); // Enable authentication
app.UseAuthorization(); // Enable authorization

app.MapHub<GameHub>("/gamehub").RequireCors("MyCorsPolicy");

// Define default route pattern
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages(); // Map Razor pages

app.Run(); // Start the application

