import LoginForm from "@/ui/login/LoginForm";

export default function page() {
  return (
    <div className="w-full max-w-md">
      {/* Header Page Login */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Tripelde Sejahtera Mobilindo</h1>
        <p className="text-gray-500">Rental Mobil Terpercaya Tebet</p>
      </div>

      <LoginForm />

    </div>
  )
}
