//  Anslutning funktion 
// fuktionen körs när man trycker på knappen som har "my-super-cool-btn" id
function startConnect() {
  // if-satsen kollar om vi är connectade 
  if (document.getElementById("my-super-cool-btn").innerHTML == "Connect"){
    document.getElementById("my-super-cool-btn").innerHTML = "Disconnect";
    //Ändrar CSS:en på knappen 
    document.getElementById("test").className = "my-super-cool-btn2";
      // Genererar en random client ID
    clientID = "clientID_" + parseInt(Math.random() * 100);
      // Hämta hostname/ IP-adress och portnummer
    host ='maqiatto.com';
    port = 8883;
    document.getElementById("messages").innerHTML = 'Connected'

    // ny Paho-klientanslutning
    client = new Paho.MQTT.Client(host, Number(port), clientID);
      // Ställ in återuppringningshanterare
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({userName : "amjad.alakrami@abbindustrigymnasium.se",password : "amjad1314152",
          onSuccess: onConnect,
          onFailure: onFail,
                  });
  }
  else{
    document.getElementById("my-super-cool-btn").innerHTML = "Connect";
    document.getElementById("test").className = "my-super-cool-btn";
    client.disconnect();
    document.getElementById("messages").innerHTML = 'Disconnected';
  }
}
//Om anslutningen misslyckas 
function onFail() {
  document.getElementById("messages").innerHTML = 'ERROR!'
}  
// två topic som tar emot meddelanden och en som skickar 
let topic_1 ="amjad.alakrami@abbindustrigymnasium.se/car";
let topic_2 ="amjad.alakrami@abbindustrigymnasium.se/speed";
let topic_3 ="amjad.alakrami@abbindustrigymnasium.se/speed1"
// Om anslutningen lyckas 
function onConnect() {
   // Subscribe till alla topics
    client.subscribe(topic_1);
    client.subscribe(topic_2);
    client.subscribe(topic_3);
    message= new Paho.MQTT.Message();
    message.destinationName=topic_1;
    client.send(message);
}
// En funktion som skickar de meddelanden vi vill skicka
function onSend() {
  var input = document.getElementById("newMessage");
  // En fuktion som kollar om ett knapptryck på input rutan med idet "newMessage"
  input.onkeyup = function(event) {
  // if-satsen checkar om det var ENTER knappen "13 = enter"
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("f").innerHTML = document.getElementById("newMessage").value;
    document.getElementById("myRange").value = document.getElementById("newMessage").value;
    let message= document.getElementById("newMessage").value;
    console.log(message);
    message= new Paho.MQTT.Message(message);
    message.destinationName=topic_1;   
    client.send(message);   
  }
  }
}

// Om anslutningen förloras 
function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML = 'ERROR!';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML = '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    }
}

// En function som körs när vi får ett meddelande 
function onMessageArrived(message) {
  // if-satsen checkar om meddelandet vi får är en dictionary i string form
  if (message.payloadString[0]=="{") {
  // gör om det till en JSON-object
  var info = JSON.parse(message.payloadString);
  }
  //till vilken topic är meddelandet skickad 
  if (message.destinationName == topic_2){
    document.getElementById("PWMD").innerHTML = "David PWM" + "<br>" + info.pwm;
    adddata(info.speedo, 0);
  }
  if (message.destinationName == topic_3){
    document.getElementById("PWMA").innerHTML = "Amjad PWM" + "<br>" + info.pwm;
    adddata(info.speedo,  2);
  }
}
// En fuktion som körs efter nya inputs från text rutan eller slider
function onInput (){
    var slider = document.getElementById("myRange");
    var output = document.getElementById("f");
    output.innerHTML = slider.value; // Display the default slider value

    // Uppdatera det aktuella slider värdet varje gången man drar den 
    slider.onmouseup  = function() {
    output.innerHTML = this.value;
    
    let message= document.getElementById("myRange").value;
    console.log(message);
    message= new Paho.MQTT.Message(message);
    message.destinationName=topic_1;
    document.getElementById("messages").innerHTML = ""
    client.send(message);

    }
}
// En fucktion som lägger till data till grafen 
// första argumentet är de värdena vi lägga till grafen, och den andra är till vilken dictionary i grafen dataset (Amjad, david eller börvärdet)
function adddata(data, index){
  var date = new Date();
  var sec = date.getSeconds();
  // om grapens data är större än 10
  if (myLineChart.data.labels.length > 10){
  // shift tar bort det första värdet i listan 
  myLineChart.data.labels.shift();
  myLineChart.data.datasets[index].data.shift();
  myLineChart.data.datasets[1].data.shift();
  // push lägger till data till listan 
  myLineChart.data.datasets[index].data.push(data);
  myLineChart.data.datasets[1].data.push( document.getElementById("myRange").value);
  myLineChart.data.labels.push(sec);
  myLineChart.update();
  }
  else{
    myLineChart.data.datasets[index].data.push(data);
    myLineChart.data.datasets[1].data.push( document.getElementById("myRange").value);
    myLineChart.data.labels.push(sec);
    myLineChart.update();
  }
}


var myLineChart = null;
// En fucktion som skapar grafen 
function chart(){
  var canvas = document.getElementById('Chart');
  var data = {
  labels: [],
  // varje dictionary i dataset är en line som visualiseras i grafen 
  datasets: [
      {
          label: "Ärvärdet David",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgb(0, 0, 0)",
          borderColor: "rgb(0, 0, 0)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          data: [],
      }, {
          label: "Börvärdet",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgb(103, 187, 243)",
          borderColor: "rgb(103, 187, 243)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          data: [],
      },
      {
          label: "Ärvärdet Amjad",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgb(63, 191, 191)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          data: [],
      },
  ]
};
var option = {
chart: {
  height: 100,
  type: 'line',
  animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
          speed: 1000
      }
  },
  toolbar: {
      show: true
  },
  zoom: {
      enabled: true
  }
},
dataLabels: {
    enabled: false
},
stroke: {
    curve: 'smooth'
},
series: [{
    data: data,
}],
markers: {
    size: 0
},
yaxis: {
    max: 200
},
legend: {
    show: false
},
}
myLineChart = Chart.Line(canvas,{
data:data,
options:option
    });
}