const { decryptMedia } = require('@open-wa/wa-automate');
const moment = require('moment');
const set = require('../settings');
const fs = require('fs-extra')
const axios = require("axios").default;
const Nekos = require('nekos.life');
const neko = new Nekos();
const sagiri = require('sagiri');
const config = require('../config.json')
const parseMilliseconds = require('parse-ms')
const toMs = require('ms')
const { spawn } = require('child_process')
var http = require('http');
const path = require('path')
const momentt = require('moment-timezone')
momentt.tz.setDefault('Asia/Jakarta').locale('id')
const tanggal = momentt.tz('Asia/Jakarta').format('DD-MM-YYYY')
const uaOverride = config.uaOverride
const saus = sagiri(config.nao, { results: 5 });
const { distance, closestMatch } = require("closest-match");
const ffmpeg = require('fluent-ffmpeg');
const MP3Cutter = require('mp3-cutter');

const errorImg = 'https://i.ibb.co/jRCpLfn/user.png'

// Library
const _function = require('../lib/function');
const _txt = require('../lib/text');
const color = require('../util/colors');
const { uploadImages, saveFile } = require('../util/fetcher');
const { prefix } = require('../settings');
const tugas = JSON.parse(fs.readFileSync('./database/tugas.json'));
const _reminder = JSON.parse(fs.readFileSync('./database/reminder.json'))
const _ban = JSON.parse(fs.readFileSync('./database/banned.json'))
const judullist = [];
const daftarlist = [];

var disablecommand = true;

var ytwait = false;

const handler = require ('../handler')

const isUrl = (url) => {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi))
}

function arrayRemove(arr, value) { 
    
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

function ngelistisi(){
  let list = '';
  list += `${judullist[0]}\n`;
  daftarlist.forEach(function (item, index){
    index = index+1;
    list += `${index}. ${item}\n`
    //client.sendText(from, (index+1) + ". " + item);
  });
  return list;
}

function ngelisttugas(){
  let list = '';
  list += "Daftar tugas : \n"
  tugas.forEach(function (item, index){
    index = index+1;
    list += `${index}. ${item}\n`
    //client.sendText(from, (index+1) + ". " + item);
  });
  return list;
}

module.exports = async (client, message) => {
  const { id, body, mimetype, type, t, from, sender, content, caption, author, isGroupMsg, isMedia, chat, quotedMsg, quotedMsgObj, mentionedJidList } = message;
  try {
    const msgAmount = await client.getAmountOfLoadedMessages();
    if (msgAmount > 1000) await client.cutMsgCache();

    const { id, body, mimetype, type, t, from, sender, content, caption, author, isGroupMsg, isMedia, chat, quotedMsg, quotedMsgObj, mentionedJidList } = message;
    const { name, shortName, pushname, formattedName } = sender;
    const { formattedTitle, isGroup, contact, groupMetadata } = chat;

    const { ind } = require('../message/text/lang/')

    const botOwner = set.owner;
    const botGroup = set.support;
    const botPrefix = set.prefix;
    const botNumber = (await client.getHostNumber()) + '@c.us';

    const isAdmin = groupMetadata ? groupMetadata.participants.find((res) => res.id === sender.id).isAdmin : undefined;
    const isOwner = groupMetadata ? groupMetadata.participants.find((res) => res.id === sender.id).isSuperAdmin : undefined;
    const isBotAdmin = groupMetadata ? groupMetadata.participants.find((res) => res.id === botNumber).isAdmin : undefined;

    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''

    const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
    const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
    const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
    const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
    const isQuotedAudio = quotedMsg && quotedMsg.type === 'audio'
    const isQuotedVoice = quotedMsg && quotedMsg.type === 'ptt'
    const isQuotedDocument = quotedMsg && quotedMsg.type === 'document'
    const isImage = type === 'image'
    const isVideo = type === 'video'
    const isAudio = type === 'audio'
    const isVoice = type === 'ptt'
    const isDocument = type === 'document'

    const isBanned = _ban.includes(sender.id)
    const isGroupAdmins = groupAdmins.includes(sender.id) || false

    global.voterslistfile = '/poll_voters_Config_' + chat.id + '.json'
    global.pollfile = '/poll_Config_' + chat.id + '.json'

    const blockNumber = await client.getBlockedIds()

    const validMessage = caption ? caption : body;
    if (!validMessage || validMessage[0] != botPrefix) return;

    const command = validMessage.trim().split(' ')[0].slice(1);
    const arguments = validMessage.trim().split(' ').slice(1);
    const arg = validMessage.substring(validMessage.indexOf(' ') + 1)
    const q = arguments.join(' ')
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    const url = arguments.length !== 0 ? arguments[0] : ''

    const santet = [
      'Muntah Paku',
      'Meninggoy',
      'Berak Paku',
      'Muntah Rambut',
      'Ketempelan MONYET!!!',
      'Menjadi Gila',
      'Menjadi manusiawi',
      'jomblo selamanya',
      'ga bisa berak',
      'ketiban pesawat',
      'jadi anak mulung',
      'ga jadi pacar zeus',
      'jadi jelek',
      'noob vr',
      'jadi botfrag terus',
      'di haloin bu anif ampe meninggoy'
      ]

    // debug
    console.debug(color('green', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `${botPrefix}${command} | ${sender.id} ${isGroup ? 'FROM ' + formattedTitle : ''}`, color('yellow', moment().format()));

    const allChats = await client.getAllChats();
    switch (command) {
      case 'commandswitch':
        if (sender.id !== botOwner) return await client.reply(from, ind.ownerOnly(), id)
        if (disablecommand){
          disablecommand = false
        } else {
          disablecommand = true
        }
        await client.sendText(from, `_Blocked command telah di switch!_\nDisabled command status : *${disablecommand}*`)
        break

      case 'aichat':
        _function.aichat(client, message)
        break

      case 'speed':
      case 'ping':
            await client.sendText(from, `Pong!!!!\nSpeed: ${_function.processTime(t, moment())} _Second_`)
            break

      case 'unsend':
        if (sender.id !== botOwner) return await client.reply(from, ind.ownerOnly(), id)
        await client.deleteMessage(from, quotedMsg.id)
        break;

      case 'getses':
          if (sender.id !== botOwner) return await client.reply(from, ind.ownerOnly(), id)
          const ses = await client.getSnapshot()
          await client.sendFile(from, ses, 'session.png', ind.doneOwner())
      break

      case 'unblock':
        if (sender.id !== botOwner) return await client.reply(from, ind.ownerOnly(), id);
        await client.contactUnblock(arguments[0] + 'c.us');
        return await client.reply(from, '_🟢 Berhasil *Unblock* user!_', id);
        break;

      case 'leaveall':
        if (sender.id !== botOwner) return await client.reply(from, ind.ownerOnly(), id);
        const allGroups = await client.getAllGroups();
        allGroups.forEach(async (group) => {
          if (!group.id !== botGroup) {
            await client.leaveGroup(group.id);
          }
        });
        return await client.reply(from, '_🟢 Bot Berhasil keluar dari semua grup yang ada!_', id);
        break;

      case 'owner':
      case 'contact':
      case 'ownerbot':
        return await client.reply(from, '_👋 Hai, kalo mau req fitur bisa pc ke *https://wa.me/6288225610884*_', id);
        break;

      case 'clearall':
        if (sender.id !== botOwner) return await client.reply(from, ind.ownerOnly(), id);
        allChats.forEach(async (chat) => {
          await client.clearChat(chat.id);
        });
        return await client.reply(from, '_🟢 Berhasil Membersihkan History Message Bot!_', id);
        break;


      case 'bc':
        if (sender.id !== botOwner) return await client.reply(from, ind.ownerOnly(), id);
        if (arguments.length < 1) return;
        await allChats.forEach(async (chat) => {
          await client.sendText(chat.id, arguments.join(' '));
        });
        return await client.reply(from, '_🟢 Berhasil Broadcast kesemua Chat List Bot!_', id);
        break;

      case 'ban':
        if (arguments.length !== 1) client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}ban add @mention/nomor_`, id);
          if (sender.id !== botOwner) return await client.reply(from, ind.ownerOnly(), id)
          if (arguments[0] === 'add') {
              if (mentionedJidList.length !== 0) {
                  for (let benet of mentionedJidList) {
                      if (benet === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                      client.contactBlock(benet)
                      _ban.push(benet)
                      fs.writeFileSync('./database/banned.json', JSON.stringify(_ban))
                  }
                  await client.reply(from, 'Mampus lu gw ban', id)
                  await client.reply(from, ind.doneOwner(), id)
              } else {
                  _ban.push(arguments[1] + '@c.us')
                  client.contactBlock(arguments[1] + '@c.us')
                  fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                  await client.reply(from, 'Mampus lu gw ban', id)
                  await client.reply(from, ind.doneOwner(), id)
              }
          } else if (arguments[0] === 'del') {
              if (mentionedJidList.length !== 0) {
                  if (mentionedJidList[0] === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                  client.contactUnblock(mentionedJidList[0])
                  _ban.splice(mentionedJidList[0], 1)
                  fs.writeFileSync('./database/banned.json', JSON.stringify(_ban))
                  await client.reply(from, 'Gw maapin dah, udh di unban lu', id)
                  await client.reply(from, ind.doneOwner(), id)
              } else{
                  client.contactUnblock(arguments[1] + '@c.us')
                  _ban.splice(arguments[1] + '@c.us', 1)
                  fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                  await client.reply(from, 'Gw maapin dah, udh di unban lu', id)
                  await client.reply(from, ind.doneOwner(), id)
              }
          } else {
              await client.reply(from, ind.wrongFormat(), id)
          }
        break

      case 'listban':
      case 'listblock':
        if (sender.id !== botOwner) return await client.reply(from, ind.ownerOnly(), id)
          let block = ind.listBlock(blockNumber)
          if (blockNumber.length === 0) {
            block += '\nYey gaada yang di blok'
            await client.sendText(from, block)
          } else {
            for (let i of blockNumber) {
              block += `@${i.replace('@c.us', '')}\n`
            } 
            await client.sendTextWithMentions(from, block)
          }
          
      break

      case 'kickall':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-pakai didalam grup!_', id);
        if (!isOwner) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Owner* grup saja!_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Bot *Wajib* dijadikan *Admin* untuk menggunakan perintah ini!_', id);
        await client.reply(from, '_😏 Perintah dilaksanakan! Berharap kamu tau apa yang kamu lakukan!_', id);
        await groupMetadata.participants.forEach(async (participant) => {
          if (!participant.isSuperAdmin) await client.removeParticipant(from, participant.id);
        });
        break;

      case 'add':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id);
        if (arguments.length !== 1) client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}add 62812....._`, id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id);
        const isNumberValid = await client.checkNumberStatus(arguments[0] + '@c.us');
        if (isNumberValid.status === 200)
          await client
            .addParticipant(from, `${arguments[0]}@c.us`)
            .then(async () => await client.reply(from, '_🎉 Berhasil menambahkan Member, Berikan ucapan Selamat datang!_', id))
            .catch(async (error) => await client.reply(from, '_🥺 Gagal menambahkan member! kemungkinan member sudah diblock oleh Bot! untuk unblockir silahkan DM ke *https://wa.me/6288225610884*_', id));
        break;

      case 'kick':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id);
        if (mentionedJidList.length !== 1) return await client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}kick @mention_`, id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id);
        const isKicked = await client.removeParticipant(from, mentionedJidList[0]);
        if (isKicked) return await client.reply(from, '_🎉 Berhasil Kick member Berikan Ucapan Selamat Tinggal!_', id);
        break;

      case 'promote':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id);
        if (mentionedJidList.length !== 1) client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}promote @mention_`, id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id);
        const isPromoted = await client.promoteParticipant(from, mentionedJidList[0]);
        if (isPromoted) return await client.reply(from, '_🎉 Berhasil promote member menjadi Admin/Pengurus Grup! Berikan Ucapan Selamat_', id);
        break;

      case 'demote':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id);
        if (mentionedJidList.length !== 1) client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}demote @mention_`, id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id);
        const isDemoted = await client.demoteParticipant(from, mentionedJidList[0]);
        if (isDemoted) return await client.reply(from, '_🎉 Berhasil demote Admin menjadi Member! Ucapkan Kasihan!_', id);
        break;

      case 'revoke':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id);
        await client
          .revokeGroupInviteLink(from)
          .then(async (res) => await client.reply(from, '_🎉 Berhasil Me-reset ulang Invite Link Grup! gunakan !link untuk mendapatkan Link invite Group_', id))
          .catch((error) => console.log('revoke link error!'));
        break;

      case 'link':
      case 'invitelink':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id);
        await client
          .getGroupInviteLink(from)
          .then(async (inviteLink) => await client.reply(from, `_🔗 Group Invite Link : *${inviteLink}*_`, id))
          .catch((error) => console.log('Invite link error'));
        break;

      case 'disconnect':
      case 'kickbot':
      case 'leave':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id);
        client.reply (from, 'Gamao, gw gamao leave', id);
          /*
          .reply(from, '_👋 Terimakasih, atas kenangan selama ini yang kita lalui, kalau kamu rindu gpp masukin aku lagi ke grup kamu! aku akan selalu ada buat kamu!_', id)
          .then(async () => await client.leaveGroup(from))
          .catch((error) => console.log('kickbot error'));
          */
        break;

      case 'adminmode':
      case 'silent':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (!isAdmin) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan oleh *Admin* grup saja!_', id);
        if (arguments.length !== 1) return await client.reply(from, `_⚠️ Contoh penggunaan Perintah : ${botPrefix}silent on|off_`, id);
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id);
        const isSilent = await client.setGroupToAdminsOnly(from, arguments[0].toLowerCase() === 'on');
        if (isSilent) return await client.reply(from, `_🎉 Berhasil set grup ke-*${arguments[0].toLowerCase() === 'on' ? 'Admin Mode' : 'Everyone Mode'}*_`, id);
        break;

      case 'p':
      case 'spam':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        const allMembers = groupMetadata.participants.map((member) => `@${member.id.split('@')[0]}`);
        if ( groupMetadata.desc && groupMetadata.desc.includes("#noping") ) 
        { await client.sendText(from, '_*⚠️ Gaboleh spam disini yak*_') } 
        else {
          await client.sendTextWithMentions(from, `_*Summon*_\n\n${allMembers.join('\n')}\n`); }
        break;

      case 'vote':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        let helpvote = `Command untuk mengadakan voting pada grup
