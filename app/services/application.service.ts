import { supabase } from '@/app/lib/supabase';
import type { Application } from '@/app/types/supabase';

/**
 * 申请服务类
 * 处理宠物领养申请相关的业务逻辑
 */
export class ApplicationService {
  /**
   * 获取申请列表
   * @param params 查询参数
   * @returns 申请列表和总数
   */
  static async getApplications(params: {
    petId?: string;
    applicantId?: string;
    publisherId?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ applications: Application[]; total: number }> {
    const { petId, applicantId, publisherId, status, page = 1, limit = 10 } = params;

    let query = supabase
      .from('applications')
      .select(`
        id, pet_id, applicant_id, publisher_id, status, message, created_at, updated_at,
        pets(name, breed, photos(photo_url))
      `, { count: 'exact' });

    // 应用筛选条件
    if (petId) {
      query = query.eq('pet_id', petId);
    }

    if (applicantId) {
      query = query.eq('applicant_id', applicantId);
    }

    if (publisherId) {
      query = query.eq('publisher_id', publisherId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // 分页和排序
    query = query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    const { data: applications, error, count } = await query;

    if (error) {
      console.error('获取申请列表失败:', error);
      return { applications: [], total: 0 };
    }

    return {
      applications: applications || [],
      total: count || 0
    };
  }

  /**
   * 根据ID获取申请
   * @param id 申请 ID
   * @returns 申请详情
   */
  static async getApplicationById(id: string): Promise<Application | null> {
    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        pets(name, breed, photos(photo_url)),
        users(name, email, phone)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('获取申请详情失败:', error);
      return null;
    }

    return application;
  }

  /**
 * 创建申请
 * @param applicationData 申请数据
 * @returns 创建的申请
 */
  static async createApplication(applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application | null> {
    const { data: application, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select('*')
      .single();

    if (error) {
      console.error('创建申请失败:', error);
      return null;
    }

    return application;
  }

  /**
   * 更新申请状态
   * @param id 申请 ID
   * @param status 状态
   * @returns 更新后的申请
   */
  static async updateApplicationStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Application | null> {
    const { data: application, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('更新申请状态失败:', error);
      return null;
    }

    // 如果状态为 approved，更新宠物状态为已领养
    if (status === 'approved') {
      await supabase
        .from('pets')
        .update({ status: 'adopted' })
        .eq('id', application.pet_id);
    }

    return application;
  }

  /**
   * 删除申请
   * @param id 申请 ID
   * @returns 是否删除成功
   */
  static async deleteApplication(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除申请失败:', error);
      return false;
    }

    return true;
  }

  /**
   * 检查申请是否存在
   * @param petId 宠物 ID
   * @param applicantId 申请人ID
   * @returns 是否存在
   */
  static async checkApplicationExists(petId: string, applicantId: string): Promise<boolean> {
    const { data: application, error } = await supabase
      .from('applications')
      .select('id')
      .eq('pet_id', petId)
      .eq('applicant_id', applicantId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('检查申请是否存在失败:', error);
      return false;
    }

    return !!application;
  }

  /**
   * 获取宠物的申请数量
   * @param petId 宠物 ID
   * @returns 申请数量
   */
  static async getApplicationCount(petId: string): Promise<number> {
    const { count, error } = await supabase
      .from('applications')
      .select('id', { count: 'exact' })
      .eq('pet_id', petId);

    if (error) {
      console.error('获取申请数量失败:', error);
      return 0;
    }

    return count || 0;
  }
}


