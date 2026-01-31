const { supabase } = require('./lib/supabase');

async function checkUser() {
  console.log('开始检查用户数据...');

  try {
    // 查询特定用户
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'user2@example.com')
      .single();

    if (error) {
      console.error('查询用户失败:', error);
      return;
    }

    if (!user) {
      console.log('用户不存在');
      return;
    }

    console.log('用户信息:', user);
    console.log('用户ID:', user.id);
    console.log('用户密码哈希:', user.password);

    // 查询该用户发布的宠物
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('*')
      .eq('publisher_id', user.id);

    if (petsError) {
      console.error('查询宠物失败:', petsError);
    } else {
      console.log('用户发布的宠物数量:', pets.length);
      if (pets.length > 0) {
        console.log('第一个宠物:', pets[0]);
      }
    }

    // 查询该用户收到的申请
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('*, pet:pet_id(*), applicant:applicant_id(*)')
      .eq('publisher_id', user.id);

    if (appsError) {
      console.error('查询申请失败:', appsError);
    } else {
      console.log('用户收到的申请数量:', applications.length);
      if (applications.length > 0) {
        console.log('第一个申请:', applications[0]);
      }
    }

  } catch (error) {
    console.error('检查用户数据失败:', error);
  }
}

checkUser();
