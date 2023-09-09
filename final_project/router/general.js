const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const userExist = (username)=>{
  return users.some((user)=> user.username === username);
}

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.query.username;
  const password = req.query.password;
  if (username && password) {
    if(userExist(username)){
      return res.status(404).json({message: "User already exists!"});
    }
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "User successfully registred. Now you can login"});
  }
  return res.status(404).json({message: "Username or password are not provided."});
});

const getBooks = () => {
  return new Promise((resolve) =>{
    setTimeout(() => {
      resolve(books)
    },2000)
  });
}

//Task 1. Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //List of books available in the shop;
  /*const list = getBooks().then((result) => {
    res.send(result);
  });*/
  res.send(JSON.stringify({books},null,4));
});

// Task 2. Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  console.log("isbn=>",isbn);
  let booksFiltered = Object.entries(books).filter(([key, value]) => key == isbn).map(([key, value]) => value);
  res.send(booksFiltered);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Task 3. Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;
  console.log("author=>",author);
  let booksFiltered = Object.values(books).filter((book)=>book.author.toLowerCase().includes(author.toLowerCase()));
  res.send(booksFiltered);
});

// Task 4. Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  console.log("title=>",title);
  let booksFiltered = Object.values(books).filter((book)=>book.title.toLowerCase().includes(title.toLowerCase()));
  res.send(booksFiltered);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  console.log("isbn=>",isbn);
  let booksFiltered = Object.entries(books).filter(([key, value]) => key == isbn).map(([key, value]) => value.reviews);
  res.send(booksFiltered);
});

module.exports.general = public_users;
