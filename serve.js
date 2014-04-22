var st = require('st')
var http = require('http')
var open = require('open')

http.createServer(
  st({ path: process.cwd(), cache: false })
).listen(1337)

open('http://localhost:1337/index.html')
