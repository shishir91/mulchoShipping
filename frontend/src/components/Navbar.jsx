import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Container,
  Divider,
  Typography,
  MenuItem,
  Drawer,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/logo.png";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem as mItem,
  MenuItems,
} from "@headlessui/react";
import {
  UserIcon,
  Bars3Icon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Products", href: "/products", current: true },
  { name: "Orders", href: "/orders", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const { updateAuth, authState } = useAuth();
  const { userInfo: user, token } = authState;

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  const logoutHandler = async () => {
    await updateAuth();
    toast.success("User Logged Out", {
      duration: 1000,
      onAutoClose: () => navigate("/"),
    });
  };

  return (
    <div className="sticky top-0 z-[1000]">
      {user && token ? (
        <Disclosure as="nav" className="bg-blue-200">
          <div className="max-w-8xl px-2 sm:px-6 lg:px-8 ">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block h-6 w-6 group-data-[open]:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden h-6 w-6 group-data-[open]:block"
                  />
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img alt="MulCho" src={logo} className="h-16 w-auto" />
                  <span className=" text-3xl font-bold text-gray-900">
                    MulCho
                  </span>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full cursor-pointer text-gray-400 hover:text-white bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <UserIcon aria-hidden="true" className="h-8 w-auto p-1" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <mItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-200 hover:bg-gray-100"
                      >
                        Your Profile
                      </a>
                    </mItem>
                    {user.isEmailVerified && user.isUserVerified ? (
                      <></>
                    ) : user.status == "underReview" ? (
                      <mItem>
                        <a className="block px-4 py-2 text-sm bg-green-500 text-white-700 ">
                          Your Account Is Under Review. You will be notify soon
                          once its done.
                        </a>
                      </mItem>
                    ) : (
                      <mItem>
                        <a
                          href={
                            user.isEmailVerified
                              ? "/userVerification"
                              : "/emailVerification"
                          }
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-200 hover:bg-gray-100"
                        >
                          Verify your account
                        </a>
                      </mItem>
                    )}
                    <mItem>
                      <a
                        href="/"
                        onClick={logoutHandler}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-200 hover:bg-gray-100"
                      >
                        Log out
                      </a>
                    </mItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                >
                  {item.name}
                </DisclosureButton>
              ))}
              {user.role == "admin" ? (
                <DisclosureButton
                  as="a"
                  href="/payment"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                >
                  Payment
                </DisclosureButton>
              ) : (
                <DisclosureButton
                  as="a"
                  href="/income"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                >
                  My Income
                </DisclosureButton>
              )}
              {user.role == "admin" && (
                <DisclosureButton
                  as="a"
                  href="/users"
                  className="text-gray-800 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                >
                  Users
                </DisclosureButton>
              )}
            </div>
          </DisclosurePanel>
        </Disclosure>
      ) : (
        <AppBar
          position="fixed"
          sx={{
            boxShadow: 0,
            bgcolor: "transparent",
            backgroundImage: "none",
            mt: 2,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar
              variant="regular"
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                borderRadius: "999px",
                bgcolor:
                  theme.palette.mode === "light"
                    ? "rgba(255, 255, 255, 0.4)"
                    : "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(24px)",
                maxHeight: 40,
                border: "1px solid",
                borderColor: "divider",
                boxShadow:
                  theme.palette.mode === "light"
                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                    : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
              })}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  ml: "-18px",
                  px: 0,
                }}
              >
                <div
                  onClick={() => navigate("/")}
                  className="flex items-center cursor-pointer"
                >
                  <img
                    src={logo}
                    className="h-14 w-auto"
                    alt="logo of MulCho"
                  />
                  <span className="text-2xl font-bold text-gray-800">
                    MulCho
                  </span>
                </div>

                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <MenuItem
                    onClick={() => scrollToSection("home")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Home
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => scrollToSection("about")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      About
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => scrollToSection("highlights")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Highlights
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => scrollToSection("contact")}
                    sx={{ py: "6px", px: "12px" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Contact
                    </Typography>
                  </MenuItem>
                </Box>
              </Box>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  component="a"
                  href="/login"
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  component="a"
                  href="/register"
                >
                  Register
                </Button>
              </Box>
              <Box sx={{ display: { sm: "", md: "none" } }}>
                <Button
                  variant="text"
                  color="primary"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ minWidth: "30px", p: "4px" }}
                >
                  <Bars3Icon />
                </Button>
                <Drawer
                  anchor="right"
                  open={open}
                  onClose={toggleDrawer(false)}
                >
                  <Box
                    sx={{
                      minWidth: "60dvw",
                      p: 2,
                      backgroundColor: "background.paper",
                      flexGrow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                        flexGrow: 1,
                      }}
                    ></Box>
                    <MenuItem onClick={() => scrollToSection("home")}>
                      Home
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection("about")}>
                      About
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection("highlights")}>
                      Highlights
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection("contact")}>
                      Contact
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <Link
                        to="/register"
                        color="primary"
                        variant="contained"
                        sx={{ width: "100%" }}
                      >
                        Register
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to="/login"
                        color="primary"
                        variant="outlined"
                        sx={{ width: "100%" }}
                      >
                        Login
                      </Link>
                    </MenuItem>
                  </Box>
                </Drawer>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </div>
  );
}

export default Navbar;
