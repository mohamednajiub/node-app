exports.getLogin = (req, res, next) => {
  const storedCookies = req.get('Cookie')

  let isLoggedIn;

  if (storedCookies) {

    const isLoggedInCookie = storedCookies.split(';').find(cookie => {
      return cookie.includes('loggedIn')
    })

    console.log('here')
    isLoggedIn = isLoggedInCookie.split('=')[1]
  }

  if (isLoggedIn === 'true') {
    console.log('here')
    res.redirect(301, '/')
  } else if (!isLoggedIn || isLoggedIn === 'false') {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: isLoggedIn
    });
  }
};

exports.postLogin = (req, res, next) => {
  req.isLoggedIn = true;
  res.cookie('loggedIn', 'true', {
    maxAge: 9000000,
    httpOnly: true
  });
  res.cookie('test1', 'true');
  res.cookie('test2', 'true');
  res.redirect('/');
};
