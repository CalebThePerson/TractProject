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
async function getData(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = (await browser.pages())[0]
    await page.goto(url)
    await page.waitForNavigation()
    const data = await page.evaluate(() => document.documentElement.outerHTML)
    browser.close()
    parseData(data)

}

async function parseData(data) {
    var $ = await cheerio.load(data, false) 

    //So far this seems like a surefire way of getting the name of the page 
    const name = $('h1').text().trim()
    console.log(name)

}