﻿using sxkiev.Data;
using sxkiev.Repositories.Generic;

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

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

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
}