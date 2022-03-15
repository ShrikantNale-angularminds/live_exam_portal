import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Footer() {

    const navigate = useNavigate()

    useEffect(() => {
        console.log(localStorage.getItem('user'));
        if(!localStorage.getItem('user')) {
            navigate('/auth/login')
        }
    },[])
    return (
        <footer _ngcontent-jjt-c3="" className="p-4 p-sm-5">
            <div _ngcontent-jjt-c3="" className="container text-center">
                <div _ngcontent-jjt-c3="" className="text-center small mb-3 text-muted" style={{ display: 'block', padding: '20px' }}>
                    <a _ngcontent-jjt-c3="" className="text-muted mr-3" href="https://www.angularminds.com/">Terms of use</a>
                    <a _ngcontent-jjt-c3="" className="text-muted mr-3" href="https://www.angularminds.com/">Privacy policy</a>
                    <a _ngcontent-jjt-c3="" className="text-muted mr-3" href="https://www.angularminds.com/">Support</a>
                    <a _ngcontent-jjt-c3="" className="text-muted mr-3" href="https://www.angularminds.com/">Contact</a>
                    <br _ngcontent-jjt-c3="" /> © 2020 Angular Minds Pvt Ltd, All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
