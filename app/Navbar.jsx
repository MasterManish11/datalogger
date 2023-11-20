import Link from "next/link";

const Navbar = () => {
  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  // stroke-linecap="round"
                  stroke-linejoin="round"
                  strokewidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/">Dashboard</Link>
              </li>
              <li>
                <Link href="">Report</Link>
                <ul className="p-2">
                  <li>
                    <Link href="/detail">Detail</Link>
                  </li>
                  <li>
                    <Link href="/summary">Summary</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost normal-case text-xl">DataLogger</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Dashboard</Link>
            </li>
            <li>
              <details>
                <summary>Report</summary>
                <ul>
                  <li>
                  <Link href="/detail/energymeter">EnergyMeter Detail Report</Link>
                  </li>
                  <li>
                  <Link href="/summary">Production Detail Report</Link>
                  </li>
                  <li>
                  <Link href="/summary">EnergyMeter Summary Report</Link>
                  </li>
                  <li>
                  <Link href="/summary">Production Summary Report</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button className="btn btn-primary">LogIn</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
