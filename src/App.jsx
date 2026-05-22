import React, { useState, useEffect } from 'react';
import './App.css';
import { TOURNAMENT_TYPES, generateLeagueMatches, calculateStandings } from './utils/tournamentLogic';

function App() {
  const createId = () => {
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  };

  const loadState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem('liga-dos-brabos');
      if (saved) {
        const data = JSON.parse(saved);
        if (data[key] !== undefined) {
          const val = data[key];
          // Perform basic type and structure validation
          if (key === 'players') {
            if (Array.isArray(val) && val.every(p => p && typeof p === 'object' && 'id' in p && 'name' in p)) {
              return val;
            }
            return defaultValue;
          }
          if (key === 'matches') {
            if (Array.isArray(val) && val.every(m => m && typeof m === 'object' && 'id' in m)) {
              return val;
            }
            return defaultValue;
          }
          if (key === 'hasFinal' || key === 'isDoubleRound') {
            return typeof val === 'boolean' ? val : defaultValue;
          }
          if (key === 'type') {
            return Object.values(TOURNAMENT_TYPES).includes(val) ? val : defaultValue;
          }
          return val;
        }
      }
    } catch {
      return defaultValue;
    }
    return defaultValue;
  };

  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem('liga-dos-brabos');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.matches?.some(m => m.isFinal)) return 'final';
        if (data.matches?.length > 0) return 'tournament';
      }
    } catch {
      return 'setup';
    }
    return 'setup';
  });
  const [tournamentType] = useState(() => loadState('type', TOURNAMENT_TYPES.LEAGUE));
  const [hasFinal, setHasFinal] = useState(() => loadState('hasFinal', false));
  const [isDoubleRound, setIsDoubleRound] = useState(() => loadState('isDoubleRound', false));
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState(() => loadState('players', []));
  const [matches, setMatches] = useState(() => loadState('matches', []));

  useEffect(() => {
    localStorage.setItem('liga-dos-brabos', JSON.stringify({ players, matches, type: tournamentType, hasFinal, isDoubleRound }));
  }, [players, matches, tournamentType, hasFinal, isDoubleRound]);

  const addPlayer = () => {
    const trimmedName = playerName.trim();
    if (trimmedName) {
      if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
        return alert('Já existe um jogador/time com este nome!');
      }
      setPlayers([...players, { id: createId(), name: trimmedName }]);
      setPlayerName('');
    }
  };

  const handleAddPlayerSubmit = (e) => {
    e.preventDefault();
    addPlayer();
  };

  const startTournament = () => {
    if (players.length < 2) return alert('Adicione pelo menos 2 jogadores!');
    const generated = generateLeagueMatches(players, isDoubleRound);
    setMatches(generated);
    setView('tournament');
  };

  const updateScore = (matchId, side, score) => {
    const val = score === '' ? null : Math.max(0, parseInt(score) || 0);
    setMatches(matches.map(m => {
      if (m.id === matchId) {
        const updated = { ...m, [side]: val };
        updated.played = updated.homeScore !== null && updated.awayScore !== null;
        return updated;
      }
      return m;
    }));
  };

  const generateFinal = () => {
    const standings = calculateStandings(players, matches.filter(m => !m.isFinal));
    if (standings.length >= 2) {
      const finalMatch = {
        id: `final-${createId()}`,
        round: 'Final',
        home: standings[0].name,
        away: standings[1].name,
        homeScore: null,
        awayScore: null,
        played: false,
        isFinal: true
      };
      setMatches([...matches, finalMatch]);
      setView('final');
    }
  };

  const resetTournament = () => {
    if (confirm('Tem certeza que deseja reiniciar o campeonato?')) {
      const keepPlayers = confirm('Deseja manter os nomes dos jogadores/times atuais?');
      if (keepPlayers) {
        setMatches([]);
        setView('setup');
      } else {
        setPlayers([]);
        setMatches([]);
        setView('setup');
        localStorage.removeItem('liga-dos-brabos');
      }
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Liga dos <span>Brabos</span></h1>
      </header>

      {view === 'setup' && (
        <section className="glass setup-box">
          <h2>Novo Campeonato</h2>
          <form className="input-group" onSubmit={handleAddPlayerSubmit}>
            <input
              type="text"
              placeholder="Nome do Jogador/Time"
              value={playerName}
              maxLength={30}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button type="submit" className="btn-primary">Adicionar</button>
          </form>

          <div className="player-list">
            {players.map(p => (
              <div key={p.id} className="player-tag">
                {p.name}
                <button onClick={() => setPlayers(players.filter(pl => pl.id !== p.id))}>×</button>
              </div>
            ))}
          </div>

          {players.length >= 2 && (
            <div className="start-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', justifyContent: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isDoubleRound} 
                  onChange={(e) => setIsDoubleRound(e.target.checked)} 
                />
                Jogos de Ida e Volta
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', justifyContent: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={hasFinal} 
                  onChange={(e) => setHasFinal(e.target.checked)} 
                />
                Ter Final (1º vs 2º colocado)
              </label>
              <button className="btn-start btn-primary" onClick={startTournament}>
                Iniciar Pontos Corridos
              </button>
            </div>
          )}
        </section>
      )}

      {view === 'tournament' && (
        <section className="matches-view">
          <div className="nav-controls">
            <button className="btn-secondary" onClick={() => setView('standings')}>Ver Tabela</button>
            {hasFinal && matches.filter(m => !m.isFinal).every(m => m.played) && !matches.some(m => m.isFinal) && (
              <button className="btn-primary" onClick={generateFinal}>Gerar Final (1º vs 2º)</button>
            )}
            {hasFinal && matches.some(m => m.isFinal) && (
              <button className="btn-primary" style={{ background: 'gold', color: '#000', borderColor: 'gold' }} onClick={() => setView('final')}>🏆 Ir para Final</button>
            )}
            <button className="btn-danger" onClick={resetTournament}>Reiniciar</button>
          </div>

          <div className="matches-grid">
            {matches.filter(m => !m.isFinal).map(m => (
              <div key={m.id} className="glass match-card">
                <div className="round-badge">Rodada {m.round}</div>
                <div className="match-teams">
                  <div className="team">
                    <span>{m.home}</span>
                    <input
                      type="number"
                      value={m.homeScore ?? ''}
                      onChange={(e) => updateScore(m.id, 'homeScore', e.target.value)}
                    />
                  </div>
                  <div className="vs">VS</div>
                  <div className="team">
                    <input
                      type="number"
                      value={m.awayScore ?? ''}
                      onChange={(e) => updateScore(m.id, 'awayScore', e.target.value)}
                    />
                    <span>{m.away}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === 'standings' && (
        <section className="standings-view glass">
          <div className="nav-controls">
            <button className="btn-secondary" onClick={() => setView('tournament')}>Voltar para Jogos</button>
            {hasFinal && matches.some(m => m.isFinal) && (
              <button className="btn-primary" style={{ background: 'gold', color: '#000', borderColor: 'gold' }} onClick={() => setView('final')}>🏆 Ir para Final</button>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>Pos</th>
                <th className="text-left">Time</th>
                <th>P</th>
                <th>J</th>
                <th>V</th>
                <th>E</th>
                <th>D</th>
                <th>GP</th>
                <th>GC</th>
                <th>SG</th>
              </tr>
            </thead>
            <tbody>
              {calculateStandings(players, matches.filter(m => !m.isFinal)).map((s, i) => (
                <tr key={s.name}>
                  <td>{i + 1}º</td>
                  <td className="text-left">{s.name}</td>
                  <td className="points">{s.points}</td>
                  <td>{s.played}</td>
                  <td>{s.wins}</td>
                  <td>{s.draws}</td>
                  <td>{s.losses}</td>
                  <td>{s.goalsFor}</td>
                  <td>{s.goalsAgainst}</td>
                  <td>{s.goalsDiff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {view === 'final' && matches.some(m => m.isFinal) && (
        <section className="final-view glass">
          <div className="nav-controls">
            <button className="btn-secondary" onClick={() => setView('tournament')}>Ver Todos os Jogos</button>
            <button className="btn-secondary" onClick={() => setView('standings')}>Ver Tabela</button>
            <button className="btn-danger" onClick={resetTournament}>Reiniciar</button>
          </div>
          
          <div className="final-container">
            <h2 className="final-title">🏆 GRANDE FINAL 🏆</h2>
            {matches.filter(m => m.isFinal).map(m => (
              <div key={m.id} className="final-card glass">
                <div className="match-teams final-teams">
                  <div className="team">
                    <span className="team-name">{m.home}</span>
                    <input
                      type="number"
                      className="final-score-input"
                      value={m.homeScore ?? ''}
                      onChange={(e) => updateScore(m.id, 'homeScore', e.target.value)}
                    />
                  </div>
                  <div className="vs final-vs">X</div>
                  <div className="team">
                    <input
                      type="number"
                      className="final-score-input"
                      value={m.awayScore ?? ''}
                      onChange={(e) => updateScore(m.id, 'awayScore', e.target.value)}
                    />
                    <span className="team-name">{m.away}</span>
                  </div>
                </div>
                {m.played && m.homeScore !== m.awayScore && (
                  <div className="champion-announcement">
                    🎉 CAMPEÃO: {m.homeScore > m.awayScore ? m.home : m.away} 🎉
                  </div>
                )}
                {m.played && m.homeScore === m.awayScore && (
                  <div className="champion-announcement draw">
                    Empate! (Decidam nos pênaltis e atualizem o placar final)
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
