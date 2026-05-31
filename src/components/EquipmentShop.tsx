import { useGameStore } from '../store/gameStore'

// Простой конфиг оборудования прямо в компоненте
const EQUIPMENT_LIST = [
  { id: 'filter', name: '🔍 Фильтр', price: 50, maxCount: 20 },
  { id: 'pot', name: '🍲 Котелок', price: 100, maxCount: 20 },
  { id: 'junk_stove', name: '♨️ Бомж-печка', price: 150, maxCount: 20 },
  { id: 'mixing_barrel', name: '🛢️ Смесительная бочка', price: 80, maxCount: 20 },
  { id: 'lamps', name: '💡 Лампы', price: 500, maxCount: 20 },
  { id: 'glass_flask', name: '🧪 Стеклянная колба', price: 400, maxCount: 15 },
  { id: 'electric_stove', name: '🔥 Электроплитка', price: 200, maxCount: 15 },
  { id: 'growbox', name: '🌱 Гроубокс', price: 600, maxCount: 15 },
  { id: 'press', name: '🔧 Пресс', price: 500, maxCount: 15 },
  { id: 'round_flask', name: '⚗️ Круглодонная колба', price: 1000, maxCount: 15 },
  { id: 'condenser', name: '💨 Конденсатор', price: 1500, maxCount: 10 },
  { id: 'heating_mantle', name: '🌡️ Нагревательная мантия', price: 2000, maxCount: 10 },
  { id: 'magnetic_stirrer', name: '🧲 Магнитная мешалка', price: 1200, maxCount: 10 },
  { id: 'gas_generator', name: '⛽ Газогенератор', price: 1800, maxCount: 10 },
  { id: 'vacuum_pump', name: '🔄 Вакуумный насос', price: 3000, maxCount: 5 },
  { id: 'pill_press', name: '💊 Таблеточный пресс', price: 2500, maxCount: 5 },
  { id: 'chromatograph', name: '📊 Хроматограф', price: 4000, maxCount: 3 }
]

export default function EquipmentShop() {
  const баланс = useGameStore((state) => state.баланс)
  const оборудованиеИнстансы = useGameStore((state) => state.оборудованиеИнстансы || {})
  const купитьОборудованиеИнстанс = useGameStore((state) => state.купитьОборудованиеИнстанс)
  
  const getOwnedCount = (itemId: string) => {
    return (оборудованиеИнстансы[itemId] || []).length
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">🔧 Магазин оборудования</h2>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-yellow-400">💰</span>
          <span className="text-white ml-1">{баланс.toLocaleString()}$</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {EQUIPMENT_LIST.map((item) => {
          const ownedCount = getOwnedCount(item.id)
          const maxCount = item.maxCount
          const canBuy = ownedCount < maxCount && баланс >= item.price
          
          return (
            <div key={item.id} className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-white flex items-center gap-2">
                    {item.name}
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                      ⚪ Обычный
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    💰 Цена: ${item.price}
                  </div>
                </div>
                {ownedCount > 0 && (
                  <span className="text-green-400 text-sm">
                    ✅ {ownedCount}/{maxCount}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="text-yellow-400 text-sm">💰 {item.price.toLocaleString()}$</div>
                <button
                  onClick={() => купитьОборудованиеИнстанс(item.id)}
                  disabled={!canBuy}
                  className={`px-4 py-1 rounded text-sm ${
                    canBuy ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 cursor-not-allowed text-gray-400'
                  }`}
                >
                  {ownedCount >= maxCount ? 'Максимум' : 'Купить'}
                </button>
              </div>
              
              {/* Прогресс-бар */}
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(ownedCount / maxCount) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {ownedCount} / {maxCount} экземпляров
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
        <h3 className="font-semibold mb-1 text-gray-300">⚙️ Как работает оборудование:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>🟢 Всё купленное оборудование — Обычное</li>
          <li>🔮 Скрещивай 2 одинаковых предмета → шанс улучшить редкость</li>
          <li>📈 Чем выше редкость — тем медленнее износ, но дороже ремонт</li>
          <li>🛡️ Амулет защиты (в магазине за осколки) спасает от сгорания</li>
          <li>💡 Чем больше экземпляров — тем больше шансов на улучшение!</li>
        </ul>
      </div>
    </div>
  )
}