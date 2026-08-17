"use client"

import * as React from "react"
import { ShieldAlert } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center space-y-4">
        <ShieldAlert className="mx-auto h-24 w-24 text-destructive opacity-80" />
        <h1 className="text-4xl font-bold font-mono tracking-widest uppercase text-foreground">
          404: Null Sector
        </h1>
        <p className="text-muted-foreground font-mono max-w-md mx-auto">
          The requested coordinate does not exist in the active matrix. Return to dashboard or recalibrate targeting.
        </p>
      </div>
    </div>
  )
}
