const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books))
//   return res.status(300).json({message: "Yet to be implemented"});
});

function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

public_users.get('/', function (req, res) {
    getBooks().then((books) => res.send(JSON.stringify(books)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  if (books[ISBN]){
      res.send(books[ISBN])
  }
  else{
      res.send("Unable to find book")
  }
//   return res.status(300).json({message: "Yet to be implemented"});
 });

 function getISBN(ISBN) {
    return new Promise((resolve, reject) => {
        const isbn = parseInt(ISBN)
        if (books[isbn]){
            resolve(books[isbn]);
        }
        else {
            reject({status:404, message:`ISBN ${ISBN} not found`});
        }
    });
}

public_users.get('/isbn/:isbn', function (req, res) {
    getISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  authored = []
  for (book in books){
    if (books[book]["author"] === author){
        authored.push(books[book])
    }
  }
  res.send(authored)
//   return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((ISBN) => Object.values(ISBN))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
  //   return res.status(300).json({message: "Yet to be implemented"});
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  for (book in books){
      if (books[book]["title"] === title){
          res.send(books[book])
      }
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((ISBN) => Object.values(ISBN))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
  //   return res.status(300).json({message: "Yet to be implemented"});
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    if (books[ISBN]){
        res.send(books[ISBN]["reviews"])
    }
    else{
        res.send("Unable to find book")
    }
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
