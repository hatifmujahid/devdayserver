const getCompetitionDetails = (competition) => {
    // Check CS Competitions
    for (let i = 0; i < csCompetitions.length; i++) {
        if (csCompetitions[i].hasOwnProperty(competition)) {
            return csCompetitions[i][competition];
        }
    }

    // Check General Competitions
    for (let i = 0; i < generalCompetitions.length; i++) {
        if (generalCompetitions[i].hasOwnProperty(competition)) {
            return generalCompetitions[i][competition];
        }
    }

    // Check Robotics Competitions
    for (let i = 0; i < roboticsCompetitions.length; i++) {
        if (roboticsCompetitions[i].hasOwnProperty(competition)) {
            return roboticsCompetitions[i][competition];
        }
    }
    for (let i = 0; i < esports.length; i++) {
        if (esports[i].hasOwnProperty(competition)) {
            return esports[i][competition];
        }
    }

    return null;
}

const getCsComp = () => {
    return csCompetitions;
}

const getGenComp = () => {
    return generalCompetitions;
}

const getRoboComp = () => {
    return roboticsCompetitions
}

const getEsportsComp = () => {
    return esports
}

const getBill = (competitionName) => {
    let bill = 0;
    const allCompetitions = [...csCompetitions, ...generalCompetitions, ...roboticsCompetitions, ...esports];
    for (let i = 0; i < allCompetitions.length; i++) {
        if (allCompetitions[i].name === competitionName) {
            bill = allCompetitions[i].price;
            break; // Once the competition is found, no need to continue looping
        }
    }
    return bill;
}


const csCompetitions = [
    {
        name: 'Competitive Programming',
        id: 'CS01',
        maxEntry: 50,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'Code Sprint',
        id: 'CS02',
        maxEntry: 102,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'PsuedoWar',
        id: 'CS03',
        maxEntry: 45,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'Speed Debugging',
        id: 'CS04',
        maxEntry: 45,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'Query Quest',
        id: 'CS05',
        maxEntry: 45,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'Code in Dark',
        id: 'CS06',
        maxEntry: 30,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'Data Science',
        id: 'CS07',
        maxEntry: 45,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'AppDev',
        id: 'CS08',
        maxEntry: 15,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'Web Dev',
        id: 'CS09',
        maxEntry: 30,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'UI/UX Design',
        id: 'CS10',
        maxEntry: 20,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'Capture The Flag',
        id: 'CS11',
        maxEntry: 35,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'Data Visualization',
        id: 'CS12',
        maxEntry: 30,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    },
    {
        name: 'SyncOS Challenge',
        id: 'CS13',
        maxEntry: 80,
        minMembers: 1,
        maxMembers: 3,
        price: 1000
    }
];

const generalCompetitions = [{
    name: 'Photography',
    id: 'G20',
    maxEntry: 50,
    minMembers: 1,
    maxMembers: 1,
    price: 500
}, 
{
    name: 'Reels competition',
    id: 'G21',
    maxEntry: 50,
    minMembers: 1,
    maxMembers: 2,
    price: 500
},
{
    name: 'Scavenger hunt',
    id: 'G23',
    maxEntry: 9,
    minMembers: 2,
    maxMembers: 4,
    price: 1200
},
{
    name: 'Sketching Competition',
    id: 'G24',
    maxEntry: 50,
    minMembers: 1,
    maxMembers: 1,
    price: 500
},
{
    name: 'Quiz competition',
    id: 'G25',
    maxEntry: 40,
    minMembers: 1,
    maxMembers: 2,
    price: 500
},
{
    name: 'Fast Stock Exchange',
    id: 'G26',
    maxEntry: 20,
    minMembers: 1,
    maxMembers: 2,
    price: 1000,
},
{
    name: 'Chess',
    id: 'G27',
    maxEntry: 16,
    minMembers: 1,
    maxMembers: 1,
    price: 500
},
{
    name: 'Ludo',
    id: 'G28',
    maxEntry: 20,
    minMembers: 1,
    maxMembers: 2,
    price: 500
},
{
    name: 'Scrabble',
    id: 'G29',
    maxEntry: 10,
    minMembers: 1,
    maxMembers: 1,
    price: 500
}
                             
                             
// Add more general competitions here as needed
];

const roboticsCompetitions = [{
    name: 'Line Following Robot (LFR) Competition',
    id: 'R30',
    maxEntry: 15,
    minMembers: 1,
    maxMembers: 4,
    price: 1500
}, {
    name: 'Robo Soccer Competition',
    id: 'R31',
    maxEntry: 20,
    minMembers: 1,
    maxMembers: 4,
    price: 1500
},
// Add more robotics competitions here as needed
];

const esports = [
    {
        name: 'Counter-Strike 2 (CS2)',
        id: 'ES01',
        maxEntry: 8,
        minMembers: 5,
        maxMembers: 5,
        price: 2500
    }
]

const getCompetitionID = (competition) => {
    let id = '';
    for (let i = 0; i < csCompetitions.length; i++) {
        if (csCompetitions[i].name === competition) {
            id = csCompetitions[i].id;
        }
    }

    for (let i = 0; i < generalCompetitions.length; i++) {
        if (generalCompetitions[i].name === competition) {
            id = generalCompetitions[i].id;
        }
    }

    for (let i = 0; i < roboticsCompetitions.length; i++) {
        if (roboticsCompetitions[i].name === competition) {
            id = roboticsCompetitions[i].id;
        }
    }

    for (let i = 0; i < esports.length; i++) {
        if (esports[i].name === competition) {
            id = esports[i].id;
        }
    }

    return id;
}

module.exports = { getCompetitionDetails, getCsComp, getGenComp, getRoboComp, getEsportsComp, getBill, getCompetitionID};
