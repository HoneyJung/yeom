const express = require('express');
const os = require('os');
const dns = require('dns');
const app = express();
const port = 3000;
main();
function main() {
    switch(process.env.TYPE) {
        case "REDUCER":
            reducer();
            break;
        case "MASTER":
            master();
            break;
    }
}

function check(text){
	let newtext = ''
	let flag = 0;
	for(let i=0;i<text.length;i++)
	 {
		letter = text[i].toLowerCase();
		if(letter == 'a' || letter == 'b'|| letter == 'c'|| letter == 'd'|| letter == 'e'|| letter == 'f'|| letter == 'g'|| letter == 'h'|| letter == 'i'|| letter == 'j'|| letter == 'k'|| letter == 'l'|| letter == 'm'|| letter == 'n'|| letter == 'o'|| letter == 'p'|| letter == 'q'|| letter == 'r'|| letter == 's'|| letter == 't'|| letter == 'u'|| letter == 'v'|| letter == 'w'|| letter == 'x'|| letter == 'y' || letter == 'z' || letter ==' '){
		newtext += letter;
		flag = 1;
	}
	}
	if(flag == 0) // no alpha
	{
		return 1;
	}
	else{
	return newtext;
	}

}

function reducer() {
	console.log("REDUCER2");
	var bodyParser = require('body-parser');
	app.use(express.urlencoded({limit:'20mb',extended:true}));
	app.use(express.json({limit:'20mb'}));
    
    
	app.post('/reduce', (req, res) => {
		console.log("received");
		//console.log(req.body)
		words = req.body.text;
		let new_words = [];
		for(let i=0;i<words.length;i++){ 
			if (check(words[i]) == 1){
				continue;
			}
			else{
				new_words.push(words[i]);
			}
		}
		let dict = {};
		//text = check(text);
		//console.log(text);
		//words = text.split(' ');	

		for(let i=0;i<new_words.length;i++){ 
			if(words[i] in dict){
				dict[new_words[i]]++;
			}
			else{
				dict[new_words[i]] = 1;
			}
		}
	res.send(dict);
    });
	

	
    app.listen(port, () => console.log(`listening on port ${port} at reducer`));
}

function sort_dict(dict){
	let items = Object.keys(dict).map(function(key){
		return [key,dict[key]];
	});
	items.sort(function(first,second){
		return second[1]-first[1];
	});
	let new_items = [];
	len = items.length;
	let 5per = parseInt(items.length * 0.05);
	let 25per = parseInt(items.length * 0.025);
	let center = parseInt(items.length/2);
	for(let i=0;i<5per;i++)
	{
		new_items.push([i,items[i][0],items[i][1],"popular"]); 
	}
	for(let i=center-25per; i < center+25per; i++){
		new_items.push([i,items[i][0],items[i][1],"common"]); 
	}
	for(let i=len-5per; i<len; i++){
		new_items.push([i,items[i][0],items[i][1],"rare"]); 
	}
	return new_items;
}

function master() {
    const inputFileName = process.argv[2];
    const fs = require('fs');
	let text = fs.readFileSync("./" + inputFileName, {encoding: 'utf8', flag: 'r'});
   	console.log("MASTER3"); 
	const request = require('request');

	let text_split = text.split(' ');
	length = text_split.length;
	split_one = text_split.slice(0,length/3);
	split_two = text_split.slice(length/3+1, (length/3) * 2);
	split_three = text_split.slice((length/3)*2+1,length) ;
	
	var bodyParser = require('body-parser');
	app.use(express.urlencoded({limit: '20mb', extended: true}));
	app.use(express.json({limit: '20mb'}));

  	var post_options = {
  	    uri: 'http://10.15.250.46:3000/reduce',
		body: JSON.stringify({'text':split_one}),
      	headers: {
 			'Content-Type': 'application/json'
      	}
  	};
	var post_options2 = {
  	    uri: 'http://10.15.253.192:3000/reduce',
		body: JSON.stringify({'text':split_two}),
      	headers: {
 			'Content-Type': 'application/json'
      	}
  	};
  	var post_options3 = {
  	    uri: 'http://10.15.245.200:3000/reduce',
		body: JSON.stringify({'text':split_three}),
      	headers: {
 			'Content-Type': 'application/json'
      	}
  	};
	let new_dict = {};

	request.post(post_options,function(error,res,body){
		res_dict = res.body;
		console.log(error,JSON.parse(res.body).only);
		for(let key in res_dict){
			if(key in new_dict){
				new_dict[key]++;
			}
			else{
				new_dict[key] = 1;
			}
		}
		console.log(Object.keys(new_dict).length);
		console.log(new_dict.only);
	})
	request.post(post_options2,function(error,res,body){
		res_dict2 = res.body;
		console.log(error,JSON.parse(res.body).only);
		for(let key in res_dict2){
			if(key in new_dict){
				new_dict[key]++;
			}
			else{
				new_dict[key] = 1;
			}
		}
		console.log(Object.keys(new_dict).length);
		console.log(new_dict.only);
	})
	request.post(post_options3,function(error,res,body){
		res_dict3 = res.body;
		console.log(error,JSON.parse(res.body).only);
		for(let key in res_dict3){
			if(key in new_dict){
				new_dict[key]++;
			}
			else{
				new_dict[key] = 1;
			}
		}
		console.log(Object.keys(new_dict).length);
		console.log(new_dict.only);
	})
	result = sort_dict(new_dict);
	console.log(result);

	
}
