import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, minLength: 3, maxLength: 100, required: true  },
    password: { type: String, required: true },
    member: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    messages: [ { type: Schema.Types.ObjectId, ref: 'Message' } ]
});

export default mongoose.model('User', userSchema);