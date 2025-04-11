import React, { useState } from 'react';
import matchData from './assets/matchData.json';
import playerStats from './assets/playerStats.json';
import './App.css';
import './index.css';

const App = () => {
  const players = Object.keys(playerStats).map((player) => {
    const { cups, leagues } = playerStats[player];
    return { name: player, cups, leagues, matches: matchData[player] };
  });

  const [tooltip, setTooltip] = useState({ visible: false, player: null, position: { x: 0, y: 0 }, positionType: 'bottom' });

  const calculateTotalPoints = (cups, leagues) => cups * 3 + leagues * 7;

  const sortedPlayers = [...players].sort(
    (a, b) => calculateTotalPoints(b.cups, b.leagues) - calculateTotalPoints(a.cups, a.leagues)
  );

  const handleMouseEnter = (player, event) => {
    const rect = event.target.getBoundingClientRect();
    const positionType = rect.bottom + 250 > window.innerHeight ? 'top' : rect.top - 150 < 0 ? 'bottom' : 'bottom';
    const yPosition = positionType === 'top' ? rect.top - 10 : rect.bottom + 10;
    setTooltip({
      visible: true,
      player,
      position: {
        x: rect.left + 10, // Adjusted to align horizontally
        y: yPosition,
      },
      positionType,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, player: null, position: { x: 0, y: 0 }, positionType: 'bottom' });
  };

  const calculatePercentages = (data) => {
    const total = data.V + data.E + data.D;
    if (total === 0) {
      return { V: "0", E: "0", D: "0" };
    }
    return {
      V: ((data.V / total) * 100).toFixed(1),
      E: ((data.E / total) * 100).toFixed(1),
      D: ((data.D / total) * 100).toFixed(1),
    };
  };

  return (
    <div className="App">
      <header className="header">
        <img
          src="/maffia.jpeg"
          alt="Header"
          className="header-image"
        />
        <h1>La maffia </h1>
      </header>
      <main className="main-content">
        <table className="players-table">
          <thead>
            <tr>
              <th>🎮</th>
              <th>Copas 🏆</th>
              <th>Ligas 🎖️</th>
              <th>Puntos 📊</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => (
              <tr key={player.name}>
                <td
                  onMouseEnter={(e) => handleMouseEnter(player.name, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {player.name}
                </td>
                <td>{player.cups}</td>
                <td>{player.leagues}</td>
                <td>{calculateTotalPoints(player.cups, player.leagues)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tooltip.visible && (
          <div
            className="tooltip"
            style={{ top: tooltip.position.y, left: tooltip.position.x }}
            data-position={tooltip.positionType}
          >
            <h4>Historial {tooltip.player} vs:</h4>
            <table>
              <thead>
                <tr>
                  <th>Rival</th>
                  <th>V (%)</th>
                  <th>E (%)</th>
                  <th>D (%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(matchData[tooltip.player]).map(
                  ([opponent, data]) => {
                    const percentages = calculatePercentages(data);
                    return (
                      <tr key={opponent}>
                        <td>{opponent}</td>
                        <td className="victory">{percentages.V}%</td>
                        <td className="draw">{percentages.E}%</td>
                        <td className="defeat">{percentages.D}%</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
