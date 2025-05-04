using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IServices;
using System.Net;

namespace Recipes.Service.Services
{
    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public S3Service(IConfiguration configuration)
        {
            var awsOptions = configuration.GetSection("AWS");
            var accessKey = awsOptions["AccessKey"];
            var secretKey = awsOptions["SecretKey"];
            var region = awsOptions["Region"];
            _bucketName = awsOptions["BucketName"];

            _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
        }
        public async Task<string> GeneratePresignedUrlAsync(string fileName, string contentType)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = contentType
            };
            var url = _s3Client.GetPreSignedURL(request);

            return url;
        }
        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(30) // תוקף של 30 דקות
            };

            return _s3Client.GetPreSignedURL(request);
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType = null)
        {
            try
            {
                var request = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = $"images/{fileName}",
                    InputStream = fileStream,
                    ContentType = contentType
                };

                var response = await _s3Client.PutObjectAsync(request);

                if (response.HttpStatusCode == HttpStatusCode.OK)
                {
                    string url = $"https://{_bucketName}.s3.amazonaws.com/images/{fileName}";
                    return url;
                }
                else
                {
                    return null;
                }
            }
            catch (AmazonS3Exception ex)
            {
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}


