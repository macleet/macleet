// API
// Fixtures
// Teams
// Leagues (EPL)
// Odds (pre-match and in-play)
// Standings
// Players
// Statistics (of fixture)
// Injuries
// Coaches

// cost == 100million pounds
// free transfer every week

// Points system
// https://www.premierleague.com/news/2174909
// https://www.premierleague.com/news/106533

// EPL 22/23 id = 871 (V3)

// What this app will do:
// *1: Make FPL teams according to current form and past performance
    // Captaincy
    // Point system
    // Form
    // Stats
    // Wildcard
    // bench boost
    // Triple captain
    // Injury
    // Suspension
    // Starting 11
    // Standings
// *2: Player database search for player statistics
    // Compare players
// *3: Fixture tracker (with difficulty relative to each team)
    // Lineup
    // Odds
    // Fixture difficulty
// 4: Statistics and projections
    // of players and teams
// 5. Transfer and injury news (web scrape?)
// 6. Statistic visualization


// 15 players
// 2 keep
// 5 def
// 5 mids
// 3 att


// Tips:
// No need for two expensive goalkeepers 
// Have a strong bench
// Beat a price rise (price rise as popularity rises)
// Bargain players (not good form now)
// Set piece takers
// Captain selection
// Form and consistency
// Injuries and suspensions
// One good game <<< consistency
// Double gameweeks
// Undervalue picks
// Study current top FPL managers

// Player stats to looks at:
// Price
// Goals for
// Assists
// Clean sheets
// Minutes played (avg)
// Shots on target
// xG xA
// Chances created
// Goal involvement
// Team form
// Fixture difficulty
// Historical performance
// Other player comparison

// Goal of game is to get most points
// Attack points

// Midfield points

// Defense points

'use strict';

class TeamSelection {
    constructor() {
        this.container = this.createTeamSelectionContainer();
    }

    createTeamSelectionContainer() {
        // Team selection container
        const container = document.createElement('div');
        container.classList.add('team-selection-container');
        container.classList.add('feature-container');

        // Player search container
        const playerSearchDiv = document.createElement('div');
        playerSearchDiv.classList.add('player-search');

        // Search div
        const searchDiv = document.createElement('div');
        searchDiv.classList.add('search-field');

        // Player search header
        const heading = document.createElement('h3');
        heading.textContent = 'Team Selection';

        // Search input
        const searchBar = document.createElement('input');
        searchBar.type = 'text';
        searchBar.placeholder = 'Search a player...';
        searchBar.addEventListener('keydown', event => {
            if (event.key !== 'Enter') { return; }


        });
        const searchButton = document.createElement('button');
        const searchIcon = document.createElement('i');
        searchIcon.classList.add('fa-solid', 'fa-magnifying-glass', 'fa-lg');
        searchButton.append(searchIcon);    

        searchDiv.append(searchBar, searchButton);
        playerSearchDiv.append(heading, searchDiv);

        // Team container
        const teamDiv = document.createElement('div');
        teamDiv.classList.add('team');

        // Starting 11 container
        const startingContainer = document.createElement('div');
        startingContainer.classList.add('starting-container');

        const soccerLinesImg = document.createElement('img'); // Soccer lines background image for team container div
        soccerLinesImg.src = '../../images/soccer-lines.png';
        soccerLinesImg.id = 'soccer-lines-image';
        startingContainer.append(soccerLinesImg);

        const defendersContainer = document.createElement('div');  // Defenders container
        defendersContainer.classList.add('defenders-container');

        const midfieldersContainer = document.createElement('div');  // Midfielders container
        midfieldersContainer.classList.add('midfielders-container');

        const forwardsContainer = document.createElement('div');  // Forwards container
        forwardsContainer.classList.add('forwards-container');

        startingContainer.append(defendersContainer, midfieldersContainer, forwardsContainer);

        // Substitutes container
        const subsContainer = document.createElement('div');
        subsContainer.classList.add('subs-container');

        // Appends to assemble team selection feature container
        teamDiv.append(startingContainer, subsContainer);
        container.append(playerSearchDiv, teamDiv);

        return container;
    }

    submitSearch() {
        
    }
}

class FPLTracker {
    constructor() {
        this.teamSelection = new TeamSelection();
        // this.teamSelectionContainer

        // Features containers
        this.landingContainer = document.querySelector('.landing-container');

        this.playerStatsContainer = document.createElement('div');
        this.playerStatsContainer.classList.add('player-stats-container');
        this.playerStatsContainer.classList.add('feature-container');

        this.upcomingFixturesContainer = document.createElement('div');
        this.upcomingFixturesContainer.classList.add('upcoming-fixtures-container');
        this.upcomingFixturesContainer.classList.add('feature-container');

        // Current feature context
        this.currentFeature = this.landingContainer;

        this.setUpEventListeners();
    }

    switchToContainer(newCurrentFeature, buttonClicked) {
        if (this.currentFeature === newCurrentFeature) { return; }

        document.querySelector('#project-container').replaceChild(newCurrentFeature, this.currentFeature);
        this.currentFeature = newCurrentFeature;

        document.querySelectorAll('#project-header button').forEach(button => button.classList.remove('current-button'));
        if (newCurrentFeature === this.landingContainer) { return; }
        buttonClicked.classList.add('current-button');
    }

    setUpEventListeners() {
        document.querySelector('#project-container h2').addEventListener('click', event => this.switchToContainer(this.landingContainer, event.target));
        document.querySelector('#team-selection-button').addEventListener('click', event => this.switchToContainer(this.teamSelection.container, event.target));
        document.querySelector('#player-stats-button').addEventListener('click', event => this.switchToContainer(this.playerStatsContainer, event.target));
        document.querySelector('#upcoming-fixtures-button').addEventListener('click', event => this.switchToContainer(this.upcomingFixturesContainer, event.target));
    }

}

const fplTracker = new FPLTracker();