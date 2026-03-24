"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            callback(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, callback]);
};

export default function ExpandableCardDemo() {
    const [active, setActive] = useState(null);
    const ref = useRef(null);
    const id = useId();

    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === "Escape") {
                setActive(false);
            }
        }

        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && typeof active === "object" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 dark:bg-black/60 h-full w-full z-[100]"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && typeof active === "object" ? (
                    <div className="fixed inset-0 grid place-items-center z-[110]">
                        <motion.button
                            key={`button-${active.title}-${id}`}
                            layout
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.05,
                                },
                            }}
                            className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-white dark:bg-stone-800 rounded-full h-8 w-8 shadow-md"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.title}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-stone-900 sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800"
                        >
                            <motion.div layoutId={`image-${active.title}-${id}`}>
                                <img
                                    src={active.src}
                                    alt={active.title}
                                    className="w-full h-64 lg:h-80 sm:rounded-tr-3xl sm:rounded-tl-3xl object-cover object-center"
                                />
                            </motion.div>

                            <div>
                                <div className="flex justify-between items-start p-6">
                                    <div className="">
                                        <motion.h3
                                            layoutId={`title-${active.title}-${id}`}
                                            className="font-bold text-xl text-stone-900 dark:text-white"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.description}-${id}`}
                                            className="text-stone-500 dark:text-stone-400 mt-1"
                                        >
                                            {active.description}
                                        </motion.p>
                                    </div>

                                    <motion.a
                                        layoutId={`button-${active.title}-${id}`}
                                        href={active.ctaLink}
                                        className="px-5 py-3 text-sm rounded-full font-bold bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                    >
                                        {active.ctaText}
                                    </motion.a>
                                </div>
                                <div className="pt-2 relative px-6 pb-8">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-stone-600 dark:text-stone-300 text-sm md:text-base h-40 md:h-fit flex flex-col items-start gap-4 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                                    >
                                        {typeof active.content === "function"
                                            ? active.content()
                                            : active.content}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <ul className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {cards.map((card, index) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={`card-${card.title}-${id}`}
                        onClick={() => setActive(card)}
                        className="p-4 flex flex-col justify-between items-start bg-transparent hover:bg-stone-50/10 dark:hover:bg-stone-800/50 rounded-xl cursor-pointer transition-colors"
                    >
                        <div className="flex gap-4 items-center w-full">
                            <motion.div layoutId={`image-${card.title}-${id}`} className="shrink-0">
                                <img
                                    src={card.src}
                                    alt={card.title}
                                    className="h-14 w-14 rounded-lg object-cover object-center"
                                />
                            </motion.div>
                            <div className="flex flex-col justify-center text-left">
                                <motion.h3
                                    layoutId={`title-${card.title}-${id}`}
                                    className="font-medium text-lg text-stone-900 dark:text-stone-200"
                                >
                                    {card.title}
                                </motion.h3>
                                <motion.p
                                    layoutId={`description-${card.description}-${id}`}
                                    className="text-stone-500 dark:text-stone-400 text-sm mt-0.5 line-clamp-2"
                                >
                                    {card.description}
                                </motion.p>
                            </div>
                        </div>
                        <motion.button
                            layoutId={`button-${card.title}-${id}`}
                            className="mt-4 px-6 py-2 text-sm rounded-full font-bold bg-white text-stone-900 hover:bg-stone-200 shadow-sm transition-colors self-start"
                        >
                            {card.ctaText}
                        </motion.button>
                    </motion.div>
                ))}
            </ul>
        </>
    );
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-stone-900 dark:text-white"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};

const cards = [
    {
        title: "Free Trial",
        description: "Is there a free trial for the Pro plan?",
        src: "https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Read More",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Yes, you can try out all Pro features for 14 days completely free, no credit card required. <br /> <br />
                    During this trial period, you will have access to advanced reporting, unlimited projects, and 24/7 priority support to fully experience how Sprintly can boost your team's productivity.
                </p>
            );
        },
    },
    {
        title: "Cancellation",
        description: "Can I cancel my subscription at any time?",
        src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Read More",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Absolutely. There are no long-term contracts. You can cancel your subscription at any time and you won't be charged again. <br /> <br />
                    If you decide to cancel, your account will simply downgrade to the Free Tier at the end of your current billing cycle, ensuring you don't lose access to your essential data.
                </p>
            );
        },
    },
    {
        title: "Data Security",
        description: "How secure is my data?",
        src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Read More",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    We use industry-standard encryption for data at rest and in transit. Your project data is secure and backed up regularly. <br /> <br />
                    Our infrastructure is hosted on secure, enterprise-grade cloud providers. We also perform regular security audits and penetration testing to ensure your information remains protected against all potential threats.
                </p>
            );
        },
    },
    {
        title: "Discounts",
        description: "Do you offer discounts for non-profits?",
        src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Read More",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Yes, we offer special pricing for registered non-profit organizations. <br /> <br />
                    We believe in supporting organizations that make a positive impact. Please contact our support team with your tax-exempt documentation, and we will set up a customized plan that fits your budget.
                </p>
            );
        },
    },
    {
        title: "Integrations",
        description: "What tools does Sprintly integrate with?",
        src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Read More",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Sprintly is designed to be the central hub for all your work, so it integrates seamlessly with the tools you already use every day. <br /> <br />
                    We offer native integrations with popular platforms like Slack, Google Workspace, GitHub, Jira, and Zoom. Additionally, our Open API allows your development team to build custom connections to any proprietary internal software your company uses.
                </p>
            );
        },
    },
    {
        title: "Onboarding Teams",
        description: "How hard is it to onboard my entire team?",
        src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Read More",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Onboarding is incredibly straightforward. Sprintly’s interface is designed to be intuitive and require zero training to get started on Day 1. <br /> <br />
                    Simply invite your team via email or via a sharable link. Our platform includes guided tooltips and a comprehensive Help Center. Furthermore, for our Enterprise customers, we provide a dedicated Success Manager who will orchestrate personalized onboarding sessions for your entire organization.
                </p>
            );
        },
    },
    {
        title: "Sprintly AI",
        description: "How does the AI Answer feature work?",
        src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Read More",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Sprintly AI acts as an incredibly smart assistant that has read every single public document, task, and chat message across your company workspace. <br /> <br />
                    When you ask it a question, like "What were the key takeaways from Project Alpha?", the AI synthesizes information from across your workspace to provide a concise, accurate answer, complete with direct citations to the source tickets and documents so you can verify the context.
                </p>
            );
        },
    },
    {
        title: "Migration",
        description: "Can I easily import my data from Trello or Jira?",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Read More",
        ctaLink: "#",
        content: () => {
            return (
                <p>
                    Yes, we've built a powerful 1-click import tool specifically for teams migrating from other platforms. <br /> <br />
                    You can seamlessly import your tasks, boards, comments, and members from Trello, Jira, Asana, and ClickUp without losing any context. Our support team is also available to assist with complex Enterprise migrations.
                </p>
            );
        },
    },
];
