import express from "express";
const app = express();
const port = 3000;

import {
  getNearbyRailroads,
  getAllCrossings,
} from "./overpass.js";

app.get("/", (_, res) => {
  res.send("it works");
});

app.get("/railways", (req, res) => {
  getNearbyRailroads(req.query.coordinates, req.query.radius)
    .then(railways => {
      res.send(railways);
    })
    .catch(e => res.send(e));
});

app.get("/railways/:railwayId/crossings", (req, res) => {
  getAllCrossings(req.params.railwayId)
    .then(apiResult => res.send(apiResult))
    .catch(e => res.send(e));
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
