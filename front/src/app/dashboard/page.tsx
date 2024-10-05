import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LinodeVpnSetup } from "@/components/linode-vpn-setup"

export default async function Dashboard() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    return (
        <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
            <LinodeVpnSetup />
        </div>
    )
}