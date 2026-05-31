import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

const RECIPES: Record<string, any> = {
  krokodil: {
    name: '🐊 Крокодил',
    ingredients: { codeine_pills: 2, iodine: 3, red_phosphorus: 1 },
    time: 120,
    output: 6,
    level: 1,
    requiredEquipment: ['filter']
  },
  marijuana: {
    name: '🌿 Марихуана',
    ingredients: { cannabis_seeds: 1, soil: 1, fertilizer: 2 },
    time: 90,
    output: 5,
    level: 2,
    requiredEquipment: ['pot', 'growbox']
  },
  pcp: {
    name: '👻 PCP',
    ingredients: { piperidine: 2, cyclohexanone: 2, bromobenzene: 1 },
    time: 120,
    output: 7,
    level: 3,
    requiredEquipment: ['glass_flask', 'mixing_barrel']
  },
  amphetamine: {
    name: '⚡ Амфетамин',
    ingredients: { p2np: 1, methylamine: 1, hydrochloric_acid: 2 },
    time: 150,
    output: 5,
    level: 4,
    requiredEquipment: ['glass_flask', 'electric_stove']
  },
  meth: {
    name: '❄️ Метамфетамин',
    ingredients: { red_phosphorus: 2, iodine: 3, hydrochloric_acid: 2, acetone: 2 },
    time: 180,
    output: 4,
    level: 5,
    requiredEquipment: ['electric_stove', 'glass_flask']
  },
  mdma: {
    name: '💊 MDMA',
    ingredients: { safrole: 2, methylamine: 2, hydrochloric_acid: 3, acetone: 4 },
    time: 210,
    output: 5,
    level: 6,
    requiredEquipment: ['glass_flask', 'heating_mantle']
  },
  heroin: {
    name: '💉 Героин',
    ingredients: { raw_opium: 5, acetic_anhydride: 2, chloroform: 2 },
    time: 240,
    output: 3,
    level: 7,
    requiredEquipment: ['heating_mantle', 'condenser']
  },
  cocaine: {
    name: '⬜ Кокаин',
    ingredients: { coca_leaves: 8, gasoline: 4, acetone: 3 },
    time: 300,
    output: 2,
    level: 8,
    requiredEquipment: ['condenser', 'vacuum_pump']
  },
  blue_meth: {
    name: '💎 Голубой Мет',
    ingredients: { methylamine: 2, red_phosphorus: 2, iodine: 4, hydrochloric_acid: 3 },
    time: 360,
    output: 3,
    level: 9,
    requiredEquipment: ['vacuum_pump', 'chromatograph']
  },
  lsd: {
    name: '🧪 ЛСД',
    ingredients: { ergotamine: 3, diethylamine: 2, chloroform: 3, acetone: 5 },
    time: 480,
    output: 3,
    level: 10,
    requiredEquipment: ['chromatograph', 'condenser', 'vacuum_pump']
  }
}

