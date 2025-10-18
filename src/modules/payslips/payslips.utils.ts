import { type PayslipRead } from "@/modules/payslips/schemas/payslip-read";

export const payslipsUtils = {
    calculateAverageNet(payslips: PayslipRead[]): number {
        if (payslips.length === 0) return 0;
        const total = payslips.reduce((sum, payslip) => sum + payslip.net, 0);
        return total / payslips.length;
    },
    calculateAverageCost(payslips: PayslipRead[]): number {
        if (payslips.length === 0) return 0;
        const total = payslips.reduce(
            (sum, payslip) => sum + (payslip.businessCost ?? 0),
            0,
        );
        return total / payslips.length;
    },
};
