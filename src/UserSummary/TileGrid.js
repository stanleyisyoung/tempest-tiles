import React, { useState } from 'react';
import { Button } from 'reactstrap';
import './TileGrid.css';
import UsersList from '../data/users.json'
import LogData from '../data/logs.json'
import Tile from './Tile'


// Container to hold all user tiles & calculations
const TileGrid = () => {
  // using mock data, let's pretend it was fetched with some cool APIs
  const [users] = useState(UsersList)
  const [logs] = useState(LogData)
  const name = 'name'
  const impressions = 'impressions'
  const conversions = 'conversions'
  const revenue = 'revenue'
  const [sortBy, setSortBy] = useState(name)

  // create hash to store calculated data for each user
  // allows for single pass of logs for O(n+m) instead of O(nm) runtime
  const generateResultsHash = (users) => {
    var h = {};
    users.forEach((user) => {
      h[user.id] = {
        name: user.name,
        avatar: user.avatar,
        occupation: user.occupation,
        start_date: null,
        end_date: null,
        totalImpression: 0,
        totalConversion: 0,
        totalRevenue: 0,
        rawChartData: new Array(30).fill(0), // index+1 = day, value = number of conversions
      }
    })

    return h;
  }

  const calculateUserData = () => {
    let results = generateResultsHash(users);

    // sum up each user's log data
    logs.forEach((log) => {
      let id = log.user_id;
      const date = new Date(log.time);
      const day = date.getDay();

      if(log.type === "conversion"){
        results[id]['totalConversion'] += 1;
        results[id]['rawChartData'][day] += 1;
        results[id]['totalRevenue'] += log.revenue;
      } else if (log.type === "impression"){
        results[id]['totalImpression'] += 1;
      }      
    });

    return results;
  }

  const sortUsers = (data) => {
    var sortList = []
    for(let i in data){
      sortList.push(data[i])
    }

    sortList.sort(function(a, b){
      let x, y;
      // determine what we're sorting by
      if(sortBy === name){
        x = a.name.toUpperCase();
        y = b.name.toUpperCase();
      }
      else if(sortBy === impressions){
        x = a.totalImpression
        y = b.totalImpression
      }
      else if(sortBy === conversions){
        x = a.totalConversion
        y = b.totalConversion
      }
      else {
        x = a.totalRevenue
        y = b.totalRevenue
      }

      if(x > y) return 1;
      if(x < y) return -1;
      return 0;
    })

    return sortList;
  }

  const data = calculateUserData();
  const sortedData = sortUsers(data);
  return (
    <div className="tile-grid">
      <div className="sort-options">
        <div className="sort-label">Sort by:</div>
        {/* might be better as a dropdown */}
        <Button onClick={()=>setSortBy(name)}>Name</Button>
        <Button onClick={()=>setSortBy(impressions)}>Impression</Button>
        <Button onClick={()=>setSortBy(conversions)}>Conversions</Button>
        <Button onClick={()=>setSortBy(revenue)}>Revenue</Button>
      </div>
      <div className="users">
        {(sortedData).map((user, i)=>{
          return <Tile key={i} data={user}/>
        })}
      </div>
    </div>
  )
}

export default TileGrid;