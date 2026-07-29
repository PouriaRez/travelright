import Link from 'next/link';
import AuthButton from './Authentication/AuthButton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Menu, House, Plane, Target } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="w-full flex justify-between items-center p-5">
      <div className="md:hidden" />
      <div className="text-3xl font-light">TravelRight</div>
      <div className="hidden md:flex justify-around items-center h-full w-full m-5">
        <div
          className="flex justify-center items-center gap-6 text-2xl
                      hover:cursor-pointer "
        >
          <Link href="/">
            <div className=" hover:scale-110 transition-all duration-300">
              Home
            </div>
          </Link>
          <div className=" hover:scale-110 transition-all duration-300">
            Destinations
          </div>
          <div className=" hover:scale-110 transition-all duration-300">
            Mission
          </div>
          <AuthButton />
        </div>
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader className="flex flex-col justify-center items-start">
              <SheetTitle className="text-4xl">TravelRight</SheetTitle>
              <SheetDescription className="text-sm">
                Planning made easy
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col justify-center items-start gap-5 p-6">
              <div className="flex justify-center items-center gap-2">
                <House size={30} />
                <Link href="/">
                  <div className="text-3xl">Home</div>
                </Link>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Plane size={30} />
                <Link href="/">
                  <div className="text-3xl">Destinations</div>
                </Link>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Target size={30} />
                <Link href="/gather/information">
                  <div className="text-3xl">Mission</div>
                </Link>
              </div>
            </div>
            <AuthButton />
            <SheetFooter></SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
