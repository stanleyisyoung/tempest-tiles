import React from 'react';
import './Tile.css';
import { Chart } from 'react-charts'

const formatMoney = (value) => {
  let num = Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return num.substr(0, num.length - 3)
}

// display a user's info in a tile
const Tile = ({data}) => {
  // convert data into array of [day, conversions] for react-charts
  // index+1 = the actual calendar day
  const transformChartData = (data) => {
    let chart = []
    for(let i = 0; i < data.length; i++){
      chart.push([i+1, data[i]]);
    }
    return chart;
  }

  // react-charts
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )
  const graphData = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: transformChartData(data.rawChartData),
      },
    ],
  )
  
  return (
    <div className="tile-container">
      <div className="title row">
        <div className="avatar-container">
          <img className="avatar" src={data.avatar} alt={data.name[0]} />
        </div>
        <div className="title">
          <div className="name">{data.name}</div>
          <div className="occupation">{data.occupation}</div>
        </div>
      </div>
      
      <div className="info row">
        <div className="conversion-chart">
          <div
            style={{
              width: '230px',
              height: '100px'
            }}
          >
            <Chart data={graphData} axes={axes} />
          </div>
          <div className="chart-label">Conversions 4/01-4/30</div>
        </div>
        

        <div className="summary">
          <div className="impressions data">{data.totalImpression}</div>
          <div className="summary-label">impressions</div>
          <div className="conversions data">{data.totalConversion}</div>
          <div className="summary-label">conversions</div>
          <div className="revenue data">{formatMoney(data.totalRevenue)}</div>
          <div className="summary-label">revenue</div>
        </div>
      </div>
      
    </div>
  )
}

export default Tile;