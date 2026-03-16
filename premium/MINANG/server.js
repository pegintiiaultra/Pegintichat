const express=require("express")
const http=require("http")
const {Server}=require("socket.io")
const fs=require("fs")

const app=express()
const server=http.createServer(app)
const io=new Server(server)

app.use(express.static("public"))
app.use(express.json())

const users={
admin:{avatar:"👑"},
pasteur:{avatar:"✝️"},
etudiant:{avatar:"📚"},
missionnaire:{avatar:"🌍"}
}

let messages=JSON.parse(fs.readFileSync("data/messages.json"))

function save(){
fs.writeFileSync("data/messages.json",JSON.stringify(messages,null,2))
}

io.on("connection",socket=>{

socket.on("join",room=>{
socket.join(room)
})

socket.on("msg",data=>{

const user=users[data.user]||{avatar:"👤"}

const msg={
id:Date.now(),
room:data.room,
user:data.user,
avatar:user.avatar,
text:data.text
}

messages.push(msg)
save()

io.to(data.room).emit("msg",msg)

})

})

server.listen(3005,"0.0.0.0",()=>{
console.log("MINANG v2 actif http://localhost:3005")
})
