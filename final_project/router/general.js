const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          console.log(users);
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const sendBooksPromise = new Promise((resolve, reject) => {
      try {
        resolve(JSON.stringify(books)); // Resolve with the JSON string
      } catch (error) {
        reject(error);
      }
    });
  
    sendBooksPromise
      .then((jsonString) => {
        res.send(jsonString); // Send the JSON response here
      })
      .catch((error) => {
        res.status(500).send("Internal Server Error");
      });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const getBookByIsbn = new Promise ((resolve,reject) =>{
    try{
        if (books[isbn]){
            resolve (books[isbn]);
        } else {
            reject("Could not find the book with the isbn " + isbn);
        }
    } catch{
        reject(error);
    }
  });

  getBookByIsbn
    .then((book) => {
        res.send(book);
    })
    .catch((errorMessage) => {
        res.status(404).send(errorMessage);
    });
});

//   const isbn = req.params.isbn;
//   if (books[isbn]){
//     res.send(books[isbn]);
//   }
//   res.send("Could not find the book with the isbn " + isbn);
//   //return res.status(300).json({message: "Yet to be implemented"});
//  });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const booksArray = Object.entries(books);
//   let filtered = booksArray.filter(([id, book]) => book.author === author);
//   if (filtered.length > 0){
//     res.send(JSON.stringify(Object.fromEntries(filtered)));
//   } else{
//     res.send ("No books with the author " + author);
//   }
//   //return res.status(300).json({message: "Yet to be implemented"});
// });


public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksArray = Object.entries(books);
    const getBookByAuthor = new Promise ((resolve, reject) =>{
        try {
            let filtered = booksArray.filter(([id, book]) => book.author === author);
            if (filtered.length > 0) {
                resolve(JSON.stringify(Object.fromEntries(filtered)));
            } else{
                reject("No books with the author " + author);
            }
        } catch{
            reject(error);
        }
    });

    getBookByAuthor
    .then((books) => {
        res.send(books);
    })
    .catch((errorMessage) => {
        res.status(404).send(errorMessage);
    })
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   const booksArray = Object.entries(books);
//   let filtered = booksArray.filter(([id, book]) => book.title === title);
//   if (filtered.length > 0){
//     res.send(JSON.stringify(Object.fromEntries(filtered)));
//   } else{
//     res.send ("No books with the title " + title);
//   }
//   return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksArray = Object.entries(books);
    const getBooksByTitle = new Promise ((resolve, reject) => {
        try {
            let filtered = booksArray.filter(([id, book]) => book.title === title);
            if (filtered.length > 0){
                resolve (JSON.stringify(Object.fromEntries(filtered)));
            } else {
                reject("No books with the title " + title);
            }
        }
        catch{
            reject(error);
        }
    });

    getBooksByTitle
    .then((books) => {
        res.send(books);
    })
    .catch((errorMessage) =>{
        res.status(404).send(errorMessage);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    res.send(books[isbn]['reviews']);
  }
  else {
    res.send ("No book with isbn " + isbn);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
