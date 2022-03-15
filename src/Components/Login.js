import { React, useState, useRef, useEffect } from 'react';
import logo from '../Images/logo.svg'
import bgImg from '../Images/login-page-img.jpg'
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import '../LoginCSS/css/style.css'
import GoogleLogin from 'react-google-login';

function Login(props) {

    const reRef = useRef();
    const navigate = useNavigate();

    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        reCaptchaToken: ''
    })

    const [googleData, setGoogleData] = useState({
        idToken: '',
        reCaptchaToken: ''
    })

    useEffect(() => {
        if (googleData.idToken !== '') {
            getGoogleAuth()
        }
    }, [googleData.idToken])

    useEffect(() => {
        if (authData.reCaptchaToken !== '') {
            getAuthentication()
        }
    }, [authData.reCaptchaToken])

    function setUserData(res) {
        console.log(res);

        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', JSON.stringify(res.data.token))
        // console.log(res.data.token);
        props.setUserData(res.data.user)
        props.setToken(res.data.token)

        navigate('/')
    }

    function getAuthentication() {
        axios('http://admin.liveexamcenter.in/api/auth/login', {
            method: 'POST',
            data: authData,
            /* headers: {
                'Authorization': token,

                'Content-Type': 'application/json'
            } */
        })
            .then(res => setUserData(res))/* selfAuth(res.data.token) */
            .catch(err => alert(err.response.data.message))
    }

    function getGoogleAuth() {
        axios('http://admin.liveexamcenter.in/api/auth/google', {
            method: 'POST',
            data: googleData,

        })
            .then(res => setUserData(res))/* selfAuth(res.data.token) */
            .catch(err => alert(err.response.data.message))
    }

    function selfAuth(token) {
        axios.get(`http://admin.liveexamcenter.in/api/auth/self`, {
            headers: {
                'Authorization': token
            }
        })
    }

    async function submitAuths(e) {
        e.preventDefault();

        const token = await reRef.current.executeAsync();
        setAuthData(prev => ({ ...prev, reCaptchaToken: token }))
        // console.log("token= ", token);
    }

    const responseGoogle = async (response) => {
        console.log(response.tokenId);
        const token = await reRef.current.executeAsync();
        setGoogleData({ idToken: response.tokenId, reCaptchaToken: token })
    }

    return (
        <section className="ftco-section pt-1">
            <div className="container">
                <div className="row justify-content-center" style={{ height: '100px' }}>
                    <div className="col-md-6 text-center mb-5 mt-2">
                        <h2 className="heading-section">
                            <img src={logo} alt='logo' width='200px'></img>
                        </h2>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12 col-lg-10">
                        <div className="wrap d-md-flex">
                            <div className="img" /* style="background-image: url(images/bg-1.jpg);" */ style={{ backgroundImage: `url(${bgImg})` }}>
                            </div>
                            <div className="login-wrap p-4 p-md-5">
                                <div className="d-flex">
                                    <div className="w-100">
                                        <h5 className="mb-4" style={{ fontWeight: 'bolder' }}>Login to your account</h5>
                                    </div>
                                    {/* <div className="w-100">
                                        <p className="social-media d-flex justify-content-end">
                                            <a href="#" className="social-icon d-flex align-items-center justify-content-center"><span className="fa fa-facebook"></span></a>
                                            <a href="#" className="social-icon d-flex align-items-center justify-content-center"><span className="fa fa-twitter"></span></a>
                                        </p>
                                    </div> */}
                                </div>
                                <form className="signin-form" onSubmit={e => submitAuths(e)}>
                                    <div className="form-group mb-3">
                                        <label className="label" htmlFor="name">Email address</label>
                                        <input type="email" className="form-control" placeholder="Username" required onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="label" htmlFor="password">Password</label>
                                        <input type="password" className="form-control" placeholder="Password" required onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))} />
                                    </div>
                                    <div className="form-group d-md-flex">
                                        <div className="w-50 text-left">
                                            <label className="checkbox-wrap checkbox-primary mb-0">Remember Me
                                                <input type="checkbox" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        <div className="w-50 text-md-right">
                                            <a href="#">Forgot Password</a>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="form-control btn btn-primary rounded submit px-3"
                                        /* onClick={async () => {
                                            const token = await reRef.current.executeAsync();
                                            setAuthData(prev => ({ ...prev, reCaptchaToken: token }))
                                        }} */
                                        >
                                            Log In
                                        </button>
                                    </div>

                                    <p className="text-center">OR</p>

                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <GoogleLogin
                                            clientId="971623344603-0qquan9pcdb9iu7oq9genvpnel77i7oa.apps.googleusercontent.com"
                                            buttonText="Log in with Google"
                                            onSuccess={responseGoogle}
                                            onFailure={responseGoogle}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ReCAPTCHA sitekey='6Ld3COIZAAAAAC3A_RbO1waRz6QhrhdObYOk7b_5' size='invisible' ref={reRef} />
        </section>
    )
}

export default Login;
