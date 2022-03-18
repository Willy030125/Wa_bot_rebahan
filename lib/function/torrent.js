const { fetchJson, fetchText } = require('../../util/fetcher')

const list = async () => {
    return new Promise(async (resolve, reject) => {
        await fetchJson(`https://buat-donlot.herokuapp.com/api/v1/torrent/list`)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    });
  };

  const status = async (link) => {
    return new Promise(async (resolve, reject) => {
        await fetchJson(`https://buat-donlot.herokuapp.com/api/v1/torrent/status?link=${link}`)
            .then((res2) => resolve(res2))
            .catch((err) => reject(err))
    });
  };

  const download = async (link) => {
    return new Promise(async (resolve, reject) => {
        await fetchJson(`https://buat-donlot.herokuapp.com/api/v1/torrent/download?link=${link}`)
            .then((res3) => resolve(res3))
            .catch((err) => reject(err))
    });
  };

  const remove = async (link) => {
    return new Promise(async (resolve, reject) => {
        await fetchJson(`https://buat-donlot.herokuapp.com/api/v1/torrent/remove?link=${link}`)
            .then((res4) => resolve(res4))
            .catch((err) => reject(err))
    });
  };

  module.exports = {
    list,
    download,
    status,
    remove
  };
  