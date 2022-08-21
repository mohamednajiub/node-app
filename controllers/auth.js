const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');


// username + password
var options = {
  auth: {
    api_key: process.env.SEND_GRID_API_KEY
  }
}

var mailer = nodemailer.createTransport(sgTransport(options));


exports.getLogin = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
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
          req.flash('error', 'Invalid email or password.')
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
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
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
        req.flash('error', 'E-mail exists already. please check it and try again.')
        return res.redirect('/signup')
      } else {
        if (password !== passwordConfirmation) {
          req.flash('error', 'Password & password Confirmation doesn\'t match please check them and try again.')
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
              return mailer.sendMail({
                to: email,
                from: 'mohamed.najiub@webkeyz.com',
                subject: 'Signup completed',
                html: `
                  <h1>You Successfully signed up!</h1>
                `
              })
            }).then(emailSent => {

              res.redirect('/login')
            }).catch(error => {
              console.log(error)
            })
        }
      }
    })

    .catch(error => {
      console.log(error)
    })
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
      return res.redirect('/reset')
    }

    const token = buffer.toString('hex')

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No Account with that email found.')
          return res.redirect('/reset')
        }
        user.userToken = token
        user.resetTokenExpiration = Date.now() + 3600000;

        return user.save()

      }).then((result) => {
        res.redirect('/')
        mailer.sendMail({
          to: req.body.email,
          from: 'mohamed.najiub@webkeyz.com',
          subject: 'Password Reset',
          html: `
            <p>You requested a password reset!</p>
            <p>Click this <a href="${req.protocol}://${req.headers.host}/reset/${token}">link</a> to set a new password</p>
            <p>Please note that this link will be valid for only 1 hour</p>
          `
        })
      }).catch(error => {
        console.log(error)
      })
  })
};