"use client";

import { useRouter } from "next/navigation";

export default function ButtonHome() {
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => router.push('/')}
            className="absolute top-6 left-6 z-20 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
            aria-label="Volver al inicio"
        >
            <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
    );
}