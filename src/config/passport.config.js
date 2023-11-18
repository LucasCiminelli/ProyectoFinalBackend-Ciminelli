import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import { userModel } from "../dao/models/user.model.js";
import CartManager from "../dao/database/cartManager.js";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
// import { JWT_PRIVATE_KEY } from "./constans.config.js";
import cookieExtractor from "../helpers/cookieExtractor.js";
import dotenv from "dotenv";

dotenv.config();

const cartManager = new CartManager()

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          const exists = await userModel.findOne({ email: username });
          if (exists) {
            return done(null, false);
          }

          const user = await userModel.create({
            first_name,
            last_name,
            age,
            email: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          });

          const cart = await cartManager.createCart();

          user.cart = cart._id;

          await user.save();

          console.log(user);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            return done(null, false);
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: process.env.GITHUB_SCOPE.split(","),
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await userModel.findOne({ email });

          if (!user) {
            const newUser = await userModel.create({
              first_name: profile._json.name,
              last_name: "",
              age: "",
              password: "",
              email,
            });
            return done(null, newUser);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  const JWTStrategy = jwt.Strategy;
  const ExtractJWT = jwt.ExtractJwt;

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          const user = await userModel.findById(jwt_payload.userId).lean();
          console.log(user);

          if (!user) {
            return done(null, false);
          }
          console.log(process.env.JWT_PRIVATE_KEY);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
