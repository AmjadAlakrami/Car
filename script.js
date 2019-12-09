function startConnect() {
  if (document.getElementById("my-super-cool-btn").innerHTML == "Connect"){
    document.getElementById("my-super-cool-btn").innerHTML = "Disconnect";
    document.getElementById("test").className = "my-super-cool-btn2";
      // Generate a random client ID
    clientID = "clientID_" + parseInt(Math.random() * 100);
      // Fetch the hostname/IP address and port number from the form
    host ='maqiatto.com';
    port = 8883;
      // Print output for the user in the messages div
    document.getElementById("messages").innerHTML = 'Connected'

    // Initialize new Paho client connection
    client = new Paho.MQTT.Client(host, Number(port), clientID);
      // Set callback handlers
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

function onFail() {
  document.getElementById("messages").innerHTML = 'ERROR!'
}  

let topic_1 ="amjad.alakrami@abbindustrigymnasium.se/car";
let topic_2 ="amjad.alakrami@abbindustrigymnasium.se/speed";
let topic_3 ="amjad.alakrami@abbindustrigymnasium.se/speed1"
// Called when the client connects
function onConnect() {
   // Fetch the MQTT topic from the form
  console.log(topic_1);
   // Subscribe to the requested topic
    client.subscribe(topic_1);
    client.subscribe(topic_2);
    client.subscribe(topic_3);
    message= new Paho.MQTT.Message();
    message.destinationName=topic_1;
    client.send(message);
}

function onSend() {
  var input = document.getElementById("newMessage");
  input.onkeyup = function(event) {
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
    // Fetch the MQTT topic from the form
    // Print output for the user in the messages div


// Called when the client loses its connection
function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML = 'ERROR!';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML = '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    }
}

// Called when a message arrives
function onMessageArrived(message) {

  console.log("onMessageArrived: " + message.payloadString);
  if (message.payloadString[0]=="{") {
    
  var info = JSON.parse(message.payloadString);
  
  }
  
  if (message.destinationName == topic_2){
    document.getElementById("PWMD").innerHTML = "David PWM" + "<br>" + info.pwm;
    adddata(info.speedo, 0);
  }
  if (message.destinationName == topic_3){
    document.getElementById("PWMA").innerHTML = "Amjad PWM" + "<br>" + info.pwm;
    adddata(info.speedo,  2);
  }
}
// Called when the disconnection button is pressed


function onInput (){
    var slider = document.getElementById("myRange");
    var output = document.getElementById("f");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
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

function adddata(data, index){
  var d = new Date();
  var n = d.getSeconds();
  if (myLineChart.data.labels.length > 10){
  myLineChart.data.labels.shift();
  myLineChart.data.datasets[index].data.shift();
  myLineChart.data.datasets[1].data.shift();
  myLineChart.data.datasets[index].data.push(data);
  myLineChart.data.datasets[1].data.push( document.getElementById("myRange").value);
  myLineChart.data.labels.push(n);
  myLineChart.update();
  }
  else{
    myLineChart.data.datasets[index].data.push(data);
    myLineChart.data.datasets[1].data.push( document.getElementById("myRange").value);
    myLineChart.data.labels.push(n);
    myLineChart.update();
  }
}


var myLineChart = null;

function chart(){
  var canvas = document.getElementById('Chart');
  var data = {
  labels: [],
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
    // data1: data1
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