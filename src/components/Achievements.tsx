// @ts-nocheck
// Конфиг всех ачивок

export interface Achievement {
  id: string
  name: string
  description: string
  category: 'common' | 'drugs' | 'sales' | 'cars' | 'business' | 'police' | 'equipment' | 'levels' | 'random' | 'guild' | 'boxes' | 'casino' | 'daily'
  rewardExp: number
  condition: (state: any) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  // =========== СТАРЫЕ АЧИВКИ (сохранены) ===========
  {
    id: 'welcome',
    name: 'Добро пожаловать',
    description: 'Начать игру',
    category: 'common',
    rewardExp: 10,
    condition: () => true
  },
  {
    id: 'regular',
    name: 'Завсегдатай',
    description: 'Играть 7 дней подряд',
    category: 'common',
    rewardExp: 500,
    condition: (state: any) => (state.статистика?.дниПодряд || 0) >= 7
  },
  {
    id: 'hardworker',
    name: 'Трудоголик',
    description: 'Провести в игре 1 час',
    category: 'common',
    rewardExp: 100,
    condition: (state: any) => (state.статистика?.времяВИгре || 0) >= 3600
  },
  {
    id: 'marathon',
    name: 'Марафонец',
    description: 'Провести в игре 10 часов',
    category: 'common',
    rewardExp: 1000,
    condition: (state: any) => (state.статистика?.времяВИгре || 0) >= 36000
  },
  {
    id: 'resident',
    name: 'Житель',
    description: 'Провести в игре 24 часа',
    category: 'common',
    rewardExp: 5000,
    condition: (state: any) => (state.статистика?.времяВИгре || 0) >= 86400
  },
  {
    id: 'clicker',
    name: 'Кликер',
    description: 'Сделать 1000 кликов',
    category: 'common',
    rewardExp: 200,
    condition: (state: any) => (state.статистика?.всегоКликов || 0) >= 1000
  },
  {
    id: 'clicker_monster',
    name: 'Кликер-монстр',
    description: 'Сделать 5000 кликов',
    category: 'common',
    rewardExp: 500,
    condition: (state: any) => (state.статистика?.всегоКликов || 0) >= 5000
  },
  {
    id: 'first_craft',
    name: 'Первый укол',
    description: 'Сварить наркотик впервые',
    category: 'drugs',
    rewardExp: 50,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 1
    }
  },
  {
    id: 'crazy_chemist',
    name: 'Химик ебанутый',
    description: 'Сварить 100 грамм наркотиков',
    category: 'drugs',
    rewardExp: 500,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 100
    }
  },
  {
    id: 'full_drugs',
    name: 'Полный угар',
    description: 'Сварить все виды наркотиков',
    category: 'drugs',
    rewardExp: 2000,
    condition: (state: any) => Object.keys(state.статистика?.всегоСварено || {}).length >= 10
  },
  {
    id: 'krokodil_master',
    name: 'Крокодил ебаный',
    description: 'Сварить 50 грамм Крокодила',
    category: 'drugs',
    rewardExp: 300,
    condition: (state: any) => (state.статистика?.всегоСварено?.krokodil || 0) >= 50
  },
  {
    id: 'weed_master',
    name: 'Обдолбай',
    description: 'Сварить 100 грамм Марихуаны',
    category: 'drugs',
    rewardExp: 500,
    condition: (state: any) => (state.статистика?.всегоСварено?.marijuana || 0) >= 100
  },
  {
    id: 'meth_master',
    name: 'Снежный барс',
    description: 'Сварить 50 грамм Метамфетамина',
    category: 'drugs',
    rewardExp: 500,
    condition: (state: any) => (state.статистика?.всегоСварено?.meth || 0) >= 50
  },
  {
    id: 'walter_white',
    name: 'Вальтер Вайт',
    description: 'Сварить 30 грамм Голубого Мета',
    category: 'drugs',
    rewardExp: 1000,
    condition: (state: any) => (state.статистика?.всегоСварено?.blue_meth || 0) >= 30
  },
  {
    id: 'acid_trip',
    name: 'Кислотный трип',
    description: 'Сварить 20 грамм ЛСД',
    category: 'drugs',
    rewardExp: 1500,
    condition: (state: any) => (state.статистика?.всегоСварено?.lsd || 0) >= 20
  },
  {
    id: 'first_sale',
    name: 'Первый лох',
    description: 'Продать наркотик впервые',
    category: 'sales',
    rewardExp: 50,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоПродано || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 1
    }
  },
  {
    id: 'dealer',
    name: 'Барыга',
    description: 'Совершить 100 продаж',
    category: 'sales',
    rewardExp: 1000,
    condition: (state: any) => (state.статистика?.всегоПродаж || 0) >= 100
  },
  {
    id: 'millionaire',
    name: 'Хуиллионер',
    description: 'Заработать $1,000,000',
    category: 'sales',
    rewardExp: 5000,
    condition: (state: any) => (state.статистика?.всегоЗаработано || 0) >= 1000000
  },
  {
    id: 'wholesale',
    name: 'Оптовая барыга',
    description: 'Продать 1000 грамм наркотиков',
    category: 'sales',
    rewardExp: 2000,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоПродано || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 1000
    }
  },
  {
    id: 'money_bag',
    name: 'Денежный мешок',
    description: 'Заработать $10,000,000',
    category: 'sales',
    rewardExp: 10000,
    condition: (state: any) => (state.статистика?.всегоЗаработано || 0) >= 10000000
  },
  {
    id: 'first_car',
    name: 'Бомж-такси',
    description: 'Купить первую машину',
    category: 'cars',
    rewardExp: 100,
    condition: (state: any) => Object.keys(state.машины || {}).length >= 1
  },
  {
    id: 'five_cars',
    name: 'Автопарк долбоеба',
    description: 'Купить 5 машин',
    category: 'cars',
    rewardExp: 500,
    condition: (state: any) => Object.keys(state.машины || {}).length >= 5
  },
  {
    id: 'all_cars',
    name: 'Король дорог',
    description: 'Купить все машины',
    category: 'cars',
    rewardExp: 2000,
    condition: (state: any) => Object.keys(state.машины || {}).length >= 11
  },
  {
    id: 'secret_car',
    name: 'Тачка для пафоса',
    description: 'Купить секретную машину',
    category: 'cars',
    rewardExp: 5000,
    condition: (state: any) => state.машины?.secret?.активна || false
  },
  {
    id: 'racer',
    name: 'Гонщик ебаный',
    description: 'Совершить 100 поездок',
    category: 'cars',
    rewardExp: 1000,
    condition: (state: any) => (state.статистика?.всегоПоездок || 0) >= 100
  },
  {
    id: 'first_business',
    name: 'Легалайз',
    description: 'Купить первый бизнес',
    category: 'business',
    rewardExp: 500,
    condition: (state: any) => !!state.бизнес
  },
  {
    id: 'mafia',
    name: 'Мафиози',
    description: 'Купить банк',
    category: 'business',
    rewardExp: 2000,
    condition: (state: any) => state.бизнес?.id === 'bank'
  },
  {
    id: 'clean_money',
    name: 'Чистые бабки',
    description: 'Отмыть $1,000,000',
    category: 'business',
    rewardExp: 5000,
    condition: (state: any) => (state.статистика?.всегоОтмыто || 0) >= 1000000
  },
  {
    id: 'wanted',
    name: 'В розыск ебаный',
    description: 'Достичь 100% розыска',
    category: 'police',
    rewardExp: 100,
    condition: (state: any) => state.розыск >= 100
  },
  {
    id: 'bribe_master',
    name: 'Взятка мусорам',
    description: 'Дать 10 взяток',
    category: 'police',
    rewardExp: 1000,
    condition: (state: any) => (state.статистика?.всегоВзяток || 0) >= 10
  },
  {
    id: 'untouchable',
    name: 'Неуловимый хуй',
    description: 'Пережить 5 рейдов',
    category: 'police',
    rewardExp: 2000,
    condition: (state: any) => (state.статистика?.всегоРейдов || 0) >= 5
  },
  {
    id: 'five_equipment',
    name: 'Подвал химика',
    description: 'Купить 5 единиц оборудования',
    category: 'equipment',
    rewardExp: 200,
    condition: (state: any) => Object.keys(state.оборудованиеИнстансы || {}).length >= 5
  },
  {
    id: 'all_equipment',
    name: 'Лаборатория во все дыры',
    description: 'Купить всё оборудование',
    category: 'equipment',
    rewardExp: 2000,
    condition: (state: any) => Object.keys(state.оборудованиеИнстансы || {}).length >= 17
  },
  {
    id: 'repair_master',
    name: 'Мастер-ломастер',
    description: 'Починить оборудование 100 раз',
    category: 'equipment',
    rewardExp: 1000,
    condition: (state: any) => (state.статистика?.всегоРемонтов || 0) >= 100
  },
  {
    id: 'level_5',
    name: 'Сосунок',
    description: 'Достичь 5 уровня',
    category: 'levels',
    rewardExp: 500,
    condition: (state: any) => state.уровень >= 5
  },
  {
    id: 'level_10',
    name: 'Хуй с горы',
    description: 'Достичь 10 уровня',
    category: 'levels',
    rewardExp: 2000,
    condition: (state: any) => state.уровень >= 10
  },
  {
    id: 'level_20',
    name: 'Наркопанк',
    description: 'Достичь 20 уровня',
    category: 'levels',
    rewardExp: 10000,
    condition: (state: any) => state.уровень >= 20
  },
  {
    id: 'craft_streak',
    name: 'Хуякс-хуякс',
    description: 'Сделать 10 крафтов подряд без рейда',
    category: 'random',
    rewardExp: 1000,
    condition: (state: any) => (state.статистика?.всегоКрафтовПодряд || 0) >= 10
  },

  // ==================== НОВЫЕ АЧИВКИ (50 штук) ====================
  
  // --- ВАРКА (крафт) ---
  {
    id: 'cook_10',
    name: '🥄 Дилер-стажёр',
    description: 'Сварить 10 грамм наркотиков',
    category: 'drugs',
    rewardExp: 50,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 10
    }
  },
  {
    id: 'cook_100',
    name: '🧪 Лаборант',
    description: 'Сварить 100 грамм наркотиков',
    category: 'drugs',
    rewardExp: 200,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 100
    }
  },
  {
    id: 'cook_500',
    name: '🔬 Химик',
    description: 'Сварить 500 грамм наркотиков',
    category: 'drugs',
    rewardExp: 800,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 500
    }
  },
  {
    id: 'cook_1000',
    name: '👨‍🔬 Мастер-варщик',
    description: 'Сварить 1000 грамм наркотиков',
    category: 'drugs',
    rewardExp: 2000,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 1000
    }
  },
  {
    id: 'cook_5000',
    name: '👑 Наркобарон',
    description: 'Сварить 5000 грамм наркотиков',
    category: 'drugs',
    rewardExp: 10000,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 5000
    }
  },
  {
    id: 'cook_10000',
    name: '💎 Легенда лаборатории',
    description: 'Сварить 10000 грамм наркотиков',
    category: 'drugs',
    rewardExp: 25000,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 10000
    }
  },

  // --- ПРОДАЖИ ---
  {
    id: 'sale_10',
    name: '💵 Первые деньги',
    description: 'Продать 10 грамм наркотиков',
    category: 'sales',
    rewardExp: 50,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоПродано || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 10
    }
  },
  {
    id: 'sale_100',
    name: '💰 Торговец',
    description: 'Продать 100 грамм наркотиков',
    category: 'sales',
    rewardExp: 200,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоПродано || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 100
    }
  },
  {
    id: 'sale_500',
    name: '📈 Оптовик',
    description: 'Продать 500 грамм наркотиков',
    category: 'sales',
    rewardExp: 800,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоПродано || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 500
    }
  },
  {
    id: 'sale_1000',
    name: '🏪 Барыга со стажем',
    description: 'Продать 1000 грамм наркотиков',
    category: 'sales',
    rewardExp: 2000,
    condition: (state: any) => {
      const total = Object.values(state.статистика?.всегоПродано || {}).reduce((a: number, b: number) => a + b, 0)
      return total >= 1000
    }
  },
  {
    id: 'million_sale',
    name: '💸 Миллионер',
    description: 'Заработать $1,000,000 с продаж',
    category: 'sales',
    rewardExp: 5000,
    condition: (state: any) => (state.статистика?.всегоЗаработано || 0) >= 1000000
  },
  {
    id: 'ten_million_sale',
    name: '🤑 Десятимиллионер',
    description: 'Заработать $10,000,000 с продаж',
    category: 'sales',
    rewardExp: 20000,
    condition: (state: any) => (state.статистика?.всегоЗаработано || 0) >= 10000000
  },
  {
    id: 'hundred_million_sale',
    name: '💎 Крипто-король',
    description: 'Заработать $100,000,000 с продаж',
    category: 'sales',
    rewardExp: 100000,
    condition: (state: any) => (state.статистика?.всегоЗаработано || 0) >= 100000000
  },

  // --- ПОЛИЦИЯ И РЕЙДЫ ---
  {
    id: 'first_raid',
    name: '🚨 Первый рейд',
    description: 'Пережить 1 рейд',
    category: 'police',
    rewardExp: 100,
    condition: (state: any) => (state.статистика?.всегоРейдов || 0) >= 1
  },
  {
    id: 'raid_survivor',
    name: '🛡️ Выживший',
    description: 'Пережить 10 рейдов',
    category: 'police',
    rewardExp: 1500,
    condition: (state: any) => (state.статистика?.всегоРейдов || 0) >= 10
  },
  {
    id: 'raid_tank',
    name: '🦾 Неуязвимый',
    description: 'Пережить 25 рейдов',
    category: 'police',
    rewardExp: 5000,
    condition: (state: any) => (state.статистика?.всегоРейдов || 0) >= 25
  },
  {
    id: 'untouchable_legend',
    name: '🛡️ Неприкасаемый',
    description: 'Пережить 50 рейдов',
    category: 'police',
    rewardExp: 10000,
    condition: (state: any) => (state.статистика?.всегоРейдов || 0) >= 50
  },
  {
    id: 'bribe_king',
    name: '👑 Король взяток',
    description: 'Дать 50 взяток',
    category: 'police',
    rewardExp: 2000,
    condition: (state: any) => (state.статистика?.всегоВзяток || 0) >= 50
  },

  // --- МАШИНЫ ---
  {
    id: 'car_collector',
    name: '🚘 Коллекционер',
    description: 'Купить все машины',
    category: 'cars',
    rewardExp: 5000,
    condition: (state: any) => Object.keys(state.машины || {}).length >= 11
  },
  {
    id: 'tuning_master',
    name: '🔧 Тюнинг-мастер',
    description: 'Сделать 20 улучшений машин',
    category: 'cars',
    rewardExp: 3000,
    condition: (state: any) => {
      const upgrades = Object.values(state.улучшенияМашин || {})
      let total = 0
      for (const u of upgrades) {
        total += (u.скорость || 0) + (u.вместимость || 0) + (u.надежность || 0)
      }
      return total >= 20
    }
  },
  {
    id: 'tuning_legend',
    name: '⚡ Гонщик Формулы',
    description: 'Сделать 50 улучшений машин',
    category: 'cars',
    rewardExp: 8000,
    condition: (state: any) => {
      const upgrades = Object.values(state.улучшенияМашин || {})
      let total = 0
      for (const u of upgrades) {
        total += (u.скорость || 0) + (u.вместимость || 0) + (u.надежность || 0)
      }
      return total >= 50
    }
  },
  {
    id: 'max_tuning',
    name: '🏆 Король скорости',
    description: 'Улучшить машину до максимального уровня',
    category: 'cars',
    rewardExp: 2000,
    condition: (state: any) => {
      const upgrades = Object.values(state.улучшенияМашин || {})
      for (const u of upgrades) {
        if (u.скорость === 5 || u.вместимость === 5 || u.надежность === 5) return true
      }
      return false
    }
  },

  // --- БИЗНЕС ---
  {
    id: 'cleaner',
    name: '🧼 Отмыватель',
    description: 'Отмыть $1,000,000 через бизнес',
    category: 'business',
    rewardExp: 3000,
    condition: (state: any) => (state.статистика?.всегоОтмыто || 0) >= 1000000
  },
  {
    id: 'banker',
    name: '🏦 Банкир',
    description: 'Отмыть $10,000,000 через бизнес',
    category: 'business',
    rewardExp: 15000,
    condition: (state: any) => (state.статистика?.всегоОтмыто || 0) >= 10000000
  },
  {
    id: 'oligarch',
    name: '👔 Олигарх',
    description: 'Купить все бизнесы',
    category: 'business',
    rewardExp: 10000,
    condition: (state: any) => !!state.бизнес?.id === 'bank' && !!state.бизнес
  },

  // --- ОБОРУДОВАНИЕ ---
  {
    id: 'repair_50',
    name: '⚙️ Механик',
    description: 'Починить оборудование 50 раз',
    category: 'equipment',
    rewardExp: 2000,
    condition: (state: any) => (state.статистика?.всегоРемонтов || 0) >= 50
  },
  {
    id: 'repair_200',
    name: '🛠️ Инженер',
    description: 'Починить оборудование 200 раз',
    category: 'equipment',
    rewardExp: 8000,
    condition: (state: any) => (state.статистика?.всегоРемонтов || 0) >= 200
  },
  {
    id: 'fusion_master',
    name: '🔥 Скрещиватель',
    description: 'Успешно скрестить оборудование 10 раз',
    category: 'equipment',
    rewardExp: 5000,
    condition: (state: any) => false // Требуется логика подсчёта успешных скрещиваний
  },

  // --- БОКСЫ И ГЛИФЫ ---
  {
    id: 'boxes_10',
    name: '🎁 Везунчик',
    description: 'Открыть 10 боксов',
    category: 'boxes',
    rewardExp: 500,
    condition: (state: any) => false // Требуется логика подсчёта открытых боксов
  },
  {
    id: 'boxes_50',
    name: '🍀 Счастливчик',
    description: 'Открыть 50 боксов',
    category: 'boxes',
    rewardExp: 2000,
    condition: (state: any) => false
  },
  {
    id: 'boxes_100',
    name: '🍀 Ультра-везунчик',
    description: 'Открыть 100 боксов',
    category: 'boxes',
    rewardExp: 5000,
    condition: (state: any) => false
  },
  {
    id: 'glyphs_10',
    name: '✨ Коллекционер глифов',
    description: 'Собрать 10 уникальных глифов',
    category: 'boxes',
    rewardExp: 1000,
    condition: (state: any) => Object.keys(state.глифы || {}).length >= 10
  },
  {
    id: 'glyphs_30',
    name: '👑 Мастер глифов',
    description: 'Собрать 30 уникальных глифов',
    category: 'boxes',
    rewardExp: 5000,
    condition: (state: any) => Object.keys(state.глифы || {}).length >= 30
  },
  {
    id: 'glyphs_50',
    name: '🏆 Легендарный коллекционер',
    description: 'Собрать 50 уникальных глифов',
    category: 'boxes',
    rewardExp: 15000,
    condition: (state: any) => Object.keys(state.глифы || {}).length >= 50
  },
  {
    id: 'mythic_glyph',
    name: '🌟 Мифический',
    description: 'Получить мифический глиф',
    category: 'boxes',
    rewardExp: 10000,
    condition: (state: any) => {
      const glyphs = state.глифы || {}
      for (const [id, owned] of Object.entries(glyphs)) {
        if (owned && id.includes('mythic')) return true
      }
      return false
    }
  },

  // --- ГИЛЬДИЯ ---
  {
    id: 'join_guild',
    name: '🤝 Душа компании',
    description: 'Вступить в гильдию',
    category: 'guild',
    rewardExp: 500,
    condition: (state: any) => !!state.гильдия
  },
  {
    id: 'create_guild',
    name: '👑 Лидер',
    description: 'Создать гильдию',
    category: 'guild',
    rewardExp: 5000,
    condition: (state: any) => state.гильдия?.leader === state.userId
  },
  {
    id: 'guild_quests_10',
    name: '💪 Активист',
    description: 'Выполнить 10 гильдейских квестов',
    category: 'guild',
    rewardExp: 3000,
    condition: (state: any) => false // Требуется логика подсчёта выполненных квестов
  },
  {
    id: 'guild_quests_50',
    name: '🏆 Герой гильдии',
    description: 'Выполнить 50 гильдейских квестов',
    category: 'guild',
    rewardExp: 10000,
    condition: (state: any) => false
  },

  // --- УРОВНИ ---
  {
    id: 'level_15',
    name: '⭐ Уровень 15',
    description: 'Достичь 15 уровня',
    category: 'levels',
    rewardExp: 5000,
    condition: (state: any) => state.уровень >= 15
  },
  {
    id: 'level_25',
    name: '⭐⭐ Уровень 25',
    description: 'Достичь 25 уровня',
    category: 'levels',
    rewardExp: 15000,
    condition: (state: any) => state.уровень >= 25
  },
  {
    id: 'level_35',
    name: '⭐⭐⭐ Уровень 35',
    description: 'Достичь 35 уровня',
    category: 'levels',
    rewardExp: 35000,
    condition: (state: any) => state.уровень >= 35
  },
  {
    id: 'level_50',
    name: '👑 Уровень 50',
    description: 'Достичь 50 уровня',
    category: 'levels',
    rewardExp: 100000,
    condition: (state: any) => state.уровень >= 50
  },

  // --- КАЗИНО ---
  {
    id: 'first_bet',
    name: '🎰 Первая ставка',
    description: 'Сделать первую ставку в казино',
    category: 'casino',
    rewardExp: 100,
    condition: (state: any) => false // Требуется логика подсчёта ставок в казино
  },
  {
    id: 'jackpot',
    name: '🍀 Джекпот',
    description: 'Сорвать джекпот',
    category: 'casino',
    rewardExp: 10000,
    condition: (state: any) => false
  },

  // --- ЕЖЕДНЕВНЫЕ ---
  {
    id: 'week_streak',
    name: '📆 Неделя без перерыва',
    description: 'Заходить в игру 7 дней подряд',
    category: 'daily',
    rewardExp: 2000,
    condition: (state: any) => (state.статистика?.дниПодряд || 0) >= 7
  },
  {
    id: 'month_streak',
    name: '📆 Месяц без перерыва',
    description: 'Заходить в игру 30 дней подряд',
    category: 'daily',
    rewardExp: 10000,
    condition: (state: any) => (state.статистика?.дниПодряд || 0) >= 30
  },

  // --- РЕДКИЕ / СЕКРЕТНЫЕ ---
  {
    id: 'no_raid_streak',
    name: '🔥 Серия без рейда',
    description: 'Сделать 100 крафтов без рейда',
    category: 'random',
    rewardExp: 5000,
    condition: (state: any) => (state.статистика?.всегоКрафтовПодряд || 0) >= 100
  },
  {
    id: 'perfect_craft',
    name: '🤯 Идеальный крафт',
    description: 'Получить эффективность 150%',
    category: 'random',
    rewardExp: 1000,
    condition: (state: any) => false // Требуется логика отслеживания эффективности крафта
  },
  {
    id: 'all_achievements',
    name: '👑 Абсолютный чемпион',
    description: 'Получить все ачивки',
    category: 'common',
    rewardExp: 100000,
    condition: (state: any) => false // Требуется подсчёт общего количества ачивок
  }
]
