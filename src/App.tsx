// @ts-nocheck
import { useEffect, useState } from 'react'
import { useGameStore } from './store/gameStore'
import Craft from './components/Craft'
import EquipmentShop from './components/EquipmentShop'
import Cars from './components/Cars'
import Business from './components/Business'
import Profile from './components/Profile'
import Leaderboard from './components/Leaderboard'
import Casino from './components/Casino'
import Boxes from './components/Boxes'
import Inventory from './components/Inventory'
import Fusion from './components/Fusion'
import ShardShop from './components/ShardShop'
import Repair from './components/Repair'
import Tuning from './components/Tuning'
import DailyBonus from './components/DailyBonus'
import Guild from './components/Guild'
import CreateGuild from './components/CreateGuild'
import GuildInvites from './components/GuildInvites'
import Referral from './components/Referral'
import AdminPanel from './components/AdminPanel'

const ADMIN_ID = '6034090849'

const INGREDIENTS = {
  lime: 5, soda: 5, foil: 5, fertilizer: 8, soil: 10, gasoline: 15,
  ipa_alcohol: 20, acetone: 25, iodine: 40, magnesium: 50,
  acetic_acid: 60, ammonium_chloride: 75, cannabis_seeds: 75,
  hydrochloric_acid: 100, sulfuric_acid: 125, chloroform: 150,
  codeine_pills: 200, methanol: 250, nitromethane: 300,
  cyclohexanone: 350, bromobenzene: 400, piperidine: 450,
  red_phosphorus: 500, methylamine: 600, p2np: 650,
  coca_leaves: 15, raw_opium: 120, diethylamine: 800,
  acetic_anhydride: 900, mercury_chloride: 1000, safrole: 1100,
  ergotamine: 1200, p2p: 1500
}

const DRUGS_BASE = {
  krokodil: { name: '🐊 Крокодил' },
  marijuana: { name: '🌿 Марихуана' },
  pcp: { name: '👻 PCP' },
  amphetamine: { name: '⚡ Амфетамин' },
  meth: { name: '❄️ Метамфетамин' },
  mdma: { name: '💊 MDMA' },
  heroin: { name: '💉 Героин' },
  cocaine: { name: '⬜ Кокаин' },
  blue_meth: { name: '💎 Голубой Мет' },
  lsd: { name: '🧪 ЛСД' }
}

const CARS_LIST = [
  { id: 'walk', name: '🚶‍♂️ Пешком', time: 20, capacity: 10 },
  { id: 'bicycle', name: '🛵 Велосипед', time: 15, capacity: 20 },
  { id: 'scooter', name: '🏍️ Скутер', time: 12, capacity: 30 },
  { id: 'cheapCar', name: '🚗 Дешёвая тачка', time: 10, capacity: 50 },
  { id: 'minibus', name: '🚐 Микроавтобус', time: 8, capacity: 80 },
  { id: 'truck', name: '🚚 Грузовик', time: 6, capacity: 120 },
  { id: 'bigTruck', name: '🚛 Фура', time: 5, capacity: 180 },
  { id: 'armored', name: '🚀 Бронированный', time: 4, capacity: 250 },
  { id: 'helicopter', name: '🚁 Вертолёт', time: 3, capacity: 350 },
  { id: 'plane', name: '✈️ Самолёт', time: 2, capacity: 500 },
  { id: 'secret', name: '🛸 Секретная', time: 1, capacity: 1000 }
]

const НАЗВАНИЯ_АЧИВОК = {
  'welcome': '🏠 Добро пожаловать',
  'regular': '🏠 Завсегдатай',
  'hardworker': '🏠 Трудоголик',
  'marathon': '🏠 Марафонец',
  'resident': '🏠 Житель',
  'clicker': '🏠 Кликер',
  'clicker_monster': '🏠 Кликер-монстр',
  'first_craft': '🧪 Первый укол',
  'crazy_chemist': '🧪 Химик',
  'full_drugs': '🧪 Полный угар',
  'krokodil_master': '🐊 Крокодил',
  'weed_master': '🌿 Обдолбай',
  'meth_master': '❄️ Снежный барс',
  'walter_white': '💎 Вальтер Вайт',
  'acid_trip': '🧪 Кислотный трип',
  'first_sale': '💰 Первый лох',
  'dealer': '💰 Барыга',
  'millionaire': '💰 Хуиллионер',
  'wholesale': '💰 Опт',
  'money_bag': '💰 Мешок',
  'first_car': '🚗 Бомж-такси',
  'five_cars': '🚗 Автопарк',
  'all_cars': '🚗 Король дорог',
  'secret_car': '🚗 Тачка',
  'racer': '🚗 Гонщик',
  'first_business': '🏢 Легалайз',
  'mafia': '🏢 Мафиози',
  'clean_money': '🏢 Чистые бабки',
  'wanted': '👮 В розыск',
  'bribe_master': '👮 Взятка',
  'untouchable': '👮 Неуловимый',
  'five_equipment': '🔧 Подвал',
  'all_equipment': '🔧 Лаба',
  'repair_master': '🔧 Мастер',
  'level_5': '⭐ 5 уровень',
  'level_10': '⭐ 10 уровень',
  'level_20': '⭐ 20 уровень',
  'craft_streak': '🔨 Серия'
}

