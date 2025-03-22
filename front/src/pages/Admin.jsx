import React, {useEffect, useState} from 'react';
import styles from './Admin.module.sass';

const Admin = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            setIsAuth(true)

            fetch(`http://192.168.101.41:7228/api/Auth/role`, {
                method : "GET",
                headers: {
                    "Content-Type": "*/*",
                    "Accept"      : "*/*",
                    "Authorization": `Bearer ${token}`
                },
            }).then(response => {
                if (response.status === 200) {
                    console.log(response)
                    response.json().then(data => {
                        if (data.role === 'admin') {
                            setIsAdmin(true)
                        }
                    })
                }
            })
        } else {
            setIsAuth(false)
        }
    }, [])

    const fetchUsers = async () => {
        const token = localStorage.getItem('authToken');

        setLoading(true);
        try {
            const response = await fetch('http://192.168.101.41:7228/api/Admin/users?take=10', {
                method: 'GET',
                headers: {
                    "Content-Type": "*/*",
                    "Accept": "*/*",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users.');
            }

            const data = await response.json();
            setUsers(data.users.$values);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    if (!isAuth || !isAdmin) {
        return <p>Not authorized</p>
    }

    return (
        <div className={styles.container}>
            <h1>Admin Page</h1>

            <div className={styles.tabs}>
                <button
                    className={activeTab === 'users' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button
                    className={activeTab === 'profiles' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('profiles')}
                >
                    Profiles
                </button>
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'users' && (
                    <div>
                        <h2>Users</h2>

                        {/* Отображение состояний загрузки и ошибок */}
                        {loading && <p>Loading users...</p>}
                        {error && <p>Error: {error}</p>}

                        {/* Список пользователей */}
                        {!loading && !error && (
                            <ul>
                                {users.map(user => (
                                    <li key={user.telegramId}>
                                        <p><strong>Username:</strong> {user.username}</p>
                                        <p><strong>Balance:</strong> {user.balance}</p>
                                        <p><strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {activeTab === 'profiles' && (
                    <div>
                        <h2>Profiles</h2>
                        {/* Здесь добавьте логику отображения списка анкет */}
                        <p>Here is the profiles management section.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;