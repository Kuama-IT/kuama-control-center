/**
 * Brutal Design System - Usage Examples
 * Examples of how to use the brutal components in your application
 */

import React from "react";
import {
    BrutalButton,
    BrutalInput,
    BrutalCard,
    BrutalFormField,
    BrutalBadge,
    brutalTheme,
} from "@/modules/ui";

// Example: Contact Form using Brutal components
export const BrutalContactForm: React.FC = () => {
    return (
        <BrutalCard className="max-w-md mx-auto">
            <h2 className={brutalTheme.typography.heading}>CONTACT US</h2>

            <div className="space-y-6 mt-6">
                <BrutalFormField label="YOUR NAME">
                    <BrutalInput placeholder="ENTER YOUR NAME" />
                </BrutalFormField>

                <BrutalFormField label="EMAIL ADDRESS">
                    <BrutalInput type="email" placeholder="YOUR@EMAIL.COM" />
                </BrutalFormField>

                <BrutalFormField label="MESSAGE">
                    <BrutalInput placeholder="YOUR MESSAGE HERE..." />
                </BrutalFormField>

                <div className="flex gap-4">
                    <BrutalButton variant="primary">SEND MESSAGE</BrutalButton>
                    <BrutalButton variant="secondary">CLEAR FORM</BrutalButton>
                </div>

                <div className="flex gap-2">
                    <BrutalBadge variant="success">VERIFIED</BrutalBadge>
                    <BrutalBadge variant="info">SECURE</BrutalBadge>
                </div>
            </div>
        </BrutalCard>
    );
};

// Example: Data Display using Brutal components
export const BrutalDataCard: React.FC = () => {
    return (
        <BrutalCard>
            <div className="flex justify-between items-center">
                <h3 className={brutalTheme.typography.title}>SYSTEM STATUS</h3>
                <BrutalBadge variant="success">ONLINE</BrutalBadge>
            </div>

            <div className="mt-4 space-y-2">
                <p className={brutalTheme.typography.body}>
                    Server uptime: <span className="font-black">99.9%</span>
                </p>
                <p className={brutalTheme.typography.body}>
                    Active users: <span className="font-black">1,247</span>
                </p>
            </div>

            <div className="mt-6 flex gap-3">
                <BrutalButton size="sm" variant="primary">
                    MONITOR
                </BrutalButton>
                <BrutalButton size="sm" variant="secondary">
                    REPORTS
                </BrutalButton>
            </div>
        </BrutalCard>
    );
};
