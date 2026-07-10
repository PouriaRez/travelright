const Navbar = () => {
  return (
    <div className="h-full w-full m-5 flex justify-around items-center">
      <div className="text-3xl font-light">TravelRight</div>
      <div
        className="flex justify-center items-center gap-6 text-2xl
                      hover:cursor-pointer "
      >
        <div className=" hover:scale-110 transition-all duration-300">Home</div>
        <div className=" hover:scale-110 transition-all duration-300">
          Destinations
        </div>
        <div className=" hover:scale-110 transition-all duration-300">
          About us
        </div>
        <div className=" hover:scale-110 transition-all duration-300">
          Mission
        </div>
      </div>
    </div>
  );
};

export default Navbar;
