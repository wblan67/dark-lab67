import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

// Список ачивок прямо в компоненте (чтобы не зависеть от config)
const ACHIEVEMENTS = [
  // БЫТОВЫЕ
  { id: 'welcome', name: '🏠 Добро пожаловать', description: 'Зайти в игру', category: 'common', rewardExp: 10 },
  { id: 'regular', name: '🏠 Завсегдатай', description: 'Зайти 7 дней подряд', category: 'common', rewardExp: 500 },
  { id: 'hardworker', name: '🏠 Трудоголик', description: 'Провести 1 час в игре', category: 'common', rewardExp: 100 },
  { id: 'marathon', name: '🏠 Марафонец', description: 'Провести 10 часов в игре', category: 'common', rewardExp: 1000 },
  { id: 'resident', name: '🏠 Житель', description: 'Провести 24 часа в игре', category: 'common', rewardExp: 5000 },
  { id: 'clicker', name: '🏠 Кликер', description: 'Сделать 1000 кликов', category: 'common', rewardExp: 200 },
  { id: 'clicker_monster', name: '🏠 Кликер-монстр', description: 'Сделать 5000 кликов', category: 'common', rewardExp: 500 },

  // НАРКОТИКИ
  { id: 'first_craft', name: '🧪 Первый укол', description: 'Сварить первый наркотик', category: 'drugs', rewardExp: 50 },
  { id: 'crazy_chemist', name: '🧪 Химик ебанутый', description: 'Сварить 100г любого наркотика', category: 'drugs', rewardExp: 500 },
  { id: 'full_drugs', name: '🧪 Полный угар', description: 'Сварить все 10 видов', category: 'drugs', rewardExp: 2000 },
  { id: 'krokodil_master', name: '🐊 Крокодил ебаный', description: 'Сварить 50г Крокодила', category: 'drugs', rewardExp: 300 },
  { id: 'weed_master', name: '🌿 Обдолбай', description: 'Сварить 100г Марихуаны', category: 'drugs', rewardExp: 500 },
  { id: 'meth_master', name: '❄️ Снежный барс', description: 'Сварить 50г Метамфетамина', category: 'drugs', rewardExp: 500 },
  { id: 'walter_white', name: '💎 Вальтер Вайт', description: 'Сварить 30г Голубого Мета', category: 'drugs', rewardExp: 1000 },
  { id: 'acid_trip', name: '🧪 Кислотный трип', description: 'Сварить 20г ЛСД', category: 'drugs', rewardExp: 1500 },

  // ПРОДАЖИ
  { id: 'first_sale', name: '💰 Первый лох', description: 'Продать первый товар', category: 'sales', rewardExp: 50 },
  { id: 'dealer', name: '💰 Барыга', description: 'Совершить 100 продаж', category: 'sales', rewardExp: 1000 },
  { id: 'millionaire', name: '💰 Хуиллионер', description: 'Заработать $1,000,000', category: 'sales', rewardExp: 5000 },
  { id: 'wholesale', name: '💰 Оптовая барыга', description: 'Продать 1000г товара', category: 'sales', rewardExp: 2000 },
  { id: 'money_bag', name: '💰 Денежный мешок', description: 'Заработать $10,000,000', category: 'sales', rewardExp: 10000 },

  // МАШИНЫ
  { id: 'first_car', name: '🚗 Бомж-такси', description: 'Купить первую машину', category: 'cars', rewardExp: 100 },
  { id: 'five_cars', name: '🚗 Автопарк долбоеба', description: 'Купить 5 машин', category: 'cars', rewardExp: 500 },
  { id: 'all_cars', name: '🚗 Король дорог', description: 'Купить все машины', category: 'cars', rewardExp: 2000 },
  { id: 'secret_car', name: '🚗 Тачка для пафоса', description: 'Купить Секретную машину', category: 'cars', rewardExp: 5000 },
  { id: 'racer', name: '🚗 Гонщик ебаный', description: 'Совершить 100 поездок', category: 'cars', rewardExp: 1000 },

  // БИЗНЕС
  { id: 'first_business', name: '🏢 Легалайз', description: 'Купить первый бизнес', category: 'business', rewardExp: 500 },
  { id: 'mafia', name: '🏢 Мафиози', description: 'Купить банк', category: 'business', rewardExp: 2000 },
  { id: 'clean_money', name: '🏢 Чистые бабки', description: 'Отмыть $1,000,000', category: 'business', rewardExp: 5000 },

  // ПОЛИЦИЯ
  { id: 'wanted', name: '👮 В розыск ебаный', description: 'Достичь 100% розыска', category: 'police', rewardExp: 100 },
  { id: 'bribe_master', name: '👮 Взятка мусорам', description: 'Дать взятку 10 раз', category: 'police', rewardExp: 1000 },
  { id: 'untouchable', name: '👮 Неуловимый хуй', description: 'Избежать рейда 5 раз', category: 'police', rewardExp: 2000 },

  // ОБОРУДОВАНИЕ
  { id: 'five_equipment', name: '🔧 Подвал химика', description: 'Купить 5 единиц оборудования', category: 'equipment', rewardExp: 200 },
  { id: 'all_equipment', name: '🔧 Лаборатория во все дыры', description: 'Купить всё оборудование', category: 'equipment', rewardExp: 2000 },
  { id: 'repair_master', name: '🔧 Мастер-ломастер', description: 'Починить оборудование 100 раз', category: 'equipment', rewardExp: 1000 },

  // УРОВНИ
  { id: 'level_5', name: '⭐ Сосунок', description: 'Достичь 5 уровня', category: 'levels', rewardExp: 500 },
  { id: 'level_10', name: '⭐ Хуй с горы', description: 'Достичь 10 уровня', category: 'levels', rewardExp: 2000 },
  { id: 'level_20', name: '⭐ Наркопанк', description: 'Достичь 20 уровня', category: 'levels', rewardExp: 10000 },

  // РАНДОМНЫЕ
  { id: 'craft_streak', name: '🔨 Хуякс-хуякс', description: 'Сделать 10 крафтов подряд', category: 'random', rewardExp: 1000 }
]

