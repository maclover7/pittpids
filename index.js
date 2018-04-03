const express = require('express');
const app = express();
const request = require('request');
const moment = require('moment');

app.get('/api', (req, res) => {
  var { stop } = req.query;

  request(
    {
      uri: 'http://www.pittshuttle.com/Services/JSONPRelay.svc/GetMapStopEstimates?TimesPerStopString=8&ApiKey=8882812681',
      json: true
    },
    (err, response, body) => {
      if (err) throw err;

      res.json({
        stopName: stop,
        arrivals: body.reduce((arr, route) => {
          var stops = route.RouteStops.filter((routeStop) => {
            return routeStop.Description.includes(stop);
          });

          if (stops.length > 0) {
            arr.push({
              route: route.Description.trim(),
              arrivals: stops[0].Estimates.map((estimate) => {
                return moment()
                .add({ seconds: estimate.SecondsToStop })
                .diff(moment(), 'minutes');
              }).sort()
            });
          }

          return arr;
        }, [])
      });
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App listening...');
});
