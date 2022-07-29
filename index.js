const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;
const AUTOKILL = process.env.AUTOKILL? parseInt(process.env.AUTOKILL) : 0;

var shouldRun = true;


function blockCpuFor(ms) {
	var now = new Date().getTime();
	var result = 0
  console.log(shouldRun)
	while(shouldRun) {
		result += Math.random() * Math.random();
		if (new Date().getTime() > now +ms)
			return;
	}	
}

var paths = [
  {loadstop: /\/load\/stop/},
  {load: /\/load\/(\d*)/}
]

const server = http.createServer((req, res) => {


  paths.forEach(path=>{
    [fn, regex] = Object.entries(path)[0];
    const matches = (req.url||'').match(regex)
    if (matches && matches.length>1){
       module[fn](...matches.splice(1))
      
    }
  })

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

module.loadstop = function(ms){
  console.log("load stop")
  shouldRun=false;
}

module.load =function(ms){
  console.log("load for"+ms)
    shouldRun = true;
    ms = parseInt(ms);
    blockCpuFor(ms)
    shouldRun = false;
}


console.log("global", module.load)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

if (AUTOKILL){
	setTimeout(function(){
	  process.exit()
	}, AUTOKILL);
}
