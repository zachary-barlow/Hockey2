import React, { useEffect, useState } from 'react';
import {Route, Switch} from 'react-router-dom';
import Division from './Components/Divisions';
import Team from './Components/Team';

// https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md
// https://statsapi.web.nhl.com/api/v1/divisions
// https://statsapi.web.nhl.com/api/v1/teams
// https://github.com/erunion/sport-api-specifications/tree/master/nhl





function App() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/standings`)
    .then(results => {
      return results.json();
    }).then(data => {
      setTeam(data.records);
    })
  },[]);

  return (
    <div className="App">
      <h1>Hockey API Project</h1>
      <Switch>
        <Route exact path="/">
          <Division team={team}/>
        </Route>
        <Route exact path="/:teamID">
          <Team team={team}/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
