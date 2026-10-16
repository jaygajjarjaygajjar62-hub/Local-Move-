import { db } from '../config/db.js';
import { getDrivers } from './driverService.js';
import { getOrders } from './orderService.js';
export async function getAdminOverview() {
    const orders = await getOrders({});
    const drivers = await getDrivers();
    const activeOrders = orders.filter((o) => ['searching_driver', 'driver_assigned', 'arrived_at_pickup', 'picked_up', 'in_transit', 'arrived_at_drop'].includes(o.status));
    const onlineDrivers = drivers.filter((d) => d.isOnline);
    const pendingDrivers = drivers.filter((d) => d.status === 'pending');
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.fare.totalCustomerFare || 0 : 0), 0);
    const volumeTrend = [
        { day: 'Mon', orders: 18, rev: 4200 },
        { day: 'Tue', orders: 24, rev: 5900 },
        { day: 'Wed', orders: 31, rev: 7800 },
        { day: 'Thu', orders: 28, rev: 6700 },
        { day: 'Fri', orders: 39, rev: 9400 },
        { day: 'Sat', orders: 48, rev: 12800 },
        { day: 'Sun', orders: 42, rev: 11100 },
    ];
    return {
        activeOrdersCount: activeOrders.length,
        onlineDriversCount: onlineDrivers.length,
        pendingDriversCount: pendingDrivers.length,
        totalRevenue,
        volumeTrend,
        recentOrders: orders.slice(0, 10),
    };
}
export async function getLiveOpsFeed(vehicleType) {
    const orders = await getOrders({});
    const drivers = await getDrivers({ vehicleType: vehicleType !== 'all' ? vehicleType : undefined });
    const activeOrders = orders.filter((o) => ['searching_driver', 'driver_assigned', 'arrived_at_pickup', 'picked_up', 'in_transit', 'arrived_at_drop'].includes(o.status));
    return {
        activeOrders,
        drivers,
    };
}
export async function getCommissionsData() {
    const drivers = await getDrivers();
    const pricingResult = await db.execute(`SELECT config_json FROM pricing_config WHERE id = 'cfg-ahmedabad';`);
    let driverSharePercent = 80;
    let maxDriverCashLimit = 1500;
    try {
        if (pricingResult.rows.length > 0) {
            const cfg = JSON.parse(pricingResult.rows[0].config_json);
            driverSharePercent = cfg.driverSharePercent || 80;
            maxDriverCashLimit = cfg.maxDriverCashLimit || 1500;
        }
    }
    catch { }
    const totalCashInFleet = drivers.reduce((acc, d) => acc + d.cashInHandBalance, 0);
    const companyShareOwed = drivers.reduce((acc, d) => acc + d.companyShareOwed, 0);
    return {
        driverSharePercent,
        maxDriverCashLimit,
        totalCashInFleet,
        companyShareOwed,
        drivers,
    };
}
export async function getReportsData(range = '7d') {
    const orders = await getOrders({});
    return {
        dateRange: range,
        orders: orders.map((o) => ({
            id: o.id,
            createdAt: o.createdAt,
            status: o.status,
            senderName: o.sender.name,
            senderPhone: o.sender.phone,
            receiverName: o.receiver.name,
            receiverPhone: o.receiver.phone,
            vehicleType: o.vehicleType,
            distanceKm: o.fare.distanceKm,
            totalFare: o.fare.totalCustomerFare,
            driverShare: o.fare.driverShare,
            paymentMethod: o.paymentMethod,
        })),
    };
}
export async function getHelpers() {
    return [
        {
            id: 'hlp-1',
            name: 'Santosh Kumar',
            phone: '+91 97120 44556',
            role: 'Heavy Lifting & Shifting Specialist',
            experience: '4 Years',
            rating: 4.9,
            status: 'active',
            movesAssisted: 142,
        },
        {
            id: 'hlp-2',
            name: 'Raju Rathod',
            phone: '+91 98981 22334',
            role: 'Packaging & Fragile Items Handler',
            experience: '3 Years',
            rating: 4.8,
            status: 'active',
            movesAssisted: 98,
        },
        {
            id: 'hlp-3',
            name: 'Mohan Sharma',
            phone: '+91 94261 77889',
            role: 'Appliance Unloading & Stairs Carriage',
            experience: '5 Years',
            rating: 4.95,
            status: 'active',
            movesAssisted: 215,
        },
    ];
}
export async function getAuditLogs() {
    const result = await db.execute(`SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50;`);
    return result.rows;
}
//# sourceMappingURL=adminService.js.map