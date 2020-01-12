const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// User model
const User = require('../models/User');

// TODO: move this into env properties
const secret = 'some secret key';

router.post('/register', (req, res) => {
   const { name, email, password, confirmPassword } = req.body;
   const errors = [];

   if (!name || !email || !password || !confirmPassword) {
       errors.push({ msg: 'Please fill in all required fields'});
   }

   if (password !== confirmPassword) {
       errors.push({ msg: 'Passwords do no match' });
   }

   if (password.length < 6) {
       errors.push({ msg: 'Password should be at least 6 characters' });
   }

   if (errors.length) {
       res.send(errors);
   } else {
       User.findOne({ email })
           .then(user => {
               if (user) {
                   errors.push({ msg: 'Email is already registered'});
                   res.send(errors);
               } else {
                   const newUser = new User({
                       name,
                       email,
                       password
                   });

                   // Hash password
                   bcrypt.genSalt(10, (err, salt) => {
                       bcrypt.hash(newUser.password, salt, (err, hash) => {
                           if (err) throw err;
                           // Set password to hash
                           newUser.password = hash;

                           // Save user to db
                           newUser.save()
                               .then(user => res.redirect('/login'))
                               .catch(err => console.log(err))
                       });
                   });
               }
           });
   }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then( user => {
            if (!user) {
                res.status(401)
                    .json({ error: 'Incorrect username or password' });
            } else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        res.status(500)
                            .json({ error: 'Internal server error' });
                    } else if (!isMatch) {
                        res.status(401)
                            .json({ error: 'Incorrect username or password'});
                    } else {
                        // Issue token
                        const payload = { email };
                        const user = jwt.sign(payload, secret, { expiresIn: '20min'});
                        res.cookie('user', user)
                            .redirect('/chat');
                    }
                });
            }
        });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.user);
    res.json(req.user);
});

module.exports = router;