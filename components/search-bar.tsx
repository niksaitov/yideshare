"use client"

import { Input } from "@/components/ui/input"

export default function SearchBar() {
  return (
    <div className="text-center">
      <Input
        type="search"
        placeholder="Search for a ride"
        className="max-w-md"
      />
    </div>
  )
}
