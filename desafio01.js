const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

// Middleware Global

/** 
**Contador de Requisições
*/
let contReq = 0;

server.use((req, res, next) => {
  next();
  contReq++;
  console.log(`Número de Requisições: ${contReq}`);
})

server.use((req, res, next) =>{
	console.time('Request');
	console.log(`Método: ${req.method}; URL: ${req.url}`);

	next();

	console.timeEnd('Request');
});

/*
* Middleware local que verifica se o projeto já existe
* 
*/
function CheckProjectExists(req, res, next) {
	  
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

	return next();
}

// CRUD = Create, Read, Update, Delete

/**
* Query Params = ?id=1
* Route params = /projects/1
* Request Body = { 
    "id" = "1", 
    "title" = "Primeiro Projeto", 
    "task" = ["Primeira Tarefa"] 
  }
* 
* Criar novo projeto
* 
* Request Body: id, title
*/ 
server.post('/projects/', (req, res) =>{
  const { id, title } = req.body;
  
  const project = {id, title, tasks: [] };

  projects.push(project);

  return res.json(projects);
});

//Retorna todos os projetos
server.get('/projects/', (req, res) => {
  return res.json(projects);
});

/**
 *  Editar Projeto
 * 
 * Route params:id
 * Request body: title
 */

server.put('/projects/:id', CheckProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);

    project.title = title;

    return res.json(project);
});

/**
 * Deletar usuário
 * 
 * Route Params: id
 */

server.delete('/projects/:id', CheckProjectExists, (req, res) => {
    const { id } = req.params;

    const pIndex = projects.findIndex(p => p.id == id);

    projects.splice(pIndex, 1);

    return res.send();
});

/**  
 * Adicionar novas tarefas
 * 
 * Route Params: id
 * Request Body: title
*/


server.post('/projects/:id/tasks', CheckProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

//Iniciando o servidor na porta: 3001
server.listen(3001);