using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

public class ApplicationUser : IdentityUser
{
    public string Nickname { get; set; }
    public string? PlayerRole { get; set; }
    public string? CurrentGameId { get; set; }
    public bool? isOnline { get; set; }
    public DateTime? LastActiveAt { get; set; }
    
    // Relationships
    
    [NotMapped]
    public ICollection<string> Friendlist { get; set; }
    [NotMapped]
    public ICollection<string> Achievements { get; set; }
    
    // Constructor

    public ApplicationUser()
    {
        Friendlist = new HashSet<string>();
        Achievements = new HashSet<string>();
    }
}