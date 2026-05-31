// @ts-nocheck
// Конфиг всех ачивок

export interface Achievement {
  id: string
  name: string
  description: string
  category: 'common' | 'drugs' | 'sales' | 'cars' | 'business' | 'police' | 'equipment' | 'levels' | 'random'
  rewardExp: number
  condition: (state: any) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  // ========== БЫТОВЫЕ ==========
  {
    id: 'welcome',
    name: '🏠 Добро пожаловать',
    description: 'Зайти в игру',
    category: 'common',
    rewardExp: 10,
    condition: (s) => true
  },
  {
    id: 'regular',
    name: '🏠 Завсегдатай',
    description: 'Зайти 7 дней подряд',
    category: 'common',
    rewardExp: 500,
    condition: (s) => (s.статистика?.дниПодряд || 0) >= 7
  },
  {
    id: 'hardworker',
    name: '🏠 Трудоголик',
    description: 'Провести 1 час в игре',
    category: 'common',
    rewardExp: 100,
    condition: (s) => (s.статистика?.времяВИгре || 0) >= 3600
  },
  {
    id: 'marathon',
    name: '🏠 Марафонец',
    description: 'Провести 10 часов в игре',
    category: 'common',
    rewardExp: 1000,
    condition: (s) => (s.статистика?.времяВИгре || 0) >= 36000
  },
  {
    id: 'resident',
    name: '🏠 Житель',
    description: 'Провести 24 часа в игре',
    category: 'common',
    rewardExp: 5000,
    condition: (s) => (s.статистика?.времяВИгре || 0) >= 86400
  },
  {
    id: 'clicker',
    name: '🏠 Кликер',
    description: 'Сделать 1000 кликов',
    category: 'common',
    rewardExp: 200,
    condition: (s) => (s.статистика?.всегоКликов || 0) >= 1000
  },
  {
    id: 'clicker_monster',
    name: '🏠 Кликер-монстр',
    description: 'Сделать 5000 кликов',
    category: 'common',
    rewardExp: 500,
    condition: (s) => (s.статистика?.всегоКликов || 0) >= 5000
  },

