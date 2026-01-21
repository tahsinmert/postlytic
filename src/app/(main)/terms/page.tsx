'use client';

import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';

export default function TermsPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-bg-canvas relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
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
                            <ScrollText className="h-8 w-8 text-teal-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fg-default to-fg-muted">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-fg-muted max-w-2xl mx-auto">
                            Please read these terms carefully before using Postlytic.
                        </p>
                    </motion.div>

                    {/* Content */}
                    <motion.div variants={fadeIn} className="space-y-8 text-fg-default/90 leading-relaxed text-lg">
                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">1. Acceptance of Terms</h2>
                            <p className="text-fg-muted text-base">
                                By accessing or using Postlytic, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
                            </p>
                        </section>

                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">2. Usage License</h2>
                            <p className="text-fg-muted text-base">
                                Depending on your subscription plan, we grant you a limited, non-exclusive, non-transferable license to use Postlytic for personal or commercial purposes.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-base text-fg-muted ml-4">
                                <li>You agree not to misuse or attempt to compromise the security of the platform.</li>
                                <li>You retain ownership of the content you submit for analysis.</li>
                            </ul>
                        </section>

                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">3. Disclaimer</h2>
                            <p className="text-fg-muted text-base">
                                Postlytic is provided "as is". We make no warranties regarding the accuracy of our AI analysis or the success of your posts. Virality is influenced by many external factors.
                            </p>
                        </section>

                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">4. Termination</h2>
                            <p className="text-fg-muted text-base">
                                We reserve the right to suspend or terminate your access to Postlytic at our sole discretion, without notice, for conduct that we believe violates these Terms.
                            </p>
                        </section>

                        <section className="space-y-4 p-8 rounded-3xl bg-bg-surface/30 border border-white/5 backdrop-blur-sm hover:bg-bg-surface/50 transition-colors">
                            <h2 className="text-2xl font-semibold text-teal-400">5. Changes to Terms</h2>
                            <p className="text-fg-muted text-base">
                                We may update these terms from time to time. Your continued use of the platform following any changes indicates your acceptance of the new terms.
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
