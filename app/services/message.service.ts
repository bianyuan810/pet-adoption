import { supabase, supabaseAdmin } from '@/app/lib/supabase';
import type { Message } from '@/app/types/supabase';

// 确定使用哪个 Supabase 客户端
const client = typeof window === 'undefined' && supabaseAdmin ? supabaseAdmin : supabase;

// 消息扩展类型，包含发送者和接收者信息
export interface MessageWithSender extends Message {
  sender: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  } | null;
  receiver: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  } | null;
}

/**
 * 消息服务类
 * 处理系统消息和通知相关的业务逻辑
 */
export class MessageService {
  /**
   * 获取消息列表
   * @param params 查询参数
   * @returns 消息列表和总数
   */
  static async getMessages(params: {
    senderId: string;
    isRead?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ messages: MessageWithSender[]; total: number }> {
    const { senderId, isRead, page = 1, limit = 10 } = params;

    try {
      // 使用 SQL 形式的查询（等效于上面的 Supabase 查询）
    
      
      // 使用外键约束进行关联查询，同时关联发送者和接收者信息
      let query = client
        .from('messages')
        .select('*, sender:users!messages_sender_id_fkey(id, name, email, avatar_url), receiver:users!messages_receiver_id_fkey(id, name, email, avatar_url)', { count: 'exact' })
        .eq('receiver_id', senderId);

      // 应用筛选条件
      if (isRead !== undefined) {
        query = query.eq('is_read', isRead);
      }

      // 分页和排序
      query = query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      const { data: messages, error, count } = await query;

      if (error) {
        console.error('获取消息列表失败:', error);
        return { messages: [], total: 0 };
      }

      if (!messages || messages.length === 0) {
        return { messages: [], total: count || 0 };
      }

      // 处理消息，添加接收者信息
      const messagesWithSender = messages.map(msg => ({
        ...msg,
        receiver: msg.receiver || null
      }));

      return {
        messages: messagesWithSender,
        total: count || 0
      };
    } catch (error) {
      console.error('获取消息列表异常:', error);
      return { messages: [], total: 0 };
    }
  }

  /**
   * 获取未读消息数量
   * @param receiverId 接收者ID
   * @returns 未读消息数量
   */
  static async getUnreadMessageCount(receiverId: string): Promise<number> {
    const { count, error } = await client
      .from('messages')
      .select('id', { count: 'exact' })
      .eq('receiver_id', receiverId)
      .eq('is_read', false);

    if (error) {
      console.error('获取未读消息数量失败:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * 创建消息
   * @param messageData 消息数据
   * @returns 创建的消息
   */
  static async createMessage(messageData: Omit<Message, 'id' | 'created_at' | 'is_read'>): Promise<Message | null> {
    const { data: message, error } = await client
      .from('messages')
      .insert({
        ...messageData,
        is_read: false
      })
      .select('*')
      .single();

    if (error) {
      console.error('创建消息失败:', error);
      return null;
    }

    return message;
  }

  /**
   * 标记消息为已读
   * @param id 消息 ID
   * @returns 是否标记成功
   */
  static async markMessageAsRead(id: string): Promise<boolean> {
    const { error } = await client
      .from('messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('标记消息为已读失败:', error);
      return false;
    }

    return true;
  }

  /**
   * 标记所有消息为已读
   * @param receiverId 接收者ID
   * @returns 是否标记成功
   */
  static async markAllMessagesAsRead(receiverId: string): Promise<boolean> {
    const { error } = await client
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', receiverId)
      .eq('is_read', false);

    if (error) {
      console.error('标记所有消息为已读失败:', error);
      return false;
    }

    return true;
  }

  /**
   * 删除消息
   * @param id 消息 ID
   * @returns 是否删除成功
   */
  static async deleteMessage(id: string): Promise<boolean> {
    const { error } = await client
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除消息失败:', error);
      return false;
    }

    return true;
  }

  /**
   * 批量删除消息
   * @param ids 消息 ID 列表
   * @returns 是否删除成功
   */
  static async deleteMessages(ids: string[]): Promise<boolean> {
    const { error } = await client
      .from('messages')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('批量删除消息失败:', error);
      return false;
    }

    return true;
  }

  /**
   * 发送系统消息
   * @param receiverId 接收者ID
   * @param content 消息内容
   * @param petId 宠物 ID（可选）
   * @returns 创建的消息
   */
  static async sendSystemMessage(
    receiverId: string,
    content: string,
    petId?: string
  ): Promise<Message | null> {
    return this.createMessage({
      sender_id: 'system',
      receiver_id: receiverId,
      content,
      pet_id: petId
    });
  }

  /**
   * 发送申请状态消息
   * @param receiverId 接收者ID
   * @param petName 宠物名称
   * @param status 状态
   * @param petId 宠物 ID（可选）
   * @returns 创建的消息
   */
  static async sendApplicationStatusMessage(
    receiverId: string,
    petName: string,
    status: 'approved' | 'rejected' | 'pending',
    petId?: string
  ): Promise<Message | null> {
    const statusMap = {
      approved: '通过',
      rejected: '拒绝',
      pending: '待审核'
    };

    const content = `您关于宠物${petName}的领养申请状态已更新为${statusMap[status]}。`;

    return this.createMessage({
      sender_id: 'system',
      receiver_id: receiverId,
      content,
      pet_id: petId
    });
  }
}


