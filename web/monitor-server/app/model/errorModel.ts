module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    user: {
      name: String,
      cName: String,
      phone: String,
      id: Number
    },
    creatTime: String,
    ip: String,
    date: Number,
    city: String,
    path: String,
    type: Number,
    system: Number,
    errorMessage: String,
    fileUrl: String,
    domain: String,
    browser: String,
    lineNumber: Number,
    columnNumber: Number,
    httpCode: Number,
    errorObj: Schema.Types.Mixed
  });
  return mongoose.model('ErrorModel', PostSchema);
};
