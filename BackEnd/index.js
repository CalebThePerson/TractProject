const express = require('express')
const puppeteer = require('puppeteer')
const cheerio = require("cheerio")
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3001


//This allows our server to be acessed by any where on the internet
app.use(
    cors({orgin:"*"})
)

app.listen(port, () => {
    console.log(`Track Backend listening on http://localhost:${port}`)
})

//Actuall Endpoints
app.get('/login', async(req, res) => {
    console.log('Logging in')
    const email = req.query.email
    const password = req.query.password

    //test prints
    console.log(email)
    console.log(password)
    const response = await login(email, password)
    if (response == true) {
        res.send('Currently Logged in')
    } else {
        res.send(response)
    }

})


app.get('/scrapping', async(req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    console.log("Starting to Scrap")
    const url = req.query.url
    console.log(url)
    await getData(url)

})

//Scrapping functions
async function login(email, password) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = (await browser.pages())[0]
    await page.goto('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin')
    await page.waitForSelector('.header__content__heading')

    await page.type('#username', email)
    await page.type('#password', password)

    await page.waitForNavigation()
    await page.goto('https://linkedin.com/feed/')

    if (await page.url() != 'https://linkedin.com/feed/') {
        browser.close()
        return "Error with Login Information"
    }
    const cookies = await page.cookies()
    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2))
    browser.close()
    return true
}

async function getData(url) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = (await browser.pages())[0]
    await page.goto(url)
    await page.waitForNavigation(50000)
    
    const data = await page.evaluate(() => document.documentElement.outerHTML)

    browser.close()
    parseData(data)

}

async function parseData(data) {
    var $ = await cheerio.load(data, false) 

    console.log($.html())
    //So far this seems like a surefire way of getting the name of the page 
    // const name = $('div[class=.top-card-layout__entity-info]').html()
    // const descriptiton = $('h1[class="text-heading-xlarge inline t-24 v-align-middle break-words"]').text()
    console.log(name)

}