const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const connectDB = require('./utils/db.js');
const cookieParser = require('cookie-parser');



connectDB();
app.use(cors(
    {
        origin: [
            "http://localhost:5173",
            "https://todoexellence.netlify.app"
        ], methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());


app.use('/api/users', require('./router/userRouter.js'));
app.use('/api/todos', require('./router/todoRoutes.js'));

app.get('/', (req, res) => {
    res.send('server is running');
})



module.exports = app;