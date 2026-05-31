import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

type Category = 'money' | 'level' | 'craft' | 'sales' | 'achievements' | 'cars' | 'crime'

const CATEGORIES: Record<Category, { name: string; icon: string; sortKey: string }> = {
  money: { name: 'Богатейшие', icon: '💰', sortKey: 'баланс' },
  level: { name: 'По уровню', icon: '⭐', sortKey: 'уровень' },
  craft: { name: 'Химики', icon: '🔬', sortKey: 'всегоСварено' },
  sales: { name: 'Продавцы', icon: '💵', sortKey: 'всегоПродано' },
  achievements: { name: 'Ачивки', icon: '🏆', sortKey: 'ачивки' },
  cars: { name: 'Короли дорог', icon: '🚗', sortKey: 'поездки' },
  crime: { name: 'Криминал', icon: '👑', sortKey: 'розыск' }
}

interface PlayerData {
  id: string
  name: string
  баланс: number
  уровень: number
  опыт: number
  всегоСварено: number
  всегоПродано: number
  заработано: number
  ачивки: number
  всего: number
  процент: number
  поездки: number
  машины: number
  розыск: number
  взяток: number
  рейдов: number
}

export default function Leaderboard() {
  const [активнаяКатегория, setАктивнаяКатегория] = useState<Category>('money')
  const [игроки, setИгроки] = useState<PlayerData[]>([])
  
  // Получаем данные текущего игрока
  const текущийБаланс = useGameStore((state) => state.баланс)
  const текущийУровень = useGameStore((state) => state.уровень)
  const текущийОпыт = useGameStore((state) => state.опыт)
  const текущиеАчивки = useGameStore((state) => state.ачивки)
  const статистика = useGameStore((state) => state.статистика)
  const текущийРозыск = useGameStore((state) => state.розыск)
  const userId = useGameStore((state) => state.userId)
  const машины = useGameStore((state) => state.машины)
  
  // Формируем данные текущего игрока
  const текущийИгрок: PlayerData = {
    id: userId || 'unknown',
    name: userId === 'test_user_123' ? 'Вы (тестовый режим)' : 'Вы',
    баланс: текущийБаланс,
    уровень: текущийУровень,
    опыт: текущийОпыт,
    всегоСварено: Object.values(статистика?.всегоСварено || {}).reduce((a, b) => a + b, 0),
    всегоПродано: Object.values(статистика?.всегоПродано || {}).reduce((a, b) => a + b, 0),
    заработано: статистика?.всегоЗаработано || 0,
    ачивки: Object.keys(текущиеАчивки || {}).length,
    всего: 63,
    процент: Math.round((Object.keys(текущиеАчивки || {}).length / 63) * 100),
    поездки: статистика?.всегоПоездок || 0,
    машины: Object.keys(машины || {}).length,
    розыск: текущийРозыск,
    взяток: статистика?.всегоВзяток || 0,
    рейдов: статистика?.всегоРейдов || 0
  }
  
  // TODO: Позже добавим загрузку других игроков из Supabase
  // Пока показываем только текущего игрока
  useEffect(() => {
    // Здесь будет запрос к Supabase для получения всех игроков
    // setИгроки(реальныеДанные)
    
    // Пока оставляем пустой массив, только текущий игрок
    setИгроки([currentPlayer])
  }, [текущийБаланс, текущийУровень, текущийОпыт, текущиеАчивки, статистика, текущийРозыск, userId, машины])
  
  const currentPlayer = текущийИгрок
  
  // Сортировка игроков (пока только один)
  const отсортированныеИгроки = [...игроки].sort((a, b) => {
    switch(активнаяКатегория) {
      case 'money': return b.баланс - a.баланс
      case 'level': return b.уровень - a.уровень || b.опыт - a.опыт
      case 'craft': return b.всегоСварено - a.всегоСварено
      case 'sales': return b.всегоПродано - a.всегоПродано
      case 'achievements': return b.ачивки - a.ачивки
      case 'cars': return b.поездки - a.поездки
      case 'crime': return b.розыск - a.розыск
      default: return 0
    }
  })
  
  const getMedal = (index: number) => {
    switch(index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${index + 1}`
    }
  }
  
  const categoryInfo = CATEGORIES[активнаяКатегория]
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">🏆 Таблица лидеров</h2>
      
      {/* Категории */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setАктивнаяКатегория(key as Category)}
            className={`px-3 py-1 rounded text-sm ${
              активнаяКатегория === key ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>
      
      {/* Таблица */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-3 bg-gray-700 text-sm font-semibold">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6">Игрок</div>
          <div className="col-span-5 text-right">{categoryInfo.name}</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {отсортированныеИгроки.length > 0 ? (
            отсортированныеИгроки.map((player, index) => (
              <div key={player.id} className="grid grid-cols-12 gap-2 p-3 text-sm hover:bg-gray-700/50">
                <div className="col-span-1 text-center font-bold">{getMedal(index)}</div>
                <div className="col-span-6 font-medium">{player.name}</div>
                <div className="col-span-5 text-right text-yellow-400">
                  {активнаяКатегория === 'money' && `$${player.баланс.toLocaleString()}`}
                  {активнаяКатегория === 'level' && `${player.уровень} ур. (${player.опыт.toLocaleString()} EXP)`}
                  {активнаяКатегория === 'craft' && `${player.всегоСварено.toLocaleString()} г`}
                  {активнаяКатегория === 'sales' && `${player.всегоПродано.toLocaleString()}г ($${player.заработано.toLocaleString()})`}
                  {активнаяКатегория === 'achievements' && `${player.ачивки}/${player.всего} (${player.процент}%)`}
                  {активнаяКатегория === 'cars' && `${player.поездки} поездок (${player.машины}/11 машин)`}
                  {активнаяКатегория === 'crime' && `${player.розыск}% розыска (${player.взяток} взяток)`}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              Нет данных о других игроках. Пригласите друзей!
            </div>
          )}
        </div>
      </div>
      
      {/* Текущий игрок */}
      {currentPlayer && (
        <div className="mt-4 bg-gray-800 rounded-lg p-3 border border-purple-500">
          <div className="text-xs text-purple-400 mb-1">📍 Ваше место</div>
          <div className="grid grid-cols-12 gap-2 text-sm">
            <div className="col-span-1 text-center">
              {отсортированныеИгроки.findIndex(p => p.id === currentPlayer.id) + 1 || '1'}
            </div>
            <div className="col-span-6 font-medium text-purple-400">{currentPlayer.name}</div>
            <div className="col-span-5 text-right text-yellow-400">
              {активнаяКатегория === 'money' && `$${currentPlayer.баланс.toLocaleString()}`}
              {активнаяКатегория === 'level' && `${currentPlayer.уровень} ур. (${currentPlayer.опыт.toLocaleString()} EXP)`}
              {активнаяКатегория === 'craft' && `${currentPlayer.всегоСварено.toLocaleString()} г`}
              {активнаяКатегория === 'sales' && `${currentPlayer.всегоПродано.toLocaleString()}г ($${currentPlayer.заработано.toLocaleString()})`}
              {активнаяКатегория === 'achievements' && `${currentPlayer.ачивки}/${currentPlayer.всего} (${currentPlayer.процент}%)`}
              {активнаяКатегория === 'cars' && `${currentPlayer.поездки} поездок (${currentPlayer.машины}/11 машин)`}
              {активнаяКатегория === 'crime' && `${currentPlayer.розыск}% розыска (${currentPlayer.взяток} взяток)`}
            </div>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center mt-4">
        * Показываются только ваши данные. Приглашайте друзей — появятся другие игроки!
      </div>
    </div>
  )
}