
// @ts-nocheckimport { useState } from 'react'
import { useGameStore } from '../store/gameStore'

const CARS_LIST = [
  { id: 'walk', name: '🚶‍♂️ Пешком', drug: null, amount: 0, time: 20, capacity: 10, level: 0, free: true },
  { id: 'bicycle', name: '🛵 Велосипед', drug: 'marijuana', amount: 10, time: 15, capacity: 20, level: 1, free: false },
  { id: 'scooter', name: '🏍️ Скутер', drug: 'marijuana', amount: 15, time: 12, capacity: 30, level: 2, free: false },
  { id: 'cheapCar', name: '🚗 Дешёвая тачка', drug: 'marijuana', amount: 20, time: 10, capacity: 50, level: 3, free: false },
  { id: 'minibus', name: '🚐 Микроавтобус', drug: 'meth', amount: 10, time: 8, capacity: 80, level: 4, free: false },
  { id: 'truck', name: '🚚 Грузовик', drug: 'meth', amount: 20, time: 6, capacity: 120, level: 5, free: false },
  { id: 'bigTruck', name: '🚛 Фура', drug: 'meth', amount: 30, time: 5, capacity: 180, level: 6, free: false },
  { id: 'armored', name: '🚀 Бронированный', drug: 'cocaine', amount: 20, time: 4, capacity: 250, level: 7, free: false },
  { id: 'helicopter', name: '🚁 Вертолёт', drug: 'cocaine', amount: 35, time: 3, capacity: 350, level: 8, free: false },
  { id: 'plane', name: '✈️ Самолёт', drug: 'blue_meth', amount: 25, time: 2, capacity: 500, level: 9, free: false },
  { id: 'secret', name: '🛸 Секретная', drug: 'lsd', amount: 30, time: 1, capacity: 1000, level: 10, free: false }
]

