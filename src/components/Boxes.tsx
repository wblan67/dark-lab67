import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { BOXES, getRarityFromBox } from '../config/boxes'
import { getRandomGlyphByRarity, GLYPHS } from '../config/glyphs'

export default function Boxes() {
  const [анимация, setАнимация] = useState<{ show: boolean; glyph: any; boxIcon: string }>({ show: false, glyph: null, boxIcon: '' })
  const [тряска, setТряска] = useState(false)
  const [результат, setРезультат] = useState('')
  
  const осколки = useGameStore((state) => state.осколки || 0)
  const открытьБокс = useGameStore((state) => state.открытьБокс)
  
  const handleOpenBox = async (box) => {
    if (осколки < box.price) {
      setРезультат(`❌ Не хватает осколков! Нужно: ${box.price}, есть: ${осколки}`)
      setTimeout(() => setРезультат(''), 2000)
      return
    }
    
    // Анимация тряски
    setТряска(true)
    setTimeout(() => setТряска(false), 500)
    
    const rarity = getRarityFromBox(box)
    const glyph = getRandomGlyphByRarity(rarity)
    
    if (!glyph) {
      setРезультат(`❌ Ошибка! Глиф не найден`)
      return
    }
    
    const success = await открытьБокс(box.id, glyph.id)
    
    if (success) {
      setАнимация({ show: true, glyph, boxIcon: box.icon })
      
      setTimeout(() => {
        setАнимация({ show: false, glyph: null, boxIcon: '' })
      }, 2500)
      
      setРезультат(`🎉 ${box.icon} Выпал: ${glyph.name} (${getRarityName(glyph.rarity)})`)
      setTimeout(() => setРезультат(''), 3000)
    } else {
      setРезультат(`❌ Ошибка при открытии бокса`)
      setTimeout(() => setРезультат(''), 2000)
    }
  }
  
  const getRarityName = (rarity) => {
    switch(rarity) {
      case 'common': return '🟢 Обычный'
      case 'rare': return '🔵 Редкий'
      case 'epic': return '🟣 Эпический'
      case 'legendary': return '🟠 Легендарный'
      case 'mythic': return '🔴 Мифический'
      default: return 'Неизвестный'
    }
  }
  
  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'common': return 'border-green-500 bg-green-900/80'
      case 'rare': return 'border-blue-500 bg-blue-900/80'
      case 'epic': return 'border-purple-500 bg-purple-900/80'
      case 'legendary': return 'border-orange-500 bg-orange-900/80'
      case 'mythic': return 'border-red-500 bg-red-900/80'
      default: return 'border-gray-500 bg-gray-900/80'
    }
  }
  
  return (
    <div className="p-4">
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pop {
          animation: pop 0.5s ease-out;
        }
        @keyframes glow {
          0% { box-shadow: 0 0 0 0 rgba(255,215,0,0.7); }
          70% { box-shadow: 0 0 0 20px rgba(255,215,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,215,0,0); }
        }
        .glow {
          animation: glow 1s ease-out;
        }
      `}</style>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📦 Коляска с боксами</h2>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-yellow-400">💎 Осколков:</span>
          <span className="text-white font-bold ml-2">{осколки.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {BOXES.map((box) => (
          <button
            key={box.id}
            onClick={() => handleOpenBox(box)}
            className={`bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition ${тряска ? 'shake' : ''}`}
          >
            <div className="text-4xl mb-2">{box.icon}</div>
            <div className="font-bold text-sm">{box.name}</div>
            <div className="text-yellow-400 text-xs mt-1">{box.price} 💎</div>
            <div className="text-xs text-gray-500 mt-2">
              Шансы:<br/>
              🟢{Math.round(box.colors.common * 100)}% 🔵{Math.round(box.colors.rare * 100)}%<br/>
              🟣{Math.round(box.colors.epic * 100)}% 🟠{Math.round(box.colors.legendary * 100)}%<br/>
              🔴{Math.round(box.colors.mythic * 100)}%
            </div>
          </button>
        ))}
      </div>
      
      {/* Анимация выпадения */}
      {анимация.show && анимация.glyph && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
          <div className={`pop rounded-2xl p-8 text-center border-4 ${getRarityColor(анимация.glyph.rarity)} glow`}>
            <div className="text-7xl mb-4 animate-bounce">{анимация.boxIcon}</div>
            <div className="text-4xl mb-4">✨</div>
            <div className="text-3xl font-bold mb-2">{анимация.glyph.name}</div>
            <div className={`text-lg mb-2 ${getRarityColor(анимация.glyph.rarity)}`}>
              {getRarityName(анимация.glyph.rarity)}
            </div>
            <div className="text-gray-300 text-sm">{анимация.glyph.description}</div>
            <div className="text-yellow-400 text-xs mt-3 animate-pulse">✨ +{анимация.glyph.effect?.value || 0}% к бонусу ✨</div>
          </div>
        </div>
      )}
      
      {результат && (
        <div className="bg-gray-800 p-3 rounded-lg text-center">
          {результат}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Осколки падают с шансом 5% при варке любого наркотика
      </div>
    </div>
  )
}