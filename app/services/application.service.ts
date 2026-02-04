import { supabaseAdmin } from '@/app/lib/supabase';
import type { Application } from '@/app/types/supabase';

// 宠物照片类型
interface PetPhoto {
  photo_url: string;
}

// 带照片的宠物类型
interface PetWithPhotos {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  location: string;
  status: string;
  pet_photos?: PetPhoto[];
}

// 用户类型
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

// 申请创建数据类型
interface ApplicationCreateData {
  pet_id: string;
  applicant_id: string;
  publisher_id: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
}

// 原始申请数据类型（从数据库返回）
interface RawApplication {
  id: string;
  pet_id: string;
  applicant_id: string;
  publisher_id: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  pets?: {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: string;
    location: string;
    status: string;
    pet_photos?: {
      photo_url: string;
    }[];
  } | null;
  applicant?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  } | null;
  publisher?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  } | null;
}

// 格式化后的申请类型
interface FormattedApplication {
  id: string;
  pet_id: string;
  applicant_id: string;
  publisher_id: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  pet: {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: string;
    location: string;
    status: string;
    photos: string[];
  } | null;
  applicant: User | null;
  publisher: User | null;
  pets?: undefined;
  applicants?: undefined;
  publishers?: undefined;
}

// 申请列表查询返回类型
interface ApplicationsQueryResult {
  data: RawApplication[] | null;
  error: unknown;
  count: number | null;
}

// 申请详情查询返回类型
interface ApplicationQueryResult {
  data: RawApplication | null;
  error: unknown;
}

// 单个申请操作返回类型
interface ApplicationOperationResult {
  data: Application | null;
  error: unknown;
}

// 删除操作返回类型
interface DeleteOperationResult {
  error: unknown;
}

// 定义带有 code 属性的错误类型
interface ErrorWithCode {
  code: string;
}

// 检查申请存在性查询返回类型
interface CheckApplicationExistsResult {
  data: { id: string } | null;
  error: unknown;
}

// 申请数量查询返回类型
interface ApplicationCountResult {
  count: number | null;
  error: unknown;
}

// 宠物查询返回类型
interface PetQueryResult {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  location: string;
  status: string;
  pet_photos?: { photo_url: string }[];
}

