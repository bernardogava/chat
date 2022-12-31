const express = require('express')
const app = express()
const path = require('path')

const { Server } = require("socket.io")
const io = new Server(
  app.listen(process.env.PORT || 3000)
)

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

let mensagens = []

io.on('connection', (socket) => {
  socket.on('entrou', arg => {
    socket.broadcast.emit('login', arg)
    mensagens.push({
      type: 'login',
      data: arg
    })
  })
  socket.emit('mensagensAntigas', mensagens)
  console.log('a user connected')
  socket.on('sendMsg', arg => {
    mensagens.push({
      type: 'msg',
      data: arg
    })
    socket.broadcast.emit('receberMsg', arg)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})