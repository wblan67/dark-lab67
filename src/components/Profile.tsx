import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

// Конфиг званий
const ЗВАНИЯ = [
  { id: 'street_dealer', название: 'Уличный дилер', требование: { уровень: 1, продажи: 0 }, бонус: { цена: 5, износ: 0, опыт: 0 } },
  { id: 'pusher', название: 'Барыга', требование: { уровень: 3, продажи: 50 }, бонус: { цена: 8, износ: 0, опыт: 5 } },
  { id: 'distributor', название: 'Оптовик', требование: { уровень: 5, продажи: 200 }, бонус: { цена: 10, износ: 5, опыт: 10 } },
  { id: 'cartel_member', название: 'Картель', требование: { уровень: 8, продажи: 500 }, бонус: { цена: 12, износ: 10, опыт: 15 } },
  { id: 'kingpin', название: 'Криминальный авторитет', требование: { уровень: 10, продажи: 1000 }, бонус: { цена: 15, износ: 15, опыт: 20 } }
]

// Конфиг навыков
const НАВЫКИ = [
  { id: 'speed_cook', название: '🔥 Скоростная варка', цена: 5000, бонус: { времяКрафта: -5 }, макс: 5 },
  { id: 'discount', название: '💰 Скидка на ингредиенты', цена: 8000, бонус: { ценаИнгредиентов: -5 }, макс: 3 },
  { id: 'profit', название: '💵 Профит', цена: 10000, бонус: { ценаПродажи: 5 }, макс: 5 },
  { id: 'stealth', название: '👻 Невидимка', цена: 15000, бонус: { рискРейда: -10 }, макс: 3 },
  { id: 'boss', название: '👔 Босс', цена: 20000, бонус: { опыт: 10 }, макс: 2 }
]

// Конфиг скинов
const СКИНЫ = [
  { id: 'basement', название: '🗑️ Грязный подвал', цена: 0, бонус: {} },
  { id: 'garage', название: '🚗 Гараж', цена: 10000, бонус: { опыт: 5 } },
  { id: 'warehouse', название: '📦 Склад', цена: 25000, бонус: { ценаПродажи: 3 } },
  { id: 'hightech', название: '🔬 Хай-тек лаборатория', цена: 50000, бонус: { времяКрафта: -10, опыт: 10 } },
  { id: 'secret', название: '🛸 Секретная база', цена: 100000, бонус: { времяКрафта: -15, ценаПродажи: 10, опыт: 20 } }
]

