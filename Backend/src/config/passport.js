const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

// src/config/passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://devtinder-tyfl.onrender.com/auth/google/callback", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;

        let user = await User.findOne({
          $or: [{ googleId: googleId }, { emailId: email }]
        });

        if (user) {
          if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }
          return done(null, user);
        }

        const newUser = new User({
          googleId: googleId,
          emailId: email,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          photoUrl: "https://imgs.search.brave.com/Ix1-GRkxAk-RaWwN4ipJrGWovxPjIOpdZ-zGHKDlpyY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzgv/MjkxLzI0NC9zbWFs/bC9mbGF0LXNpbGhv/dWV0dGUtdXNlci1o/ZWFkLWFuZC1zaG91/bGRlcnMtYXZhdGFy/LWdyYXBoaWMtaWNv/bi12ZWN0b3IuanBn",
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        console.error("Passport Error:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;