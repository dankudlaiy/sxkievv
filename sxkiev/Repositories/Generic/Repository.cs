using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using sxkiev.Data;

namespace sxkiev.Repositories.Generic;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly SxKievDbContext _dbContext;
    protected readonly DbSet<T> _dbSet;

    public Repository(SxKievDbContext dbContext)
    {
        _dbContext = dbContext;
        _dbSet = dbContext.Set<T>();
    }

    public async Task<IQueryable<T>> AsQueryable()
    {
        return _dbSet.AsQueryable();
    }

    public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.FirstOrDefaultAsync(predicate);
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.Where(predicate).ToListAsync();
    }

    public IQueryable<T> Query(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.Where(predicate);
    }

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        _dbSet.Remove(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Expression<Func<T, bool>> predicate)
    {
        _dbSet.RemoveRange(_dbSet.Where(predicate));
        await _dbContext.SaveChangesAsync();
    }
}
