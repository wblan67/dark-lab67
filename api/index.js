// api/index.js
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(cors())
app.use(express.json())

// ПОДКЛЮЧЕНИЕ К SUPABASE (твои данные)
const supabaseUrl = 'https://glhvidkqpnknpmwdiae.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaHZpZGtxcG5rbnBtd2RpYWUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTY0MjQwMCwiZXhwIjoyMDUxMjE4NDAwfQ.ТВОЙ_КЛЮЧ'
const supabase = createClient(supabaseUrl, supabaseKey)

// ========== ПОЛУЧИТЬ ПРОФИЛЬ ==========
app.post('/api/profile', async (req, res) => {
  const { telegramId } = req.body
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', telegramId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    return res.json({ success: false, error: error.message })
  }
  
  if (!data) {
    // Создаём нового игрока
    const { data: newPlayer, error: createError } = await supabase
      .from('players')
      .insert({ id: telegramId, balance: 1500, level: 1 })
      .select()
      .single()
    
    if (createError) return res.json({ success: false, error: createError.message })
    return res.json({ success: true, player: newPlayer })
  }
  
  return res.json({ success: true, player: data })
})

// ========== ВАРКА НАРКОТИКА ==========
app.post('/api/craft', async (req, res) => {
  const { telegramId, drugKey, recipe } = req.body
  
  // Здесь логика варки (проверка ингредиентов, вычитание, добавление)
  // ...
  
  res.json({ success: true })
})

// ========== ПРОДАЖА ==========
app.post('/api/sell', async (req, res) => {
  // ...
})

// ========== ОТКРЫТЬ БОКС ==========
app.post('/api/openBox', async (req, res) => {
  // ...
})

// ЗАПУСК СЕРВЕРА
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API server running on port ${PORT}`))
