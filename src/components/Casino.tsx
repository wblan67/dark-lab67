import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

export default function Casino() {
  const [активнаяИгра, setАктивнаяИгра] = useState<'roulette' | 'dice' | 'blackjack' | 'slots'>('roulette')
  const [ставка, setСтавка] = useState(100)
  const [результат, setРезультат] = useState('')
  
  const баланс = useGameStore((state) => state.баланс)
  const статистика = useGameStore((state) => state.статистика)
  const setБаланс = (newBalance: number) => useGameStore.setState({ баланс: newBalance })
  const обновитьСтатистику = useGameStore((state) => state.обновитьСтатистику)

  // Функция для обновления счётчиков казино
  const обновитьСчётчикиКазино = (выигрыш: boolean) => {
    const currentStats = useGameStore.getState().статистика
    if (выигрыш) {
      useGameStore.setState({
        статистика: {
          ...currentStats,
          выиграновКазино: (currentStats?.выиграновКазино || 0) + 1
        }
      })
    } else {
      useGameStore.setState({
        статистика: {
          ...currentStats,
          проиграновКазино: (currentStats?.проиграновКазино || 0) + 1
        }
      })
    }
    обновитьСтатистику()
  }

  // ========== РУЛЕТКА ==========
  const [выбраннаяСтавка, setВыбраннаяСтавка] = useState<string>('red')
  
  const сыгратьВРулетку = () => {
    if (ставка > баланс) {
      setРезультат('❌ Не хватает денег!')
      return
    }
    
    const число = Math.floor(Math.random() * 37)
    const цвет = число === 0 ? 'zero' : (число % 2 === 0 ? 'black' : 'red')
    let выигрыш = 0
    let сообщение = `Выпало число ${число} (${цвет === 'zero' ? 'Зеро' : (цвет === 'red' ? 'Красное' : 'Чёрное')})\n`
    
    // Определяем ряд (1, 2 или 3)
    let ряд = 0
    if (число !== 0) {
      const остаток = число % 3
      if (остаток === 1) ряд = 1
      else if (остаток === 2) ряд = 2
      else if (остаток === 0) ряд = 3
    }
    
    // Определяем столбец (1-12)
    let столбец = 0
    if (число !== 0) {
      столбец = Math.floor((число - 1) / 3) + 1
    }
    
    // Обычные ставки
    if (выбраннаяСтавка === 'red' && цвет === 'red') выигрыш = ставка * 2
    else if (выбраннаяСтавка === 'black' && цвет === 'black') выигрыш = ставка * 2
    else if (выбраннаяСтавка === 'even' && число !== 0 && число % 2 === 0) выигрыш = ставка * 2
    else if (выбраннаяСтавка === 'odd' && число !== 0 && число % 2 === 1) выигрыш = ставка * 2
    else if (выбраннаяСтавка === '1-18' && число >= 1 && число <= 18) выигрыш = ставка * 2
    else if (выбраннаяСтавка === '19-36' && число >= 19 && число <= 36) выигрыш = ставка * 2
    else if (выбраннаяСтавка === '1st12' && число >= 1 && число <= 12) выигрыш = ставка * 3
    else if (выбраннаяСтавка === '2nd12' && число >= 13 && число <= 24) выигрыш = ставка * 3
    else if (выбраннаяСтавка === '3rd12' && число >= 25 && число <= 36) выигрыш = ставка * 3
    
    // РЯДЫ (x3)
    else if (выбраннаяСтавка === 'row1' && ряд === 1) выигрыш = ставка * 3
    else if (выбраннаяСтавка === 'row2' && ряд === 2) выигрыш = ставка * 3
    else if (выбраннаяСтавка === 'row3' && ряд === 3) выигрыш = ставка * 3
    
    // СТОЛБЦЫ (x12)
    else if (выбраннаяСтавка === 'col1' && столбец === 1) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col2' && столбец === 2) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col3' && столбец === 3) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col4' && столбец === 4) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col5' && столбец === 5) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col6' && столбец === 6) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col7' && столбец === 7) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col8' && столбец === 8) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col9' && столбец === 9) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col10' && столбец === 10) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col11' && столбец === 11) выигрыш = ставка * 12
    else if (выбраннаяСтавка === 'col12' && столбец === 12) выигрыш = ставка * 12
    
    else if (выбраннаяСтавка === 'zero' && число === 0) выигрыш = ставка * 36
    else if (выбраннаяСтавка === число.toString() && число !== 0) выигрыш = ставка * 36
    
    if (выигрыш > 0) {
      const новыйБаланс = баланс - ставка + выигрыш
      setБаланс(новыйБаланс)
      сообщение += `🎉 Вы выиграли $${выигрыш}!`
      обновитьСчётчикиКазино(true)
    } else {
      const новыйБаланс = баланс - ставка
      setБаланс(новыйБаланс)
      сообщение += `😞 Вы проиграли $${ставка}!`
      обновитьСчётчикиКазино(false)
    }
    
    setРезультат(сообщение)
  }

  // ========== КОСТИ ==========
  const сыгратьВКости = () => {
    if (ставка > баланс) {
      setРезультат('❌ Не хватает денег!')
      return
    }
    
    const число = Math.floor(Math.random() * 6) + 1
    let выигрыш = 0
    let сообщение = `Выпало число ${число}\n`
    
    if (выбраннаяСтавка === 'small' && число <= 3) выигрыш = ставка * 2
    else if (выбраннаяСтавка === 'big' && число >= 4) выигрыш = ставка * 2
    else if (выбраннаяСтавка === число.toString()) выигрыш = ставка * 6
    
    if (выигрыш > 0) {
      const новыйБаланс = баланс - ставка + выигрыш
      setБаланс(новыйБаланс)
      сообщение += `🎉 Вы выиграли $${выигрыш}!`
      обновитьСчётчикиКазино(true)
    } else {
      const новыйБаланс = баланс - ставка
      setБаланс(новыйБаланс)
      сообщение += `😞 Вы проиграли $${ставка}!`
      обновитьСчётчикиКазино(false)
    }
    
    setРезультат(сообщение)
  }

  // ========== СЛОТЫ ==========
  const сыгратьВСлоты = () => {
    if (ставка > баланс) {
      setРезультат('❌ Не хватает денег!')
      return
    }
    
    const getSymbol = () => {
      const rand = Math.random() * 100
      if (rand < 2) return '7️⃣'
      if (rand < 6) return 'BAR'
      if (rand < 10) return '🍋'
      if (rand < 14) return '🍒'
      if (rand < 24) return '⭐'
      if (rand < 34) return '🔔'
      if (rand < 44) return '💎'
      if (rand < 54) return '🎰'
      if (rand < 64) return '🍉'
      return '🍒'
    }
    
    const reel1 = getSymbol()
    const reel2 = getSymbol()
    const reel3 = getSymbol()
    
    let выигрыш = 0
    let сообщение = `${reel1} | ${reel2} | ${reel3}\n`
    
    if (reel1 === '7️⃣' && reel2 === '7️⃣' && reel3 === '7️⃣') {
      выигрыш = ставка * 36
      сообщение += `🎉 ДЖЕКПОТ! СЕМЁРКИ! x36! Вы выиграли $${выигрыш}!`
    }
    else if (reel1 === 'BAR' && reel2 === 'BAR' && reel3 === 'BAR') {
      выигрыш = ставка * 16
      сообщение += `🎉 BAR! BAR! BAR! x16! Вы выиграли $${выигрыш}!`
    }
    else if (reel1 === '🍋' && reel2 === '🍋' && reel3 === '🍋') {
      выигрыш = ставка * 16
      сообщение += `🎉 ТРИ ЛИМОНА! x16! Вы выиграли $${выигрыш}!`
    }
    else if (reel1 === '🍒' && reel2 === '🍒' && reel3 === '🍒') {
      выигрыш = ставка * 2
      сообщение += `🎉 ТРИ ВИШНИ! x2! Вы выиграли $${выигрыш}!`
    }
    else {
      выигрыш = 0
      сообщение += `😞 Вы проиграли $${ставка}!`
    }
    
    if (выигрыш > 0) {
      const новыйБаланс = баланс - ставка + выигрыш
      setБаланс(новыйБаланс)
      обновитьСчётчикиКазино(true)
    } else {
      const новыйБаланс = баланс - ставка
      setБаланс(новыйБаланс)
      обновитьСчётчикиКазино(false)
    }
    
    setРезультат(сообщение)
  }

  // ========== БЛЭКДЖЕК ==========
  const [колода, setКолода] = useState<string[]>([])
  const [игрокКарты, setИгрокКарты] = useState<string[]>([])
  const [дилерКарты, setДилерКарты] = useState<string[]>([])
  const [играНачата, setИграНачата] = useState(false)
  const [играЗакончена, setИграЗакончена] = useState(false)
  
  const создатьКолоду = () => {
    const масти = ['♥', '♦', '♣', '♠']
    const значения = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    const новаяКолода: string[] = []
    for (const масть of масти) {
      for (const значение of значения) {
        новаяКолода.push(`${значение}${масть}`)
      }
    }
    return новаяКолода.sort(() => Math.random() - 0.5)
  }
  
  const получитьОчки = (карты: string[]) => {
    let очки = 0
    let тузы = 0
    for (const карта of карты) {
      const значение = карта.slice(0, -1)
      if (значение === 'J' || значение === 'Q' || значение === 'K') очки += 10
      else if (значение === 'A') {
        тузы += 1
        очки += 11
      } else очки += parseInt(значение)
    }
    while (очки > 21 && тузы > 0) {
      очки -= 10
      тузы -= 1
    }
    return очки
  }
  
  const начатьБлэкджек = () => {
    if (ставка > баланс) {
      setРезультат('❌ Не хватает денег!')
      return
    }
    const новаяКолода = создатьКолоду()
    setКолода(новаяКолода)
    setИгрокКарты([новаяКолода[0], новаяКолода[2]])
    setДилерКарты([новаяКолода[1]])
    setИграНачата(true)
    setИграЗакончена(false)
    setРезультат('')
  }
  
  const взятьКарту = () => {
    const новаяКолода = [...колода]
    const следующаяКарта = новаяКолода[4]
    const новыеКарты = [...игрокКарты, следующаяКарта]
    setИгрокКарты(новыеКарты)
    setКолода(новаяКолода.slice(1))
    
    const новыеОчки = получитьОчки(новыеКарты)
    if (новыеОчки > 21) {
      const новыйБаланс = баланс - ставка
      setБаланс(новыйБаланс)
      setРезультат(`😞 У вас перебор (${новыеОчки})! Вы проиграли $${ставка}!`)
      setИграЗакончена(true)
      setИграНачата(false)
      обновитьСчётчикиКазино(false)
    }
  }
  
  const завершитьБлэкджек = () => {
    const игрокОчки = получитьОчки(игрокКарты)
    
    if (игрокОчки > 21) {
      const новыйБаланс = баланс - ставка
      setБаланс(новыйБаланс)
      setРезультат(`😞 У вас перебор (${игрокОчки})! Вы проиграли $${ставка}!`)
      setИграЗакончена(true)
      setИграНачата(false)
      обновитьСчётчикиКазино(false)
      return
    }
    
    let дилерКартыВсе = [...дилерКарты]
    let дилерОчки = получитьОчки(дилерКартыВсе)
    while (дилерОчки < 17) {
      const следующаяКарта = колода[дилерКартыВсе.length + 1]
      дилерКартыВсе.push(следующаяКарта)
      дилерОчки = получитьОчки(дилерКартыВсе)
    }
    setДилерКарты(дилерКартыВсе)
    
    let выигрыш = 0
    let сообщение = ''
    
    if (дилерОчки > 21) {
      выигрыш = ставка * 2
      сообщение = `🎉 Дилер перебрал (${дилерОчки})! Вы выиграли $${выигрыш}!`
      обновитьСчётчикиКазино(true)
    } else if (игрокОчки > дилерОчки) {
      выигрыш = ставка * 2
      сообщение = `🎉 Вы выиграли! (Ваши очки: ${игрокОчки}, Дилер: ${дилерОчки})`
      обновитьСчётчикиКазино(true)
    } else if (игрокОчки === дилерОчки) {
      выигрыш = ставка
      сообщение = `🤝 Ничья! Ваши деньги возвращены. (Ваши очки: ${игрокОчки}, Дилер: ${дилерОчки})`
    } else {
      выигрыш = 0
      сообщение = `😞 Вы проиграли! (Ваши очки: ${игрокОчки}, Дилер: ${дилерОчки})`
      обновитьСчётчикиКазино(false)
    }
    
    if (выигрыш > 0) {
      const новыйБаланс = баланс - ставка + выигрыш
      setБаланс(новыйБаланс)
    } else if (выигрыш === ставка) {
      const новыйБаланс = баланс
      setБаланс(новыйБаланс)
    } else {
      const новыйБаланс = баланс - ставка
      setБаланс(новыйБаланс)
    }
    
    setРезультат(сообщение)
    setИграЗакончена(true)
    setИграНачата(false)
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">🎰 Казино</h2>
      <div className="bg-gray-800 p-3 rounded-lg mb-4">
        <div className="text-yellow-400 text-xl font-bold">${баланс.toLocaleString()}</div>
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button onClick={() => setАктивнаяИгра('roulette')} className={`px-3 py-1 rounded ${активнаяИгра === 'roulette' ? 'bg-purple-600' : 'bg-gray-700'}`}>🎡 Рулетка</button>
        <button onClick={() => setАктивнаяИгра('dice')} className={`px-3 py-1 rounded ${активнаяИгра === 'dice' ? 'bg-purple-600' : 'bg-gray-700'}`}>🎲 Кости</button>
        <button onClick={() => setАктивнаяИгра('blackjack')} className={`px-3 py-1 rounded ${активнаяИгра === 'blackjack' ? 'bg-purple-600' : 'bg-gray-700'}`}>🃏 Блэкджек</button>
        <button onClick={() => setАктивнаяИгра('slots')} className={`px-3 py-1 rounded ${активнаяИгра === 'slots' ? 'bg-purple-600' : 'bg-gray-700'}`}>💰 Слоты</button>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex gap-2 mb-4">
          <input type="number" value={ставка} onChange={(e) => setСтавка(Number(e.target.value))} min={10} step={10} className="bg-gray-700 p-2 rounded w-32" />
          <span className="text-gray-400">Ставка (мин $10)</span>
        </div>
        
        {/* РУЛЕТКА */}
        {активнаяИгра === 'roulette' && (
          <div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={() => setВыбраннаяСтавка('red')} className={`py-2 rounded ${выбраннаяСтавка === 'red' ? 'bg-red-600' : 'bg-red-800'}`}>🔴 Красное (x2)</button>
              <button onClick={() => setВыбраннаяСтавка('black')} className={`py-2 rounded ${выбраннаяСтавка === 'black' ? 'bg-gray-600' : 'bg-gray-800'}`}>⚫ Чёрное (x2)</button>
              <button onClick={() => setВыбраннаяСтавка('even')} className={`py-2 rounded ${выбраннаяСтавка === 'even' ? 'bg-blue-600' : 'bg-blue-800'}`}>Чёт (x2)</button>
              <button onClick={() => setВыбраннаяСтавка('odd')} className={`py-2 rounded ${выбраннаяСтавка === 'odd' ? 'bg-blue-600' : 'bg-blue-800'}`}>Нечет (x2)</button>
              <button onClick={() => setВыбраннаяСтавка('1-18')} className={`py-2 rounded ${выбраннаяСтавка === '1-18' ? 'bg-green-600' : 'bg-green-800'}`}>1-18 (x2)</button>
              <button onClick={() => setВыбраннаяСтавка('19-36')} className={`py-2 rounded ${выбраннаяСтавка === '19-36' ? 'bg-green-600' : 'bg-green-800'}`}>19-36 (x2)</button>
              <button onClick={() => setВыбраннаяСтавка('1st12')} className={`py-2 rounded ${выбраннаяСтавка === '1st12' ? 'bg-yellow-600' : 'bg-yellow-800'}`}>1-12 (x3)</button>
              <button onClick={() => setВыбраннаяСтавка('2nd12')} className={`py-2 rounded ${выбраннаяСтавка === '2nd12' ? 'bg-yellow-600' : 'bg-yellow-800'}`}>13-24 (x3)</button>
              <button onClick={() => setВыбраннаяСтавка('3rd12')} className={`py-2 rounded ${выбраннаяСтавка === '3rd12' ? 'bg-yellow-600' : 'bg-yellow-800'}`}>25-36 (x3)</button>
              
              {/* РЯДЫ (x3) */}
              <button onClick={() => setВыбраннаяСтавка('row1')} className={`py-2 rounded ${выбраннаяСтавка === 'row1' ? 'bg-purple-600' : 'bg-purple-800'}`}>📊 Ряд 1 (x3)</button>
              <button onClick={() => setВыбраннаяСтавка('row2')} className={`py-2 rounded ${выбраннаяСтавка === 'row2' ? 'bg-purple-600' : 'bg-purple-800'}`}>📊 Ряд 2 (x3)</button>
              <button onClick={() => setВыбраннаяСтавка('row3')} className={`py-2 rounded ${выбраннаяСтавка === 'row3' ? 'bg-purple-600' : 'bg-purple-800'}`}>📊 Ряд 3 (x3)</button>
              
              <button onClick={() => setВыбраннаяСтавка('zero')} className={`col-span-3 py-2 rounded ${выбраннаяСтавка === 'zero' ? 'bg-green-600' : 'bg-green-800'}`}>🎯 Зеро (x36)</button>
            </div>
            
            {/* ВЫПАДАЮЩИЙ СПИСОК ДЛЯ СТОЛБЦОВ (x12) */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">📦 Столбцы (x12):</div>
              <select 
                value={выбраннаяСтавка.startsWith('col') ? выбраннаяСтавка : ''} 
                onChange={(e) => setВыбраннаяСтавка(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                <option value="">Выберите столбец</option>
                <option value="col1">Столб 1 (1,2,3)</option>
                <option value="col2">Столб 2 (4,5,6)</option>
                <option value="col3">Столб 3 (7,8,9)</option>
                <option value="col4">Столб 4 (10,11,12)</option>
                <option value="col5">Столб 5 (13,14,15)</option>
                <option value="col6">Столб 6 (16,17,18)</option>
                <option value="col7">Столб 7 (19,20,21)</option>
                <option value="col8">Столб 8 (22,23,24)</option>
                <option value="col9">Столб 9 (25,26,27)</option>
                <option value="col10">Столб 10 (28,29,30)</option>
                <option value="col11">Столб 11 (31,32,33)</option>
                <option value="col12">Столб 12 (34,35,36)</option>
              </select>
            </div>
            
            {/* ВЫПАДАЮЩИЙ СПИСОК ДЛЯ ЧИСЕЛ (x36) */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">🔢 Конкретное число (x36):</div>
              <select 
                value={выбраннаяСтавка.match(/^\d+$/) ? выбраннаяСтавка : ''} 
                onChange={(e) => setВыбраннаяСтавка(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                <option value="">Выберите число</option>
                {[...Array(36).keys()].map(i => i + 1).map(num => (
                  <option key={num} value={num.toString()}>Число {num}</option>
                ))}
              </select>
            </div>
            
            <button onClick={сыгратьВРулетку} className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700">Сделать ставку</button>
          </div>
        )}
        
        {/* КОСТИ */}
        {активнаяИгра === 'dice' && (
          <div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => setВыбраннаяСтавка('small')} className={`py-2 rounded ${выбраннаяСтавка === 'small' ? 'bg-blue-600' : 'bg-blue-800'}`}>🎲 Мал (1-3) x2</button>
              <button onClick={() => setВыбраннаяСтавка('big')} className={`py-2 rounded ${выбраннаяСтавка === 'big' ? 'bg-blue-600' : 'bg-blue-800'}`}>🎲 Бол (4-6) x2</button>
              {[1,2,3,4,5,6].map(num => (
                <button key={num} onClick={() => setВыбраннаяСтавка(num.toString())} className={`py-2 rounded ${выбраннаяСтавка === num.toString() ? 'bg-yellow-600' : 'bg-yellow-800'}`}>Число {num} (x6)</button>
              ))}
            </div>
            <button onClick={сыгратьВКости} className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700">Сделать ставку</button>
          </div>
        )}
        
        {/* СЛОТЫ */}
        {активнаяИгра === 'slots' && (
          <div>
            <div className="text-center text-4xl mb-4">
              🎰 Слоты | 🍒 x2 | 🍋 x16 | BAR x16 | 7️⃣ x36
            </div>
            <button onClick={сыгратьВСлоты} className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700">Крутить</button>
          </div>
        )}
        
        {/* БЛЭКДЖЕК */}
        {активнаяИгра === 'blackjack' && (
          <div>
            {!играНачата ? (
              <button onClick={начатьБлэкджек} className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700">Начать игру</button>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="text-gray-400">Дилер:</div>
                  <div className="text-xl">{дилерКарты.map((c, i) => <span key={i} className="mr-2">{c}</span>)}</div>
                  <div className="text-sm text-yellow-400">Очки дилера: {играЗакончена ? получитьОчки(дилерКарты) : '?'}</div>
                  <div className="mt-2 text-gray-400">Ваши карты:</div>
                  <div className="text-xl">{игрокКарты.map((c, i) => <span key={i} className="mr-2">{c}</span>)}</div>
                  <div className="text-sm text-yellow-400">Ваши очки: {получитьОчки(игрокКарты)}</div>
                </div>
                {!играЗакончена ? (
                  <div className="flex gap-2">
                    <button onClick={взятьКарту} className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700">Взять карту</button>
                    <button onClick={завершитьБлэкджек} className="flex-1 py-2 rounded bg-red-600 hover:bg-red-700">Остановиться</button>
                  </div>
                ) : (
                  <button onClick={начатьБлэкджек} className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700">Сыграть ещё</button>
                )}
              </div>
            )}
          </div>
        )}
        
        {результат && (
          <div className="mt-4 p-3 bg-gray-700 rounded whitespace-pre-line">{результат}</div>
        )}
      </div>
    </div>
  )
}
