import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

export default function Tuning() {
  const [выбраннаяМашина, setВыбраннаяМашина] = useState<string | null>(null)
  
  const машины = useGameStore((state) => state.машины || {})
  const баланс = useGameStore((state) => state.баланс)
  const улучшенияМашин = useGameStore((state) => state.улучшенияМашин || {})
  const улучшитьМашину = useGameStore((state) => state.улучшитьМашину)
  
  // Список всех машин (кроме "Пешком")
  const доступныеМашины = [
    { id: 'bicycle', name: '🛵 Велосипед', basePrice: 500 },
    { id: 'scooter', name: '🏍️ Скутер', basePrice: 800 },
    { id: 'cheapCar', name: '🚗 Дешёвая тачка', basePrice: 1500 },
    { id: 'minibus', name: '🚐 Микроавтобус', basePrice: 3000 },
    { id: 'truck', name: '🚚 Грузовик', basePrice: 5000 },
    { id: 'bigTruck', name: '🚛 Фура', basePrice: 8000 },
    { id: 'armored', name: '🚀 Бронированный', basePrice: 15000 },
    { id: 'helicopter', name: '🚁 Вертолёт', basePrice: 25000 },
    { id: 'plane', name: '✈️ Самолёт', basePrice: 50000 },
    { id: 'secret', name: '🛸 Секретная', basePrice: 100000 }
  ]
  
  // Фильтруем только купленные машины
  const купленныеМашины = доступныеМашины.filter(car => машины[car.id]?.активна)
  
  const getUpgradeLevel = (carId: string, тип: 'speed' | 'capacity' | 'reliability') => {
    const upgrades = улучшенияМашин[carId] || { скорость: 0, вместимость: 0, надежность: 0 }
    if (тип === 'speed') return upgrades.скорость || 0
    if (тип === 'capacity') return upgrades.вместимость || 0
    return upgrades.надежность || 0
  }
  
  const getUpgradeEffect = (carId: string, тип: 'speed' | 'capacity' | 'reliability') => {
    const level = getUpgradeLevel(carId, тип)
    if (тип === 'speed') return `-${level * 5}% времени | +${level * 5}% скорости`
    if (тип === 'capacity') return `+${level * 10}% вместимости`
    return `-${level * 10}% износа`
  }
  
  const getNextEffect = (carId: string, тип: 'speed' | 'capacity' | 'reliability') => {
    const level = getUpgradeLevel(carId, тип)
    if (level >= 5) return 'Максимум'
    if (тип === 'speed') return `Следующий: -${(level + 1) * 5}% времени`
    if (тип === 'capacity') return `Следующий: +${(level + 1) * 10}% вместимости`
    return `Следующий: -${(level + 1) * 10}% износа`
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
  
  const totalUpgrades = (carId: string) => {
    const speed = getUpgradeLevel(carId, 'speed')
    const capacity = getUpgradeLevel(carId, 'capacity')
    const reliability = getUpgradeLevel(carId, 'reliability')
    return speed + capacity + reliability
  }
  
  const maxUpgrades = 15 // 5 × 3 = 15
  const upgradeProgress = (carId: string) => (totalUpgrades(carId) / maxUpgrades) * 100
  
  if (купленныеМашины.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">🔧 Тюнинг-ателье</h2>
        <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
          ❌ У вас нет машин для тюнинга.<br/>
          Купите машину в автопарке!
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-4">
      <style>{`
        @keyframes glow {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
        .glow {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">🔧 Тюнинг-ателье</h2>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-yellow-400">💰</span>
          <span className="text-white ml-1">{баланс.toLocaleString()}$</span>
        </div>
      </div>
      
      {/* Выбор машины */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <label className="block text-sm text-gray-400 mb-2">🚗 Выберите автомобиль для тюнинга:</label>
        <select
          value={выбраннаяМашина || ''}
          onChange={(e) => setВыбраннаяМашина(e.target.value)}
          className="w-full bg-gray-700 p-2 rounded text-white"
        >
          <option value="">-- Выберите машину --</option>
          {купленныеМашины.map(car => {
            const total = totalUpgrades(car.id)
            return (
              <option key={car.id} value={car.id}>
                {car.name} — {total}/15 улучшений | ⭐{getUpgradeLevel(car.id, 'speed')}+📦{getUpgradeLevel(car.id, 'capacity')}+🛡️{getUpgradeLevel(car.id, 'reliability')}
              </option>
            )
          })}
        </select>
      </div>
      
      {/* Интерфейс тюнинга для выбранной машины */}
      {выбраннаяМашина && (
        <div className="space-y-3">
          {/* Общий прогресс */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">📊 Общий прогресс тюнинга:</span>
              <span className="text-yellow-400">{totalUpgrades(выбраннаяМашина)} / 15</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${upgradeProgress(выбраннаяМашина)}%` }}
              />
            </div>
          </div>
          
          {/* Улучшение скорости */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>Скорость</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-700">
                    Уровень {getUpgradeLevel(выбраннаяМашина, 'speed')}/5
                  </span>
                </div>
                <div className="text-xs text-green-400 mt-1">
                  {getUpgradeEffect(выбраннаяМашина, 'speed')}
                </div>
                <div className="text-xs text-gray-500">
                  {getNextEffect(выбраннаяМашина, 'speed')}
                </div>
              </div>
              {getUpgradeLevel(выбраннаяМашина, 'speed') < 5 && (
                <button
                  onClick={() => улучшитьМашину(выбраннаяМашина, 'speed')}
                  disabled={баланс < getUpgradePrice(выбраннаяМашина, 'speed')}
                  className={`px-4 py-2 rounded text-sm font-semibold transition ${
                    баланс >= getUpgradePrice(выбраннаяМашина, 'speed')
                      ? 'bg-purple-600 hover:bg-purple-700 glow'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  ${getUpgradePrice(выбраннаяМашина, 'speed').toLocaleString()}
                </button>
              )}
              {getUpgradeLevel(выбраннаяМашина, 'speed') === 5 && (
                <div className="px-4 py-2 rounded text-sm font-semibold bg-green-600">
                  ✅ MAX
                </div>
              )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
              <div 
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${(getUpgradeLevel(выбраннаяМашина, 'speed') / 5) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Улучшение вместимости */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  <span>Вместимость</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-700">
                    Уровень {getUpgradeLevel(выбраннаяМашина, 'capacity')}/5
                  </span>
                </div>
                <div className="text-xs text-green-400 mt-1">
                  {getUpgradeEffect(выбраннаяМашина, 'capacity')}
                </div>
                <div className="text-xs text-gray-500">
                  {getNextEffect(выбраннаяМашина, 'capacity')}
                </div>
              </div>
              {getUpgradeLevel(выбраннаяМашина, 'capacity') < 5 && (
                <button
                  onClick={() => улучшитьМашину(выбраннаяМашина, 'capacity')}
                  disabled={баланс < getUpgradePrice(выбраннаяМашина, 'capacity')}
                  className={`px-4 py-2 rounded text-sm font-semibold transition ${
                    баланс >= getUpgradePrice(выбраннаяМашина, 'capacity')
                      ? 'bg-purple-600 hover:bg-purple-700 glow'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  ${getUpgradePrice(выбраннаяМашина, 'capacity').toLocaleString()}
                </button>
              )}
              {getUpgradeLevel(выбраннаяМашина, 'capacity') === 5 && (
                <div className="px-4 py-2 rounded text-sm font-semibold bg-green-600">
                  ✅ MAX
                </div>
              )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
              <div 
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${(getUpgradeLevel(выбраннаяМашина, 'capacity') / 5) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Улучшение надёжности */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>
                  <span>Надёжность</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-700">
                    Уровень {getUpgradeLevel(выбраннаяМашина, 'reliability')}/5
                  </span>
                </div>
                <div className="text-xs text-green-400 mt-1">
                  {getUpgradeEffect(выбраннаяМашина, 'reliability')}
                </div>
                <div className="text-xs text-gray-500">
                  {getNextEffect(выбраннаяМашина, 'reliability')}
                </div>
              </div>
              {getUpgradeLevel(выбраннаяМашина, 'reliability') < 5 && (
                <button
                  onClick={() => улучшитьМашину(выбраннаяМашина, 'reliability')}
                  disabled={баланс < getUpgradePrice(выбраннаяМашина, 'reliability')}
                  className={`px-4 py-2 rounded text-sm font-semibold transition ${
                    баланс >= getUpgradePrice(выбраннаяМашина, 'reliability')
                      ? 'bg-purple-600 hover:bg-purple-700 glow'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  ${getUpgradePrice(выбраннаяМашина, 'reliability').toLocaleString()}
                </button>
              )}
              {getUpgradeLevel(выбраннаяМашина, 'reliability') === 5 && (
                <div className="px-4 py-2 rounded text-sm font-semibold bg-green-600">
                  ✅ MAX
                </div>
              )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
              <div 
                className="bg-orange-500 h-1.5 rounded-full"
                style={{ width: `${(getUpgradeLevel(выбраннаяМашина, 'reliability') / 5) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Сводка улучшений */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">📊 Сводка улучшений:</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-blue-400">⚡ Скорость</div>
                <div className="text-white font-bold">{getUpgradeLevel(выбраннаяМашина, 'speed')}/5</div>
                <div className="text-green-400">-{getUpgradeLevel(выбраннаяМашина, 'speed') * 5}% времени</div>
              </div>
              <div>
                <div className="text-green-400">📦 Вместимость</div>
                <div className="text-white font-bold">{getUpgradeLevel(выбраннаяМашина, 'capacity')}/5</div>
                <div className="text-green-400">+{getUpgradeLevel(выбраннаяМашина, 'capacity') * 10}% груза</div>
              </div>
              <div>
                <div className="text-orange-400">🛡️ Надёжность</div>
                <div className="text-white font-bold">{getUpgradeLevel(выбраннаяМашина, 'reliability')}/5</div>
                <div className="text-green-400">-{getUpgradeLevel(выбраннаяМашина, 'reliability') * 10}% износа</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
        <h3 className="font-semibold mb-1 text-gray-300">🔧 Как работает тюнинг:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>⚡ Скорость — уменьшает время продажи (до -25%)</li>
          <li>📦 Вместимость — увеличивает максимальный груз (до +50%)</li>
          <li>🛡️ Надёжность — уменьшает износ за поездку (до -50%)</li>
          <li>💰 Цена улучшения растёт с каждым уровнем</li>
          <li>🔧 Максимальный уровень улучшения — 5 для каждой характеристики</li>
          <li>✨ Всего 15 улучшений на машину</li>
        </ul>
      </div>
    </div>
  )
}