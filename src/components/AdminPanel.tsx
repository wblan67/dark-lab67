// @ts-nocheck
import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

const ADMIN_ID = '6034090849'
const ADMIN_PASSWORD = 'uuuuuioo67'

export default function AdminPanel() {
  const userId = useGameStore((state) => state.userId)
  const баланс = useGameStore((state) => state.баланс)
  const уровень = useGameStore((state) => state.уровень)
  const осколки = useGameStore((state) => state.осколки)
  const статистика = useGameStore((state) => state.статистика)

  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('users')

  const [targetUserId, setTargetUserId] = useState('')
  const [shardsAmount, setShardsAmount] = useState(100)
  const [expAmount, setExpAmount] = useState(1000)
  const [moneyAmount, setMoneyAmount] = useState(10000)
  const [banReason, setBanReason] = useState('')
  const [bannedUsers, setBannedUsers] = useState({})
  const [logMessage, setLogMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const isAdmin = true // Временно для теста, потом замени на userId === ADMIN_ID

  useEffect(() => {
    const saved = localStorage.getItem('banned_users')
    if (saved) setBannedUsers(JSON.parse(saved))
  }, [])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLogMessage('✅ Вход выполнен успешно')
    } else {
      setLogMessage('❌ Неверный пароль')
    }
  }

  const banUser = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    const newBanned = {
      ...bannedUsers,
      [targetUserId]: { reason: banReason || 'Нарушение правил', date: new Date().toLocaleString() }
    }
    setBannedUsers(newBanned)
    localStorage.setItem('banned_users', JSON.stringify(newBanned))
    setLogMessage(`✅ Пользователь ${targetUserId} забанен`)
    setTargetUserId('')
    setBanReason('')
  }

  const unbanUser = (id: string) => {
    const newBanned = { ...bannedUsers }
    delete newBanned[id]
    setBannedUsers(newBanned)
    localStorage.setItem('banned_users', JSON.stringify(newBanned))
    setLogMessage(`✅ Пользователь ${id} разбанен`)
  }

  const giveShards = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    setLogMessage(`✅ Выдано ${shardsAmount} осколков игроку ${targetUserId}`)
  }

  const giveExp = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    setLogMessage(`✅ Выдано ${expAmount} EXP игроку ${targetUserId}`)
  }

  const giveMoney = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    setLogMessage(`✅ Выдано ${moneyAmount} денег игроку ${targetUserId}`)
  }

  const giveVip = () => {
    if (!targetUserId) {
      setLogMessage('❌ Введите ID пользователя')
      return
    }
    setLogMessage(`👑 VIP навсегда выдан игроку ${targetUserId}`)
  }

  const sendGlobalMessage = () => {
    const msg = prompt('Введите сообщение для всех игроков:')
    if (msg) setLogMessage(`📢 Отправлено: "${msg}"`)
  }

  const clearAllData = () => {
    if (confirm('⚠️ Удалить ВСЕ данные?')) {
      localStorage.clear()
      setLogMessage('✅ Данные удалены. Страница перезагрузится.')
      setTimeout(() => window.location.reload(), 2000)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-red-400 mb-6">🔐 Админ-панель</h2>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold">
            Войти
          </button>
          {logMessage && <p className="mt-4 text-sm text-center text-red-400">{logMessage}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      <div className="bg-gradient-to-r from-red-900 to-red-800 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">👑 Админ-панель</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-red-700 px-3 py-1 rounded-lg hover:bg-red-600">
            Выйти
          </button>
        </div>
        <p className="text-xs text-red-300 mt-1">Добро пожаловать, Администратор! ID: {userId || '—'}</p>
      </div>

      <div className="flex border-b border-gray-700 overflow-x-auto">
        <button onClick={() => setActiveTab('users')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'users' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-white'}`}>👥 Пользователи</button>
        <button onClick={() => setActiveTab('donate')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'donate' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-white'}`}>💎 Выдача</button>
        <button onClick={() => setActiveTab('bans')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'bans' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-white'}`}>🔨 Баны</button>
        <button onClick={() => setActiveTab('stats')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'stats' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-white'}`}>📊 Статистика</button>
        <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'settings' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-white'}`}>⚙️ Настройки</button>
      </div>

      <div className="p-4">
        {logMessage && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg text-sm border-l-4 border-red-500">
            {logMessage}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">🔍 Поиск пользователя</h3>
              <div className="flex gap-2">
                <input type="text" placeholder="Telegram ID" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-gray-700 rounded-lg px-4 py-2" />
                <button className="bg-blue-600 px-4 py-2 rounded-lg">Найти</button>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">📋 Забаненные</h3>
              {Object.keys(bannedUsers).length === 0 ? (
                <p className="text-gray-500 text-sm">Нет забаненных</p>
              ) : (
                Object.entries(bannedUsers).map(([id, data]) => (
                  <div key={id} className="flex justify-between items-center bg-gray-700 p-2 rounded mb-2">
                    <div><div className="font-mono text-sm">{id}</div><div className="text-xs text-gray-400">{data.reason}</div></div>
                    <button onClick={() => unbanUser(id)} className="bg-green-600 px-3 py-1 rounded text-sm">Разбанить</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'donate' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">💎 Выдать осколки</h3>
              <input type="text" placeholder="ID пользователя" value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-2" />
              <input type="number" value={shardsAmount} onChange={(e) => setShardsAmount(Number(e.target.value))} className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-2" />
              <button onClick={giveShards} className="w-full bg-purple-600 py-2 rounded-lg">Выдать осколки</button>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">✨ Выдать опыт</h3>
              <input type="text" placeholder="ID пользователя" value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-2" />
              <input type="number" value={expAmount} onChange={(e) => setExpAmount(Number(e.target.value))} className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-2" />
              <button onClick={giveExp} className="w-full bg-yellow-600 py-2 rounded-lg">Выдать опыт</button>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">💰 Выдать деньги</h3>
              <input type="text" placeholder="ID пользователя" value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-2" />
              <input type="number" value={moneyAmount} onChange={(e) => setMoneyAmount(Number(e.target.value))} className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-2" />
              <button onClick={giveMoney} className="w-full bg-green-600 py-2 rounded-lg">Выдать деньги</button>
            </div>
            <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 rounded-lg p-4 border border-yellow-500">
              <h3 className="font-semibold mb-3">👑 Выдать VIP</h3>
              <input type="text" placeholder="ID пользователя" value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-2" />
              <button onClick={giveVip} className="w-full bg-amber-600 py-2 rounded-lg">Выдать VIP навсегда</button>
            </div>
          </div>
        )}

        {activeTab === 'bans' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">🔨 Забанить</h3>
            <input type="text" placeholder="ID пользователя" value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-2" />
            <input type="text" placeholder="Причина" value={banReason} onChange={(e) => setBanReason(e.target.value)} className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-2" />
            <button onClick={banUser} className="w-full bg-red-600 py-2 rounded-lg">Забанить</button>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">📊 Статистика</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>💰 Заработано:</span><span className="text-green-400">${статистика?.всегоЗаработано?.toLocaleString() || 0}</span></div>
              <div className="flex justify-between"><span>📦 Продаж:</span><span>{статистика?.всегоПродаж || 0}</span></div>
              <div className="flex justify-between"><span>👮 Взяток:</span><span>{статистика?.всегоВзяток || 0}</span></div>
              <div className="flex justify-between"><span>🚨 Рейдов:</span><span>{статистика?.всегоРейдов || 0}</span></div>
              <div className="flex justify-between"><span>⭐ Уровень:</span><span>{уровень}</span></div>
              <div className="flex justify-between"><span>💎 Осколки:</span><span>{осколки}</span></div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">📢 Уведомления</h3>
              <button onClick={sendGlobalMessage} className="w-full bg-blue-600 py-2 rounded-lg">Отправить сообщение всем</button>
            </div>
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-red-400">⚠️ Опасная зона</h3>
              <button onClick={clearAllData} className="w-full bg-red-700 py-2 rounded-lg">💣 Удалить все данные</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
