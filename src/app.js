import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import viewRouter from './routes/views.router.js'
import { Server } from 'socket.io';
import http from 'http';



const app= express();
const PORT=8080;
const server = http.createServer(app);
const io = new Server(server);

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// configuración de HBs
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+"/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"))


// declaracion de router

app.use('/', viewRouter)

const httpServer=app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})

const socketServer = new Server(httpServer)

const products=('..data/public/js/products.js')

io.on('connection',(socket)=>{
    console.log('Un cliente se ha conectado')
    socket.on('updateProduct',(data)=>{
        const index=products.findIndex(p=>p.id===data.id)
        if(index>-1){
            products[index]=data
            io.emit('updateProducts',products)
        }
    })

    socket.on('disconnect',()=>{
        console.log('Un cliente se ha desconectado')
    })

    socket.on('getProducts',()=>{
        socket.emit('updateProducts',products)
    })

    socket.on('addProduct',(data)=>{
        data.id=v4()
        products.push(data)
        io.emit('updateProducts',products)
    })

    socket.on('deleteProduct',(id)=>{
        const index=products.findIndex(p=>p.id===id)
        if(index>-1){
            products.splice(index,1)
            io.emit('updateProducts',products)
        }

    })
})