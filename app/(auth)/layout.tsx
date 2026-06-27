export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black px-4 py-12">
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  )
}
