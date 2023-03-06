import LoadingCircle from '../components /LoadingCircle'
import {useEffect, useState} from "react";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../style/Home.css'
import axios from 'axios'
require('cors')


export default function Home(){
    //Variables that will hold our input data
    const [link, updateLink] = useState("")
    const [submit, updateSubmit] = useState(false)
    const [loadingCircle, updateStatus] = useState(false)
    const [appropriateLink, updateLinkStatus] = useState(true)

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

    //API Function will go here
    
    async function getInformation() {
        await axios(`http://localhost:3001/scrapping?url=`+encodeURI(link) )
    }


    //The view that is being rendered
    if(submit) {
        return(
            <h1>POg</h1>
        )
    } else {
        return(
            <body id = 'mainBody'>
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
            </body>
        )
    }
}