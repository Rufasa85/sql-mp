require("dotenv").config();
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3000;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: process.env.DB_USER,
    // TODO: Add MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the books_db database.`)
);

app.get("/api/movies",(req,res)=>{
   db.query("SELECT * FROM movies",(err,data)=>{
    if(err){
        console.log(err);
        return res.status(500).json({msg:'oh no!',err:err})
    }
    res.json(data);
   })
})
app.get("/api/reviews",(req,res)=>{
   db.query("SELECT movie_name AS title,review FROM movies JOIN reviews ON reviews.movie_id=movies.id",(err,data)=>{
    if(err){
        console.log(err);
        return res.status(500).json({msg:'oh no!',err:err})
    }
    res.json(data);
   })
})
app.post("/api/reviews",(req,res)=>{
    db.query("INSERT INTO reviews(movie_id,review)VALUES(?,?)",[req.body.movie_id,req.body.review],(err,data)=>{
     if(err){
         console.log(err);
         return res.status(500).json({msg:'oh no!',err:err})
     }
     res.json(data);
    })
 })
app.put("/api/reviews/:id",(req,res)=>{
    db.query("UPDATE reviews SET review = ? WHERE id = ?",[req.body.review,req.params.id],(err,data)=>{
     if(err){
         console.log(err);
         return res.status(500).json({msg:'oh no!',err:err})
     }
     res.json(data);
    })
 })

app.post("/api/movies",(req,res)=>{
   db.query("INSERT INTO movies(movie_name)VALUES(?)",[req.body.movie_name],(err,data)=>{
    if(err){
        console.log(err);
        return res.status(500).json({msg:'oh no!',err:err})
    }
    res.json(data);
   })
})
app.delete("/api/movies/:id",(req,res)=>{
   db.query("DELETE FROM movies WHERE id=?",[req.params.id],(err,data)=>{
    if(err){
        console.log(err);
        return res.status(500).json({msg:'oh no!',err:err})
    }
    if(data.affectedRows===0){
        return res.status(404).json({msg:"no such movie found!"})
    }
    res.json(data);
   })
})

app.listen(PORT,()=>{
    console.log(`listenin on port ${PORT}!`)
})