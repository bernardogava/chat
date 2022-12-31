const socket = io()
let Nome = ''

document.getElementById('nome').focus()

const iniciar = () => {
  const nome = String(document.getElementById('nome').value)
  if(nome.length > 0) {
    document.getElementById('notid').style.display = 'none'
    document.getElementById('divlog').style.display = 'none'
    document.getElementById('afterlog').style.display = 'block'
    const display = document.getElementById('display')
    const nomeDisplay = document.getElementById('nomeDisplay')
    nomeDisplay.style.display = 'block'
    nomeDisplay.innerHTML = 'Nome: ' + nome
    entrou(nome)
    socket.emit('entrou', nome)
    document.getElementById('msg').focus()
    Nome = nome
    document.getElementById('btn').addEventListener('click', () => {
      enviarMsg(nome)
    })

  } else {
    document.getElementById('notid').style.display = 'flex'
  }
}

const enviarNome = arg => {
  if(arg.keyCode == 13) {
    iniciar()
  }
}

document.getElementById('log').addEventListener('click', () => iniciar())

const ler = (arg) => {
  const msg = String(arg.msg)
  const display = document.getElementById('display')
  display.innerHTML += `<div class="mensagens"><strong>${arg.autor}</strong>: ${msg}</div>`
  display.scrollTop = display.scrollHeight
}

socket.on('mensagensAntigas', arg => {
  for(mensagens of arg) {
    if(mensagens.type == 'msg') {
      ler(mensagens.data)
    } else if(mensagens.type == 'login') {
      entrou(mensagens.data)
    }
  }
})

socket.on('receberMsg', arg => {
  ler(arg)
})

const entrou = (arg) => {
  document.getElementById('display').innerHTML += `<div class="mensagens" style="text-align: center;"><strong>${arg} entrou no chat</strong></div>`
}
const saiu = (arg) => {
  document.getElementById('display').innerHTML += `<div class="mensagens" style="text-align: center;"><strong>${arg} saiu do chat</strong></div>`
}

socket.on('login', arg => {
  entrou(arg)
})

const enviarMsg = (nome) => {
  const msg = String(document.getElementById('msg').value)
  if(msg.length > 0) {
    if(msg == '/clear' || msg == '/limpar') {
      document.getElementById('display').innerHTML = '<div class="mensagens" style="text-align: center;"><strong>Chat Limpo</strong></div>'
    } else {
      document.getElementById('msg').value = ''
      const data =  {
        msg: msg,
        autor: nome
      }
      ler(data)
      socket.emit('sendMsg', data)
    }
  }
}

const enviar = arg => {
  if(arg.keyCode == 13) {
    enviarMsg(Nome)
    setTimeout(() => {
      document.getElementById('msg').value = ''
    }, 10)
  }
}