// СПИСОК АЧИВОК
const ACHIEVEMENTS = [
  // БЫТОВЫЕ
  { id: 'welcome', name: '🏠 Добро пожаловать', description: 'Зайти в игру', category: 'common', categoryName: '🏠 Бытовые', rewardExp: 10 },
  { id: 'regular', name: '🏠 Завсегдатай', description: 'Зайти 7 дней подряд', category: 'common', categoryName: '🏠 Бытовые', rewardExp: 500 },
  { id: 'hardworker', name: '🏠 Трудоголик', description: 'Провести 1 час в игре', category: 'common', categoryName: '🏠 Бытовые', rewardExp: 100 },
  { id: 'marathon', name: '🏠 Марафонец', description: 'Провести 10 часов в игре', category: 'common', categoryName: '🏠 Бытовые', rewardExp: 1000 },
  { id: 'resident', name: '🏠 Житель', description: 'Провести 24 часа в игре', category: 'common', categoryName: '🏠 Бытовые', rewardExp: 5000 },
  { id: 'clicker', name: '🏠 Кликер', description: 'Сделать 1000 кликов', category: 'common', categoryName: '🏠 Бытовые', rewardExp: 200 },
  { id: 'clicker_monster', name: '🏠 Кликер-монстр', description: 'Сделать 5000 кликов', category: 'common', categoryName: '🏠 Бытовые', rewardExp: 500 },

  // НАРКОТИКИ
  { id: 'first_craft', name: '🧪 Первый укол', description: 'Сварить первый наркотик', category: 'drugs', categoryName: '🧪 Наркотики', rewardExp: 50 },
  { id: 'crazy_chemist', name: '🧪 Химик ебанутый', description: 'Сварить 100г любого наркотика', category: 'drugs', categoryName: '🧪 Наркотики', rewardExp: 500 },
  { id: 'full_drugs', name: '🧪 Полный угар', description: 'Сварить все 10 видов', category: 'drugs', categoryName: '🧪 Наркотики', rewardExp: 2000 },
  { id: 'krokodil_master', name: '🐊 Крокодил ебаный', description: 'Сварить 50г Крокодила', category: 'drugs', categoryName: '🧪 Наркотики', rewardExp: 300 },
  { id: 'weed_master', name: '🌿 Обдолбай', description: 'Сварить 100г Марихуаны', category: 'drugs', categoryName: '🧪 Наркотики', rewardExp: 500 },
  { id: 'meth_master', name: '❄️ Снежный барс', description: 'Сварить 50г Метамфетамина', category: 'drugs', categoryName: '🧪 Наркотики', rewardExp: 500 },
  { id: 'walter_white', name: '💎 Вальтер Вайт', description: 'Сварить 30г Голубого Мета', category: 'drugs', categoryName: '🧪 Наркотики', rewardExp: 1000 },
  { id: 'acid_trip', name: '🧪 Кислотный трип', description: 'Сварить 20г ЛСД', category: 'drugs', categoryName: '🧪 Наркотики', rewardExp: 1500 },

  // ПРОДАЖИ
  { id: 'first_sale', name: '💰 Первый лох', description: 'Продать первый товар', category: 'sales', categoryName: '💰 Продажи', rewardExp: 50 },
  { id: 'dealer', name: '💰 Барыга', description: 'Совершить 100 продаж', category: 'sales', categoryName: '💰 Продажи', rewardExp: 1000 },
  { id: 'millionaire', name: '💰 Хуиллионер', description: 'Заработать $1,000,000', category: 'sales', categoryName: '💰 Продажи', rewardExp: 5000 },
  { id: 'wholesale', name: '💰 Оптовая барыга', description: 'Продать 1000г товара', category: 'sales', categoryName: '💰 Продажи', rewardExp: 2000 },
  { id: 'money_bag', name: '💰 Денежный мешок', description: 'Заработать $10,000,000', category: 'sales', categoryName: '💰 Продажи', rewardExp: 10000 },

  // МАШИНЫ
  { id: 'first_car', name: '🚗 Бомж-такси', description: 'Купить первую машину', category: 'cars', categoryName: '🚗 Машины', rewardExp: 100 },
  { id: 'five_cars', name: '🚗 Автопарк долбоеба', description: 'Купить 5 машин', category: 'cars', categoryName: '🚗 Машины', rewardExp: 500 },
  { id: 'all_cars', name: '🚗 Король дорог', description: 'Купить все машины', category: 'cars', categoryName: '🚗 Машины', rewardExp: 2000 },
  { id: 'secret_car', name: '🚗 Тачка для пафоса', description: 'Купить Секретную машину', category: 'cars', categoryName: '🚗 Машины', rewardExp: 5000 },
  { id: 'racer', name: '🚗 Гонщик ебаный', description: 'Совершить 100 поездок', category: 'cars', categoryName: '🚗 Машины', rewardExp: 1000 },

  // БИЗНЕС
  { id: 'first_business', name: '🏢 Легалайз', description: 'Купить первый бизнес', category: 'business', categoryName: '🏢 Бизнес', rewardExp: 500 },
  { id: 'mafia', name: '🏢 Мафиози', description: 'Купить банк', category: 'business', categoryName: '🏢 Бизнес', rewardExp: 2000 },
  { id: 'clean_money', name: '🏢 Чистые бабки', description: 'Отмыть $1,000,000', category: 'business', categoryName: '🏢 Бизнес', rewardExp: 5000 },

  // ПОЛИЦИЯ
  { id: 'wanted', name: '👮 В розыск ебаный', description: 'Достичь 100% розыска', category: 'police', categoryName: '👮 Полиция', rewardExp: 100 },
  { id: 'bribe_master', name: '👮 Взятка мусорам', description: 'Дать взятку 10 раз', category: 'police', categoryName: '👮 Полиция', rewardExp: 1000 },
  { id: 'untouchable', name: '👮 Неуловимый хуй', description: 'Избежать рейда 5 раз', category: 'police', categoryName: '👮 Полиция', rewardExp: 2000 },

  // ОБОРУДОВАНИЕ
  { id: 'five_equipment', name: '🔧 Подвал химика', description: 'Купить 5 единиц оборудования', category: 'equipment', categoryName: '🔧 Оборудование', rewardExp: 200 },
  { id: 'all_equipment', name: '🔧 Лаборатория во все дыры', description: 'Купить всё оборудование', category: 'equipment', categoryName: '🔧 Оборудование', rewardExp: 2000 },
  { id: 'repair_master', name: '🔧 Мастер-ломастер', description: 'Починить оборудование 100 раз', category: 'equipment', categoryName: '🔧 Оборудование', rewardExp: 1000 },

  // УРОВНИ
  { id: 'level_5', name: '⭐ Сосунок', description: 'Достичь 5 уровня', category: 'levels', categoryName: '⭐ Уровни', rewardExp: 500 },
  { id: 'level_10', name: '⭐ Хуй с горы', description: 'Достичь 10 уровня', category: 'levels', categoryName: '⭐ Уровни', rewardExp: 2000 },
  { id: 'level_20', name: '⭐ Наркопанк', description: 'Достичь 20 уровня', category: 'levels', categoryName: '⭐ Уровни', rewardExp: 10000 },

  // РАНДОМНЫЕ
  { id: 'craft_streak', name: '🔨 Хуякс-хуякс', description: 'Сделать 10 крафтов подряд', category: 'random', categoryName: '🍀 Рандомные', rewardExp: 1000 }
]

