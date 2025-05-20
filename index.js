const express = require('express');

//instantiate server
const server = express();

// Middleware de logging
server.use((req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

//Body parser configuration
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//import routes
const tacheRoutes = require('./controllers/tacheCtrl');
const authRoutes = require('./controllers/usersCtrl');

//configure routes
server.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Hello World on my server gestion tâche</h1>');
});
//others routes
server.use('/api/tache', tacheRoutes);
server.use('/api/auth', authRoutes);


//launch server
server.listen(8080, function () {
    console.log('Server is up and running on port 8080');
});