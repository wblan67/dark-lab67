import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

export default function Referral() {
  // Используем селекторы для каждого поля отдельно
  const реферальныйКод = useGameStore((state) => state.реферальныйКод)
  const сгенерироватьРеферальныйКод = useGameStore((state) => state.сгенерироватьРеферальныйКод)
  const реферальныйСчётчик = useGameStore((state) => state.реферальныйСчётчик ?? 0)
  const бонусыЗаПриглашения = useGameStore((state) => state.бонусыЗаПриглашения ?? 0)
  const получитьБонусЗаПриглашение = useGameStore((state) => state.получитьБонусЗаПриглашение)
  
  const hasGenerated = useRef(false)
  
  // Генерируем код только один раз при монтировании
  useEffect(() => {
    if (!реферальныйКод && сгенерироватьРеферальныйКод && !hasGenerated.current) {
      hasGenerated.current = true
      сгенерироватьРеферальныйКод()
    }
  }, []) // 👈 ПУСТОЙ МАССИВ
  
  const неполученных = (реферальныйСчётчик ?? 0) - (бонусыЗаПриглашения ?? 0)
  
  // Ссылка для приглашения (замени на своего бота)
  const botUsername = 'dark_lab_bot'
  const inviteLink = реферальныйКод ? `https://t.me/${botUsername}?start=${реферальныйКод}` : 'Загрузка...'
  
  const handleCopyLink = () => {
    if (реферальныйКод) {
      navigator.clipboard.writeText(inviteLink)
      alert('✅ Ссылка скопирована!')
    }
  }
  
  const handleGetBonus = () => {
    if (получитьБонусЗаПриглашение) {
      получитьБонусЗаПриглашение()
    }
  }
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">👥 Реферальная система</h2>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">🎁 Твоя реферальная ссылка</h3>
        <div className="bg-gray-700 p-2 rounded flex justify-between items-center flex-wrap gap-2">
          <code className="text-sm break-all">{inviteLink}</code>
          <button 
            onClick={handleCopyLink}
            disabled={!реферальныйКод}
            className={`px-3 py-1 rounded text-sm transition ${реферальныйКод ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'}`}
          >
            📋 Копировать
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          💡 Каждый приглашённый даёт вам $5,000 и 5 осколков
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">📊 Статистика</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">👥 Приглашено друзей:</span>
            <span className="text-yellow-400">{реферальныйСчётчик}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">💰 Получено бонусов:</span>
            <span className="text-green-400">${((бонусыЗаПриглашения ?? 0) * 5000).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">💎 Осколков получено:</span>
            <span className="text-blue-400">{(бонусыЗаПриглашения ?? 0) * 5}</span>
          </div>
          {неполученных > 0 && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <span className="text-green-400">🎁 Новых бонусов:</span>
              <button 
                onClick={handleGetBonus}
                className="bg-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-700 transition"
              >
                Забрать ${неполученных * 5000} + {неполученных * 5}💎
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 p-3 rounded-lg text-xs text-gray-400">
        <h3 className="font-semibold mb-1 text-gray-300">📋 Как это работает:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>1. Отправь ссылку другу</li>
          <li>2. Друг открывает бота и нажимает "Старт"</li>
          <li>3. Вы получаете бонус за каждого приглашённого</li>
          <li>4. Бонус нужно забрать вручную</li>
        </ul>
      </div>
    </div>
  )
}