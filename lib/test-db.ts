import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    console.log('测试数据库连接...')

    const { data, error } = await supabase.from('users').select('count').limit(1)

    if (error) {
      console.error('数据库连接失败:', error)
      return false
    }

    console.log('数据库连接成功!')
    console.log('测试查询结果:', data)
    return true
  } catch (error) {
    console.error('数据库连接异常:', error)
    return false
  }
}

export async function testTables() {
  const tables = ['users', 'pets', 'pet_photos', 'applications', 'messages']
  const results: Record<string, boolean> = {}

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
      results[table] = !error
      console.log(`${table}: ${error ? '失败' : '成功'}`)
    } catch (error) {
      results[table] = false
      console.log(`${table}: 失败`)
    }
  }

  return results
}

export async function getDatabaseStats() {
  try {
    const [usersCount, petsCount, applicationsCount, messagesCount] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('pets').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
    ])

    return {
      users: usersCount.count || 0,
      pets: petsCount.count || 0,
      applications: applicationsCount.count || 0,
      messages: messagesCount.count || 0,
    }
  } catch (error) {
    console.error('获取数据库统计失败:', error)
    return null
  }
}
