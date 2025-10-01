const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const path = require("path");
const compression = require("compression");
const cors = require("cors");

const config = require("./config/config");
const morgan = require("./config/morgan");
const zuperrRoutes = require("./routes/zuperr.routes");
const employeeroutes = require("./routes/employee/employee.route");
const dashboadRoutes = require("./routes/dashboard/employer.dashboard");
const employeerRoutes = require("./routes/employer/employer.routes");
const notificationRoutes = require("./routes/employer/notification.routes");
const candidateRoutes = require("./routes/candidate/candidate.route");
const { connectToDb } = require("./config/config");
const { passport } = require("./config/config");

const app = express();
const server = http.createServer(app); // 👈 Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: [
      "https://165.232.176.179:8080",
      "https://uat.zuperr.co",
      "http://localhost:9000",
      "https://uat-api.zuperr.co",
    ],
  },
});

// 👇 Setup socket handling
const setupSocket = require("./socket/socketHandler");
setupSocket(io); // Pass Socket.io instance to your handler

// Make io accessible globally (optional, for emit inside controllers)
app.set("io", io);

// Logger
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(compression());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: [
      "https://165.232.176.179:8080",
      "https://uat.zuperr.co",
      "http://localhost:9000",
      "https://uat-api.zuperr.co",
    ],
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", employeeroutes); // Already includes employee & employer auth
app.use("/", zuperrRoutes);
app.use("/api/dashboard", dashboadRoutes);
app.use("/api/employee", employeeroutes);
app.use("/api/employer", employeerRoutes);
app.use("/api/employer/notification", notificationRoutes);
app.use("/api/candidate", candidateRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "public", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "build", "index.html"));
});

// Connect to DB
connectToDb();

// Start server with socket
const port = config.port || 5000;
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
