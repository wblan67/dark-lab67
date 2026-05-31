// ВСЕ ГЛИФЫ (50 штук)

export const GLYPHS = [
  // ========== ОБЫЧНЫЕ (15 шт) ==========
  { id: 'gniloy', name: 'Гнилой Глиф', rarity: 'common', description: 'Скорость варки +5%', effect: { type: 'speed', value: 5 } },
  { id: 'hnyanya', name: 'Х*йня-Глиф', rarity: 'common', description: 'Цена продажи +5%', effect: { type: 'profit', value: 5 } },
  { id: 'melkiy', name: 'Мелкий Глиф', rarity: 'common', description: 'Опыт +5%', effect: { type: 'exp', value: 5 } },
  { id: 'dyriaviy', name: 'Дырявый Глиф', rarity: 'common', description: 'Вместимость +5%', effect: { type: 'capacity', value: 5 } },
  { id: 'bomzhatskiy', name: 'Бомжатский Глиф', rarity: 'common', description: 'Скидка на ингредиенты -5%', effect: { type: 'cost', value: 5 } },
  { id: 'nevidimiy', name: 'Невидимый Глиф', rarity: 'common', description: 'Рост розыска -10%', effect: { type: 'wanted', value: 10 } },
  { id: 'slabiy', name: 'Слабый Глиф', rarity: 'common', description: 'Все бонусы +2%', effect: { type: 'all', value: 2 } },
  { id: 'pylniy', name: 'Пыльный Глиф', rarity: 'common', description: 'Скорость +4%, цена +4%', effect: { type: 'all', value: 4 } },
  { id: 'rzhaviy', name: 'Ржавый Глиф', rarity: 'common', description: 'Опыт +4%, вместимость +4%', effect: { type: 'all', value: 4 } },
  { id: 'bloshiniy', name: 'Блошиный Глиф', rarity: 'common', description: 'Скидка -4%, скрытность -8%', effect: { type: 'all', value: 4 } },
  { id: 'sopliviy', name: 'Сопливый Глиф', rarity: 'common', description: 'Скорость +6%', effect: { type: 'speed', value: 6 } },
  { id: 'drobyschiy', name: 'Дробящий Глиф', rarity: 'common', description: 'Цена +6%', effect: { type: 'profit', value: 6 } },
  { id: 'loh', name: 'Лох-Глиф', rarity: 'common', description: 'Опыт +6%', effect: { type: 'exp', value: 6 } },
  { id: 'puzyrchatiy', name: 'Пузырчатый Глиф', rarity: 'common', description: 'Вместимость +6%', effect: { type: 'capacity', value: 6 } },
  { id: 'tenevoy', name: 'Теневой Глиф', rarity: 'common', description: 'Скрытность -12%', effect: { type: 'wanted', value: 12 } },

  // ========== РЕДКИЕ (15 шт) ==========
  { id: 'serebryaniy', name: 'Серебряный Глиф', rarity: 'rare', description: 'Скорость варки +10%', effect: { type: 'speed', value: 10 } },
  { id: 'zolotoy', name: 'Золотой Глиф', rarity: 'rare', description: 'Цена продажи +10%', effect: { type: 'profit', value: 10 } },
  { id: 'umniy', name: 'Умный Глиф', rarity: 'rare', description: 'Опыт +10%', effect: { type: 'exp', value: 10 } },
  { id: 'prostorniy', name: 'Просторный Глиф', rarity: 'rare', description: 'Вместимость +10%', effect: { type: 'capacity', value: 10 } },
  { id: 'svoy', name: 'Свой-Глиф', rarity: 'rare', description: 'Скидка на ингредиенты -10%', effect: { type: 'cost', value: 10 } },
  { id: 'prizrachniy', name: 'Призрачный Глиф', rarity: 'rare', description: 'Рост розыска -20%', effect: { type: 'wanted', value: 20 } },
  { id: 'norm', name: 'Норм-Глиф', rarity: 'rare', description: 'Все бонусы +4%', effect: { type: 'all', value: 4 } },
  { id: 'dymniy', name: 'Дымный Глиф', rarity: 'rare', description: 'Скорость +8%, цена +8%', effect: { type: 'all', value: 8 } },
  { id: 'lunniy', name: 'Лунный Глиф', rarity: 'rare', description: 'Опыт +8%, вместимость +8%', effect: { type: 'all', value: 8 } },
  { id: 'hitrozhopiy', name: 'Хитрожопый Глиф', rarity: 'rare', description: 'Скидка -8%, скрытность -16%', effect: { type: 'all', value: 8 } },
  { id: 'volchiy', name: 'Волчий Глиф', rarity: 'rare', description: 'Скорость +12%', effect: { type: 'speed', value: 12 } },
  { id: 'lisiy', name: 'Лисий Глиф', rarity: 'rare', description: 'Цена +12%', effect: { type: 'profit', value: 12 } },
  { id: 'soviniy', name: 'Совиный Глиф', rarity: 'rare', description: 'Опыт +12%', effect: { type: 'exp', value: 12 } },
  { id: 'medvezhiy', name: 'Медвежий Глиф', rarity: 'rare', description: 'Вместимость +12%', effect: { type: 'capacity', value: 12 } },
  { id: 'piraniy', name: 'Пираньий Глиф', rarity: 'rare', description: 'Скрытность -24%', effect: { type: 'wanted', value: 24 } },

  // ========== ЭПИЧЕСКИЕ (8 шт) ==========
  { id: 'platinoviy', name: 'Платиновый Глиф', rarity: 'epic', description: 'Скорость варки +20%', effect: { type: 'speed', value: 20 } },
  { id: 'izumrudniy', name: 'Изумрудный Глиф', rarity: 'epic', description: 'Цена продажи +20%', effect: { type: 'profit', value: 20 } },
  { id: 'genialniy', name: 'Гениальный Глиф', rarity: 'epic', description: 'Опыт +20%', effect: { type: 'exp', value: 20 } },
  { id: 'gigantskiy', name: 'Гигантский Глиф', rarity: 'epic', description: 'Вместимость +20%', effect: { type: 'capacity', value: 20 } },
  { id: 'baryzhskiy', name: 'Барыжский Глиф', rarity: 'epic', description: 'Скидка на ингредиенты -20%', effect: { type: 'cost', value: 20 } },
  { id: 'nevidimka', name: 'Невидимка-Глиф', rarity: 'epic', description: 'Рост розыска -40%', effect: { type: 'wanted', value: 40 } },
  { id: 'kentavriy', name: 'Кентаврий Глиф', rarity: 'epic', description: 'Все бонусы +8%', effect: { type: 'all', value: 8 } },
  { id: 'feniksoviy', name: 'Фениксовый Глиф', rarity: 'epic', description: 'Скорость +15%, цена +15%', effect: { type: 'all', value: 15 } },

  // ========== ЛЕГЕНДАРНЫЕ (7 шт) ==========
  { id: 'drakoniy', name: 'Драконий Глиф', rarity: 'legendary', description: 'Скорость варки +35%', effect: { type: 'speed', value: 35 } },
  { id: 'brilliantoviy', name: 'Бриллиантовый Глиф', rarity: 'legendary', description: 'Цена продажи +35%', effect: { type: 'profit', value: 35 } },
  { id: 'megamozgiy', name: 'Мегамозгий Глиф', rarity: 'legendary', description: 'Опыт +35%', effect: { type: 'exp', value: 35 } },
  { id: 'titanoviy', name: 'Титановый Глиф', rarity: 'legendary', description: 'Вместимость +35%', effect: { type: 'capacity', value: 35 } },
  { id: 'magnatskiy', name: 'Магнатский Глиф', rarity: 'legendary', description: 'Скидка на ингредиенты -35%', effect: { type: 'cost', value: 35 } },
  { id: 'legendarniy', name: 'Легендарный Глиф', rarity: 'legendary', description: 'Рост розыска -70%', effect: { type: 'wanted', value: 70 } },
  { id: 'beskonechniy', name: 'Бесконечный Глиф', rarity: 'legendary', description: 'Все бонусы +15%', effect: { type: 'all', value: 15 } },

  // ========== МИФИЧЕСКИЕ (5 шт) ==========
  { id: 'almazniy', name: 'Алмазный Глиф', rarity: 'mythic', description: 'Скорость варки +60%', effect: { type: 'speed', value: 60 } },
  { id: 'valteroviy', name: 'Вальтеровый Глиф', rarity: 'mythic', description: 'Цена продажи +60%', effect: { type: 'profit', value: 60 } },
  { id: 'vovet_heavykie', name: 'Во-все-тяжкие-Глиф', rarity: 'mythic', description: 'Опыт +60%', effect: { type: 'exp', value: 60 } },
  { id: 'hayzenbergov', name: 'Хайзенбергов Глиф', rarity: 'mythic', description: 'Вместимость +60%', effect: { type: 'capacity', value: 60 } },
  { id: 'skazhi_moe_imya', name: 'Скажи-моё-имя-Глиф', rarity: 'mythic', description: 'Все бонусы +25% + осколок за варку', effect: { type: 'all', value: 25 }, unique: 'shardBonus' }
]

// Получить случайный глиф по редкости
export function getRandomGlyphByRarity(rarity) {
  const filtered = GLYPHS.filter(g => g.rarity === rarity)
  if (filtered.length === 0) return undefined
  const randomIndex = Math.floor(Math.random() * filtered.length)
  return filtered[randomIndex]
}

// Получить глиф по ID
export function getGlyphById(id) {
  return GLYPHS.find(g => g.id === id)
}