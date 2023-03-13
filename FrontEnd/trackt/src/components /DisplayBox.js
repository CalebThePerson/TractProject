import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import '../style/DisplayBox.css'
import {useState} from 'react'
import logo from '../assests/png.png'
import axios from 'axios'



export default function DisplayBox(props){

    const [email, updateEmail] = useState('')
    const [password, updatePassword] = useState('')
    const [invalidPassword, updateView] = useState(false)

    //
    const emailChange = (event, method) => {
        updateEmail(event.target.value)
    }

    const passwordChange = (event, method) => {
        updatePassword(event.target.value)
    }

    //Login FUnction
    async function login(event) {
        event.preventDefault()
        const response = await axios(`http://localhost:3001/login?email=${email}&password=${password}`)
        console.log(response.data)
        if (response.data == "Currently Logged in"){
            props.updateEmail(email)
            props.updatePassword(password)
            props.loggedIn(true)
            props.showItself(false)
            console.log("we should be gone")
        } else {

        }
        // ()=> props.loggedin(true)
    }

    if(!props.loggedin){
        return(            
        <body id = 'bigBody'>
        <button className = 'logo' onClick={() => props.showItself(false)}><img src={logo} className='logo'></img></button>

            <div id = 'mainContent'>
                <div id = 'contentWrapper'>
                    <h1>Login</h1>
                    <div id = 'formSquare'>
                        <Form style={ {paddingTop: "10%"}}>
                            <Form.Group class = 'mainGroup'>
                                <Form.Label class = 'innerSquareText'>Email: </Form.Label>
                                <Form.Control class = 'innerFormText' type = 'email' placeholder = 'Enter Email' onChange = {emailChange}></Form.Control>
                            </Form.Group>
                            <Form.Group class = 'mainGroup'>
                                <Form.Label class = 'innerSquareText'>Password: </Form.Label>
                                {invalidPassword && <Form.Label>Invalid Password or Email.  Try Again</Form.Label>}

                                <Form.Control class = 'innerFormText' type = 'password' placeholder = 'Enter Password' onChange = {passwordChange}></Form.Control>
                            </Form.Group>
                            <Button id = 'custom-btn' variant = 'primary' type='submit' onClick={login}>Submit</Button>
                        </Form>
                    </div>
                </div>
            </div>

        </body>)
    }
}