import * as contentService from '../services/contentService.js';
export async function getProhibited(req, res, next) {
    try {
        const items = await contentService.getProhibitedItems();
        res.json({ success: true, data: { items } });
    }
    catch (err) {
        next(err);
    }
}
export async function addProhibited(req, res, next) {
    try {
        const item = await contentService.addProhibitedItem(req.body);
        res.status(201).json({ success: true, data: { item } });
    }
    catch (err) {
        next(err);
    }
}
export async function deleteProhibited(req, res, next) {
    try {
        await contentService.deleteProhibitedItem(req.params.id);
        res.json({ success: true, data: { deleted: true } });
    }
    catch (err) {
        next(err);
    }
}
export async function getFAQs(req, res, next) {
    try {
        const category = req.query.category;
        const faqs = await contentService.getFAQs(category);
        res.json({ success: true, data: { faqs } });
    }
    catch (err) {
        next(err);
    }
}
export async function addFAQ(req, res, next) {
    try {
        const faq = await contentService.addFAQ(req.body);
        res.status(201).json({ success: true, data: { faq } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=contentController.js.map