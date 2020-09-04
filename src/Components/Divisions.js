import { Link } from 'react-router-dom';
import React from 'react';
import Schedule from './Schedule';

function Division({team}) { 
  return(
    <div>
      <button className="back">Playoffs</button>
      <Schedule id={0} />
      <div className="divisions">
        {/* The divisions laid out into cards */}
        {team.map((divs,id) => (
          <div key={id} className="card">
            <h3>{divs.division.name}</h3>
            <ul className="teamList">
              {divs.teamRecords.map(t => (
                <li key={t.team.name}><Link to={`/${t.team.id}`} className="link">{t.team.name}: <span>{t.points}</span></Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Division;