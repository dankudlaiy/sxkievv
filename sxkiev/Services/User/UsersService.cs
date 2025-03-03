﻿using sxkiev.Data;
using sxkiev.Repositories.Generic;

namespace sxkiev.Services.User;

public class UsersService : IUsersService
{
    private readonly IRepository<SxKievUser> _userRepository;

    public UsersService(IRepository<SxKievUser> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<SxKievUser>> GetAllUsersAsync()
    {
        return await _userRepository.GetAllAsync();
    }

    public async Task<SxKievUser?> GetUserByIdAsync(int id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task AddUserAsync(SxKievUser user)
    {
        await _userRepository.AddAsync(user);
    }

    public async Task UpdateUserAsync(SxKievUser user)
    {
        await _userRepository.UpdateAsync(user);
    }
}