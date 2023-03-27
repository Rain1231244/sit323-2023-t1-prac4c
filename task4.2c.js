const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecret = 'My-secret-key'; // secret key 

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  // query database to find the user with the given id
  const user = { id: jwtPayload.id }; // Replace this with your own user data
  
  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
}));

const authenticate = passport.authenticate('jwt', { session: false });

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This route is protected'+req.user.id });
});

app.post('/login', (req, res) => {
    // query database to find the user with the given credentials


   //password=req.params.password
    id=req.query.id
    const user = {
      id: req.query.id
    }
    
    if (user.id=="1234") {
      const token = jwt.sign({ id: user.id }, jwtSecret,{ expiresIn: '60s' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

