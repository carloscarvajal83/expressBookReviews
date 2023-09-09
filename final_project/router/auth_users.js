const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: password},"access",{ expiresIn: 60 * 60 });
    req.session.authorization = { accessToken,username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Task 8. Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const userName = req.session?.authorization["username"];
  const review = req.body?.review;
  const isbn = req.params.isbn;
  if(!(review && review.length > 0)){
    return res.status(400).json({ message: "review must be provided"});
  }
  let booksFiltered = Object.entries(books).filter(([key, value]) => key == isbn).map(([key, value]) => value);
  if(!(booksFiltered.length > 0)){
    return res.status(404).json({ message: "Book with Isbn not found" });
  }
  let reviewObj = booksFiltered[0].reviews;
  if(reviewObj[userName]){
    reviewObj[userName].value = review;
  }else{
    reviewObj[userName] = {value: review};
  }
  return res.status(200).json(reviewObj);
  //return res.status(300).json({ message: "Yet to be implemented" });
});


// Task 9. Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const userName = req.session?.authorization["username"];
  const isbn = req.params.isbn;
  let booksFiltered = Object.entries(books).filter(([key, value]) => key == isbn).map(([key, value]) => value);
  if(!(booksFiltered.length > 0)){
    return res.status(404).json({ message: "Book with Isbn not found" });
  }
  let reviewObj = booksFiltered[0].reviews;
  if(reviewObj[userName]){
    delete reviewObj[userName];
  }
  return res.status(200).json(reviewObj);
  //return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
