const migrationService = require('../services/migration.service');

exports.importCSV = async (req, res) => {
    try {
        await migrationService.importCSV();
        res.status(200).json({ message: 'Migration completed successfully' });
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};