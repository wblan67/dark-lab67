import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { GLYPHS } from '../config/glyphs'
import InventoryEquipment from './InventoryEquipment'

const DRUGS_BASE = {
  krokodil: { name: '🐊 Крокодил' },
  marijuana: { name: '🌿 Марихуана' },
  pcp: { name: '👻 PCP' },
  amphetamine: { name: '⚡ Амфетамин' },
  meth: { name: '❄️ Метамфетамин' },
  mdma: { name: '💊 MDMA' },
  heroin: { name: '💉 Героин' },
  cocaine: { name: '⬜ Кокаин' },
  blue_meth: { name: '💎 Голубой Мет' },
  lsd: { name: '🧪 ЛСД' }
}

export default function Inventory() {
  const [активныйТаб, setАктивныйТаб] = useState<'ingredients' | 'equipment' | 'drugs' | 'glyphs'>('drugs')
  const [, forceUpdate] = useState(0)
  const [монетки, setМонетки] = useState<{ id: number; x: number; y: number }[]>([])
  
  const инвентарь = useGameStore((state) => state.инвентарь || {})
  const текущиеЦены = useGameStore((state) => state.текущиеЦены)
  const активнаяМашина = useGameStore((state) => state.активнаяМашина)
  const начатьПродажу = useGameStore((state) => state.начатьПродажу)
  const активныеПродажи = useGameStore((state) => state.активныеПродажи || {})
  const глифы = useGameStore((state) => state.глифы || {})
  const экипированныеГлифы = useGameStore((state) => state.экипированныеГлифы || [])
  const экипироватьГлиф = useGameStore((state) => state.экипироватьГлиф)
  const снятьГлиф = useGameStore((state) => state.снятьГлиф)
  const улучшенияМашин = useGameStore((state) => state.улучшенияМашин || {})
  
  const показатьМонетки = (x: number, y: number) => {
    const id = Date.now()
    setМонетки(prev => [...prev, { id, x, y }])
    setTimeout(() => {
      setМонетки(prev => prev.filter(c => c.id !== id))
    }, 1000)
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const getPrice = (drugKey: string) => {
    return текущиеЦены[drugKey] || 100
  }
  
  // Получаем улучшения для активной машины
  const улучшения = улучшенияМашин[активнаяМашина] || { скорость: 0, вместимость: 0, надежность: 0 }
  const вместимостьМножитель = 1 + (улучшения.вместимость * 0.1)
  
  const CARS_LIST = [
    { id: 'walk', name: '🚶‍♂️ Пешком', time: 20, capacity: 10 },
    { id: 'bicycle', name: '🛵 Велосипед', time: 15, capacity: 20 },
    { id: 'scooter', name: '🏍️ Скутер', time: 12, capacity: 30 },
    { id: 'cheapCar', name: '🚗 Дешёвая тачка', time: 10, capacity: 50 },
    { id: 'minibus', name: '🚐 Микроавтобус', time: 8, capacity: 80 },
    { id: 'truck', name: '🚚 Грузовик', time: 6, capacity: 120 },
    { id: 'bigTruck', name: '🚛 Фура', time: 5, capacity: 180 },
    { id: 'armored', name: '🚀 Бронированный', time: 4, capacity: 250 },
    { id: 'helicopter', name: '🚁 Вертолёт', time: 3, capacity: 350 },
    { id: 'plane', name: '✈️ Самолёт', time: 2, capacity: 500 },
    { id: 'secret', name: '🛸 Секретная', time: 1, capacity: 1000 }
  ]
  
  const активнаяМашинаДанные = CARS_LIST.find(c => c.id === активнаяМашина) || CARS_LIST[0]
  const реальнаяВместимость = Math.floor(активнаяМашинаДанные.capacity * вместимостьМножитель)
  const скоростьМножитель = 1 - (улучшения.скорость * 0.05)
  const реальноеВремя = Math.max(1, Math.floor(активнаяМашинаДанные.time * скоростьМножитель))
  
  const форматВремени = (секунды: number) => {
    if (секунды <= 0) return '✅ Готово!'
    const мин = Math.floor(секунды / 60)
    const сек = секунды % 60
    if (мин === 0) return `${сек} сек`
    return `${мин} мин ${сек} сек`
  }
  
  const getОсталосьВремени = (времяОкончания: number) => {
    return Math.max(0, Math.floor((времяОкончания - Date.now()) / 1000))
  }
  
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'border-green-500 bg-green-900/20'
      case 'rare': return 'border-blue-500 bg-blue-900/20'
      case 'epic': return 'border-purple-500 bg-purple-900/20'
      case 'legendary': return 'border-orange-500 bg-orange-900/20'
      case 'mythic': return 'border-red-500 bg-red-900/20'
      default: return 'border-gray-500'
    }
  }
  
  const getRarityName = (rarity: string) => {
    switch(rarity) {
      case 'common': return '🟢 Обычный'
      case 'rare': return '🔵 Редкий'
      case 'epic': return '🟣 Эпический'
      case 'legendary': return '🟠 Легендарный'
      case 'mythic': return '🔴 Мифический'
      default: return '❓'
    }
  }
  
  const полученныеГлифы = Object.keys(глифы)
  
  const активныеПродажиСейчас = Object.entries(активныеПродажи || {})
    .filter(([, sale]: [string, any]) => sale.времяОкончания > Date.now())
    .map(([id, sale]: [string, any]) => ({ id, ...sale }))
  
  return (
    <div className="p-4">
      <style>{`
        @keyframes coinFly {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .coin-animation {
          position: fixed;
          font-size: 24px;
          pointer-events: none;
          z-index: 100;
          animation: coinFly 1s ease-out forwards;
        }
      `}</style>
      
      {монетки.map(coin => (
        <div key={coin.id} className="coin-animation" style={{ left: coin.x, top: coin.y }}>
          💰
        </div>
      ))}
      
      <h2 className="text-lg font-semibold mb-3">📦 Инвентарь</h2>
      
      <div className="flex border-b border-gray-700 mb-4">
        <button onClick={() => setАктивныйТаб('drugs')} className={`flex-1 py-2 text-sm ${активныйТаб === 'drugs' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>💊 Наркотики</button>
        <button onClick={() => setАктивныйТаб('ingredients')} className={`flex-1 py-2 text-sm ${активныйТаб === 'ingredients' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>🧪 Ингредиенты</button>
        <button onClick={() => setАктивныйТаб('equipment')} className={`flex-1 py-2 text-sm ${активныйТаб === 'equipment' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>🔧 Оборудование</button>
        <button onClick={() => setАктивныйТаб('glyphs')} className={`flex-1 py-2 text-sm ${активныйТаб === 'glyphs' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>📖 Глифы</button>
      </div>
      
      {активныйТаб === 'drugs' && (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-400 text-sm">🚚 Активные продажи:</h3>
              <span className="text-xs text-gray-500">{активныеПродажиСейчас.length} / 5</span>
            </div>
            <div className="space-y-2">
              {активныеПродажиСейчас.length > 0 ? (
                активныеПродажиСейчас.map((sale: any) => {
                  const осталось = getОсталосьВремени(sale.времяОкончания)
                  return (
                    <div key={sale.id} className="bg-gray-800 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <span className="font-medium text-yellow-400">{sale.количество}г {DRUGS_BASE[sale.товар]?.name || sale.товар}</span>
                          <span className="text-gray-400 ml-2">→ ${sale.выручка.toLocaleString()}</span>
                        </div>
                        <div className="text-blue-400 text-sm">{форматВремени(осталось)}</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(0, Math.min(100, 100 - (осталось / (sale.время * 60) * 100)))}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Доставка: {sale.время} мин
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="bg-gray-800 p-3 rounded-lg text-center text-gray-500 text-sm">
                  Нет активных продаж
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4 p-2 bg-blue-900/30 rounded-lg text-center text-sm">
            <span className="text-blue-400">🚗 Активная машина:</span>
            <span className="text-white font-bold ml-2">{активнаяМашинаДанные.name}</span>
            <span className="text-gray-400 ml-2">
              (вместимость: {реальнаяВместимость}г, время: {реальноеВремя} мин)
              {улучшения.вместимость > 0 && <span className="text-green-400 ml-1">(+{улучшения.вместимость * 10}%)</span>}
              {улучшения.скорость > 0 && <span className="text-green-400 ml-1">(-{улучшения.скорость * 5}%)</span>}
            </span>
          </div>
          
          <div className="space-y-2">
            {Object.entries(DRUGS_BASE).map(([ключ, наркотик]) => {
              const количество = инвентарь[ключ] || 0
              const цена = getPrice(ключ)
              const максПродажа = Math.min(количество, реальнаяВместимость)
              
              return (
                <div key={ключ} className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{наркотик.name}</span>
                    <span className="text-green-400">{количество} г</span>
                  </div>
                  <div className="text-xs text-yellow-400 mb-2">💰 {цена} $/грамм</div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex gap-2 flex-1 min-w-[150px]">
                      <input 
                        type="number" 
                        id={`grams_${ключ}`} 
                        min={1} 
                        max={максПродажа} 
                        defaultValue={Math.min(1, количество)} 
                        className="w-20 bg-gray-700 p-2 rounded text-sm"
                      />
                      <button 
                        onClick={(e) => {
                          const input = document.getElementById(`grams_${ключ}`) as HTMLInputElement
                          let grams = parseInt(input.value)
                          if (isNaN(grams)) grams = 1
                          if (grams <= 0) alert('❌ Введите положительное количество!')
                          else if (grams > количество) alert(`❌ У вас только ${количество}г!`)
                          else if (grams > реальнаяВместимость) alert(`❌ Машина может увезти только ${реальнаяВместимость}г!`)
                          else {
                            const rect = (e.target as HTMLElement).getBoundingClientRect()
                            показатьМонетки(rect.left + rect.width / 2, rect.top)
                            начатьПродажу(ключ, grams, цена)
                          }
                        }} 
                        disabled={количество === 0} 
                        className={`flex-1 py-2 rounded text-sm font-semibold ${количество > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'}`}>
                        🚗 Продать
                      </button>
                    </div>
                    
                    {количество > 0 && максПродажа > 0 && (
                      <button 
                        onClick={() => {
                          if (confirm(`📦 Продать ${максПродажа}г ${наркотик.name}?\n💰 Выручка: $${(максПродажа * цена).toLocaleString()}\n🚗 Машина: ${активнаяМашинаДанные.name} (${реальноеВремя} мин)`)) {
                            начатьПродажу(ключ, максПродажа, цена)
                          }
                        }}
                        className="px-3 py-2 rounded text-sm font-semibold bg-green-600 hover:bg-green-700"
                      >
                        Макс ({максПродажа}г)
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
      
      {активныйТаб === 'ingredients' && (
        <div className="space-y-2">
          {Object.entries(инвентарь)
            .filter(([key]) => !Object.keys(DRUGS_BASE).includes(key))
            .map(([название, количество]) => (
              <div key={название} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-medium text-sm">{название.replace(/_/g, ' ')}</span>
                </div>
                <div className="text-yellow-400">{количество} шт</div>
              </div>
            ))}
          {Object.entries(инвентарь).filter(([key]) => !Object.keys(DRUGS_BASE).includes(key)).length === 0 && (
            <div className="text-center text-gray-500 py-8">Нет ингредиентов</div>
          )}
        </div>
      )}
      
      {активныйТаб === 'equipment' && <InventoryEquipment />}
      
      {активныйТаб === 'glyphs' && (
        <>
          <div className="mb-4 bg-gray-800 p-3 rounded-lg">
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
          
          <div className="space-y-2">
            {GLYPHS.map(glyph => {
              const owned = полученныеГлифы.includes(glyph.id)
              const equipped = экипированныеГлифы.includes(glyph.id)
              
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
        </>
      )}
    </div>
  )
}