function App() {
  const [telegramUser, setTelegramUser] = useState<any>(null)
  const [активнаяВкладка, установитьВкладку] = useState<'shop' | 'inventory' | 'craft' | 'equipment' | 'fusion' | 'cars' | 'business' | 'profile' | 'leaderboard' | 'casino' | 'boxes' | 'shardShop' | 'repair' | 'tuning' | 'daily' | 'guild' | 'createGuild' | 'referral' | 'admin'>('shop')
  const [уведомление, setУведомление] = useState<{ id: string; награда: number } | null>(null)
  
  const userId = useGameStore((state) => state.userId)
  const баланс = useGameStore((state) => state.баланс)
  const уровень = useGameStore((state) => state.уровень)
  const загрузка = useGameStore((state) => state.загрузка)
  const розыск = useGameStore((state) => state.розыск)
  const датьВзятку = useGameStore((state) => state.датьВзятку)
  const загрузитьПользователя = useGameStore((state) => state.загрузитьПользователя)
  const купитьПредмет = useGameStore((state) => state.купитьПредмет)
  const активнаяМашина = useGameStore((state) => state.активнаяМашина)
  const текущиеЦены = useGameStore((state) => state.текущиеЦены)
  const следующееОбновлениеЦен = useGameStore((state) => state.следующееОбновлениеЦен)
  const запланироватьОбновлениеЦен = useGameStore((state) => state.запланироватьОбновлениеЦен)
  
  useEffect(() => {
    if (userId && userId !== 'test_user_123') {
      localStorage.setItem('telegram_id', userId)
    }
  }, [userId])
  
  useEffect(() => {
    const interval = setInterval(() => {
      const { статистика } = useGameStore.getState()
      useGameStore.setState({
        статистика: {
          ...статистика,
          времяВИгре: (статистика?.времяВИгре || 0) + 1
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    const { запланироватьОбновлениеЦен, следующееОбновлениеЦен, обновитьЦены } = useGameStore.getState()
    if (следующееОбновлениеЦен < Date.now()) обновитьЦены()
    запланироватьОбновлениеЦен()
  }, [])
  
  useEffect(() => {
    const handler = (e: any) => установитьВкладку(e.detail)
    window.addEventListener('switchTab', handler)
    return () => window.removeEventListener('switchTab', handler)
  }, [])
  
  useEffect(() => {
    const handler = (e: any) => {
      const { id, награда } = e.detail
      setУведомление({ id, награда })
      setTimeout(() => setУведомление(null), 3000)
    }
    window.addEventListener('achievementUnlocked', handler)
    return () => window.removeEventListener('achievementUnlocked', handler)
  }, [])
  
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg && tg.initDataUnsafe?.user) {
      const user = tg.initDataUnsafe.user
      setTelegramUser(user)
      if (user.id) {
        const tgId = String(user.id)
        загрузитьПользователя(tgId)
        localStorage.setItem('telegram_id', tgId)
      }
      tg.ready()
      tg.expand()
    } else {
      const savedId = localStorage.getItem('telegram_id')
      if (savedId && savedId !== 'test_user_123') {
        загрузитьПользователя(savedId)
      } else {
        загрузитьПользователя('test_user_123')
      }
    }
  }, [])
  
  if (загрузка) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Загрузка...</div></div>
  }
  
  const времяДоОбновления = () => {
    const осталось = Math.max(0, следующееОбновлениеЦен - Date.now())
    const мин = Math.floor(осталось / 60000)
    const сек = Math.floor((осталось % 60000) / 1000)
    return `${мин} мин ${сек} сек`
  }
  
  const активнаяМашинаДанные = CARS_LIST.find(c => c.id === активнаяМашина) || CARS_LIST[0]
  
  const обработчикКлика = () => {
    const { статистика } = useGameStore.getState()
    useGameStore.setState({
      статистика: {
        ...статистика,
        всегоКликов: (статистика?.всегоКликов || 0) + 1
      }
    })
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20" onClick={обработчикКлика}>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink { animation: shrink 3s linear forwards; }
        .animate-bounce { animation: bounce 0.5s ease-out; }
        @keyframes bounce {
          0% { transform: translateY(100px); opacity: 0; }
          50% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      {/* Шапка без аватарки — имя, username, ID в три строки */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-2 py-1 border-b border-gray-700 sticky top-0 z-20">
        <div className="min-w-0">
          {telegramUser ? (
            <>
              <div className="text-[10px] text-white font-medium truncate">
                {telegramUser.first_name?.slice(0, 15)} {telegramUser.last_name?.slice(0, 15) || ''}
              </div>
              <div className="text-[9px] text-gray-400 truncate">
                @{telegramUser.username?.slice(0, 15) || 'no_username'}
              </div>
              <div className="text-[8px] text-gray-500 truncate">
                ID: {userId || '—'}
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] text-red-300 font-medium truncate">
                Администратор
              </div>
              <div className="text-[9px] text-red-400 truncate">
                @{ADMIN_ID.slice(0, 15)}
              </div>
              <div className="text-[8px] text-red-500 truncate">
                ID: {ADMIN_ID}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-400">🔬 Тёмная Лаборатория</h1>
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 px-4 py-2 rounded-full">
              <span className="text-yellow-400">💰</span> {баланс !== undefined ? баланс.toLocaleString() : 1500} $
            </div>
            <button
              onClick={() => {
                const текущийБаланс = useGameStore.getState().баланс
                const новыйБаланс = (текущийБаланс || 1500) + 10000
                useGameStore.setState({ баланс: новыйБаланс })
                alert(`✨ +$10,000! Теперь у вас $${новыйБаланс.toLocaleString()}`)
              }}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-full text-sm font-semibold transition"
            >
              ✨ +10k
            </button>
            <button
              onClick={() => {
                if (confirm('⚠️ ВНИМАНИЕ! Это удалит ВСЕ данные. Вы уверены?')) {
                  useGameStore.setState({ 
                    активныеПродажи: {}, 
                    баланс: 1500, 
                    инвентарь: {},
                    машины: {},
                    улучшенияМашин: {},
                    активнаяМашина: 'walk',
                    розыск: 0,
                    бизнес: null,
                    оборудованиеИнстансы: {},
                    оборудованиеИнстансыДанные: {},
                    навыки: {},
                    ачивки: {},
                    активноеЗвание: 'street_dealer',
                    доступныеЗвания: ['street_dealer'],
                    активныйСкин: 'basement',
                    купленныеСкины: ['basement'],
                    осколки: 0,
                    глифы: {},
                    экипированныеГлифы: [],
                    защитаОтСгорания: 0,
                    гильдия: null,
                    гильдейскийИнвентарь: {
                      labSkins: [],
                      activeLabSkin: null,
                      conversionBonuses: [],
                      activeConversionBonus: null,
                      temporaryBuffs: {}
                    },
                    профит: 0,
                    всеГильдии: {},
                    приглашенияВГильдию: [],
                    приглашённые: [],
                    бонусыЗаПриглашения: 0,
                    реферальныйСчётчик: 0,
                    статистика: {
                      всегоСварено: {},
                      всегоПродано: {},
                      всегоПродаж: 0,
                      всегоЗаработано: 0,
                      всегоОтмыто: 0,
                      всегоВзяток: 0,
                      всегоРейдов: 0,
                      всегоКрафтовПодряд: 0,
                      максимальныйБаланс: 1500,
                      всегоПоездок: 0,
                      поездкиПешком: 0,
                      всегоРемонтов: 0,
                      времяВИгре: 0,
                      всегоКликов: 0,
                      дниПодряд: 0,
                      последнийВход: Date.now(),
                      последнийБонус: 0,
                      утреннийВход: false,
                      ночнойВход: false
                    }
                  })
                  alert('✅ Данные очищены! Страница перезагрузится.')
                  window.location.reload()
                }
              }}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-full text-sm font-semibold transition"
            >
              🔄 Сброс
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm">
          <div className="text-blue-400">🚗 {активнаяМашинаДанные.name} ({активнаяМашинаДанные.time} мин)</div>
          <div className="text-purple-400">⭐ Уровень {уровень}</div>
        </div>
        <div className="text-xs text-gray-400 mt-1">📊 Биржа обновится через: {времяДоОбновления()}</div>
        
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-400">👮 Внимание полиции:</span>
            <span className={розыск > 70 ? 'text-red-400' : розыск > 30 ? 'text-yellow-400' : 'text-green-400'}>{розыск}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all ${розыск > 70 ? 'bg-red-500' : розыск > 30 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${розыск}%` }} />
          </div>
        </div>
        
        {розыск > 0 && (
          <button onClick={() => датьВзятку()} className="mt-2 w-full py-1 rounded bg-red-600 hover:bg-red-700 text-sm transition">
            💰 Дать взятку (${розыск * 200})
          </button>
        )}
      </div>
      
      <div className="flex border-b border-gray-700 overflow-x-auto">
        <button onClick={() => установитьВкладку('shop')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'shop' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🏪 Магазин</button>
        <button onClick={() => установитьВкладку('inventory')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'inventory' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>📦 Инвентарь</button>
        <button onClick={() => установитьВкладку('craft')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'craft' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🔬 Лаборатория</button>
        <button onClick={() => установитьВкладку('equipment')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'equipment' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🔧 Оборудование</button>
        <button onClick={() => установитьВкладку('repair')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'repair' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🔧 Ремонт</button>
        <button onClick={() => установитьВкладку('fusion')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'fusion' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🔮 Скрещивание</button>
        <button onClick={() => установитьВкладку('cars')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'cars' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🚗 Автопарк</button>
        <button onClick={() => установитьВкладку('tuning')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'tuning' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🔧 Тюнинг</button>
        <button onClick={() => установитьВкладку('business')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'business' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🏢 Бизнес</button>
        <button onClick={() => установитьВкладку('daily')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'daily' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🎁 Бонус</button>
        <button onClick={() => установитьВкладку('referral')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'referral' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>👥 Рефералы</button>
        <button onClick={() => установитьВкладку('guild')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'guild' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🏆 Гильдия</button>
        <button onClick={() => установитьВкладку('profile')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'profile' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>👤 Профиль</button>
        <button onClick={() => установитьВкладку('leaderboard')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'leaderboard' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🏆 Топ</button>
        <button onClick={() => установитьВкладку('casino')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'casino' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>🎰 Казино</button>
        <button onClick={() => установитьВкладку('boxes')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'boxes' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>📦 Боксы</button>
        <button onClick={() => установитьВкладку('shardShop')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'shardShop' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>💎 Магазин</button>
        
        {(userId === ADMIN_ID) && (
          <button onClick={() => установитьВкладку('admin')} className={`flex-1 py-3 text-sm font-semibold whitespace-nowrap transition ${активнаяВкладка === 'admin' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-white'}`}>👑 Админ</button>
        )}
      </div>
      
      {активнаяВкладка === 'shop' && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">🧪 Ингредиенты</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(INGREDIENTS).map(([название, цена]) => (
              <button key={название} onClick={async () => { await купитьПредмет(название, цена) }} className="bg-gray-800 p-3 rounded-lg text-left hover:bg-gray-700 transition">
                <div className="font-medium text-sm">{название.replace(/_/g, ' ')}</div>
                <div className="text-yellow-400 text-sm">{цена} $</div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {активнаяВкладка === 'inventory' && <Inventory />}
      {активнаяВкладка === 'craft' && <Craft />}
      {активнаяВкладка === 'equipment' && <EquipmentShop />}
      {активнаяВкладка === 'repair' && <Repair />}
      {активнаяВкладка === 'fusion' && <Fusion />}
      {активнаяВкладка === 'cars' && <Cars />}
      {активнаяВкладка === 'tuning' && <Tuning />}
      {активнаяВкладка === 'business' && <Business />}
      {активнаяВкладка === 'daily' && <DailyBonus />}
      {активнаяВкладка === 'referral' && <Referral />}
      {активнаяВкладка === 'guild' && <Guild />}
      {активнаяВкладка === 'createGuild' && <CreateGuild />}
      {активнаяВкладка === 'profile' && <Profile />}
      {активнаяВкладка === 'leaderboard' && <Leaderboard />}
      {активнаяВкладка === 'casino' && <Casino />}
      {активнаяВкладка === 'boxes' && <Boxes />}
      {активнаяВкладка === 'shardShop' && <ShardShop />}
      {активнаяВкладка === 'admin' && <AdminPanel />}
      
      <GuildInvites />
      
      {уведомление && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg shadow-xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-lg">НОВАЯ АЧИВКА!</div>
                  <div className="text-white text-sm font-medium">
                    {НАЗВАНИЯ_АЧИВОК[уведомление.id] || уведомление.id}
                  </div>
                  <div className="text-yellow-200 text-xs mt-1">+{уведомление.награда} EXP</div>
                </div>
                <button onClick={() => setУведомление(null)} className="text-white/70 hover:text-white text-xl leading-none">✕</button>
              </div>
            </div>
            <div className="h-1 bg-white/30">
              <div className="h-full bg-white animate-shrink" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
