import React, { useEffect, useState } from 'react';


function Roster({ id }) {
  const [roster, setRoster] = useState([]);
  const [rost, setRost] = useState([]);

  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/teams/${id}?expand=team.roster`)
    .then(results => {
      return results.json();
    }).then(data => {
      let tRost = data.teams[0].roster.roster;
      teamRoster(tRost);
    })
  },[id]);

  useEffect(()=>{
    getPlayerData();
  },[roster]);

  const teamRoster = data => {
    const rosterNames = data.map(player => (
      {
        name: player.person.fullName,
        id: player.person.id,
        link: player.person.link,
        position: player.position.abbreviation
      }
    ))
    setRoster(rosterNames);
  }

  const getPlayerData = async () => {
    const rostt = [];
    for(let i=0; i<roster.length;i++){
      const response = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${roster[i].id}`, {});
      const json = await response.json(); 
      const person = json.people[0];
      rostt.push({
        id: roster[i].id,
        name: person.fullName,
        number: person.primaryNumber,
        height: '',
        weight: person.weight,
        shoots: person.shootsCatches,
        position: person.primaryPosition.code,
        dob: person.birthDate,
        pob: person.birthCity + ', ' + person.birthCountry,
        display: false,
        fetch: false,
        data: {}
/*           goals: 0,
          assists: 0,
          pim: 0,
          shots: 0,
          games: 0,
          ppg: 0,
          gwg: 0,
          otg: 0,
          shg: 0,
          blocked: 0,
          pm: 0,
          points: 0 */
      });
    }
    setRost(rostt);
  }

  const changeDisplay = async id => {
    console.log(id);
    for(let i=0; i < rost.length; i++){
      if(rost[i].hasOwnProperty('id') && rost[i].id === id) {
        let nArr = [...rost.slice(0,i),...rost.slice(i+1)];
        rost[i].display = !rost[i].display;
        if(!rost[i].fetch) {
          rost[i].fetch = true;
          const response = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${id}/stats/?stats=statsSingleSeason&season=20192020`, {});
          const json = await response.json(); 
          const player = json.stats[0].splits;
          if(player.length > 0) {
/*             rost[i].data = {
              goals: player[0].stat.goals,
              assists: player[0].stat.assists,
              pim: player[0].stat.pim,
              shots: player[0].stat.shots,
              games: player[0].stat.games,
              ppg: player[0].stat.powerPlayGoals,
              gwg: player[0].stat.gameWinningGoals,
              otg: player[0].stat.overTimeGoals,
              shg: player[0].stat.shotHandedGoals,
              blocked: player[0].stat.blocked,
              pm: player[0].stat.plusMinus,
              points: player[0].stat.points
            } */
            rost[i].data = player[0].stat;
          }

        }
        nArr.splice(i, 0, rost[i]);
        setRost(nArr);
      }
    }
  }


  return(
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>#</th>
            <th>Height</th>
            <th>Weight (lbs)</th>
            <th>Shoots</th>
            <th>Position</th>
            <th>Date of Birth</th>
            <th>Place of Birth</th>
          </tr>
        </thead>
        <tbody>
        {rost.map((player,key) =>(
          <React.Fragment key={key}>
            <tr key={key} onClick={() => changeDisplay(player.id)}> 
              <td className="left">{player.name}</td>
              <td>{player.number}</td>
              <td>{player.height}</td>
              <td>{player.weight}</td>
              <td>{player.shoots}</td>
              <td>{player.position}</td>
              <td>{player.dob}</td>
              <td className="left">{player.pob}</td>
            </tr>
            {player.display &&
              <tr key={player.name} id={key}> 
                <td className="left" colSpan={8} className="stat-td">
                  <ul>
                    <li>Goals: <span>{player.data.goals}</span></li>
                    <li>Assists: <span>{player.data.assists}</span></li>
                    <li>Points: <span>{player.data.points}</span></li>
                    <li>Penalty Minutes: <span>{player.data.pim}</span></li>
                    <li>Shots: <span>{player.data.shots}</span></li>
                    <li>Games Played: <span>{player.data.games}</span></li>
                  </ul>
                  <ul>
                    <li>Powerplay Goals: <span>{player.data.powerPlayGoals}</span></li>
                    <li>Shorthanded Goals: <span>{player.data.shortHandedGoals}</span></li>
                    <li>Game Winning Goals: <span>{player.data.gameWinningGoals}</span></li>
                    <li>Overtime Goals: <span>{player.data.overTimeGoals}</span></li>
                    <li>Blocked Shots: <span>{player.data.blocked}</span></li>
                    <li>+/-: <span>{player.data.plusMinus}</span></li>
                  </ul>
                </td>
              </tr>
            }
          </React.Fragment>
        ))} 
        </tbody>
      </table>
    </div>
  );
}

export default Roster;