import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export default function GuildInvites() {
  const [приглашения, setПриглашения] = useState<any[]>([])
  
  const получитьПриглашения = useGameStore((state) => state.получитьПриглашения)
  const принятьПриглашение = useGameStore((state) => state.принятьПриглашение)
  const отклонитьПриглашение = useGameStore((state) => state.отклонитьПриглашение)
  const гильдия = useGameStore((state) => state.гильдия)
  
  useEffect(() => {
    const invites = получитьПриглашения()
    setПриглашения(invites)
  }, [гильдия, получитьПриглашения])
  
  if (приглашения.length === 0) {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-yellow-500 w-80">
        <div className="bg-yellow-600 p-2 rounded-t-lg font-semibold text-center">
          📨 Приглашения в гильдии ({приглашения.length})
        </div>
        <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
          {приглашения.map((inv, i) => (
            <div key={i} className="bg-gray-700 p-2 rounded">
              <div className="text-sm font-medium">{inv.guildName}</div>
              <div className="text-xs text-gray-400">Пригласил: {inv.fromName}</div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => принятьПриглашение(inv.guildId)}
                  className="flex-1 bg-green-600 py-1 rounded text-xs hover:bg-green-700 transition"
                >
                  Принять
                </button>
                <button 
                  onClick={() => отклонитьПриглашение(inv.guildId)}
                  className="flex-1 bg-red-600 py-1 rounded text-xs hover:bg-red-700 transition"
                >
                  Отклонить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}