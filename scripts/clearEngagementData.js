import 'dotenv/config';
import mongoose from 'mongoose';
import connectDatabase from '../src/config/database.js';
import Activity from '../src/models/Activity.js';
import Interaction from '../src/models/Interaction.js';
import Lead from '../src/models/Lead.js';

const confirmation = '--confirm=DELETE_INTERACTIONS_AND_LEADS';
const activityQuery = { type: { $in: ['INTERACTION_RECORDED', 'LEAD_CREATED'] } };

const clearEngagementData = async () => {
  await connectDatabase();
  const [interactions, leads, activities] = await Promise.all([
    Interaction.countDocuments(),
    Lead.countDocuments(),
    Activity.countDocuments(activityQuery),
  ]);

  console.info(`Interactions: ${interactions}`);
  console.info(`Leads: ${leads}`);
  console.info(`Related activities: ${activities}`);

  if (!process.argv.includes(confirmation)) {
    console.info('Dry run only. No data was deleted.');
    console.info(`Run again with ${confirmation} to permanently delete these records.`);
    return;
  }

  const session = await mongoose.startSession();
  try {
    let results;
    await session.withTransaction(async () => {
      const interactionResult = await Interaction.deleteMany({}, { session });
      const leadResult = await Lead.deleteMany({}, { session });
      const activityResult = await Activity.deleteMany(activityQuery, { session });
      results = { interactions: interactionResult.deletedCount, leads: leadResult.deletedCount, activities: activityResult.deletedCount };
    });
    console.info(`Deleted ${results.interactions} interactions, ${results.leads} leads, and ${results.activities} related activities.`);
  } finally {
    await session.endSession();
  }
};

clearEngagementData()
  .catch((error) => { console.error('Unable to clear engagement data:', error.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
