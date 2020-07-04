#!/usr/bin/env node

const { displayDownloadLink, displayLatestFileInfo, findAddonByName } = require('./helper');

const argv = require('yargs')
    .option('fileName', { alias: 'n', type: 'string', description: 'Addon File Name' })
    .option('addOnId', { alias: 'i', type: 'string', description: 'Addon ID' })
    .option('searchTerm', { alias: 'k', type: 'string', description: 'Search term for addon' })
    .option('full', { alias: 'f', type: 'boolean', description: 'Get full info about addon the first result' })
    .example('wowaddon-cli -k bigwigs', 'Search for addon named bigwigs')
    .example('wowaddon-cli -k bigwigs -f true', 'Display most recent retail file details and addon Id')
    .example('wowaddon-cli -i 2382 -n BigWigs-v184.2.zip', 'Displays download link for BigWigs Bossmods - id 2382 and filename BigWigs-v184.2.zip')
    .argv;

const { addOnId, fileName, searchTerm, full } = argv;

if (addOnId && fileName)
    displayDownloadLink(fileName, addOnId);

if (full && searchTerm)
    displayLatestFileInfo(searchTerm);

if (searchTerm && !full)
    findAddonByName(searchTerm);