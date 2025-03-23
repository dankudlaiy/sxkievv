using sxkiev.Data;
using sxkiev.Repositories.Generic;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;

namespace sxkiev.Services.Media;

public class MediaService : IMediaService
{
    private readonly IRepository<Data.Media> _mediaRepository;
    private readonly IRepository<ProfileMedia> _profileMediaRepository;
    
    public MediaService(IRepository<Data.Media> mediaRepository, IRepository<ProfileMedia> profileMediaRepository)
    {
        _mediaRepository = mediaRepository;
        _profileMediaRepository = profileMediaRepository;
    }

    public async Task<List<Data.Media>> UploadMediaAsync(IFormFile[] files, long userId)
    {
        if (files.Length == 0)
        {
            throw new ArgumentException("No files were provided");
        }

        var result = new List<Data.Media>();

        foreach (var file in files)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is either null or empty");
            }

            var wwwrootFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsFolder = Path.Combine(wwwrootFolder, "uploads");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            await using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            if (file.ContentType.StartsWith("image/"))
            {
                using var image = await Image.LoadAsync(filePath);

                using var watermark = await Image.LoadAsync(Path.Combine(wwwrootFolder, "watermark.png"));

                var maxWatermarkWidth = (int)(image.Width / 3.0);
                
                if (watermark.Width > maxWatermarkWidth)
                {
                    var ratio = (double)watermark.Width / watermark.Height;
                    var newWidth = maxWatermarkWidth;
                    var newHeight = (int)(newWidth / ratio);
                    
                    watermark.Mutate(ctx => ctx.Resize(newWidth, newHeight));
                }
                
                var location = new Point(
                    (image.Width - watermark.Width) / 2,
                    (int)Math.Round((image.Height - watermark.Height) / 1.15f)
                );

                image.Mutate(ctx =>
                    ctx.DrawImage(
                        watermark,
                        location,
                        new GraphicsOptions
                        {
                            ColorBlendingMode = PixelColorBlendingMode.Normal
                        }
                    )
                );

                await image.SaveAsync(filePath);
            }

            var media = new Data.Media
            {
                Path = $"/uploads/{uniqueFileName}",
                Type = file.ContentType,
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };

            await _mediaRepository.AddAsync(media);
            result.Add(media);
        }

        return result;
    }

    public async Task AddMediaToProfileAsync(Guid profileId, int mediaId)
    {
        var profileMedia = new ProfileMedia
        {
            ProfileId = profileId,
            MediaId = mediaId
        };

        await _profileMediaRepository.AddAsync(profileMedia);
    }

    public async Task<Data.Media> GetMediaByIdAsync(int id)
    {
        var media = await _mediaRepository.FirstOrDefaultAsync(x => x.Id == id);
        
        if (media == null) throw new Exception("Media not found");
        
        return media;
    }
}