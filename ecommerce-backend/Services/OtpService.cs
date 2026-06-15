using System;
using System.Collections.Concurrent;

namespace ecommerce_backend.Services;

public class OtpService
{
    // In-memory thread-safe dictionary mapping Phone -> OTP Code
    // NOTE: In production, this should be replaced by an SMS provider (Twilio, MSG91, etc.)
    private static readonly ConcurrentDictionary<string, string> _otps = new();

    /// <summary>
    /// Generates a random 4-digit OTP for the given phone number.
    /// The OTP is stored in memory and printed to the backend console for testing.
    /// </summary>
    public string GenerateOtp(string phone)
    {
        var random = new Random();
        var code = random.Next(1000, 9999).ToString();
        _otps[phone] = code;
        return code;
    }

    /// <summary>
    /// Validates the OTP for the given phone number.
    /// Only accepts the actual generated code — no bypass codes.
    /// The OTP is consumed (single-use) after successful verification.
    /// </summary>
    public bool VerifyOtp(string phone, string code)
    {
        // Only accept the actual OTP generated for this phone.
        // There is no bypass. Check the backend console for the code.
        if (_otps.TryGetValue(phone, out var actualCode))
        {
            if (actualCode == code)
            {
                // OTP is consumed after one successful use (single-use token)
                _otps.TryRemove(phone, out _);
                return true;
            }
        }

        return false;
    }
}
