# Coacher
![build](https://img.shields.io/badge/build-success-brightgreen.svg?style=flat-square) ![version](https://img.shields.io/badge/version-1.0_BETA-yellow.svg?style=flat-square)

**Coacher** is web portal for tracking your exercises, health, fitness progress using machine learning. 

It is virtual coach and using video camera we track your exercises which means that we take care about your repetitions (we count repetitions that we find acceptable), track your progress, etc...

## Get started
### Requirements
* [NodeJS](https://nodejs.org/en/ "NodeJS") (v14.8.0)
* [OpenSSL](https://www.openssl.org/ "OpenSSL")
* [MongoDB server](https://docs.mongodb.com/manual/administration/install-community/ "MongoDB server") (v4.4)

### Installation
* Clone coacher repository: `git clone https://github.com/theaksaa/coacher.git `
* Install node modules: `npm install`
* Create SSL certificate: (*skip this step if you want to use http*)
	`mkdir ssl && cd ssl`
 	`openssl req -new -newkey rsa:2048 -nodes -keyout certificate.key -out certificate.csr`
	 `openssl req -new -x509 -nodes -sha256 -days 365 -key certificate.key -out certificate.crt`
* To import default database run: (*require opened mongoDB server*)
	`node db.js`



## Running coacher
To start coacher web server first open mongodb server and then run executable without parameters.
	`node server.js`
   
#### CLI parameters
* `host` - host of web server (default `localhost`)
* `https` - open server with https (default `http`)
* `dburi` - mongodb uri (default `mongodb://localhost:27017/coacher`)
* `sslkey` - path to ssl key file (default `ssl/certificate.key`)
* `sslcrt` - path to ssl crt file (default `ssl/certificate.crt`)
* `gentoken` - generate random jwt (default `secret123`)

## Admin panel
User with admin privilege can add, remove and modify exercises.

### Admin login credentials
| Email | Password |
| ------------ | ------------ |
|  admin | admin |

## Exercise

##### Exercise must have:
- Name *- max 20 characters*
- Difficulty *- 1, 2 or 3*
- kcal
- Required time *- minutes*
- Repetitions
- Image *- URL or base64 string*
- Script *- javascript code*

### Exercise scripting
Every exercise needs to have a custom script for tracking, written in JavaScript.

```javascript
let angle = calculateAngle(pose.rightWrist, pose.rightElbow, pose.rightShoulder).toFixed(2);

if(first) {
	first = false;
	document.getElementById('status').innerHTML = 'Move your arm up !';
	document.getElementById('image').src = 'https://thumbs.dreamstime.com/z/arm-bent-elbow-one-asian-girl-against-gray-background-95883611.jpg';
}
if(Math.abs(180 - angle) <= 20 && state == false) {
	state = true;
	document.getElementById('status').innerHTML = 'Move your arm up !';
	document.getElementById('image').src = 'https://thumbs.dreamstime.com/z/arm-bent-elbow-one-asian-girl-against-gray-background-95883611.jpg';
}
else if(Math.abs(90 - angle) <= 20 && state == true) {
	state = false;
	document.getElementById('status').innerHTML = 'Go back!';
	document.getElementById('exerciseCount').innerHTML = ++exerciseCount;
	document.getElementById('image').src = 'https://www.verywellfit.com/thmb/87YJStM6kZzJFjs_XVXgNcC_If0=/1333x1000/smart/filters:no_upscale()/extension-56b12c503df78cdfa0005375.jpg';
}
```
Integrated variables, functions and html elements:
- `#status`- html element (can be used for showing message to user)

- `#image`- html element (can be used for showing image of next pose)

- `#exerciseCount`- html element (can be used for showing repetitions)

- `var exerciseCount`- variable for counting repetitions

- `var state`- help variable

- `var first`- variable which is set on **true** when user start exercise (can be used for sending user message to take entry pose for that exercise)

- `function calculateAngle(pointA, pointB, pointC) return angle;`- function for calculating angle between 3 points, where point is object with x and y: `{ x: float, y: float }`

- `pose`- object (of pose found on video)
```json
{
   "score":0.7656528713072047,
   "keypoints":[
      {
         "score":0.9848663210868835,
         "part":"nose",
         "position":{
            "x":145.3660731927894,
            "y":-8.314387696262465
         }
      },
      {
         "score":0.7019993662834167,
         "part":"leftEye",
         "position":{
            "x":156.02093321803943,
            "y":-18.271507530360832
         }
      },
      {
         "score":0.9517703652381897,
         "part":"rightEye",
         "position":{
            "x":137.33894778596752,
            "y":-15.608468853546025
         }
      },
      {
         "score":0.1653226763010025,
         "part":"leftEar",
         "position":{
            "x":164.5173294720483,
            "y":-14.288781310797663
         }
      },
      {
         "score":0.5130624175071716,
         "part":"rightEar",
         "position":{
            "x":125.6106181460132,
            "y":-10.701021424527298
         }
      },
      {
         "score":0.9872097969055176,
         "part":"leftShoulder",
         "position":{
            "x":183.48268946784944,
            "y":33.21420929311314
         }
      },
      {
         "score":0.9887123107910156,
         "part":"rightShoulder",
         "position":{
            "x":125.29898380027207,
            "y":45.96856618205861
         }
      },
      {
         "score":0.975487232208252,
         "part":"leftElbow",
         "position":{
            "x":225.67631346706287,
            "y":74.69409749665613
         }
      },
      {
         "score":0.6524221897125244,
         "part":"rightElbow",
         "position":{
            "x":103.25312158013132,
            "y":111.98812878085482
         }
      },
      {
         "score":0.6819709539413452,
         "part":"leftWrist",
         "position":{
            "x":268.5037819235241,
            "y":47.207431422133396
         }
      },
      {
         "score":0.9573705196380615,
         "part":"rightWrist",
         "position":{
            "x":84.29571693509469,
            "y":204.84012588916585
         }
      },
      {
         "score":0.988292396068573,
         "part":"leftHip",
         "position":{
            "x":175.4603965551473,
            "y":152.86094160859224
         }
      },
      {
         "score":0.9895094633102417,
         "part":"rightHip",
         "position":{
            "x":139.04808259659706,
            "y":153.45859215881111
         }
      },
      {
         "score":0.8666866421699524,
         "part":"leftKnee",
         "position":{
            "x":178.79823102097566,
            "y":232.9747757373617
         }
      },
      {
         "score":0.6875374913215637,
         "part":"rightKnee",
         "position":{
            "x":135.55346270015733,
            "y":239.24164152330928
         }
      },
      {
         "score":0.5470534563064575,
         "part":"leftAnkle",
         "position":{
            "x":174.06972031648985,
            "y":265.54203671704005
         }
      },
      {
         "score":0.376825213432312,
         "part":"rightAnkle",
         "position":{
            "x":148.02310156914976,
            "y":265.9315330416312
         }
      }
   ],
   "nose":{
      "x":145.3660731927894,
      "y":-8.314387696262465,
      "confidence":0.9848663210868835
   },
   "leftEye":{
      "x":156.02093321803943,
      "y":-18.271507530360832,
      "confidence":0.7019993662834167
   },
   "rightEye":{
      "x":137.33894778596752,
      "y":-15.608468853546025,
      "confidence":0.9517703652381897
   },
   "leftEar":{
      "x":164.5173294720483,
      "y":-14.288781310797663,
      "confidence":0.1653226763010025
   },
   "rightEar":{
      "x":125.6106181460132,
      "y":-10.701021424527298,
      "confidence":0.5130624175071716
   },
   "leftShoulder":{
      "x":183.48268946784944,
      "y":33.21420929311314,
      "confidence":0.9872097969055176
   },
   "rightShoulder":{
      "x":125.29898380027207,
      "y":45.96856618205861,
      "confidence":0.9887123107910156
   },
   "leftElbow":{
      "x":225.67631346706287,
      "y":74.69409749665613,
      "confidence":0.975487232208252
   },
   "rightElbow":{
      "x":103.25312158013132,
      "y":111.98812878085482,
      "confidence":0.6524221897125244
   },
   "leftWrist":{
      "x":268.5037819235241,
      "y":47.207431422133396,
      "confidence":0.6819709539413452
   },
   "rightWrist":{
      "x":84.29571693509469,
      "y":204.84012588916585,
      "confidence":0.9573705196380615
   },
   "leftHip":{
      "x":175.4603965551473,
      "y":152.86094160859224,
      "confidence":0.988292396068573
   },
   "rightHip":{
      "x":139.04808259659706,
      "y":153.45859215881111,
      "confidence":0.9895094633102417
   },
   "leftKnee":{
      "x":178.79823102097566,
      "y":232.9747757373617,
      "confidence":0.8666866421699524
   },
   "rightKnee":{
      "x":135.55346270015733,
      "y":239.24164152330928,
      "confidence":0.6875374913215637
   },
   "leftAnkle":{
      "x":174.06972031648985,
      "y":265.54203671704005,
      "confidence":0.5470534563064575
   },
   "rightAnkle":{
      "x":148.02310156914976,
      "y":265.9315330416312,
      "confidence":0.376825213432312
   }
}
```

## Used in project
- [Bootstrap](https://getbootstrap.com/ "Bootstrap") - quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins. 
- [ml5.js](https://ml5js.org/ "ml5.js") - provides access to machine learning algorithms and models in the browser, building on top of TensorFlow.js.
- [p5.js](https://p5js.org/ "p5.js") - a JavaScript library for creative coding, with a focus on making coding accessible and inclusive for artists, designers, educators, beginners, and anyone else!
- [Toast](https://github.com/Script47/Toast "Toast") - Toast - A Bootstrap 4.2+ jQuery plugin (plugin by @Script47)
- [Freepik](https://www.freepik.com/ "Freepik") - graphic resources for everyone

## Author
##### Uros Aksentijevic (aksaa002@gmail.com)