// 用户查询返回类型
interface UserQueryResult {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

// 宠物状态更新操作返回类型
interface PetUpdateResult {
  error: unknown;
}

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
  } = {}): Promise<{ applications: FormattedApplication[]; total: number }> {
    const { petId, applicantId, publisherId, status, page = 1, limit = 10 } = params;

    // 使用正确的关联查询，获取宠物和用户数据
    let query = supabaseAdmin!
      .from('applications')
      .select(`
        id, pet_id, applicant_id, publisher_id, status, message, created_at, updated_at
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

    const { data: applications, error, count } = await query as ApplicationsQueryResult;

    if (error) {
      return { applications: [], total: 0 };
    }

    // 定义宠物查询返回类型
    interface PetQueryResult {
      id: string;
      name: string;
      breed: string;
      age: number;
      gender: string;
      location: string;
      status: string;
      pet_photos?: { photo_url: string }[];
    }

    // 定义用户查询返回类型
    interface UserQueryResult {
      id: string;
      name: string;
      email: string;
      avatar_url?: string;
    }

    // 转换数据结构以匹配前端期望
    const formattedApplications = await Promise.all((applications || []).map(async (app: RawApplication) => {
      // 获取宠物数据
      let petData = null;
      try {
        const { data: pet } = await (supabaseAdmin!
          .from('pets') as unknown as {
            select: (columns: string) => {
              eq: (column: string, value: string) => {
                single: () => Promise<{ data: PetQueryResult | null }>;
              };
            };
          })
          .select('id, name, breed, age, gender, location, status, pet_photos(photo_url)')
          .eq('id', app.pet_id)
          .single();
        
        if (pet) {
          petData = {
            id: pet.id,
            name: pet.name,
            breed: pet.breed,
            age: pet.age,
            gender: pet.gender,
            location: pet.location,
            status: pet.status,
            photos: pet.pet_photos && Array.isArray(pet.pet_photos) ? pet.pet_photos.map((photo: { photo_url: string }) => photo.photo_url) : []
          };
        }
      } catch {
        // 忽略错误，继续处理
      }

      // 获取申请人数据
      let applicantData = null;
      try {
        const { data: applicant } = await (supabaseAdmin!
          .from('users') as unknown as {
            select: (columns: string) => {
              eq: (column: string, value: string) => {
                single: () => Promise<{ data: UserQueryResult | null }>;
              };
            };
          })
          .select('id, name, email, avatar_url')
          .eq('id', app.applicant_id)
          .single();
        applicantData = applicant || null;
      } catch {
        // 忽略错误，继续处理
      }

      // 获取发布者数据
      let publisherData = null;
      try {
        const { data: publisher } = await (supabaseAdmin!
          .from('users') as unknown as {
            select: (columns: string) => {
              eq: (column: string, value: string) => {
                single: () => Promise<{ data: UserQueryResult | null }>;
              };
            };
          })
          .select('id, name, email, avatar_url')
          .eq('id', app.publisher_id)
          .single();
        publisherData = publisher || null;
      } catch {
        // 忽略错误，继续处理
      }

      return {
        id: app.id,
        pet_id: app.pet_id,
        applicant_id: app.applicant_id,
        publisher_id: app.publisher_id,
        message: app.message,
        status: app.status,
        created_at: app.created_at,
        updated_at: app.updated_at,
        pet: petData,
        applicant: applicantData,
        publisher: publisherData
      };
    }));

    return {
      applications: formattedApplications,
      total: count || 0
    };
  }

  /**
   * 根据ID获取申请
   * @param id 申请 ID
   * @returns 申请详情
   */
  static async getApplicationById(id: string): Promise<FormattedApplication | null> {
    // 先获取基本申请数据
    const { data: app, error } = await (supabaseAdmin!
      .from('applications') as unknown as {
        select: (columns: string) => {
          eq: (column: string, value: string) => {
            single: () => Promise<{ data: RawApplication | null; error: unknown }>;
          };
        };
      })
      .select('id, pet_id, applicant_id, publisher_id, status, message, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !app) {
      return null;
    }

    // 获取宠物数据
    let petData = null;
    try {
      const { data: pet } = await (supabaseAdmin!
        .from('pets') as unknown as {
          select: (columns: string) => {
            eq: (column: string, value: string) => {
              single: () => Promise<{ data: PetQueryResult | null }>;
            };
          };
        })
        .select('id, name, breed, age, gender, location, status, pet_photos(photo_url)')
        .eq('id', app.pet_id)
        .single();
      
      if (pet) {
        petData = {
          id: pet.id,
          name: pet.name,
          breed: pet.breed,
          age: pet.age,
          gender: pet.gender,
          location: pet.location,
          status: pet.status,
          photos: pet.pet_photos && Array.isArray(pet.pet_photos) ? pet.pet_photos.map((photo: { photo_url: string }) => photo.photo_url) : []
        };
      }
    } catch {
      // 忽略错误，继续处理
    }

    // 获取申请人数据
    let applicantData = null;
    try {
      const { data: applicant } = await (supabaseAdmin!
        .from('users') as unknown as {
          select: (columns: string) => {
            eq: (column: string, value: string) => {
              single: () => Promise<{ data: UserQueryResult | null }>;
            };
          };
        })
        .select('id, name, email, avatar_url')
        .eq('id', app.applicant_id)
        .single();
      applicantData = applicant || null;
    } catch {
      // 忽略错误，继续处理
    }

    // 获取发布者数据
    let publisherData = null;
    try {
      const { data: publisher } = await (supabaseAdmin!
        .from('users') as unknown as {
          select: (columns: string) => {
            eq: (column: string, value: string) => {
              single: () => Promise<{ data: UserQueryResult | null }>;
            };
          };
        })
        .select('id, name, email, avatar_url')
        .eq('id', app.publisher_id)
        .single();
      publisherData = publisher || null;
    } catch {
      // 忽略错误，继续处理
    }

    // 转换数据结构以匹配前端期望
    return {
      id: app.id,
      pet_id: app.pet_id,
      applicant_id: app.applicant_id,
      publisher_id: app.publisher_id,
      message: app.message,
      status: app.status,
      created_at: app.created_at,
      updated_at: app.updated_at,
      pet: petData,
      applicant: applicantData,
      publisher: publisherData
    };
  }

  /**
 * 创建申请
 * @param applicationData 申请数据
 * @returns 创建的申请
 */
  static async createApplication(applicationData: ApplicationCreateData): Promise<Application | null> {
    // 使用类型断言来解决 insert 方法的类型问题
    const { data: application, error } = await (supabaseAdmin!
      .from('applications') as unknown as {
        insert: (data: ApplicationCreateData) => {
          select: (columns: string) => {
            single: () => Promise<ApplicationOperationResult>;
          };
        };
      })
      .insert(applicationData)
      .select('*')
      .single();

    if (error) {
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
    // 使用类型断言来解决 update 方法的类型问题
    const { data: application, error } = await (supabaseAdmin!
      .from('applications') as unknown as {
        update: (data: { status: 'pending' | 'approved' | 'rejected' }) => {
          eq: (column: string, value: string) => {
            select: (columns: string) => {
              single: () => Promise<ApplicationOperationResult>;
            };
          };
        };
      })
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return null;
    }

    // 如果状态为 approved，更新宠物状态为已领养
    if (status === 'approved' && application) {
      const { error: petError } = await (supabaseAdmin!
        .from('pets') as unknown as {
          update: (data: { status: 'adopted' }) => {
            eq: (column: string, value: string) => Promise<PetUpdateResult>;
          };
        })
        .update({ status: 'adopted' })
        .eq('id', application.pet_id);
      
      // 忽略错误，继续返回申请
    }

    return application;
  }

  /**
   * 删除申请
   * @param id 申请 ID
   * @returns 是否删除成功
   */
  static async deleteApplication(id: string): Promise<boolean> {
    // 使用类型断言来解决 delete 方法的类型问题
    const { error } = await (supabaseAdmin!
      .from('applications') as unknown as {
        delete: () => {
          eq: (column: string, value: string) => Promise<DeleteOperationResult>;
        };
      })
      .delete()
      .eq('id', id);

    if (error) {
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
    // 使用类型断言来解决 select 方法的类型问题
    const { data: application, error } = await (supabaseAdmin!
      .from('applications') as unknown as {
        select: (columns: string) => {
          eq: (column: string, value: string) => {
            eq: (column: string, value: string) => {
              single: () => Promise<CheckApplicationExistsResult>;
            };
          };
        };
      })
      .select('id')
      .eq('pet_id', petId)
      .eq('applicant_id', applicantId)
      .single();

    if (error && (error as ErrorWithCode).code !== 'PGRST116') {
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
    // 使用类型断言来解决 select 方法的类型问题
    const { count, error } = await (supabaseAdmin!
      .from('applications') as unknown as {
        select: (columns: string, options: { count: 'exact' }) => {
          eq: (column: string, value: string) => Promise<ApplicationCountResult>;
        };
      })
      .select('id', { count: 'exact' })
      .eq('pet_id', petId);

    if (error) {
      return 0;
    }

    return count || 0;
  }
}


