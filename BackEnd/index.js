const express = require('express')
const puppeteer = require('puppeteer')
const cheerio = require("cheerio")
const cors = require('cors')
const fs = require('fs').promises
const pretty = require('pretty')
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
    // console.log(password)
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

app.get('/lightscrape', async(req,res) => {
    console.log('starting Light Scrape')
    const url = req.query.url
    var allData = await lightgetData(url)
    res.send(allData)
    console.log('finished scrape')

})

//Scrapping functions
async function login(email, password) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = (await browser.pages())[0]
    await page.goto('https://www.linkedin.com/checkpoint/lg/sign-in-another-account')
    await page.waitForSelector('.header__content__heading')

    await page.type('#username', email)
    await page.type('#password', password)
    await page.click(".btn__primary--large")

    await page.waitForNavigation()
    await page.waitForTimeout(400)
    await page.goto('https://linkedin.com/feed/')
    await page.waitForSelector('#ember25')
    const url = await page.url()
    console.log(url)

    if (url != 'https://www.linkedin.com/feed/') {
        browser.close()
        console.log('Closing, Error Loging In')
        return "Error with Login Information"
    }
    const cookies = await page.cookies()
    // await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2)) Uncomment latter
    browser.close()
    console.log('Closing, Logged In')
    return true
}

async function getData(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
        // slowMo: 500
    })
    try {
        await fs.readFile('./cookies.json')
    } catch(e) {
        console.log(e)
        return 'error'
    }
    const cookiesString = await fs.readFile('./cookies.json')
    const cookies = JSON.parse(cookiesString)

    const page = (await browser.pages())[0]
    await page.setCookie(...cookies)

    await page.goto(url)
    await page.waitForSelector('.ivm-image-view-model')
    await page.click('.artdeco-button__icon')
    const buttons = await page.$$('span[class="inline-show-more-text__link-container-collapsed"]')
    // console.log(buttons)
    for (const button in buttons) {
        await button
    }

    // await page.waitForNavigation()
    
    const data = await page.evaluate(() => document.documentElement.outerHTML)
    
    var username = url.substr(28,(url.length)-1)
    console.log(username)
    await page.goto(`https://www.linkedin.com/in/${username}details/experience/`)
    await page.waitForSelector('.t-20')
    const experienceData = await page.evaluate(() => document.documentElement.outerHTML)

    await page.goto(`https://www.linkedin.com/in/${username}details/education/`)
    await page.waitForSelector('.t-20')
    const educationData = await page.evaluate(() => document.documentElement.outerHTML)

    await page.goto(`https://www.linkedin.com/in/${username}details/recommendations/?detailScreenTabIndex=0`)
    await page.waitForSelector('.t-20')
    const reccomendationData = await page.evaluate(() => document.documentElement.outerHTML)



    browser.close()
    parseData(data, experienceData, educationData, reccomendationData)

}

async function parseData(data, experience, education, reccs) {
    var $ = await cheerio.load(data, false) 

    // console.log(pretty($.html()))

    //Find a way to just have it be N/A if there is nothing 
    //So far this seems like a surefire way of getting the name of the page 
    const name = $('.text-heading-xlarge').text()
    const titleDesc = $('.text-body-medium').text().trim()
    const location = $('.text-body-small:last').text().trim()
    var about = $('.pvs-header__container')
    if (about.html() != null && about.html().includes('About')) {
        $ = await cheerio.load(about.next().html(), false)
        // console.log(pretty($.html()))
        about = $('span[class=visually-hidden]').text().trim()
        // console.log(about)
        $ = await cheerio.load(data, false) 
    }

    var exp = await cheerio.load(experience)
    var allExp = []

    exp('.pvs-entity').each((i, element) => {
        const experience = exp(element).find('.visually-hidden').text()
        allExp.push(experience)
    })

    var edu = await cheerio.load(education)
    var allEdu = []

    edu('.pvs-entity').each((i, element) => {
        const school = edu(element).find('.visually-hidden').text()
        allEdu.push({school})
    })


    var recs = await cheerio.load(reccs)
    allRecs = []
    recs('.pvs-entity').each((i, element) => {
        const rec = recs(element).find('.visually-hidden').text()
        allRecs.push(rec)
    })
    // console.log(pretty(experience.html()))
    // console.log(about)

}

async function lightgetData(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
        // slowMo: 1000
    })

    const page = (await browser.pages())[0]
    await page.goto(url)
    await page.waitForSelector('.btn-tertiary')
    await page.click('.btn-tertiary')
    await page.waitForSelector('h1')
    const data = await page.evaluate(() => document.documentElement.outerHTML)
    browser.close()
    const allData = await simpleScrape(data)
    return allData



}

async function simpleScrape(data) {
    var $ = await cheerio.load(data)

    //Getting names and etc

    //This idea is applued to getting all the other inforamtion
    //So basically, we select an element that "usually" has the data we are looking for
    //If the variable is null, then it means the user doesn't have that info ie, reccs or exp
    //However if it does exist, we set that as the new root, and look inside that for children elements, if we don't do this we would be looking through the entire document
    const topDiv = $('.top-card-layout__card').html()
    basicInfo = []
    if (topDiv != null) {
        $ = await cheerio.load(topDiv)
        basicInfo.push({
            name : $('h1').text().trim(),
            desc : $('h2:first').text().trim(),
            about: $('.top-card__subline-item:first').text().trim()
        })
        //Make sure to set the root back to it's original data source
        var $ = await cheerio.load(data)
    }

    const experienceDiv = $('.experience__list').html()
    var allExp = []

    if (experienceDiv != null) {
        $ = await cheerio.load(experienceDiv)

        $('.experience-item').each((i, element) => {
            allExp.push({
                title: $(element).find('.profile-section-card__title').text().trim(),
                subttitle: $(element).find('.profile-section-card__subtitle').text().trim(),
                company: $(element).find('.profile-section-card__subtitle-link').text().trim(),
                company: $(element).find('.profile-section-card__subtitle-link').text().trim(),
                data : $(element).find('.date-range').text().trim(),
                location : $(element).find('.experience-item__location').text().trim()
            })
        })
    
    
        var $ = await cheerio.load(data)
    }

    const educationDiv = $('.education__list').html()
    var allEdu = []

    if (educationDiv != null) {
        $ = await cheerio.load(educationDiv)
        $('.education__list-item').each((i, element) => {
            allEdu.push({
                title: $(element).find('.profile-section-card__title').text().trim(),
                subttitle: $(element).find('.profile-section-card__subtitle').text().trim(),
                description: $(element).find('.education__item--activities-and-societies').text().trim(),
            })
        })
        var $ = await cheerio.load(data)
    }

    const recDiv = $('ul[data-impression-id=public_profile_show-more-less]').html()
    allRecs = []

    if (recDiv != null) {
        $ = await cheerio.load(recDiv)
        
        $('.recommendations__list-item').each((i, element) => {
            allRecs.push({
                name: $(element).find('h3').text().trim(),
                profileUrl: $(element).find('a').attr('href'),
                description: $(element).find('.body-text:first').text().trim(),
            })
        })
    }
    return [basicInfo, allEdu, allExp, allRecs]

}