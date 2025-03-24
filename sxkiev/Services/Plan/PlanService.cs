using Microsoft.EntityFrameworkCore;
using sxkiev.Data;
using sxkiev.Models;
using sxkiev.Repositories.Generic;

namespace sxkiev.Services.Plan;

public class PlanService : IPlanService
{
    private readonly IRepository<ProfilePlan> _profilePlanRepository;
    private readonly IRepository<SxKievUser> _userRepository;
    private readonly IRepository<Dep> _depRepository;
    private readonly IRepository<Payment> _paymentRepository;

    public PlanService(IRepository<ProfilePlan> profilePlanRepository, IRepository<SxKievUser> userRepository, 
        IRepository<Dep> depRepository, IRepository<Payment> paymentRepository)
    {
        _profilePlanRepository = profilePlanRepository;
        _userRepository = userRepository;
        _depRepository = depRepository;
        _paymentRepository = paymentRepository;
    }

    public async Task<IEnumerable<ProfilePlan>> GetPlans()
    {
        var queryable = await _profilePlanRepository.AsQueryable();
        return await queryable.ToListAsync();
    }

    public async Task<ProfilePlan?> GetProfileById(int profileId)
    {
        return await _profilePlanRepository.FirstOrDefaultAsync(x => x.Id == profileId);
    }

    public async Task UpdatePlansAsync(UpdatePlansInputModel plans)
    {
        foreach (var plan in plans.Plans)
        {
            var existing = await _profilePlanRepository.FirstOrDefaultAsync(x => x.Id == plan.Id);
            
            if (existing is null) continue;
            
            existing.Duration = plan.Duration;
            existing.Price = plan.Price;
            
            await _profilePlanRepository.UpdateAsync(existing);
        }
    }

    public async Task<CurrentUserInfoResponseModel> GetUserInfo(long userId)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.TelegramId == userId);
        
        if (user is null) throw new Exception("User not found");
        
        var deps = await _depRepository
            .Query(x => x.UserId == userId && x.Amount.HasValue && x.IsApproved == true)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
        
        var payments = await _paymentRepository
            .Query(x => x.Profile.UserId == userId)
            .OrderByDescending(x => x.Date)
            .ToListAsync();

        var depsResponse = deps.Select(x => new ApprovedDepResponseModel
        {
            Id = x.Id,
            Amount = x.Amount!.Value,
            Date = x.CreatedAt
        });

        var paymentsResponse = payments.Select(x => new PaymentResponseModel
        {
            Id = x.Id,
            Amount = x.Amount,
            Date = x.Date,
            Description = x.Description
        });

        return new CurrentUserInfoResponseModel
        {
            Data = user.Balance,
            Deps = depsResponse,
            Payments = paymentsResponse
        };
    }
}