import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

const EMBLEMS = ['⚔️', '🛡️', '🐉', '👑', '⭐', '🔥', '💎', '🍀', '🚀', '🏰', '🦅', '🐺', '🕷️', '💀', '👹']
const COLORS = ['🔵 Синий', '🔴 Красный', '🟢 Зелёный', '🟣 Фиолетовый', '🟠 Оранжевый', '⚫ Чёрный', '⚪ Белый']

export default function CreateGuild() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [focus, setFocus] = useState('mixed')
  const [minLevel, setMinLevel] = useState(1)
  const [emblem, setEmblem] = useState('⚔️')
  const [color, setColor] = useState('🔵 Синий')
  
  const создатьГильдию = useGameStore((state) => state.создатьГильдию)
  const баланс = useGameStore((state) => state.баланс)
  
  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('❌ Введите название гильдии!')
      return
    }
    if (name.length < 3) {
      alert('❌ Название должно быть минимум 3 символа!')
      return
    }
    if (name.length > 20) {
      alert('❌ Название не может быть длиннее 20 символов!')
      return
    }
    if (баланс < 100000) {
      alert(`❌ Не хватает $100,000! У вас ${баланс.toLocaleString()}$`)
      return
    }
    
    // Тип вступления всегда 'closed' (только по приглашению)
    const success = await создатьГильдию(name, description, 'closed', focus, minLevel, emblem, color)
    if (success) {
      window.dispatchEvent(new CustomEvent('switchTab', { detail: 'guild' }))
    }
  }
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">🏆 Создание гильдии</h2>
      <div className="bg-gray-800 p-4 rounded-lg space-y-4">
        {/* Название */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">🏷️ Название гильдии</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            maxLength={20} 
            className="w-full bg-gray-700 p-2 rounded text-white"
            placeholder="3-20 символов"
          />
          <div className="text-xs text-gray-500 mt-1">{name.length}/20</div>
        </div>
        
        {/* Описание */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">📝 Описание</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            maxLength={200} 
            className="w-full bg-gray-700 p-2 rounded h-20 text-white"
            placeholder="Расскажите о вашей гильдии..."
          />
          <div className="text-xs text-gray-500 mt-1">{description.length}/200</div>
        </div>
        
        {/* Фокус гильдии */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">🎯 Фокус гильдии</label>
          <select value={focus} onChange={(e) => setFocus(e.target.value)} className="w-full bg-gray-700 p-2 rounded text-white">
            <option value="craft">🔬 Крафт — бонус к выходу продукта</option>
            <option value="sales">💰 Продажи — бонус к цене продажи</option>
            <option value="pvp">⚔️ PvP — бонус к атаке в войнах</option>
            <option value="mixed">🌍 Смешанный — небольшой бонус ко всему</option>
          </select>
        </div>
        
        {/* Минимальный уровень */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">👥 Минимальный уровень для вступления</label>
          <input 
            type="number" 
            value={minLevel} 
            onChange={(e) => setMinLevel(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))} 
            min={1} 
            max={20} 
            className="w-full bg-gray-700 p-2 rounded text-white"
          />
        </div>
        
        {/* Эмблема */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">🎨 Эмблема гильдии</label>
          <div className="flex gap-2 flex-wrap">
            {EMBLEMS.map(e => (
              <button
                key={e}
                onClick={() => setEmblem(e)}
                className={`text-2xl p-2 rounded transition ${emblem === e ? 'bg-purple-600 scale-110' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        
        {/* Цвет гильдии */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">🎨 Цвет гильдии</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => {
              const colorMap: Record<string, string> = {
                '🔵 Синий': 'bg-blue-600',
                '🔴 Красный': 'bg-red-600',
                '🟢 Зелёный': 'bg-green-600',
                '🟣 Фиолетовый': 'bg-purple-600',
                '🟠 Оранжевый': 'bg-orange-600',
                '⚫ Чёрный': 'bg-gray-900',
                '⚪ Белый': 'bg-gray-300 text-black'
              }
              return (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-3 py-1 rounded transition ${color === c ? 'ring-2 ring-yellow-400 scale-105' : ''} ${colorMap[c] || 'bg-gray-700'}`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Информация о стоимости */}
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <div className="text-yellow-400 text-xl font-bold mb-1">💰 $100,000</div>
          <div className="text-xs text-gray-400">Стоимость создания гильдии</div>
          <div className="text-xs text-gray-500 mt-2">
            {баланс >= 100000 
              ? `✅ У вас достаточно денег: ${баланс.toLocaleString()}$` 
              : `❌ Не хватает ${(100000 - баланс).toLocaleString()}$`}
          </div>
        </div>
        
        {/* Кнопка создания */}
        <button 
          onClick={handleSubmit} 
          disabled={баланс < 100000 || name.length < 3}
          className={`w-full py-3 rounded font-semibold transition ${
            баланс >= 100000 && name.length >= 3
              ? 'bg-green-600 hover:bg-green-700 transform hover:scale-105' 
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          🚀 Создать гильдию
        </button>
        
        {/* Подсказки */}
        <div className="text-xs text-gray-500 space-y-1 mt-2">
          <p>💡 После создания гильдии вы станете её лидером</p>
          <p>💡 Вы сможете приглашать участников и управлять гильдией</p>
          <p>💡 Название гильдии нельзя будет изменить</p>
          <p>🔒 Вступление в гильдию — только по приглашению лидера или со-лидера</p>
        </div>
      </div>
    </div>
  )
}