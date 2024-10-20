const express =require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;
const connection = require('./db');
//Middlware
app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res)=>{
    const sql = 'SELECT *FROM producto';
    connection.query(sql,(err, results)=>{
        if(err){
            console.log('Error en la consulta de productos',err);
            return res.status(500).send('Error del servidor');
        }else{
            res.status(200).send(results);
        }
    });
});
app.get('/api/products/:id', (req, res)=>{
    const {id} =  req.params;
    const sql = 'SELECT *FROM producto where idproducto = ?';
    connection.query(sql,[id],(err, results)=>{
        if(err){
            console.log('Error en la consulta de productos',err);
            return res.status(500).send('Error del servidor');
        }else{
            res.status(200).send(results);
        }
    });
});
app.post('/api/products', (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    const query = 'INSERT INTO  producto (nombre, precio, cantidad) VALUES (?, ?, ?)';
    
    connection.query(query, [nombre, precio, cantidad], (err, results) => {
      if (err) {
        console.error('Error al insertar producto:', err);
        return res.status(500).send('Error en el servidor');
      }
      res.status(201).send({ nombre, precio, cantidad});
    });
  });

  // Actualizar (PUT)
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, cantidad } = req.body;
    const query = 'UPDATE producto SET nombre = ?, precio = ?, cantidad = ? WHERE idproducto = ?';
    
    connection.query(query, [nombre, precio, cantidad, id], (err, results) => {
      if (err) {
        console.error('Error al actualizar producto:', err);
        return res.status(500).send('Error en el servidor');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Producto no encontrado');
      }
      res.status(200).send({ id, nombre, precio, cantidad });
    });
  });
  
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM producto WHERE idproducto = ?';
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar producto:', err);
        return res.status(500).send('Error en el servidor');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Producto no encontrado');
      }
      res.status(200).send('Producto eliminado');
    });
  });
  

app.listen(PORT, ()=>{
    console.log(PORT);
});