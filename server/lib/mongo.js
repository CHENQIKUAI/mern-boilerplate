const config = require('config-lite')(__dirname);//读取配置
const mongoose = require('mongoose');
const sha1 = require("sha1")
mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', (err, doc) => {
    console.log('mongodb connected success')
});

// users
const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: {
        type: String, required: true,
        set(val) {
            return sha1(val);
        }
    },
})
const userModel = mongoose.model("user", userSchema);


exports.userModel = userModel;