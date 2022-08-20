const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect('/login');
      }

      bcrypt.compare(password, user.password)
        .then(result => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log("🚀 ~ file: auth.js ~ line 27 ~ err", err)
              res.redirect('/');
            });
          }
          return res.redirect('/login')

        })
        .catch(error => {
          console.log("🚀 ~ file: auth.js ~ line 36 ~ error", error)

          return res.redirect('/login');
        })

    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.redirect('/signup')
      } else {
        if (password !== passwordConfirmation) {
          return res.redirect('/signup')
        } else {
          return bcrypt.hash(password, 12)
            .then(hashedPassword => {
              const user = new User({
                name,
                email,
                password: hashedPassword,
                cart: { items: [] }
              })
              return user.save()
            }).then(result => {
              res.redirect('/login')
            })
        }
      }
    })

    .catch(error => {
      console.log(error)
    })
};