const Navbar = () => {
  return (
    <div className="h-full w-full flex justify-between items-center">
      <div className="text-3xl font-light">TravelRight</div>
      <div className="flex justify-center items-center gap-6">
        <div className="text-2xl">About us</div>
        <div className="text-2xl">Mission</div>
      </div>
    </div>
  );
};

export default Navbar;
