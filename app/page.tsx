"use client";

import StudentAITransparencyForm from "@/components/StudentAITransparencyForm";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export const runtime = "edge";

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen">
            <AnnouncementBanner message={[
                "This tool is part of our ongoing innovation efforts and is actively being refined.",
                "Features and content may continue to evolve based on campus needs and user feedback.",
                "Thank you for using the Student AI Disclosure tool."
            ]} />
            <StudentAITransparencyForm />
        </div>
    );
}