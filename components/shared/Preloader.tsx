"use client"

import { useState, useEffect } from "react"

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoaded(true)
    } else {
      window.addEventListener("load", () => setLoaded(true))
      return () => window.removeEventListener("load", () => setLoaded(true))
    }
  }, [])

  return (
    <>
      {!loaded && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-brand-dark">
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-rose text-base font-bold tracking-wide text-white">
              GB
            </div>
            <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full animate-loader rounded-full bg-brand-rose" />
            </div>
          </div>
        </div>
      )}
      <div
        className={`transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </>
  )
}
