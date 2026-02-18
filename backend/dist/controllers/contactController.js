"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const contactService_1 = __importDefault(require("../services/contactService"));
const zod_1 = require("zod");
const validator_1 = require("../middleware/validator");
const createContactSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().optional(),
        subject: zod_1.z.string().optional(),
        message: zod_1.z.string().min(1),
    }),
});
class ContactController {
    constructor() {
        this.create = [
            (0, validator_1.validate)(createContactSchema),
            async (req, res, next) => {
                try {
                    const message = await contactService_1.default.create(req.body);
                    res.status(201).json(message);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.getAll = async (req, res, next) => {
            try {
                const read = req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const includeInactive = req.query.includeInactive === '1' || req.query.includeInactive === 'true';
                const result = await contactService_1.default.getAll({ read, page, limit, includeInactive });
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const message = await contactService_1.default.getById(id);
                res.json(message);
            }
            catch (error) {
                next(error);
            }
        };
        this.markAsRead = async (req, res, next) => {
            try {
                const { id } = req.params;
                const message = await contactService_1.default.markAsRead(id);
                res.json(message);
            }
            catch (error) {
                next(error);
            }
        };
        this.markAsReplied = async (req, res, next) => {
            try {
                const { id } = req.params;
                const message = await contactService_1.default.markAsReplied(id);
                res.json(message);
            }
            catch (error) {
                next(error);
            }
        };
        this.toggleActive = async (req, res, next) => {
            try {
                const { id } = req.params;
                const result = await contactService_1.default.toggleActive(id);
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ContactController = ContactController;
exports.default = new ContactController();
//# sourceMappingURL=contactController.js.map