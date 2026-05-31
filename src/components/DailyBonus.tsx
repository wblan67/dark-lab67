// @ts-nocheck
import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export default function DailyBonus() {
  const [можноЗабрать, setМожноЗабрать] = useState(false)
  const [таймер, setТаймер] = useState('')
  
  const статистика = useGameStore((state) => state.статистика)
  const обновитьСтатистику = useGameStore((state) => state.обновитьСтатистику)
  const добавитьОпыт = useGameStore((state) => state.добавитьОпыт)
  const добавитьОсколки = useGameStore((state) => state.добавитьОсколки)
  const баланс = useGameStore((state) => state.баланс)
  
  // Награды за дни
  const НАГРАДЫ = [
    { день: 1, деньги: 500, осколки: 1, опыт: 50 },
    { день: 2, деньги: 1000, осколки: 2, опыт: 100 },
    { день: 3, деньги: 2000, осколки: 3, опыт: 150 },
    { день: 4, деньги: 3000, осколки: 4, опыт: 200 },
    { день: 5, деньги: 5000, осколки: 5, опыт: 300 },
    { день: 6, деньги: 7500, осколки: 6, опыт: 400 },
    { день: 7, деньги: 10000, осколки: 10, опыт: 500 }
  ]
  
  const последнийБонус = статистика?.последнийБонус || 0
  const дниПодряд = статистика?.дниПодряд || 0
  const следующийДень = (дниПодряд % 7) + 1
  const награда = НАГРАДЫ[следующийДень - 1]
  
  // Проверяем, можно ли забрать бонус
  useEffect(() => {
    const checkBonus = () => {
      const сейчас = Date.now()
      const часпоследнегоБонуса = new Date(последнийБонус).setHours(0, 0, 0, 0)
      const чассейчас = new Date(сейчас).setHours(0, 0, 0, 0)
      
      if (чассейчас > часпоследнегоБонуса) {
        setМожноЗабрать(true)
        setТаймер('')
      } else {
        setМожноЗабрать(false)
        // Рассчитываем время до следующего бонуса
        const завтра = new Date(часпоследнегоБонуса + 24 * 60 * 60 * 1000)
        const осталось = завтра - сейчас
        if (осталось > 0) {
          const часы = Math.floor(осталось / (1000 * 60 * 60))
          const минуты = Math.floor((осталось % (1000 * 60 * 60)) / (1000 * 60))
          const секунды = Math.floor((осталось % (1000 * 60)) / 1000)
          setТаймер(`${часы}ч ${минуты}м ${секунды}с`)
        }
      }
    }
    
    checkBonus()
    const interval = setInterval(checkBonus, 1000)
    return () => clearInterval(interval)
  }, [последнийБонус])
  
  const забратьБонус = async () => {
    if (!можноЗабрать) return
    
    const новыйБаланс = баланс + награда.деньги
    const новыйДниПодряд = (дниПодряд % 7) + 1
    
    // Обновляем статистику
    const новаяСтатистика = {
      ...статистика,
      дниПодряд: новыйДниПодряд,
      последнийБонус: Date.now()
    }
    useGameStore.setState({ 
      баланс: новыйБаланс,
      статистика: новаяСтатистика
    })
    
    // Добавляем осколки и опыт
    if (награда.осколки > 0) {
      добавитьОсколки(награда.осколки)
    }
    await добавитьОпыт(награда.опыт)
    
    alert(`🎁 ЕЖЕДНЕВНЫЙ БОНУС!\n\n📅 День ${награда.день}\n💰 +$${награда.деньги.toLocaleString()}\n💎 +${награда.осколки} осколков\n✨ +${награда.опыт} EXP`)
    
    setМожноЗабрать(false)
  }
  
  // Прогресс до следующей награды
  const прогресс = (дниПодряд % 7) / 7 * 100
  
  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-6 text-center">
        <div className="text-5xl mb-3">🎁</div>
        <h2 className="text-2xl font-bold mb-2">Ежедневный бонус</h2>
        <div className="text-sm opacity-90 mb-4">
          Заходи каждый день и получай награды!
        </div>
        
        {/* Прогресс-бар дней */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>День {дниПодряд % 7 || 7} из 7</span>
            <span>🔥 Стрик: {дниПодряд} дней</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${прогресс}%` }}
            />
          </div>
        </div>
        
        {/* Следующая награда */}
        <div className="bg-black/30 rounded-lg p-3 mb-4">
          <div className="text-sm mb-1">🎁 Награда за {награда.день} день:</div>
          <div className="flex justify-center gap-4 text-sm">
            <span>💰 {награда.деньги.toLocaleString()}$</span>
            <span>💎 +{награда.осколки} осколков</span>
            <span>✨ +{награда.опыт} EXP</span>
          </div>
        </div>
        
        {/* Кнопка получения бонуса */}
        {можноЗабрать ? (
          <button
            onClick={забратьБонус}
            className="w-full py-3 rounded-lg font-bold text-lg bg-green-600 hover:bg-green-700 transition transform hover:scale-105"
          >
            🎁 ЗАБРАТЬ БОНУС!
          </button>
        ) : (
          <div className="w-full py-3 rounded-lg bg-gray-600 text-center">
            ⏰ Доступно через: {таймер}
          </div>
        )}
      </div>
      
      {/* Таблица наград */}
      <div className="mt-4 bg-gray-800 rounded-lg p-3">
        <h3 className="text-sm font-semibold mb-2 text-center">📅 Награды за дни:</h3>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {НАГРАДЫ.map((n, i) => (
            <div key={i} className={`p-1 rounded ${(дниПодряд % 7) === i ? 'bg-yellow-600' : 'bg-gray-700'}`}>
              <div>День {n.день}</div>
              <div className="text-yellow-400">{n.деньги}$</div>
              <div className="text-blue-400">+{n.осколки}💎</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-center text-gray-400 mt-2">
          💡 Пропуск дня сбрасывает счётчик до 1
        </div>
      </div>
    </div>
  )
}
