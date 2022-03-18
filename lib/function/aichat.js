const fs = require('fs-extra')
const parseMilliseconds = require('parse-ms')
const reminder = require('./reminder');
const _reminder = JSON.parse(fs.readFileSync('./database/reminder.json'))
const toMs = require('ms')

//nlp packages
const { StemmerId, StopwordsId } = require('@nlpjs/lang-id');
const stemmer = new StemmerId();
stemmer.stopwords = new StopwordsId();


module.exports = async (client, event) => {
    const { id, body, mimetype, type, t, from, sender, content, caption, author, isGroupMsg, isMedia, chat, quotedMsg, quotedMsgObj, mentionedJidList, selectedButtonId } = event;

    const validMessage = caption ? caption : body;

    const command = validMessage.trim().split(' ')[0].slice(1);
    const arguments = validMessage.trim().split(' ').slice(1);
    const arg = validMessage.substring(validMessage.indexOf(' ') + 1)
    const q = arguments.join(' ')
    
    const eyay = stemmer.tokenizeAndStem(q, false)

    if (eyay.includes('ingat') || arguments.includes('remind') || arguments.includes('inget')){
        let messRemind = `Pengingat otomatis untuk @${sender.id.replace('@c.us', '')}`
        let waktu = 0
        //let satuan = ''
        if (arguments.includes('satu') || arguments.includes('1') || arguments.includes('belas')) {waktu = waktu + '1'}
        if (arguments.includes('dua') || arguments.includes('2')) {waktu = waktu + '2'}
        if (arguments.includes('tiga') || arguments.includes('3')) {waktu = waktu + '3'}
        if (arguments.includes('empat') || arguments.includes('4')) {waktu = waktu + '4'}
        if (arguments.includes('lima') || arguments.includes('5')) {waktu = waktu + '5'}
        if (arguments.includes('enam') || arguments.includes('6')) {waktu = waktu + '6'}
        if (arguments.includes('tujuh') || arguments.includes('7')) {waktu = waktu + '7'}
        if (arguments.includes('delapan') || arguments.includes('8')) {waktu = waktu + '8'}
        if (arguments.includes('sembilan') || arguments.includes('9')) {waktu = waktu + '9'}
        if (arguments.includes('sepuluh') || arguments.includes('10')) {waktu = waktu + '10'}

        let time = parseInt(waktu)

        if (arguments.includes('jam')) {time = time + 'h'}
        if (arguments.includes('menit')) {time = time + 'm'}
        if (arguments.includes('detik')) {time = time + 's'}
        if (arguments.includes('hari')) {time = time + 'd'}

        if (arguments.includes('buat') || arguments.includes('untuk')){
            let location = (arguments.includes('buat')) ? arguments.indexOf('buat') : arguments.indexOf('untuk')
            arguments.splice(0, location++)
            arguments.filter(e => e !== 'yak')
            arguments.filter(e => e !== 'ya')
            messRemind = arguments.join(' ')
        }

        const parsedTime = parseMilliseconds(toMs(time))
        reminder.addReminder(sender.id, messRemind, time, _reminder)
        await client.sendTextWithMentions(from, `*「 REMINDER 」*\n\nReminder diaktifkan! :3\n\n➸ *Pesan*: ${messRemind}\n➸ *Durasi*: ${parsedTime.days} hari ${parsedTime.hours} jam ${parsedTime.minutes} menit ${parsedTime.seconds} detik\n➸ *Untuk*: @${sender.id.replace('@c.us', '')}`, id)
        const intervRemind = setInterval(async () => {
            if (Date.now() >= reminder.getReminderTime(sender.id, _reminder)) {
                await client.sendTextWithMentions(from, `⏰ *「 REMINDER 」* ⏰\n\nAkhirnya tepat waktu~ @${sender.id.replace('@c.us', '')}\n\n➸ *Pesan*: ${reminder.getReminderMsg(sender.id, _reminder)}`)
                _reminder.splice(reminder.getReminderPosition(sender.id, _reminder), 1)
                fs.writeFileSync('./database/reminder.json', JSON.stringify(_reminder))
                clearInterval(intervRemind)
            }
        }, 1000)
    }
    /*
    if (eyay.includes('arti')){
        
    }
    */
    if (eyay.includes('lakukan')){
        await client.sendText()
    }
    
}