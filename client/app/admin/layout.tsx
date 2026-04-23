// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/lib/auth-context";
// import {
//   LayoutDashboard,
//   Users,
//   CheckSquare,
//   Activity,
//   LogOut,
//   Sparkles,
//   FileText,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { usePathname } from "next/navigation";

// const NAV_ITEMS = [
//   { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
//   { href: "/admin/influencers", label: "Approvals", icon: CheckSquare },
//   { href: "/admin/users", label: "Users", icon: Users },
//   { href: "/admin/logs", label: "Activity Logs", icon: Activity },
// ];

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, loading, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (!loading && (!user || user.role !== "ADMIN")) {
//       router.push("/login");
//     }
//   }, [user, loading, router]);

//   if (loading || !user || user.role !== "ADMIN") return null;

//   return (
//     <div className="min-h-screen bg-cream flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-ink flex flex-col min-h-screen fixed left-0 top-0">
//         <div className="p-5 border-b border-white/10">
//           <Link
//             href="/"
//             className="flex items-center gap-2 font-bold text-lg text-white"
//           >
//             <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center">
//               <Sparkles size={15} />
//             </div>
//             Influence<span className="text-orange-500">Hub</span>
//           </Link>
//           <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-xl p-2">
//             <div className="w-8 h-8 rounded-lg bg-orange-600/30 flex items-center justify-center text-orange-400 font-bold text-sm">
//               {user.name[0]}
//             </div>
//             <div>
//               <div className="text-white text-sm font-semibold leading-tight">
//                 {user.name}
//               </div>
//               <div className="text-stone-500 text-xs">Administrator</div>
//             </div>
//           </div>
//         </div>

//         <nav className="flex-1 p-4 space-y-1">
//           {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
//             const active = exact
//               ? pathname === href
//               : pathname.startsWith(href);
//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 className={cn(
//                   "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
//                   active
//                     ? "bg-orange-600 text-white"
//                     : "text-stone-400 hover:text-white hover:bg-white/10",
//                 )}
//               >
//                 <Icon size={17} />
//                 {label}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-white/10">
//           <button
//             onClick={logout}
//             className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
//           >
//             <LogOut size={17} /> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 ml-64 min-h-screen">{children}</main>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Activity,
  LogOut,
  Sparkles,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/influencers", label: "Approvals", icon: CheckSquare },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/logs", label: "Activity Logs", icon: Activity },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ink flex flex-col min-h-screen fixed left-0 top-0">
        <div className="p-5 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-white"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center">
              <Sparkles size={15} />
            </div>
            Influence<span className="text-orange-500">Hub</span>
          </Link>
          <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-xl p-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600/30 flex items-center justify-center text-orange-400 font-bold text-sm">
              {user.name[0]}
            </div>
            <div>
              <div className="text-white text-sm font-semibold leading-tight">
                {user.name}
              </div>
              <div className="text-stone-500 text-xs">Administrator</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-orange-600 text-white"
                    : "text-stone-400 hover:text-white hover:bg-white/10",
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
