const { fetchJson, fetchText } = require('../../util/fetcher')
const config = require('../../config.json')
const moment = require('moment-timezone')
const needle = require('needle')

/**
 * Get random quotes.
 * @returns {Promise<object>}
 */
const quotes = () => new Promise((resolve, reject) => {
    console.log('Getting random quotes...')
    fetchJson('https://videfikri.com/api/randomquotes/')
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Sending call.
 * @param {string} phoneNumber
 * @returns {Promise<object>}
 */
const call = (phoneNumber) => new Promise((resolve, reject) => {
    console.log(`Calling number: ${phoneNumber}...`)
    fetchJson(`https://videfikri.com/api/call?nohp=${phoneNumber}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Sending email.
 * @param {string} emailTarget
 * @param {string} subjectEmail
 * @param {string} messageEmail
 * @returns {Promise<object>}
 */
const email = (emailTarget, subjectEmail, messageEmail) => new Promise((resolve, reject) => {
    console.log(`Sending email to: ${emailTarget}\nSubject: ${subjectEmail}\nMessage: ${messageEmail}`)
    fetchJson(`https://videfikri.com/api/spamemail?email=${emailTarget}&subjek=${subjectEmail}&pesan=${messageEmail}`)
        .then((result) => resolve(result))
        .catch((err) =>  reject(err))
})

/**
 * Search for Alkitab.
 * @param {string} query 
 * @returns {Promise<object>}
 */
const alkitab = (query) => new Promise((resolve, reject) => {
    console.log('Searching for Alkitab info...')
    fetchJson(`https://docs-jojo.herokuapp.com/api/alkitabsearch?q=${query}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Get Wikipedia result for Indonesian language from given query.
 * @param {string} query
 * @returns {Promise<object>}
 */
const wiki = (query) => new Promise((resolve, reject) => {
    console.log(`Get result for ${query} in Wikipedia...`)
    fetchJson(`https://docs-jojo.herokuapp.com/api/wiki?q=${query}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Get Wikipedia result for English language from given query.
 * @param {string} query
 * @returns {Promise<object>}
 */
const wikien = (query) => new Promise((resolve, reject) => {
    console.log(`Get result for ${query} in Wikipedia...`)
    fetchJson(`https://videfikri.com/api/wikieng?query=${query}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Get Indonesian word definition from KBBI (Kamus Besar Bahasa Indonesia).
 * @param {string} word
 * @returns {Promise<object>}
 */
const kbbi = (word) => new Promise((resolve, reject) => {
   try{
    console.log(`Searching definition for ${word} in KBBI...`)
    fetchJson(`https://kbbi-api-zhirrr.vercel.app/api/kbbi?text=${word}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
   }catch(err){
    console.log(err.stack)
   }
})

/**
 * Get latest earthquake info in Indonesia from BMKG (Badan Meteorologi Klimatologi dan Geofisika).
 * @returns {Promise<object>}
 */
const bmkg = () => new Promise((resolve, reject) => {
    console.log('Get data from BMKG...')
    fetchJson('https://docs-jojo.herokuapp.com/api/infogempa')
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Get Instagram account info from username.
 * @param {string} username
 * @returns {Promise<object>}
 */
const igStalk = (username) => new Promise((resolve, reject) => {
    console.log(`Searching account for ${username}`)
    fetchJson(`https://docs-jojo.herokuapp.com/api/stalk?username=${username}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Get motivation text.
 * @returns {string}
 */
const motivasi = () => new Promise((resolve, reject) => {
    console.log('Get motivation text...')
    fetchText('https://raw.githubusercontent.com/VideFrelan/motivasi/main/motivasi.txt')
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Create shortlink.
 * @param {string} url
 * @returns {Promise<string>}
 */
const shortener = (url) => new Promise((resolve, reject) => {
    console.log('Creating shortlink...')
    fetchText(`https://tinyurl.com/api-create.php?url=${url}`)
        .then((text) => resolve(text))
        .catch((err) => reject(err))
})

/**
 * SMS gateway.
 * @param {string} number
 * @param {string} msg
 * @returns {Promise<object>}
 */
const sms = (number, msg) => new Promise((resolve, reject) => {
    console.log(`Sending SMS to ${number} with message: ${msg}`)
    fetchJson(`https://api.i-tech.id/special/sms?key=${config.itech}&no=${number}&msg=${msg}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Get jadwal sholat.
 * @param {string} city
 * @returns {Promise<object>}
 */
 const jadwalSholat = (city) => new Promise((resolve, reject) => {
    const url = 'https://api.myquran.com/v1/sholat/'
    const kodeKota = new Array()
    const tanggal = moment.tz('Asia/Jakarta').format('YYYY-MM-DD')
    var tanggalsplit = tanggal.split('-')
    console.log(`Get jadwal sholat for ${city}...`)
    needle(url + '/kota/cari/' + city, (err, resp, body) => {
        if (err) throw err
        if (body.status == false) return reject ('Kota tidak ditemukan!')
        switch (body.data.length) {
            case 0:
                reject('Kota tidak ditemukan!')
            break
            default:
                kodeKota.push(body.data[0]['id'])
                needle(url + '/jadwal/' + kodeKota[0] + `/${tanggalsplit[0]}/${tanggalsplit[1]}/${tanggalsplit[2]}`, (err, resp, body) => {
                    if (err) throw err
                    resolve([body.data.jadwal])
                })
            break
        }
    })
})

/**
 * Get Twitter trending.
 * @returns {Promise<object>}
 */
const trendingTwt = () => new Promise((resolve, reject) => {
    console.log('Get Twitter trending...')
    fetchJson('https://docs-jojo.herokuapp.com/api/trendingtwitter')
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Get job seek data.
 * @returns {Promise<object>}
 */
const jobSeek = () => new Promise((resolve, reject) => {
    console.log('Searching for jobs...')
    fetchJson('https://docs-jojo.herokuapp.com/api/infoloker')
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Sending hoax update.
 * @returns {Promise<object>}
 */
const infoHoax = () => new Promise((resolve, reject) => {
    console.log('Checking hoaxes...')
    fetchJson('https://docs-jojo.herokuapp.com/api/infohoax')
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Sending spam SMS.
 * @param {Number} no 
 * @param {Number} amount 
 * @returns {Promise<object>}
 */
const spamsms = (no, amount) => new Promise((resolve, reject) => {
    console.log(`Sending spam SMS to: ${no}`)
    fetchJson(`https://docs-jojo.herokuapp.com/api/spamsms?no=${no}&jum=${amount}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Create TTP.
 * @param {string} text 
 * @returns {Promise<object>}
 */
const ttp = (text) => new Promise((resolve, reject) => {
    console.log('Creating TTP...')
    fetchJson(`https://api.areltiyan.site/sticker_maker?text=${encodeURIComponent(text)}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Search for Result Casses Corona.
 * @param {string} query 
 * @returns {Promise<object>}
 */
const corona = (country) => new Promise((resolve, reject) => {
    console.log(`Search for country ${country}`)
    fetchJson(`https://coronavirus-19-api.herokuapp.com/countries/${country}/`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

module.exports = {
    wiki,
    kbbi,
    bmkg,
    igStalk,
    motivasi,
    shortener,
    sms,
    jadwalSholat,
    alkitab,
    trendingTwt,
    jobSeek,
    infoHoax,
    spamsms,
    email,
    call,
    quotes,
    wikien,
    ttp,
    corona
}