export default function Cars() {
  const { машины, инвентарь, активнаяМашина, купитьМашину, экипироватьМашину, улучшенияМашин, улучшитьМашину } = useGameStore()
  
  const getUpgradeLevel = (carId: string, тип: 'speed' | 'capacity' | 'reliability') => {
    const upgrades = улучшенияМашин?.[carId] || { скорость: 0, вместимость: 0, надежность: 0 }
    if (тип === 'speed') return upgrades.скорость || 0
    if (тип === 'capacity') return upgrades.вместимость || 0
    return upgrades.надежность || 0
  }
  
  const getUpgradeEffect = (carId: string, тип: 'speed' | 'capacity' | 'reliability', level: number) => {
    if (тип === 'speed') return `-${level * 5}% времени`
    if (тип === 'capacity') return `+${level * 10}% вместимости`
    return `-${level * 10}% износа`
  }
  
  const getUpgradePrice = (carId: string, тип: 'speed' | 'capacity' | 'reliability') => {
    const level = getUpgradeLevel(carId, тип)
    if (level >= 5) return 0
    
    const CARS_PRICE: Record<string, number> = {
      bicycle: 500,
      scooter: 800,
      cheapCar: 1500,
      minibus: 3000,
      truck: 5000,
      bigTruck: 8000,
      armored: 15000,
      helicopter: 25000,
      plane: 50000,
      secret: 100000
    }
    const базоваяЦена = CARS_PRICE[carId] || 1000
    return Math.floor(базоваяЦена * (level + 1) * 1.5)
  }
  
  // Функция для получения улучшенной вместимости
  const getRealCapacity = (car: typeof CARS_LIST[0]) => {
    if (car.id === 'walk') return car.capacity
    const level = getUpgradeLevel(car.id, 'capacity')
    const множитель = 1 + (level * 0.1)
    return Math.floor(car.capacity * множитель)
  }
  
  // Функция для получения улучшенного времени
  const getRealTime = (car: typeof CARS_LIST[0]) => {
    if (car.id === 'walk') return car.time
    const level = getUpgradeLevel(car.id, 'speed')
    const множитель = 1 - (level * 0.05)
    return Math.max(1, Math.floor(car.time * множитель))
  }
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">🚗 Автопарк</h2>
      
      <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-2 mb-4 text-center">
        <span className="text-blue-400 text-sm">🚀 Активная машина:</span>
        <span className="text-white font-bold ml-2">
          {CARS_LIST.find(c => c.id === активнаяМашина)?.name || '🚶‍♂️ Пешком'}
        </span>
      </div>
      
      <div className="space-y-3">
        {CARS_LIST.map((car) => {
          const isOwned = машины?.[car.id]?.активна || car.free
          const isActive = активнаяМашина === car.id
          const нуженНаркотик = car.drug
          const нужноГрамм = car.amount
          const естьГрамм = нуженНаркотик ? (инвентарь?.[нуженНаркотик] || 0) : 999
          const можноКупить = !isOwned && естьГрамм >= нужноГрамм
          
          const speedLevel = getUpgradeLevel(car.id, 'speed')
          const capacityLevel = getUpgradeLevel(car.id, 'capacity')
          const reliabilityLevel = getUpgradeLevel(car.id, 'reliability')
          
          const реальноеВремя = getRealTime(car)
          const реальнаяВместимость = getRealCapacity(car)
          
          return (
            <div key={car.id} className={`bg-gray-800 p-3 rounded-lg ${isActive ? 'border-2 border-blue-500' : ''}`}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium">{car.name}</span>
                  <span className="text-xs text-gray-500 ml-2">Уровень {car.level}</span>
                </div>
                {!car.free && <div className="text-sm text-yellow-400">{car.amount}г {car.drug}</div>}
              </div>
              
              <div className="text-sm text-gray-400 mb-2">
                ⏱️ Продажа: {реальноеВремя} мин 
                {speedLevel > 0 && <span className="text-green-400 ml-1">(-{speedLevel * 5}%)</span>}
                {' | '}
                📦 Вместимость: {реальнаяВместимость}г
                {capacityLevel > 0 && <span className="text-green-400 ml-1">(+{capacityLevel * 10}%)</span>}
              </div>
              
              {/* Улучшения */}
              {isOwned && car.id !== 'walk' && (
                <div className="mt-2 p-2 bg-gray-700/50 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">🔧 Улучшения:</div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center">
                      <div>⚡ Скорость</div>
                      <div className="text-yellow-400">{speedLevel}/5</div>
                      <div className="text-green-400 text-[10px]">{getUpgradeEffect(car.id, 'speed', speedLevel)}</div>
                      {speedLevel < 5 && (
                        <button 
                          onClick={() => улучшитьМашину(car.id, 'speed')}
                          className="mt-1 px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-700 text-[10px] transition"
                        >
                          ${getUpgradePrice(car.id, 'speed').toLocaleString()}
                        </button>
                      )}
                      {speedLevel === 5 && <div className="mt-1 text-green-500 text-[10px]">✅ MAX</div>}
                    </div>
                    <div className="text-center">
                      <div>📦 Вместимость</div>
                      <div className="text-yellow-400">{capacityLevel}/5</div>
                      <div className="text-green-400 text-[10px]">{getUpgradeEffect(car.id, 'capacity', capacityLevel)}</div>
                      {capacityLevel < 5 && (
                        <button 
                          onClick={() => улучшитьМашину(car.id, 'capacity')}
                          className="mt-1 px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-700 text-[10px] transition"
                        >
                          ${getUpgradePrice(car.id, 'capacity').toLocaleString()}
                        </button>
                      )}
                      {capacityLevel === 5 && <div className="mt-1 text-green-500 text-[10px]">✅ MAX</div>}
                    </div>
                    <div className="text-center">
                      <div>🛡️ Надёжность</div>
                      <div className="text-yellow-400">{reliabilityLevel}/5</div>
                      <div className="text-green-400 text-[10px]">{getUpgradeEffect(car.id, 'reliability', reliabilityLevel)}</div>
                      {reliabilityLevel < 5 && (
                        <button 
                          onClick={() => улучшитьМашину(car.id, 'reliability')}
                          className="mt-1 px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-700 text-[10px] transition"
                        >
                          ${getUpgradePrice(car.id, 'reliability').toLocaleString()}
                        </button>
                      )}
                      {reliabilityLevel === 5 && <div className="mt-1 text-green-500 text-[10px]">✅ MAX</div>}
                    </div>
                  </div>
                </div>
              )}
              
              {isOwned ? (
                <button onClick={() => экипироватьМашину(car.id)} disabled={isActive} className={`w-full py-2 rounded font-semibold mt-2 transition ${isActive ? 'bg-blue-600 cursor-default' : 'bg-yellow-600 hover:bg-yellow-700'}`}>
                  {isActive ? '✅ Экипирована' : '🔧 Экипировать'}
                </button>
              ) : (
                !car.free && (
                  <button onClick={() => купитьМашину(car.id)} disabled={!можноКупить} className={`w-full py-2 rounded font-semibold mt-2 transition ${можноКупить ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}>
                    Купить за {car.amount}г {car.drug}
                  </button>
                )
              )}
            </div>
          )
        })}
      </div>
      
      <div className="bg-gray-800 p-3 rounded-lg mt-4">
        <h3 className="text-sm font-semibold mb-2">🔧 Тюнинг машин:</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• ⚡ Скорость — уменьшает время продажи (до -25%)</li>
          <li>• 📦 Вместимость — увеличивает максимальный груз (до +50%)</li>
          <li>• 🛡️ Надёжность — уменьшает износ за поездку (до -50%)</li>
          <li>• 💰 Цена улучшения растёт с каждым уровнем</li>
          <li>• 🔥 Максимальный уровень улучшения — 5</li>
          <li>• 🚶‍♂️ Пешком нельзя улучшить</li>
        </ul>
      </div>
    </div>
  )
}
