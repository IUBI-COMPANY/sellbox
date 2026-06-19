// ─── Enum Types ──────────────────────────────────────────────

export type ProfileRole = 'buyer' | 'seller' | 'admin'

export type ProductStatus = 'draft' | 'active' | 'sold_out' | 'archived'

export type VideoStatus = 'processing' | 'ready' | 'error'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

// ─── Database Row Types ──────────────────────────────────────

export interface Profile {
  id: string
  created_at: string
  updated_at: string
  email: string
  full_name: string
  username: string
  avatar_url: string | null
  bio: string | null
  role: ProfileRole
  stripe_customer_id: string | null
  stripe_account_id: string | null
}

export interface Category {
  id: string
  created_at: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  parent_id: string | null
}

export interface Product {
  id: string
  created_at: string
  updated_at: string
  seller_id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  currency: string
  stock: number
  status: ProductStatus
  featured: boolean
}

export interface ProductImage {
  id: string
  created_at: string
  product_id: string
  url: string
  alt: string | null
  position: number
}

export interface Video {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  product_id: string | null
  title: string | null
  description: string | null
  mux_asset_id: string | null
  mux_playback_id: string | null
  mux_upload_id: string | null
  status: VideoStatus
  duration: number | null
  thumbnail_url: string | null
  view_count: number
}

export interface Like {
  id: string
  created_at: string
  user_id: string
  video_id: string
}

export interface Comment {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  video_id: string
  parent_id: string | null
  content: string
}

export interface Follow {
  id: string
  created_at: string
  follower_id: string
  following_id: string
}

export interface Order {
  id: string
  created_at: string
  updated_at: string
  buyer_id: string
  seller_id: string
  status: OrderStatus
  total: number
  currency: string
  shipping_address: Record<string, unknown> | null
  stripe_payment_intent_id: string | null
}

export interface OrderItem {
  id: string
  created_at: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
}

// ─── Insert Types (omit auto-generated fields) ──────────────

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>
export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'slug'>
export type VideoInsert = Omit<Video, 'id' | 'created_at' | 'updated_at' | 'view_count'>
export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'updated_at'>

// ─── Update Types (all fields optional) ─────────────────────

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at' | 'seller_id'>>
export type VideoUpdate = Partial<Omit<Video, 'id' | 'created_at' | 'user_id'>>

// ─── Joined / Extended Types ────────────────────────────────

export interface VideoWithUser extends Video {
  user: Pick<Profile, 'id' | 'username' | 'avatar_url' | 'full_name'>
}

export interface VideoWithProduct extends Video {
  product: Product | null
}

export interface VideoFeed extends Video {
  user: Pick<Profile, 'id' | 'username' | 'avatar_url' | 'full_name'>
  product: (Product & { images: ProductImage[] }) | null
  likes_count: number
  comments_count: number
  is_liked: boolean
}

export interface ProductWithSeller extends Product {
  seller: Pick<Profile, 'id' | 'username' | 'avatar_url' | 'full_name'>
  images: ProductImage[]
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[]
  buyer: Pick<Profile, 'id' | 'username' | 'full_name'>
  seller: Pick<Profile, 'id' | 'username' | 'full_name'>
}
