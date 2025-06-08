
import cron from 'node-cron';
import mongoose from 'mongoose';



export const nintyDays = async (modelast_name: any) => {
    cron.schedule('* * * * *', async () => {
        const result = await modelast_name.deleteMany({
            isDeleted: true,
            updatedAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        });
    });
}


