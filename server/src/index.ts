import express from "express"
import dotenv from "dotenv";
import bodyParser  from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();
const app = express();
app.use (express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use("/dashboard", dashboardRoutes); // http://loacalhoast:8000/dashboard


const port = process.env.PORT || 3001;
app.listen(port, () =>{
    console.log('server running on port ', port);
});
