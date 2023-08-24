import express from "express";
import multer from "multer";
import path from "path";
import prodsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/cart.routes.js"
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import { Server } from "socket.io";

const app = express();
const PORT = 8080;

//Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
});

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


//Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
app.use("/static", express.static(path.join(__dirname, "/public")));
const upload = multer({storage: storage});

//Server Socket.io
const io = new Server(serverExpress)

io.on("connection", (socket) => {
    console.log("Server Socket.io connected");
    socket.on("messageConnection", (info) => {
        console.log(info);
    });
});

//Routes:
app.use("/api/products", prodsRouter);
app.use("/api/carts", cartsRouter);
app.get("/static", (req, res) => {
    res.render("home", {
        nombre: "lucas"
    }) 
});    
// console.log(__dirname + "/public");
// console.log(path.join(__dirname, "/public"));

app.post("/upload", upload.single("product"), (req,res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Image loaded")
 }) 


