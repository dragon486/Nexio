import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/nexio', { useNewUrlParser: true, useUnifiedTopology: true });

const businessSchema = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    onboardingCompleted: Boolean,
});
const Business = mongoose.model('Business', businessSchema);

async function inspect() {
    try {
        const doc = await Business.findOne({});
        console.log("Business document:");
        console.log(JSON.stringify(doc, null, 2));
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
}
inspect();
