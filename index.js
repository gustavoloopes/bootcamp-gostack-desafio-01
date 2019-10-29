const express = require('express');

const server = express();

server.use(express.json());

// Query Params = ?teste=1
// Route params = /users/1
// Request Body = { "nome" = "Gustavo", "email" = "gustavoloopes@gmail.com" }

// CRUD = Create, Read, Update, Delete

const users = ['Joao', 'Luiz', 'Lopes'];

// Middleware Global
server.use((req, res, next) =>{
	console.time('Request');
	console.log(`Método: ${req.method}; URL: ${req.url}`);

	next();

	console.timeEnd('Request');
});

//Middleware local
function CheckUserExists(req, res, next) {
	if (!req.body.name) {
		return res.status(400).json({ error: 'User name is require'});
	}

	return next();
}

function CheckUserInArray(req, res, next) {
	const user = users[req.params.index];

	if (!user) {
		return res.status(400).json({ error: 'User does not exists'});
	}

	req.user = user; 

	return next();
}

//Buscar todos os usuários
server.get('/users/', (req, res) => {
  return res.json(users);
});

//Buscar um usuário
server.get('/users/:index', CheckUserInArray, (req, res)=>{    
    return res.json(req.user);
});

//Criar novo usuário
server.post('/users/', CheckUserExists, (req, res) =>{
    const { name } = req.body;
    
    users.push(name);

    return res.json(users);
});

// Editar usuário
server.put('/users/:index', CheckUserInArray, CheckUserExists, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
});

// Delete usuário
server.delete('/users/:index', CheckUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.send();
});

server.listen(300);