export default function Achievements() {
  const [фильтрКатегория, setФильтрКатегория] = useState<string>('all')
  
  const ачивки = useGameStore((state) => state.ачивки || {})
  const полученные = Object.keys(ачивки)
  
  // Уникальные категории
  const категории = ['all', ...new Set(ACHIEVEMENTS.map(a => a.category))]
  
  const отфильтрованные = ACHIEVEMENTS.filter(ach => {
    if (фильтрКатегория !== 'all' && ach.category !== фильтрКатегория) return false
    return true
  })
  
  const прогресс = `${полученные.length} / ${ACHIEVEMENTS.length}`
  const процент = Math.round((полученные.length / ACHIEVEMENTS.length) * 100)
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'common': return '🏠'
      case 'drugs': return '🧪'
      case 'sales': return '💰'
      case 'cars': return '🚗'
      case 'business': return '🏢'
      case 'police': return '👮'
      case 'equipment': return '🔧'
      case 'levels': return '⭐'
      case 'random': return '🍀'
      default: return '🏆'
    }
  }
  
  const getCategoryName = (category: string) => {
    switch(category) {
      case 'common': return 'Бытовые'
      case 'drugs': return 'Наркотики'
      case 'sales': return 'Продажи'
      case 'cars': return 'Машины'
      case 'business': return 'Бизнес'
      case 'police': return 'Полиция'
      case 'equipment': return 'Оборудование'
      case 'levels': return 'Уровни'
      case 'random': return 'Рандомные'
      default: return 'Все'
    }
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">🏆 Ачивки</h2>
        <div className="text-right">
          <span className="text-sm text-gray-400">{прогресс}</span>
          <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${процент}%` }} />
          </div>
        </div>
      </div>
      
      {/* Фильтры по категориям */}
      <div className="flex flex-wrap gap-2 mb-4">
        {категории.map(кат => (
          <button
            key={кат}
            onClick={() => setФильтрКатегория(кат)}
            className={`px-3 py-1 rounded text-sm transition ${фильтрКатегория === кат ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {getCategoryIcon(кат)} {getCategoryName(кат)}
          </button>
        ))}
      </div>
      
      {/* Список ачивок */}
      <div className="space-y-2">
        {отфильтрованные.map(ach => {
          const получена = полученные.includes(ach.id)
          return (
            <div key={ach.id} className={`bg-gray-800 p-3 rounded-lg ${получена ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-medium">{ach.name}</div>
                  <div className="text-xs text-gray-500">{ach.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-sm">+{ach.rewardExp} EXP</div>
                  {получена && <div className="text-green-400 text-xs">✅ Получено</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}