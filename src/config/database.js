import mongoose from 'mongoose';

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI must be configured before starting the API.');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  console.info('MongoDB connected');
};
export default connectDatabase;
