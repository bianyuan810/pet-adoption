'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle, Send } from 'lucide-react';
import { HttpStatus } from '@/app/types/api';

// 消息类型定义
interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  is_read: boolean;
  created_at: string;
  pet_id?: string;
  sender: {
    id: string;
    name: string;
    avatar_url?: string;
  } | null;
  receiver: {
    id: string;
    name: string;
    avatar_url?: string;
  } | null;
}

// 聊天会话类型定义
interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // 只在客户端获取用户信息
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);
  
  useEffect(() => {
    // 当用户信息加载完成后处理URL参数
    if (typeof window !== 'undefined' && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const userName = urlParams.get('userName');
      
      if (userId && userName && user.id) {
        // 确定对话ID（两个用户ID的组合，按字母顺序排序）
        const conversationId = [user.id, userId].sort().join('_');
        
        // 创建新对话
        const newConversation: Conversation = {
          id: conversationId,
          userId: userId,
          userName: userName,
          lastMessage: '',
          lastMessageTime: new Date().toLocaleString(),
          unreadCount: 0
        };
        
        // 直接更新状态，确保新对话被添加
        setConversations(prev => {
          // 检查新对话是否已经存在于当前状态中
          const newConversationExists = prev.find(c => c.id === conversationId);
          if (newConversationExists) {
            return prev;
          }
          return [newConversation, ...prev];
        });
        
        // 选择新对话
        setSelectedConversation(newConversation);
        
        // 清除URL参数
        window.history.replaceState({}, document.title, '/messages');
      }
    }
  }, [user]);

  // 获取消息列表并分组为会话
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/messages');
        const data = await response.json();
        
        if (data.code === HttpStatus.OK && data.data) {
          // 处理消息数据
          const allMessages = data.data as Message[];
          
          // 按对话分组
          const conversationsMap = new Map<string, Conversation>();
          
          allMessages.forEach(msg => {
            // 确定对话ID（两个用户ID的组合，按字母顺序排序）
            const currentUserId = user.id;
            const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
            const conversationId = [currentUserId, otherUserId].sort().join('_');
            
            // 计算未读消息数
            const unreadCount = allMessages.filter(m => 
              m.receiver_id === currentUserId && 
              m.sender_id === otherUserId && 
              !m.is_read
            ).length;
            
            // 尝试获取对方用户信息
            let otherUserName = '未知用户';
            let otherUserAvatar = undefined;
            
            // 检查是否有sender信息
            if (msg.sender && msg.sender.id === otherUserId) {
              otherUserName = msg.sender.name || '未知用户';
              otherUserAvatar = msg.sender.avatar_url ? msg.sender.avatar_url.replace(/[`\s\"]/g, '') : undefined;
            }
            
            // 检查是否有receiver信息
            if (msg.receiver && msg.receiver.id === otherUserId) {
              otherUserName = msg.receiver.name || '未知用户';
              otherUserAvatar = msg.receiver.avatar_url ? msg.receiver.avatar_url.replace(/[`\s\"]/g, '') : undefined;
            }
            
            // 更新或创建对话
            const existingConversation = conversationsMap.get(conversationId);
            const messageTime = new Date(msg.created_at).toLocaleString();
            
            if (!existingConversation || new Date(msg.created_at) > new Date(existingConversation.lastMessageTime)) {
              const newConversation = {
                id: conversationId,
                userId: otherUserId,
                userName: otherUserName,
                userAvatar: otherUserAvatar,
                lastMessage: msg.content,
                lastMessageTime: messageTime,
                unreadCount
              };
              
              conversationsMap.set(conversationId, newConversation);
            }
          });
          
          // 转换为数组并按最后消息时间排序
          const sortedConversations = Array.from(conversationsMap.values())
            .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
          
          // 检查是否有通过URL参数创建的新对话
          let finalConversations = sortedConversations;
          
          if (typeof window !== 'undefined' && user) {
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            const userName = urlParams.get('userName');
            
            if (userId && userName && user.id) {
              // 确定对话ID（两个用户ID的组合，按字母顺序排序）
              const conversationId = [user.id, userId].sort().join('_');
              
              // 检查新对话是否已经存在于从API获取的对话列表中
              const newConversationExists = sortedConversations.find(c => c.id === conversationId);
              
              if (!newConversationExists) {
                // 创建新对话
                const newConversation: Conversation = {
                  id: conversationId,
                  userId: userId,
                  userName: userName,
                  lastMessage: '',
                  lastMessageTime: new Date().toLocaleString(),
                  unreadCount: 0
                };
                
                // 将新对话添加到列表顶部
                finalConversations = [newConversation, ...sortedConversations];
              }
            }
          }
          
          // 设置最终的对话列表
          setConversations(finalConversations);
          
          // 只有当没有通过URL参数创建的新对话时，才默认选择第一个对话
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            
            if (!userId && finalConversations.length > 0) {
              // 默认选择第一个对话
              selectConversation(finalConversations[0]);
            }
          } else if (finalConversations.length > 0) {
            // 默认选择第一个对话
            selectConversation(finalConversations[0]);
          }
        }
      } catch (error) {
        console.error('获取消息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 只有当用户信息加载完成后才获取消息列表
    if (user) {
      fetchMessages();
    }
  }, [user]);

  // 选择对话并获取聊天记录
  const selectConversation = async (conversation: Conversation) => {
    try {
      setSelectedConversation(conversation);
      
      // 获取与该用户的聊天记录
        const response = await fetch(`/api/messages?chatId=${conversation.id}`);
        const data = await response.json();
        
        if (data.code === HttpStatus.OK && data.data) {
          // 按时间排序
          const sortedMessages = (data.data as Message[]).sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          setMessages(sortedMessages);
        
        // 标记未读消息为已读
        sortedMessages
          .filter(msg => msg.receiver_id === user.id && !msg.is_read)
          .forEach(async (msg) => {
            try {
              await fetch(`/api/messages/${msg.id}/read`, {
                method: 'PUT'
              });
            } catch (error) {
              console.error('标记消息已读失败:', error);
            }
          });
        
        // 更新会话的未读计数
        setConversations(prev => prev.map(c => 
          c.id === conversation.id ? { ...c, unreadCount: 0 } : c
        ));
      }
    } catch (error) {
      console.error('获取聊天记录失败:', error);
    }
  };

  // 发送消息
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver_id: selectedConversation.userId,
          content: newMessage
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.code === HttpStatus.CREATED && data.data) {
          // 添加新消息到列表
          setMessages(prev => [...prev, data.data as Message]);
          setNewMessage('');
          
          // 更新会话列表
          setConversations(prev => prev.map(c => 
            c.id === selectedConversation.id 
              ? {
                  ...c,
                  lastMessage: newMessage,
                  lastMessageTime: new Date().toLocaleString()
                }
              : c
          ));
        }
      } else {
        const errorData = await response.json();
        alert(`发送消息失败: ${errorData.msg || '请稍后重试'}`);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('发送消息失败，请稍后重试');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-10rem)]">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 flex overflow-hidden h-full">
        {/* Sidebar */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-gray-100 dark:border-white/10 flex flex-col shrink-0">
          <header className="p-6 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">消息中心</h2>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-widest">私信</button>
              <button className="flex-1 py-2 bg-gray-50 dark:bg-white/5 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">通知</button>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
            {isLoading ? (
              // 加载状态
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="w-full flex items-center gap-4 p-5 animate-pulse">
                  <div className="size-12 rounded-2xl bg-gray-200 dark:bg-white/10"></div>
                  <div className="flex-1 text-left">
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => (
                <button 
                  key={conversation.id}
                  onClick={() => selectConversation(conversation)}
                  className={`w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all relative ${selectedConversation?.id === conversation.id ? 'bg-primary/5 dark:bg-primary/10 after:content-[] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-primary' : ''}`}
                >
                  <div className="relative">
                    <div className="size-12 rounded-2xl overflow-hidden shadow-sm">
                      <Image 
                        src={conversation.userAvatar || `https://i.pravatar.cc/150?u=${conversation.userId}`} 
                        width={48} 
                        height={48} 
                        alt={conversation.userName} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{conversation.userName}</h4>
                      <span className="text-[10px] text-gray-400 font-medium">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">{conversation.lastMessage}</p>
                  </div>
                </button>
              ))
            ) : (
              // 无消息状态
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">暂无消息</p>
                  <p className="text-xs text-gray-400 mt-2">当您与其他用户交流时，消息会显示在这里</p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="hidden md:flex flex-1 flex-col bg-[#fdfbfb] dark:bg-zinc-900/50">
          {selectedConversation ? (
            <>
              <header className="px-8 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl overflow-hidden">
                    <Image 
                      src={selectedConversation.userAvatar || `https://i.pravatar.cc/150?u=${selectedConversation.userId}`} 
                      width={40} 
                      height={40} 
                      alt={selectedConversation.userName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{selectedConversation.userName}</h3>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">在线</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                  <MoreHorizontal />
                </button>
              </header>

              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                {messages.length > 0 ? (
                  messages.map((msg, index) => {
                    // 检查是否需要显示日期分隔线
                    const showDate = index === 0 || 
                      new Date(msg.created_at).toDateString() !== new Date(messages[index - 1].created_at).toDateString();
                    
                    // 确定消息方向（ incoming 或 outgoing ）
                    const isIncoming = msg.sender_id === selectedConversation.userId;
                    
                    return (
                      <>
                        {showDate && (
                          <div className="flex justify-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        <div className={`flex items-start gap-4 max-w-lg ${isIncoming ? '' : 'ml-auto flex-row-reverse'}`}>
                          <div className="size-9 rounded-xl overflow-hidden shrink-0">
                            <Image 
                              src={isIncoming 
                                ? ((msg.receiver?.avatar_url || '').replace(/[`\s\"]/g, '') || selectedConversation.userAvatar || `https://i.pravatar.cc/150?u=${selectedConversation.userId}`) 
                                : ((user?.avatar_url || '').replace(/[`\s\"]/g, '') || `https://i.pravatar.cc/150?u=me`)} 
                              width={36} 
                              height={36} 
                              alt={isIncoming ? (msg.receiver?.name || selectedConversation.userName) : (user?.name || 'Me')} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className={`${isIncoming 
                            ? 'bg-white dark:bg-zinc-900 p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-white/10' 
                            : 'bg-primary p-4 rounded-2xl rounded-tr-none shadow-lg shadow-primary/20 text-white'}`}>
                            <p className="text-sm leading-relaxed">
                              {msg.content}
                            </p>
                            <span className="text-[9px] font-medium mt-2 block text-right uppercase">
                              {isIncoming 
                                ? msg.is_read ? '已读' : '未读'
                                : new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              }
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })
                ) : (
                  // 无消息状态
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400">暂无消息</p>
                      <p className="text-xs text-gray-400 mt-2">开始与 {selectedConversation.userName} 交流吧</p>
                    </div>
                  </div>
                )}
              </div>

              <footer className="p-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/10">
                <form className="relative flex gap-3" onSubmit={handleSendMessage}>
                  <button type="button" className="shrink-0 p-2 text-gray-400 hover:text-primary transition-colors">
                    <PlusCircle />
                  </button>
                  <input 
                    type="text" 
                    className="flex-1 bg-gray-50 dark:bg-white/5 border-none rounded-2xl h-11 px-4 focus:ring-2 focus:ring-primary/20 text-sm"
                    placeholder="键入消息..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="shrink-0 bg-primary text-white size-11 rounded-2xl flex items-center justify-center hover:scale-105 transition-all"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </footer>
            </>
          ) : (
            // 未选择对话状态
            <div className="flex-1 flex items-center justify-center bg-[#fdfbfb] dark:bg-zinc-900/50">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">选择一个对话开始交流</p>
                <p className="text-xs text-gray-400 mt-2">从左侧列表中选择一个联系人开始聊天</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
