const express = require('express') 
const app = express() 
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend origin
};
app.use(cors());
app.use(cors(corsOptions));

app.get("/api", (req, res) => {
  res.json({"users": ['userOne', 'userTwo']})
})

app.listen(3001, () => {console.log("Server started on port 3001")})
