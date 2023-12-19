import React, { useState } from "react";
import { ReactDOM } from 'react'
import { createBrowserRouter, RouterProvider, Form, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// import LoginUser from '../fake-back-end/login-functions'


export async function action(userName, userPassword) {
    // const DBusers = await LoginUser(userName, userPassword);
    // console.log(DBusers)
    // return DBusers;
    return 'DBusers'
};






export default function LoginBox() {

    const [userInfo, setUserInfo] = useState({userName: '', userPassword: ''});
    // const [isAdmin, setIsAdmin] = useState(false);

    let route = ''
    let acceptLogin = false;


    function onChange(event) {
        /**
         * Pega e guarda o valor que está sendo digitado pelo usuário.
         */
        const {value, name} = event.target;
        let newUserInfo = userInfo;
        newUserInfo[name] = value;
        setUserInfo(newUserInfo);
    };

    
    const onClick = () => {
        if (userInfo["userName"] === "Gu"){
            let newUserInfo = userInfo;
            newUserInfo["isAdmin"] = true;
            setUserInfo(newUserInfo);
        } else {
            let newUserInfo = userInfo;
            newUserInfo["isAdmin"] = false;
            setUserInfo(newUserInfo);
        }
    };

    function formAction(algo) {
        console.log('formAction')
        console.log(algo)
    };

    return(
        <div className="card rounded-5" style={{"width": "20rem"}}>
            {/* <Form action='/main' method="post" state={userInfo} > */}
            {/* <Form action='/main' method="post"  > */}
            <Form action="/main">
                <div className="card-body" clearfix='true'>
                    <h1 className="card-title text-center">Portal do Professor</h1>
                    <div className="form-floating mb-3">
                        <input className="form-control rounded-pill bg-secondary-subtle border-secondary-subtle focus-ring focus-ring-secondary fs-4" id="user-name-input" type="email" name="userName" placeholder="e-mail" onChange={onChange} required />
                        <label htmlFor="user-name-input"  htmlFor="user-name-input">e-mail</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input id="user-password-input" type="password" name="userPassword" className="form-control rounded-pill bg-secondary-subtle border-secondary-subtle focus-ring focus-ring-secondary" placeholder="senha" onChange={onChange} required />
                        <label htmlFor="user-password-input" htmlFor="user-password-input">senha</label>
                    </div>


                    <button type="submit" className="btn btn-primary position-relative bottom-0 start-50 translate-middle-x fw-bold" onClick={onClick}>Login</button>
                </div>
            </Form>
        </div>
    )
};