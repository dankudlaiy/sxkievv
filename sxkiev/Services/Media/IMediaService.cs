namespace sxkiev.Services.Media;

public interface IMediaService
{
    Task<List<Data.Media>> UploadMediaAsync(IFormFile[] files, long userId);
    Task AddMediaToProfileAsync(Guid profileId, int mediaId);
}