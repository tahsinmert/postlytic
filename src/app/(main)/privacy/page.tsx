'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-bg-canvas relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1 }}
                    className="space-y-12"
                >
                    {/* Header */}
                    <motion.div variants={fadeIn} className="text-center space-y-4 mb-16">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-teal-500/10 mb-4">
                            <Shield className="h-8 w-8 text-teal-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fg-default to-fg-muted">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-fg-muted max-w-2xl mx-auto">
                            We value your privacy. Here is how we collect, use, and protect your data at Postlytic.
                        </p>
                    </motion.div>

                    {/* Content */}
                    <motion.div variants={fadeIn} className="space-y-8 text-fg-default/90 leading-relaxed text-lg">
                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">1. Information We Collect</h2>
                            <p className="text-fg-muted text-base">
                                We gather limited information to provide our services effectively. This includes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-base text-fg-muted ml-4">
                                <li>Account information (name, email) provided via authentication providers.</li>
                                <li>Content you submit for analysis (LinkedIn posts).</li>
                                <li>Usage data to improve our analytics and user experience.</li>
                            </ul>
                        </section>

                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">2. How We Use Your Data</h2>
                            <p className="text-fg-muted text-base">
                                Your data powers the core functionality of Postlytic. We use it to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-base text-fg-muted ml-4">
                                <li>Analyze your posts and generate engagement metrics.</li>
                                <li>Provide personalized suggestions and improvements.</li>
                                <li>Maintain and secure our platform.</li>
                            </ul>
                        </section>

                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">3. Data Security</h2>
                            <p className="text-fg-muted text-base">
                                We employ industry-standard security measures to protect your information. Your data is encrypted in transit and at rest. We do not sell your personal data to third parties.
                            </p>
                        </section>

                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">4. Third-Party Services</h2>
                            <p className="text-fg-muted text-base">
                                We may use third-party services (like Firebase for authentication and database) which have their own privacy policies. We encourage you to review them.
                            </p>
                        </section>

                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">5. Contact Us</h2>
                            <p className="text-fg-muted text-base">
                                If you have any questions about this Privacy Policy, please contact us at support@postlytic.com.
                            </p>
                        </section>
                    </motion.div>

                    <motion.div variants={fadeIn} className="text-center text-sm text-fg-muted pt-10 border-t border-white/10">
                        Last updated: {new Date().toLocaleDateString()}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
