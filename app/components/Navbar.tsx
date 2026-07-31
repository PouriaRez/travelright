import Link from 'next/link';
import AuthButton from './Authentication/AuthButton';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import {
  Menu,
  House,
  Plane,
  Target,
  NotebookPenIcon,
  type LucideIcon,
} from 'lucide-react';
import { auth } from '../../auth';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: House },
  { label: 'Plan', href: '/gather/information', icon: NotebookPenIcon },
  { label: 'Destinations', href: '/destinations', icon: Plane },
  { label: 'Mission', href: '/mission', icon: Target },
];

const WelcomeUser = ({ name }: { name?: string | null }) => {
  if (!name) return null;
  return (
    <div className="cursor-default text-sm font-medium text-zinc-500 px-4">
      Hi, <span className="text-zinc-800">{name}</span> 👋
    </div>
  );
};

const NavLink = ({
  href,
  label,
  icon: Icon,
  iconSize,
  textClassName,
}: NavItem & { iconSize: number; textClassName: string }) => (
  <Link
    href={href}
    className="group flex items-center gap-2 text-zinc-600 hover:text-zinc-950 transition-colors duration-200"
  >
    <Icon
      size={iconSize}
      className="text-zinc-400 group-hover:text-zinc-900 transition-colors duration-200"
    />
    <span className={textClassName}>{label}</span>
  </Link>
);

const Navbar = async () => {
  const session = await auth();
  const username = session?.user?.name;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
      <div className="w-full flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* spacer for mobile view*/}
        <div className="md:hidden w-6" />

        <div className="text-2xl font-semibold tracking-tight text-zinc-900">
          TravelRight
        </div>

        {/* Desktop nav (md and up) */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                iconSize={18}
                textClassName="text-sm font-medium"
              />
            ))}
          </div>
          <div className="flex items-center gap-3 border-l border-zinc-200 pl-6">
            <WelcomeUser name={username} />
            <AuthButton />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="rounded-md p-1.5 hover:bg-zinc-100 transition-colors">
              <Menu size={22} className="text-zinc-700" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="flex flex-col justify-center items-start border-b border-zinc-100 pb-4">
                <SheetTitle className="text-2xl font-semibold tracking-tight">
                  TravelRight
                </SheetTitle>
                <SheetDescription className="text-sm text-zinc-500">
                  Planning made easy
                </SheetDescription>
              </SheetHeader>

              <div className="border-b border-zinc-100 py-2 px-1">
                <WelcomeUser name={username} />
              </div>

              <div className="flex flex-col gap-4 p-4">
                {NAV_ITEMS.map((item) => (
                  <SheetClose key={item.href}>
                    <NavLink
                      {...item}
                      iconSize={20}
                      textClassName="text-xl font-medium"
                    />
                  </SheetClose>
                ))}
              </div>

              <div className="mt-auto p-2 border-t border-zinc-100">
                <AuthButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
