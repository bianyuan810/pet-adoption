import 'dotenv/config'
import { testDatabaseConnection, testTables, getDatabaseStats } from '../lib/test-db'

async function main() {
  console.log('========================================')
  console.log('开始测试数据库连接...')
  console.log('========================================\n')

  console.log('环境变量检查:')
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '已设置' : '未设置'}`)
  console.log(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '已设置' : '未设置'}`)
  console.log()

  const connected = await testDatabaseConnection()

  if (!connected) {
    console.error('\n数据库连接失败，请检查环境变量配置')
    process.exit(1)
  }

  console.log('\n========================================')
  console.log('测试所有表...')
  console.log('========================================\n')

  const tableResults = await testTables()

  console.log('\n========================================')
  console.log('表测试结果:')
  console.log('========================================')
  for (const [table, success] of Object.entries(tableResults)) {
    console.log(`${table}: ${success ? '✅ 成功' : '❌ 失败'}`)
  }

  console.log('\n========================================')
  console.log('获取数据库统计...')
  console.log('========================================\n')

  const stats = await getDatabaseStats()

  if (stats) {
    console.log('数据库统计:')
    console.log(`- 用户数: ${stats.users}`)
    console.log(`- 宠物数: ${stats.pets}`)
    console.log(`- 申请数: ${stats.applications}`)
    console.log(`- 消息数: ${stats.messages}`)
  } else {
    console.error('获取数据库统计失败')
  }

  console.log('\n========================================')
  console.log('测试完成!')
  console.log('========================================')
}

main().catch(console.error)
