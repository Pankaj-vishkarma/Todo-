const app = require('./app.js');
const validateEnv = require("./config/validateEnv");

validateEnv();

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});