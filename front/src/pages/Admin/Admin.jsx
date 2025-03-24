import React, {useContext, useEffect, useState} from 'react'
import styles from './Admin.module.sass'
import {UserContext} from "../../context/Context"

const Admin = () => {
   // const [isAuth, setIsAuth] = useState(false)
   // const [isAdmin, setIsAdmin] = useState(false)
   const { user } = useContext(UserContext);

   // For admin check, see user?.role === "admin"
   const isAdmin = user?.role === "admin";
   const isAuth = !!user;

   const [activeTab, setActiveTab] = useState('users')
   const [users, setUsers] = useState([])
   const [profiles, setProfiles] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)

   // useEffect(() => {
   //    const token = localStorage.getItem('authToken')
   //    if (token) {
   //       setIsAuth(true)
   //
   //       fetch(`/api/Auth/role`, {
   //          method : "GET",
   //          headers: {
   //             "Content-Type" : "*/*",
   //             "Accept"       : "*/*",
   //             "Authorization": `Bearer ${token}`
   //          },
   //       }).then(response => {
   //          if (response.status === 200) {
   //             console.log(response)
   //             response.json().then(data => {
   //                if (data.role === 'admin') {
   //                   setIsAdmin(true)
   //                }
   //             })
   //          }
   //       })
   //    } else {
   //       setIsAuth(false)
   //    }
   // }, [])

   useEffect(() => {
      if (activeTab === 'users') {
         fetchUsers()
      }
      if (activeTab === 'profiles') {
         fetchProfiles()
      }
   }, [activeTab])


   const fetchUsers = async () => {
      const token = localStorage.getItem('authToken')

      setLoading(true)
      try {
         const response = await fetch('/api/Admin/users?take=10', {
            method : 'GET',
            headers: {
               "Content-Type" : "*/*",
               "Accept"       : "*/*",
               "Authorization": `Bearer ${token}`
            },
         })

         const data = await response.json()
         setUsers(data.users)
      } catch (err) {
         setError(err.message)
      } finally {
         setLoading(false)
      }
   }

   const fetchProfiles = async () => {
      const token = localStorage.getItem('authToken')

      setLoading(true)
      try {
         const response = await fetch('/api/Admin/profiles?take=10', {
            method : 'GET',
            headers: {
               "Content-Type" : "*/*",
               "Accept"       : "*/*",
               "Authorization": `Bearer ${token}`
            },
         })

         const data = await response.json()
         setProfiles(data.profiles)
      } catch (err) {
         setError(err.message)
      } finally {
         setLoading(false)
      }
   }


   if (!isAuth || !isAdmin) {
      return <div className={styles.container}><h2 style={{color: 'white', textAlign: 'center'}}>Нужно войти в аккунт</h2></div>
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

                  {loading && <p>Loading users...</p>}
                  {error && <p>Error: {error}</p>}

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

                  {loading && <p>Loading users...</p>}
                  {error && <p>Error: {error}</p>}

                  {!loading && !error && (
                     <ul>
                        {profiles.map(profile => (
                           <li key={profile.id}>
                              <p><strong>Name:</strong> {profile.name}</p>
                              <p><strong>Description:</strong> {profile.description}</p>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
            )}
         </div>
      </div>
   )
}

export default Admin