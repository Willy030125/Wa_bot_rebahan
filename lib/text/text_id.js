const prefix = require('../../settings').prefix;

const menulist = ['kickall', 'add', 'kick','promote', 'demote', 'revoke', 'link', 'silent', 'ping', 'jodohku', 'groupstats', 'kickme', 'mystats', 'pick', 'vote', 'pollresult', 'addvote', 'addv', 'addpoll', 'menu', 'rules', 'info', 'faq', 'support', 'jadwalsholat', 'quransurah', 'quranayat', 'murrotal', 'tafsir', 'voice', 'makequote', 'mirip', 'gay', 'bucin', 'cat', 'dog', 'meme', 'roll', 'imagequote', 'jodoh', 'santet', 'brainly', 'wiki', 'translate', 'sticker', 'gifsticker', 'giphysticker', 'stikerteks', 'join', 'weather', 'movie', 'contact', 'resi', 'reminder', 'music', 'lirik', 'short', 'covid', 'infohoax', 'ping', 'fb', 'profil', 'unblock', 'leaveall', 'clearall', 'bc', 'ban', 'getses', 'run', 'tambahtugas', 'listtugas', 'hapustugas', 'spam', 'loginvr', 'loginml', 'logingta', 'loginamong', 'loginmc', 'addjudullist', 'addlist', 'hapuslist', 'resetlist', 'outputlist', 'anime', 'neko', 'animewall', 'kusonime', 'traceanime', 'sauce', 'waifu', 'halo', 'asep', 'tabah', 'lutelat', 'bayu', 'payoy', 'teja', 'indihome', 'palpale', 'yamete', 'papepap', 'prank', 'anjing', 'bangsat', 'cangkul', 'goblok', 'otak', 'sange', 'failed']

