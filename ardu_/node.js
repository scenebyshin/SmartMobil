
var express = require('express') // 파일 로드를 위한 모듈
var fs = require('fs')   
var app = express()

//추가 
var SerialPort = require("serialport"); // 시리얼포트 라이브러리 호출 
var port =3000; // 포트번호 지정
var serialPort =new SerialPort("/dev/ttyACM0",{baudRate : 9600}); //  대역폭: 9600, 장치명 설정 
var bodyParser = require('body-parser'); // 바디 파서
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended : true}));
//
app.locals.pretty = true
app.set('views', './view_file')
app.set('view engine', 'pug')
app.use(bodyParser.json()) // 바디 파싱
app.listen(3000, () => {  //node.js 서버 실행
  console.log("Server has been started")
})

var val; // 임시로 센서값을 저장할 변수 
 
serialPort.open(function () { //시리얼포트 열기
    serialPort.on('data',function(data){ //시리얼데이터 송신
    val += data;   // 변수에 데이터를 저장하며
    if(val.length >= 1000000000 ){ // 특정 길이 이상이 되면 val 값을 줄여서 해결
      val = val.substring(1,1);  
    }
  });


// 최상위 라우트로 접속 시 /hello로 리다이렉트 
app.get("/", (req, res) => {  
  res.redirect('/hello')
  })

// /bye로 접근시   
app.get("/bye", (req, res) => { //바이
  fs.readFile('bye.html', (error, data) => {  //data를
    if(error) {
      console.log('error :'+error)
    }
    else {
      res.writeHead(200, {'ContentType':'text/html'})
      res.end(data)   // 응답 프로세스 종료 
    }
  })
})

var recvData //body 에서 data를 받아옵니다.
app.post("/data", function(req, res){
  recvData = req.body.data // input태그(name = data) 값을 받아옵니다. 
  console.log(recvData);
  if( recvData <= '6'){
    mainFunction(recvData);
  }
  else if( recvData <= 'g'){
    //다른함수 ~ 이런식으로 구현할 예정입니다.
}
  res.render('finish');
});




serialPort.on('data',function(data){ // 시리얼 통신데이터를 가져오는 함수
app.get("/hello", (req, res) => { //  /hello 로 접근시 데이터값을 전달합니다. 
  var h1;
  var h2;
  var h3;
  for(var i = val.length - 1; i>0; i--){ //미세먼지 데이터를 h1에 저장 1)으로 시작하는 데이터는 미세먼지 초미세, 그냥 미세 
    if(val[i] === '1'){
      if(val[i+1] === ')'){
         h1 = val.substring(i,i+8);
      }
    }
    else if(val[i] === '2'){ //온습더 데이터는 h2에 저장
      if(val[i+1] === ')'){
        h2 = val.substring(i,i+17);
      }
    }
    else if(val[i] === '3'){ //비접촉식 온도센서값 h3에 저장 
      if(val[i+1] === ')'){
        h3 = val.substring(i,i+10);
      }
    }
    if( h1 && h2 && h3)
      break;
  }
    console.log(h1 +'@'+ h2+ '@'+ h3+'@');
    var d = new Date();
    res.render('hello', { title: 'Hello',message1: h1, message2: h2, message3 : h3, message4: d  }) //데이터값을 전달합니다. 
 })
 })

});

// 주요 기능들에 따른 함수를 호출할 예정입니다. 
function mainFunction( argument1 ) {
  // Do Something
  if( 1 === '1'){ //스피커 ON
    /* a~g까지 알파벳들을 입력받아서  */

  }
  else if (2 === '2'){ // 스피커 OFF

  }
  else if (3 === '3'){ // LED ON

  }
  else if (4 === '4'){ // LED OFF

  }
  else if (5 === '5'){ // 서보모터 ON
    /*

     */
  }
  else if (6 === '6'){ // 서보모터 oFF

  }

}