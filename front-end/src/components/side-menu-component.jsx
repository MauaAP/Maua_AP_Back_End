import React, { useState } from "react";
// import { Offcanvas, Button } from 'bootstrap';
import { Link, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function SideMenu(){

    const [show, setShow] = useState(false);

    const handleShow  = () => setShow(true);
    const handleClose = () => setShow(false);


    // return(
    //     <>
    //         <Button variant="primary" onClick={handleShow}>
    //             Abrir Offcanvas
    //         </Button>

    //         <Offcanvas show={false} onHide={handleClose}>
    //             <Offcanvas.Header closeButton>
    //                 <Offcanvas.Title>Título do Offcanvas</Offcanvas.Title>
    //             </Offcanvas.Header>
    //             <Offcanvas.Body>
    //                 {/* Conteúdo do Offcanvas */}
    //                 Alguma coisa
    //             </Offcanvas.Body>
    //         </Offcanvas>
    //     </>
    // )


    return (
        <div>
            <h3>MENU</h3>
            {/* <ul>
                <li><Link to={`/main/user-data`}>Visualizar perfil</Link></li>
                <li><Link to={`/main/certificates`}>Visualizar certificados</Link></li>
            </ul> */}
            {/* {info["isAdmin"] ? adminMenu : <></>} */}
            <br />
            <h3>Usuários</h3>
            <ul>
                <li><Link to={`/main/usuarios/visualizar`}>Visualizar usuários</Link></li>
                <li><Link to={`/main/usuarios/adicionar`}>Adicionar usuários</Link></li>
                <li><Link to={`/main/usuarios/remover`}>Remover usuários</Link></li>
                <li><Link to={`/main/usuarios/atualizar`}>Atualizar usuários</Link></li>
            </ul>
            <br />
            <h3>Eventos</h3>
            <ul>
                <li><Link to={`/main/eventos/visualizar`}>Visualizar Eventos</Link></li>
                <li><Link to={`/main/eventos/adicionar`}>Adicionar Eventos</Link></li>
                <li><Link to={`/main/eventos/remover`}>Remover Eventos</Link></li>
                <li><Link to={`/main/eventos/atualizar`}>Atualizar Eventos</Link></li>
            </ul>
        </div>
    )
}