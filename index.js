const express = require("express");
const request = require("request");
const bodyparser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

// fucking awesome and it's used to transfer the static files to hosted/running websites.the code written below.cool public is the folder name where all static files are used.external css is implemented if we do not use this code below, to use internal css.we have to use this code written below. to be more observant here.
app.use(express.static("public"));

// in app.listen there is no need for parameters in callback function

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const mail = req.body.mail;

  const data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };
  // this is the data in the form of strings we will send to mailchimp.
  const JSONdata = JSON.stringify(data);

  const URL = "https://us21.api.mailchimp.com/3.0/lists/3831d033de";

  const options = {
    method: "POST",
    auth: "saurabh:17f791b4f4b02c5738eba2466c3db8a2-us21",
  };
//  this request is  a property of node.js not of mailchimp
  const request = https.request(URL, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // why not response.sendFIle(--) instead of res.sendFile()???? why, y to use response of other
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(JSONdata);
  request.end();
});

// it's not working the button is not redirecting the page to home page or home route despite of having every code correct and 0 error.
app.post("/failure", function (req, res) {
  console.log("redirected");
  res.redirect("/");
});

// here, "process" object is defined by heroku it is not the object of node.js,,btw process.env.PORT is used for dynamic hosting or used to provide a random port to our server by heroku ||3000 this port helps us to run locally.
app.listen(process.env.PORT||3000, function () {
  console.log("server is running on port 3000");
  console.log("learn grammer once and read/learn vocab daily by fiction");
});

// what wrong thing i was doing? i didn't use form by action and method, and didn't give name to input to use them by calling in log's or in app.use

// res.send is used to send post information

// api key
// 17f791b4f4b02c5738eba2466c3db8a2-us21
// audience key/list id
// 3831d033de
// jsonwebtoken.
