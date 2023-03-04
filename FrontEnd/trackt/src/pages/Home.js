import LoadingCircle from '../components /LoadingCircle'
import {useEffect, useState} from "react";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../style/Home.css'


export default function Home(){
    //Variables that will hold our input data
    const [link, updateLink] = useState("")
    const [submit, updateSubmit] = useState(false)
    const [loadingCircle, updateStatus] = useState(false)

    //OnChange Methods
    const changeLink = (event, method) => {
        updateLink(event.target.value)
    }

    const changeStatus = (event, method) => {
        // updateSubmit(true)
        updateStatus(true)
        console.log("stats changed")
        console.log(loadingCircle)
    }

    //API Function will go here 


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
                    <h1 className = "mainText">Linkdin Profile Scraper</h1>
                    <div className = 'formHolder'>
                    <Form>
                        <Form.Group className = "mb-3">
                            <Form.Control className = "emailField" type="email" placeholder="Enter URL of Linkdin Profile" onChange={changeLink}></Form.Control>
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