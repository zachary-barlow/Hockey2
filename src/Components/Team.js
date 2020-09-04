import React, { useEffect, useState } from 'react';
import {Link,useRouteMatch} from 'react-router-dom';
import './Team.css';
import Schedule from './Schedule.js';
import Roster from './Roster.js';
import TeamHeader from './Header.js';
//https://statsapi.web.nhl.com/api/v1/schedule?teamID={id}
//?expand=team.schedule.next


function Team(props){
  let { url } = useRouteMatch();
  let id = url.slice(1);

  const [displayPlayer, setDisplayPlayer] = useState(false);
  const [displayPlayerID, setDisplayPlayerID] = useState(0);
  const [player, setPlayer] = useState({
    name: '',
    goals: 0,
    assists: 0,
    pim: 0,
    shots: 0,
    games: 0,
    hits: 0,
    ppg: 0,
    gwg: 0,
    otg: 0,
    blocked: 0,
    pm: 0,
    points: 0
  });
  const [roster, setRoster] = useState([]);
  const [stats, setStats] = useState({
    name: '',
    games: 0,
    wins: 0,
    losses: 0,
    ot: 0,
    points: 0,
    ranking: {
      pts: '',
      ppp: '',
      pkp: ''
    }
  });


 
  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/teams/${id}/stats`)
    .then(results => {
      return results.json();
    }).then(data => {
      setData(data);
    })
  },[id]);

  const setData = data => {
    let values = data.stats[0].splits[0];
    let places = data.stats[1].splits[0];
    setStats({
      name: values.team.name,
      games: values.stat.gamesPlayed,
      wins: values.stat.wins,
      losses: values.stat.losses,
      ot: values.stat.ot,
      points: values.stat.pts,
      ranking: {
        pts: places.stat.pts,
        ppp: places.stat.powerPlayPercentage,
        pkp: places.stat.penaltyKillPercentage
      }
    });
  }

  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/teams/${id}?expand=team.roster`)
    .then(results => {
      return results.json();
    }).then(data => {
      let tRost = data.teams[0].roster.roster;
      teamRoster(tRost);
    })
  },[id]);

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

 // const displayPlayerButton = (id, name) => {
    /*
      When clicking on their name, this function sets the display property of the player's data
      and sets the displayPlayerID for the API to fetch and set the Object for the the data to be
      shown on screen
    */
/*     if(getPlayerData === 0){
      setDisplayPlayerID(id);
      setDisplayPlayer(true);
      getPlayerData(id, name);
    } else if (id === displayPlayerID){
      setDisplayPlayer(!displayPlayer);
    } else {
      if(!displayPlayer) {
        setDisplayPlayer(!displayPlayer);
      }
      setDisplayPlayerID(id);
      getPlayerData(id, name);
    }
  } */

  return(  
    <div>
      <Link to="/"><button className="back">Go Back</button></Link>
      <div className="teamStatPage">
        {/* Roster */}
        <TeamHeader />
        <div className="roster">
          <Roster id={id}/>
        </div>
        {/* The Team stats div with all the stats */}
{/*         <div className="container-small stats">
          <h3>{stats.name}: <span>{stats.ranking.pts}</span></h3>
          <div>
            <ul className="valList">
              <li>Wins: <span>{stats.wins}</span></li>
              <li>Losses: <span>{stats.losses}</span></li>
              <li>OT losses: <span>{stats.ot}</span></li>
              <li>Points: <span>{stats.points}</span></li>
            </ul>
            <ul className="placeList">
              <li>Powerplay Percentage: <span>{stats.ranking.ppp}</span></li>
              <li>Penaltykill Percentage: <span>{stats.ranking.pkp}</span></li>
            </ul>
          </div>
        </div> */}
        {/* Team leaders */}
        {/* Schedule */}
        <Schedule id={id}/>
      </div>
    </div>
  );
}


export default Team;