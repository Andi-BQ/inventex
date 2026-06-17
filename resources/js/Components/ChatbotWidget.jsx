import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react'

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const chatRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus()
        }
    }, [open])

    const sendMessage = async () => {
        const text = input.trim()
        if (!text || loading) return

        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: text }])
        setLoading(true)

        try {
            const res = await fetch('/chatbot/consultar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ mensaje: text }),
            })
            const data = await res.json()
            if (data.respuesta) {
                setMessages(prev => [...prev, { role: 'bot', content: data.respuesta }])
            } else if (data.error) {
                setMessages(prev => [...prev, { role: 'bot', content: 'Error: ' + data.error }])
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', content: 'Error de conexión con el asistente.' }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <>
            {open && (
                <div className="fixed bottom-20 right-5 z-50 w-80 sm:w-96 bg-white dark:bg-hm-800 rounded-2xl shadow-2xl dark:shadow-premium-dark border border-gray-200/80 dark:border-white/10 flex flex-col overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-sky-500 to-indigo-600">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-white" />
                            <span className="text-sm font-semibold text-white">Asistente INVENTEX</span>
                        </div>
                        <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    <div ref={chatRef} className="flex-1 p-3 space-y-3 overflow-y-auto max-h-80 min-h-[200px]">
                        {messages.length === 0 && !loading && (
                            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                                <Bot className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                <p className="text-xs font-medium">¡Hola! Soy tu asistente</p>
                                <p className="text-[10px] mt-1">Pregúntame sobre inventario, ventas o estadísticas</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-br-md'
                                        : 'bg-gray-100 dark:bg-hm-700/50 text-gray-800 dark:text-gray-200 rounded-bl-md'
                                }`}>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        {msg.role === 'bot' ? (
                                            <Bot className="w-3 h-3 opacity-60" />
                                        ) : (
                                            <User className="w-3 h-3 opacity-60" />
                                        )}
                                        <span className="font-medium opacity-60 text-[8px] uppercase tracking-wider">
                                            {msg.role === 'bot' ? 'INVENTEX' : 'Tú'}
                                        </span>
                                    </div>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] px-3 py-2 rounded-2xl text-xs bg-gray-100 dark:bg-hm-700/50 text-gray-500 dark:text-gray-400 rounded-bl-md">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        <span className="italic">Consultando Inventex...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe tu consulta..."
                                disabled={loading}
                                className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-hm-700/50 border border-gray-200/60 dark:border-white/5 text-xs outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/40 transition-all disabled:opacity-50"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                className="p-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-700 disabled:opacity-40 transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-premium hover:shadow-premium-hover hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
                {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
            </button>
        </>
    )
}
