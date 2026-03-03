const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    entity: {
        type: String,
        required: true
    },
    entity_id: {
        type: Number,
        required: true
    },
    action: {
        type: String,
        enum: ['DELETE'],
        required: true
    },
    old_data: {
        type: Object,
        required: true
    },
    performed_by: {
        type: String,
        default: 'system'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog',
    auditLogSchema);