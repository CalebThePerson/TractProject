import {useEffect, useState} from "react";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../style/Home.css'


export default function Home(){
    //Variables that will hold our input data
    const [link, updateLink] = useState("")
    const [submit, updateSubmit] = useState(false)

    //OnChange Methods
    const changeLink = (event, method) => {
        updateLink(event.target.value)
    }

    const changeStatus = (event, method) => {
        updateSubmit(true)
    }

    //API Function will go here 


    //The view that is being rendered
    if(submit) {
        return(
            <h1>POg</h1>
        )
    } else {
        console.log(submit)
        return(
            <body id = 'mainBody'>
                <div id = "mainContent">
                <div id = "contentWrapper">
                    <h1 class = "mainText">Linkdin Profile Scraper</h1>
                    <div>
                    <Form>
                        <Form.Group className = "mb-3">
                            <Form.Control className = "emailField" type="email" placeholder="Enter URL of Linkdin Profile" onChange={changeLink}></Form.Control>
                        </Form.Group>
                        <Button id = "submitButton" variant="primary" type="submit" onClick={changeStatus}>Submit</Button>
                    </Form>
                    </div>
                </div>
                </div>
            </body>
        )
    }
}