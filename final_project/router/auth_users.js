const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            username: username,
            data: password
        }, 'access', { expiresIn: 60 * 60});

        // Store access token and username in session
        req.session.authorization = {
            accessToken: accessToken,
            username: username
        }
        console.log(req);
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let token = req.session.authorization['accessToken'];
  if (!token){
    res.send("User not logged in");
  }
  const username = req.user.username;
  const isbn = req.params.isbn;

  // Check to see if the book exists
  if (!books[isbn]) {
    res.send("No book with isbn " + isbn);
  }

  if (req.body.review){
    // Check if its a new review or an alteration to a review already there
    if (books[isbn]['reviews'][username]){
        books[isbn]['reviews'][username] = req.body.review;
        res.send("The review has been altered.");
    } else {
        books[isbn]['reviews'][username] = req.body.review;
        res.send('The review has been created.');
    }
  } else {
    res.send("No review present.");
  }


  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let token = req.session.authorization['accessToken'];
    if (!token){
      res.send("User not logged in");
    }
    const username = req.user.username;
    const isbn = req.params.isbn;

      // Check to see if the book exists
    if (!books[isbn]) {
        res.send("No book with isbn " + isbn);
    }

    delete books[isbn]["reviews"][username];

    res.send("Deleted the review for the user " + username);


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
