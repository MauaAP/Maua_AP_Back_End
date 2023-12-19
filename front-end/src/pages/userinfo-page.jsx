import React, { useState } from "react";
import { Form } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchComponent from "../components/search-component";
import axios from "axios";

export default function UserInfoPage (props){

    const [userInfo, setUserInfo] = useState(
        {
            "cpf": "xxx.xxx.xxx-x",
            "telefone": "(xx) xxxxx-xxxx",
            "ra": "xx.xxxxx-x",
            "isProfessor": 0,
            "instituicao": "None",
            "nome": "nome sobrenome",
            "email": "em@il.com",
            "senha": "xxxxxxxxxxxxx"
        }
    )

    function onChange(event) {
        const {value, name} = event.target;
        let newUserInfo = {...userInfo};
        newUserInfo[name] = value;
        setUserInfo(newUserInfo);
    };
    
    async function onSearchClick (searchId) {

        if (props.target === 'usuario'){
            axios.get(`http://localhost:3000/users/${searchId}`)
            .then((response) => {
                // console.log('No then:')
                // console.log(response.data)
                setUserInfo(response.data[0])
            })
        } else {
            console.log('WIP')
        }
    }

    function onClick() {
        console.log(userInfo)
    }

    function onDeleteClick() {
        axios.delete(`http://localhost:3000/users/${userInfo.cpf}`)
        .then((res) => {
            console.log(res)
        })
    }
    
    function onCreateClick() {
        axios.post(`http://localhost:3000/users`, userInfo)
        .then((res) => {
            console.log(res)
        })
    }


    function onUpdateClick() {
        axios.put(`http://localhost:3000/users/${userInfo.cpf}`, userInfo)
        .then((res) => {
            console.log(res)
        })
    }


    return(
        <div className="container-fluid">
            <div className={`container-fluid ${props.create ? 'visually-hidden' : ''}`}>
                <SearchComponent className={props.create ? 'visually-hidden' : ''}   target={props.target} saveInfo={setUserInfo} onSearchClick={onSearchClick}></SearchComponent>
            </div>

            <Form className="d-flex flex-column">
                <div className="d-flex">
                    <img className="rounded-circle m-3" style={{"height": "200px"}} src="https://th.bing.com/th/id/R.494014c1479a1d770af09de8f952ca85?rik=yET%2fgVZTOu9kJw&riu=http%3a%2f%2fwww.newdesignfile.com%2fpostpic%2f2013%2f01%2fgeneric-user-icon-windows_321380.png&ehk=6YmE90QJGnIzBGX40xBluW5kdj9g%2fjNgw3YailPgCAE%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1" alt="Sem Imagem" />
                    <div className="container-fluid d-flex flex-column m-3">
                        <label className="m-1 ms-4 form-label fs-4" htmlFor="#nomeUsuario">Nome</label>
                        <input className="m-1 form-control rounded-pill bg-secondary-subtle border-secondary-subtle focus-ring focus-ring-secondary fs-4" value={userInfo.nome} onChange={onChange} disabled={props.delete} name="nome" id="nomeUsuario" type="text" />

                        <label className="m-1 ms-4 form-label fs-4" htmlFor="#nomeUsuario">CPF</label>
                        <input className="m-1 form-control rounded-pill bg-secondary-subtle border-secondary-subtle focus-ring focus-ring-secondary fs-4" value={`${userInfo.cpf}`} onChange={onChange} disabled={props.delete} name="cpf" id="cpfUsuario" type="text" />
                    </div>
                </div>
                <div className="container-fluid d-flex flex-column m-3">
                    <label className="m-1 ms-4 form-label fs-4" htmlFor="#nomeUsuario">E-mail</label>
                    <input className="m-1 form-control rounded-pill bg-secondary-subtle border-secondary-subtle focus-ring focus-ring-secondary fs-4" value={userInfo.email} onChange={onChange} disabled={props.delete} name="email" id="emailUsuario" type="text" />
                    <div className="container-fluid row my-2">
                        <div className="form-check col-3 fs-4 border-end border-black border-5 my-2">
                            <label className="form-check-label"  htmlFor="isProfessor">Sou professor</label>
                            <input className="form-check-input" checked={userInfo.isProfessor} disabled={props.delete} onChange={onChange} name="isProfessor" type="checkbox" id="isProfessor" />
                        </div>
                        <div className="row col fs-4 my-2">
                            <label className="col-4 col-form-label fs-5" htmlFor="#numeroMatricula">Número matricula</label>
                            <div className="col-8">
                                <input className="form-control rounded-pill bg-secondary-subtle border-secondary-subtle focus-ring focus-ring-secondary fs-4" value={userInfo.ra} onChange={onChange} disabled={props.delete} name="ra" id="numeroMatricula" type="text" />
                            </div>
                        </div>
                    </div>
                    <label className="m-1 ms-4 form-label fs-4" htmlFor="#nomeUsuario">Telefone</label>
                    <input className="m-1 form-control rounded-pill bg-secondary-subtle border-secondary-subtle focus-ring focus-ring-secondary fs-4" value={userInfo.telefone} onChange={onChange} disabled={props.delete} name="telefone" id="telefoneUsuario" type="text" />
                    <label className="m-1 ms-4 form-label fs-4" htmlFor="#nomeUsuario">Instituicao</label>
                    <input className="m-1 form-control rounded-pill bg-secondary-subtle border-secondary-subtle focus-ring focus-ring-secondary fs-4" value={userInfo.instituicao} onChange={onChange} disabled={props.delete} name="instituicao" id="instituicaoUsuario" type="text" />
                    <div className="m-3 row justify-content-evenly" > 
                        <button className={`btn btn-success fs-4 col-3 m-1 ${props.create ? '' : 'visually-hidden'}`} type="button" onClick={onCreateClick} >Criar</button>
                        <button className={`btn btn-warning fs-4 col-3 m-1 ${props.update ? '' : 'visually-hidden'}`} type="button" onClick={onUpdateClick} >Atualizar</button>
                        <button className={`btn btn-danger fs-4 col-3 m-1 ${props.delete ? '' : 'visually-hidden'}`} type="button" onClick={onDeleteClick} >Apagar</button>
                    </div>
                </div>

            </Form>
        </div>
    )

}