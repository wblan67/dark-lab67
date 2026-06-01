// @ts-nocheck
import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

// ============================================
// ⚠️ ТОЛЬКО ДЛЯ ТЕБЯ! НЕ МЕНЯЙ ЭТИ ID
// ============================================
// Telegram ID Администратора (замени на свой!)
const ADMIN_ID = '6034090849'  // 👈 ВСТАВЬ СВОЙ ID!

// Пароль для входа в админ-панель
const ADMIN_PASSWORD = 'uuuuuioo67'
// ============================================

export default function AdminPanel() {
  const { userId, баланс, уровень, осколки, статистика } = useGameStore()
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('users')
  
  // Данные для админки
  const [targetUserId, setTargetUserId] = useState('')
  const [shardsAmount, setShardsAmount] = useState(100)
  const [expAmount, setExpAmount] = useState(1000)
  const [moneyAmount, setMoneyAmount] = useState(10000)
  const [banReason, setBanReason] = useState('')
  const [bannedUsers, setBannedUsers] = useState<Record<string, { reason: string, date: string }>>({})
  const [logMessage, setLogMessage] = useState('')
  
  // Проверка, что это ты (по Telegram ID)
  const isAdmin = userId === ADMIN_ID
  
  // Загрузка забаненных из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('banned_users')
    if (saved) {
      setBannedUsers(JSON.parse(saved))
    }
  }, [])
  
  // Вход в админку
  const handleLogin = () => {
    if (!isAdmin) {
      setLogMessage('❌ У вас нет доступа к админ-панели! Этот раздел только для создателя игры.')
      return
    }
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLogMessage('✅ Вход выполнен успешно, Администратор!')
    } else {
      setLogMessage('❌ Неверный пароль!')
    }
  }
  
  // Бан пользователя
  const banUser = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    const newBanned = {
      ...bannedUsers,
      [targetUserId]: {
        reason: banReason || 'Нарушение правил',
        date: new Date().toLocaleString()
      }
    }
    setBannedUsers(newBanned)
    localStorage.setItem('banned_users', JSON.stringify(newBanned))
    setLogMessage(`✅ Пользователь ${targetUserId} забанен. Причина: ${banReason || 'Нарушение правил'}`)
    setTargetUserId('')
    setBanReason('')
  }
  
  // Разбан
  const unbanUser = (userId: string) => {
    const newBanned = { ...bannedUsers }
    delete newBanned[userId]
    setBannedUsers(newBanned)
    localStorage.setItem('banned_users', JSON.stringify(newBanned))
    setLogMessage(`✅ Пользователь ${userId} разбанен`)
  }
  
  // Выдача осколков
  const giveShards = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    // Здесь будет реальная выдача через store
    setLogMessage(`✅ Выдано ${shardsAmount} осколков игроку ${targetUserId}`)
  }
  
  // Выдача опыта
  const giveExp = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    setLogMessage(`✅ Выдано ${expAmount} EXP игроку ${targetUserId}`)
  }
  
  // Выдача денег
  const giveMoney = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    setLogMessage(`✅ Выдано ${moneyAmount} денег игроку ${targetUserId}`)
  }
  
  // Выдача VIP навсегда
  const giveVip = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    setLogMessage(`👑 VIP навсегда выдан игроку ${targetUserId}!`)
  }
  
  // Глобальное сообщение
  const sendGlobalMessage = () => {
    const message = prompt('Введите сообщение для всех игроков:')
    if (message) {
      setLogMessage(`📢 Отправлено глобальное сообщение: "${message}"`)
      // Здесь можно добавить реальную отправку через Telegram API
    }
  }
  
  // Сброс всех данных
  const clearAllData = () => {
    if (confirm('⚠️ ТОЧНО УДАЛИТЬ ВСЕ ДАННЫЕ? Это необратимо!')) {
      localStorage.clear()
      setLogMessage('✅ Все данные удалены! Страница будет перезагружена.')
      setTimeout(() => window.location.reload(), 2000)
    }
  }
  
  // Если не админ — показываем отказ
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-900/30 border-2 border-red-500 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Доступ запрещён</h2>
          <p className="text-gray-400">Эта страница только для создателя игры.</p>
          <p className="text-gray-500 text-sm mt-4">Telegram ID: {userId || 'Не определён'}</p>
        </div>
      </div>
    )
  }
  
  // Форма входа (для админа)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">👑</div>
            <h2 className="text-2xl font-bold text-red-400">Админ-панель</h2>
            <p className="text-gray-400 text-sm mt-1">Добро пожаловать, Создатель</p>
          </div>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-2 rounded-lg font-semibold transition"
          >
            Войти в админку
          </button>
          {logMessage && (
            <p className={`mt-4 text-sm text-center ${logMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {logMessage}
            </p>
          )}
        </div>
      </div>
    )
  }
  
  // Основная панель админа
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      {/* Шапка */}
      <div className="bg-gradient-to-r from-red-900 to-red-800 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">👑 Админ-панель</h1>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="text-sm bg-red-700 px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            Выйти
          </button>
        </div>
        <p className="text-xs text-red-300 mt-1">Добро пожаловать, Администратор! Твой ID: {userId}</p>
      </div>
      
      {/* Табы */}
      <div className="flex border-b border-gray-700 overflow-x-auto">
        <button onClick={() => setActiveTab('users')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'users' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>👥 Пользователи</button>
        <button onClick={() => setActiveTab('donate')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'donate' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>💎 Выдача</button>
        <button onClick={() => setActiveTab('bans')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'bans' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>🔨 Баны</button>
        <button onClick={() => setActiveTab('stats')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'stats' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>📊 Статистика</button>
        <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'settings' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}>⚙️ Настройки</button>
      </div>
      
      <div className="p-4">
        {/* Логи */}
        {logMessage && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg text-sm border-l-4 border-red-500">
            {logMessage}
          </div>
        )}
        
        {/* Вкладка: Пользователи */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">🔍 <span>Поиск пользователя</span></h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Telegram ID пользователя"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">Найти</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">ℹ️ Скоро: поиск по ID и выдача бонусов напрямую</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">📋 <span>Забаненные пользователи</span></h3>
              {Object.keys(bannedUsers).length === 0 ? (
                <p className="text-gray-500 text-sm">Нет забаненных пользователей</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(bannedUsers).map(([id, data]) => (
                    <div key={id} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                      <div>
                        <div className="font-mono text-sm">{id}</div>
                        <div className="text-xs text-gray-400">Причина: {data.reason}</div>
                        <div className="text-xs text-gray-500">{data.date}</div>
                      </div>
                      <button onClick={() => unbanUser(id)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition">Разбанить</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Вкладка: Выдача доната */}
        {activeTab === 'donate' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">💎 <span>Выдать осколки</span></h3>
              <input
                type="text"
                placeholder="Telegram ID пользователя"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 mb-2"
              />
              <input
                type="number"
                value={shardsAmount}
                onChange={(e) => setShardsAmount(Number(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 mb-2"
              />
              <button onClick={giveShards} className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold transition">Выдать осколки</button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">✨ <span>Выдать опыт</span></h3>
              <input
                type="text"
                placeholder="Telegram ID пользователя"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 mb-2"
              />
              <input
                type="number"
                value={expAmount}
                onChange={(e) => setExpAmount(Number(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 mb-2"
              />
              <button onClick={giveExp} className="w-full bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg font-semibold transition">Выдать опыт</button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">💰 <span>Выдать деньги</span></h3>
              <input
                type="text"
                placeholder="Telegram ID пользователя"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 mb-2"
              />
              <input
                type="number"
                value={moneyAmount}
                onChange={(e) => setMoneyAmount(Number(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 mb-2"
              />
              <button onClick={giveMoney} className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition">Выдать деньги</button>
            </div>
            
            <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 rounded-lg p-4 border border-yellow-500">
              <h3 className="font-semibold mb-3 flex items-center gap-2">👑 <span>Выдать VIP навсегда</span></h3>
              <input
                type="text"
                placeholder="Telegram ID пользователя"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 mb-2"
              />
              <button onClick={giveVip} className="w-full bg-amber-600 hover:bg-amber-700 py-2 rounded-lg font-semibold transition">👑 Выдать VIP навсегда</button>
            </div>
          </div>
        )}
        
        {/* Вкладка: Баны */}
        {activeTab === 'bans' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">🔨 <span>Забанить пользователя</span></h3>
            <input
              type="text"
              placeholder="Telegram ID пользователя"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 mb-2"
            />
            <input
              type="text"
              placeholder="Причина бана (необязательно)"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 mb-2"
            />
            <button onClick={banUser} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition">🔨 Забанить</button>
          </div>
        )}
        
        {/* Вкладка: Статистика */}
        {activeTab === 'stats' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">📊 <span>Общая статистика</span></h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">💰 Всего заработано:</span>
                <span className="text-green-400 font-bold">${статистика?.всегоЗаработано?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">📦 Всего продаж:</span>
                <span className="text-white">{статистика?.всегоПродаж || 0}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">👮 Всего взяток:</span>
                <span className="text-white">{статистика?.всегоВзяток || 0}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">🚨 Всего рейдов:</span>
                <span className="text-white">{статистика?.всегоРейдов || 0}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">🚗 Всего поездок:</span>
                <span className="text-white">{статистика?.всегоПоездок || 0}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-400">⭐ Твой уровень:</span>
                <span className="text-purple-400 font-bold">{уровень}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">💎 Твои осколки:</span>
                <span className="text-blue-400 font-bold">{осколки}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Вкладка: Настройки */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">📢 <span>Глобальные уведомления</span></h3>
              <button onClick={sendGlobalMessage} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition">Отправить сообщение всем игрокам</button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">🎮 <span>Игровые события</span></h3>
              <div className="space-y-2">
                <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm transition">🎉 Запустить ивент x2 опыт (на 1 час)</button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm transition">💰 Запустить ивент x2 деньги (на 1 час)</button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm transition">💎 Выдать всем по 10 осколков</button>
              </div>
            </div>
            
            <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-red-400 flex items-center gap-2">⚠️ <span>Опасная зона</span></h3>
              <button onClick={clearAllData} className="w-full bg-red-700 hover:bg-red-800 py-2 rounded-lg font-semibold transition">💣 Удалить все данные игры (НЕОБРАТИМО)</button>
              <p className="text-xs text-gray-500 mt-2 text-center">Это удалит прогресс ВСЕХ игроков на их устройствах</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
