using System.Net;
using System.Net.Mail;

namespace FurniAPI.Services
{
    public interface IEmailSender
    {
        Task SendAsync(string toEmail, string subject, string body);
    }

    
    public class SmtpEmailSender : IEmailSender
    {
        private readonly IConfiguration _config;
        private readonly ILogger<SmtpEmailSender> _logger;

        public SmtpEmailSender(IConfiguration config, ILogger<SmtpEmailSender> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendAsync(string toEmail, string subject, string body)
        {
            var smtp = _config.GetSection("Smtp");
            var host = smtp["Host"];
            var port = int.Parse(smtp["Port"] ?? "587");
            var username = smtp["Username"];
            var password = smtp["Password"];
            var fromEmail = smtp["FromEmail"] ?? username;
            var fromName = smtp["FromName"] ?? "Furni";
            var enableSsl = bool.Parse(smtp["EnableSsl"] ?? "true");

            if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(username))
            {
                
                _logger.LogWarning(
                    "SMTP is not configured (appsettings.json -> Smtp section is empty). " +
                    "Email to {ToEmail} was NOT sent. Subject: {Subject} Body: {Body}",
                    toEmail, subject, body);
                return;
            }

            using var message = new MailMessage
            {
                From = new MailAddress(fromEmail!, fromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = enableSsl
            };

            await client.SendMailAsync(message);
        }
    }
}
