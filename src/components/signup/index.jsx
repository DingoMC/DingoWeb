import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import styles from "./styles.module.css"
import { cors_url } from "../../lib/cors_url";
import MainLayout from "../../layouts/main";

const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = cors_url('api/users')
            const { data: res } = await axios.post(url, data)
            navigate("/login")
            console.log(res.message)
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
            }
        }
    }
    return (
        <MainLayout current="signup">
            <div className={styles.left}>
                <form className={styles.form_container} onSubmit={handleSubmit}>
                    <h1>Create Account</h1>
                    <input type="text" placeholder="First Name" name="firstName" onChange={handleChange} value={data.firstName} required className={styles.input} />
                    <input type="text" placeholder="Last Name" name="lastName" onChange={handleChange} value={data.lastName} required className={styles.input} />
                    <input type="email" placeholder="Email" name="email" onChange={handleChange} value={data.email} required className={styles.input} />
                    <input type="password" placeholder="Password" name="password" onChange={handleChange} value={data.password} required className={styles.input} />
                    {error && <div className={styles.error_msg}>{error}</div>}
                    <button type="submit" className={styles.green_btn}>Sign Up</button>
                </form>
                <div className={styles.link}>
                    <span>Already have an account? </span>
                    <Link to="/login">Sign In</Link>
                </div>
            </div>
        </MainLayout>
    );
};
export default Signup