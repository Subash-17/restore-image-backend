const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors= require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors())

app.post('/api/predictions', (req, res) => {
  console.log("into api", req.body)

  // let token='r8_FiUlYR9qWYvXdGa8JX6Pq3V1p2Zd0ps0iZRFy'
  let url = 'https://api.replicate.com/v1/predictions';
  const config = {
    headers: {
      Authorization: 'Token r8_Lf8EFeaKk1H6wrtHULSbzQIdE4a8uOS3mPDJ0',
      'Content-Type': 'application/json'
    }
  }

  let data = {
    version:
      "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
    input: { img: req.body.url, version: "v1.4", scale: 2 }
  }

  let getFirstApi = axios.post(url, data, config)
    .then((resp) => {
      console.log(resp.data.urls.get)
      let restoredImage = null;
      finalRes(resp.data.urls.get,config, res)
      // setTimeout(() => {
      // }, 15000)
    })
    .catch((error) => {
      console.log(error)
    })
})

async function finalRes(finalUrl, config, res){
  console.log("Into final===>>",finalUrl, config)
  let restoredImage=null;
  while(!restoredImage){
    console.log("While loop executed")

    let finalApi=await axios.get(finalUrl,config)
    .then(async (response) => {
      console.log("ressss===>>>",response.data)
      if(response.data.status == 'succeeded') {
        restoredImage=response.data.output
        res.status(200).send(response.data)
      } else if(response.data.status == 'failed') {
        res.status(500).send('Internal server')
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // finalRes(finalUrl, config, res)
      }     
    })
    .catch((error) => {
      console.log(error)
    })
  }
}

const port = 3000;

app.get('/get/vercel',(req,res)=>{
  console.log("Vercel worked")
  res.status(200).json("Its is worked")
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
