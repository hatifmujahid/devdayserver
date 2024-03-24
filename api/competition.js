const getCompetitionID = (competition) => {
    for (let i = 0; i < csCompetitions.length; i++) {
        if (csCompetitions[i].hasOwnProperty(competition)) {
            return csCompetitions[i][competition];
        }
    }

    for (let i = 0; i < generalCompetitions.length; i++) {
        if (generalCompetitions[i].hasOwnProperty(competition)) {
            return generalCompetitions[i][competition];
        }
    }

    for (let i = 0; i < roboticsCompetitions.length; i++) {
        if (roboticsCompetitions[i].hasOwnProperty(competition)) {
            return roboticsCompetitions[i][competition];
        }
    }

    return null;
}

const csCompetitions = [{
    'Capture The Flag': 'CS01',
    'Speed Programming': 'CS02',
    'Database Design': 'CS03',
    'Code in the Dark': 'CS04',
    'PsuedoWar': 'CS05',
    'Speed Debugging': 'CS06',
    'UI/UX': 'CS07',
    'Data Visualization': 'CS08',
    'Web Development': 'CS09',
    'Data Science': 'CS10',
    'App Development': 'CS11',
    'SyncOS': 'CS12',
}]

const generalCompetitions = [{
    'Photography': 'G01',
    'Reels competition': 'G02',
    'Board games': 'G03',
    'Sketching': 'G04',
    'Podium game': 'G05',
    'Scavenger hunt': 'G06',
    'FSX': 'G07',
    'Battlestation': 'G08',
}]

const roboticsCompetitions = [
    {
        'Line Following Robot (LFR) Competition': 'R01',
        'Robo Soccer Competition': 'R02',
        // Add more robotics competitions here as needed
    }
];

module.exports = { getCompetitionID }
