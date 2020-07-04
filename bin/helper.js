const axios = require('axios');

const baseUrl = 'https://addons-ecs.forgesvc.net/api/v2/addon/';

const findAddonByName = (addonName) => {
    let searchPayload = 'search?gameId=1&sort=TotalDownloads&sortDescending=true&searchFilter=' + addonName;

    axios.get(baseUrl + searchPayload).then((response) => {
        if (response.data.length > 0) {
            var count = response.data.length < 10 ? response.data.length : 10;
            for (let i = 0; i < count; i++) {
                console.log(response.data[i].id + ' ' + response.data[i].name);
            }
        } else {
            console.log('No addon with that name was found');
        }
    }).catch((error) => {
        console.log(error);
    });
}

const displayLatestFileInfo = (addonName) => {
    let searchPayload = 'search?gameId=1&sort=TotalDownloads&sortDescending=true&searchFilter=' + addonName;

    axios.get(baseUrl + searchPayload).then((response) => {
        if (response.data.length > 0) {
            let outputList = response.data[0].gameVersionLatestFiles
                .filter(x => x.fileType === 1 && x.gameVersionFlavor === 'wow_retail');

            let message = {
                addonId: response.data[0].id,
                fileDetails: outputList[0],
                description: 'This is the first item in the list of items you searched for.'
            };
            
            console.log(message);
        } else {
            console.log('No addon with that name was found.');
        }
    }).catch((error) => {
        console.log(error);
    });
}

const displayDownloadLink = (filename, id) => {
    axios.get(baseUrl + id + '/files').then((response) => {
        let filteredResponse = response.data.filter(x => x.fileName === filename);
        console.log(filteredResponse[0].downloadUrl);
    }).catch((error) => {
        console.log(error);
    });
}

module.exports = { findAddonByName, displayLatestFileInfo, displayDownloadLink }