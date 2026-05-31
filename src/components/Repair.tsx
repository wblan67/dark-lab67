// @ts-nocheck
import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { EQUIPMENT_CONFIG, RARITIES } from '../config/equipment'

export default function Repair() {
  const [активнаяВкладка, setАктивнаяВкладка] = useState<'equipment' | 'cars'>('equipment')
  const [выбранныйЭкземпляр, setВыбранныйЭкземпляр] = useState<string | null>(null)
  const [выбраннаяМашина, setВыбраннаяМашина] = useState<string | null>(null)
  
  const оборудованиеИнстансы = useGameStore((state) => state.оборудованиеИнстансы || {})
  const оборудованиеИнстансыДанные = useGameStore((state) => state.оборудованиеИнстансыДанные || {})
  const машины = useGameStore((state) => state.машины || {})
  const баланс = useGameStore((state) => state.баланс)
  const починитьОборудование = useGameStore((state) => state.починитьОборудование)
  const починитьМашину = useGameStore((state) => state.починитьМашину)
  
  // Конфиг машин
  const CARS_CONFIG: Record<string, { name: string; icon: string; basePrice: number }> = {
    bicycle: { name: 'Велосипед', icon: '🛵', basePrice: 500 },
    scooter: { name: 'Скутер', icon: '🏍️', basePrice: 800 },
    cheapCar: { name: 'Дешёвая тачка', icon: '🚗', basePrice: 1500 },
    minibus: { name: 'Микроавтобус', icon: '🚐', basePrice: 3000 },
    truck: { name: 'Грузовик', icon: '🚚', basePrice: 5000 },
    bigTruck: { name: 'Фура', icon: '🚛', basePrice: 8000 },
    armored: { name: 'Бронированный', icon: '🚀', basePrice: 15000 },
    helicopter: { name: 'Вертолёт', icon: '🚁', basePrice: 25000 },
    plane: { name: 'Самолёт', icon: '✈️', basePrice: 50000 },
    secret: { name: 'Секретная', icon: '🛸', basePrice: 100000 }
  }
  
  // Получаем все инстансы оборудования с износом > 0
  const поврежденныеИнстансы: { 
    instanceId: string
    itemId: string
    name: string
    icon: string
    rarity: string
    wear: number
    repairCost: number
  }[] = []
  
  for (const [itemId, instanceIds] of Object.entries(оборудованиеИнстансы)) {
    const config = EQUIPMENT_CONFIG.find(e => e.id === itemId)
    if (!config) continue
    
    for (const instanceId of instanceIds) {
      const data = оборудованиеИнстансыДанные[instanceId]
      if (data && data.wear > 0) {
        const baseRepairPrice = Math.floor(config.basePrice / 5)
        const multiplier: Record<string, number> = {
          common: 1.0,
          rare: 1.5,
          epic: 2.0,
          legendary: 3.0,
          mythic: 5.0
        }
        const repairCost = Math.ceil((data.wear / 100) * baseRepairPrice * (multiplier[data.rarity] || 1.0))
        
        поврежденныеИнстансы.push({
          instanceId,
          itemId,
          name: config.name,
          icon: config.icon,
          rarity: data.rarity,
          wear: data.wear,
          repairCost
        })
      }
    }
  }
  
  // Получаем машины с износом > 0
  const поврежденныеМашины: {
    carId: string
    name: string
    icon: string
    wear: number
    repairCost: number
  }[] = []
  
  for (const [carId, data] of Object.entries(машины)) {
    if (data.износ && data.износ > 0 && carId !== 'walk') {
      const config = CARS_CONFIG[carId]
      if (config) {
        const repairCost = Math.ceil((data.износ / 100) * config.basePrice / 5)
        поврежденныеМашины.push({
          carId,
          name: config.name,
          icon: config.icon,
          wear: data.износ,
          repairCost
        })
      }
    }
  }
  
  const getRarityIcon = (rarity: string) => {
    const icons: Record<string, string> = {
      common: '⚪',
      rare: '🔵',
      epic: '🟣',
      legendary: '🟠',
      mythic: '🔴'
    }
    return icons[rarity] || '⚪'
  }
  
  const getRarityName = (rarity: string) => {
    const names: Record<string, string> = {
      common: 'Обычный',
      rare: 'Редкий',
      epic: 'Эпический',
      legendary: 'Легендарный',
      mythic: 'Мифический'
    }
    return names[rarity] || 'Обычный'
  }
  
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'border-gray-500 bg-gray-900/50'
      case 'rare': return 'border-blue-500 bg-blue-900/30'
      case 'epic': return 'border-purple-500 bg-purple-900/30'
      case 'legendary': return 'border-orange-500 bg-orange-900/30'
      case 'mythic': return 'border-red-500 bg-red-900/30'
      default: return 'border-gray-500'
    }
  }
  
  const handleRepairEquipment = async () => {
    if (выбранныйЭкземпляр) {
      await починитьОборудование(выбранныйЭкземпляр)
      setВыбранныйЭкземпляр(null)
    }
  }
  
  const handleRepairCar = async () => {
    if (выбраннаяМашина) {
      await починитьМашину(выбраннаяМашина)
      setВыбраннаяМашина(null)
    }
  }
  
  const выбранныйДанные = поврежденныеИнстансы.find(i => i.instanceId === выбранныйЭкземпляр)
  const выбраннаяДанныеМашины = поврежденныеМашины.find(c => c.carId === выбраннаяМашина)
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">🔧 Ремонт</h2>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-yellow-400">💰</span>
          <span className="text-white ml-1">{баланс.toLocaleString()}$</span>
        </div>
      </div>
      
      {/* Вкладки */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          onClick={() => {
            setАктивнаяВкладка('equipment')
            setВыбранныйЭкземпляр(null)
          }}
          className={`flex-1 py-2 text-sm ${активнаяВкладка === 'equipment' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
        >
          🔧 Оборудование
        </button>
        <button
          onClick={() => {
            setАктивнаяВкладка('cars')
            setВыбраннаяМашина(null)
          }}
          className={`flex-1 py-2 text-sm ${активнаяВкладка === 'cars' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
        >
          🚗 Транспорт
        </button>
      </div>
      
      {/* ОБОРУДОВАНИЕ */}
      {активнаяВкладка === 'equipment' && (
        <>
          {поврежденныеИнстансы.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
              ✅ Всё оборудование в идеальном состоянии!
            </div>
          ) : (
            <>
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <label className="block text-sm text-gray-400 mb-2">📦 Выберите оборудование для ремонта:</label>
                <select
                  value={выбранныйЭкземпляр || ''}
                  onChange={(e) => setВыбранныйЭкземпляр(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded text-white"
                >
                  <option value="">-- Выберите оборудование --</option>
                  {поврежденныеИнстансы.map(inst => (
                    <option key={inst.instanceId} value={inst.instanceId}>
                      {inst.icon} {inst.name} ({getRarityIcon(inst.rarity)} {getRarityName(inst.rarity)}) — износ: {Math.floor(inst.wear)}% — {inst.repairCost}$
                    </option>
                  ))}
                </select>
              </div>
              
              {выбранныйДанные && (
                <div className={`bg-gray-800 p-4 rounded-lg mb-4 border-l-4 ${getRarityColor(выбранныйДанные.rarity)}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{выбранныйДанные.icon}</span>
                    <div>
                      <div className="font-bold text-white">{выбранныйДанные.name}</div>
                      <div className="text-sm text-gray-400">
                        {getRarityIcon(выбранныйДанные.rarity)} {getRarityName(выбранныйДанные.rarity)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-400">🔧 Износ: {Math.floor(выбранныйДанные.wear)}%</span>
                      <span className="text-yellow-400">💰 Ремонт: ${выбранныйДанные.repairCost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${выбранныйДанные.wear}%` }}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRepairEquipment}
                    disabled={баланс < выбранныйДанные.repairCost}
                    className={`w-full py-2 rounded font-semibold ${
                      баланс >= выбранныйДанные.repairCost
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-gray-600 cursor-not-allowed text-gray-400'
                    }`}
                  >
                    {баланс >= выбранныйДанные.repairCost 
                      ? `🔧 Починить ($${выбранныйДанные.repairCost.toLocaleString()})` 
                      : `❌ Не хватает денег (нужно $${выбранныйДанные.repairCost.toLocaleString()})`}
                  </button>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">📋 Все повреждённые предметы:</h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {поврежденныеИнстансы.map(inst => (
                    <div 
                      key={inst.instanceId}
                      className={`p-2 rounded text-sm cursor-pointer transition ${getRarityColor(inst.rarity)} ${выбранныйЭкземпляр === inst.instanceId ? 'border-2 border-yellow-500' : 'hover:bg-gray-700'}`}
                      onClick={() => setВыбранныйЭкземпляр(inst.instanceId)}
                    >
                      {inst.icon} {inst.name} ({getRarityIcon(inst.rarity)} {getRarityName(inst.rarity)}) — износ: {Math.floor(inst.wear)}% — {inst.repairCost}$
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
      
      {/* ТРАНСПОРТ */}
      {активнаяВкладка === 'cars' && (
        <>
          {поврежденныеМашины.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
              ✅ Весь транспорт в идеальном состоянии!
            </div>
          ) : (
            <>
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <label className="block text-sm text-gray-400 mb-2">🚗 Выберите транспорт для ремонта:</label>
                <select
                  value={выбраннаяМашина || ''}
                  onChange={(e) => setВыбраннаяМашина(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded text-white"
                >
                  <option value="">-- Выберите транспорт --</option>
                  {поврежденныеМашины.map(car => (
                    <option key={car.carId} value={car.carId}>
                      {car.icon} {car.name} — износ: {Math.floor(car.wear)}% — {car.repairCost}$
                    </option>
                  ))}
                </select>
              </div>
              
              {выбраннаяДанныеМашины && (
                <div className="bg-gray-800 p-4 rounded-lg mb-4 border-l-4 border-orange-500">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{выбраннаяДанныеМашины.icon}</span>
                    <div>
                      <div className="font-bold text-white">{выбраннаяДанныеМашины.name}</div>
                      <div className="text-sm text-gray-400">Транспорт</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-400">🔧 Износ: {Math.floor(выбраннаяДанныеМашины.wear)}%</span>
                      <span className="text-yellow-400">💰 Ремонт: ${выбраннаяДанныеМашины.repairCost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${выбраннаяДанныеМашины.wear}%` }}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRepairCar}
                    disabled={баланс < выбраннаяДанныеМашины.repairCost}
                    className={`w-full py-2 rounded font-semibold ${
                      баланс >= выбраннаяДанныеМашины.repairCost
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-gray-600 cursor-not-allowed text-gray-400'
                    }`}
                  >
                    {баланс >= выбраннаяДанныеМашины.repairCost 
                      ? `🔧 Починить ($${выбраннаяДанныеМашины.repairCost.toLocaleString()})` 
                      : `❌ Не хватает денег (нужно $${выбраннаяДанныеМашины.repairCost.toLocaleString()})`}
                  </button>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">📋 Весь повреждённый транспорт:</h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {поврежденныеМашины.map(car => (
                    <div 
                      key={car.carId}
                      className={`p-2 rounded text-sm cursor-pointer transition bg-gray-800 ${выбраннаяМашина === car.carId ? 'border-2 border-yellow-500' : 'hover:bg-gray-700'}`}
                      onClick={() => setВыбраннаяМашина(car.carId)}
                    >
                      {car.icon} {car.name} — износ: {Math.floor(car.wear)}% — {car.repairCost}$
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
      
      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
        <h3 className="font-semibold mb-1 text-gray-300">🔧 Как работает ремонт:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>💰 Цена ремонта зависит от цены предмета и его износа</li>
          <li>⚡ Чем выше износ — тем дороже ремонт</li>
          <li>🔧 Оборудование: цена зависит от редкости (⚪→🔵→🟣→🟠→🔴)</li>
          <li>🚗 Транспорт: цена зависит от стоимости машины</li>
          <li>💡 Ремонтируй вовремя, чтобы не потерять эффективность!</li>
        </ul>
      </div>
    </div>
  )
}
