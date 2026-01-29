import React, { Suspense } from "react"
import VerifyEmailClient from "./VerifyEmailClient"

export default function Page() {
    return (
        <Suspense fallback={
            <div className="container relative h-screen flex-col items-center justify-center grid">
                <div className="mx-auto w-full sm:w-[350px] text-center">Loading…</div>
            </div>
        }>
            <VerifyEmailClient />
        </Suspense>
    )
}
