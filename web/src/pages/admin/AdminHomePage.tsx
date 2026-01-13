import { useAuth } from '../../store/auth/useAuth'

export function AdminHomePage() {
	const { state, signOut } = useAuth()
	return (
		<div className="min-h-screen bg-(--gray-200) text-(--gray-100)">  
			<div className="mx-auto max-w-4xl px-4 py-6">
				<div className="flex items-center justify-between">
					<h1 className="text-lg font-semibold">Admin</h1>
					<button
						className="rounded-md border border-(--gray-500) bg-(--gray-600) px-3 py-2 text-sm font-medium"
						onClick={signOut}
					>
						Sair
					</button>
				</div>
				<p className="mt-4 text-sm text-(--gray-300)">
					Logado como: {state.user?.email}
				</p>
			</div>
		</div>
	)
}
