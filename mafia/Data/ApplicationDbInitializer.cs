
using System.Globalization;
using WebApplication1.Models;
using Microsoft.AspNetCore.Identity;

namespace WebApplication1.Data
{
    public static class ApplicationDbInitializer
    {
        public static void Initialize(ApplicationDbContext db, UserManager<ApplicationUser> um, RoleManager<IdentityRole> rm)
        {
            
            //db.Database.EnsureDeleted();
            db.Database.EnsureCreated();

            var adminRole = new IdentityRole("Admin");
            rm.CreateAsync(adminRole).Wait();
            
            
            
            var user1 = new ApplicationUser{UserName = "user1@mail.com", Email = "user1@mail.com", Nickname = "User1"};
            var user2 = new ApplicationUser{UserName = "user2@mail.com", Email = "user2@mail.com", Nickname = "User2"};
            var user3 = new ApplicationUser{UserName = "user3@mail.com", Email = "user3@mail.com", Nickname = "User3"};
            
            um.CreateAsync(user1, "Password1.").Wait();
            um.CreateAsync(user2, "Password1.").Wait();
            um.CreateAsync(user3, "Password1.").Wait();
            
            
            
            db.SaveChanges();
        }
    }
}
