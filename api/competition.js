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

const getBill = (competition) => {
    let bill = 0;
    for (let i = 0; i < csCompetitions.length; i++) {
        if (csCompetitions[i].id === competition) {
            bill = csCompetitions[i].price;
        }
    }

    for (let i = 0; i < generalCompetitions.length; i++) {
        if (generalCompetitions[i].id === competition) {
            bill = generalCompetitions[i].price;
        }
    }

    for (let i = 0; i < roboticsCompetitions.length; i++) {
        if (roboticsCompetitions[i].id === competition) {
            bill = roboticsCompetitions[i].price;
        }
    }

    for (let i = 0; i < esports.length; i++) {
        if (esports[i].id === competition) {
            bill = esports[i].price;
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
        maxEntry: 80,
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
    price: 1000
}, {
    name: 'Reels competition',
    id: 'G21',
    maxEntry: 50,
    minMembers: 1,
    maxMembers: 2,
    price: 1000
}, {
    name: 'Board games',
    id: 'G22',
    maxEntry: 35,
    minMembers: 1,
    maxMembers: 1,
    price: 1000
},
{
    name: 'Scavenger hunt',
    id: 'G23',
    maxEntry: 30,
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
    price: 1000
},
{
    name: 'Podium game',
    id: 'G25',
    maxEntry: 40,
    minMembers: 1,
    maxMembers: 2,
    price: 1000
},
{
    name: 'Fast Stock Exchange',
    id: 'G26',
    maxEntry: 20,
    minMembers: 1,
    maxMembers: 2,
    price: 1000
},
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
        name: 'C40',
        id: 'ES01',
        maxEntry: 8,
        minMembers: 1,
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

    return id;
}

module.exports = { getCompetitionDetails, getCsComp, getGenComp, getRoboComp, getEsportsComp, getBill, getCompetitionID};
