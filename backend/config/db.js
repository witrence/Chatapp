const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: true,
    });

    console.log("MONGO DB connects : " + conn.connection.host);
  } catch (error) {
    console.log("ERROR" + error.message);
    process.exit();
  }
};

module.exports = connectDB;
