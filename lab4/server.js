//uvoz modula
const { join } = require("path");
const express = require("express");

const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const { pool } = require("./db");

const app = express();

//uvoz modula s definiranom funkcionalnosti ruta
const homeRouter = require("./routes/home.routes");
const orderRouter = require("./routes/order.routes");
const loginRoute = require("./routes/login.routes");
const logoutRoute = require("./routes/logout.routes");
const signupRoute = require("./routes/signup.routes");
const cartRoute = require("./routes/cart.routes");
const userRoute = require("./routes/user.routes");
const checkoutRoute = require("./routes/checkout.routes");
const User = require("./models/UserModel");

//middleware - predlošci (ejs)
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

//middleware - statički resursi
app.use(express.static(join(__dirname, "public")));

//middleware - dekodiranje parametara
app.use(express.urlencoded({ extended: true }));

//####################### ZADATAK #######################

//pohrana sjednica u postgres bazu korštenjem connect-pg-simple modula
app.use(
  session({
    store: new PgSession({ pool }),
    secret: "pero123",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
  })
);

//#######################################################

//definicija ruta
app.use("/", homeRouter);
app.use("/order", orderRouter);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/signup", signupRoute);
app.use("/cart", cartRoute);
app.use("/user", userRoute);
app.use("/checkout", checkoutRoute);

//pokretanje poslužitelja na portu 3000
app.listen(3000, () => {
  console.log("Up on http://localhost:3000/");
});
