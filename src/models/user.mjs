import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String,  required: true },
    password: { type: String, required: true },
    member: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
});

userSchema.virtual('profile').get(function () {
    return `/user/${this._id}`;
});

userSchema.virtual('delete').get(function () {
    return `/user/${this._id}/delete`;
});

export default mongoose.model('User', userSchema);
