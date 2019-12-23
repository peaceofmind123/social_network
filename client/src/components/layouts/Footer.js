import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white p-4 mt-3 text-center">
      Copyright &copy; {new Date().getFullYear()} DevSocialPlatform
    </footer>
  );
}
