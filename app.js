const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
var request = require('request');
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var urls = [];
if (process.env.URLS){
    urls = process.env.URLS.split(",");
}else{
    urls = require('./urls.json');
}
console.log("URLS", urls);

app.post('/', (req, res, next) => {
    if (req.body.code!=null&&req.body.code=="0"){
        _request(urls,req.body, function(responses) {
            var url, response;
            for (url in responses) {
                // reference to the response object
                response = responses[url];
                // find errors
                if (response.error) {
                    console.log("Error", url, response.error);
                    return;
                }
                // render body
                if (response.body) {
                    console.log("Render", url, response.body);
                }
            }
            res.json(responses);
        });
    }
    else{
        res.sendStatus(400);
    }
})


app.post('/test1', function(req, res) {
    if (req.body.code!=null&&req.body.code=="0"){
        res.json(req.body);
    }
    else{
        res.sendStatus(400);
    }
});

app.post('/test2', function(req, res) {
    if (req.body.code!=null&&req.body.code=="0"){
        res.json(req.body);
    }
    else{
        res.sendStatus(400);
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

var _request = function (urls, postData, callback) {
	'use strict';
	var results = {}, t = urls.length, c = 0,
		handler = function (error, response, body) {
			var url = response.request.uri.href;
			results[url] = { error: error, response: response, body: body };
			if (++c === urls.length) { callback(results); }
        };
	while (t--) { 
        var clientServerOptions = {
            uri: urls[t],
            body: JSON.stringify(postData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }  
        request(clientServerOptions, handler); 
    }
};
