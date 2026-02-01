import { supabase } from '@/app/lib/supabase';
import type { User } from '@/app/types/supabase';

/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 */
export class UserService {
  /**
   * 根据ID获取用户
   * @param id 用户 ID
   * @returns 用户信息
   */
  static async getUserById(id: string): Promise<User | null> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('获取用户失败:', error);
      return null;
    }

    return user;
  }

  /**
   * 根据邮箱获取用户
   * @param email 用户邮箱
   * @returns 用户信息
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('根据邮箱获取用户失败:', error);
      return null;
    }

    return user;
  }

  /**
   * 创建用户
   * @param userData 用户数据
   * @returns 创建的用户
   */
  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    const { data: user, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('创建用户失败:', error);
      return null;
    }

    return user;
  }

  /**
   * 更新用户
   * @param id 用户 ID
   * @param userData 用户数据
   * @returns 更新后的用户
   */
  static async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const { data: user, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新用户失败:', error);
      return null;
    }

    return user;
  }

  /**
   * 修改密码
   * @param id 用户 ID
   * @param newPassword 新密码
   * @returns 是否修改成功
   */
  static async changePassword(id: string, newPassword: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('id', id);

    if (error) {
      console.error('修改密码失败:', error);
      return false;
    }

    return true;
  }

  /**
   * 删除用户
   * @param id 用户 ID
   * @returns 是否删除成功
   */
  static async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除用户失败:', error);
      return false;
    }

    return true;
  }

  /**
   * 获取用户列表
   * @param params 查询参数
   * @returns 用户列表和总数
   */
  static async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 10, search } = params;

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    // 添加搜索条件
    if (search) {
      const searchPattern = `%${search}%`;
      query = query.or(`name.ilike.${searchPattern},email.ilike.${searchPattern}`);
    }

    // 添加分页
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('获取用户列表失败:', error);
      return { users: [], total: 0 };
    }

    return {
      users: users || [],
      total: count || 0
    };
  }
}


