"use client"
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

function Themer({className}: {className: string}) {
    const {resolvedTheme, setTheme} = useTheme()    
    return (
        <Button
            onClick={() => setTheme(prev => prev == "light" ? "dark" : "light")}
            className={className}
        >
            {resolvedTheme == "light" ? <Moon /> : <Sun />}
        </Button>
    )
}

export default Themer