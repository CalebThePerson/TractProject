import LoadingCircle from '../components /LoadingCircle'
import DisplayBox from '../components /DisplayBox';
import {useEffect, useState} from "react";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../style/Home.css'
import axios from 'axios'
import logo from '../assests/png.png'
require('cors')


export default function Home(){
    //Variables that will hold our input data
    const [link, updateLink] = useState("")
    const [submit, updateSubmit] = useState(false)
    const [loadingCircle, updateStatus] = useState(false)
    const [appropriateLink, updateLinkStatus] = useState(true)
    const [loginBox, displayBox] = useState(false)
    const [loggedIn, changeLoginStatus] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //OnChange Methods
    const changeLink = (event, method) => {
        updateLink(event.target.value)
    }

    const changeStatus = (event, method) => {
        // updateSubmit(true)

        if (!link.includes("linkedin") && !link.includes("Linkedin")) {
            updateLinkStatus(false)
        } else {
            updateStatus(true)
            console.log("stats changed")
            console.log(loadingCircle)
            getInformation()
        }

    }

    const changeBoxStatus = (event, method) => {
        displayBox(true)
    }

    //onChange Methods for child views
    // const updateEmail = (event, method) => {

    // }

    // const updatePassword = (event, method) => {

    // }

    // const updateLogin = (event, method ) => {

    // }
    //API Function will go here

    async function login(){

    }
    
    async function getInformation() {
        await axios(`http://localhost:3001/scrapping?url=`+encodeURI(link) )
    }


    //The view that is being rendered
    if(submit) {
        return(
            <h1>POg</h1>
        )
    } else {
        if (loginBox){
            return(<DisplayBox updateEmail = {email => setEmail(email)} updatePassword = {password => setPassword(password)} loggedIn = {loggedIn => changeLoginStatus(true)} showItself = {display => displayBox(display)}></DisplayBox>)
        } else {
            return(
                <body id = 'mainBody'>
                    <div id='header'>
                     <button className = 'logo' onClick={changeBoxStatus}><img src={logo} className='logo'></img></button>
                    <div id = "mainContent">
                    <div id = "contentWrapper">
                        <h1 className = "mainText">Linkedin Profile Scraper</h1>
                        <div className = 'formHolder'>
                        <Form>
                        {!appropriateLink && <Form.Label>Make sure the url is a Linkedin url</Form.Label>}
                            <Form.Group className = "mb-3">
                                <Form.Control className = "emailField" placeholder="Enter URL of Linkdin Profile" onChange={changeLink}></Form.Control>
                            </Form.Group>
                            <Button id = "submitButton" variant="primary" type="submit" onClick={changeStatus}>Submit</Button>
                            { loadingCircle && <LoadingCircle />}
                        </Form>
                        </div>
                    </div>
                    </div>
                    </div>
                </body>
            )
        }

    }
}