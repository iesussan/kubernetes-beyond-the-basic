//Require module
const express = require('express');
// Express Initialize
//app
const app = express();
const port = 8000;

const health = require('@cloudnative/health-connect');
let healthCheck = new health.HealthChecker();


const livePromise = () => new Promise((resolve, _reject) => {
    const appFunctioning = true;
    // You should change the above to a task to determine if your app is functioning correctly
    if (appFunctioning) {
      resolve();
    } else {
      reject(new Error("App is not functioning correctly"));
    }
  });
let liveCheck = new health.LivenessCheck("LivenessCheck", livePromise);
healthCheck.registerLivenessCheck(liveCheck);

let readyCheck = new health.PingCheck("google.com");
healthCheck.registerReadinessCheck(readyCheck);

//app
app.listen(port,()=> {
console.log('APP gc-kubernetes-demo 2.0.0 is running in port 8000');
})


//create api
app.get('/gc-kubernetes-demo', (req,res)=>{
    res.send('Kubernetes Beyond the Basic Demo Version 2.0.0');
    })

app.use('/gc-kubernetes-demo/live', health.LivenessEndpoint(healthCheck));
app.use('/gc-kubernetes-demo/ready', health.ReadinessEndpoint(healthCheck));
app.use('/gc-kubernetes-demo/health', health.HealthEndpoint(healthCheck));