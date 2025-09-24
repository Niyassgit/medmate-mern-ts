import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  placeholder: string;
}

const SearchInput = ({
  value,
  onChange,
  delay = 300,
  placeholder = "Search...",
}: Props) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalValue);
    }, delay);

    return () => clearTimeout(handler);
  }, [internalValue, delay, onchange]);

  return (
    <div className="relative w-1xl">
      <Input
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <Search
        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
        size={18}
      />
    </div>
  );
};

export default SearchInput;