// Категории для фильтра
const КАТЕГОРИИ = [
  { id: 'all', name: '📋 Все', icon: '📋' },
  { id: 'common', name: '🏠 Бытовые', icon: '🏠' },
  { id: 'drugs', name: '🧪 Наркотики', icon: '🧪' },
  { id: 'sales', name: '💰 Продажи', icon: '💰' },
  { id: 'cars', name: '🚗 Машины', icon: '🚗' },
  { id: 'business', name: '🏢 Бизнес', icon: '🏢' },
  { id: 'police', name: '👮 Полиция', icon: '👮' },
  { id: 'equipment', name: '🔧 Оборудование', icon: '🔧' },
  { id: 'levels', name: '⭐ Уровни', icon: '⭐' },
  { id: 'random', name: '🍀 Рандомные', icon: '🍀' }
]

export default function Profile() {
  const [активнаяВкладка, setАктивнаяВкладка] = useState<'статистика' | 'звания' | 'навыки' | 'скины' | 'achievements'>('статистика')
  const [фильтрКатегория, setФильтрКатегория] = useState<string>('all')
  const [фильтрСтатус, setФильтрСтатус] = useState<'all' | 'полученные' | 'неполученные'>('all')
  
  const уровень = useGameStore((state) => state.уровень)
  const опыт = useGameStore((state) => state.опыт)
  const баланс = useGameStore((state) => state.баланс)
  const статистика = useGameStore((state) => state.статистика)
  const ачивки = useGameStore((state) => state.ачивки || {})
  const навыки = useGameStore((state) => state.навыки) || {}
  const активноеЗвание = useGameStore((state) => state.активноеЗвание) || 'street_dealer'
  const доступныеЗвания = useGameStore((state) => state.доступныеЗвания) || ['street_dealer']
  const активныйСкин = useGameStore((state) => state.активныйСкин) || 'basement'
  const купленныеСкины = useGameStore((state) => state.купленныеСкины) || ['basement']
  
  const открытьЗвание = useGameStore((state) => state.открытьЗвание)
  const купитьНавык = useGameStore((state) => state.купитьНавык)
  const купитьСкин = useGameStore((state) => state.купитьСкин)
  const экипироватьСкин = useGameStore((state) => state.экипироватьСкин)
  
  const полученные = Object.keys(ачивки)
  
  // Фильтруем ачивки по категории и статусу
  const отфильтрованныеАчивки = ACHIEVEMENTS.filter(ach => {
    if (фильтрКатегория !== 'all' && ach.category !== фильтрКатегория) return false
    if (фильтрСтатус === 'полученные' && !полученные.includes(ach.id)) return false
    if (фильтрСтатус === 'неполученные' && полученные.includes(ach.id)) return false
    return true
  })
  
  const прогрессАчивок = `${полученные.length} / ${ACHIEVEMENTS.length}`
  const процентАчивок = Math.round((полученные.length / ACHIEVEMENTS.length) * 100)
  
  const форматВремени = (секунды: number) => {
    const часы = Math.floor(секунды / 3600)
    const минуты = Math.floor((секунды % 3600) / 60)
    return `${часы}ч ${минуты}м`
  }
  
  const опытДоСледУровня = () => {
    const expToNext = [0, 500, 1500, 3500, 7000, 12000, 18000, 25000, 35000, 50000]
    for (let i = уровень; i < expToNext.length; i++) {
      if (опыт < expToNext[i]) return expToNext[i] - опыт
    }
    return 0
  }
  
  const процентОпыта = () => {
    const expToNext = [0, 500, 1500, 3500, 7000, 12000, 18000, 25000, 35000, 50000]
    const текущийПорог = expToNext[уровень - 1] || 0
    const следующийПорог = expToNext[уровень] || expToNext[уровень - 1] + 10000
    const опытВУровне = опыт - текущийПорог
    const нужноОпыта = следующийПорог - текущийПорог
    return (опытВУровне / нужноОпыта) * 100
  }
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex border-b border-gray-700 overflow-x-auto">
        <button onClick={() => setАктивнаяВкладка('статистика')} className={`flex-1 py-2 text-sm whitespace-nowrap ${активнаяВкладка === 'статистика' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>📊 Статистика</button>
        <button onClick={() => setАктивнаяВкладка('звания')} className={`flex-1 py-2 text-sm whitespace-nowrap ${активнаяВкладка === 'звания' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>🎖️ Звания</button>
        <button onClick={() => setАктивнаяВкладка('навыки')} className={`flex-1 py-2 text-sm whitespace-nowrap ${активнаяВкладка === 'навыки' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>📈 Навыки</button>
        <button onClick={() => setАктивнаяВкладка('скины')} className={`flex-1 py-2 text-sm whitespace-nowrap ${активнаяВкладка === 'скины' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>🎨 Скины</button>
        <button onClick={() => setАктивнаяВкладка('achievements')} className={`flex-1 py-2 text-sm whitespace-nowrap ${активнаяВкладка === 'achievements' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>🏆 Ачивки</button>
      </div>
      
      {активнаяВкладка === 'статистика' && (
        <>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-400 text-lg font-bold">⭐ Уровень {уровень}</span>
              <span className="text-gray-400">{опыт} EXP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${процентОпыта()}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">До следующего уровня: {опытДоСледУровня()} EXP</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">📊 Статистика</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">⏱️ Время в игре:</span><span>{форматВремени(статистика?.времяВИгре || 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">🖱️ Всего кликов:</span><span>{(статистика?.всегоКликов || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">📅 Дней подряд:</span><span>{статистика?.дниПодряд || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">🌅 Утренний визит (5-7 утра):</span><span className={статистика?.утреннийВход ? 'text-green-400' : 'text-gray-500'}>{статистика?.утреннийВход ? '✅ Да' : '❌ Нет'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">🌙 Ночной визит (00-5):</span><span className={статистика?.ночнойВход ? 'text-green-400' : 'text-gray-500'}>{статистика?.ночнойВход ? '✅ Да' : '❌ Нет'}</span></div>
              <div className="flex justify-between border-t border-gray-700 pt-2 mt-2"><span className="text-gray-400">💰 Всего заработано:</span><span className="text-green-400">${(статистика?.всегоЗаработано || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">🏆 Всего ачивок:</span><span className="text-yellow-400">{полученные.length} / {ACHIEVEMENTS.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">🎖️ Активное звание:</span><span className="text-blue-400">{ЗВАНИЯ.find(z => z.id === активноеЗвание)?.название || 'Уличный дилер'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">🎨 Активный скин:</span><span className="text-purple-400">{СКИНЫ.find(s => s.id === активныйСкин)?.название || 'Грязный подвал'}</span></div>
            </div>
          </div>
        </>
      )}
      
      {активнаяВкладка === 'звания' && (
        <div className="space-y-3">
          {ЗВАНИЯ.map(звание => {
            const доступно = доступныеЗвания?.includes(звание.id) || false
            const активно = активноеЗвание === звание.id
            const можетОткрыть = уровень >= звание.требование.уровень && (статистика?.всегоПродаж || 0) >= звание.требование.продажи
            
            return (
              <div key={звание.id} className={`bg-gray-800 p-3 rounded-lg ${активно ? 'border-2 border-blue-500' : ''}`}>
                <div className="font-medium">{звание.название}</div>
                <div className="text-xs text-gray-400">Требуется: {звание.требование.уровень} уровень, {звание.требование.продажи} продаж</div>
                <div className="text-xs text-green-400 mt-1">Бонусы: +{звание.бонус.цена}% к цене, -{звание.бонус.износ}% износа, +{звание.бонус.опыт}% опыта</div>
                {доступно ? (
                  <button onClick={() => открытьЗвание?.(звание.id)} disabled={активно} className={`mt-2 w-full py-1 rounded text-sm ${активно ? 'bg-blue-600 cursor-default' : 'bg-green-600 hover:bg-green-700'}`}>
                    {активно ? '✅ Активно' : '🔧 Экипировать'}
                  </button>
                ) : (
                  <div className="mt-2 w-full py-1 rounded text-sm bg-gray-600 text-center cursor-not-allowed">
                    {уровень < звание.требование.уровень ? `🔒 Требуется ${звание.требование.уровень} уровень` : `🔒 Требуется ${звание.требование.продажи} продаж`}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      
      {активнаяВкладка === 'навыки' && (
        <div className="space-y-3">
          {НАВЫКИ.map(навык => {
            const уровеньНавыка = навыки?.[навык.id] || 0
            const цена = навык.цена * (уровеньНавыка + 1)
            const можетКупить = баланс >= цена && уровеньНавыка < навык.макс
            
            return (
              <div key={навык.id} className="bg-gray-800 p-3 rounded-lg">
                <div className="font-medium">{навык.название}</div>
                <div className="text-xs text-gray-400">Уровень: {уровеньНавыка}/{навык.макс}</div>
                <div className="text-xs text-green-400">Бонус: {Object.entries(навык.бонус).map(([k, v]) => `${k}: ${v}%`).join(', ')}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-yellow-400 text-sm">Следующий уровень: ${цена.toLocaleString()}</span>
                  <button onClick={() => купитьНавык?.(навык.id)} disabled={!можетКупить} className={`px-4 py-1 rounded text-sm ${можетКупить ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed'}`}>
                    Улучшить
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {активнаяВкладка === 'скины' && (
        <div className="space-y-3">
          {СКИНЫ.map(скин => {
            const куплен = купленныеСкины?.includes(скин.id) || false
            const активен = активныйСкин === скин.id
            const можетКупить = баланс >= скин.цена && !куплен
            
            return (
              <div key={скин.id} className={`bg-gray-800 p-3 rounded-lg ${активен ? 'border-2 border-blue-500' : ''}`}>
                <div className="font-medium">{скин.название}</div>
                <div className="text-xs text-green-400">Бонусы: {Object.entries(скин.бонус).map(([k, v]) => `${k}: +${v}%`).join(', ') || 'нет'}</div>
                {куплен ? (
                  <button onClick={() => экипироватьСкин?.(скин.id)} disabled={активен} className={`mt-2 w-full py-1 rounded text-sm ${активен ? 'bg-blue-600 cursor-default' : 'bg-yellow-600 hover:bg-yellow-700'}`}>
                    {активен ? '✅ Экипирован' : '🔧 Экипировать'}
                  </button>
                ) : (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-yellow-400 text-sm">Цена: ${скин.цена.toLocaleString()}</span>
                    <button onClick={() => купитьСкин?.(скин.id)} disabled={!можетКупить} className={`px-4 py-1 rounded text-sm ${можетКупить ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}>
                      Купить
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      
      {активнаяВкладка === 'achievements' && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">🏆 Ачивки</h3>
            <div className="text-right">
              <span className="text-sm text-gray-400">{прогрессАчивок}</span>
              <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${процентАчивок}%` }} />
              </div>
            </div>
          </div>
          
          {/* Ряд 1: Фильтр по статусу */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setФильтрСтатус('all')}
              className={`flex-1 py-2 rounded text-sm font-semibold transition ${
                фильтрСтатус === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📋 Все ({ACHIEVEMENTS.length})
            </button>
            <button
              onClick={() => setФильтрСтатус('полученные')}
              className={`flex-1 py-2 rounded text-sm font-semibold transition ${
                фильтрСтатус === 'полученные' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ✅ Полученные ({полученные.length})
            </button>
            <button
              onClick={() => setФильтрСтатус('неполученные')}
              className={`flex-1 py-2 rounded text-sm font-semibold transition ${
                фильтрСтатус === 'неполученные' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ❌ Неполученные ({ACHIEVEMENTS.length - полученные.length})
            </button>
          </div>
          
          {/* Ряд 2: Фильтр по категориям */}
          <div className="flex flex-wrap gap-2 mb-4">
            {КАТЕГОРИИ.map(кат => (
              <button
                key={кат.id}
                onClick={() => setФильтрКатегория(кат.id)}
                className={`px-3 py-1 rounded text-sm transition ${
                  фильтрКатегория === кат.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {кат.icon} {кат.name}
              </button>
            ))}
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {отфильтрованныеАчивки.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Нет ачивок в этой категории
              </div>
            ) : (
              отфильтрованныеАчивки.map(ach => {
                const получена = полученные.includes(ach.id)
                return (
                  <div key={ach.id} className={`p-3 rounded-lg ${получена ? 'bg-gray-700/50 opacity-60' : 'bg-gray-700'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium">{ach.name}</div>
                        <div className="text-xs text-gray-400">{ach.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 text-sm">+{ach.rewardExp} EXP</div>
                        {получена && <div className="text-green-400 text-xs">✅ Получено</div>}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}