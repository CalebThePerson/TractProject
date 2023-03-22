import LoadingCircle from '../components /LoadingCircle'
import DisplayBox from '../components /DisplayBox';
import {useEffect, useState} from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../style/Home.css'
import axios from 'axios'
import logo from '../assests/png.png'
import arrow from '../assests/arrow.png'
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
    const [csvData, updateData] = useState([{userDetails : {name: "N/A", desc: "N/A", about: "N/A"}, 
    jobInfo: {title : "N/A", subtitles: "N/A", company: "N/A", dates: "N/A", locations: "N/A"},
    schoolInfo: {school: "N/A", subtitleschool: "N/A", schoolDesc: "N/A"},
    reccomenders: {recNames: "N/A", recUrl: "N/A", theRec: "N/A"}
  }])
    const [csvHeaders, updateHeaders] = useState([])

    //OnChange Methods
    const changeLink = (event, method) => {
        updateLink(event.target.value)
    }

    const changeStatus = (event, method) => {
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

    const updateView = (event, method) => {
        updateViewStat(!changeView)
    }

    //API Function will go here
    async function getInformation() {
        // await axios(`http://localhost:3001/scrapping?url=`+encodeURI(link) )
        const response = await axios(`http://localhost:3001/lightscrape?url=`+encodeURI(link) )
        updateBasic(response.data[0])
        updateEdu(response.data[1])
        updateExp(response.data[2])
        updateRec(response.data[3])
        updateStatus(false)
        updateViewStat(true)
        await createCSVData(response.data[0], response.data[1], response.data[2], response.data[3])
    }

    async function createCSVData(Basic, School, Exp, Rec){
        const header = [
            {label: 'Name', key: 'name'},
            {label: "Description", key: 'desc'},
            {label: "About", key: 'about'},
            {label: "title", key:'jobTitle'},
            {label: "subtitles", key:'sub'},
            {label: "company", key:'company'},
            {label: "dates", key:'dates'},
            {label: "locations", key:'location'},
            {label: "school", key:'school'},
            {label: "sub", key:'subtitleschool'},
            {label: "schooldesc", key:'schoolDesc'},
            {label: "Names", key:'recNames'},
            {label: "recURl", key:'recUrl'},
            {label: "reccomendation", key:'theRec'},
        ]

        var titles = ''
        var subtitles = ''
        var company = ''
        var dates = ''
        var locations = ''
        Exp.forEach((i, element) => {
            var title = i.title
            var sub = i.subttitle || 'N/A'
            var comp = i.company || 'Nothing'
            var date = i.data || 'N/A'
            var location = i.location || 'N/A'

            titles += `${title}, `
            subtitles += `${sub}, `
            company += `${comp}, `
            titles += `${title}, `
            dates += `${date}, `
            locations += `${location}, `
            
        })

        var school = ''
        var sub = ''
        var desc = ''
        School.forEach((i, element) => {
            var title = i.title || 'N/A'
            var subtitle = i.subtitle || 'N/A'
           var  description = i.desc || 'N/A'

            school += `${title}, `
            sub += `${sub}, `
            desc += `${description}, `

        })

        var names = ''
        var urls = ''
        var description = ''
        Rec.forEach((i, element) => {
            var name = i.name || 'N/A'
            var url = i.profileUrl || 'N/A'
            var desc = i.description || 'N/A'

            names += `${name}, `
            urls += `${url}, `
            description += `${desc}, `

        })
        
        const data = [ 
            {name: Basic[0].name, desc: Basic[0].desc, about: Basic[0].about, 
                jobTitle: titles, sub: subtitles, company: company, dates: dates, location: locations, 
                school: school, subtitleschool: sub, schoolDesc: desc, 
                recNames: names, recUrl: urls, theRec: description}
        ]
        updateData(data)
        updateHeaders(header)
    }


    //The view that is being rendered
    if(changeView) {
        return(
            <body id='mainbody'>
                <div className = 'header'>
                <button onClick={updateView} className = 'backArrow'><img src={arrow} className = 'backArrow'></img></button>
                    <div id = 'mainBody'>
                        <div id = 'mainContent'>
                            <div id = 'contentWrapper'>
                                <div id = 'allInfo'>
                                    <h1>User Infomation</h1>
                                    {basicInfo.map((item, idx) => (
                                        <div>
                                        <h1>Name: {item.name}</h1>
                                        <h1>About: {item.about}</h1>
                                        <h1>{item.desc}</h1>
                                        </div>
                                    ))}
                                    <hr></hr>

                                    <h2>School Information</h2>
                                    {eduInfo.map((item, idx) =>(
                                        <div>
                                            <h2>School: {item.title}</h2>
                                            <h2>{item.subtitle}</h2>
                                        </div>
                                    ))}
                                    <hr></hr>
                                    <h3>Work Experience </h3>
                                    {expInfo.map((item,idx) => (
                                        <div>
                                            <h3>{item.title} at {item.company}, {item.subtitle}</h3>
                                        </div>
                                    ))}
                                    <hr></hr>
                                    <h4>Reccomendations</h4>
                                    {recInfo.map((item, idx) => (
                                        <div>
                                            <h4>{item.name}</h4>
                                        </div>
                                    ))}
                                    <CSVLink class= 'csvBtn' data={csvData} headers={csvHeaders}>Download CSV</CSVLink>
                                </div>
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
                    <div className='header'>
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