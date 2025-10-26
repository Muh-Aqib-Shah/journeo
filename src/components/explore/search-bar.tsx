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

export default function SearchBar() {
  return (
    <div className="flex py-6">
      <Input
        type="text"
        placeholder="Search a City..."
        className="mr-3 w-[200px] sm:w-[300px] md:w-[350px] lg:w-[450px]"
      />
      <Select>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Duration</SelectLabel>
            <SelectItem value="days">Days</SelectItem>
            <SelectItem value="weeks">Weeks</SelectItem>
            <SelectItem value="months">Months</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
