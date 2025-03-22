﻿using System.Linq.Expressions;

namespace sxkiev.Repositories.Generic;

public interface IRepository<T> where T : class
{
    Task<IQueryable<T>> AsQueryable();
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    IQueryable<T> Query(Expression<Func<T, bool>> predicate);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}
