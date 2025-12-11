export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Car: {
        Row: {
          carId: number
          categoryId: number
          description: string
          engineType: Database["public"]["Enums"]["car_engine_type"]
          fuelType: Database["public"]["Enums"]["car_fuel_type"]
          horsepower: number
          images: string[]
          km: number
          kmPerLiterCity: number
          kmPerLiterHighway: number
          manufacturerId: number
          modelId: number
          price: number
          status: Database["public"]["Enums"]["car_status_type"]
          title: string
          torque: number
          transmissionType: Database["public"]["Enums"]["car_transmission_type"]
          year: number
        }
        Insert: {
          carId?: number
          categoryId: number
          description?: string
          engineType: Database["public"]["Enums"]["car_engine_type"]
          fuelType: Database["public"]["Enums"]["car_fuel_type"]
          horsepower: number
          images: string[]
          km: number
          kmPerLiterCity: number
          kmPerLiterHighway: number
          manufacturerId: number
          modelId: number
          price: number
          status?: Database["public"]["Enums"]["car_status_type"]
          title?: string
          torque: number
          transmissionType: Database["public"]["Enums"]["car_transmission_type"]
          year: number
        }
        Update: {
          carId?: number
          categoryId?: number
          description?: string
          engineType?: Database["public"]["Enums"]["car_engine_type"]
          fuelType?: Database["public"]["Enums"]["car_fuel_type"]
          horsepower?: number
          images?: string[]
          km?: number
          kmPerLiterCity?: number
          kmPerLiterHighway?: number
          manufacturerId?: number
          modelId?: number
          price?: number
          status?: Database["public"]["Enums"]["car_status_type"]
          title?: string
          torque?: number
          transmissionType?: Database["public"]["Enums"]["car_transmission_type"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "Car_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["categoryId"]
          },
          {
            foreignKeyName: "Car_manufacturerId_fkey"
            columns: ["manufacturerId"]
            isOneToOne: false
            referencedRelation: "Manufacturer"
            referencedColumns: ["manufacturerId"]
          },
          {
            foreignKeyName: "public_Car_modelId_fkey"
            columns: ["modelId"]
            isOneToOne: false
            referencedRelation: "CarModel"
            referencedColumns: ["carModelId"]
          },
        ]
      }
      CarModel: {
        Row: {
          carModelId: number
          manufacturerId: number
          name: string
        }
        Insert: {
          carModelId?: number
          manufacturerId: number
          name?: string
        }
        Update: {
          carModelId?: number
          manufacturerId?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_CarModel_manufacturerId_fkey"
            columns: ["manufacturerId"]
            isOneToOne: false
            referencedRelation: "Manufacturer"
            referencedColumns: ["manufacturerId"]
          },
        ]
      }
      CarOrder: {
        Row: {
          carId: number
          createdAt: string
          expiredAt: string | null
          plan: string
          price: number
          sessionId: string
          status: Database["public"]["Enums"]["car_order_status_type"]
          updatedAt: string
          userId: string
        }
        Insert: {
          carId: number
          createdAt?: string
          expiredAt?: string | null
          plan?: string
          price: number
          sessionId?: string
          status?: Database["public"]["Enums"]["car_order_status_type"]
          updatedAt?: string
          userId: string
        }
        Update: {
          carId?: number
          createdAt?: string
          expiredAt?: string | null
          plan?: string
          price?: number
          sessionId?: string
          status?: Database["public"]["Enums"]["car_order_status_type"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "CarOrder_carId_fkey"
            columns: ["carId"]
            isOneToOne: false
            referencedRelation: "Car"
            referencedColumns: ["carId"]
          },
          {
            foreignKeyName: "public_CarOrder_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Category: {
        Row: {
          categoryId: number
          name: string
        }
        Insert: {
          categoryId?: number
          name?: string
        }
        Update: {
          categoryId?: number
          name?: string
        }
        Relationships: []
      }
      Manufacturer: {
        Row: {
          manufacturerId: number
          name: string
        }
        Insert: {
          manufacturerId?: number
          name?: string
        }
        Update: {
          manufacturerId?: number
          name?: string
        }
        Relationships: []
      }
      Payment: {
        Row: {
          amount: number
          carId: number
          country: string
          createdAt: string
          currency: string
          customerEmail: string
          expiredAt: string | null
          method: string
          phone: string
          sessionId: string
          status: Database["public"]["Enums"]["car_payment_status_type"]
          updatedAt: string
          userId: string
        }
        Insert: {
          amount: number
          carId: number
          country?: string
          createdAt?: string
          currency?: string
          customerEmail?: string
          expiredAt?: string | null
          method?: string
          phone?: string
          sessionId?: string
          status?: Database["public"]["Enums"]["car_payment_status_type"]
          updatedAt: string
          userId: string
        }
        Update: {
          amount?: number
          carId?: number
          country?: string
          createdAt?: string
          currency?: string
          customerEmail?: string
          expiredAt?: string | null
          method?: string
          phone?: string
          sessionId?: string
          status?: Database["public"]["Enums"]["car_payment_status_type"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_Payment_carId_userId_fkey"
            columns: ["carId", "userId"]
            isOneToOne: false
            referencedRelation: "CarOrder"
            referencedColumns: ["carId", "userId"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      car_engine_type: "Combustion" | "Electric" | "Hybrid"
      car_fuel_type:
        | "Diesel"
        | "Petrol"
        | "Hydrogen"
        | "Electricity"
        | "LPG"
        | "Methane"
      car_order_status_type: "complete" | "expired" | "open"
      car_payment_status_type: "no_payment_required" | "paid" | "unpaid"
      car_status_type: "Coming soon" | "On sale" | "Sold" | "In process"
      car_transmission_type: "Automatic" | "Manual"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
