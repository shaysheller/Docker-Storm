import express from 'express';
import grafanaController from '../controllers/grafanaController.js';

const router = express.Router();
  
// don't think we need this anymore
// router.get('/', grafanaController.createDB, (req, res) => {
//   return res.status(200).json('successful');
// });

// run on start up 
// initializes db or gets the ID of the already created dashboard 
// adds the 3 start up gauges to the metrics page by default

router.post('/init', grafanaController.createDB, grafanaController.getDashByUid, grafanaController.createPanel, grafanaController.updateDB, (req, res) => {
  return res.status(200).json({ApiKey: process.env.GRAFANA_DASHBOARD_ID});
});


// when we are adding a panel
router.patch('/', grafanaController.getDashByUid, grafanaController.createPanel, grafanaController.updateDB, (req, res) => {
  return res.status(200).json('successful');
});

router.post('/targetsAdd', grafanaController.addTarget, (req, res) => {
  return res.sendStatus(200);
});


export default router;
