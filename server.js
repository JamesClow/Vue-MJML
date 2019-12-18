// External Modules
import EXPRESS from 'express'; // framework
import FS from "fs"; // read and write files

// Internal Modules
import { renderEmail } from "./src/converter.js";

// Server Config
const SERVER = EXPRESS();
const port = 7576;

// Start up
SERVER.listen(port, (err) => {
  if(err){
    console.log('Email template server error! ' + err);
  }
  console.log("Email template server is listening on port " + port);
});

// Global setup
SERVER.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  res.set('Access-Control-Allow-Origin','*');
  res.set('Access-Control-Allow-Methods','GET,POST');
  res.set('Access-Control-Allow-Headers','Authorization, Content-Type, Origin, X-Requested-With, Accept');
  if('OPTIONS' == req.method) return res.sendStatus(200);
  next();
});

SERVER.post('*', function(req, res){ // Collect JSON data
  var data_string = '';
  req.on('data', function(data){
    data_string += data;
  });
  req.on('end', function(){ // When collection finishes
    try{
      var request_obj = JSON.parse(data_string);
      renderEmail(request_obj.template, request_obj.data).then(response=>{
        res.send(response);
      }).catch(response=>{
        res.status(500).end(response)
        return
      })
    }catch(e){
      res.status(500).end('Internal Server Error');
    }
  });
});
