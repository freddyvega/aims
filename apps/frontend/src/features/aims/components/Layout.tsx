"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaRobot,
  FaShieldAlt,
  FaExclamationTriangle,
  FaGavel,
  FaHistory,
} from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "AI Registry", href: "/aims/registry", icon: FaRobot },
  { name: "ISO 42001 Compliance", href: "/aims/compliance", icon: FaShieldAlt },
  { name: "Risk & Mitigations", href: "/aims/risks", icon: FaExclamationTriangle },
  { name: "Governance", href: "/aims/governance", icon: FaGavel },
  { name: "Audit Logs", href: "/aims/audit", icon: FaHistory },
];

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex h-16 items-center px-6 border-b border-gray-200 bg-primary-600">
          <h1 className="text-xl font-bold text-white">AIMS Platform</h1>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-primary-600" : "text-gray-400 group-hover:text-primary-600"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 