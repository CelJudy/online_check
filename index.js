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
    //console.log("usuario conectado", socket.handshake.query.user);
    //console.log("ips", ips);
    //console.log("ip", socket.handshake.address);

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

    /* if(ips.indexOf(socket.handshake.address)<0){
        ips.push(socket.handshake.address);
        //console.log("ips conectadas", ips);
        if(socket.handshake.query.user!="celeste"){
            io.emit('online', socket.handshake.query.user);
        }
    } */

        /* if(socket.handshake.query.user!="celeste"){
            io.emit('online', socket.handshake.query.user);
        } */

    socket.on('disconnect', ()=>{
        if(socket.handshake.query.user!="celeste"){
            alumnos[socket.handshake.query.user].online=false;
            alumnos[socket.handshake.query.user].ip="";
            io.emit('offline', socket.handshake.query.user);
        }
        //console.log(alumnos);
        /* const index=ips.indexOf(socket.handshake.address);
        //console.log("antes de eliminar", ips);
        //console.log("index", socket.handshake.address);
        if(index>=0){
            ips.splice(index, 1);
            //console.log("despues de eliminar", ips);
        } */
    });

    

    /* socket.on('online', (value)=>{
        console.log("online", value);
    }); */
    
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