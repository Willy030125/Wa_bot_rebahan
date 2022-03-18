const varmessage = require('./messageHandler')
const _function = require('../lib/function');
const { ind } = require('../message/text/lang/')

module.exports = async (client, event) => {
    const { id, body, mimetype, type, t, from, sender, content, caption, author, isGroupMsg, isMedia, chat, quotedMsg, quotedMsgObj, mentionedJidList, selectedButtonId } = event;

    const command = selectedButtonId.trim().split(' ')[0];
    const arguments = selectedButtonId.trim().split(' ').slice(1);
    const query = arguments.join(' ')

    if (type == 'buttons_response'){
        console.log(`User ${from} selected ${selectedButtonId} - Button Response`)
        switch (command){
            case 'test1':
                await client.sendText(from, `Received text : ${query}`)
            break

            case 'menu':
                let idm = parseInt(arguments[0])
                idm = idm + 1
                await client.sendButtons(from, _txt.menu[idm], [
                    {
                    id: `menu ${idm}`,
                    text: `Next ⏭️`
                    }
                  ], `Help button`)

            case 'ytsearch':
                let location = parseInt(arguments[0])
                let search = query.slice(2)

                const videodata = await _function.youtube.youtubeSearch(search);
                if (!videodata) return await client.sendText(from, '_⚠️ Error !_');
                let url = videodata.url[location];
                let judul = videodata.title[location];
                //const thumb = videodata[index].thumbnail;
                let durasi = videodata.duration[location];

                var menit = Math.floor(durasi / 60);
                var detik = durasi - menit * 60;

                location = location + 1

                let caption = `-------[ *Detail Video* ]-------\n\nJudul : ${judul}\nDurasi : ${menit} menit ${detik} detik`
                await client.sendButtons(from, caption, [
                    {
                    id: `ytmp3 ${url}`,
                    text: 'Download MP3🎵'
                    },{
                    id: `ytmp4 ${url}`,
                    text: 'Download MP4▶️'
                    },{
                    id: `ytsearch ${location} ${search}}`,
                    text: `Next item ⏭️`
                    }
                ], `Video Results ${location}`)

            break

            case 'ytmp3':
                await client.sendText(from, ind.wait() + "\nMusik sedang diproses...")
                const musicLink = await _function.youtube.youtubeMusic(arguments.join(' '));
                if (!musicLink) return await client.sendText(from, '_⚠️ Pastikan music yang anda inginkan dibawah 10 menit!_');
                try {
                    if (musicLink.result.error == true) return await client.sendText(from, `⚠️ Error ! \n\nMessage error : \n${musicLink.result.message}`)
                    const mp3url = musicLink.result.file;
                    const judul = musicLink.result.title;
                    const thumb = musicLink.thumbnail;
                    const durasi = musicLink.duration;

                    var menit = Math.floor(durasi / 60);
                    var detik = durasi - menit * 60;

                    const caption = `-------[ *Detail musik* ]-------\n\nJudul : ${judul}\nDurasi : ${menit} menit ${detik} detik`
                    await client.sendImage(from, thumb, "thumb.jpg", caption)
                    await client.sendFileFromUrl(from, mp3url, "mp3yt.mp3", judul, null, null, null, true);
                } catch (error) {
                    await client.sendText(from, "Sepertinya musik tidak bisa di upload, mon maap 🙏\n\nSilahkan cari musik lainnya");
                    //console.log("music download error " + musicLink);
                    console.log(error.stack);
                }
            break

            case 'ytmp4':
                await client.sendText(from, ind.wait()+ "\nVideo sedang diproses...")
                const videoLink = await _function.youtube.youtubeVideo(arguments.join(' '));
                if (!videoLink) return await client.sendText(from, '_⚠️ Pastikan video yang anda inginkan dibawah 10 menit!_');
                try {
                    if (videoLink.result.error == true)return await client.sendText(from, `⚠️ Error ! \n\nMessage error : \n${videoLink.result.message}`);
                      
                    const mp4url = videoLink.result.file;
                    const judul = videoLink.result.title;
                    const thumb = videoLink.thumbnail;
                    const durasi = videoLink.duration;
          
                    var menit = Math.floor(durasi / 60);
                    var detik = durasi - menit * 60;
          
                    const caption = `-------[ *Detail Video* ]-------\n\nJudul : ${judul}\nDurasi : ${menit} menit ${detik} detik`
          
                    await client.sendImage(from, thumb, "thumb.jpg", caption)
                    await client.sendFileFromUrl(from, mp4url, "vid.mp4", judul);
                } catch (error) {
                    await client.sendText(from, "Sepertinya musik tidak bisa di upload, mon maap 🙏\n\nSilahkan cari video lainnya");
                    //console.log("music download error " + musicLink);
                    console.log(error.stack);
                  }
        }
    }
    
    //const sourceButtons = quotedMsgObj.buttons
    //console.log("Source buttons : ")
    //console.log(sourceButtons)
    //return
    
}
