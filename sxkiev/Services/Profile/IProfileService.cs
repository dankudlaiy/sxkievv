﻿using sxkiev.Data;
using sxkiev.Models;

namespace sxkiev.Services.Profile;

public interface IProfileService
{
    Task<(int, IEnumerable<SxKievProfile>)> GetAllProfilesAsync(int skip, int take);
    Task<IEnumerable<SxKievProfile?>> GetProfilesByUser(long userId, int skip, int take);
    Task<int> GetOrderByPriority(int priority);
    Task<SearchProfilesResponseModel> SearchProfilesAsync(SearchProfilesInputModel input);
    Task<SxKievProfile?> GetProfileAsync(Guid id);
    Task UpdateProfileAsync(SxKievProfile profile);
    Task<SxKievProfile> AddProfileAsync(SxKievProfile profile);
    Task DeleteProfileAsync(Guid id);
}