export default function Craft() {
  const [, forceUpdate] = useState(0)
  const [завершениеАнимация, setЗавершениеАнимация] = useState(false)
  
  const инвентарь = useGameStore((state) => state.инвентарь || {})
  const оборудованиеИнстансы = useGameStore((state) => state.оборудованиеИнстансы) || {}
  const уровень = useGameStore((state) => state.уровень) || 1
  const активныйКрафт = useGameStore((state) => state.активныйКрафт)
  const начатьКрафтВStore = useGameStore((state) => state.начатьКрафтВStore)
  
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const завершитьКрафт = () => {
    if (!активныйКрафт) {
      alert('❌ Нет активной варки!')
      return
    }
    
    if (confirm('⚠️ Завершить варку сейчас? Вы получите готовый наркотик.')) {
      setЗавершениеАнимация(true)
      setTimeout(() => setЗавершениеАнимация(false), 1000)
      
      const { key, recipe } = активныйКрафт
      const store = useGameStore.getState()
      const текущийИнвентарь = store.инвентарь || {}
      const статистика = store.статистика || { всегоСварено: {} }
      
      const новыйИнвентарь = {
        ...текущийИнвентарь,
        [key]: (текущийИнвентарь[key] || 0) + recipe.output
      }
      
      const новаяСтатистика = {
        ...статистика,
        всегоСварено: {
          ...статистика.всегоСварено,
          [key]: (статистика.всегоСварено[key] || 0) + recipe.output
        }
      }
      
      useGameStore.setState({ 
        инвентарь: новыйИнвентарь,
        статистика: новаяСтатистика,
        активныйКрафт: null
      })
      
      alert(`✅ Варка завершена! +${recipe.output} грамм ${recipe.name}`)
    }
  }
  
  const начатьКрафт = async (key: string, recipe: any) => {
    if (активныйКрафт) {
      alert('⏳ Сначала довари текущий наркотик!')
      return
    }
    
    if (уровень < recipe.level) {
      alert(`❌ Нужен ${recipe.level} уровень! Сейчас у вас ${уровень} уровень`)
      return
    }
    
    for (const equip of recipe.requiredEquipment) {
      const instances = оборудованиеИнстансы[equip] || []
      if (instances.length === 0) {
        alert(`❌ Нет оборудования: ${equip}`)
        return
      }
    }
    
    for (const [ing, count] of Object.entries(recipe.ingredients)) {
      if ((инвентарь[ing] || 0) < (count as number)) {
        alert(`❌ Не хватает ${ing}! Нужно: ${count}, есть: ${инвентарь[ing] || 0}`)
        return
      }
    }
    
    const новыйИнвентарь = { ...инвентарь }
    for (const [ing, count] of Object.entries(recipe.ingredients)) {
      новыйИнвентарь[ing] = (новыйИнвентарь[ing] || 0) - (count as number)
      if (новыйИнвентарь[ing] === 0) delete новыйИнвентарь[ing]
    }
    useGameStore.setState({ инвентарь: новыйИнвентарь })
    
    начатьКрафтВStore(key, recipe)
  }
  
  const getTimeLeft = () => {
    if (!активныйКрафт) return 0
    return Math.max(0, Math.floor((активныйКрафт.времяОкончания - Date.now()) / 1000))
  }
  
  const форматВремени = (секунды: number) => {
    const мин = Math.floor(секунды / 60)
    const сек = секунды % 60
    if (мин === 0) return `${сек} сек`
    return `${мин} мин ${сек} сек`
  }
  
  const прогресс = () => {
    if (!активныйКрафт) return 0
    const время = активныйКрафт.recipe.time
    const прошло = время - getTimeLeft()
    return Math.min(100, Math.max(0, (прошло / время) * 100))
  }
  
  const hasEquipment = (equipList: string[]) => {
    for (const equip of equipList) {
      const instances = оборудованиеИнстансы[equip] || []
      if (instances.length === 0) return false
    }
    return true
  }
  
  return (
    <div className="p-4">
      <style>{`
        @keyframes bubble {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .bubble {
          animation: bubble 0.5s ease-out;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
      
      <h2 className="text-lg font-semibold mb-3">🔬 Лаборатория</h2>
      
      {активныйКрафт && (
        <div className={`bg-yellow-900/50 border border-yellow-500 rounded-lg p-3 mb-4 ${завершениеАнимация ? 'bubble' : ''}`}>
          <p className="text-yellow-400">⚙️ Варка: {активныйКрафт.recipe.name}</p>
          <p className="text-sm text-gray-400">Осталось: {форматВремени(getTimeLeft())}</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${прогресс()}%` }}
            />
          </div>
          <button
            onClick={завершитьКрафт}
            className="mt-2 w-full py-1 rounded bg-red-600 hover:bg-red-700 text-sm transition transform hover:scale-105"
          >
            🔥 Завершить варку
          </button>
        </div>
      )}
      
      <div className="space-y-3">
        {Object.entries(RECIPES).map(([key, recipe]) => {
          let hasIngredients = true
          for (const [ing, count] of Object.entries(recipe.ingredients)) {
            if ((инвентарь[ing] || 0) < (count as number)) {
              hasIngredients = false
              break
            }
          }
          
          const hasEq = hasEquipment(recipe.requiredEquipment)
          const canCraft = !активныйКрафт && уровень >= recipe.level && hasIngredients && hasEq
          
          return (
            <div key={key} className="bg-gray-800 p-3 rounded-lg transition hover:scale-102">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{recipe.name}</div>
                <div className="text-xs text-gray-500">Уровень {recipe.level}</div>
              </div>
              
              <div className="text-sm text-gray-400 mb-1">
                📦 Ингредиенты:
                {Object.entries(recipe.ingredients).map(([name, count]) => (
                  <div key={name} className="ml-2">
                    • {String(name).replace(/_/g, ' ')}: {String(count)} шт (есть: {инвентарь[name] || 0})
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-gray-400 mb-2">
                🔧 Нужно: {recipe.requiredEquipment.join(', ')}
                {hasEq ? ' ✅' : ' ❌'}
              </div>
              
              <div className="text-sm text-gray-400 mb-2">
                ⏱️ Время: {форматВремени(recipe.time)} | 📦 Выход: {recipe.output} г
              </div>
              
              <button
                onClick={() => начатьКрафт(key, recipe)}
                disabled={!canCraft}
                className={`w-full py-2 rounded font-semibold transition transform ${canCraft ? 'bg-purple-600 hover:bg-purple-700 hover:scale-105' : 'bg-gray-600 cursor-not-allowed'}`}
              >
                {активныйКрафт && '⏳ Варка...'}
                {!активныйКрафт && уровень < recipe.level && '🔒 Требуется уровень'}
                {!активныйКрафт && уровень >= recipe.level && !hasEq && '🔧 Нужно оборудование'}
                {!активныйКрафт && уровень >= recipe.level && hasEq && !hasIngredients && '❌ Нет ингредиентов'}
                {!активныйКрафт && уровень >= recipe.level && hasEq && hasIngredients && '🔬 Начать варку'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}