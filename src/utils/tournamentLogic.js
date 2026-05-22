export const TOURNAMENT_TYPES = {
  LEAGUE: 'Pontos Corridos',
  KNOCKOUT: 'Mata-Mata'
};

export const generateLeagueMatches = (players, doubleRound = false) => {
  const matches = [];
  const n = players.length;
  const tempPlayers = [...players];
  
  if (n % 2 !== 0) tempPlayers.push({ id: 'bye', name: 'Folga' });
  
  const numRounds = tempPlayers.length - 1;
  const matchesPerRound = tempPlayers.length / 2;
  
  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < matchesPerRound; i++) {
      const home = tempPlayers[i];
      const away = tempPlayers[tempPlayers.length - 1 - i];
      
      if (home.id !== 'bye' && away.id !== 'bye') {
        matches.push({
          id: `${round}-${i}`,
          round: round + 1,
          home: home.name,
          away: away.name,
          homeScore: null,
          awayScore: null,
          played: false
        });
      }
    }
    // Rotate players except the first one
    tempPlayers.splice(1, 0, tempPlayers.pop());
  }

  if (doubleRound) {
    const returnMatches = matches.map(m => ({
      ...m,
      id: `${m.id}-return`,
      round: m.round + numRounds,
      home: m.away,
      away: m.home
    }));
    matches.push(...returnMatches);
  }

  return matches;
};

export const calculateStandings = (players, matches) => {
  const standings = players.map(p => ({
    name: p.name,
    points: 0,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalsDiff: 0
  }));

  matches.filter(m => m.played).forEach(m => {
    const home = standings.find(s => s.name === m.home);
    const away = standings.find(s => s.name === m.away);

    if (home && away) {
      home.played++;
      away.played++;
      home.goalsFor += m.homeScore;
      home.goalsAgainst += m.awayScore;
      away.goalsFor += m.awayScore;
      away.goalsAgainst += m.homeScore;

      if (m.homeScore > m.awayScore) {
        home.points += 3;
        home.wins++;
        away.losses++;
      } else if (m.homeScore < m.awayScore) {
        away.points += 3;
        away.wins++;
        home.losses++;
      } else {
        home.points += 1;
        away.points += 1;
        home.draws++;
        away.draws++;
      }
      
      home.goalsDiff = home.goalsFor - home.goalsAgainst;
      away.goalsDiff = away.goalsFor - away.goalsAgainst;
    }
  });

  return standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalsDiff !== a.goalsDiff) return b.goalsDiff - a.goalsDiff;
    return b.goalsFor - a.goalsFor;
  });
};

export const generateKnockoutBrackets = (players) => {
  // Simple knockout: Round of 16, Quarter, Semi, Final
  // For now, let's assume players power of 2 for simplicity
  const matches = [];
  
  // Fisher-Yates Shuffle
  const shuffled = [...players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({
      id: `k-1-${i/2}`,
      round: 1,
      home: shuffled[i].name,
      away: shuffled[i+1] ? shuffled[i+1].name : 'BYE',
      homeScore: null,
      awayScore: null,
      played: false,
      nextMatchId: `k-2-${Math.floor(i/4)}`
    });
  }
  return matches;
};
