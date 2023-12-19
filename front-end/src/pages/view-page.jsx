import React, { useState, useEffect } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


// https://reactrouter.com/en/main/components/await 


export default function ViewPage(props){

    // console.log(`\nDados do loader, com relação ao view do usuário:\n${dadosLoader.data}\n`)
    // console.log(dadosLoader.data)
    
    const dadosLoader = useLoaderData()
    
    const [listaUsuarios, setListaUsuarios] = useState(dadosLoader.data);
    const [listaSelecionados, setListaSelecionados] = useState([]);
    
    

    // const fetcher = useFetcher();
    const location = useLocation();

    useEffect(() => {
        // location.load(props.path);
        // console.log('qualquercoisa')
        const x = (props.secao === 'Usuários') ? 'users' : "events"
        let res = axios.get(`http://localhost:3000/${x}`).then(
            (response) => {
                console.log(response)
                setListaUsuarios(response.data)
            }
        )
        
      }, [location]);




    const TableHead = ({data}) => {

        let colunas = Object.getOwnPropertyNames(data)

        let idx = colunas.findIndex((coluna) => coluna === 'senha');
        if (idx > -1) { 
            colunas.splice(idx, 1);
        }

        colunas.push('Selecionar')

        let ret = colunas.map((coluna, index) => 
            <th key={`coluna${index}`}>{coluna}</th >
        )

        return ret
    }


    const TableRow = ({usuarios}) => {
        // array com objetos, sendo cada um usuario e as informações do usuário

        let conteudoTabela = usuarios.map((user, indexUser) => {
            // Pegando os objetos usuarios um por um

            // Apaga a senha se tiver
            delete user['senha']

            // Pegando apenas os valores
            let userDataValues = Object.values(user)

            // Vou retornar colunas
            let colunas = userDataValues.map((value, indexValue) => {
                return <td key={`row${indexUser}column${indexValue}`}>{value.toString()}</td>
            })

            colunas.push(
                <td className="text-center" key={`checkboxId${indexUser}`}>
                    <input className="form-check-input" onChange={onCheckboxChange} type="checkbox" id={`checkboxId${indexUser}`} value={`${user.cpf}`} aria-label="..."></input>
                </td>
            )

            return <tr key={`row${indexUser}`}>{colunas}</tr>
        })

        return conteudoTabela
    }

    function onCheckboxChange (event) {
        // console.log('Checkbox selecionada.')
        let novaListaSelecionados = listaSelecionados
        if (event.target.checked) {
            novaListaSelecionados.push(event.target.value)
            setListaSelecionados(novaListaSelecionados)
        } else {
            let idxRetirar = novaListaSelecionados.indexOf(event.target.value)
            novaListaSelecionados.splice(idxRetirar, 1)
            setListaSelecionados(novaListaSelecionados)
        }
    }

    function onButtonClick () {

        let listaInfo = []

        listaSelecionados.forEach((cpf) => {
            let info = listaUsuarios.find((userInfo) => userInfo.cpf === cpf)
            listaInfo.push(info)
        })

        console.log(listaInfo)
    }

    // function onButtonClick2 () {

    //     let listaInfo = []

    //     if (props.secao === 'Eventos') {
    //         //
    //         listaSelecionados.forEach((cpf) => {
    //             let info = listaUsuarios.find((userInfo) => userInfo.id === cpf)
    //             listaInfo.push(info)
    //         })
    //     } else {
    //         //
    //         listaSelecionados.forEach((cpf) => {
    //             let info = listaUsuarios.find((userInfo) => userInfo.cpf === cpf)
    //             listaInfo.push(info)
    //         })
    //     }


    //     console.log(listaInfo)
    // }


    return ( 
        <div className="container-fluid">
            {/* <h1 className="fs-1" >Usuários</h1> */}
            <h1 className="fs-1" >{props.secao}</h1>
            <div className="container overflow-x-scroll" style={{"background": "#d9d9d9"}} >
                
                <table className="table my-2" style={{"width": "1000px"}}>
                    <thead>
                        <tr>
                            <TableHead data={listaUsuarios[0]} />
                        </tr>
                    </thead>
                    <tbody>  
                        <TableRow usuarios={listaUsuarios} />
                    </tbody>
                </table>



            </div>
            <div className="container position-relative">
                {/* <nav className="position-absolute start-0 end-50 m-3 " aria-label="Page navigation">
                    <ul className="pagination">
                        <li className="page-item disabled">
                            <button className="page-link"><span aria-hidden="true">&laquo;</span></button>
                        </li>

                        <li className="page-item active">
                            <button className="page-link">1</button>
                        </li>
                        <li className="page-item">
                            <button className="page-link">2</button>
                        </li>
                        <li className="page-item">
                            <button className="page-link">3</button>
                        </li>

                        <li className="page-item">
                            <button className="page-link"><span aria-hidden="true">&raquo;</span></button>
                        </li>
                    </ul>
                </nav> */}
                <button className="btn btn-primary btn-lg m-3 position-absolute top-0 end-0" type="button" onClick={onButtonClick} >Baixar</button>
            </div>
        </div>
    )
}