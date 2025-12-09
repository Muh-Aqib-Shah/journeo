'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SearchBar({
  onSearchChange,
  onDurationChange,
}: {
  onSearchChange: (value: string) => void;
  onDurationChange: (value: string | null) => void;
}) {
  return (
    <div className="flex py-6">
      <Input
        type="text"
        placeholder="Search a City..."
        className="mr-3 w-[200px] sm:w-[300px] md:w-[350px] lg:w-[450px]"
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select onValueChange={(value) => onDurationChange(value)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Duration</SelectLabel>
            <SelectItem value="5"> 05 Days</SelectItem>
            <SelectItem value="10"> 10 Days</SelectItem>
            <SelectItem value="15"> 15 Days</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
