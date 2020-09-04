import React, { useEffect, useState } from 'react';
import './Team.css';

//https://statsapi.web.nhl.com/api/v1/schedule?teamID={id}
//?expand=team.schedule.next

function Game({ game }) {
  /*
  home, homeScore, away, awayScore, venue, date, time, gameState
  */
  return(
    <div className="game">
      
      {game.gameState === "Preview" ?
       <span>{game.date}: <span className="time">{game.time}</span></span>
      : game.gameState === "Live" ?
      <span className="green">{game.date}: <span className="time">{game.gameState}</span></span>
      :
      <span className="grey">{game.date}: <span className="time">{game.gameState}</span></span>
      }
      <div>
        <span className="team top">{game.home}: <span>{game.homeScore}</span></span>
        <span className="team bot">{game.away}: <span>{game.awayScore}</span></span>
        <span>{game.venue}</span>
      </div>

    </div>
  );
}
function Schedule({ id }) {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    /* 
      id = 0 means the home page and not a specific team but want the same format as 
      each teams schedule
    */
   let isMounted = true;
   refresh();
   return () => {isMounted = false};


   function refresh() {
     setTimeout(()=> {
       if(isMounted) {
        let url = '';
        if(id !== 0){
          url = `https://statsapi.web.nhl.com/api/v1/schedule?teamId=${id}&startDate=2020-07-28&endDate=2020-08-28`;
        } else {
          url = `https://statsapi.web.nhl.com/api/v1/schedule`;
        }
        fetch(url)
        .then(results => {
          return results.json();
        }).then(data => {
          setGames(data);
        })
        .catch(function (error){
          console.log(error);
        })
       }
     }, 4000)
   }
  });

  const setGames = data => {
    /* 
      This function loops through the schedule for each date
      1 date for home page (all of today's games)
      >= 1 dates for each team (their upcoming games)
    */
    let dates = data.dates;
    let games = [];
    dates.forEach(date => {
      games = games.concat(addGame(date));
    });
    setSchedule(games);
  }

  const addGame = date => {
    /* 
      This function maps each game to an Object and returns the list of games
    */
    const games = date.games.map(game => (
      {
        home: game.teams.home.team.name,
        homeScore: game.teams.home.score,
        away: game.teams.away.team.name,
        awayScore: game.teams.away.score,
        venue: game.venue.name,
        date: game.gameDate.slice(5,10),
        time: game.gameDate.slice(11,16),
        gameState: game.status.abstractGameState
      }
    ));
    return games;
  }

  /* 

  */
  return(
    <div className="schedule">
      <div>
        { schedule.length > 0 ?
          schedule.map((game, key) => (
            <Game game={game} key={key}/>
          ))
        : "Loading Games....."
        }
      </div>
    </div>
  );
}

export default Schedule;