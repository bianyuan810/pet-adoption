export type UserRole = 'admin' | 'user'

export type PetGender = 'male' | 'female' | 'unknown'

export type PetStatus = 'available' | 'adopted' | 'pending'

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  email: string
  password: string
  name: string
  phone?: string
  wechat?: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Pet {
  id: string
  publisher_id: string
  name: string
  breed: string
  age: number
  gender: PetGender
  status: PetStatus
  description: string
  location: string
  health_status?: string
  vaccine_status: boolean
  dewormed: boolean
  sterilized: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface PetPhoto {
  id: string
  pet_id: string
  photo_url: string
  is_primary: boolean
  created_at: string
}

export interface Application {
  id: string
  pet_id: string
  applicant_id: string
  publisher_id: string
  status: ApplicationStatus
  message?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  pet_id?: string
  content: string
  is_read: boolean
  created_at: string
}
