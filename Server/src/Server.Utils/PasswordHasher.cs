using Microsoft.AspNetCore.Identity;

#pragma warning disable CS0618

namespace Server.Utils;

public static class PasswordHasher
{
    public static string Hash(string password)
    {
        return new PasswordHasher<object>().HashPassword(default!, password);
    }

    public static bool Verify(string password, string hash)
    {
        var passwordVerificationResult = new PasswordHasher<object>().VerifyHashedPassword(default!, hash, password);
        return passwordVerificationResult is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}