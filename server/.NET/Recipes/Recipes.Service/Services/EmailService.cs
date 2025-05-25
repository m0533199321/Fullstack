using Microsoft.Extensions.Configuration;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
//using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Amazon.SimpleEmail.Model;
using Amazon.SimpleEmail;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Net.Http;

namespace Recipes.Service.Services
{
    public class EmailService(IConfiguration configuration) : IEmailService
    {
        private readonly IConfiguration _configuration = configuration;

        public async Task<bool> SendEmailAsync(EmailRequest request)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("smartChef", _configuration["SMTP:GOOGLE_USER_EMAIL"]));
            emailMessage.To.Add(new MailboxAddress(request.To, request.To));
            emailMessage.Subject = request.Subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = request.Body;
            emailMessage.Body = bodyBuilder.ToMessageBody();
            //var bodyBuilder = new BodyBuilder { TextBody = request.Body };
            //emailMessage.Body = bodyBuilder.ToMessageBody();

            emailMessage.Headers.Add("Auto-Submitted", "auto-generated");
            emailMessage.Headers.Add("Precedence", "bulk");
            emailMessage.Headers.Add("X-Auto-Response-Suppress", "All");
            emailMessage.Headers.Add("Return-Path", "<>");

            using (var client = new SmtpClient())
            {
                try
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    Console.WriteLine("Connecting to SMTP server...");
                    await client.ConnectAsync(_configuration["SMTP:SMTP_SERVER"], int.Parse(_configuration["SMTP:PORT"]), SecureSocketOptions.SslOnConnect);
                    //await client.ConnectAsync(configuration["SMTP:SMTP_SERVER"], int.Parse(configuration["SMTP:PORT"]), MailKit.Security.SecureSocketOptions.StartTls);
                    Console.WriteLine("Authenticating...");
                    await client.AuthenticateAsync(_configuration["SMTP:GOOGLE_USER_EMAIL"], _configuration["SMTP:PASSWORD"]);
                    Console.WriteLine("Sending email...");
                    await client.SendAsync(emailMessage);
                    Console.WriteLine("Email sent successfully.");
                    await client.DisconnectAsync(true);
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    return false;
                }
            }

        }

    }
}
