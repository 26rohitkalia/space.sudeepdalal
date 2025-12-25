import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-gray-500 mt-2">Sign in to manage your portfolio.</p>
        </div>

        <form action={login} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm placeholder-gray-400"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition shadow-lg transform active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        {params.error && (
          <div className="mt-6 text-center text-sm text-red-500">
            {params.error}
          </div>
        )}
      </div>
    </div>
  )
}