import LoadingCircle from '../components /LoadingCircle'
import DisplayBox from '../components /DisplayBox';
import {useEffect, useState} from "react";
import { CSVLink, CSVDownload } from "react-csv";
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
    const [changeView, updateViewStat] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [basicInfo, updateBasic] = useState([])
    const [eduInfo, updateEdu] = useState([])
    const [expInfo, updateExp] = useState([])
    const [recInfo, updateRec] = useState([])

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
        // await axios(`http://localhost:3001/scrapping?url=`+encodeURI(link) )
        const response = await axios(`http://localhost:3001/lightscrape?url=`+encodeURI(link) )
        updateBasic(response.data[0])
        updateEdu(response.data[1])
        updateExp(response.data[2])
        updateRec(response.data[3])
        updateStatus(false)
        updateViewStat(true)

    }


    //The view that is being rendered
    if(changeView) {
        return(
            <body id='mainbody'>
                <div id = 'mainBody'>
                    <div id = 'mainContent'>
                        <div id = 'contentWrapper'>
                            <div id = 'allInfo'>
                                {basicInfo.map((item, idx) => (
                                    // console.log(item)
                                    <div>
                                    <h1>{item.name}</h1>
                                    <h1>{item.about}</h1>
                                    <h1>{item.desc}</h1>
                                    </div>
                                ))}
                                {eduInfo.map((item, idx) =>(
                                    <div>
                                        <h2>{item.title}</h2>
                                        <h2>{item.subtitle}</h2>
                                    </div>
                                ))}

                                {expInfo.map((item,idx) => (
                                    <div>
                                        <h2>{item.title}, {item.company}, {item.subtitle}</h2>
                                    </div>
                                ))}

                                {recInfo.map((item, idx) => (
                                    <div>
                                        <h3>{item.name}</h3>
                                    </div>
                                ))}

                                {/* <CSVLink>Download me</CSVLink>; */}

                            </div>
                        </div>

                    </div>
                </div>

            </body>
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