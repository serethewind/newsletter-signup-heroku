const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const https = require('https')
const port = 3000


// to use static files like our css and images
// subsequently a folder called public is created with the images and the css folder placed inside of it
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.listen(process.env.PORT || port, function() {
  console.log("server currently listening on HEROKU'S dynamically chosen port or port 3000")
})

app.post("/", function(req, res) {
  const firstName = req.body.fName
  const lastName = req.body.lName
  const email = req.body.eMail

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };


  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/6ffa484b78";

  const options = {
    method: "POST",
    auth: "njoah:440060fc881143f79a852fac5cb11df7-us6"
  }


  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")

    } else {
      res.sendFile(__dirname + "/failure.html")
    }


    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData)
  request.end();

});


app.post("/failure", function (req, res){
  res.redirect("/")
})



// "https://us6.api.mailchimp.com/3.0/lists/6ffa484b78"

// mailchimp api key
// 440060fc881143f79a852fac5cb11df7-us6

// audience id
// 6ffa484b78.
