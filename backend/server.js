const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const cors=require('cors');
const bodyParser = require('body-parser');
const { errorHandler } = require('./middlewares/errorMiddleware');
const path = require('path');





connectDB();

const app = express();
app.set("view engine", "ejs");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/api/users', require('./routes/userRoutes'));


// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
  
    app.get('*', (req, res) =>{
      res.sendFile(
        path.join(__dirname, "../frontend/build/index.html"),
        function (err){
            res.status(500).send(err);
        }
      );
});
  } else {
    app.get('/', (req, res) => res.send('Please set to production'));
  }

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));