const menu = [`
*LuiiBot*

*📖 --Perintah Group-- 📖*

⌖ *${prefix}kickall*
⌖ *${prefix}add* [62812...]
⌖ *${prefix}kick* [@mention]
⌖ *${prefix}promote* [@mention]
⌖ *${prefix}demote* [@mention]
⌖ *${prefix}revoke*
⌖ *${prefix}link*
⌖ *${prefix}silent* [on|off]

⌖ *${prefix}ping*
⌖ *${prefix}jodohku*
⌖ *${prefix}groupstats*
⌖ *${prefix}kickme*
⌖ *${prefix}mystats*
⌖ *${prefix}pick* [Orang Ganteng]

⌖ *${prefix}vote*
⌖ *${prefix}pollresult*
⌖ *${prefix}addvote*
⌖ *${prefix}addv*
⌖ *${prefix}addpoll*
`, `
*📖 Perintah Umum 📖*

⌖ *${prefix}menu [all]*
⌖ *${prefix}rules*
⌖ *${prefix}info*
⌖ *${prefix}faq*
⌖ *${prefix}support*
`, `
*📖 Perintah Muslim 📖*
`, `
⌖ *${prefix}jadwalsholat* [Kota]
⌖ *${prefix}quransurah* [Surah]
⌖ *${prefix}quranayat* [Surah] [Ayat]
⌖ *${prefix}murottal* [Ayat] [Surat]
⌖ *${prefix}tafsir* [Ayat] [Surat]
`,`
*📖 Perintah Fun 📖*

⌖ *${prefix}voice* [Teks]
⌖ *${prefix}makequote* [nama@kalimat]
⌖ *${prefix}mirip* [nama seseorang]
⌖ *${prefix}gay* [nama seseorang]
⌖ *${prefix}bucin*
⌖ *${prefix}cat*
⌖ *${prefix}dog*
⌖ *${prefix}meme*
⌖ *${prefix}roll*
⌖ *${prefix}imagequote*
⌖ *${prefix}jodoh* [nama&nama]
⌖ *${prefix}santet* [tag orang] | [alasan]
`,`
*📖 Perintah Edukasi 📖*

⌖ *${prefix}brainly* [pertanyaan]
⌖ *${prefix}wiki* [query]
⌖ *${prefix}translate*
`,`
*📖 Perintah Stiker 📖*

⌖ *${prefix}sticker*
⌖ *${prefix}gifsticker*
⌖ *${prefix}giphysticker* [giphy url]
⌖ *${prefix}stikerteks* [Kalimat]
`,`
*📖 Perintah Lainnya 📖*

⌖ *${prefix}join* [Group Link]
⌖ *${prefix}weather* [Kota]
⌖ *${prefix}movie* [Judul]
⌖ *${prefix}contact*
⌖ *${prefix}resi* [Kurir] [Nomor resi]
⌖ *${prefix}reminder*
⌖ *${prefix}music* [Judul] / [link]
⌖ *${prefix}lirik* [Judul]
⌖ *${prefix}short* [URL]
⌖ *${prefix}covid* [Negara]
⌖ *${prefix}infohoax*
⌖ *${prefix}ping*
⌖ *${prefix}fb* [Link fb]
⌖ *${prefix}profil*
`,`
*📖 Perintah Bot Owner/Admin 📖*

⌖ *${prefix}unblock*
⌖ *${prefix}leaveall*
⌖ *${prefix}clearall*
⌖ *${prefix}bc*
⌖ *${prefix}ban*
⌖ *${prefix}getses*
`,`
*📖 Perintah Koding 📖*
⌖ *${prefix}run* languages
⌖ *${prefix}run* [code]
`,`
*📖 Perintah Tugas 📖*
⌖ *${prefix}tambahtugas*
⌖ *${prefix}listtugas*
⌖ *${prefix}hapustugas*
`,`
*📖 Perintah mention 📖*
⌖ *${prefix}spam*
⌖ *${prefix}loginvr*
⌖ *${prefix}loginml*
⌖ *${prefix}logingta*
⌖ *${prefix}loginamong*
⌖ *${prefix}loginmc*
`,`
*📖 Perintah Daftar 📖*
⌖ *${prefix}addjudulist* | [judul]
⌖ *${prefix}addlist* | [isi list]
⌖ *${prefix}hapuslist* [nomor list]
⌖ *${prefix}resetlist*
⌖ *${prefix}outputlist*
`,`
*📖 Perintah Torrent Leecher 📖*
⌖ *${prefix}torrent* 
⌖ *${prefix}torrent list* 
⌖ *${prefix}torrent download* [magnet_link]
⌖ *${prefix}torrent remove* [magnet_link]
⌖ *${prefix}torrent status* [magnet_link]
`,`

*📖 Wibu Area 📖*
⌖ *${prefix}anime* [Judul]
⌖ *${prefix}neko*
⌖ *${prefix}animewall*
⌖ *${prefix}kusonime* [judul anime]
⌖ *${prefix}traceanime*
⌖ *${prefix}sauce*
⌖ *${prefix}waifu* _help_
⌖ *${prefix}animesticker*
`,`
*📖 Preloaded Media 📖*
*${prefix}halo*, *${prefix}asep*, *${prefix}tabah*, *${prefix}lutelat*, *${prefix}bayu*, *${prefix}payoy*, *${prefix}teja*, *${prefix}indihome*, *${prefix}palpale*, *${prefix}yamete*, *${prefix}papepap*, *${prefix}prank*, *${prefix}anjing*, *${prefix}bangsat*, *${prefix}cangkul*, *${prefix}goblok*, *${prefix}otak*, *${prefix}sange*, *${prefix}failed*
`];

const rules = `
*📖 Rules/Peraturan Pemakaian Bot 📖*

⌖ Seluruh Tanggung Jawab diserahkan kepada pengguna
⌖ Gunakan Bot seperlunya saja, Jangan di gunakan sebagai alat untuk SPAM
⌖ Jangan sesekali menelpon Bot

`;

const donate = `
*📖 Donasi Bot 📖*

⌖ Saweria https://bit.ly/3rFdnrE
⌖ Trakteer https://bit.ly/2KJTKOj

Donasi kalian sangat bermanfaat untuk Developer mengembangkan Bot.
`;

const source = `
*📖 Source Code 📖*

Source code bot ini
⌖ https://bit.ly/2L0WgiY
`;

const info = `
*📖 Informasi 📖*

New Update
⌖ - 

_*Catatan :*_ Bot sedang dalam masa perbaikan dan penyempurnaan.
`;

const faq = `
*📖 Frequently Asked Questions 📖*

⌖ *Bagaimana cara menggunakan Bot ?*
― Kirim pesan dengan menggunakan *${prefix}* diawal perintah ke personal pesan Bot atau ke Grup yang didalamnya terdapat Bot

⌖ *Apa saja yang dapat dilakukan oleh Bot ?*
― Pengguna dapat melihat perintah-perintah apa saja yang dapat dilakukan oleh Bot dengan mengirimkan pesan perintah *${prefix}*menu

`;

module.exports = { menu, donate, rules, source, info, faq, menulist };
