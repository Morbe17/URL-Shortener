import mongoose from 'mongoose';

const RedirectSchema = mongoose.model('Redirect', new mongoose.Schema({
    createdAt: Date,
    deletedAt: Date,
    redirectAddress: String,
    code: { type: String, unique: true }
}));

export default RedirectSchema;