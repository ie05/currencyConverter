var express = require('express');
var router = express.Router();
var request = require('request');

 

var exchangeRates;
request( 'http://api.fixer.io/latest?base=USD' , function(error, response, body){

    if (!error && response.statusCode == 200){
      //Convert JSON text to a JavaScript object
      var jsonRes = JSON.parse(body);
      exchangeRates = jsonRes;
      // return exchangeRates;
    }

    else {
      //Log error info to console and return error with message.
      console.log("Error in JSON request: " + error);
      console.log(response);
      console.log(body);
    }
  });


router.get('/', function(req,res){
	res.render('index');
});

router.get('/convert',function(req,res){
	var dollars = req.query.dollar_amount;
	var convertTo = req.query.to_currency;
	var convertFrom = req.query.from_currency;
	var rate = exchangeRates.rates[convertTo];
	var fromRate = exchangeRates.rates[convertFrom];
	var result = dollars * rate;
	var from = dollars / fromRate;
	var renderResults, text1, text2;
	text1 = '$' + dollars + ' is equivalent to ' + result + ' ' + convertTo;
	text2 = dollars + ' ' + convertFrom + ' is equivalent to $' + from;
	convertFrom == convertTo ? renderResults = text1 : renderResults = text1 + ' AND ' + text2 ;
	res.render('results', {
						  renderResults : renderResults
						});
});

module.exports = router;