import {useEffect, useState} from "react"
import styles from "./Home.module.sass"
import {useParams} from "react-router-dom";


const GirlProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://192.168.101.41:7228/api/Profile/${id}`, {
                    method : "GET",
                    headers: {
                        "Content-Type": "*/*",
                        "Accept"      : "*/*",
                    },
                })

                if (!response.status >= 300) {
                    setError('Something went wrong')
                    return
                }

                const data = await response.json();
                if (data) {
                    setProfile(data);
                } else {
                    setError("Data format is incorrect");
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className={styles.container}>
            <h2>Profile</h2>
            <div className={styles.profileList}>
                <div key={profile.id} className={styles.profileCard}>
                    {/*<img src={profile.image} alt={profile.name} className={styles.profileImage}/>*/}
                    <h3>{profile.name}</ h3>
                    <p>{profile.age} years old</p>
                    <button onClick={() => {
                        window.location.href = 'http://localhost:3000'
                    }}>Go back</button>
                </div>
            </div>
        </div>
    )
}

export default GirlProfile
