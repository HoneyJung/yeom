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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
	let fiveper = parseInt(items.length * 0.05);
	let twofiveper = parseInt(items.length * 0.025);
	let center = parseInt(items.length/2);
	for(let i=0;i<fiveper;i++)
	{
		new_items.push([i,items[i][0],items[i][1],"popular"]); 
	}
	for(let i=center-twofiveper; i < center+twofiveper; i++){
		new_items.push([i,items[i][0],items[i][1],"common"]); 
	}
	for(let i=len-fiveper; i<len; i++){
		new_items.push([i,items[i][0],items[i][1],"rare"]); 
	}
	return new_items;
}
/*
function post(request,option,new_dict){
	request.post(option,function(error,res,body){
		let res_dict = res.body;
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
	})
}

function post3(new_dict,op1,op2,op3,request){
	post(request, op1,new_dict);
	post(request, op2,new_dict);
	post(request, op3,new_dict);
}*/

async function master() {
    const inputFileName = process.argv[2];
	//const chunksize = process.argv[3];
    const fs = require('fs');
	let text = fs.readFileSync("./" + inputFileName, {encoding: 'utf8', flag: 'r'});
   	console.log("MASTER3"); 
	const request = require('request');

	let text_split = text.split(' ');
	//split_one = text_split.slice(0,length/3);
	//split_two = text_split.slice(length/3+1, (length/3) * 2);
	//split_three = text_split.slice((length/3)*2+1,length) ;
	//for(let i=0; i<split_two.length; i++){
	let chunk;
	if(process.env.CHUNK===undefined){
		chunk = 3;
	}
	else{
		chunk = process.env.CHUNK;
	}
	console.log(chunk);
	var bodyParser = require('body-parser');
	app.use(express.urlencoded({limit: '20mb', extended: true}));
	app.use(express.json({limit: '20mb'}));
	
	let new_dict = {};
	length = text_split.length;
	c = length / chunk;
	for(let k=0;k<chunk;k++){
		split = text_split.slice(c*k, c*(k+1));
		var post_options = {
  	    	uri: 'http://34.64.236.15:3000/reduce',
			body: JSON.stringify({'text':split}),
      		headers: {
 				'Content-Type': 'application/json'
      		}
  		};
		request.post(post_options,function(error,res,body){
			console.log("------------------",k);
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
		await sleep(10000);	
	
	}

/*
  	var post_options = {
  	    uri: 'http://34.64.236.15:3000/reduce',
		body: JSON.stringify({'text':split_one}),
      	headers: {
 			'Content-Type': 'application/json'
      	}
  	};
	
	var post_options2 = {
  	    uri: 'http://34.64.236.15:3000/reduce',
		body: JSON.stringify({'text':split_two}),
      	headers: {
 			'Content-Type': 'application/json'
      	}
  	};
  	var post_options3 = {
  	    uri: 'http://34.64.236.15:3000/reduce',
		body: JSON.stringify({'text':split_three}),
      	headers: {
 			'Content-Type': 'application/json'
      	}
  	};
	
	//await post3(new_dict,post_options,post_options2,post_options3, request);
	//console.log(Object.keys(new_dict).length);

	request.post(post_options,function(error,res,body){
		console.log("-----------------1");
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
	sleep(10000);
	request.post(post_options2,function(error,res,body){
		console.log("-----------------2");
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
	
	sleep(10000);
	request.post(post_options3,function(error,res,body){
		console.log("-----------------3");
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
	
	//result = sort_dict(new_dict);
	//console.log(result);
*/	
}
