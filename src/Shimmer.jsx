import React from 'react'
import "./Shimmer.css";

const Shimmer = () => {
    return (
        <div className='shimmer-container'>
            {/*create fake cards*/}
            {
                Array(10).fill("").map((element, index) => (
                    <div key={index} className='shimmer-card'>
                        <div className="shimmer-img"></div>
                        <div className="shimmer-line"></div>
                        <div className="shimmer-line-short"></div>
                    </div>
                ))


            }
        </div>
    )
}

export default Shimmer
