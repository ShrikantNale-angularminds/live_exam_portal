import React from 'react'
import ContainerImg from '../Images/no-data-commission.png'

function Container() {
    return (
        <div className="container" /* style={{ margin: "2% 5%", display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }} */>
            {/* <!-- Content here --> */}
            <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0px" }}>
                <h3>Recent Tests</h3>
                <div>
                    <button type="button" className="btn btn-primary">+ Invite</button>
                </div>
            </div>
            <div className='rounded-2' style={{ border: "1px solid rgba(0,0,0,.125)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                <img src={ContainerImg} alt="container-img" width="30%" style={{ maxWidth: '100%' }} />
                <p style={{ color: '#6c757d' }}>No tests taken today</p>
                <button className="btn btn-link" style={{ textDecoration: 'none' }}>Invite</button>
            </div>
        </div>
    )
}

export default Container
