"use client"

import * as React from "react"
import { Toaster as Sonner, ToasterProps } from "sonner"

/** Local theme hook — reads the `.dark` class on <html> (no next-themes dependency). */
function useDocTheme() {
  const [theme, setTheme] = React.useState<ToasterProps["theme"]>("system")
  React.useEffect(() => {
    const sync = () =>
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])
  return theme
}

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useDocTheme()

  return (
    <Sonner
      theme={theme}
      position="top-center"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