  // ========== НАРКОТИКИ ==========
  {
    id: 'first_craft',
    name: '🧪 Первый укол',
    description: 'Сварить первый наркотик',
    category: 'drugs',
    rewardExp: 50,
    condition: (s) => {
      const total = Object.values(s.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 1
    }
  },
  {
    id: 'crazy_chemist',
    name: '🧪 Химик ебанутый',
    description: 'Сварить 100г любого наркотика',
    category: 'drugs',
    rewardExp: 500,
    condition: (s) => {
      const total = Object.values(s.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 100
    }
  },
  {
    id: 'full_drugs',
    name: '🧪 Полный угар',
    description: 'Сварить все 10 видов',
    category: 'drugs',
    rewardExp: 2000,
    condition: (s) => Object.keys(s.статистика?.всегоСварено || {}).length >= 10
  },
  {
    id: 'krokodil_master',
    name: '🐊 Крокодил ебаный',
    description: 'Сварить 50г Крокодила',
    category: 'drugs',
    rewardExp: 300,
    condition: (s) => (s.статистика?.всегоСварено?.krokodil || 0) >= 50
  },
  {
    id: 'weed_master',
    name: '🌿 Обдолбай',
    description: 'Сварить 100г Марихуаны',
    category: 'drugs',
    rewardExp: 500,
    condition: (s) => (s.статистика?.всегоСварено?.marijuana || 0) >= 100
  },
  {
    id: 'meth_master',
    name: '❄️ Снежный барс',
    description: 'Сварить 50г Метамфетамина',
    category: 'drugs',
    rewardExp: 500,
    condition: (s) => (s.статистика?.всегоСварено?.meth || 0) >= 50
  },
  {
    id: 'walter_white',
    name: '💎 Вальтер Вайт',
    description: 'Сварить 30г Голубого Мета',
    category: 'drugs',
    rewardExp: 1000,
    condition: (s) => (s.статистика?.всегоСварено?.blue_meth || 0) >= 30
  },
  {
    id: 'acid_trip',
    name: '🧪 Кислотный трип',
    description: 'Сварить 20г ЛСД',
    category: 'drugs',
    rewardExp: 1500,
    condition: (s) => (s.статистика?.всегоСварено?.lsd || 0) >= 20
  },

  // ========== ПРОДАЖИ ==========
  {
    id: 'first_sale',
    name: '💰 Первый лох',
    description: 'Продать первый товар',
    category: 'sales',
    rewardExp: 50,
    condition: (s) => {
      const total = Object.values(s.статистика?.всегоПродано || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 1
    }
  },
  {
    id: 'dealer',
    name: '💰 Барыга',
    description: 'Совершить 100 продаж',
    category: 'sales',
    rewardExp: 1000,
    condition: (s) => (s.статистика?.всегоПродаж || 0) >= 100
  },
  {
    id: 'millionaire',
    name: '💰 Хуиллионер',
    description: 'Заработать $1,000,000',
    category: 'sales',
    rewardExp: 5000,
    condition: (s) => (s.статистика?.всегоЗаработано || 0) >= 1000000
  },
  {
    id: 'wholesale',
    name: '💰 Оптовая барыга',
    description: 'Продать 1000г товара',
    category: 'sales',
    rewardExp: 2000,
    condition: (s) => {
      const total = Object.values(s.статистика?.всегоПродано || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 1000
    }
  },
  {
    id: 'money_bag',
    name: '💰 Денежный мешок',
    description: 'Заработать $10,000,000',
    category: 'sales',
    rewardExp: 10000,
    condition: (s) => (s.статистика?.всегоЗаработано || 0) >= 10000000
  },

  // ========== МАШИНЫ ==========
  {
    id: 'first_car',
    name: '🚗 Бомж-такси',
    description: 'Купить первую машину',
    category: 'cars',
    rewardExp: 100,
    condition: (s) => Object.keys(s.машины || {}).length >= 1
  },
  {
    id: 'five_cars',
    name: '🚗 Автопарк долбоеба',
    description: 'Купить 5 машин',
    category: 'cars',
    rewardExp: 500,
    condition: (s) => Object.keys(s.машины || {}).length >= 5
  },
  {
    id: 'all_cars',
    name: '🚗 Король дорог',
    description: 'Купить все машины',
    category: 'cars',
    rewardExp: 2000,
    condition: (s) => Object.keys(s.машины || {}).length >= 11
  },
  {
    id: 'secret_car',
    name: '🚗 Тачка для пафоса',
    description: 'Купить Секретную машину',
    category: 'cars',
    rewardExp: 5000,
    condition: (s) => s.машины?.secret?.активна || false
  },
  {
    id: 'racer',
    name: '🚗 Гонщик ебаный',
    description: 'Совершить 100 поездок на продажу',
    category: 'cars',
    rewardExp: 1000,
    condition: (s) => (s.статистика?.всегоПоездок || 0) >= 100
  },

  // ========== БИЗНЕС ==========
  {
    id: 'first_business',
    name: '🏢 Легалайз',
    description: 'Купить первый бизнес',
    category: 'business',
    rewardExp: 500,
    condition: (s) => !!s.бизнес
  },
  {
    id: 'mafia',
    name: '🏢 Мафиози',
    description: 'Купить банк',
    category: 'business',
    rewardExp: 2000,
    condition: (s) => s.бизнес?.id === 'bank'
  },
  {
    id: 'clean_money',
    name: '🏢 Чистые бабки',
    description: 'Отмыть $1,000,000',
    category: 'business',
    rewardExp: 5000,
    condition: (s) => (s.статистика?.всегоОтмыто || 0) >= 1000000
  },

  // ========== ПОЛИЦИЯ ==========
  {
    id: 'wanted',
    name: '👮 В розыск ебаный',
    description: 'Достичь 100% розыска',
    category: 'police',
    rewardExp: 100,
    condition: (s) => s.розыск >= 100
  },
  {
    id: 'bribe_master',
    name: '👮 Взятка мусорам',
    description: 'Успешно дать взятку 10 раз',
    category: 'police',
    rewardExp: 1000,
    condition: (s) => (s.статистика?.всегоВзяток || 0) >= 10
  },
  {
    id: 'untouchable',
    name: '👮 Неуловимый хуй',
    description: 'Успешно избежать рейда 5 раз',
    category: 'police',
    rewardExp: 2000,
    condition: (s) => (s.статистика?.всегоРейдов || 0) >= 5
  },

  // ========== ОБОРУДОВАНИЕ ==========
  {
    id: 'five_equipment',
    name: '🔧 Подвал химика',
    description: 'Купить 5 единиц оборудования',
    category: 'equipment',
    rewardExp: 200,
    condition: (s) => Object.keys(s.оборудованиеИнстансы || {}).length >= 5
  },
  {
    id: 'all_equipment',
    name: '🔧 Лаборатория во все дыры',
    description: 'Купить всё оборудование',
    category: 'equipment',
    rewardExp: 2000,
    condition: (s) => Object.keys(s.оборудованиеИнстансы || {}).length >= 17
  },
  {
    id: 'repair_master',
    name: '🔧 Мастер-ломастер',
    description: 'Починить оборудование 100 раз',
    category: 'equipment',
    rewardExp: 1000,
    condition: (s) => (s.статистика?.всегоРемонтов || 0) >= 100
  },

  // ========== УРОВНИ ==========
  {
    id: 'level_5',
    name: '⭐ Сосунок',
    description: 'Достичь 5 уровня',
    category: 'levels',
    rewardExp: 500,
    condition: (s) => s.уровень >= 5
  },
  {
    id: 'level_10',
    name: '⭐ Хуй с горы',
    description: 'Достичь 10 уровня',
    category: 'levels',
    rewardExp: 2000,
    condition: (s) => s.уровень >= 10
  },
  {
    id: 'level_20',
    name: '⭐ Наркопанк',
    description: 'Достичь 20 уровня',
    category: 'levels',
    rewardExp: 10000,
    condition: (s) => s.уровень >= 20
  },

  // ========== РАНДОМНЫЕ ==========
  {
    id: 'craft_streak',
    name: '🔨 Хуякс-хуякс',
    description: 'Сделать 10 крафтов подряд',
    category: 'random',
    rewardExp: 1000,
    condition: (s) => (s.статистика?.всегоКрафтовПодряд || 0) >= 10
  }
]

// Получить ачивку по ID
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id)
}

// Получить ачивки по категории
export function getAchievementsByCategory(category: string): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category)
}
