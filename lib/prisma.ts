import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClient = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaClient
}

// Función helper para detectar errores de prepared statements
function isPreparedStatementError(error: any): boolean {
  return (
    error?.meta?.code === '42P05' ||
    error?.message?.includes('prepared statement') ||
    error?.message?.includes('already exists')
  )
}

// Wrapper que maneja automáticamente errores de prepared statements
async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error: any) {
    if (isPreparedStatementError(error)) {
      // Desconectar y reconectar para limpiar prepared statements
      try {
        await prismaClient.$disconnect()
      } catch {}
      
      // Pequeña pausa para asegurar que la desconexión se complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      try {
        await prismaClient.$connect()
      } catch {}
      
      // Reintentar la operación una vez
      return await operation()
    }
    throw error
  }
}

// Crear un proxy que envuelva todas las operaciones de Prisma
export const prisma = new Proxy(prismaClient, {
  get(target, prop) {
    const value = target[prop as keyof typeof target]
    
    // Si es una función que retorna una Promise, envolverla con retry
    if (typeof value === 'function') {
      const fn = value as (this: typeof target, ...args: any[]) => unknown
      return function (this: unknown, ...args: any[]) {
        const result = fn.apply(target, args)
        if (result instanceof Promise) {
          return withRetry(() => result)
        }
        return result
      }
    }
    
    return value
  }
})
