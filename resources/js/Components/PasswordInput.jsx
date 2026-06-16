import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({ value, onChange, placeholder, className = '', inputRef, ...props }) {
    const [show, setShow] = useState(false)
    return (
        <div className="relative">
            <input ref={inputRef} type={show ? 'text' : 'password'} value={value} onChange={onChange}
                placeholder={placeholder} className={className} {...props} />
            <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-hm-400 hover:text-hm-600 dark:hover:text-gray-300 transition-colors">
                {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
        </div>
    )
}
