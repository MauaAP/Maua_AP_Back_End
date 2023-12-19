import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginBox from "../components/login-component"


export default function Login(){
    return ( 
        <div className="fluid-container p-3 mb-2 position-absolute top-50 start-50 translate-middle" style={{"margin": "0", "height": "100%", 'width': '100%', "minHeight": '100%', 'background': "#0c1e46"}}>
            <div className="position-absolute top-50 start-50 translate-middle">
                <img src="https://www.colegioweb.com.br/wp-content/uploads/2019/09/unnamed-620x330-300x160.jpg" className="img-fluid mx-auto d-block" alt="Instituto Mauá de Tecnologia"/>
                <LoginBox></LoginBox>
            </div>
        </div>
    )
}