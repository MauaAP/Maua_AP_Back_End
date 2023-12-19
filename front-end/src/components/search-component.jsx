import React, { useState } from "react";
import { ReactDOM } from 'react'
import { createBrowserRouter, RouterProvider, Form, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SearchComponent(props) {

    const [searchId, setSearchId] = useState('')

    function onChange(event) {
        /**
         * Pega e guarda o valor que está sendo digitado pelo usuário.
         */
        const {value, name} = event.target;

        let newSearchId = searchId;
        newSearchId = value;
        setSearchId(newSearchId)
    };


    return(
        <div>
            <Form action='' className="container" >
                <div>
                    <label className="form-label" htmlFor="#idInput">Informar {(props.target === 'usuario') ? 'CPF' : 'ID'} do {props.target}</label>
                    <input className="form-control rounded-pill bg-secondary-subtle border-secondary-subtle focus-ring focus-ring-secondary" onChange={onChange} name="searchBar" type="text" id="idInput" />
                </div>

                <div className="my-3 row justify-content-evenly">
                    <button className="btn btn-primary col-4" onClick={() => {props.onSearchClick(searchId)}}>Procurar</button>
                </div>
            </Form>
        </div>
    )
}