=====================
*${botPrefix}pollresult* = Menampilkan hasil voting
*${botPrefix}addvote* <nomor> = Memvoting kandidat sesuai nomor
*${botPrefix}addv* <kandidat> = Menambah kandidat yang ingin di voting
*${botPrefix}addpoll* <judul voting> = Membuat sesi voting dengan judul, jika sebelumnya sudah ada sesi, akan otomatis tertimpa
`
          client.reply(from, helpvote, id)
        break;

      case 'jodohku':
      case 'matchme':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        let countMember = groupMetadata.participants.length;
        let randomNumber = Math.floor(Math.random() * (countMember - 1) + 1);
        const randomMembers = groupMetadata.participants[randomNumber];
        const isSenderNumber = randomMembers.id === sender.id;
        await client.sendTextWithMentions(from, isSenderNumber ? `_👬🏼 Yha! jodoh kamu gak ada ditemukan di grup ini, nge-gay aja ya_` : `_❤️ Jodoh @${sender.id.split('@')[0]} kamu digrup ini adalah @${randomMembers.id.split('@')[0]}_`);
        break;

      case 'groupstats':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        let { owner, creation, participants, desc } = groupMetadata;
        const creationTime = moment.unix(creation);
        await client.sendTextWithMentions(from, `_📃 Informasi Grup_\n\n_Nama : ${formattedTitle}_\n_Owner : @${owner.split('@')[0]}_\n_Total Member : ${participants.length}_\n_Tanggal Dibuat : ${creationTime.format('DD MMMM YYYY')}_\n_Jam Dibuat : ${creationTime.format('HH:mm:ss')}_\n_Deskripsi : ${desc ? desc : ''}_`, id);
        break;

      case 'kickme':
        if (!isBotAdmin) return await client.reply(from, '_⚠️ Perintah ini hanya dapat digunakan ketika *Bot berstatus Admin* di grup ini!_', id);
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (isOwner) return await client.reply(from, '_⛔ Owner grup/Orang ganteng tidak dapat dikick!_', id);
        await client.reply(from, '_😏 Aku harap kamu tau apa yang kamu lakukan!_', id);
        await client.removeParticipant(from, sender.id);
        break;

      case 'mystats':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        const senderPicture = sender.profilePicThumbObj.eurl ? sender.profilePicThumbObj.eurl : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        await client.sendImage(from, senderPicture, formattedName, `_🎉 Group Member [ *${formattedTitle}* ]_\n\n_Nama : ${pushname ? pushname : 'Tidak Diketahui'}_\n_Owner Status : ${isOwner ? 'Ya' : 'Tidak'}_\n_Admin Status : ${isAdmin ? 'Ya' : 'Tidak'}_`, id);
        break;

        case 'profile':
        case 'me':
              if (quotedMsg) {
                  const getQuoted = quotedMsgObj.sender.id
                  const profilePic = await client.getProfilePicFromServer(getQuoted)
                  const username = quotedMsgObj.sender.name
                  const statuses = await client.getStatus(getQuoted)
                  const benet = _ban.includes(getQuoted) ? 'Yes' : 'No'
                  const adm = groupAdmins.includes(getQuoted) ? 'Yes' : 'No'
                  const { status } = statuses
                  if (profilePic === undefined) {
                      var pfp = errorImg
                  } else {
                      pfp = profilePic
                  }
                  await client.sendFileFromUrl(from, pfp, `${username}.jpg`, ind.profile(username, status, benet, adm), id)
              } else {
                  const profilePic = await client.getProfilePicFromServer(sender.id)
                  const username = pushname
                  const statuses = await client.getStatus(sender.id)
                  const benet = isBanned ? 'Yes' : 'No'
                  const adm = isGroupAdmins ? 'Yes' : 'No'
                  const { status } = statuses
                  if (profilePic === undefined) {
                      var pfps = errorImg
                  } else {
                      pfps = profilePic
                  }
                  await client.sendFileFromUrl(from, pfps, `${username}.jpg`, ind.profile(username, status, benet, adm), id)
              }
          break

      case 'pick':
        if (!isGroup) return await client.reply(from, '_⛔ Perintah ini hanya dapat di-gunakan didalam grup!_', id);
        if (arguments.length < 1) return await client.reply(from, `_Contoh penggunaan perintah : ${botPrefix}pick <sifat>_`, id);
        const pickSomeone = groupMetadata.participants[Math.floor(Math.random() * groupMetadata.participants.length)];
        await client.sendTextWithMentions(from, `_👦🏼 ${arguments.join(' ')} di grup ini adalah @${pickSomeone.id.split('@')[0]}_`);
        break;

      case 'kerang':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}kerang <kalimat>_`, id);
        let resp = ['Ya', 'Tidak']
        const kerangresp = Math.floor(Math.random() * resp.length)
        await client.reply(from, `🐚 ${resp[kerangresp]} 🐚`, id)
        break;

      case 'voice':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}voice <kode> <kalimat>_`, id);
        const voiceUrl = _function.voiceUrl(arguments);
        await client.sendPtt(from, voiceUrl, id);
        break;

      case 'artdots':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}artdots <pilihan>_`, id);
        input = arguments.join(' ');
        if (input == "help") return await client.reply(from, `Pilihan art dots:\n among\n sus\n yntkts\n kanna\n paimon\n nopal\n nazi\n soviet`, id);
        if (input == "among") return await client.reply(from, `
⠀⠀⠀⠀⠀   ⣠⣴⣶⣿⠿⢿⣶⣶⣦⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣼⡿⠋⠁⠀⠀⠀⢀⣈⠙⢿⣷⡄⠀⠀
⠀⠀⠀⠀⢸⣿⠁⠀⢀⣴⣿⠿⠿⠿⠿⠿⢿⣷⣄⠀
⠀⢀⣀⣠⣾⣿⡇⠀⣾⣿⡄⠀⠀⠀⠀⠀⠀⠀⠹⣧
⣾⡿⠉⠉⣿⠀⡇⠀⠸⣿⡌⠓⠶⠤⣤⡤⠶⢚⣻⡟
⣿⣧⠖⠒⣿⡄⡇⠀⠀⠙⢿⣷⣶⣶⣶⣶⣶⢿⣿⠀
⣿⡇⠀⠀⣿⡇⢰⠀⠀⠀⠀⠈⠉⠉⠉⠁⠀ ⠀⣿⠀
⣿⡇⠀⠀⣿⡇⠈⡄⠀⠀⠀⠀⠀⠀⠀⠀ ⢀⣿⣿⠀
⣿⣷⠀⠀⣿⡇⠀⠘⠦⣄⣀⣀⣀⣀⣀⡤⠊⠀⣿⠀
⢿⣿⣤⣀⣿⡇⠀⠀⠀⢀⣀⣉⡉⠁⣀⡀⠀⣾⡟⠀
⠀⠉⠛⠛⣿⡇⠀⠀⠀⠀⣿⡟⣿⡟⠋⠀⢰⣿⠃⠀
⠀⠀⠀⠀⣿⣧⠀⠀⠀⢀⣿⠃⣿⣇⠀⢀⣸⡯⠀⠀
⠀⠀⠀⠀⠹⢿⣶⣶⣶⠿⠃⠀⠈⠛⠛⠛⠛'`, id);
        else if (input == "sus") return await client.reply(from, `
⠀⠀⠀SUSSUSSUSSUSSUS
⠀⠀⠀SUS⠀⠀⠀⠀⠀⠀⠀⠀⠀SUS
⠀⠀⠀SUS⠀⠀⠀SUSSUSSUSSUS
SUSSUS⠀⠀⠀SUS⠀⠀⠀⠀⠀⠀SUS
S⠀⠀SUS⠀⠀⠀SUS⠀⠀⠀⠀⠀⠀SUS
S⠀⠀SUS⠀⠀⠀SUSSUSSUSSUS
S⠀⠀SUS⠀⠀⠀⠀⠀⠀⠀⠀⠀SUS
S⠀⠀SUS⠀⠀⠀⠀⠀⠀⠀⠀⠀SUS
S⠀⠀SUS⠀⠀⠀⠀⠀⠀⠀⠀⠀SUS
SUSSUS⠀⠀⠀SUS⠀⠀⠀SUS
⠀⠀⠀⠀⠀S⠀⠀⠀SUS⠀⠀⠀SUS
⠀⠀⠀⠀⠀S⠀⠀⠀SUS⠀⠀⠀SUS
⠀⠀⠀⠀⠀SSUSSUSSUSSUS`, id);
        else if (input == "yntkts") return await client.reply(from, `
⢀⣤⣤⣤⣴⣶⣦⣤⣀⠀⠀⠀⠀⠀⠀⣠⣴⣶⣶⣶⣤⣤⣶⣦⠀
⣿⣿⡟⠛⠛⠛⠻⢿⣿⣷⠀⠀⠀⢠⣾⣿⣿⡟⠋⠉⠉⠛⠿⣿⡇
⠙⠛⣥⣶⣾⣿⣿⣷⣿⡿⠀⠀⠀⢸⣿⣿⠿⠿⢿⣿⣿⣷⣶⣌⠁
⠀⠘⠟⠋⠀⠙⠛⠀⠀⠀⠀⠀⠀⠘⣿⣿⡇⠀⠀⠉⠉⠀⠀⠉⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣧⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣴⣶⣶⣾⣿⣷⣦⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠙⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣄⣀⣀⣠⣄⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠛⠉⠉⠉⠁⠀⠀⠉⣹⣿⡟⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠻⠿⠿⠟⠋⠀⠀⠀⠀`, id);
        else if (input == "kanna") return await client.reply(from, `
⠀⡎⠱⠀⠀⠀⠀⠀⢀⡀⠤⠤⠤⠤⠄⣀⠀⠀⠀⠀⠀⠀⡔⢒⠀
⠀⡇⠀⡇⠀⠀⡠⠈⣡⣼⣿⡷⠶⣿⣿⣦⣈⠢⡀⠀⠀⢰⠀⢸⠀
⢠⠁⠀⢁⢀⡔⣡⢞⠅⠈⠱⠀⠀⠀⠍⠈⠙⢳⡈⢢⠀⠸⠀⠘⠀
⠀⠀⠀⠀⠪⡴⠁⠆⠀⡀⡄⠀⠀⠀⢰⠀⠀⠀⠹⡦⠗⠁⠀⠀⡆
⢀⠀⠀⠀⡜⢠⠻⠀⢰⢧⣇⠀⠀⠠⠼⡇⠀⠸⠸⢹⡀⠀⠀⠀⡇
⠈⠢⣌⡣⠃⡌⡄⠀⣿⢸⣷⠀⠀⢸⠀⢿⢠⠀⠀⡇⣇⠀⢀⠤⠀
⠀⢰⠁⠈⠀⡇⣇⣰⣧⣾⣿⢃⠀⢸⣴⣸⣼⡆⡇⡇⡏⠉⢱⠀⠀
⠀⢸⠀⠘⠀⡇⡏⢩⣿⣿⡍⠈⠁⠈⣭⣿⣿⡵⣧⠀⡇⠀⠸⠀⠀
⠀⠊⠀⠀⡇⠘⡆⠨⣓⡻⠃⠀⠀⠀⠫⣛⡿⠃⠟⢠⠃⠀⠑⢤⠀
⠈⠀⡙⠁⣿⡀⢁⠰⠶⠀⠀⠀⠀⠀⠀⠴⠄⠰⠀⣾⡑⢲⠀⠉⠀
⠀⠀⢣⣶⣿⣧⠈⣆⠀⠀⠀⢀⡀⠀⠀⠀⣠⠢⣸⣿⣷⣷⠀⠀⠀
⠀⠀⠈⠛⣿⣿⣴⢹⣷⣶⣤⣄⣀⣀⣤⣾⡏⣄⣿⣿⣿⠃⠀⠀⠀
⠀⠀⠀⢸⣿⣿⣿⢸⠟⡄⠙⠛⠿⠛⠛⢹⣇⣿⣿⣿⣿⠀⠀⠀⠀
⠀⠀⢀⣼⣿⣿⠟⢸⠀⠈⠂⣤⠄⣤⠐⠹⣿⠃⠹⣿⣿⣤⡀⠀⠀
⠀⠀⣾⣿⣿⣿⠀⠉⠀⠀⢀⣧⠫⣸⠀⠀⠉⠀⠀⣸⣿⣾⡇⠀⠀
⠀⠀⠙⠿⠿⠿⠟⠶⠦⠤⠼⠀⠶⢲⣤⣤⣤⡐⠿⠿⢿⡿⠃⠀⠀`, id);
        else if (input == "paimon") return await client.reply(from, `
⠿⠛⠁⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⡄⠀⠀⠀⠀⠈
⠀⠀⠀⠀⣠⡿⠉⡏⠀⠀⠀⠀⠀⠀⢀⡼⠉⠉⠙⠛⣆⠀⠀⠀⠀
⢰⠀⠀⣰⠏⠀⢰⠃⠀⠀⠀⣀⠀⣠⠞⠀⠀⠀⠀⠀⠘⣦⢀⡀⡆
⡆⠀⡴⠋⠀⠀⠘⠀⠀⢀⡼⣣⠞⠁⠀⠀⠀⠀⠀⠀⠀⠘⣾⣿⡇
⣇⡼⣁⠀⣀⡠⠃⢀⣴⠿⠋⠁⠀⢀⣀⡤⠤⠒⠂⠀⠀⠀⠹⣽⠁
⠻⣄⣀⣭⣭⣶⡊⠉⠀⠀⠀⠀⠉⣯⣥⣤⣤⣤⣄⣀⠀⠀⠀⢻⠀
⠸⣿⣿⣿⢻⣿⡇⠀⠀⠀⠀⠀⠀⢹⣿⣿⣉⣿⣿⡿⣿⣶⡤⢸⠀
⠀⠉⠙⠋⠛⠛⠀⠀⠀⠀⠀⠀⠀⠈⠋⠉⠙⠛⠿⠁⠈⠁⠀⢸⡄
⠀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⢣⠀⠀⠀⠀⠀⠀⢠⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡇
⠀⠀⠱⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠚⠉⢹⣳
⠀⠀⠀⠀⠉⣱⠲⢤⣀⣀⡀⢀⣀⣀⣀⣤⣤⣶⣾⣯⣀⠀⣶⡿⠋`, id);
        else if (input == "nopal") return await client.reply(from, `
⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⣤⣴⠦⢀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣷⣷⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⢿⣿⣟⣿⣷⣄⠀⠀⠀⠀
⠀⠀⠀⠀⣿⣿⣿⣿⠿⠛⠉⠁⠀⠀⠀⠀⠙⢿⣿⣿⣿⠀⠀⠀⠀
⠀⠀⠀⢰⠟⠿⡋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣻⣿⣿⠀⠀⠀⠀
⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣼⣿⣿⠀⠀⠀⠀
⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠈⣿⣿⠀⠀⠀⠀
⠀⠀⠀⢀⣰⣿⣿⣷⣶⣶⣾⣿⣿⣟⣒⡠⣤⠀⠀⠬⠃⠁⠀⠀⠀
⠀⠀⠸⠁⠸⢿⣿⡿⣿⠛⣿⠛⠻⠿⠉⠁⡇⠀⠀⠀⠐⠆⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⣤⠃⠀⠈⠢⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣧⣤⣀⡤⠤⠚⢷⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢿⣿⣧⣬⣭⣥⣤⠤⠾⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠻⣏⢿⣦⣥⡤⠀⠀⠀⢿⣠⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⣄⣀⣀⣀⣀⣀⣴⣿⠟⠀⠀⠀⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠉⠆⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠿⣿⠛⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`, id);
        else if (input == "nazi") return await client.reply(from, `
⢰⡦⣶⡶⣶⢶⡦⣶⢴⣶⠀⠀⠀⠀⠀⣶⡶⣶⢶⡦⣶⢴⡦⢶⡆
⢸⡗⢿⠶⡿⢾⡗⠿⠂⠀⠀⠀⣀⠀⠀⠀⠰⠿⢾⡷⣿⠺⡷⢾⠆
⢸⡟⣿⣛⣿⠻⠇⠀⠀⠀⣠⣘⣿⣣⣄⠀⠀⠀⠻⠟⣿⢻⣟⣻⡇
⢸⣏⣿⡋⠛⠀⠀⠀⢠⣤⣽⣯⣿⡙⠋⠀⠀⠀⠀⠈⠛⢹⣟⣹⡇
⢸⣧⠉⠁⠀⠀⢠⣶⣼⣯⣽⡏⠉⠀⠀⠀⢠⣶⠀⠀⠀⠈⠉⣽⡅
⠈⠁⠀⠀⠀⢾⡷⣿⢾⣷⠈⠁⠀⠀⠀⣿⡶⣿⢾⡧⠀⠀⠀⠈⠀
⠀⠀⣀⠀⠀⠀⠐⠿⢺⡿⢿⡗⣀⢺⡗⣿⠿⠿⢿⡟⣿⢂⡀⠀⠀
⣠⣄⣿⣃⣄⠀⠀⠀⠘⠟⣻⣟⣿⣻⣟⠻⠃⠀⠻⢟⣿⣻⣟⣠⡀
⠙⠋⣿⣯⣿⣵⣄⠀⢠⣦⣽⣯⣿⣽⣏⣴⡄⠀⠀⠈⠛⢹⣿⠙⠃
⠀⠀⠉⢹⣿⣼⣧⣶⣼⣯⣿⡧⠉⣼⣧⣿⣵⣶⠄⠀⠀⠈⠉⠀⠀
⠀⠀⠀⠀⠀⢾⡷⣿⢾⣷⠀⠀⠀⢀⡀⣿⡶⣷⢾⡷⠀⠀⠀⠀⠀
⢸⡗⣀⠀⠀⠀⠘⠿⠂⠀⠀⢀⣀⢻⡗⣿⡿⠿⠂⠀⠀⢀⡀⢻⠇
⢸⣋⣻⣃⣄⠀⠀⠀⠀⠀⣠⣘⣿⣻⣟⠛⠃⠀⠀⠀⣄⣘⣟⣻⡃
⢸⣏⣽⣭⣿⣤⣄⠀⠀⠀⠙⢫⣿⡙⠋⠀⠀⠀⣤⣄⣿⣹⣏⣽⡇
⢸⡧⣿⣵⣯⣼⡧⣶⠄⠀⠀⠀⠉⠀⠀⠀⢰⣦⣼⡧⣿⢼⣯⣾⡅
⠰⠶⠾⠶⠷⠾⠶⠶⠶⠷⠀⠀⠀⠀⠀⠾⠶⠷⠾⠶⠷⠶⠷⠾⠆`, id);
        else if (input == "soviet") return await client.reply(from, `
⠀⠀⠀⠀⠀⠀⢀⣤⣀⣀⣀⠀⠻⣷⣄
⠀⠀⠀⠀⢀⣴⣿⣿⣿⡿⠋⠀⠀⠀⠹⣿⣦⡀
⠀⠀⢀⣴⣿⣿⣿⣿⣏⠀⠀⠀⠀⠀⠀⢹⣿⣧
⠀⠀⠙⢿⣿⡿⠋⠻⣿⣿⣦⡀⠀⠀⠀⢸⣿⣿⡆
⠀⠀⠀⠀⠉⠀⠀⠀⠈⠻⣿⣿⣦⡀⠀⢸⣿⣿⡇
⠀⠀⠀⠀⢀⣀⣄⡀⠀⠀⠈⠻⣿⣿⣶⣿⣿⣿⠁
⠀⠀⠀⣠⣿⣿⢿⣿⣶⣶⣶⣶⣾⣿⣿⣿⣿⡁
⢠⣶⣿⣿⠋⠀⠀⠉⠛⠿⠿⠿⠿⠿⠛⠻⣿⣿⣦⡀
⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⡿`, id);
        else return await client.reply(from, `Format salah!\nList pilihan: ${botPrefix}artdots help`, id);
        break;

      case 'menu':
      case 'help':
        if (arguments.length == 1 ) {
          if (arguments[0].toLowerCase() === 'button'){
            const ngetesmenu = await client.sendButtons(from, _txt.menu[0], [
              {
              id: `menu 0`,
              text: `Next ⏭️`
              }
            ], `Help button`)
            console.log(ngetesmenu)
          }
        } else {
            let menutxt = ``
            _txt.menu.forEach(function (item, index) {
              menutxt += item;
            });
            await client.sendText(from, menutxt);
        }
        //return await client.reply(from, _txt.menu, id);
        break;

      case 'info':
        return await client.reply(from, _txt.info, id);

      case 'source':
        return await client.reply(from, _txt.source, id);

      case 'rules':
        return await client.reply(from, _txt.rules, id);
        break;

      case 'faq':
        return await client.reply(from, _txt.faq, id);
        break;

      case 'support':
        await client.addParticipant(botGroup, sender.id);
        return await client.reply(from, 'Kamu sudah ditambahkan kedalam Grup Official Bot Ini!');
        break;

      case 'donate':
      case 'donasi':
        return await client.reply(from, _txt.donate, id);
        break;

      case 'quran':
      case 'quranayat':
        try {
          if (arguments.length != 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}quranayat <surah> <ayat>_`, id);
          const ayah = await _function.quran.ayat(arguments);
          await client.reply(from, ayah, id);
        } catch (error) {
          await client.reply(from, `Ayat Surat Al-Quran tidak ditemukan!`);
        }
        break;

      case 'quransurah':
        try {
          if (arguments.length != 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}quransurah <surah>_`);
          const surah = await _function.quran.surah(arguments);
          await client.reply(from, surah, id);
        } catch (error) {
          await client.reply(from, `Ayat Surat Al-Quran tidak ditemukan!`);
        }
        break;

      case 'murotal':
      case 'murrotal':
      case 'murottal':
        try {
        if (arguments.length != 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}murrotal <ayat> <surat>_`, id);
        const murottalAudio = await _function.quran.murottal(arguments);
        await client.sendPtt(from, murottalAudio, id);
        } catch (error) {
          await client.reply(from, `Ayat Surat Al-Quran tidak ditemukan!`);
        }
        break;

      case 'tafsir':
        if (arguments.length != 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}tafsir <ayat> <surat>_`, id);
        const tafsir = await _function.quran.tafsir(arguments);
        await client.reply(from, tafsir, id);
        break;

        case 'jadwalsholat':
          case 'jadwalsolat':
              if (!q) return await client.reply(from, ind.wrongFormat(), id)
              await client.reply(from, ind.wait(), id)
              _function.misc.jadwalSholat(q)
                  .then((data) => {
                      data.map(async ({isya, subuh, dzuhur, ashar, maghrib, terbit}) => {
                          const x = subuh.split(':')
                          const y = terbit.split(':')
                          const xy = x[0] - y[0]
                          const yx = x[1] - y[1]
                          const perbandingan = `${xy < 0 ? Math.abs(xy) : xy} jam ${yx < 0 ? Math.abs(yx) : yx} menit`
                          const msg = `Jadwal sholat untuk ${q} dan sekitarnya ( *${tanggal}* )\n\nDzuhur: ${dzuhur}\nAshar: ${ashar}\nMaghrib: ${maghrib}\nIsya: ${isya}\nSubuh: ${subuh}\n\nDiperkirakan matahari akan terbit pada pukul ${terbit} dengan jeda dari subuh sekitar ${perbandingan}`
                          await client.reply(from, msg, id)
                          console.log('Success sending jadwal sholat!')
                      })
                  })
                  .catch(async (err) => {
                      console.error(err)
                      await client.reply(from, 'Kota tidak ditemukan!', id)
                  })
          break

      case 'quotes':
        break;

      case 'makequote':
        let getMakequote;
        if (arguments.join(' ').split('@').length < 2 && !quotedMsg) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}makequote <nama>@<kalimat>_`, id);
        if (quotedMsg) {
          let teks = quotedMsg.body.trim().split(' ');
          let newteks = [`${quotedMsg.sender.pushname}@`].concat(teks)
          getMakequote = _function.makequote(newteks);
        } else {
          getMakequote = _function.makequote(arguments);
        }
        await client.sendImage(from, getMakequote, sender.id, '', id);
        break;

      case 'mirip':
        if (mentionedJidList.length > 0 || arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}mirip <nama>_`, id);
        const listNama = ['Udin', 'Uzumaki Bayu', 'Saburo', 'Saruto', 'Yang Lek', 'Uchiha Roy', 'DPR yang korupsi, gendut gendut gak berotak', 'Monyet', 'Maling kandang', 'Maling Dalaman'];
        await client.reply(from, `_👦🏼 *${arguments.join(' ')}* Mirip dengan ${listNama[Math.floor(Math.random() * listNama.length)]}_`, id);
        break;

      case 'gay':
        if (mentionedJidList.length > 0 || arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}gay <nama>_`, id);
        const gayPercentage = Math.floor(Math.random() * 100);
        await client.reply(from, `_👬🏻 Tingkat gay *${arguments.join(' ')}* sebesar ${gayPercentage}%_`, id);
        break;

      case 'brainly':
        if (arguments.length < 1) return client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}brainly <pertanyaan>_`, id);
        const getBrainly = await _function.brainly(arguments.join(' '));
        await client.reply(from, getBrainly, id);
        break;

      case 'sticker':
      case 'stiker':
        if (!isImage && !isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim atau reply sebuah gambar yang ingin dijadikan stiker lalu berikan caption ${botPrefix}stiker_`, id);
        if (!isDocument && !isQuotedDocument) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim atau reply sebuah gambar yang ingin dijadikan stiker lalu berikan caption ${botPrefix}stiker_`, id);
        const encryptMedia = isQuotedImage ? quotedMsg : message
        const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
        const mediaData = await decryptMedia(encryptMedia, uaOverride)
        const mediatostr = mediaData.toString('base64')
        const imageBase64 = `data:${_mimetype};base64,${mediatostr}`
        //const imagemediadata = await decryptMedia(message);
        //const imageb64 = `data:${mimetype};base64,${imagemediadata.toString('base64')}`;
        await client.sendImageAsSticker(from, imageBase64, {keepScale:true});
        break;

      case 'gifsticker':
      case 'gifstiker':
        if (!isVideo && !isQuotedVideo) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim atau reply sebuah gif/video pendek yang ingin dijadikan stiker lalu berikan caption ${botPrefix}gifstiker_`, id);
        if (!isDocument && !isQuotedDocument) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim atau reply sebuah gif/video pendek yang ingin dijadikan stiker lalu berikan caption ${botPrefix}gifstiker_`, id);
        const encryptMedia2 = isQuotedVideo ? quotedMsg : message
        const _mimetype2 = isQuotedVideo ? quotedMsg.mimetype : mimetype
        const vidmediadata = await decryptMedia(encryptMedia2);
        const vidb64 = `data:${_mimetype2};base64,${vidmediadata.toString('base64')}`;
        await client.sendMp4AsSticker(from, vidb64, { fps: 10, startTime: `00:00:00.0`, endTime: `00:00:10.0`, loop: 0, crop:false});
        break;

      case 'giphysticker':
      case 'giphystiker':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}giphystiker <giphy url/link>_`, id);
        if (!arguments[0].match(urlRegex)) return await client.reply(from, '_⚠️ Pastikan yang kamu kirimkan adalah url yang benar_', id);
        await client.sendGiphyAsSticker(from, arguments[0]);
        break;

      case 'extractsticker':
      case 'getsticker':
        if (!isQuotedSticker) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : reply sebuah stiker yang ingin diekstrak_`, id);
        const mediaData3 = await decryptMedia(client.getStickerDecryptable(quotedMsg));
        const _mimetype3 = quotedMsg.mimetype
        const mediatostr3 = mediaData3.toString('base64')
        const imageBase64_3 = `data:${_mimetype3};base64,${mediatostr3}`
        await client.sendImage(from, imageBase64_3, 'extract.jpg', null, id)
		break;

      case 'extract':
        if (!isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : reply sebuah gambar view once yang ingin diekstrak_`, id);
        const mediaData4 = await decryptMedia(quotedMsg);
        const imageBase64_4 = `data:${quotedMsg.mimetype};base64,${mediaData4.toString(
          'base64'
        )}`;
        await client.sendImage(from, imageBase64_4, 'extract.jpg', null, id)
		break;

      case 'bucin':
        const katabucin = await _function.bucin();
        await client.reply(from, katabucin, id);
        break;

      case 'jodoh':
        const jodohSplit = arguments.join(' ').split('&');
        if (jodohSplit.length < 2) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah: ${botPrefix}jodoh <nama kamu>&<nama seseorang>_`);
        const jodohPersentase = Math.floor(Math.random() * 100);
        await client.reply(from, `_💖 Persentase kecocokan ${jodohSplit[0]} & ${jodohSplit[1]} sebesar ${jodohPersentase}_`, id);
        break;

      case 'ytmp3':
      case 'musik':
      case 'music':
        await client.reply(from, "Fitur ini sedang tidak bisa digunakan, karena server converternya sedang down", id);
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}music <title> / <url>_`, id);
        //if (ytwait == true) return await client.reply(from, '_⚠️ Mohon menunggu command music sebelumnya selesai diupload terlebih dahulu_', id);
        //const musicLink2 = await _function.youtube.youtubeMusic(arguments.join(' '));
        //if (!musicLink2) return await client.reply(from, '_⚠️ Pastikan music yang anda inginkan dibawah 10 menit!_', id);
        //try {
            //if (musicLink2.result.error == true) return await client.reply(from, `⚠️ Error ! \n\nMessage error : \n${musicLink2.result.message}`,id)
            //await client.reply(from, ind.wait() + "\nMusik sedang diupload...", id)
            //const mp3url = musicLink2.result.file;
            //const judul = musicLink2.result.title;
            //const thumb = musicLink2.thumbnail;
            //const durasi = musicLink2.duration;

            //var menit = Math.floor(durasi / 60);
            //var detik = durasi - menit * 60;

            //const caption = `-------[ *Detail musik* ]-------\n\nJudul : ${judul}\nDurasi : ${menit} menit ${detik} detik`
            //await client.sendImage(from, thumb, "thumb.jpg", caption, id)
            //await client.sendFileFromUrl(from, mp3url, "mp3yt.mp3", judul, id, null, null, true);
            //await client.reply(from, `⚠️ Error !\nPastikan music yang anda inginkan dibawah 5 menit!\n\nMessage error : \n${musicLink.result.message}`, id);
        //} catch (error) {
          //await client.reply(from, "Sepertinya musik tidak bisa di upload, mon maap 🙏\n\nSilahkan cari musik lainnya", id);
          //console.log("music download error " + musicLink);
          //console.log(error.stack);
        //}
        break;

      case 'ytmp4':
        await client.reply(from, "Fitur ini sedang tidak bisa digunakan, karena server converternya sedang down", id);
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}ytmp4 <title> / <url>_`, id);
        //if (ytwait == true) return await client.reply(from, '_⚠️ Mohon menunggu command music/video sebelumnya selesai diupload terlebih dahulu_', id);
        //const videoLink = await _function.youtube.youtubeVideo(arguments.join(' '));
        //if (!videoLink) return await client.reply(from, '_⚠️ Pastikan video yang anda inginkan dibawah 10 menit!_', id);
        //try {
          //if (videoLink.result.error == true){
             //return await client.reply(from, `⚠️ Error ! \n\nMessage error : \n${videoLink.result.message}`, id);
          //} else {
            //await client.reply(from, ind.wait()+ "\nVideo sedang diupload...", id)
            //const mp4url = videoLink.result.file;
            //const judul = videoLink.result.title;
            //const thumb = videoLink.thumbnail;
            //const durasi = videoLink.duration;

            //var menit = Math.floor(durasi / 60);
            //var detik = durasi - menit * 60;

            //const caption = `-------[ *Detail Video* ]-------\n\nJudul : ${judul}\nDurasi : ${menit} menit ${detik} detik`

            //await client.sendImage(from, thumb, "thumb.jpg", caption, id)
            //await client.sendFileFromUrl(from, mp4url, "vid.mp4", judul, id);
          //}
        //} catch (error) {
          //await client.reply(from, "Sepertinya musik tidak bisa di upload, mon maap 🙏\n\nSilahkan cari video lainnya", id);
          //console.log("music download error " + musicLink);
          //console.log(error.stack);
        //}
        break;

      case 'ytsearch':
        await client.reply(from, "Fitur ini sedang tidak bisa digunakan, karena server converternya sedang down", id);
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}ytsearch <title>_`, id);
        //const videodata = await _function.youtube.youtubeSearch(arguments.join(' '));
        //console.log(videodata)
        //if (!videodata) return await client.reply(from, '_⚠️ Error !_', id);
          //let url = videodata.url[0];
          //let judul = videodata.title[0];
          //const thumb = videodata[index].thumbnail;
          //let durasi = videodata.duration[0];

          //var menit = Math.floor(durasi / 60);
          //var detik = durasi - menit * 60;

          //let caption = `-------[ *Detail Video* ]-------\n\nJudul : ${judul}\nDurasi : ${menit} menit ${detik} detik`
          //await client.sendButtons(from, caption, [
            //{
              //id: `ytmp3 ${url}`,
              //text: 'Download MP3🎵'
            //},{
              //id: `ytmp4 ${url}`,
              //text: 'Download MP4▶️'
            //},{
              //id: `ytsearch 1 ${arguments.join(' ')}`,
              //text: `Next item ⏭️`
            //}
          //], `Video Results ${1}`)
      break;
      
      case 'lyrics':
      case 'lirik':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}lirik <judul lagu>_`, id);
        const getLyrics = await _function.lirik(arguments.join(' '));
        if (!getLyrics) return await client.reply(from, `_🥺 Lirik *${arguments.join(' ')}* Tidak Ditemukan!_`, id);
        await client.reply(from, getLyrics, id);
        break;

      case 'short':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}short <url/link yang ingin di perkecil>_`, id);
        const getShortener = await _function.short(arguments[0]);
        await client.reply(from, `${getShortener}`, id);
        break;

      case 'corona':
      case 'covid':
        const getCovid = await _function.covid(arguments.join(' '));
        await client.reply(from, getCovid || '_⚠️ Negara yang kamu maksud sepertinya tidak ter-data!_', id);
        break;

      case 'cat':
        const getCat = await _function.cat();
        await client.sendImage(from, getCat || 'https://cdn2.thecatapi.com/images/uvt2Psd9O.jpg', `${t}_${sender.id}.jpg`, '', id);
        break;

      case 'dog':
        const getDog = await _function.dog();
        await client.sendImage(from, getDog || 'https://images.dog.ceo/breeds/cattledog-australian/IMG_3668.jpg', `${t}_${sender.id}.jpg`, '', id);
        break;

      case 'meme':
        const getMeme = await _function.meme();
        await client.sendFile(from, getMeme.picUrl || 'https://i.redd.it/5zm5i8eqw5661.jpg', `${t}_${sender.id}.${getMeme.ext}`, '', id);
        break;

      case 'anime':
        if (arguments.length < 1) return await client.reply(from, `_Penggunaan : ${botPrefix}anime <judul>_`, id);
        const getAnime = await _function.animesearch(arguments.join(' '));
        if (!getAnime) return await client.reply(from, `_*Error!*_\nAnime tidak ditemukan `, id)
        await client.sendImage(from, getAnime.picUrl, `${t}_${sender.id}.jpg`, getAnime.caption, id);
        break;

      case 'stikernobg':
        return await client.reply(from, '_⚠️ Fitur Proses perbaikan/pengerjaan!_', id);
        break;

      case 'stickertottext':
      case 'stickerteks':
      case 'stikerteks':
        let teksLink
        if (arguments.length < 1 && !quotedMsg) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}stikerteks <kalimat>_`, id);
        if (quotedMsg) {
          let teks = quotedMsg.body.trim().split(' ');
          teks.push(`-${quotedMsg.sender.pushname}`)
          teksLink = _function.tosticker(teks);
        } else {
          teksLink = _function.tosticker(arguments);
        }
        await client.sendStickerfromUrl(from, teksLink);
        break;

      /*case 'wikipedia':
      case 'wiki':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}wiki <keywords>_`, id);
        const getWiki = await _function.wiki.wiki(arguments.join(' '));
        if (!getWiki) return await client.reply(from, `_⚠️ *${arguments.join(' ')}* pada Wikipedia tidak ditemukan_`, id);
        await client.sendImage(from, getWiki.picUrl, `${t}_${sender.id}.jpg`, getWiki.caption, id);
        break;*/

      case 'imagequote':
        const getImagequote = await _function.imgquote();
        await client.sendImage(from, getImagequote, `${t}_${sender.id}.jpg`, '', id);
        break;

      case 'join':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}join <grup link>_`, id);
        const joinStatus = await client.joinGroupViaLink(arguments[0]);
        if (joinStatus === 406) return await client.reply(from, '_⚠️ Pastikan yang kamu masukkan adalah URL grup yang benar!_', id);
        if (joinStatus === 401) return await client.reply(from, '_⚠️ Bot Tidak dapat Join, karena baru-baru ini bot baru saja di kick dari grup tersebut!_', id);
        await client.reply(from, '_🚀 Meluncur! Bot berhasil masuk grup!_', id);
        break;

      case 'roll':
        const rollNumber = Math.floor(Math.random() * (6 - 1) + 1);
        await client.sendStickerfromUrl(from, `https://www.random.org/dice/dice${rollNumber}.png`);
        break;

      case 'weather':
      case 'cuaca':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}cuaca <nama kota>_`, id);
        const getWeather = await _function.weather(arguments.join(' '));
        await client.reply(from, getWeather, id);
        break;

      case 'movie':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}movie <judul>_`, id);
        const getMovie = await _function.movie(arguments.join(' '));
        if (!getMovie) return await client.reply(from, `_⚠️ ${arguments.join(' ')} Tidak ditemukan!_`, id);
        await client.sendImage(from, getMovie.moviePicture, `${t}_${sender.id}.jpeg`, getMovie.movieCaption, id);
        break;

      case 'run':
        const { chatId, body } = message;
        try {
          let msg = body.replace("#run ", "").split("\n");
          const lang = msg.splice(0, 1)[0];
          const source = msg.join("\n");
          const response = await axios.post(
            "https://emkc.org/api/v1/piston/execute",
            {
              language: lang,
              source: source,
            }
          );
          const { ran, language, output, version, code, message } = response.data;
          const reply = `${
            ran ? "Ran" : "Error running"
          } with ${language} v${version}\nOutput:\n${output}`;
          client.sendText(from, reply);
        } catch (e) {
          console.log(e);
          client.sendText(from, "Unsupported language");
        }
        break;

      case 'run languages':
        const response = await axios.get(
          "https://emkc.org/api/v1/piston/versions"
        );
        const reply = response.data
          .map((item) => `${item.name} - v${item.version}`)
          .join("\n");
        client.sendText(from, reply);
        break;

      case 'loginvr':
        const vr = "Login vr dong \n yasman @6281285600258 \n hadid @6281329989383 \n junas @628978113198 \n barra @6281388088047 \n sean @6283818448972 \n ari @6281299115053 \n dito @6285155277438 \n murise @6281511529199";
        await client.sendTextWithMentions(from, vr);
        break;

      case 'logingta':
        const gta =`Login gta dong
Aji @628888418207
Junas @628978113198
Gisah @6288225610884
Dito @6285155277438
Arip @6282299922988
Hadid @6281329989383
Willy @6282112378872
Wahuy @6281413543830
Nopal @6289638065793
Murise @6281511529199`;
        await client.sendTextWithMentions(from, gta);
        break;

        case 'login4no':
        const genshin =`Login Genshin dong
Aji @628888418207
Junas @628978113198
Gisah @6288225610884
Dito @6285155277438
Titan @6287788087760
Wahuy @6281413543830
Barra @6281388088047
Murise @6281511529199`;
        await client.sendTextWithMentions(from, genshin);
        break;

        case 'logindota':
        const dota =`Login Dota 2 dong
Junas @628978113198
Dito @6285155277438
Arip @6282299922988
Wahuy @6281413543830
Murise @6281511529199`;
        await client.sendTextWithMentions(from, dota);
        break;

      case 'loginml':
        const ml = `Login ml dong
aji @628888418207
wahyu @6281413543830
yasman @6281285600258
junas @628978113198
ikhsan @6281510026269
sese @6281511529199
dito @6285155277438
jidni @62895330810346
titan @6287788087760
barra @6281388088047`;
        await client.sendTextWithMentions(from, ml);
        break;

      case 'loginamong':
        const among = `Login among us dong
Murise @6281511529199
Dito @6285155277438
Junas @628978113198
Arip @6282299922988
Hadid @6281329989383
Willy @6282112378872
Wahuy @6281413543830
Nopal @6289638065793
Ghyas @6281285600258
Zidny @62895330810346
Aji @628888418207
Barra @6281388088047
Titan @6287788087760
Aufa @6285893440925`;
        await client.sendTextWithMentions(from, among);
        break;

      case 'loginmc':
        const mc =`Login minecraft dong
Gisah @6288225610884
Willy @6282112378872
Murise @6281511529199
Aufa @6285893440925
Nopal @6289638065793
Junas @628978113198
Barra @6281388088047
Wahyu @6281413543830
Titan @6287788087760
Dito @6285155277438`;
        await client.sendTextWithMentions(from, mc);
        break;

      case 'tambahtugas':
      case 'addtugas':
	if (!q.includes('|')) return await client.reply(from, ind.wrongFormat(), id);
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}addtugas | <detail tugas>_`, id);
        const isitugas = arg.split('|')[1];
        const tugasin = tugas.push(isitugas);
        fs.writeFileSync('./database/tugas.json', JSON.stringify(tugas));
        if (tugasin) return await client.reply(from, '📚 Tugas sudah ditambahkan!', id)
        break;
      
      case 'listtugas':
        if (!tugas.length || tugas.length == 0){
          await client.reply(from, "Gaada tugas ntap", id);
        } else {
          const listtugas = ngelisttugas()
          await client.reply(from, listtugas, id);
        }
        break;
        
      case 'deletetugas':
      case 'hapustugas':
        if (arguments.length < 1) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix} <nomor tugas>_`, id);
        var i = arguments[0];
        i--;
        const hapusintugaslist = tugas.splice(i, 1);
        fs.writeFileSync('./database/tugas.json', JSON.stringify(tugas));
        //const hapusin = delete tugas[i];
        if (hapusintugaslist) return await client.reply(from, "Tugas dengan nomor " + arguments + " sudah dihapus", id);
        break;

      //Stiker commands

      case 'halo':
        await client.sendFile(from, './mediapreload/haloo.mp3', "halo.mp3", "Haloo", null, null, true);
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/StZTdND/haloo.png');
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/PNCvDNJ/halo2.jpg');
        break;

      case 'asep':
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/2yytWMt/asep1.png');
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/Nt1qc67/asep2.png');
        break;

      case 'tabah':
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/Xy5YQ9H/tabah1.jpg');
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/yS2zpFt/tabah2.jpg');
        break;

      case 'lutelat':
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/Y2mnHhm/lotelat.jpg');
        await client.sendFile(from, './mediapreload/telat.mp3', "telat.mp3", "telaat", null, null, true);
        break;

      case 'bayu':
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/pK5Qs4J/bayu1.jpg');
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/kDfVq4h/bayu2.jpg');
        break;

      case 'payoy':
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/cxNvqz7/payoy.jpg');
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/cxNvqz7/payoy.jpg');
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/r6phywr/payoy2.jpg');
        break;

      case 'teja':
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/M5gfvfQ/teja1.jpg');
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/VSn3d8k/teja2.png');
        break;
      
      case 'indihome':
        await client.sendFile(from, './mediapreload/indihome.mp3', "halo.mp3", "Haloo", null, null, true);
        await client.sendStickerfromUrl(from, 'https://i.ibb.co/k8xwK8s/image.png');
        break;

      case 'palpale':
        await client.sendFile(from, './mediapreload/pale.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'yamete':
        await client.sendFile(from, './mediapreload/masukin.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'papepap':
        await client.sendFile(from, './mediapreload/pap.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'prank':
        await client.sendFile(from, './mediapreload/prank.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'goblok':
        await client.sendFile(from, './mediapreload/goblok.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'anjing':
        await client.sendFile(from, './mediapreload/anjing.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'cangkul':
        await client.sendFile(from, './mediapreload/cangkul.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'otak':
        await client.sendFile(from, './mediapreload/otak.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'bangsat':
        await client.sendFile(from, './mediapreload/bangsat.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'sange':
        await client.sendFile(from, './mediapreload/sange.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'failed':
        await client.sendFile(from, './mediapreload/failed.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'demituhan':
        await client.sendFile(from, './mediapreload/demituhan.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'asede':
      case 'asade':
        await client.sendFile(from, './mediapreload/asade.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'wikawika':
        await client.sendFile(from, './mediapreload/wikawika.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'panikga':
        await client.sendFile(from, './mediapreload/panikga.mp3', "halo.mp3", "Haloo", null, null, true);
        break;
      
      case 'yntkts':
      case 'ygtkts':
      case 'yntkns':
        await client.sendFile(from, './mediapreload/yntkts.mp3', 'yntkts.mp3', 'yntkts', null, null, true);
        break;

      case 'assalamualaikum':
      case 'asalamualaikum':
      case 'salam':
        await client.sendFile(from, './mediapreload/salam.mp3', "halo.mp3", "Haloo", null, null, true);
        break;

      case 'resi':
        if (arguments.length !== 2) return client.reply(from, `Maaf, format pesan salah.\nSilahkan ketik pesan dengan ${botPrefix}resi <kurir> <no_resi>\n\nKurir yang tersedia:\njne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex`, id);
        const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex'];
        if (!kurirs.includes(arguments[0])) return client.sendText(from, `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`);
        console.log('Memeriksa No Resi', arguments[1], 'dengan ekspedisi', arguments[0]);
        _function.cekResi(arguments[0], arguments[1]).then((result) => client.sendText(from, result));
        break;

      case 'nhder':
        if (disablecommand) {
          client.reply(from, "Fitur dimatikan sementara, tobat cok ", id)
          await client.sendStickerfromUrl(from, 'https://i.ibb.co/8nZFsY9/ghyastobat.png')
          return 0
        }
        if (arguments.length !== 1) return await client.reply(from, 'Silakan masukkan kode dengan benar!', id)
        await client.reply(from, ind.wait(), id)
        try {
            const kodeDojin = arguments[0]
            const proccessLink = `https://nhder.herokuapp.com/download/nhentai/${kodeDojin}/zip`
            const captionDojin = `------[ NHENTAI DOWNLOADER ]------\n\n➸ Kode doujin: ${kodeDojin}`
            await client.sendText(from, captionDojin)
            await client.sendFileFromUrl(from, proccessLink, `${kodeDojin}.zip`, '' , id)
        } catch (err) {
            console.error(err)
              await client.reply(from, `Error!\n${err}`, id)
        }
        break
      
        case 'santet':
          if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
          if (mentionedJidList.length === 0) return client.reply(from, 'Tag member yang mau disantet\n\nContoh : /santet @tag | kalo berak kaga di siram', id)
          if (arguments.length === 1) return client.reply(from, 'Masukkan alasan kenapa menyantet dia!!\n\nContoh : /santet @tag | kalo berak kaga di siram', id)
              const terima1 = santet[Math.floor(Math.random() * (santet.length))]
              const target = arg.split('|')[0]
              const alasan = arg.split('|')[1]
              await client.sendTextWithMentions(from, `Santet terkirim ke ${target}, Dengan alasan${alasan}\n\nJenis Santet Yang di Terima Korban adalah *${terima1}*`)
          break

        case 'addjudullist':
          if (arguments.length === 0) return client.reply(from, `Buat list dengan judul\n\nContoh : ${botPrefix}addjudullist | <judul list>`, id);
          if (judullist.length > 0) return client.reply(from, `Mohon untuk reset list terlebih dahulu dengan command ${botPrefix}resetlist`, id);
          const isijudullist = arg.split(`|`)[1];
          const judulin = judullist.push(isijudullist);
          if (judulin) return client.reply(from, `List sudah ditambahkan, untuk menambahkan isi list menggunakan command ${botPrefix}addlist | <isi list>`, id);
          break;
        
        case 'addlist':
          if (arguments.length === 0) return client.reply(from, `Tambah daftar List dengan isi\n\nContoh : ${botPrefix}addlist | <ini list>`, id);
          if (judullist.length === 0) return client.reply(from, `Mohon untuk membuat judul List terlebih dahulu dengan command ${botPrefix}addjudullist`, id);
          const isilist = arg.split(`|`)[1];
          const isiin = daftarlist.push(isilist);
          if (isiin) {
            const isidaftar = ngelistisi();
            client.reply(from, isidaftar, id);
          }
          break;
        
        case 'hapuslist':
          if (arguments.length === 0) return client.reply(from, `Hapus item pada List dengan nomor item\n\nContoh : ${botPrefix}hapuslist 1`, id);
          if (daftarlist.length === 0) return client.reply(from, `Tambah daftar List dengan isi\n\nContoh : ${botPrefix}addlist | <ini list>`, id);
          if (judullist.length === 0) return client.reply(from, `Mohon untuk membuat judul List terlebih dahulu dengan command ${botPrefix}addjudullist`, id);
          var i = arguments[0];
          i--;
          const hapusinlist = daftarlist.splice(i, 1);
          if (hapusinlist){
            client.reply(from, `Item dengan nomor ${arguments} telah dihapus !`);
            const isidaftar = ngelistisi();
            client.sendText(from, isidaftar);
          }
          break;

        case 'outputlist':
          if (daftarlist.length === 0) return client.reply(from, `Tambah daftar List dengan isi\n\nContoh : ${botPrefix}addlist | <ini list>`, id);
          if (judullist.length === 0) return client.reply(from, `Mohon untuk membuat judul List terlebih dahulu dengan command ${botPrefix}addjudullist`, id);
          const isidaftar = ngelistisi();
          client.reply(from, isidaftar, id);
          break;

        case 'resetlist':
          while (daftarlist.length) { 
            daftarlist.pop(); 
          }
          while (judullist.length) { 
            judullist.pop(); 
          }
          if (daftarlist.length === 0 && judullist.length === 0) return client.reply(from, `List sudah di reset !`, id);
          break;

      case 'alkitab':
        if (arguments.length === 0) return client.reply(from, `Mengirim detail ayat al-kitab dari pencarian \n\nContoh : ${botPrefix}alkitab <pencarian>`, id);
        await client.reply(from, ind.wait(), id)
        _function.misc.alkitab(q)
            .then(async ({ result }) => {
                let alkitab = '-----[ *AL-KITAB* ]-----'
                for (let i = 0; i < result.length; i++) {
                    alkitab +=  `\n\n➸ *Ayat*: ${result[i].ayat}\n➸ *Isi*: ${result[i].isi}\n➸ *Link*: ${result[i].link}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                }
                await client.reply(from, alkitab, id)
                console.log('Success sending Al-Kitab!')
            })
        break

      case 'kbbi':
        if (arguments.length === 0) return client.reply(from, `Mengirim detail arti kbbi dari pencarian \n\nContoh : ${botPrefix}kbbi <pencarian>`, id);
        await client.reply(from, ind.wait(), id)
	try{
          _function.misc.kbbi(q)
          .then(async ({ lema, arti })=> {
              let kbbi = '------*KBBI*------'
              kbbi += `\n\n*Kata*: ${lema}\n\n`
              kbbi += `*Arti*: \n`
              for (let i = 0; i < arti.length; i++){
                kbbi += `➸ ${arti[i]}\n`
              }
              await client.reply(from, kbbi, id)
              console.log('Success sending KBBI details!')
	    })
            } catch (err){
              await client.reply(from, `Sepertinya kata tersebut tidak ditemukan, mohon coba kata lain`)
              console.log('Failed sending KBBI details!')
              console.log(err.stack)
            }
        break

      case 'reminder': // by Slavyan
        const remindhelp= `
*${botPrefix}reminder*
Pengingat. 
*s* - detik
*m* - menit
*h* - jam
*d* - hari
Aliases: -
Usage: *${botPrefix}reminder* 10s | pesan_pengingat
        `
        if (arguments.length === 0) return client.reply(from, remindhelp, id)
        if (!q.includes('|')) return await client.reply(from, ind.wrongFormat(), id)
        const timeRemind = q.substring(0, q.indexOf('|') - 1)
        const messRemind = q.substring(q.lastIndexOf('|') + 2)
        const parsedTime = parseMilliseconds(toMs(timeRemind))
        _function.reminder.addReminder(sender.id, messRemind, timeRemind, _reminder)
        await client.sendTextWithMentions(from, `*「 REMINDER 」*\n\nReminder diaktifkan! :3\n\n➸ *Pesan*: ${messRemind}\n➸ *Durasi*: ${parsedTime.days} hari ${parsedTime.hours} jam ${parsedTime.minutes} menit ${parsedTime.seconds} detik\n➸ *Untuk*: @${sender.id.replace('@c.us', '')}`, id)
        const intervRemind = setInterval(async () => {
            if (Date.now() >= _function.reminder.getReminderTime(sender.id, _reminder)) {
                await client.sendTextWithMentions(from, `⏰ *「 REMINDER 」* ⏰\n\nAkhirnya tepat waktu~ @${sender.id.replace('@c.us', '')}\n\n➸ *Pesan*: ${_function.reminder.getReminderMsg(sender.id, _reminder)}`)
                _reminder.splice(_function.reminder.getReminderPosition(sender.id, _reminder), 1)
                fs.writeFileSync('./database/reminder.json', JSON.stringify(_reminder))
                clearInterval(intervRemind)
            }
        }, 1000)
        break

      case 'infohoax':
        await client.reply(from, ind.wait(), id)
        _function.misc.infoHoax()
          .then(async ({ result }) => {
              let txt = '*「 HOAXES 」*'
              for (let i = 0; i < result.length; i++) {
                  const { tag, title, link } = result[i]
                  txt += `\n\n➸ *Status*: ${tag}\n➸ *Deskripsi*: ${title}\n➸ *Link*: ${link}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
              }
              await client.sendFileFromUrl(from, result[0].image, 'hoax.jpg', txt, id)
              console.log('Success sending info!')
          })
          .catch(async (err) => {
              console.error(err)
              await client.reply(from, 'Error!', id)
          })
        break

      case 'translate':   
          if (arguments.length === 0) return client.reply(from, `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${botPrefix}translate <kode_bahasa>\ncontoh ${botPrefix}translate id\n\nAtau dengan perintah ${botPrefix}translate <bahasa> | <teks>`, id)
          if (q.includes('|')){
            const texto = arg.split('|')[1]
            const languaget = arg.split(' |')[0]
            _function.translate(texto, languaget).then((result) => client.sendText(from, result)).catch(() => client.sendText(from, 'Error noreply, Kode bahasa salah.\n\n Silahkan cek kode bahasa disini\nhttps://github.com/vitalets/google-translate-api/blob/master/languages.js'))
            //translate(texto, {to: languaget}).then(res => {client.reply(from, res.text, id)}).catch(() => client.sendText(from, 'Error, Kode bahasa salah.\n\n Silahkan cek kode bahasa disini\nhttps://github.com/vitalets/google-translate-api/blob/master/languages.js'))
          } else { const quoteText = quotedMsg.body
            _function.translate(quoteText, arguments[0])
                .then((result) => client.sendText(from, result))
                .catch(() => client.sendText(from, 'Error reply, Kode bahasa salah.\n\n Silahkan cek kode bahasa disini\nhttps://github.com/vitalets/google-translate-api/blob/master/languages.js'))}
          //if (!quotedMsg) return client.reply(from, `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${botPrefix}translate <kode_bahasa>\ncontoh ${botPrefix}translate id`, id)
          break
      
          case 'hadis': // irham01
          case 'hadees':
              if (arguments.length <= 1) return await client.reply(from, ind.hadis(), id)
              await client.reply(from, ind.wait(), id)
              console.log('argumen 1 : ' + arguments[0]+ ' argumen 2 : ' + arguments[1])
              try {
                  if (arguments[0] === 'darimi') {
                      const hdar = await axios.get(`https://api.hadith.sutanlab.id/books/darimi/${arguments[1]}`)
                      await client.sendText(from, `${hdar.data.data.contents.arab}\n${hdar.data.data.contents.id}\n\n*H.R. Darimi*`, id)
                  } else if (arguments[0] === 'ahmad') {
                      const hmad = await axios.get(`https://api.hadith.sutanlab.id/books/ahmad/${arguments[1]}`)
                      await client.sendText(from, `${hmad.data.data.contents.arab}\n${hmad.data.data.contents.id}\n\n*H.R. Ahmad*`, id)
                  } else if (arguments[0] === 'bukhari') {
                      const hbukh = await axios.get(`https://api.hadith.sutanlab.id/books/bukhari/${arguments[1]}`)
                      await client.sendText(from, `${hbukh.data.data.contents.arab}\n${hbukh.data.data.contents.id}\n\n*H.R. Bukhori*`, id)
                  } else if (arguments[0] === 'muslim') {
                      const hmus = await axios.get(`https://api.hadith.sutanlab.id/books/muslim/${arguments[1]}`)
                      await client.sendText(from, `${hmus.data.data.contents.arab}\n${hmus.data.data.contents.id}\n\n*H.R. Muslim*`, id)
                  } else if (arguments[0] === 'malik') {
                      const hmal = await axios.get(`https://api.hadith.sutanlab.id/books/malik/${arguments[1]}`)
                      await client.sendText(from, `${hmal.data.data.contents.arab}\n${hmal.data.data.contents.id}\n\n*H.R. Malik*`, id)
                  } else if (arguments[0] === 'nasai') {
                      const hnas = await axios.get(`https://api.hadith.sutanlab.id/books/nasai/${arguments[1]}`)
                      await client.sendText(from, `${hnas.data.data.contents.arab}\n${hnas.data.data.contents.id}\n\n*H.R. Nasa'i*`, id)
                  } else if (arguments[0] === 'tirmidzi') {
                      const htir = await axios.get(`https://api.hadith.sutanlab.id/books/tirmidzi/${arguments[1]}`)
                      await client.sendText(from, `${htir.data.data.contents.arab}\n${htir.data.data.contents.id}\n\n*H.R. Tirmidzi*`, id)
                  } else if (arguments[0] === 'ibnumajah') {
                      const hibn = await axios.get(`https://api.hadith.sutanlab.id/books/ibnu-majah/${arguments[1]}`)
                      await client.sendText(from, `${hibn.data.data.contents.arab}\n${hibn.data.data.contents.id}\n\n*H.R. Ibnu Majah*`, id)
                  } else if (arguments[0] === 'abudaud') {
                      const habud = await axios.get(`https://api.hadith.sutanlab.id/books/abu-daud/${arguments[1]}`)
                      await client.sendText(from, `${habud.data.data.contents.arab}\n${habud.data.data.contents.id}\n\n*H.R. Abu Daud*`, id)
                  } else {
                      await client.sendText(from, ind.hadis(), id)
                  }
              } catch (err) {
                  console.error(err)
                  await client.reply(from, 'Error!', id)
              }
          break

        case 'nulishd':                
          if (arguments.length == 0) return client.reply(from, `Membuat bot menulis teks yang dikirim menjadi gambar\nPemakaian: ${prefix}nulishd [teks]\n\ncontoh: ${prefix}nulis i love you 3000`, id)
          const nulisp = await _function.tulis(q)
          await client.sendImage(from, `${nulisp}`, '', 'Nih ...', id)
          .catch(() => {
              client.reply(from, 'Ada yang Error!', id)
          })
          break


          case 'nuliskanan': {
            if (!arguments.length >= 1) return client.reply(from, `Kirim ${botPrefix}nuliskanan teks`, id) 
            const tulisan = validMessage.slice(12)
            client.sendText(from, 'sabar ya lagi nulis')
            const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
            spawn('convert', [
                './mediapreload/images/buku/sebelumkanan.jpg',
                '-font',
                './lib/font/Indie-Flower.ttf',
                '-size',
                '960x1280',
                '-pointsize',
                '23',
                '-interline-spacing',
                '2',
                '-annotate',
                '+128+129',
                fixHeight,
                './media/images/buku/setelahkanan.jpg'
            ])
            .on('error', () => client.reply(from, 'Error gan', id))
            .on('exit', () => {
                client.sendImage(from, './media/images/buku/setelahkanan.jpg', 'after.jpg', `*Nulis selesai!*\n\nDitulis selama: ${_function.processTime(t, moment())} _detik_`, id)
              })
            }
            break

        case 'nuliskiri':                     
          if (!arguments.length >= 1) return client.reply(from, `Kirim ${botPrefix}nuliskiri teks`, id) 
          const tulisan = validMessage.slice(11)
          client.sendText(from, 'sabar ya lagi nulis')
          const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
          const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
          spawn('convert', [
              './mediapreload/images/buku/sebelumkiri.jpg',
              '-font',
              './lib/font/Indie-Flower.ttf',
              '-size',
              '960x1280',
              '-pointsize',
              '22',
              '-interline-spacing',
              '2',
              '-annotate',
              '+140+153',
              fixHeight,
              './media/images/buku/setelahkiri.jpg'
          ])
          .on('error', () => client.reply(from, 'Error gan', id))
          .on('exit', () => {
              client.sendImage(from, './media/images/buku/setelahkiri.jpg', 'after.jpg', `*Nulis selesai!*\n\nDitulis selama: ${_function.processTime(t, moment())} _detik_`, id)
          })
          break

        case 'foliokiri': {
            if (!arguments.length >= 1) return client.reply(from, `Kirim ${botPrefix}foliokiri teks`, id) 
            const tulisan = validMessage.slice(11)
            client.sendText(from, 'sabar ya lagi nulis')
            const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
            spawn('convert', [
                './mediapreload/images/folio/sebelumkiri.jpg',
                '-font',
                './lib/font/Indie-Flower.ttf',
                '-size',
                '1720x1280',
                '-pointsize',
                '23',
                '-interline-spacing',
                '4',
                '-annotate',
                '+48+185',
                fixHeight,
                './media/images/folio/setelahkiri.jpg'
            ])
            .on('error', () => client.reply(from, 'Error gan', id))
            .on('exit', () => {
                client.sendImage(from, './media/images/folio/setelahkiri.jpg', 'after.jpg', `*Nulis selesai!*\n\nDitulis selama: ${_function.processTime(t, moment())} _detik_`, id)
            })
            }
            break

          case 'foliokanan': {
            if (!arguments.length >= 1) return client.reply(from, `Kirim ${botPrefix}foliokanan teks`, id) 
            const tulisan = validMessage.slice(12)
            client.sendText(from, 'sabar ya lagi nulis')
            const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
            spawn('convert', [
                './mediapreload/images/folio/sebelumkanan.jpg',
                '-font',
                './lib/font/Indie-Flower.ttf',
                '-size',
                '960x1280',
                '-pointsize',
                '23',
                '-interline-spacing',
                '3',
                '-annotate',
                '+89+190',
                fixHeight,
                './media/images/folio/setelahkanan.jpg'
            ])
            .on('error', () => client.reply(from, 'Error gan', id))
            .on('exit', () => {
                client.sendImage(from, './media/images/folio/setelahkanan.jpg', 'after.jpg', `*Nulis selesai!*\n\nDitulis selama: ${_function.processTime(t, moment())} _detik_`, id)
            })
            }
            break

          case 'pollresult':
              _function.polling.getpoll(client, message, pollfile, voterslistfile)
              break
          
          case 'addvote':
              console.log('---> vote start')
              _function.polling.voteadapter(client, message, pollfile, voterslistfile)
              break
          
          case 'addpoll':
              _function.polling.adminpollreset(client, message, message.body.slice(9), pollfile, voterslistfile)
              break
          
          case 'addv':
              _function.polling.addcandidate(client, message, message.body.slice(6), pollfile, voterslistfile)
              break


      case 'fb':
        case 'facebook':
            if (arguments.length !== 1) return client.reply(from, `_⚠️ Contoh Penggunaan perintah : ${botPrefix}fb <link fb>_`, id)
            if (!isUrl(url) && !url.includes('facebook.com')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            await client.reply(from, ind.wait(), id)
            _function.facebook(url).then(async (videoMeta) => {
                const title = videoMeta.title
	              const linkhd = videoMeta.download.hd
                var statquality = "quality"
                var linkdown

                if (linkhd == null) {
                  linkdown = videoMeta.download.sd
                  statquality = "SD"
                } else {
                  linkdown = videoMeta.download.hd
                  statquality = "HD"
                }
                
                console.log(`FB link found : ${linkdown}`);

                const caption = `Judul: ${title} \n\nKualitas Video: ${statquality}`
                await client.sendFileFromUrl(from, linkdown, 'videos.mp4', caption)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${_function.processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            })
                .catch(async (err) => {
                  client.reply(from, `Error, url tidak valid atau tidak memuat video. [Invalid Link or No Video] \n\n${err}`, id);
                  console.log(err);
                })
          break
      
      case 'musicidentify':
        let resultm
        if (!isQuotedVoice && !isQuotedAudio) return client.reply(from, `_⚠️ Contoh Penggunaan perintah : reply music berbentuk voice note yang ingin di identifikasi musiknya dengan ${botPrefix}musicidentify_`, id)
        await client.reply(from, ind.wait(), id)
        const encryptMediaAudio = quotedMsg
        const mediaDataAudio = await decryptMedia(encryptMediaAudio, uaOverride)
        const audioPath = await saveFile(mediaDataAudio, `musicidentify.${sender.id}`)
        if (path.extname(audioPath) == '.opus' || path.extname(audioPath) == '.aac'){
          var audioPath2 = path.resolve(audioPath)
          console.log("audiopath absolute : ", audioPath2)
          console.log("Converting audio to mp3...")
          var absolutepath = process.cwd()
          var fileresult = `${absolutepath}/media/musicout.${sender.id}.mp3`
          ffmpeg(audioPath2)
          .toFormat('mp3')
          .setDuration(20)
          .on('error', (err) => {
            client.reply(from, `Konversi error!\nMohon coba lagi atau laporkan kepada owner\n\nError Message ${err.message}`);
          })
          .on('progress', (progress) => {
              // console.log(JSON.stringify(progress));
              console.log('Processing: ' + progress.targetSize + ' KB converted');
          })
          .on('end', () => {
              console.log('Processing finished !');
          })
          .save(fileresult);//path where you want to save your file
          const linkfile = await _function.uploadAnonfile(`media/musicout.${sender.id}.mp3`)
          if (linkfile.data.status == 'false') return client.reply(from, `Upload anonfile error!\n Message : ${linkfile.data.error.message}`, id)
          console.log("link file : ", linkfile.data.data.file.url.full)
          resultm = await _function.audioindentify(linkfile.data.data.file.url.full)
        } else if (path.extname(audioPath) == '.mp3') {
          var fileresult2 = `media/musicout.${sender.id}.mp3`
          await MP3Cutter.cut({
            src: audioPath,
            target: fileresult2,
            start: 0,
            end: 20 
          });
          const linkfile2 = await _function.uploadAnonfile(fileresult2)
          console.log("link file : ", linkfile2)
          resultm = await _function.audioindentify(linkfile2)
        }
        console.log('resultm : ', resultm)
        if (resultm.data.status == 'success'){
          let teks = `🎵*Hasil Identifikasi Lagu*🎵
*Judul* : ${resultm.data.result.title}
*Artis* : ${resultm.data.result.artist}
*Album* : ${resultm.data.result.album}
*Link* : ${resultm.data.result.song_link}
*Link Spotify* : ${resultm.data.result.spotify.album.external_urls.spotify}
          
*Posisi rekaman pada lagu* : ${resultm.data.result.timecode}`
          client.sendImage(from, resultm.data.result.spotify.album.images[0].url, 'music.jpg', teks, id)
        } else {
          client.reply(from, `Request error!\nMohon coba lagi atau laporkan kepada owner\nError Message : ${resultm.data.error.error_code} - ${resultm.data.error.error_message}`,id)
        }
        //await client.reply(from, `${audioPath} file saved`, id)
        break
      
      //Weeb Zone
      case 'neko':
        console.log('Getting neko image...')
        await client.sendFileFromUrl(from, (await neko.sfw.neko()).url, 'neko.jpg', '', null, null, true)
          .then(() => console.log('Success sending neko image!'))
          .catch(async (err) => {
            console.error(err)
            await client.reply(from, 'Error!', id)
          })
        break

      case 'animewall':
        if (disablecommand) return await client.reply(from, "_Sementara fitur dimatikan, dikarenakan tercampurnya library sfw dengan nsfw_", id)
        console.log('Getting wallpaper image...')
          await client.sendFileFromUrl(from, (await neko.sfw.wallpaper()).url, 'wallpaper.jpg', '', null, null, true)
            .then(() => console.log('Success sending wallpaper image!'))
            .catch(async (err) => {
              console.error(err)
              await client.reply(from, 'Error!', id )
          })
        
        break

      case 'kusonime':
        if (arguments.length === 0) return client.reply(from, `Mengirim details anime dari web Kusoanime\n\nContoh : ${botPrefix}kusonime <judul anime>`, id);
        _function.weeaboo.anime(q)
          .then(async ({ info, link_dl, sinopsis, thumb, title, error, status }) => {
            if (status === false) {
              return await client.reply(from, error, id)
            } else {
              let animek = `${title}\n\n${info}\n\nSinopsis: ${sinopsis}\n\nLink download:\n${link_dl}`
              await client.sendFileFromUrl(from, thumb, 'animek.jpg', animek, null, null, true)
                .then(() => console.log('Success sending anime info!'))
            }
          })
          .catch(async (err) => {
            console.error(err)
            await client.reply(from, 'Error!', id)
          })
        break
      
      case 'wait':
      case 'traceanime':
        if (!isImage && !isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim atau reply sebuah gambar screenshot yang ingin dicari sumber anime nya lalu berikan caption ${botPrefix}wait_`, id);
        if (isMedia && isImage || isQuotedImage){
          await client.reply(from, ind.wait(), id)
          const encryptMedia = isQuotedImage ? quotedMsg : message
          //const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
          const mediaData = await decryptMedia(encryptMedia, uaOverride)
          //const mediatostr = mediaData.toString('base64')
          //const imageBase64 = `data:${_mimetype};base64,${mediatostr}`
          const imageLink = await uploadImages(mediaData, `wait.${sender.id}`)
          _function.weeaboo.wait(imageLink)
            .then(async (result) => {
              if (result.result && result.result.length <= 2) {
                return await client.reply(from, 'Anime not found! :(', id)
              } else {
                const {native, romaji, english} = result.result[0].anilist.title
                const { episode, similarity, video} = result.result[0]
                let teks = ''
                console.log(imageLink)
                teks += `*Anime Result*\n\n`
                console.log('Anime found, please wait')
                if (similarity < 0.85) {
                  teks += `*Title*: ${native}\n*Romaji*: ${romaji}\n*English*: ${english}\n*Episode*: ${episode}\n*Similarity*: ${(similarity * 100).toFixed(1)}%\nLow similiarity!. \n\nHasil merupakan asal tebak saja.`
                  client.reply(from, teks, id)
                } else {
                  teks += `*Title*: ${native}\n*Romaji*: ${romaji}\n*English*: ${english}\n*Episode*: ${episode}\n*Similarity*: ${(similarity * 100).toFixed(1)}%`
                  try {
                    await client.sendFileFromUrl(from, video, `result.mp4`, null, id)
                    await client.reply(from, teks, id)
                      .then(() => console.log('Success sending anime source!'))
                  } catch (error) {
                    await client.reply(from, teks, id)
                    console.log('Video send error, trying without video')
                    console.log(error.stack)
                  }
                }
              }
            })
              .catch(async (err) => {
              console.error(err)
              await client.reply(from, 'Error!', id)
            })
          }
        break

      case 'sauce':
        if (!isImage && !isQuotedImage) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : kirim sebuah gambar artwork yang ingin dicari sumber link nya lalu berikan caption ${botPrefix}sauce_`, id);
        if (isMedia && isImage || isQuotedImage) {
          await client.reply(from, ind.wait(), id)
          const encryptMedia = isQuotedImage ? quotedMsg : message
          const mediaData = await decryptMedia(encryptMedia, uaOverride)
          try {
              const imageLink = await uploadImages(mediaData, `sauce.${sender.id}`)
              console.log('Searching for source...')
              console.log('---> Image link : ' + imageLink)
              const results = await saus(imageLink)
              let teks = ''
              for (let i = 0; i < results.length; i++) {
                  if (results[i].similarity < 80) {
                      teks += `${i}.\n*Link*: ${results[i].url}\n*Site*: ${results[i].site}\n*Author name*: ${results[i].authorName}\n*Author link*: ${results[i].authorUrl}\n*Similarity*: ${results[i].similarity}%\n*Low similarity!*\n\n`
                  } else {
                      teks += `${i}.\n*Link*: ${results[i].url}\n*Site*: ${results[i].site}\n*Author name*: ${results[i].authorName}\n*Author link*: ${results[i].authorUrl}\n*Similarity*: ${results[i].similarity}%\n\n`
                  }
              }
              await client.reply(from, teks, id)
                    .then(() => console.log('Source sent! '))
          } catch (err) {
              console.error(err)
              await client.reply(from, 'Error!', id)
          }
        } else {
          await client.reply(from, ind.wrongFormat(), id)
        }
        break

      case 'waifu':
        const modes = ['sfw', 'nsfw']
        const categories = ['waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'kill', 'slap', 'happy', 'wink', 'poke', 'dance', 'cringe', 'blush', 'trap', 'blowjob']
        const categoriesnsfw = ['waifu', 'neko', 'blowjob']
        var mode,cat;
        const random = Math.floor(Math.random() * categories.length);
        const randomnsfw = Math.floor(Math.random() * categoriesnsfw.length);
        if (modes.includes(arguments[0]) && categories.includes(arguments[1])) {client.reply(from, ind.wait() + `\n\n_Mendapatkan gambar ${arguments[0]} dengan kategori ${arguments[1]}..._`, id)}
        if (arguments[0] === 'nsfw' && !isGroupMsg) {
          client.reply(from, "Baiklah jika itu maumu", id)
          var i = true
        } else if (arguments[0] === 'nsfw' && disablecommand){
          client.reply(from, "Fitur dimatikan sementara, tobat cok ", id)
          await client.sendStickerfromUrl(from, 'https://i.ibb.co/8nZFsY9/ghyastobat.png')
          return 0
        }
        if (arguments.length == 0){ 
          client.reply(from, ind.wait() + `\n\n_Mendapatkan gambar random..._`, id)
          mode = "sfw"
          cat = categories[random]
        } else {
          mode = arguments[0]
          cat = arguments[1]
        }
        if (arguments.length == 1){
          if (arguments[0] === 'sfw'){
            client.reply(from, ind.wait() + `\n\n_Mendapatkan gambar sfw random..._`, id)
            mode = "sfw"
            cat = categories[random]
          } else if (arguments[0] === 'nsfw'){ 
            var i = true 
            mode = 'nsfw'
            cat = categoriesnsfw[randomnsfw]
          }
        }
        if (arguments[0] === 'help' && arguments.length == 1 && disablecommand) return await client.reply(from, ind.waifu(), id)
        if (arguments[0] === 'help' && arguments.length == 1) return await client.reply(from, ind.waifuex(), id)
        _function.weeaboo.waifu(mode, cat)
          .then(async ({ url }) => {
            console.log('Waifu image received!')
            if (i == true) {
              await client.sendText(from, `_⚠️Disclaimer⚠️_\n\nPastikan yang melihat ini berumur 18+++++++\nBot Owner tidak bertanggung jawab jika command ini disalahgunakan\n\nTerima kasih`)
            }
            await client.sendFileFromUrl(from, url, 'waifu.png', '')
              .then(() => console.log('Success sending waifu!'))
          })
            .catch(async (err) => {
              console.error(err)
              await client.reply(from, `Error!\nCoba lagi atau Lihat command ${botPrefix}waifu help`, id)
            })
        break

      //Torrent leecher site
      case 'torrent':
        if (arguments.length === 0) return await client.reply(from, ind.torrent(), id)
        if (arguments[0] == 'list'){
          const torrentlist = _function.torrent.list()
            .then(async ({ torrents }) => {
              let list = '-----[ *Daftar Torrent* ]-----'
              for (let i = 0; i < torrents.length; i++) {
                  list +=  `\n\n➸ *Nama*: ${torrents[i].name}\n➸ *Status*: ${torrents[i].status}\n➸ *Link Magnet*: ${torrents[i].magnetURI}\n➸ *Kecepatan*: ${torrents[i].speed}\n➸ *Ukuran*: ${torrents[i].downloaded} / ${torrents[i].total}\n➸ *Link Download*: ${torrents[i].downloadLink}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
              }
              await client.reply(from, list, id)
              //console.log('Success sending Torrent List info!')
            })
        } else if(arguments[0] == 'status'){
          if (arguments[1] == null) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}torrent status <link magnet>_`, id)
          const torrentstatus = _function.torrent.status(arguments[1]).then(async ({ status }) => {
            if (status == null) return await client.reply(from, '_⛔ Status torrent tidak ditemukan!_', id)
            console.log(status)
            let statusinfo = `➸ *Nama*: ${status.name}\n➸ *Status*: ${status.status}\n➸ *Link Magnet*: ${status.magnetURI}\n➸ *Kecepatan*: ${status.speed}\n➸ *Ukuran*: ${status.downloaded} / ${status.total}➸ *Link Download*: ${status.downloadLink}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
            await client.reply(from, statusinfo, id)
          })
        } else if(arguments[0] == 'download'){
          if (arguments[1] == null) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}torrent download <link magnet>_`, id)
          const torrentdownload = _function.torrent.download(arguments[1])
            .then(async ({error, errorMessage}) => {
              console.log(error)
              if (error) {
                await client.reply(from,`_Error !_\nMessage:${errorMessage}`, id)
              } else {
                await client.reply(from,`_Torrent berhasil ditambahkan!_`, id)          
              }
            })
        } else if(arguments[0] == 'remove'){
          if (arguments[1] == null) return await client.reply(from, `_⚠️ Contoh Penggunaan Perintah : ${botPrefix}torrent remove <link magnet>_`, id)
          const torrentremove = _function.torrent.remove(arguments[1])
            .then(async ({error, errorMessage}) => {
              console.log(error)
              if (error) {
                await client.reply(from,`_Error !_\nMessage:${errorMessage}`, id)
              } else {
                await client.reply(from,`_Torrent berhasil dihapus!_`, id)        
              }
            })
        } else return await client.reply(from, ind.torrent(), id)
        break

      //debugging button
      case 'buttontest':
        await client.sendButtons(from, "Button variable passing testing", [
          {
            id: `test1 ${q}`,
            text: "Test 1"
          },{
            id: "test2",
            text: "Test 2"
          }
        ], "Button Test")
      break

      default:
        let matching = closestMatch(command, _txt.menulist);
        client.reply(from, `Salah command, Mungkin maksud anda _*${botPrefix}${matching}*_ ?`, id)
        return console.debug(color('red', '➜'), color('yellow', isGroup ? '[GROUP]' : '[PERSONAL]'), `${botPrefix}${command} | ${sender.id} ${isGroup ? 'FROM ' + formattedTitle : ''}`, color('yellow', moment().format()));
    }

    return;
  } catch (err) {
    client.sendText(from, 'Syid, Client error!\n\nTolong hubungi owner beserta error log')
    client.sendText(from, `error log\n\n${err}`)
    console.log(err);
  }
};
