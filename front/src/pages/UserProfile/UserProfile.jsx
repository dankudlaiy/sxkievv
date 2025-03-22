import './UserProfile.module.sass'

const UserProfile = () => {
   return (
       <button onClick={
          () => {
          localStorage.removeItem('authToken')
          window.location.href = '/'
          }
       }>Logout</button>
   )
}

export default UserProfile