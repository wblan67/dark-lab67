// @ts-nocheck
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { GLYPHS } from '../config/glyphs'

export default function GlyphsCollection() {
  const [фильтр, setФильтр] = useState('all')
  const глифы = useGameStore((state) => state.глифы || {})
  const экипированныеГлифы = useGameStore((state) => state.экипированныеГлифы || [])
  const экипироватьГлиф = useGameStore((state) => state.экипироватьГлиф)
  const снятьГлиф = useGameStore((state) => state.снятьГлиф)
  
  const полученные = Object.keys(глифы)
  const процент = Math.round((полученные.length / 50) * 100)
  
  const фильтрованные = GLYPHS.filter(g => {
    if (фильтр === 'all') return true
    if (фильтр === 'owned') return полученные.includes(g.id)
    if (фильтр === 'not-owned') return !полученные.includes(g.id)
    return g.rarity === фильтр
  })
  
  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'common': return 'border-green-500 bg-green-900/20'
      case 'rare': return 'border-blue-500 bg-blue-900/20'
      case 'epic': return 'border-purple-500 bg-purple-900/20'
      case 'legendary': return 'border-orange-500 bg-orange-900/20'
      case 'mythic': return 'border-red-500 bg-red-900/20'
      default: return 'border-gray-500'
    }
  }
  
  const getRarityName = (rarity) => {
    switch(rarity) {
      case 'common': return '🟢 Обычный'
      case 'rare': return '🔵 Редкий'
      case 'epic': return '🟣 Эпический'
      case 'legendary': return '🟠 Легендарный'
      case 'mythic': return '🔴 Мифический'
      default: return '❓'
    }
  }
  
  const isEquipped = (glyphId) => экипированныеГлифы.includes(glyphId)
  const isOwned = (glyphId) => полученные.includes(glyphId)
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📖 Коллекция глифов</h2>
        <div className="text-right">
          <span className="text-sm text-gray-400">{полученные.length} / 50</span>
          <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${процент}%` }} />
          </div>
        </div>
      </div>
      
      {/* Экипированные глифы */}
      <div className="mb-6 bg-gray-800 p-3 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">⚔️ Экипировано ({экипированныеГлифы.length}/3)</h3>
        <div className="flex flex-wrap gap-2">
          {экипированныеГлифы.map(glyphId => {
            const glyph = GLYPHS.find(g => g.id === glyphId)
            if (!glyph) return null
            return (
              <div key={glyphId} className={`px-3 py-1 rounded-full text-sm ${getRarityColor(glyph.rarity)}`}>
                {glyph.name}
                <button onClick={() => снятьГлиф(glyphId)} className="ml-2 text-red-400 hover:text-red-300">✕</button>
              </div>
            )
          })}
          {экипированныеГлифы.length === 0 && (
            <div className="text-gray-500 text-sm">Нет экипированных глифов</div>
          )}
        </div>
      </div>
      
      {/* Фильтры */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setФильтр('all')} className={`px-3 py-1 rounded text-sm ${фильтр === 'all' ? 'bg-purple-600' : 'bg-gray-700'}`}>📋 Все</button>
        <button onClick={() => setФильтр('owned')} className={`px-3 py-1 rounded text-sm ${фильтр === 'owned' ? 'bg-green-600' : 'bg-gray-700'}`}>✅ Полученные</button>
        <button onClick={() => setФильтр('not-owned')} className={`px-3 py-1 rounded text-sm ${фильтр === 'not-owned' ? 'bg-red-600' : 'bg-gray-700'}`}>❌ Не полученные</button>
        <button onClick={() => setФильтр('common')} className={`px-3 py-1 rounded text-sm ${фильтр === 'common' ? 'bg-green-600' : 'bg-gray-700'}`}>🟢 Обычные</button>
        <button onClick={() => setФильтр('rare')} className={`px-3 py-1 rounded text-sm ${фильтр === 'rare' ? 'bg-blue-600' : 'bg-gray-700'}`}>🔵 Редкие</button>
        <button onClick={() => setФильтр('epic')} className={`px-3 py-1 rounded text-sm ${фильтр === 'epic' ? 'bg-purple-600' : 'bg-gray-700'}`}>🟣 Эпические</button>
        <button onClick={() => setФильтр('legendary')} className={`px-3 py-1 rounded text-sm ${фильтр === 'legendary' ? 'bg-orange-600' : 'bg-gray-700'}`}>🟠 Легендарные</button>
        <button onClick={() => setФильтр('mythic')} className={`px-3 py-1 rounded text-sm ${фильтр === 'mythic' ? 'bg-red-600' : 'bg-gray-700'}`}>🔴 Мифические</button>
      </div>
      
      {/* Список глифов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {фильтрованные.map(glyph => {
          const owned = isOwned(glyph.id)
          const equipped = isEquipped(glyph.id)
          
          return (
            <div key={glyph.id} className={`bg-gray-800 p-3 rounded-lg border-l-4 ${getRarityColor(glyph.rarity)} ${!owned ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{glyph.name}</div>
                  <div className="text-xs text-gray-400">{getRarityName(glyph.rarity)}</div>
                  <div className="text-xs text-green-400 mt-1">{glyph.description}</div>
                </div>
                {owned && (
                  <button
                    onClick={() => экипироватьГлиф(glyph.id)}
                    disabled={equipped || экипированныеГлифы.length >= 3}
                    className={`px-3 py-1 rounded text-xs ${
                      equipped ? 'bg-blue-600 cursor-default' :
                      экипированныеГлифы.length >= 3 ? 'bg-gray-600 cursor-not-allowed' :
                      'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                  >
                    {equipped ? '⚔️ Экипирован' : '🔧 Экипировать'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
