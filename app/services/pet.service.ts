import { supabase, supabaseAdmin } from '@/app/lib/supabase';
import type { Pet, PetPhoto } from '@/app/types/supabase';
import { petLogger } from '@/app/lib';

/**
 * 宠物服务类
 * 处理宠物相关的业务逻辑
 */
export class PetService {
  /**
   * 获取宠物列表
   * @param params 查询参数
   * @returns 宠物列表和总数
   */
  static async getPets(params: {
    keyword?: string;
    breed?: string;
    age?: string;
    gender?: string;
    location?: string;
    status?: string;
    sortBy?: string;
    limit?: number;
    isPublisher?: boolean;
    publisherId?: string;
    page?: number;
  } = {}): Promise<{ pets: Pet[]; total: number }> {
    const {
      keyword,
      breed,
      age,
      gender,
      location,
      status,
      sortBy = 'newest',
      limit = 10,
      isPublisher = false,
      publisherId,
      page = 1
    } = params;

    // 构建查询
    let query = supabase
      .from('pets')
      .select(`
        id, name, breed, age, gender, location, status, description, vaccine_status, dewormed, sterilized, view_count, publisher_id, created_at, updated_at
      `, { count: 'exact' });

    // 只显示发布者自己的宠物
    if (isPublisher && publisherId) {
      query = query.eq('publisher_id', publisherId);
    }

    // 应用筛选条件
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sortBy === 'age_asc') {
      query = query.order('age', { ascending: true });
    } else if (sortBy === 'age_desc') {
      query = query.order('age', { ascending: false });
    } else if (sortBy === 'most_viewed') {
      query = query.order('view_count', { ascending: false });
    }

    // 计算偏移量
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // 关键词搜索
    if (keyword) {
      const keywordPattern = `%${keyword}%`;
      query = query.or(`name.ilike.${keywordPattern},breed.ilike.${keywordPattern}`);
    }

    // 筛选条件
    if (breed) {
      query = query.eq('breed', breed);
    }
    
    if (age) {
      // 根据年龄范围筛选
      if (age === '0-1岁') {
        query = query.lt('age', 1);
      } else if (age === '1-3岁') {
        query = query.gte('age', 1).lte('age', 3);
      } else if (age === '3-5岁') {
        query = query.gte('age', 3).lte('age', 5);
      } else if (age === '5岁以上') {
        query = query.gt('age', 5);
      }
    }
    
    if (gender) {
      // 性别映射
      const genderMap: Record<string, 'male' | 'female' | 'unknown'> = {
        '公': 'male',
        '母': 'female',
        '未知': 'unknown'
      };
      const mappedGender = genderMap[gender];
      if (mappedGender) {
        query = query.eq('gender', mappedGender);
      }
    }
    
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    
    // 状态过滤
    if (status) {
      query = query.eq('status', status);
    }

    // 执行查询
    const { data: pets, error, count } = await query;

    if (error) {
      petLogger.error('获取宠物列表失败:', error);
      return { pets: [], total: 0 };
    }

    return {
      pets: pets || [],
      total: count || 0
    };
  }

  /**
   * 根据ID获取宠物
   * @param id 宠物 ID
   * @returns 宠物详情
   */
  static async getPetById(id: string): Promise<Pet | null> {
    const { data: pet, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      petLogger.error('获取宠物详情失败:', error);
      return null;
    }

    return pet;
  }

  /**
   * 创建宠物
   * @param petData 宠物数据
   * @param publisherId 发布者ID
   * @returns 创建的宠物
   */
  static async createPet(petData: Omit<Pet, 'id' | 'created_at' | 'updated_at' | 'publisher_id' | 'view_count'>, publisherId: string): Promise<Pet | null> {
    const { data: pet, error } = await supabase
      .from('pets')
      .insert({
        ...petData,
        publisher_id: publisherId,
        view_count: 0
      })
      .select('*')
      .single();

    if (error) {
      petLogger.error('创建宠物失败:', error);
      return null;
    }

    return pet;
  }

  /**
   * 更新宠物
   * @param id 宠物 ID
   * @param petData 宠物数据
   * @returns 更新后的宠物
   */
  static async updatePet(id: string, petData: Partial<Pet>): Promise<Pet | null> {
    const { data: pet, error } = await supabase
      .from('pets')
      .update(petData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      petLogger.error('更新宠物失败:', error);
      return null;
    }

    return pet;
  }

  /**
   * 删除宠物
   * @param id 宠物 ID
   * @returns 是否删除成功
   */
  static async deletePet(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) {
      petLogger.error('删除宠物失败:', error);
      return false;
    }

    return true;
  }

  /**
   * 增加浏览次数
   * @param id 宠物 ID
   * @returns 是否增加成功
   */
  static async incrementViewCount(id: string): Promise<boolean> {
    // 获取当前浏览次数
    const { data: pet, error: getError } = await supabase
      .from('pets')
      .select('view_count')
      .eq('id', id)
      .single();

    if (getError) {
        petLogger.error('获取浏览次数失败:', getError);
        return false;
      }

    // 更新浏览次数
    const { error: updateError } = await supabase
      .from('pets')
      .update({ view_count: (pet.view_count || 0) + 1 })
      .eq('id', id);

    if (updateError) {
        petLogger.error('更新浏览次数失败:', updateError);
        return false;
      }

    return true;
  }

  /**
   * 上传宠物照片
   * @param petId 宠物 ID
   * @param file 照片文件
   * @param isPrimary 是否为主照片
   * @returns 上传的照片
   */
  static async uploadPetPhoto(petId: string, file: File, isPrimary: boolean = false): Promise<PetPhoto | null> {
    try {
      // 生成文件名
      const fileName = `${petId}_${Date.now()}_${file.name}`;
      
      // 上传文件到存储
      if (!supabaseAdmin) {
        petLogger.error('上传文件失败: 管理员客户端未初始化');
        return null;
      }

      const { error: uploadError } = await supabaseAdmin.storage
        .from('pet-photos')
        .upload(fileName, file);

      if (uploadError) {
        petLogger.error('上传文件失败:', uploadError);
        return null;
      }

      // 获取照片URL
      const photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-photos/${fileName}`;

      // 保存照片信息到数据库
      const { data: photo, error: insertError } = await supabase
        .from('pet_photos')
        .insert({
          pet_id: petId,
          photo_url: photoUrl,
          is_primary: isPrimary
        })
        .select('*')
        .single();

      if (insertError) {
        petLogger.error('保存照片信息失败:', insertError);
        return null;
      }

      return photo;
    } catch (error) {
      petLogger.error('上传照片失败:', error);
      return null;
    }
  }

  /**
   * 获取宠物照片
   * @param petId 宠物 ID
   * @returns 宠物照片列表
   */
  static async getPetPhotos(petId: string): Promise<PetPhoto[]> {
    const { data: photos, error } = await supabase
      .from('pet_photos')
      .select('*')
      .eq('pet_id', petId)
      .order('is_primary', { ascending: false });

    if (error) {
      petLogger.error('获取宠物照片失败:', error);
      return [];
    }

    return photos || [];
  }
}


