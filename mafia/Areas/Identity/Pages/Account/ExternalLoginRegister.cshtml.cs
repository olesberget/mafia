using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using WebApplication1.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using System.Collections.Generic;

public class ExternalLoginRegisterModel : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ILogger<ExternalLoginRegisterModel> _logger;

    public ExternalLoginRegisterModel(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ILogger<ExternalLoginRegisterModel> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
    }

    [BindProperty] public InputModel Input { get; set; }
    public string ReturnUrl { get; set; }

    public class InputModel
    {
        [Required] [EmailAddress] public string Email { get; set; }
        [Required] public string Nickname { get; set; }
    }

    public void OnGet(string email, string returnUrl = null)
    {
        _logger.LogInformation($"Received email query string in ExternalLoginRegister OnGet: {email}");
        Input = new InputModel { Email = email };
        ReturnUrl = returnUrl;
    }


    public async Task<IActionResult> OnPostAsync(string returnUrl = null)
    {
        returnUrl ??= Url.Content("~/");

        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Model state is not valid.");
            foreach (var modelStateKey in ViewData.ModelState.Keys)
            {
                var modelStateVal = ViewData.ModelState[modelStateKey];
                foreach (var error in modelStateVal.Errors)
                {
                    _logger.LogWarning($"Error in {modelStateKey}: {error.ErrorMessage}");
                }
            }
            return Page();
        }

        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null)
        {
            _logger.LogError("External login info is null.");
            ModelState.AddModelError(string.Empty, "Error loading external login information.");
            return Page();
        }

        var user = new ApplicationUser { UserName = Input.Email, Email = Input.Email, Nickname = Input.Nickname };
        var result = await _userManager.CreateAsync(user);
        if (result.Succeeded)
        {
            var addLoginResult = await _userManager.AddLoginAsync(user, info);
            if (addLoginResult.Succeeded)
            {
                _logger.LogInformation("External login added successfully. Signing in the user.");
                await SignInUser(user, returnUrl);
                return LocalRedirect(returnUrl ?? "/");
            }

            foreach (var error in addLoginResult.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
                _logger.LogError($"Error adding external login: {error.Description}");
            }
        }
        else
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
                _logger.LogError($"Error creating user: {error.Description}");
            }
        }

        return Page();
    }

    private async Task SignInUser(ApplicationUser user, string returnUrl)
    {
        _logger.LogInformation($"Signing in user: {user.Email}");
        await _signInManager.SignInAsync(user, isPersistent: false);

        if (Url.IsLocalUrl(returnUrl))
        {
            Response.Redirect(returnUrl);
        }
        else
        {
            Response.Redirect(Url.Page("/Index"));
        }
    }
}