"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

// Simple scroll reveal: fade up + blur in
export function FadeUp({
    children,
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
}

// Staggered container for children
export function FadeStagger({
    children,
    className = "",
    staggerDelay = 0.1,
}: {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: staggerDelay } },
            }}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
        >
            {children}
        </motion.div>
    );
}

// Individual stagger item
export function FadeItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
                show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
            }}
        >
            {children}
        </motion.div>
    );
}

// Horizontal slide-in (left or right)
export function SlideIn({
    children,
    from = "left",
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    from?: "left" | "right";
    delay?: number;
    className?: string;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const x = from === "left" ? -40 : 40;

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, x, filter: "blur(6px)" }}
            animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
}

// Counter animation (for stats)
export function CountUp({
    end,
    suffix = "",
    className = "",
}: {
    end: number;
    suffix?: string;
    className?: string;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
        >
            <motion.span>
                {inView ? (
                    <motion.span
                        initial={{ filter: "blur(4px)" }}
                        animate={{ filter: "blur(0px)" }}
                        transition={{ duration: 0.5 }}
                    >
                        {end}{suffix}
                    </motion.span>
                ) : "0"}
            </motion.span>
        </motion.span>
    );
}
