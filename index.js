const express = require("express");
const {Server}=require("socket.io");
const {createServer}=require("node:http");
const app=express();
const server=createServer(app);
const io=new Server(server);
app.use(express.json());

const cors=require("cors");
app.use(cors());

app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");  
let alumnos=require("./alumnos.json");

io.on('connection', (socket)=>{

    if(socket.handshake.query.user=="celeste"){
        io.emit('list', alumnos);
    }else{
        if(alumnos.find((item)=>item.ip==socket.handshake.address)===undefined){
            alumnos[socket.handshake.query.user].online=true;
            alumnos[socket.handshake.query.user].ip=socket.handshake.address;
            io.emit('check', 1);
            io.emit('online', socket.handshake.query.user);
        }
    }

    socket.on('disconnect', ()=>{
        if(socket.handshake.query.user!="celeste"){
            alumnos[socket.handshake.query.user].online=false;
            alumnos[socket.handshake.query.user].ip="";
            io.emit('offline', socket.handshake.query.user);
        }
    });
    
});

app.get("/", (req, res)=>{
    res.render("index",{alumnos});
});

app.get("/online", (req, res)=>{
    res.render("online", {alumnos});
});

server.listen(3000, (error)=>{
    console.log("Port 3000");
});